import { Contact } from '@/types/database';

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
    name: "Big 4 Accounting & Audit Firms",
    shortName: "Big 4 Firms",
    badge: "Premier Global Brand",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "🏢",
    description: "Verified HR and campus recruitment leads across Statutory Audit, Tax, and Assurance practices at Deloitte, PwC, EY, and KPMG.",
    highlightFirms: "Deloitte, PwC, EY, KPMG",
    filename: "ca_articleship_big4_hr_leads.csv",
    contacts: [
      { first_name: 'Priya', last_name: 'Sharma', email: 'priya.sharma@deloitte.com', company: 'Deloitte India', role: 'HR Lead - Statutory Audit', location: 'Mumbai, India', website: 'https://deloitte.com' },
      { first_name: 'Rahul', last_name: 'Verma', email: 'rahul.verma@kpmg.com', company: 'KPMG India', role: 'Talent Acquisition Manager', location: 'Gurugram, India', website: 'https://kpmg.com' },
      { first_name: 'Ananya', last_name: 'Gupta', email: 'ananya.gupta@pwc.in', company: 'PwC India', role: 'Articleship Hiring Specialist', location: 'Bengaluru, India', website: 'https://pwc.in' },
      { first_name: 'Rohan', last_name: 'Mehta', email: 'rohan.mehta@ey.com', company: 'EY India', role: 'Campus HR & Audit Recruiter', location: 'New Delhi, India', website: 'https://ey.com' },
      { first_name: 'Tanmay', last_name: 'Roy', email: 'tanmay.roy@deloitte.com', company: 'Deloitte Haskins & Sells', role: 'Audit Recruitment Partner', location: 'Kolkata, India', website: 'https://deloitte.com' },
      { first_name: 'Meera', last_name: 'Nambiar', email: 'meera.n@kpmg.com', company: 'KPMG India', role: 'Early Careers Lead - Assurance', location: 'Chennai, India', website: 'https://kpmg.com' },
      { first_name: 'Siddharth', last_name: 'Sen', email: 'siddharth.sen@pwc.in', company: 'PwC Service Delivery Center', role: 'Statutory Audit Hiring Lead', location: 'Hyderabad, India', website: 'https://pwc.in' },
      { first_name: 'Kriti', last_name: 'Jain', email: 'kriti.jain@ey.com', company: 'EY Global Delivery Services', role: 'Assurance Campus Recruiter', location: 'Pune, India', website: 'https://ey.com' },
      { first_name: 'Neha', last_name: 'Kapur', email: 'neha.kapur@deloitte.com', company: 'Deloitte India', role: 'Senior Talent Acquisition Specialist', location: 'Gurugram, India', website: 'https://deloitte.com' },
      { first_name: 'Tarun', last_name: 'Bhatia', email: 'tarun.b@kpmg.com', company: 'KPMG India', role: 'HR Business Partner - Audit', location: 'Mumbai, India', website: 'https://kpmg.com' },
      { first_name: 'Kavita', last_name: 'Pillai', email: 'kavita.pillai@pwc.in', company: 'PwC India', role: 'People & Organization Specialist', location: 'Mumbai, India', website: 'https://pwc.in' },
      { first_name: 'Aakash', last_name: 'Sengupta', email: 'aakash.s@ey.com', company: 'EY India', role: 'Talent Lead - Financial Services Audit', location: 'Bengaluru, India', website: 'https://ey.com' },
    ],
  },
  {
    id: 'big10',
    name: "Top 10 Global & National CA Firms",
    shortName: "Top 10 Firms",
    badge: "High Conversion",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "🏆",
    description: "Reputed global network firms offering excellent stipends, diverse audit engagements, and high first-attempt articleship conversion.",
    highlightFirms: "BDO, Grant Thornton, RSM, Baker Tilly, Walker Chandiok, Mazars",
    filename: "ca_articleship_top10_firms_hr_leads.csv",
    contacts: [
      { first_name: 'Sneha', last_name: 'Iyer', email: 'sneha.iyer@bdo.in', company: 'BDO India', role: 'Human Resources Executive', location: 'Mumbai, India', website: 'https://bdo.in' },
      { first_name: 'Aditya', last_name: 'Kapoor', email: 'aditya.k@gtindia.com', company: 'Grant Thornton Bharat', role: 'Associate Director - Talent Acquisition', location: 'Hyderabad, India', website: 'https://grantthornton.in' },
      { first_name: 'Tanvi', last_name: 'Deshmukh', email: 'tanvi.d@rsmindia.in', company: 'RSM India', role: 'HR Manager - Statutory & Internal Audit', location: 'Pune, India', website: 'https://rsm.global' },
      { first_name: 'Karan', last_name: 'Malhotra', email: 'karan.m@bakertilly.in', company: 'Baker Tilly DHC', role: 'Senior Recruiter', location: 'Mumbai, India', website: 'https://bakertilly.in' },
      { first_name: 'Pooja', last_name: 'Chopra', email: 'pooja.c@walkerchandiok.in', company: 'Walker Chandiok & Co LLP', role: 'Talent Acquisition Lead', location: 'New Delhi, India', website: 'https://walkerchandiok.in' },
      { first_name: 'Vikram', last_name: 'Nair', email: 'vikram.nair@mazars.co.in', company: 'Mazars India', role: 'People & Culture Lead', location: 'Bengaluru, India', website: 'https://mazars.co.in' },
      { first_name: 'Ritu', last_name: 'Singhi', email: 'ritu.singhi@singhico.com', company: 'Singhi & Co.', role: 'Partner & HR Coordinator', location: 'Kolkata, India', website: 'https://singhico.com' },
      { first_name: 'Amit', last_name: 'Surana', email: 'amit.s@ss-associates.com', company: 'Suresh Surana & Associates', role: 'HR Head - Audit Practice', location: 'Mumbai, India', website: 'https://ss-associates.com' },
      { first_name: 'Prerna', last_name: 'Joshi', email: 'prerna.j@gtindia.com', company: 'Grant Thornton Bharat', role: 'Campus Hiring Specialist', location: 'Gurugram, India', website: 'https://grantthornton.in' },
      { first_name: 'Vikramaditya', last_name: 'Singhania', email: 'v.singhania@bdo.in', company: 'BDO India', role: 'Senior Talent Acquisition Lead', location: 'New Delhi, India', website: 'https://bdo.in' },
      { first_name: 'Alok', last_name: 'Srivastav', email: 'alok.s@rsmindia.in', company: 'RSM India', role: 'Audit Practice Recruiter', location: 'Mumbai, India', website: 'https://rsm.global' },
      { first_name: 'Gaurav', last_name: 'Tandon', email: 'gaurav.t@walkerchandiok.in', company: 'Walker Chandiok & Co LLP', role: 'Human Resources Associate', location: 'Bengaluru, India', website: 'https://walkerchandiok.in' },
    ],
  },
  {
    id: 'midsize',
    name: "Established Mid-Size CA Firms",
    shortName: "Mid-Size Firms",
    badge: "360° Audit & Tax Exposure",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "📈",
    description: "Respected multi-partner firms providing well-rounded training across Statutory Audit, Tax Audits, GST, and MCA filings with direct partner interaction.",
    highlightFirms: "Haribhakti, Lodha & Co, CNK, Chhajed & Doshi, Chaturvedi & Shah",
    filename: "ca_articleship_midsize_firms_hr_leads.csv",
    contacts: [
      { first_name: 'Neha', last_name: 'Saxena', email: 'neha.saxena@haribhakti.co.in', company: 'Haribhakti & Co. LLP', role: 'HR Manager - Articleship Program', location: 'Mumbai, India', website: 'https://haribhakti.co.in' },
      { first_name: 'Deepak', last_name: 'Chhajed', email: 'deepak.c@chhajed.com', company: 'Chhajed & Doshi', role: 'Senior HR Partner', location: 'Mumbai, India', website: 'https://chhajed.com' },
      { first_name: 'Alok', last_name: 'Kulkarni', email: 'alok.k@cnkindia.com', company: 'CNK & Associates LLP', role: 'Articleship Coordinator', location: 'Vadodara, India', website: 'https://cnkindia.com' },
      { first_name: 'Rakesh', last_name: 'Lodha', email: 'rakesh.l@lodhaco.com', company: 'Lodha & Co.', role: 'Talent Partner - Statutory Audit', location: 'Kolkata, India', website: 'https://lodhaco.com' },
      { first_name: 'Shweta', last_name: 'Sankar', email: 'shweta.s@vsaiyar.com', company: 'V. Sankar Aiyar & Co.', role: 'HR Recruiter', location: 'New Delhi, India', website: 'https://vsaiyar.com' },
      { first_name: 'Pradeep', last_name: 'Aiyar', email: 'pradeep.a@ksaiyar.com', company: 'K.S. Aiyar & Co.', role: 'Managing Partner (Articleship Intake)', location: 'Mumbai, India', website: 'https://ksaiyar.com' },
      { first_name: 'Manish', last_name: 'Shah', email: 'manish.shah@cas.ind.in', company: 'Chaturvedi & Shah LLP', role: 'HR Executive - Audit Team', location: 'Mumbai, India', website: 'https://cas.ind.in' },
      { first_name: 'Sunita', last_name: 'Purohit', email: 'sunita.p@batliboipurohit.com', company: 'Batliboi & Purohit', role: 'Audit Practice HR Lead', location: 'Ahmedabad, India', website: 'https://batliboipurohit.com' },
      { first_name: 'Prateek', last_name: 'Merchant', email: 'prateek.m@haribhakti.co.in', company: 'Haribhakti & Co. LLP', role: 'Talent Acquisition Partner', location: 'Bengaluru, India', website: 'https://haribhakti.co.in' },
      { first_name: 'Sonali', last_name: 'Kadam', email: 'sonali.k@chhajed.com', company: 'Chhajed & Doshi', role: 'Recruitment & People Operations', location: 'Mumbai, India', website: 'https://chhajed.com' },
      { first_name: 'Shailesh', last_name: 'Trivedi', email: 'shailesh.t@cnkindia.com', company: 'CNK & Associates LLP', role: 'Senior Manager - HR', location: 'Mumbai, India', website: 'https://cnkindia.com' },
      { first_name: 'Debolina', last_name: 'Das', email: 'debolina.d@lodhaco.com', company: 'Lodha & Co.', role: 'Articleship Coordinator', location: 'New Delhi, India', website: 'https://lodhaco.com' },
    ],
  },
  {
    id: 'smallsize',
    name: "Boutique & Growing CA Practices",
    shortName: "Boutique Firms",
    badge: "Direct Partner Mentorship",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "🚀",
    description: "Fast-growing boutique CA practices where articled assistants work directly alongside founding partners on client representations, litigations, and end-to-end audits.",
    highlightFirms: "Apex Tax, Vanguard Audit, Horizon Advisory, Crestfield, Benchmark",
    filename: "ca_articleship_boutique_firms_hr_leads.csv",
    contacts: [
      { first_name: 'Divya', last_name: 'Aggarwal', email: 'divya.a@apextax.in', company: 'Apex Tax & Advisory', role: 'Managing Partner - Hiring', location: 'New Delhi, India', website: 'https://apextax.in' },
      { first_name: 'Gaurav', last_name: 'Joshi', email: 'gaurav.j@vanguardaudit.in', company: 'Vanguard Audit Partners', role: 'Founder & Audit Practice Lead', location: 'Bengaluru, India', website: 'https://vanguardaudit.in' },
      { first_name: 'Nidhi', last_name: 'Bansal', email: 'nidhi.b@horizonadvisory.in', company: 'Horizon Corporate Advisory', role: 'Partner - Articleship Recruitment', location: 'Gurugram, India', website: 'https://horizonadvisory.in' },
      { first_name: 'Akhil', last_name: 'Kothari', email: 'akhil.k@crestfield.in', company: 'Crestfield Financial Consultants', role: 'Principal CA & Hiring Lead', location: 'Mumbai, India', website: 'https://crestfield.in' },
      { first_name: 'Varun', last_name: 'Goel', email: 'varun.goel@sterlingca.in', company: 'Sterling & Associates', role: 'Senior Partner', location: 'Chandigarh, India', website: 'https://sterlingca.in' },
      { first_name: 'Pallavi', last_name: 'Rathi', email: 'pallavi.r@zenithca.in', company: 'Zenith CA Practice', role: 'Lead Auditor & Intake Coordinator', location: 'Jaipur, India', website: 'https://zenithca.in' },
      { first_name: 'Harish', last_name: 'Somani', email: 'harish.s@meridianca.in', company: 'Meridian & Co.', role: 'Founding Partner', location: 'Indore, India', website: 'https://meridianca.in' },
      { first_name: 'Aniket', last_name: 'Patil', email: 'aniket.p@benchmarkaudit.in', company: 'Benchmark Audit LLP', role: 'Founding Partner & HR Lead', location: 'Pune, India', website: 'https://benchmarkaudit.in' },
      { first_name: 'Kunal', last_name: 'Grover', email: 'kunal.g@apextax.in', company: 'Apex Tax & Advisory', role: 'Partner - Corporate Tax', location: 'Noida, India', website: 'https://apextax.in' },
      { first_name: 'Ritika', last_name: 'Paul', email: 'ritika.p@vanguardaudit.in', company: 'Vanguard Audit Partners', role: 'Senior Auditor & Mentor', location: 'Bengaluru, India', website: 'https://vanguardaudit.in' },
      { first_name: 'Raghav', last_name: 'Bajaj', email: 'raghav.b@horizonadvisory.in', company: 'Horizon Corporate Advisory', role: 'Managing Associate', location: 'New Delhi, India', website: 'https://horizonadvisory.in' },
      { first_name: 'Samaira', last_name: 'Khan', email: 'samaira.k@crestfield.in', company: 'Crestfield Financial Consultants', role: 'Practice Manager', location: 'Mumbai, India', website: 'https://crestfield.in' },
    ],
  },
];

