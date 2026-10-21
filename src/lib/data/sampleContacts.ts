import { Contact } from '@/types/database';

/**
 * DISCLAIMER & COMPLIANCE NOTICE:
 * Articlo does NOT provide, scrape, or sell email databases or recruiter lead lists.
 * The entries below are strictly demonstration CSV templates using RFC 2606 / RFC 6761
 * reserved example domains (.example.com) to illustrate the required CSV column headers
 * (first_name, last_name, company, role, email, location).
 * Users must supply their own contact lists of recruiters or employers where they have
 * an established relationship, direct referral, or legitimate job-seeking inquiry.
 */

export interface SampleContactEntry {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  role: string;
  website?: string;
  location?: string;
}

export type FirmCategory = 'big4' | 'big10' | 'midsize' | 'smallsize';

export interface FirmCategoryInfo {
  id: FirmCategory;
  name: string;
  shortName: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  highlightFirms: string;
  contacts: SampleContactEntry[];
  filename: string;
}

export const ARTICLES_CSV_CATEGORIES: FirmCategoryInfo[] = [
  {
    id: 'big4',
    name: "Big 4 Firm Application Template",
    shortName: "Big 4 Template",
    badge: "Format Template",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "🏢",
    description: "Sample formatting layout showing required CSV columns for applying to major statutory audit practices.",
    highlightFirms: "Statutory Audit, Assurance, Direct Tax",
    filename: "sample_template_big4_format.csv",
    contacts: [
      { first_name: 'Alex', last_name: 'Sample', email: 'audit.intake@sample-firm1.example.com', company: 'Global Audit Practice A', role: 'Campus Hiring Coordinator', location: 'Mumbai, India', website: 'https://example.com' },
      { first_name: 'Jordan', last_name: 'Demo', email: 'talent.statutory@sample-firm2.example.com', company: 'Global Audit Practice B', role: 'Articleship Recruiter', location: 'Gurugram, India', website: 'https://example.com' },
      { first_name: 'Taylor', last_name: 'Example', email: 'careers.assurance@sample-firm3.example.com', company: 'Global Audit Practice C', role: 'Early Careers Specialist', location: 'Bengaluru, India', website: 'https://example.com' },
      { first_name: 'Morgan', last_name: 'Placeholder', email: 'audit.careers@sample-firm4.example.com', company: 'Global Audit Practice D', role: 'Campus Recruitment Lead', location: 'New Delhi, India', website: 'https://example.com' },
    ],
  },
  {
    id: 'big10',
    name: "Top National & Global Firm Template",
    shortName: "National Firm Template",
    badge: "Format Template",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "🏆",
    description: "Demonstration format layout for organizing multi-office accounting firm contacts.",
    highlightFirms: "Tax Audits, Risk Advisory, Statutory Audit",
    filename: "sample_template_national_firms.csv",
    contacts: [
      { first_name: 'Sam', last_name: 'Template', email: 'hr.audit@sample-national1.example.com', company: 'National Accounting Firm A', role: 'Talent Acquisition Executive', location: 'Mumbai, India', website: 'https://example.com' },
      { first_name: 'Chris', last_name: 'Format', email: 'recruitment@sample-national2.example.com', company: 'National Accounting Firm B', role: 'Articleship Intake Lead', location: 'Hyderabad, India', website: 'https://example.com' },
      { first_name: 'Robin', last_name: 'Demo', email: 'careers@sample-national3.example.com', company: 'National Accounting Firm C', role: 'HR Manager - Audit & Tax', location: 'Pune, India', website: 'https://example.com' },
      { first_name: 'Pat', last_name: 'Placeholder', email: 'talent@sample-national4.example.com', company: 'National Accounting Firm D', role: 'Senior Recruiter', location: 'New Delhi, India', website: 'https://example.com' },
    ],
  },
  {
    id: 'midsize',
    name: "Mid-Size Firm Template",
    shortName: "Mid-Size Template",
    badge: "Format Template",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "📈",
    description: "Sample format layout for mid-size partnership CA practices providing well-rounded 360° audit exposure.",
    highlightFirms: "Direct Partner Intake, Statutory & Tax Audits",
    filename: "sample_template_midsize_firms.csv",
    contacts: [
      { first_name: 'Casey', last_name: 'Sample', email: 'applications@sample-midsize1.example.com', company: 'Midsize CA Associates A', role: 'Hiring Partner', location: 'Mumbai, India', website: 'https://example.com' },
      { first_name: 'Avery', last_name: 'Placeholder', email: 'articleship@sample-midsize2.example.com', company: 'Midsize CA Associates B', role: 'Recruitment Coordinator', location: 'Kolkata, India', website: 'https://example.com' },
      { first_name: 'Riley', last_name: 'Example', email: 'careers@sample-midsize3.example.com', company: 'Midsize CA Associates C', role: 'Audit Practice Lead', location: 'Vadodara, India', website: 'https://example.com' },
      { first_name: 'Jamie', last_name: 'Format', email: 'hr@sample-midsize4.example.com', company: 'Midsize CA Associates D', role: 'Managing Partner', location: 'New Delhi, India', website: 'https://example.com' },
    ],
  },
  {
    id: 'smallsize',
    name: "Boutique Firm Template",
    shortName: "Boutique Template",
    badge: "Format Template",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "🚀",
    description: "Demonstration format layout for specialized boutique taxation, litigation, and advisory CA practices.",
    highlightFirms: "Tax Litigation, Corporate Advisory, Direct Mentorship",
    filename: "sample_template_boutique_firms.csv",
    contacts: [
      { first_name: 'Dana', last_name: 'Example', email: 'contact@sample-boutique1.example.com', company: 'Boutique Tax Advisory A', role: 'Managing Partner', location: 'New Delhi, India', website: 'https://example.com' },
      { first_name: 'Drew', last_name: 'Sample', email: 'intake@sample-boutique2.example.com', company: 'Boutique Audit Partners B', role: 'Founder & Hiring Lead', location: 'Bengaluru, India', website: 'https://example.com' },
      { first_name: 'Quinn', last_name: 'Format', email: 'careers@sample-boutique3.example.com', company: 'Boutique Corporate Advisors C', role: 'Partner - Articleship Recruitment', location: 'Gurugram, India', website: 'https://example.com' },
      { first_name: 'Reese', last_name: 'Placeholder', email: 'hiring@sample-boutique4.example.com', company: 'Boutique Financial Consultants D', role: 'Principal CA', location: 'Mumbai, India', website: 'https://example.com' },
    ],
  },
];

