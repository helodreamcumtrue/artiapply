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
