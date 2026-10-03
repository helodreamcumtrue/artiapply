import { Contact } from '@/types/database';

export interface SampleContactEntry {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  role: string;
  website: string;
  location: string;
}

export const RAW_50_SAMPLE_CONTACTS: SampleContactEntry[] = [
  { first_name: 'Jordan', last_name: 'Bell', email: 'jordan.bell@stratasys.io', company: 'StrataSys', role: 'Chief Technology Officer', website: 'https://stratasys.io', location: 'San Francisco, CA' },
  { first_name: 'Samantha', last_name: 'Vance', email: 'samantha.v@novatech.co', company: 'NovaTech', role: 'VP Marketing', website: 'https://novatech.co', location: 'New York, NY' },
  { first_name: 'Matthew', last_name: 'Zhang', email: 'matthew.z@hypergrowth.ai', company: 'HyperGrowth AI', role: 'Growth Lead', website: 'https://hypergrowth.ai', location: 'Austin, TX' },
  { first_name: 'Claire', last_name: 'Morris', email: 'claire.morris@apexcloud.dev', company: 'Apex Cloud', role: 'Founder & CEO', website: 'https://apexcloud.dev', location: 'Seattle, WA' },
  { first_name: 'David', last_name: 'Kim', email: 'david.kim@apexleads.com', company: 'ApexLeads', role: 'Growth Strategist', website: 'https://apexleads.com', location: 'Chicago, IL' },
  { first_name: 'Elena', last_name: 'Rostova', email: 'elena.rostova@devsphere.dev', company: 'DevSphere', role: 'Director of Outreach', website: 'https://devsphere.dev', location: 'Boston, MA' },
  { first_name: 'Marcus', last_name: 'Vance', email: 'marcus.v@finflow.co', company: 'FinFlow', role: 'Head of Product', website: 'https://finflow.co', location: 'Miami, FL' },
  { first_name: 'Sarah', last_name: 'Chen', email: 'sarah.chen@cloudpulse.ai', company: 'CloudPulse', role: 'VP of Marketing', website: 'https://cloudpulse.ai', location: 'San Jose, CA' },
  { first_name: 'Alex', last_name: 'Rivers', email: 'alex.rivers@techscale.io', company: 'TechScale', role: 'Head of Growth', website: 'https://techscale.io', location: 'Denver, CO' },
  { first_name: 'Jessica', last_name: 'Alvarez', email: 'jessica.a@vanguardai.com', company: 'Vanguard AI', role: 'VP Revenue', website: 'https://vanguardai.com', location: 'San Francisco, CA' },
  { first_name: 'Ryan', last_name: 'Patel', email: 'ryan.patel@quantumsys.io', company: 'QuantumSys', role: 'VP Engineering', website: 'https://quantumsys.io', location: 'Atlanta, GA' },
  { first_name: 'Emily', last_name: 'Watson', email: 'emily.w@synthetix.tech', company: 'Synthetix Tech', role: 'Product Marketing Lead', website: 'https://synthetix.tech', location: 'Toronto, Canada' },
  { first_name: 'Brandon', last_name: 'Lee', email: 'brandon.lee@datastream.co', company: 'DataStream', role: 'Chief Data Officer', website: 'https://datastream.co', location: 'New York, NY' },
  { first_name: 'Olivia', last_name: 'Taylor', email: 'olivia.t@pulsewave.io', company: 'PulseWave', role: 'Director of Sales', website: 'https://pulsewave.io', location: 'London, UK' },
  { first_name: 'Nathan', last_name: 'Brooks', email: 'nathan.b@nexuscrm.com', company: 'Nexus CRM', role: 'Founder & COO', website: 'https://nexuscrm.com', location: 'Salt Lake City, UT' },
  { first_name: 'Sophia', last_name: 'Martinez', email: 'sophia.m@elevatesoft.org', company: 'ElevateSoft', role: 'Head of Demand Gen', website: 'https://elevatesoft.org', location: 'Los Angeles, CA' },
  { first_name: 'Daniel', last_name: 'Cooper', email: 'daniel.c@beaconai.dev', company: 'Beacon AI', role: 'Lead Architect', website: 'https://beaconai.dev', location: 'San Francisco, CA' },
  { first_name: 'Hannah', last_name: 'Schmidt', email: 'hannah.s@hyperionstack.de', company: 'Hyperion Stack', role: 'VP Customer Success', website: 'https://hyperionstack.de', location: 'Berlin, Germany' },
  { first_name: 'Lucas', last_name: 'Silva', email: 'lucas.silva@saasmetrics.io', company: 'SaaSMetrics', role: 'Head of Growth', website: 'https://saasmetrics.io', location: 'Sao Paulo, Brazil' },
  { first_name: 'Chloe', last_name: 'Bennett', email: 'chloe.b@orbitallabs.ai', company: 'Orbital Labs', role: 'VP Product', website: 'https://orbitallabs.ai', location: 'Cambridge, MA' },
  { first_name: 'Kevin', last_name: 'O\'Connor', email: 'kevin.oc@peakscale.co', company: 'PeakScale', role: 'Chief Revenue Officer', website: 'https://peakscale.co', location: 'Dublin, Ireland' },
  { first_name: 'Rachel', last_name: 'Greenberg', email: 'rachel.g@omnipath.io', company: 'OmniPath', role: 'Director of RevOps', website: 'https://omnipath.io', location: 'New York, NY' },
  { first_name: 'Tyler', last_name: 'Adams', email: 'tyler.a@stratoscloud.com', company: 'Stratos Cloud', role: 'VP Infrastructure', website: 'https://stratoscloud.com', location: 'Dallas, TX' },
  { first_name: 'Amber', last_name: 'Jenkins', email: 'amber.j@cortexhq.io', company: 'Cortex HQ', role: 'Head of Partnerships', website: 'https://cortexhq.io', location: 'Portland, OR' },
  { first_name: 'Justin', last_name: 'Fischer', email: 'justin.f@infinitemail.co', company: 'InfiniteMail', role: 'Founder & CEO', website: 'https://infinitemail.co', location: 'Austin, TX' },
  { first_name: 'Maya', last_name: 'Gupta', email: 'maya.gupta@zenithenterprise.in', company: 'Zenith Enterprise', role: 'VP Digital Strategy', website: 'https://zenithenterprise.in', location: 'Bengaluru, India' },
  { first_name: 'Eric', last_name: 'Holt', email: 'eric.holt@neuralflow.ai', company: 'NeuralFlow', role: 'ML Engineering Lead', website: 'https://neuralflow.ai', location: 'San Diego, CA' },
  { first_name: 'Zoe', last_name: 'Kowalski', email: 'zoe.k@scaleloop.io', company: 'ScaleLoop', role: 'Head of B2B Marketing', website: 'https://scaleloop.io', location: 'Warsaw, Poland' },
  { first_name: 'Sean', last_name: 'Murphy', email: 'sean.m@ironcladsec.io', company: 'IroncladSec', role: 'Chief Information Security Officer', website: 'https://ironcladsec.io', location: 'Washington, DC' },
  { first_name: 'Natalie', last_name: 'Reyes', email: 'natalie.r@luminaanalytics.com', company: 'Lumina Analytics', role: 'Director of Business Dev', website: 'https://luminaanalytics.com', location: 'Phoenix, AZ' },
  { first_name: 'Patrick', last_name: 'Doyle', email: 'patrick.d@cobaltops.com', company: 'CobaltOps', role: 'VP Operations', website: 'https://cobaltops.com', location: 'Minneapolis, MN' },
  { first_name: 'Laura', last_name: 'Sinclair', email: 'laura.s@veritaslead.com', company: 'Veritas Lead', role: 'VP Growth & Sales', website: 'https://veritaslead.com', location: 'Vancouver, Canada' },
  { first_name: 'Jonathan', last_name: 'Wu', email: 'jonathan.wu@alphastrat.io', company: 'AlphaStrat', role: 'Head of Product Management', website: 'https://alphastrat.io', location: 'San Francisco, CA' },
  { first_name: 'Megan', last_name: 'Kelly', email: 'megan.k@bluepeakai.com', company: 'BluePeak AI', role: 'Director of Growth', website: 'https://bluepeakai.com', location: 'Nashville, TN' },
  { first_name: 'Victor', last_name: 'Rossi', email: 'victor.r@aerodrive.it', company: 'AeroDrive', role: 'Chief Commercial Officer', website: 'https://aerodrive.it', location: 'Milan, Italy' },
  { first_name: 'Grace', last_name: 'Hopkins', email: 'grace.h@novumreach.io', company: 'NovumReach', role: 'VP Outbound Strategy', website: 'https://novumreach.io', location: 'Boulder, CO' },
  { first_name: 'Ian', last_name: 'MacDonald', email: 'ian.m@scotcloud.tech', company: 'ScotCloud', role: 'Director of Cloud Sales', website: 'https://scotcloud.tech', location: 'Edinburgh, UK' },
  { first_name: 'Valerie', last_name: 'Stone', email: 'valerie.s@vectorpipeline.co', company: 'Vector Pipeline', role: 'Head of Sales Engineering', website: 'https://vectorpipeline.co', location: 'Charlotte, NC' },
  { first_name: 'Adam', last_name: 'Nakamura', email: 'adam.n@tokyosync.jp', company: 'TokyoSync', role: 'VP Strategic Growth', website: 'https://tokyosync.jp', location: 'Tokyo, Japan' },
  { first_name: 'Brooke', last_name: 'Castillo', email: 'brooke.c@apexscale.dev', company: 'ApexScale', role: 'Director of Marketing Ops', website: 'https://apexscale.dev', location: 'Miami, FL' },
  { first_name: 'Simon', last_name: 'Larsson', email: 'simon.l@nordicoutbound.se', company: 'Nordic Outbound', role: 'Managing Director', website: 'https://nordicoutbound.se', location: 'Stockholm, Sweden' },
  { first_name: 'Tiffany', last_name: 'Cross', email: 'tiffany.c@primetarget.io', company: 'PrimeTarget', role: 'Head of SDR Operations', website: 'https://primetarget.io', location: 'Raleigh, NC' },
  { first_name: 'Andrew', last_name: 'Novak', email: 'andrew.n@clearsignal.ai', company: 'ClearSignal AI', role: 'CTO & Co-founder', website: 'https://clearsignal.ai', location: 'Prague, Czechia' },
  { first_name: 'Kelly', last_name: 'Zhang', email: 'kelly.z@cloudorbit.io', company: 'CloudOrbit', role: 'VP Enterprise Solutions', website: 'https://cloudorbit.io', location: 'San Francisco, CA' },
  { first_name: 'Trevor', last_name: 'Dixon', email: 'trevor.d@swiftreach.co', company: 'SwiftReach', role: 'Head of Inbound & Outbound', website: 'https://swiftreach.co', location: 'Indianapolis, IN' },
  { first_name: 'Melissa', last_name: 'Pena', email: 'melissa.p@ignitegrowth.org', company: 'Ignite Growth', role: 'Director of Revenue Ops', website: 'https://ignitegrowth.org', location: 'Tampa, FL' },
  { first_name: 'Carlos', last_name: 'Mendoza', email: 'carlos.m@solarisleads.mx', company: 'Solaris Leads', role: 'VP Commercial Growth', website: 'https://solarisleads.mx', location: 'Mexico City, Mexico' },
  { first_name: 'Danielle', last_name: 'Frey', email: 'danielle.f@optimaoutreach.com', company: 'Optima Outreach', role: 'Chief Marketing Officer', website: 'https://optimaoutreach.com', location: 'Columbus, OH' },
  { first_name: 'Gregory', last_name: 'Shaw', email: 'gregory.s@apexvelocity.io', company: 'Apex Velocity', role: 'Director of Business Expansion', website: 'https://apexvelocity.io', location: 'Philadelphia, PA' },
  { first_name: 'Ashley', last_name: 'Thornton', email: 'ashley.t@elevatereach.io', company: 'Elevate Reach', role: 'VP Marketing & Sales Ops', website: 'https://elevatereach.io', location: 'Houston, TX' },
];

/**
 * Returns formatted 50 contacts matching the Contact interface.
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
 * Generates raw CSV formatted string for 50 sample contacts.
 */
export function generateSampleCSVString(): string {
  const headers = ['first_name', 'last_name', 'email', 'company', 'role', 'website', 'location'];
  const rows = RAW_50_SAMPLE_CONTACTS.map((c) => [
    `"${c.first_name}"`,
    `"${c.last_name}"`,
    `"${c.email}"`,
    `"${c.company}"`,
    `"${c.role}"`,
    `"${c.website}"`,
    `"${c.location}"`,
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Triggers a browser download of the 50-entry CSV sample file.
 */
export function downloadSampleCSVFile(): void {
  if (typeof window === 'undefined') return;
  const csvContent = generateSampleCSVString();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'artiapply_50_sample_contacts.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