// Flat list of demonstration contacts for preview
export const RAW_50_SAMPLE_CONTACTS: SampleContactEntry[] = ARTICLES_CSV_CATEGORIES.flatMap((c) => c.contacts);

/**
 * Returns formatted contacts for a specific category template.
 */
export function getCategoryContacts(
  categoryId: FirmCategory = 'big4',
  campaignId: string = 'sample-camp-1',
  userId: string = 'user-1'
): Contact[] {
  const catInfo = ARTICLES_CSV_CATEGORIES.find((c) => c.id === categoryId) || ARTICLES_CSV_CATEGORIES[0];
  return catInfo.contacts.map((item, idx) => ({
    id: `template-${categoryId}-${idx + 1}`,
    campaign_id: campaignId,
    user_id: userId,
    email: item.email,
    first_name: item.first_name,
    last_name: item.last_name,
    company: item.company,
    role: item.role,
    status: 'pending',
    sent_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Returns sample contacts matching the Contact interface.
 */
export function getSample50Contacts(campaignId: string = 'sample-camp-1', userId: string = 'user-1'): Contact[] {
  return RAW_50_SAMPLE_CONTACTS.map((item, idx) => ({
    id: `template-contact-${idx + 1}`,
    campaign_id: campaignId,
    user_id: userId,
    email: item.email,
    first_name: item.first_name,
    last_name: item.last_name,
    company: item.company,
    role: item.role,
    status: 'pending',
    sent_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Generates CSV string for a specific category template.
 */
export function generateCategoryCSVString(category: FirmCategory): string {
  const catInfo = ARTICLES_CSV_CATEGORIES.find((c) => c.id === category) || ARTICLES_CSV_CATEGORIES[0];
  const headers = ['first_name', 'last_name', 'email', 'company', 'role', 'location'];
  const rows = catInfo.contacts.map((c) => [
    `"${c.first_name}"`,
    `"${c.last_name}"`,
    `"${c.email}"`,
    `"${c.company}"`,
    `"${c.role}"`,
    `"${c.location || ''}"`,
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Downloads the demonstration CSV file for a specific template.
 */
export function downloadCategoryCSV(category: FirmCategory): void {
  if (typeof window === 'undefined') return;
  const catInfo = ARTICLES_CSV_CATEGORIES.find((c) => c.id === category) || ARTICLES_CSV_CATEGORIES[0];
  const csvContent = generateCategoryCSVString(category);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', catInfo.filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Default sample template download.
 */
export function downloadSampleCSVFile(): void {
  downloadCategoryCSV('big4');
}
