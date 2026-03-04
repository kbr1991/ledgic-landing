const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDB() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Schema applied');

  const { rows } = await pool.query('SELECT COUNT(*) FROM blog_posts');
  if (parseInt(rows[0].count) === 0) {
    await seedBlogPosts();
  }
}

async function seedBlogPosts() {
  const posts = [
    {
      slug: 'ccfs-2026-mca-amnesty-scheme',
      title: "CCFS-2026: MCA's One-Time Amnesty – Pay Only 10% Additional Fees",
      excerpt: "MCA launches the Companies Compliance Facilitation Scheme, 2026 — file all pending annual returns by paying only 10% of additional fees. Window: April 15 – July 15, 2026.",
      content: `# CCFS-2026: MCA's One-Time Amnesty Scheme

The Ministry of Corporate Affairs has launched the Companies Compliance Facilitation Scheme, 2026 (CCFS-2026), providing companies a limited-time opportunity to regularize all pending annual return filings at significantly reduced cost.

## Key Highlights

- **90% Fee Waiver**: Pay only 10% of applicable additional fees for delayed filings
- **Scheme Window**: April 15, 2026 to July 15, 2026 (90 days)
- **17 Forms Covered**: Includes AOC-4, MGT-7, MGT-7A, ADT-1, DIR-12 and more
- **Dormancy at 50% Fees**: Opt for dormant company status under the scheme
- **Strike-off Protection**: Companies at risk of strike-off can file at 25% of additional fees
- **Immunity from Prosecution**: Valid filings under the scheme are shielded from prosecution

## Eligibility Criteria

All companies with pending annual returns, financial statements, or other documents required to be filed under the Companies Act, 2013 are eligible. The scheme does not apply to companies already under NCLT proceedings or having active prosecution matters unrelated to delayed filing.

## The 17 Forms Covered

The scheme covers filing of: AOC-4, AOC-4 XBRL, AOC-4 CFS, MGT-7, MGT-7A, ADT-1, DIR-12, INC-20A, INC-22, INC-22A, CHG-1, CHG-4, CHG-9, BEN-2, MSME-1, LLP-11, and LLP-8.

## Strategic Advisory — KBR & Co.

We strongly advise all defaulting companies and LLPs to evaluate their pending filing obligations immediately and utilize this scheme window. The cost benefit is significant: a company with ₹5 lakh in pending additional fees would pay only ₹50,000 under this scheme.

Our team at KBR & Co. is equipped to prepare, review, and file all pending documents within the scheme timeline.

**Contact us** at info@kbrandco.com or call +91 95660 05748 to schedule a consultation.`,
      category: 'Corporate Law',
      read_time: '12 min read',
      published: true,
      published_at: '2026-02-25'
    },
    {
      slug: 'tax-amendments-budget-2026-27',
      title: 'Tax Amendments in Union Budget 2026-27: A Complete Guide',
      excerpt: 'Comprehensive section-wise analysis of every Direct Tax, TDS/TCS, Corporate Tax, Capital Markets, GST, and Customs amendment introduced by Finance Bill 2026.',
      content: `# Tax Amendments in Union Budget 2026-27

The Finance Bill 2026 introduced substantive changes across direct taxes, TDS/TCS provisions, corporate taxation, capital markets, GST, and customs duties. This guide provides a section-wise analysis for businesses and advisors.

## Direct Tax: Key Changes

### New Income Tax Act 2025 — Commencement
The government has notified the effective date for the New Income Tax Act, 2025 provisions. Businesses must review their compliance frameworks against the revised structure.

### Personal Income Tax — Revised Slabs
The new tax regime has been further rationalized with revised slab rates effective FY 2026-27:
- Up to ₹4 lakh: Nil
- ₹4–8 lakh: 5%
- ₹8–12 lakh: 10%
- ₹12–16 lakh: 15%
- ₹16–20 lakh: 20%
- ₹20–24 lakh: 25%
- Above ₹24 lakh: 30%

### Revised TDS Rates
Key TDS changes effective from April 1, 2026:
- Section 194C: Threshold for single contract payments revised
- Section 194J: Professional and technical fees — rate rationalization
- Section 194N: Cash withdrawal threshold enhanced for specified entities

## Corporate Tax

### MAT Reforms
The Minimum Alternate Tax computation has been revised with updated book profit adjustments, particularly for entities with deferred tax assets and liabilities.

### STT Revisions
Securities Transaction Tax rates modified for F&O contracts and equity delivery transactions — detailed notification expected before April 1, 2026.

## GST Amendments

### Rate Rationalization
The GST Council's rate rationalization recommendations from 2025 have been partially implemented, with revised rates for select goods under hospitality, healthcare, and EVs.

### ITC Provisions
Enhanced Input Tax Credit availability for capital goods in manufacturing — relevant for infrastructure and pharmaceutical clients.

### Composition Scheme Threshold
Turnover threshold for composition scheme enhanced, providing relief to smaller businesses.

## Customs Rationalization

Significant changes to basic customs duty on electronic components, semiconductor raw materials, and specified textiles — aimed at promoting domestic manufacturing under Make in India.

## Action Points for Businesses

1. Review TDS deduction procedures against revised rates effective April 1, 2026
2. Update accounting software and payroll systems for revised slab rates
3. Assess GST rate changes for your specific products/services
4. Evaluate MAT exposure under revised computation
5. Engage your CA for an impact assessment specific to your business

**KBR & Co.** offers comprehensive Budget impact analysis sessions. Contact us at info@kbrandco.com.`,
      category: 'Tax',
      read_time: '25 min read',
      published: true,
      published_at: '2026-02-02'
    },
    {
      slug: 'budget-2025-review-2026-expectations',
      title: 'Union Budget 2025: Promises vs Reality & Budget 2026 Expectations',
      excerpt: 'Comprehensive analysis of Budget 2025\'s performance against stated targets, and expert predictions for Union Budget 2026. Essential reading for business owners.',
      content: `# Union Budget 2025: Promises vs Reality

## Overview

The Union Budget 2025 was presented on February 1, 2025 with ambitious targets. Twelve months later, here is a candid assessment of what was delivered versus promised — and what businesses should expect from Budget 2026.

## Key Metrics: Delivered vs Promised

### GDP Growth
- **Target**: 7.5% real GDP growth
- **Actual**: 7.3% (marginally below target but strong by global standards)

### Inflation
- **Target**: CPI at 4% (RBI medium-term target)
- **Actual**: 2.6% — significantly better than target, driven by eased food prices

### Fiscal Deficit
- **Target**: 4.9% of GDP
- **Actual**: Broadly on track at ~4.8% — fiscal consolidation on course

### Capital Expenditure
- **Target**: ₹11.11 lakh crore
- **Actual**: ~88% utilization by Q3 — reasonable given project execution timelines

## Sector-Specific Assessment

### Infrastructure
Capital expenditure on highways and railways showed solid traction. NHAI highway construction exceeded targets. Metro projects in Tier-2 cities saw meaningful progress.

### Manufacturing
PLI schemes delivered mixed results — electronics and mobile manufacturing overperformed. Pharmaceuticals showed growth. Textiles and specialty chemicals underperformed against targets.

### MSME Sector
Credit guarantee enhancement helped, but credit off-take remained uneven. The delayed MSME payment enforcement mechanism saw limited judicial action.

### Startups
DPIIT-recognized startup numbers grew but the removal of angel tax generated more enthusiasm than actual deal-flow improvement in early-stage funding.

## Budget 2026 Expectations

Based on the macro trajectory, outstanding policy commitments, and political calendar, Budget 2026 is expected to focus on:

1. **Middle-class Tax Relief**: Further personal income tax rationalization under the new regime
2. **MSME Support**: Enhanced credit guarantees, technology adoption incentives, reduced compliance burden
3. **Infrastructure Continuity**: Sustained capex, especially road, rail, and urban infrastructure
4. **Digital Economy**: Incentives for AI, semiconductor design, and deep-tech R&D
5. **Employment Generation**: PLI scheme expansion with employment-linked incentives
6. **Green Transition**: EV ecosystem incentives, renewable energy manufacturing push

## Impact on Chennai Businesses

Chennai's manufacturing and engineering sectors stand to benefit from continued PLI scheme expansion. The IT/ITeS sector will watch for global minimum tax (Pillar Two) implementation guidance. Logistics companies will benefit from GST compliance simplifications.

## Advisory Note

Businesses should review their capital expenditure plans and depreciation elections before March 31, 2026 to optimize FY 2025-26 tax positions before Budget 2026 changes take effect.

*— CA K. R. Prasanna Bhaskaran, FCA | Senior Partner, KBR & Co.*`,
      category: 'Tax',
      read_time: '17 min read',
      published: true,
      published_at: '2026-01-29'
    }
  ];

  for (const p of posts) {
    await pool.query(
      `INSERT INTO blog_posts (slug, title, excerpt, content, category, read_time, published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [p.slug, p.title, p.excerpt, p.content, p.category, p.read_time, p.published, p.published_at]
    );
  }
  console.log('Blog posts seeded');
}

module.exports = { pool, initDB };
