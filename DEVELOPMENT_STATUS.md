# ReddiTech's Curious Auth Builder Training Course
## Development Status & Plan

**Last Updated:** 2025-10-18
**Built with:** Claude Code (Anthropic)

---

## ✅ Completed Components

### 1. Design System & Theme
- **Professional color palette**:
  - Deep navy primary (`oklch(0.35 0.08 240)`)
  - Electric blue accent (`oklch(0.65 0.18 230)`)
  - Achievement gold (`oklch(0.75 0.15 85)`)
  - Difficulty-level colors (beginner/intermediate/expert)
- **Dark mode support** with optimized contrast
- **Tailwind CSS 4** configuration with custom theme tokens
- **Geist Sans + Mono** typography
- **Location:** `app/globals.css`

### 2. Type System
- Complete TypeScript definitions for all entities
- **Core types:** Module, Lesson, Quiz, UserProgress, LearningStats
- **UI component props** for cards, badges, etc.
- **Location:** `types/index.ts`

### 3. Data Layer
- **localStorage utility** with full CRUD operations
- User progress tracking (lessons, quizzes, time spent)
- Badge awarding system
- Learning stats calculation
- Export/import functionality
- **Location:** `lib/storage.ts`

### 4. Course Content - Beginner Level (✅ Complete)

#### Module 1: Authentication vs Authorization Fundamentals
**Status:** ✅ Complete (5 lessons, 10 quiz questions)
- Lesson 1: Authentication vs Authorization: The Foundation
- Lesson 2: Identity Providers and Relying Parties
- Lesson 3: Token Types (Access, ID, Refresh Tokens)
- Lesson 4: Claims, Scopes, and Audiences
- Lesson 5: IAM Evolution (LDAP → SAML → OAuth → OIDC → FIDO)
- **Badge:** 🔐 Identity Foundations

#### Module 2: OAuth 2.0 - Delegated Authorization
**Status:** ✅ Complete (6 lessons, 10 quiz questions)
- Lesson 1: The Four Roles of OAuth 2.0
- Lesson 2: Authorization Code Flow with PKCE
- Lesson 3: Client Credentials Flow (M2M)
- Lesson 4: Device Code Flow (Smart TVs, IoT)
- Lesson 5: Token Lifecycle (Introspection, Revocation, Rotation)
- Lesson 6: OAuth 2.0 Security Pitfalls
- **Badge:** 🔑 OAuth 2.0 Master

---

## 🚧 Pending Modules (Intermediate + Expert)

### Module 3: OpenID Connect (OIDC)
**Difficulty:** Intermediate | **Status:** 📝 Planned
**Estimated:** 4 hours | 5-6 lessons

**Planned Content:**
1. OIDC Overview: Authentication Layer over OAuth
2. ID Token Deep Dive (JWT structure, claims, validation)
3. OIDC Flows (Authorization Code + OIDC, Hybrid Flow)
4. UserInfo Endpoint & Discovery Document
5. Enterprise SSO with OIDC
6. OIDC vs SAML Comparison

**Learning Objectives:**
- Understand why OAuth 2.0 alone doesn't handle authentication
- Validate and parse ID Tokens
- Implement OIDC authentication in applications
- Configure OIDC for enterprise SSO

### Module 4: SAML 2.0 - XML-Based Federation
**Difficulty:** Intermediate | **Status:** 📝 Planned
**Estimated:** 3 hours | 4-5 lessons

**Planned Content:**
1. SAML Architecture (IdP, SP, Assertions)
2. SAML Bindings & Profiles (HTTP-Redirect, HTTP-POST)
3. SAML Assertions vs OIDC ID Tokens
4. Enterprise SSO with SAML
5. SAML Security Challenges (XML Signature Wrapping)

**Learning Objectives:**
- Understand SAML's role in enterprise identity
- Distinguish SAML from OAuth/OIDC
- Identify when to use SAML vs OIDC
- Recognize common SAML security vulnerabilities

### Module 5: FIDO2, WebAuthn & Passwordless Authentication
**Difficulty:** Intermediate | **Status:** 📝 Planned
**Estimated:** 4 hours | 5 lessons

**Planned Content:**
1. The Problem with Passwords
2. FIDO2 Architecture (WebAuthn API, CTAP2)
3. Public Key Cryptography in Authentication
4. Passkeys: Synced FIDO2 Credentials
5. Implementing WebAuthn (Registration & Authentication)

