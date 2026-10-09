export interface EmailTemplate {
  id: string;
  name: string;
  category: 'sales' | 'job_application' | 'executive' | 'investor' | 'partnership' | 'agency' | 'followup';
  categoryLabel: string;
  description: string;
  subject: string;
  body: string;
  tags: string[];
  recommendedAttachments?: string;
  badge?: string;
}

export const PROFESSIONAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'job-application-pitch',
    name: 'Job Application & Portfolio Pitch',
    category: 'job_application',
    categoryLabel: 'Job Search & Careers',
    description: 'High-response pitch to hiring managers, founders, or recruiters with resume & portfolio attached.',
    subject: 'Application for {{role}} role at {{company}} — {{first_name}}, meet candidate',
    body: `Hi {{first_name}},

I've been following {{company}}'s recent growth and was really impressed by your team's mission. I am reaching out directly because I'm very interested in contributing as a {{role}}.

Over the past few years, I have specialized in building high-impact solutions, optimizing workflows, and helping teams scale efficiently. I believe my background aligns directly with what {{company}} is tackling right now.

I have attached my resume and recent portfolio samples for your review.

Would you be open to a quick 10-minute introductory conversation this Thursday or Friday?

Best regards,
{{sender_name}}
Portfolio: {{portfolio_link}}
LinkedIn: {{linkedin_link}}`,
    tags: ['Artiapply Special', 'Resume Attached', 'High Response'],
    recommendedAttachments: 'Resume (PDF) & Portfolio / Work Samples',
    badge: 'Popular',
  },
  {
    id: 'b2b-pas-sales',
    name: 'B2B Problem-Agitate-Solve (PAS)',
    category: 'sales',
    categoryLabel: 'B2B Sales Outbound',
    description: 'Proven cold outbound structure identifying pain points, offering clear value and low friction CTA.',
    subject: 'Quick question regarding {{company}} outreach workflow',
    body: `Hi {{first_name}},

I noticed your work leading initiatives at {{company}}. Usually when speaking with someone in your role, the biggest hurdle is scaling personalized outreach without landing in spam or burning domain reputation.

We built an engine that sends verified 1-to-1 emails directly through authentic sender accounts with strict rate limiting (2 emails/sec)—achieving a 99.4% inbox placement rate.

I put together a quick 1-pager on how teams like {{company}} improved their meeting book rates by 34% (attached).

Do you have 5 minutes for a quick chat next Tuesday?

Best regards,
{{sender_name}}`,
    tags: ['Cold Outbound', 'Value First', 'B2B SaaS'],
    recommendedAttachments: 'Product 1-Pager or Case Study (PDF)',
    badge: 'High Conversion',
  },
  {
    id: 'executive-c-suite-brief',
    name: 'Executive / CEO 3-Bullet Brief',
    category: 'executive',
    categoryLabel: 'Executive Outreach',
    description: 'Ultra-concise, respectful of busy leadership time, with 3 crisp value propositions.',
    subject: 'Idea for {{company}} growth & deliverability',
    body: `Hi {{first_name}},

I know you're busy steering {{company}}, so I'll keep this brief:

1. We observed a common challenge in your industry regarding customer outreach efficiency.
2. We developed a lightweight automation system that eliminates manual prospecting hours.
3. Our partners recently saw a 2.8x increase in qualified outbound pipeline.

I've attached our executive overview deck (under 2 MB).

Worth a 5-minute conversation, or should I connect with someone else on your team?

Best regards,
{{sender_name}}`,
    tags: ['C-Suite', 'Under 100 words', 'Direct'],
    recommendedAttachments: 'Executive Summary (PDF)',
  },
  {
    id: 'agency-free-audit',
    name: 'Agency / Freelancer Free Audit Offer',
    category: 'agency',
    categoryLabel: 'Services & Freelance',
    description: 'Offer upfront personalized value and a mini audit to win enterprise or client service contracts.',
    subject: 'Quick audit & suggestions for {{company}}',
    body: `Hi {{first_name}},

I was looking at {{company}}'s recent launch and spotted 2 quick optimizations that could immediately lift your conversion rates:

1. Optimizing initial touchpoint load speed and messaging clarity.
2. Streamlining user follow-up automation to capture drop-offs.

I recorded a quick 90-second screen teardown and attached a PDF breakdown with visual suggestions.

No pitch—just wanted to share ideas that worked well for similar brands. Let me know if you'd like me to send over the full teardown.

Warmly,
{{sender_name}}`,
    tags: ['Free Value', 'Services', 'Consulting'],
    recommendedAttachments: 'Visual Audit Teardown (PDF / Image)',
  },
  {
    id: 'investor-pitch-deck',
    name: 'Investor / Angel Pitch & Deck',
    category: 'investor',
    categoryLabel: 'Fundraising & VC',
    description: 'Founder outreach to angel investors and venture funds with metrics, traction, and pitch deck attached.',
    subject: 'Raising Seed round — {{company}} introduction for {{first_name}}',
    body: `Hi {{first_name}},

I've been following your investments in the tech space and love your thesis around automation and productivity.

We are currently building our solution to automate personalized email outreach at scale with zero spam penalties. 

Key traction highlights:
• Month-over-month growth of 42%
• 99.4% inbox delivery across 50,000+ dispatches
• Strong organic retention and positive unit economics

We are raising our Seed round and I would love to share our investor deck (attached).

Would you be open to a 15-minute introductory call sometime next week?

Best,
{{sender_name}}
Founder & CEO`,
    tags: ['Pitch Deck', 'Fundraising', 'Traction'],
    recommendedAttachments: 'Investor Pitch Deck (PDF)',
  },
  {
    id: 'partnership-co-marketing',
    name: 'Strategic Partnership Proposal',
    category: 'partnership',
    categoryLabel: 'Partnership & BD',
    description: 'Collaborative win-win proposal for co-marketing, integrations, or reseller partnerships.',
    subject: 'Partnership idea: {{company}} + Our Team',
    body: `Hi {{first_name}},

I hope your week is going well!

Given {{company}}'s impressive footprint and our shared focus on helping businesses grow, I think there is a compelling synergy between our two platforms.

A lightweight integration or co-marketing initiative could deliver immediate value to both of our customer bases with minimal engineering lift.

I've outlined a 1-page partnership summary attached.

Do you have 10 minutes to explore if this makes sense for both teams?

Cheers,
{{sender_name}}`,
    tags: ['Win-Win', 'Co-Marketing', 'BD'],
    recommendedAttachments: 'Partnership Overview (PDF)',
  },
  {
    id: 'followup-gentle-bump',
    name: 'Follow-up #1: The Friendly 3-Day Bump',
    category: 'followup',
    categoryLabel: 'Follow-ups & Sequences',
    description: 'Polite, low-pressure reminder bringing your previous message back to the top of their inbox.',
    subject: 'Re: Quick question regarding {{company}}',
    body: `Hi {{first_name}},

Following up briefly on my previous email to make sure it didn't get buried in your inbox.

Would love to share how we can help {{company}} streamline outreach without any deliverability risk.

Do you have 5 minutes this Thursday afternoon?

Best,
{{sender_name}}`,
    tags: ['Follow-up 1', 'Gentle Bump', 'High Reply'],
    badge: '3-Day Delay',
  },
  {
    id: 'followup-value-add',
    name: 'Follow-up #2: Value-Add & Case Study',
    category: 'followup',
    categoryLabel: 'Follow-ups & Sequences',
    description: 'Share a relevant case study, asset, or benchmark to add genuine value without hard-selling.',
    subject: 'Resource for {{company}} team — {{first_name}}',
    body: `Hi {{first_name}},

Rather than just checking in, I wanted to share a quick case study that might be directly relevant to your goals at {{company}}.

A team in a similar space implemented our spam-safe dispatch workflow and saw a 3x increase in positive replies within 2 weeks. I've attached the breakdown of the exact sequence they used.

Happy to walk you through the specifics if you're interested!

Best regards,
{{sender_name}}`,
    tags: ['Follow-up 2', 'Case Study', 'Evidence'],
    recommendedAttachments: 'Case Study & Benchmark Guide (PDF)',
    badge: '5-Day Delay',
  },
  {
    id: 'followup-polite-breakup',
    name: 'Follow-up #3: Closing the Loop (Breakup)',
    category: 'followup',
    categoryLabel: 'Follow-ups & Sequences',
    description: 'Final graceful touchpoint that frequently triggers replies from leads who intended to respond.',
    subject: 'Permission to close the loop? — {{company}}',
    body: `Hi {{first_name}},

I haven't heard back, so I assume scaling this isn't a current priority for {{company}} right now—completely understand!

I will close our file so I don't crowd your inbox. If things change down the road and you want to revisit this, my door is always open.

Wishing you and {{company}} continued success!

Best regards,
{{sender_name}}`,
    tags: ['Follow-up 3', 'Breakup', 'Psychology'],
    badge: 'Final Step',
  },
];