// Flat list of all 48 contacts for general testing
export const RAW_50_SAMPLE_CONTACTS: SampleContactEntry[] = ARTICLES_CSV_CATEGORIES.flatMap((c) => c.contacts);

/**
 * Returns formatted contacts for a specific category or default.
 */
export function getCategoryContacts(
  categoryId: FirmCategory = 'big4',
  campaignId: string = 'sample-camp-1',
  userId: string = 'user-1'
): Contact[] {
  const catInfo = ARTICLES_CSV_CATEGORIES.find((c) => c.id === categoryId) || ARTICLES_CSV_CATEGORIES[0];
  return catInfo.contacts.map((item, idx) => ({
    id: `lead-${categoryId}-${idx + 1}`,
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
 * Returns all contacts matching the Contact interface.
 */
export function getSample50Contacts(campaignId: string = 'sample-camp-1', userId: string = 'user-1'): Contact[] {
  return RAW_50_SAMPLE_CONTACTS.map((item, idx) => ({
    id: `sample-${idx + 1}`,
    campaign_id: campaignId,
    user_id: userId,
    email: item.email,
    first_name: item.first_name,
    last_name: item.last_name,
    company: item.company,
    role: item.role,
    status: idx < 12 ? 'sent' : idx === 12 ? 'sending' : 'pending',
    sent_at: idx < 12 ? new Date(Date.now() - (idx + 1) * 3600000).toISOString() : null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Generates CSV string for a specific category.
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
 * Downloads the CSV file for a specific firm category.
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
 * Default sample download (Big 4 as default).
 */
export function downloadSampleCSVFile(): void {
  downloadCategoryCSV('big4');
}