**Learning Objectives:**
- Understand public key authentication flow
- Distinguish device-bound vs synced credentials
- Implement WebAuthn in web applications
- Explain phishing resistance benefits

### Module 6: Fine-Grained Authorization (Google Zanzibar)
**Difficulty:** Expert | **Status:** 📝 Planned
**Estimated:** 3.5 hours | 4 lessons

**Planned Content:**
1. Beyond RBAC: Relationship-Based Access Control (ReBAC)
2. Zanzibar Architecture (Tuple Store, Check API, Watch API)
3. Modeling Permissions with Tuples
4. Comparison: Zanzibar vs OPA vs AuthZed/SpiceDB

**Learning Objectives:**
- Model complex authorization relationships
- Understand Google Zanzibar's architecture
- Compare centralized vs decentralized authorization
- Design permission systems for multi-tenant SaaS

### Module 7: Emerging IAM Trends & Enterprise Patterns
**Difficulty:** Expert | **Status:** 📝 Planned
**Estimated:** 5 hours | 6 lessons

**Planned Content:**
1. Decentralized Identity (DIDs, Verifiable Credentials)
2. Continuous Access Evaluation (CAE)
3. Zero Trust Architecture
4. Identity as Code
5. Security vs Usability Trade-offs
6. Compliance & Governance (GDPR, NIST 800-63B)

**Learning Objectives:**
- Evaluate emerging identity standards
- Design Zero Trust architectures
- Balance security requirements with UX
- Navigate compliance requirements

---

## 🎯 Next Development Phases

### Phase 1: UI Components (Current Priority)
- [ ] ModuleCard component
- [ ] LessonCard component
- [ ] QuizCard component
- [ ] ProgressBar component
- [ ] Badge component
- [ ] Navigation components (Sidebar, Breadcrumbs)

### Phase 2: Core Pages
- [ ] Landing page with hero + module overview
- [ ] Learning hub with sidebar navigation
- [ ] Module overview page
- [ ] Lesson viewer with rich content
- [ ] Quiz interface with scoring
- [ ] Progress dashboard

### Phase 3: Content Completion
- [ ] Module 3: OIDC (5-6 lessons + quiz)
- [ ] Module 4: SAML (4-5 lessons + quiz)
- [ ] Module 5: FIDO2/WebAuthn (5 lessons + quiz)
- [ ] Module 6: Zanzibar (4 lessons + quiz)
- [ ] Module 7: Emerging Trends (6 lessons + quiz)

### Phase 4: Enhanced Features
- [ ] Code syntax highlighting (Prism.js or Shiki)
- [ ] Interactive diagrams (Mermaid.js)
- [ ] Certificate generation (PDF/image)
- [ ] References/attribution page
- [ ] Progress export/import
- [ ] Search functionality

### Phase 5: Polish & Testing
- [ ] Responsive design testing
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Content accuracy review

---

## 📚 Reference Materials Used

Content sourced from the following authoritative materials (located in `reference-docs/`):

1. **RFC 6749** - OAuth 2.0 Authorization Framework
2. **OAuth 2.0 and OpenID Connect: The Professional Guide** (PDF)
3. **The OpenID Connect Handbook** v1.1 (PDF)
4. **Web Authentication API - Level 2** W3C Specification (PDF)
5. **NIST Special Publication 5068** (PDF)

Additional web research conducted to verify factual accuracy and incorporate industry best practices.

---

## 🏗️ Architecture Notes

### Content Structure
- Modular design: Each module is self-contained
- Progressive difficulty: Beginner → Intermediate → Expert
- Prerequisite tracking: Later modules build on earlier concepts
- Rich content types: text, code examples, diagrams, interactive elements

### State Management
- Client-side only (no backend required)
- localStorage for persistence
- Optimistic UI updates
- Export/import for backup

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **TypeScript:** Strict mode
- **Code Quality:** Biome 2.2.0
- **Fonts:** Geist Sans + Geist Mono

### Design Philosophy
- **Professional authority:** Deep navy/slate theme conveys expertise
- **Achievement-oriented:** Gold badges reward completion
- **Progress-driven:** Visual indicators at every level
- **Accessible:** WCAG AA compliance target
- **Anonymous-friendly:** No registration required, localStorage only

---

## 📝 Credits

**Course Design & Content:** ReddiTech
**Development Assistant:** Claude Code by Anthropic
**Reference Materials:** See references page (to be created)

Built with Claude Code to create comprehensive, factually accurate IAM training content.
