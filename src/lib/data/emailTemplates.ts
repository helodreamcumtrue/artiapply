export interface EmailTemplate {
  id: string;
  name: string;
  category: 'articleship' | 'job_application' | 'sales' | 'executive' | 'investor' | 'partnership' | 'agency' | 'followup';
  categoryLabel: string;
  description: string;
  subject: string;
  body: string;
  tags: string[];
  recommendedAttachments?: string;
  badge?: string;
}

export const CA_ARTICLESHIP_DEMO_TEMPLATE: EmailTemplate = {
  id: 'ca-articleship-statutory-audit',
  name: 'CA Articleship - Statutory Audit',
  category: 'articleship',
  categoryLabel: 'Articleship Application',
  description: 'Official format for CA Intermediate qualified students applying for Articleship in Statutory Audit.',
  subject: 'Application for CA Articleship- Statutory Audit | CA Intermediate Qualified',
  body: `Dear Recruitment Team,

I hope you are doing well.

I recently cleared the CA Intermediate examination in my first attempt and am seeking an Articleship opportunity in the Statutory Audit practice at your firm.

Please find my resume attached for your kind consideration. I would be grateful if you could consider my application for a suitable Articleship opportunity. I am eager to learn, contribute, and develop a strong foundation under the guidance of experienced professionals.

Thank you for your time and consideration. I look forward to the opportunity to discuss my application further.

Kind regards,

[Your Name]
CA Intermediate Qualified
[Phone Number]
[Gmail ID] 
LinkedIn:`,
  tags: ['CA Articleship', 'Statutory Audit', 'Recommended Demo'],
  recommendedAttachments: 'Updated Resume (PDF) & Marksheets',
  badge: 'Demo Format',
};

export const PROFESSIONAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  CA_ARTICLESHIP_DEMO_TEMPLATE,
];
