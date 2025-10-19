# Vendor Integration Guide

## Overview

ReddiTech's Curious Auth Builder now includes **real-world vendor examples** throughout the course, providing learners with practical context for how OAuth 2.0, OIDC, SAML, and other IAM technologies are implemented by actual platforms.

## New Content Added

### 1. Vendor Implementations Lesson

**File:** `data/vendor-implementations.ts`

**Lesson:** "OAuth 2.0 in the Real World: Vendor Implementations"
- **Duration:** 30 minutes
- **Level:** Intermediate

**Coverage:**
- **Okta / Auth0** - Standards-first developer experience
- **Microsoft Entra ID** (Azure AD) - Enterprise powerhouse
- **Google Identity Platform** - CIAM simplified
- **AWS Cognito** - AWS-native identity
- **Ory Hydra** - Open-source OAuth 2.0 provider

**What Students Learn:**
- Real API patterns from each vendor
- Code examples with actual SDKs
- Decision matrix for choosing vendors
- Unique characteristics and trade-offs

### 2. Advanced Ory Hands-On Lab

**File:** `data/vendor-implementations.ts`

**Lesson:** "Build Your Own OAuth Server with Ory"
- **Duration:** 60 minutes
- **Level:** Advanced
- **Type:** Hands-on practical lab

**What Students Do:**
1. Deploy Ory Hydra (OAuth 2.0 server) with Docker
2. Deploy Ory Kratos (identity management)
3. Build a consent app to connect them
4. Implement complete OAuth authorization code flow
5. Inspect and validate tokens
6. Understand provider internals

**Key Insights:**
- How headless OAuth providers work
- Separation between identity and token issuance
- Challenge-response pattern for login/consent
- Why modular architecture matters
- Production deployment considerations

## How to Integrate These Lessons

### Option 1: Add to Module 2 (OAuth 2.0)

Add these lessons to the end of the OAuth 2.0 module for students who want deeper, real-world context:

```typescript
// In data/modules/02-oauth2.ts
import { vendorOAuth2Lesson, oryHandsOnLab } from "@/data/vendor-implementations"

export const oauth2Module: Module = {
  // ... existing module config
  lessons: [
    // ... existing 6 lessons
    vendorOAuth2Lesson,    // Lesson 7: Vendor implementations
    oryHandsOnLab,         // Lesson 8: Ory hands-on lab (advanced)
  ],
  // ...
}
```

### Option 2: Create a Bonus "Real-World IAM" Module

Create a dedicated module for vendor-specific content:

```typescript
// data/modules/08-real-world-iam.ts
export const realWorldIAMModule: Module = {
  id: "real-world-iam",
  title: "Real-World IAM: Vendor Platforms & Hands-On Labs",
  slug: "real-world-iam",
  difficulty: "intermediate",
  lessons: [
    vendorOAuth2Lesson,
    oryHandsOnLab,
    // Future: OIDC vendor comparison
    // Future: SAML enterprise platforms
    // Future: Passkey implementations
  ]
}
```

## Vendor Philosophy

### Our Approach

✅ **Vendor-Agnostic Standards Teaching**
- Primary lessons focus on standards (RFC 6749, OpenID Core, etc.)
- Concepts explained without vendor bias
- Emphasize protocol compliance over specific platforms

✅ **Realistic Real-World Context**
- Show how standards manifest in actual products
- Compare implementation differences
- Provide decision-making frameworks

✅ **Open Source Emphasis**
- Highlight Ory as self-hosted alternative
- Provide hands-on labs students can run locally
- No vendor lock-in messaging

✅ **Balanced Coverage**
- Cover major commercial vendors (Okta, Microsoft, Google, AWS)
- Include developer-first platforms (Clerk, Stytch, FusionAuth)
- Showcase open-source options (Ory, Keycloak, ZITADEL)

### What We Avoid

❌ Vendor marketing language
❌ Recommending one vendor over others
❌ Affiliate links or partnerships
❌ Incomplete or biased comparisons

## Source Material

All vendor content is based on:
- Official vendor documentation
- Public API specifications
- Open-source code repositories
- `reference-docs/vendors.md` research document

## Vendor Coverage by Standard

| Standard | Covered Vendors |
|----------|----------------|
| **OAuth 2.0 / OIDC** | Okta/Auth0, Microsoft Entra, Google Identity, AWS Cognito, Ory Hydra, Keycloak, Clerk, Stytch, FusionAuth |
| **SAML 2.0** | Microsoft Entra, Google Identity, Ping, ForgeRock, Ory Polis, Keycloak |
| **WebAuthn/FIDO2** | Microsoft Entra, Ping, AWS Cognito, Ory Kratos, Stytch, Descope, FusionAuth |
| **Fine-Grained AuthZ** | Ory Keto, AuthZed/SpiceDB, Aserto, Permit.io, Cerbos, OPA |

## Future Vendor Content Plans

### Planned Lessons

1. **OIDC Vendor Comparison** (Module 3)
   - How Okta, Microsoft, Google implement ID Tokens
   - Discovery document differences
   - UserInfo endpoint variations

2. **SAML Enterprise Platforms** (Module 4)
   - Microsoft Entra SAML configuration
   - Okta SAML app setup
   - Ory Polis SAML bridging

3. **Passkey Implementations** (Module 5)
   - Microsoft Authenticator passkeys
   - Apple Passkeys (iCloud Keychain)
   - Ory Kratos WebAuthn setup
   - Stytch passkey API

4. **Authorization Platforms** (Module 6)
   - Ory Keto hands-on lab (Zanzibar-style ReBAC)
   - SpiceDB comparison
   - OPA policy examples

## Usage Guidelines for Students

### When to Use Vendor Lessons

**Use vendor lessons to:**
- See how standards apply in real products
- Make technology choices for projects
- Understand API patterns before implementation
- Prepare for job interviews

**Use hands-on labs to:**
- Deepen understanding of protocols
- Experiment risk-free locally
- Build portfolio projects
- Learn self-hosted alternatives

### Prerequisites

**For Vendor Implementations Lesson:**
- Complete OAuth 2.0 core lessons (Module 2, Lessons 1-6)
- Understand authorization code flow and token types

**For Ory Hands-On Lab:**
- Docker installed and running
- Basic command-line skills
- Node.js knowledge (for consent app)
- 60 minutes of dedicated time

## Technical Notes

### Code Examples

All vendor code examples:
- Use latest SDK versions (as of 2025)
- Follow official documentation patterns
- Include error handling
- Use TypeScript for type safety
- Are tested against vendor docs

### Maintenance

- Review vendor content quarterly
- Update SDK versions annually
- Verify API endpoints remain valid
- Check for deprecated features
- Monitor vendor documentation changes

## Attribution

Vendor information sourced from:
- `reference-docs/vendors.md` - Vendor research compilation
- Official vendor documentation (links in lessons)
- Open-source repositories (Ory, Keycloak, etc.)
- W3C and IETF specifications

## Questions & Feedback

If students find:
- Outdated vendor information
- Broken code examples
- Missing popular vendors
- Inaccurate comparisons

→ Direct them to course GitHub issues or references page

---

**Last Updated:** 2025-10-18
**Maintained By:** ReddiTech Course Development Team
**Built With:** Claude Code by Anthropic
