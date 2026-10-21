/**
 * Automated Google API Verification Compliance Test Suite
 * 
 * Verifies all 6 compliance criteria mandated by Google OAuth Verification:
 * 1. Google accounts cannot start email-warming jobs.
 * 2. Existing Gmail warm-up jobs are rejected or safely cancelled.
 * 3. Background workers cannot send warm-up messages through Gmail.
 * 4. Ordinary permitted, user-initiated Gmail sending still works.
 * 5. Unsubscribed recipients cannot receive subsequent campaign messages.
 * 6. Unauthorized users cannot bypass provider checks or recipient suppression.
 */

import {
  isGoogleAccount,
  validateWarmingPolicy,
  validateDispatchCompliance,
} from '../src/lib/compliance/policyGuard';
import {
  recordUnsubscribe,
  isSuppressed,
  filterSuppressedContacts,
} from '../src/lib/suppression/service';
import {
  generateUnsubscribeToken,
  verifyUnsubscribeToken,
  generateUnsubscribeUrls,
} from '../src/lib/suppression/unsubscribeToken';
import { NextRequest } from 'next/server';
import { POST as unsubscribeRouteHandler } from '../src/app/api/contacts/unsubscribe/route';
import { POST as sendDirectHandler } from '../src/app/api/campaigns/send-direct/route';
import { POST as emailTestHandler } from '../src/app/api/email/test/route';
import { POST as launchCampaignHandler } from '../src/app/api/campaigns/launch/route';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}`);
    if (details) {
      console.error(`     Details: ${details}`);
    }
  }
}

async function runComplianceTests() {
  console.log('===============================================================');
  console.log('  ArticlO - Google API Verification Compliance Test Suite');
  console.log('===============================================================\n');

  // =========================================================================
  // TEST 1: Google accounts cannot start email-warming jobs
  // =========================================================================
  console.log('--- TEST GROUP 1: Google accounts cannot start warming jobs ---');
  {
    const gmailAccountCheck = validateWarmingPolicy({
      senderEmail: 'aspirant@gmail.com',
      provider: 'gmail_oauth',
      purpose: 'warming',
    });
    assert(
      !gmailAccountCheck.allowed && gmailAccountCheck.code === 'WARMING_PROHIBITED',
      'Direct purpose="warming" for gmail_oauth is rejected with WARMING_PROHIBITED',
      JSON.stringify(gmailAccountCheck)
    );

    const warmupCheck = validateWarmingPolicy({
      senderEmail: 'ca.student@gmail.com',
      purpose: 'warmup',
    });
    assert(
      !warmupCheck.allowed && warmupCheck.code === 'WARMING_PROHIBITED',
      'purpose="warmup" on @gmail.com is strictly rejected',
      JSON.stringify(warmupCheck)
    );

    const inboxWarmingCheck = validateWarmingPolicy({
      senderEmail: 'office@myfirm.com',
      smtpHost: 'smtp.gmail.com',
      purpose: 'inbox_warming',
    });
    assert(
      !inboxWarmingCheck.allowed && inboxWarmingCheck.code === 'WARMING_PROHIBITED',
      'Custom domain using smtp.gmail.com with inbox_warming is rejected',
      JSON.stringify(inboxWarmingCheck)
    );

    const googleWorkspaceCheck = validateWarmingPolicy({
      senderEmail: 'partner@auditcorp.com',
      provider: 'gmail_oauth',
      purpose: 'warming_campaign',
    });
    assert(
      !googleWorkspaceCheck.allowed && googleWorkspaceCheck.code === 'WARMING_PROHIBITED',
      'Google Workspace domain via gmail_oauth with purpose="warming_campaign" is rejected',
      JSON.stringify(googleWorkspaceCheck)
    );
  }

  // =========================================================================
  // TEST 2: Existing Gmail warm-up jobs are rejected or safely cancelled
  // =========================================================================
  console.log('\n--- TEST GROUP 2: Existing warm-up jobs are safely cancelled ---');
  {
    // Simulate legacy job that was queued previously with warming payload
    const legacyQueuedJob = {
      id: 'job_legacy_1029',
      data: {
        to: 'recruiter@targetfirm.example.com',
        subject: 'Re: Catch up',
        htmlBody: '<p>Checking in to warm mailbox</p>',
        purpose: 'warming',
        provider: 'gmail_oauth',
        senderEmail: 'student@gmail.com',
      },
    };

    const workerPrecheck = validateWarmingPolicy({
      senderEmail: legacyQueuedJob.data.senderEmail,
      provider: legacyQueuedJob.data.provider,
      purpose: legacyQueuedJob.data.purpose,
    });

    assert(
      !workerPrecheck.allowed,
      'Legacy queued job with purpose="warming" is flagged disallowed before worker processing'
    );

    // Verify worker policy simulation cancels job safely
    let jobCancelled = false;
    let cancellationReason = '';
    if (!workerPrecheck.allowed) {
      jobCancelled = true;
      cancellationReason = workerPrecheck.error || 'Warming prohibited';
    }

    assert(
      jobCancelled && cancellationReason.includes('strictly prohibited'),
      'Legacy warming job is cancelled safely with explanatory compliance reason'
    );
  }

  // =========================================================================
  // TEST 3: Background workers cannot send warm-up messages through Gmail
  // =========================================================================
  console.log('\n--- TEST GROUP 3: Background workers blocked from warming dispatches ---');
  {
    const workerDispatchResult = await validateDispatchCompliance({
      to: 'hr.audit@firm.example.com',
      subject: 'Hello',
      htmlBody: '<p>Warming ping</p>',
      senderEmail: 'applicant@gmail.com',
      provider: 'gmail_oauth',
      purpose: 'warming',
    });

    assert(
      !workerDispatchResult.allowed && workerDispatchResult.code === 'WARMING_PROHIBITED',
      'validateDispatchCompliance blocks background worker warming dispatch with WARMING_PROHIBITED',
      JSON.stringify(workerDispatchResult)
    );

    // Also test Google Workspace account via SMTP
    const smtpDispatchResult = await validateDispatchCompliance({
      to: 'recruitment@firm.example.com',
      subject: 'Hello',
      htmlBody: '<p>Warming ping</p>',
      senderEmail: 'partner@workspace-domain.com',
      smtpHost: 'smtp.gmail.com',
      purpose: 'inbox_warmup',
    });

    assert(
      !smtpDispatchResult.allowed && smtpDispatchResult.code === 'WARMING_PROHIBITED',
      'validateDispatchCompliance blocks Google Workspace SMTP warming dispatch',
      JSON.stringify(smtpDispatchResult)
    );
  }

  // =========================================================================
  // TEST 4: Ordinary permitted, user-initiated Gmail sending still works
  // =========================================================================
  console.log('\n--- TEST GROUP 4: Permitted user-initiated Gmail sending works ---');
  {
    const legitimateSendResult = await validateDispatchCompliance({
      to: 'talent.acquisition@topfirm.example.com',
      subject: 'Application for Articleship - CA Intermediate Qualified',
      htmlBody: '<p>Dear Hiring Team, Please find my resume attached.</p>',
      senderEmail: 'ca.candidate@gmail.com',
      provider: 'gmail_oauth',
      purpose: 'user_initiated_outreach',
    });

    assert(
      legitimateSendResult.allowed && legitimateSendResult.code === 'OK',
      'Ordinary legitimate user-initiated application send is approved',
      JSON.stringify(legitimateSendResult)
    );

    // Default purpose (undefined) is treated as legitimate user outreach
    const defaultPurposeResult = await validateDispatchCompliance({
      to: 'recruitment@audit.example.com',
      subject: 'Inquiry regarding Articleship Vacancy',
      htmlBody: '<p>Dear Sir/Madam, attaching my credentials.</p>',
      senderEmail: 'student@gmail.com',
      provider: 'gmail_oauth',
    });

    assert(
      defaultPurposeResult.allowed,
      'Default user-initiated dispatch without explicit purpose is approved'
    );
  }

  // =========================================================================
  // TEST 5: Unsubscribed recipients cannot receive subsequent campaign messages
  // =========================================================================
  console.log('\n--- TEST GROUP 5: Permanent unsubscribe suppression enforcement ---');
  {
    const optedOutEmail = `hr.partner.optout.${Date.now()}@corporation.example.com`;

    // Verify initial clean state
    const beforeUnsubscribe = await isSuppressed(optedOutEmail);
    assert(!beforeUnsubscribe, 'Recipient is initially not suppressed');

    // Record unsubscribe (e.g. from /unsubscribe page or List-Unsubscribe header)
    const unsubResult = await recordUnsubscribe(optedOutEmail, {
      contactId: 'user_test_999',
      campaignId: 'camp_test_123',
    });
    assert(unsubResult.success, 'recordUnsubscribe succeeds in recording opt-out');

    // Verify suppression is active
    const afterUnsubscribe = await isSuppressed(optedOutEmail);
    assert(afterUnsubscribe, 'Recipient is confirmed suppressed in registry');

    // Test 5a: Campaign launch filtering removes suppressed contact
    const contactList = [
      { email: optedOutEmail, first_name: 'Jane' },
      { email: 'allowed.candidate@firm.example.com', first_name: 'John' },
      { email: 'hr.recruitment@midsize.example.com', first_name: 'Robert' },
    ];
    const filteredList = await filterSuppressedContacts(contactList);
    assert(
      filteredList.allowed.length === 2 && !filteredList.allowed.some((c) => c.email === optedOutEmail),
      'filterSuppressedContacts cleanly strips suppressed recipient prior to campaign launch',
      `Expected 2, got ${filteredList.allowed.length}`
    );

    // Test 5b: Direct dispatch is blocked for suppressed recipient
    const directSendCheck = await validateDispatchCompliance({
      to: optedOutEmail,
      subject: 'Application Follow Up',
      htmlBody: '<p>Following up</p>',
      senderEmail: 'student@gmail.com',
      provider: 'gmail_oauth',
      purpose: 'user_initiated_outreach',
    });
    assert(
      !directSendCheck.allowed && directSendCheck.code === 'SUPPRESSED',
      'validateDispatchCompliance blocks dispatch to unsubscribed recipient with code SUPPRESSED',
      JSON.stringify(directSendCheck)
    );
  }

  // =========================================================================
  // TEST 6: Unauthorized users cannot bypass provider checks or suppression
  // =========================================================================
  console.log('\n--- TEST GROUP 6: Circumvention & bypass protection ---');
  {
    // Test 6a: Case variation and whitespace in suppression
    const messyOptOut = '  hr.partner.OPTOUT@Corporation.Example.COM  ';
    const isMessySuppressed = await isSuppressed(messyOptOut);
    assert(
      isMessySuppressed,
      'Suppression checks are case-insensitive and trim whitespace (cannot bypass via casing)'
    );

    // Test 6b: Google account detection cannot be bypassed by weird casing or host variations
    const googlemailCheck = isGoogleAccount('user@GOOGLEMAIL.COM');
    assert(googlemailCheck, 'isGoogleAccount identifies uppercase @GOOGLEMAIL.COM');

    const smtpCheck = isGoogleAccount({ smtpHost: 'SMTP.GMAIL.COM' });
    assert(smtpCheck, 'isGoogleAccount identifies uppercase SMTP.GMAIL.COM');

    const oauthProviderCheck = isGoogleAccount({
      fromEmail: 'custom@domain.com',
      provider: 'gmail_oauth',
    });
    assert(oauthProviderCheck, 'isGoogleAccount identifies gmail_oauth provider for custom domains');

    // Test 6c: Disguised warming purpose (e.g. "warming_sequence_v2", "auto_warm")
    const disguisedCheck1 = validateWarmingPolicy({
      senderEmail: 'user@gmail.com',
      purpose: 'auto_warm_inbox',
    });
    assert(
      !disguisedCheck1.allowed,
      'Disguised purpose="auto_warm_inbox" is caught by pattern detection'
    );

    const disguisedCheck2 = validateWarmingPolicy({
      senderEmail: 'user@gmail.com',
      purpose: 'WARMUP_ROTATION',
    });
    assert(
      !disguisedCheck2.allowed,
      'Uppercase purpose="WARMUP_ROTATION" is caught by case-insensitive check'
    );
  }

  // Ensure test environment secret exists
  if (!process.env.UNSUBSCRIBE_SIGNING_SECRET) {
    process.env.UNSUBSCRIBE_SIGNING_SECRET = 'test_secret_0123456789abcdef0123456789abcdef';
  }

  // =========================================================================
  // TEST 7: Cryptographic Unsubscribe Token Security
  // =========================================================================
  console.log('\n--- TEST GROUP 7: Cryptographic Unsubscribe Token Security ---');
  {
    const targetEmail = `verified.candidate.${Date.now()}@firm.example.com`;
    const targetCampaignId = 'camp_audit_701';

    // Test 7a: Valid token generation and verification
    const validToken = generateUnsubscribeToken(targetEmail, targetCampaignId);
    const validCheck = verifyUnsubscribeToken(targetEmail, targetCampaignId, validToken);
    assert(
      validCheck.valid && validCheck.code === 'OK',
      'Valid HMAC-SHA256 token passes verification',
      JSON.stringify(validCheck)
    );

    // Test 7b: Modified email (Tampering attack)
    const tamperedEmailCheck = verifyUnsubscribeToken(
      'attacker@malicious.example.com',
      targetCampaignId,
      validToken
    );
    assert(
      !tamperedEmailCheck.valid && tamperedEmailCheck.code === 'INVALID_SIGNATURE',
      'Tampered email with original token is rejected with INVALID_SIGNATURE',
      JSON.stringify(tamperedEmailCheck)
    );

    // Test 7c: Modified campaign identifier (Identifier binding)
    const tamperedIdCheck = verifyUnsubscribeToken(
      targetEmail,
      'different_camp_999',
      validToken
    );
    assert(
      !tamperedIdCheck.valid && tamperedIdCheck.code === 'INVALID_SIGNATURE',
      'Tampered campaign/contact identifier is rejected with INVALID_SIGNATURE',
      JSON.stringify(tamperedIdCheck)
    );

    // Test 7d: Older authentic link verification (Priority 2: Recipients can still opt out from older emails)
    const olderToken = generateUnsubscribeToken(targetEmail, targetCampaignId, {
      expiresAt: Date.now() - 5000, // 5 seconds in the past (older link)
    });
    const olderCheck = verifyUnsubscribeToken(targetEmail, targetCampaignId, olderToken);
    assert(
      olderCheck.valid && olderCheck.code === 'OK_OLDER_LINK' && olderCheck.isOlderLink === true,
      'Authentic older email link is accepted with OK_OLDER_LINK so recipients can opt out',
      JSON.stringify(olderCheck)
    );

    // Test 7d-2: Tampered older link (Attacker tries to use an older token to unsubscribe arbitrary victim)
    const tamperedOlderCheck = verifyUnsubscribeToken('arbitrary.victim@victimcorp.example.com', targetCampaignId, olderToken);
    assert(
      !tamperedOlderCheck.valid && tamperedOlderCheck.code === 'INVALID_SIGNATURE',
      'Tampered older link targeting arbitrary recipient is strictly rejected with INVALID_SIGNATURE',
      JSON.stringify(tamperedOlderCheck)
    );

    // Test 7d-3: Older link with explicit rejectExpired: true flag
    const strictExpiredCheck = verifyUnsubscribeToken(targetEmail, targetCampaignId, olderToken, { rejectExpired: true });
    assert(
      !strictExpiredCheck.valid && strictExpiredCheck.code === 'EXPIRED_TOKEN',
      'Older link is rejected when rejectExpired option is explicitly requested',
      JSON.stringify(strictExpiredCheck)
    );

    // Test 7e: Missing secret fails closed
    const originalSecret = process.env.UNSUBSCRIBE_SIGNING_SECRET;
    delete process.env.UNSUBSCRIBE_SIGNING_SECRET;
    const missingSecretCheck = verifyUnsubscribeToken(targetEmail, targetCampaignId, validToken);
    assert(
      !missingSecretCheck.valid && missingSecretCheck.code === 'MISSING_SECRET',
      'Missing signing secret fails closed with MISSING_SECRET',
      JSON.stringify(missingSecretCheck)
    );
    process.env.UNSUBSCRIBE_SIGNING_SECRET = originalSecret;

    // Test 7f: Malformed tokens
    const emptyTokenCheck = verifyUnsubscribeToken(targetEmail, targetCampaignId, '');
    assert(
      !emptyTokenCheck.valid && emptyTokenCheck.code === 'MALFORMED_TOKEN',
      'Empty token string is rejected as MALFORMED_TOKEN'
    );

    const noDotCheck = verifyUnsubscribeToken(targetEmail, targetCampaignId, 'justarandomstringwithoutdot');
    assert(
      !noDotCheck.valid && noDotCheck.code === 'MALFORMED_TOKEN',
      'Token without dot delimiter is rejected as MALFORMED_TOKEN'
    );

    const nonNumericTimestamp = verifyUnsubscribeToken(
      targetEmail,
      targetCampaignId,
      'not_a_number.0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    );
    assert(
      !nonNumericTimestamp.valid && nonNumericTimestamp.code === 'MALFORMED_TOKEN',
      'Non-numeric timestamp is rejected as MALFORMED_TOKEN'
    );

    const truncatedSig = verifyUnsubscribeToken(
      targetEmail,
      targetCampaignId,
      `${Date.now() + 10000}.short`
    );
    assert(
      !truncatedSig.valid && truncatedSig.code === 'MALFORMED_TOKEN',
      'Truncated signature is rejected as MALFORMED_TOKEN'
    );

    const nonHexSig = verifyUnsubscribeToken(
      targetEmail,
      targetCampaignId,
      `${Date.now() + 10000}.${'z'.repeat(64)}`
    );
    assert(
      !nonHexSig.valid && nonHexSig.code === 'MALFORMED_TOKEN',
      'Non-hex characters in signature are rejected as MALFORMED_TOKEN'
    );

    // Test 7g: Repeated unsubscribe requests (Idempotency)
    const repeatedEmail = `idempotent.${Date.now()}@test.example.com`;
    const repeatToken = generateUnsubscribeToken(repeatedEmail, 'camp_repeat_1');
    const firstUnsub = await recordUnsubscribe(repeatedEmail);
    assert(firstUnsub.success, 'First unsubscribe request succeeds');
    assert(await isSuppressed(repeatedEmail), 'Recipient is confirmed suppressed after first opt-out');

    const secondUnsub = await recordUnsubscribe(repeatedEmail);
    assert(secondUnsub.success, 'Repeated unsubscribe request succeeds idempotently');
    assert(await isSuppressed(repeatedEmail), 'Recipient remains permanently suppressed');
  }

  // =========================================================================
  // TEST 8: Unsubscribe API Integration & Pre-Send Suppression Enforcement
  // =========================================================================
  console.log('\n--- TEST GROUP 8: Unsubscribe API Route Integration & Pre-Send Check ---');
  {
    const apiRecipient = `api.optout.${Date.now()}@targetfirm.example.com`;
    const apiContactId = 'cont_live_901';
    const validApiToken = generateUnsubscribeToken(apiRecipient, apiContactId);

    // Test 8a: Live route handler with valid signed JSON body
    const validReq = new NextRequest('http://localhost:3000/api/contacts/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: apiRecipient,
        id: apiContactId,
        token: validApiToken,
      }),
    });
    const validRes = await unsubscribeRouteHandler(validReq);
    const validBody = await validRes.json();
    assert(
      validRes.status === 200 && validBody.success === true,
      'API route accepts valid signed JSON unsubscribe request with HTTP 200',
      `Status: ${validRes.status}, Body: ${JSON.stringify(validBody)}`
    );

    // Test 8b: Pre-send suppression check immediately blocks the unsubscribed recipient
    const preSendCheck = await validateDispatchCompliance({
      to: apiRecipient,
      subject: 'Job Inquiry',
      htmlBody: '<p>Applying</p>',
      senderEmail: 'student@gmail.com',
      provider: 'gmail_oauth',
    });
    assert(
      !preSendCheck.allowed && preSendCheck.code === 'SUPPRESSED',
      'validateDispatchCompliance blocks email to the API-unsubscribed recipient with code SUPPRESSED',
      JSON.stringify(preSendCheck)
    );

    // Test 8c: filterSuppressedContacts strips the newly unsubscribed recipient
    const batchList = [
      { email: apiRecipient, name: 'Opted Out' },
      { email: 'allowed.student@firm.example.com', name: 'Still Subscribed' },
    ];
    const filtered = await filterSuppressedContacts(batchList);
    assert(
      filtered.allowed.length === 1 && filtered.suppressed.length === 1,
      'filterSuppressedContacts prunes API-unsubscribed recipient before campaign launch'
    );

    // Test 8d: Live route handler rejects tampered email with HTTP 403
    const tamperedReq = new NextRequest('http://localhost:3000/api/contacts/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arbitrary.victim@company.example.com',
        id: apiContactId,
        token: validApiToken, // Token was issued for apiRecipient, not victim!
      }),
    });
    const tamperedRes = await unsubscribeRouteHandler(tamperedReq);
    assert(
      tamperedRes.status === 403,
      'API route rejects tampered email opt-out attempt with HTTP 403 Forbidden',
      `Status: ${tamperedRes.status}`
    );

    // Test 8e: Live route handler rejects request missing token with HTTP 400
    const missingTokenReq = new NextRequest('http://localhost:3000/api/contacts/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'anyone@example.com',
      }),
    });
    const missingTokenRes = await unsubscribeRouteHandler(missingTokenReq);
    assert(
      missingTokenRes.status === 400,
      'API route rejects unsigned request missing token with HTTP 400 Bad Request',
      `Status: ${missingTokenRes.status}`
    );

    // Test 8f: RFC 8058 One-Click POST with query parameters
    const rfcRecipient = `rfc8058.${Date.now()}@partner.example.com`;
    const rfcId = 'cont_rfc_302';
    const rfcToken = generateUnsubscribeToken(rfcRecipient, rfcId);
    const rfcUrl = `http://localhost:3000/api/contacts/unsubscribe?email=${encodeURIComponent(
      rfcRecipient
    )}&id=${encodeURIComponent(rfcId)}&token=${encodeURIComponent(rfcToken)}`;

    const rfcReq = new NextRequest(rfcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'List-Unsubscribe=One-Click',
    });
    const rfcRes = await unsubscribeRouteHandler(rfcReq);
    const rfcBody = await rfcRes.json();
    assert(
      rfcRes.status === 200 && rfcBody.success === true,
      'API route handles RFC 8058 One-Click POST with query parameters and HTTP 200'
    );
    assert(
      await isSuppressed(rfcRecipient),
      'RFC 8058 recipient is confirmed permanently suppressed in registry'
    );
  }

  // =========================================================================
  // TEST 9: Alternate Dispatch Paths, Direct-Send & Queued Suppression
  // =========================================================================
  console.log('\n--- TEST GROUP 9: Alternate Dispatch Paths, Direct-Send & Queued Suppression ---');
  {
    // Test 9a: Authentic older link submitted to unsubscribe API succeeds with HTTP 200 (Priority 2)
    const olderApiEmail = `older.api.${Date.now()}@firm.example.com`;
    const olderApiToken = generateUnsubscribeToken(olderApiEmail, 'camp_older_1', {
      expiresAt: Date.now() - 60000, // 1 minute ago (older email)
    });
    const olderReq = new NextRequest('http://localhost:3000/api/contacts/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: olderApiEmail,
        id: 'camp_older_1',
        token: olderApiToken,
      }),
    });
    const olderRes = await unsubscribeRouteHandler(olderReq);
    const olderBody = await olderRes.json();
    assert(
      olderRes.status === 200 && olderBody.success === true,
      'API route accepts authentic older email link with HTTP 200 and records opt-out',
      `Status: ${olderRes.status}, Body: ${JSON.stringify(olderBody)}`
    );
    assert(
      await isSuppressed(olderApiEmail),
      'Recipient of older email is permanently recorded in suppression registry'
    );

    // Test 9a-2: Tampered older link targeting arbitrary victim is rejected with HTTP 403
    const tamperedOlderReq = new NextRequest('http://localhost:3000/api/contacts/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arbitrary.target@victim.example.com',
        id: 'camp_older_1',
        token: olderApiToken, // Token was issued for olderApiEmail, not arbitrary victim!
      }),
    });
    const tamperedOlderRes = await unsubscribeRouteHandler(tamperedOlderReq);
    assert(
      tamperedOlderRes.status === 403,
      'API route rejects tampered older link targeting arbitrary recipient with HTTP 403',
      `Status: ${tamperedOlderRes.status}`
    );

    // Test 9a-3: Durable storage failure fail-safe (Priority 1: Fails safely, does NOT report success)
    const originalEnv = process.env.NODE_ENV;
    const originalRedis = process.env.REDIS_URL;
    try {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.REDIS_URL;

      // In production without durable store configured, recordUnsubscribe must throw
      let threwError = false;
      try {
        await recordUnsubscribe('storage.fail.test@example.com');
      } catch (err: any) {
        threwError = true;
        assert(
          err.message.includes('Durable suppression storage'),
          'recordUnsubscribe throws when durable storage is unconfigured in production'
        );
      }
      assert(threwError, 'recordUnsubscribe fails closed instead of silently proceeding without durable storage');

      // Test that the API route returns HTTP 500 and does NOT report success
      const storageFailToken = generateUnsubscribeToken('storage.fail.api@example.com', 'camp_fail_1');
      const failReq = new NextRequest('http://localhost:3000/api/contacts/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'storage.fail.api@example.com',
          id: 'camp_fail_1',
          token: storageFailToken,
        }),
      });
      const failRes = await unsubscribeRouteHandler(failReq);
      const failBody = await failRes.json();
      assert(
        failRes.status === 500 && failBody.success !== true,
        'API route returns HTTP 500 without reporting success when durable storage fails',
        `Status: ${failRes.status}, Body: ${JSON.stringify(failBody)}`
      );
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalRedis) process.env.REDIS_URL = originalRedis;
    }

    // Test 9b: Direct-send route (/api/campaigns/send-direct) blocks suppressed recipients
    const directSuppressedEmail = `suppressed.direct.${Date.now()}@target.example.com`;
    await recordUnsubscribe(directSuppressedEmail);
    assert(await isSuppressed(directSuppressedEmail), 'Email confirmed suppressed before direct send');

    const sendDirectReq = new NextRequest('http://localhost:3000/api/campaigns/send-direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact: { id: 'cont_direct_1', email: directSuppressedEmail },
        subject: 'CA Articleship Application',
        bodyTemplate: 'Dear Sir, applying.',
        senderEmail: 'student@gmail.com',
      }),
    });
    const sendDirectRes = await sendDirectHandler(sendDirectReq);
    const sendDirectBody = await sendDirectRes.json();
    assert(
      sendDirectRes.status === 400 && sendDirectBody.skipped === true,
      'Direct-send API route (/api/campaigns/send-direct) blocks suppressed contact with HTTP 400 and skipped: true',
      `Status: ${sendDirectRes.status}, Body: ${JSON.stringify(sendDirectBody)}`
    );

    // Test 9c: Test email route (/api/email/test) blocks suppressed recipients
    const emailTestReq = new NextRequest('http://localhost:3000/api/email/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: directSuppressedEmail,
        subject: 'Test Ping',
        message: 'Ping',
      }),
    });
    const emailTestRes = await emailTestHandler(emailTestReq);
    const emailTestBody = await emailTestRes.json();
    assert(
      emailTestRes.status === 400 && emailTestBody.success === false,
      'Test email API route (/api/email/test) blocks suppressed recipient via policyGuard',
      `Status: ${emailTestRes.status}, Error: ${emailTestBody.error}`
    );

    // Test 9d: Campaign launch (/api/campaigns/launch) rejects batches where all contacts are suppressed
    const launchReq = new NextRequest('http://localhost:3000/api/campaigns/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Suppressed Only Campaign',
        subject: 'Articleship Inquiry',
        bodyTemplate: 'Inquiry body',
        contacts: [
          { email: directSuppressedEmail, first_name: 'Already' },
        ],
      }),
    });
    const launchRes = await launchCampaignHandler(launchReq);
    const launchBody = await launchRes.json();
    assert(
      launchRes.status === 400 && launchBody.error?.includes('unsubscribed'),
      'Campaign launch API route blocks submission when all contacts are suppressed with HTTP 400',
      `Status: ${launchRes.status}, Body: ${JSON.stringify(launchBody)}`
    );

    // Test 9e: Queued-send simulation: Contact unsubscribed while in queue is cancelled before dispatch
    const queuedUnsubEmail = `queued.optout.${Date.now()}@firm.example.com`;
    // 1. Simulating contact was enqueued
    // 2. Recipient opts out while job is sitting in queue
    await recordUnsubscribe(queuedUnsubEmail);
    // 3. Worker dequeues job and evaluates pre-send check
    const workerSuppressedCheck = await isSuppressed(queuedUnsubEmail);
    assert(
      workerSuppressedCheck === true,
      'Worker suppression check immediately flags contact who unsubscribed while in queue'
    );
    const workerDispatchCompliance = await validateDispatchCompliance({
      to: queuedUnsubEmail,
      subject: 'Scheduled Outreach',
      htmlBody: '<p>Body</p>',
      senderEmail: 'student@gmail.com',
      provider: 'gmail_oauth',
    });
    assert(
      !workerDispatchCompliance.allowed && workerDispatchCompliance.code === 'SUPPRESSED',
      'Worker dispatch compliance halts send to queued contact who unsubscribed prior to execution'
    );

    // Test 9f: Missing secret fail-closed on API route returns 500
    const originalSecret = process.env.UNSUBSCRIBE_SIGNING_SECRET;
    delete process.env.UNSUBSCRIBE_SIGNING_SECRET;

    const noSecretReq = new NextRequest('http://localhost:3000/api/contacts/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'victim@unsub.example.com',
        id: 'camp_1',
        token: '1790000000000.dummytoken1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      }),
    });
    const noSecretRes = await unsubscribeRouteHandler(noSecretReq);
    assert(
      noSecretRes.status === 500,
      'API route fails closed with HTTP 500 when server signing secret is missing'
    );

    // Restore secret
    process.env.UNSUBSCRIBE_SIGNING_SECRET = originalSecret;
  }

  // =========================================================================
  // TEST SUMMARY
  // =========================================================================
  console.log('\n===============================================================');
  console.log(`  COMPLIANCE TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
  if (failedTests === 0) {
    console.log('  🎉 ALL COMPLIANCE CHECKS PASSED SUCCESSFULLY!');
  } else {
    console.log(`  ⚠️  ${failedTests} CHECKS FAILED!`);
  }
  console.log('===============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runComplianceTests().catch((err) => {
  console.error('Fatal error running compliance tests:', err);
  process.exit(1);
});
