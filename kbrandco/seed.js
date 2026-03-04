require('dotenv').config();
const { pool, initDB } = require('./db');

const posts = [
  {
    title: 'CCFS-2026: MCA\'s One-Time Amnesty – Pay Only 10% Additional Fees',
    slug: 'ccfs-2026-mca-amnesty-scheme',
    excerpt: 'MCA launches Companies Compliance Facilitation Scheme, 2026 — file all pending annual returns by paying only 10% of additional fees. Window: April 15 – July 15, 2026.',
    tags: 'MCA,Company Law,Compliance,ROC',
    read_time: 12,
    published: true,
    content: `## Overview

The Ministry of Corporate Affairs (MCA) has launched the **Companies Compliance Facilitation Scheme, 2026 (CCFS-2026)**, a one-time amnesty window for companies with pending annual filings.

## Key Highlights

- **Fee Relief:** Pay only **10% of the additional fees** that would otherwise apply on delayed filings
- **Window Period:** April 15, 2026 – July 15, 2026 (3 months)
- **Forms Covered:** 17 forms including AOC-4, MGT-7, ADT-1, DIR-3 KYC, and others
- **Dormant Status:** Companies opting for dormancy under Section 455 pay only 50% of additional fees
- **Strike-off Protection:** Companies facing strike-off can regularise at 25% of additional fees
- **Prosecution Immunity:** Immunity from prosecution for defaults regularised under the scheme

## Who Can Benefit?

- Companies with pending ROC annual filings for multiple years
- Companies that missed AGM deadlines
- Companies with director KYC defaults
- Companies seeking to avoid strike-off action

## What Cannot Be Regularised?

- Companies already under NCLT proceedings
- Companies where investigations are pending
- Certain Section 8 companies with specific defaults

## Actionable Steps for Our Clients

1. Identify all pending ROC filings for your company
2. Calculate the reduced fees applicable under the scheme
3. File all pending forms before July 15, 2026
4. Maintain records of all filings for future compliance

**Contact KBR & Co.** for assistance in identifying pending filings and completing your ROC compliance under this amnesty scheme.`
  },
  {
    title: 'Tax Amendments in Union Budget 2026-27: A Complete Guide',
    slug: 'tax-amendments-budget-2026-27',
    excerpt: 'Comprehensive section-wise guide to every Direct Tax, TDS/TCS, Corporate Tax, Capital Markets, GST, and Customs amendment introduced by Finance Bill 2026.',
    tags: 'Budget,Income Tax,GST,TDS,Finance Bill',
    read_time: 25,
    published: true,
    content: `## Introduction

The Union Budget 2026-27 presented by the Finance Minister on February 1, 2026 introduced significant amendments across direct taxes, indirect taxes, and capital markets regulation. This comprehensive guide covers every material change.

## New Income Tax Act, 2025

The Finance Bill 2026 continues the transition to the **New Income Tax Act, 2025** — a complete rewrite of the Income Tax Act, 1961. Key structural changes:

- Simplified language and codification of judicial interpretations
- Consolidation of exemptions and deductions
- Phased implementation timeline

## Direct Tax Amendments

### Personal Income Tax
- Revised slab rates under the new regime
- Enhanced standard deduction for salaried employees
- New 87A rebate limits

### TDS/TCS Amendments
- Revised TDS rates on several payment categories
- New TDS obligation on virtual digital assets
- Enhanced TCS on foreign remittances under LRS

### Corporate Tax
- MAT rate adjustments for certain categories
- Enhanced depreciation for green energy assets
- New deduction for R&D expenditure

## Capital Markets

- **STT Changes:** Revised Securities Transaction Tax rates
- **LTCG:** Amendments to long-term capital gains provisions
- **Buybacks:** Tax treatment changes for share buybacks

## GST Amendments

Several GST Council recommendations implemented:
- Rate rationalisation for specific goods and services
- ITC claims timeline modifications
- GSTR filing sequence changes

## Customs Rationalization

- Reduced customs duty on critical raw materials
- Enhanced duty on specific finished goods
- New tariff classifications

*This analysis is based on the Finance Bill 2026 as introduced. Enacted provisions may differ. Consult KBR & Co. for advice specific to your business.*`
  },
  {
    title: 'Union Budget 2025: Promises vs Reality & Budget 2026 Expectations',
    slug: 'budget-2025-review-2026-expectations',
    excerpt: 'Comprehensive analysis of Budget 2025\'s performance and expert predictions for Budget 2026. Essential reading for business owners ahead of February 1 announcement.',
    tags: 'Budget,Economy,Tax Planning,GDP',
    read_time: 17,
    published: true,
    content: `## Budget 2025 – One Year On

As we approach Budget 2026-27, it is instructive to assess the performance of Budget 2025 against its stated objectives.

### GDP Growth: Delivered

Budget 2025 projected GDP growth of **7.3%** for FY 2024-25. Advance estimates confirm this target was broadly met, driven by:
- Strong manufacturing sector performance
- Resilient services exports
- Government capex push

### Inflation Control: Success Story

The government's fiscal discipline contributed to CPI inflation moderating to **2.6%** in Q3 FY25 — well within the RBI's 2-6% target band.

### Sector-Specific Performance

**Manufacturing:** PLI scheme showed mixed results — electronics and pharma outperformed; textiles lagged targets.

**Infrastructure:** ₹11.11 lakh crore capex largely deployed. NH construction hit record 13,000+ km.

**MSMEs:** Enhanced credit guarantee scheme provided relief but uptake was below projections.

### What Didn't Work

- Disinvestment proceeds fell significantly short of the ₹50,000 crore target
- Agricultural income growth lagged the overall GDP growth rate
- Employment generation targets in manufacturing remained elusive

## Budget 2026 Expectations

### For Business Owners

1. **Tax Rate Stability:** No major rate changes expected; focus on simplification
2. **MSME Credit:** Enhanced collateral-free lending limits likely
3. **Green Energy:** Tax incentives for solar, EV, and green hydrogen
4. **Housing:** Continued push for affordable housing deductions

### For Individual Taxpayers

- Further simplification of new tax regime
- Possible increase in 80C equivalent deduction
- Enhanced NPS deduction limits

### For CA Firms and Advisors

- Continued digitisation of tax administration
- Possible mandatory e-assessment for larger assessees
- New faceless proceedings framework extensions

*Budget analysis by CA K R Prasanna Bhaskaran, KBR & Co.*`
  }
];

(async () => {
  try {
    await initDB();
    for (const post of posts) {
      await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, tags, read_time, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING`,
        [post.title, post.slug, post.excerpt, post.content, post.tags, post.read_time, post.published]
      );
      console.log(`✅ Seeded: ${post.title}`);
    }
    console.log('🎉 Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
