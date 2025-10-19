/**
 * Module 8: Self-Sovereign Identity & Decentralized Identity
 *
 * This module covers the paradigm shift from centralized identity providers to
 * user-controlled, decentralized identity systems using DIDs and Verifiable Credentials.
 */

import type { Module } from "@/types"

export const ssiDecentralizedIdentityModule: Module = {
  id: "ssi-decentralized-identity",
  slug: "ssi-decentralized-identity",
  title: "Self-Sovereign Identity & Decentralized Identity",
  description:
    "Master the future of digital identity with Self-Sovereign Identity (SSI), Decentralized Identifiers (DIDs), Verifiable Credentials, and user-controlled identity systems.",
  icon: "🆔",
  difficulty: "advanced",
  estimatedHours: 3,
  prerequisiteModules: ["auth-fundamentals", "oidc"],
  learningObjectives: [
    "Understand the principles of Self-Sovereign Identity (SSI)",
    "Master Decentralized Identifiers (DIDs) and DID methods",
    "Learn Verifiable Credentials (VCs) and Verifiable Presentations (VPs)",
    "Implement selective disclosure and zero-knowledge proofs",
    "Build SSI applications with digital wallets",
    "Understand DIDComm protocol for peer-to-peer communication",
    "Navigate the SSI ecosystem and standards (W3C, EU eIDAS 2.0)"
  ],
  badge: {
    id: "ssi-expert",
    name: "SSI & Decentralized Identity Expert",
    description:
      "Mastered Self-Sovereign Identity, DIDs, Verifiable Credentials, and decentralized identity systems",
    icon: "🆔"
  },
  lessons: [
    {
      id: "ssi-fundamentals",
      slug: "ssi-fundamentals",
      title: "Self-Sovereign Identity Fundamentals",
      description:
        "Understanding the paradigm shift from centralized identity to user-controlled SSI, principles, and the trust triangle",
      estimatedMinutes: 40,
      content: [
        {
          type: "text",
          title: "The Identity Problem",
          content: `
In today's digital world, your identity is scattered across hundreds of centralized systems. Every time you create an account, you're **giving away control** of your identity data.

## Current Identity Landscape Problems

### 1. **Fragmented Identity**
You have different identities everywhere:
- Google account for email
- LinkedIn for professional identity
- Government database for official identity
- Bank accounts for financial identity
- Social media profiles for social identity

**Problem:** You don't own any of these. Each provider owns your identity data.

### 2. **Privacy Violations**
\`\`\`
You: "I just want to buy alcohol. I'm over 21."
Cashier: "Show me your driver's license."
[You reveal: Name, address, exact birthdate, photo, license number, organ donor status...]
\`\`\`

**Problem:** You shared 10× more data than needed. You only needed to prove "I'm over 21."

### 3. **Data Breaches**
- 2023: 3.2 billion records breached globally
- Your SSN, passport, medical records leaked from systems **you didn't choose to trust**
- No way to revoke credentials after breach

**Problem:** Centralized honeypots attract attackers. You have no control.

### 4. **Vendor Lock-In**
- Your professional reputation is trapped in LinkedIn
- Can't easily move reviews, connections, history to another platform
- Provider can ban you, losing all identity data

**Problem:** No portability. Platforms control your digital existence.

### 5. **No User Consent**
- Platforms share your data with third parties
- You can't selectively disclose attributes
- All-or-nothing: "Give us everything or don't use our service"

**Problem:** No granular control over your own data.

## The Self-Sovereign Identity Solution

**Self-Sovereign Identity (SSI)** flips the model: **You own and control your digital identity.**

### Core Concept

\`\`\`
Traditional Identity:
User → Identity Provider (Google, Facebook, Gov't) → Service
      [Provider controls data]

Self-Sovereign Identity:
User [owns identity data in digital wallet] → Service
      [User controls data, chooses what to share]
\`\`\`

### Key Principles (Christopher Allen's 10 Principles of SSI)

1. **Existence**: You must have an independent existence
   - Your identity exists without any company or government
   - You create your own Decentralized Identifier (DID)

2. **Control**: You control your identity
   - You hold private keys
   - No one can access your data without permission
   - You decide what to share, when, and with whom

3. **Access**: You must have access to your own data
   - All credentials stored in your wallet
   - No platform can deny you access to your own identity

4. **Transparency**: Systems and algorithms must be transparent
   - Open standards (W3C DIDs, Verifiable Credentials)
   - No proprietary lock-in

5. **Persistence**: Identities must be long-lived
   - Your DID works forever (or as long as you want)
   - Portable across platforms and services

6. **Portability**: Information must be transportable
   - Take your credentials anywhere
   - Not locked to a single vendor

7. **Interoperability**: Identities should be widely usable
   - Same credential works across different services
   - Based on open standards

8. **Consent**: You must agree to the use of your identity
   - Every data sharing requires explicit consent
   - Selective disclosure: share only what's needed

9. **Minimization**: Disclosure of claims must be minimized
   - Prove "I'm over 21" without revealing birthdate
   - Zero-knowledge proofs

10. **Protection**: Rights of users must be protected
    - Privacy by design
    - Legal frameworks (GDPR, eIDAS 2.0)

## The Three Pillars of SSI

### Pillar 1: Decentralized Identifiers (DIDs)

**What:** Globally unique identifiers **you** create and control

**Example DID:**
\`\`\`
did:ethr:0x1234567890abcdef
did:ion:EiClWZ5MQmYPkjGkU0T4WD9Ar7z8E6fL
did:web:example.com:user:alice
\`\`\`

**How it works:**
- You generate a public/private key pair
- Create a DID from your public key
- DID resolves to a DID Document (contains public keys, endpoints)
- You prove ownership by signing with private key

**No registration needed.** You don't ask permission. You just create it.

### Pillar 2: Verifiable Credentials (VCs)

**What:** Digital credentials cryptographically signed by issuers

**Examples:**
- University diploma (signed by university)
- Driver's license (signed by DMV)
- Employment verification (signed by employer)
- Proof of age (signed by government)

**Structure:**
\`\`\`json
{
  "@context": "https://www.w3.org/2018/credentials/v1",
  "type": ["VerifiableCredential", "UniversityDegree"],
  "issuer": "did:web:stanford.edu",
  "issuanceDate": "2024-06-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:ethr:0xalice...",
    "degree": {
      "type": "BachelorDegree",
      "name": "Computer Science"
    }
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-06-15T00:00:00Z",
    "proofValue": "z3FXQje...signature..."
  }
}
\`\`\`

**Key properties:**
- ✅ Tamper-evident (cryptographic signature)
- ✅ Portable (store in your wallet, share anywhere)
- ✅ Privacy-preserving (selective disclosure)
- ✅ Revocable (issuer can revoke if needed)

### Pillar 3: Digital Wallets

**What:** Software (mobile app, browser extension) that stores your DIDs and credentials

**Functions:**
- Store credentials securely (encrypted)
- Create Verifiable Presentations (choose what to share)
- Authenticate with services
- Receive new credentials from issuers

**Examples:**
- Microsoft Entra Verified ID app
- EU Digital Identity Wallet (EUDI)
- Trinsic Wallet
- Velocity Network credentials

## The Trust Triangle

SSI involves three roles that form the "Trust Triangle":

\`\`\`
        Issuer
      (University)
         /  \\
        /    \\
    Issues   Trusts
      VC      Issuer
      /        \\
     /          \\
 Holder  ----→  Verifier
(You)   Presents  (Employer)
        VP
\`\`\`

### 1. **Issuer**
- Organization with authority to issue credentials
- Examples: University, government, employer, bank
- **Action:** Signs Verifiable Credentials with their DID

### 2. **Holder** (You)
- Individual who receives and stores credentials
- **Action:** Stores VCs in wallet, creates Verifiable Presentations

### 3. **Verifier**
- Service that needs to verify your claims
- Examples: Employer checking degree, bar checking age, bank verifying identity
- **Action:** Verifies cryptographic signatures, checks issuer is trusted

### Example Flow: Job Application

**Setup:**
- Alice (Holder) graduated from Stanford
- Stanford (Issuer) has DID: \`did:web:stanford.edu\`
- Employer (Verifier) trusts Stanford's credentials

**Flow:**

1️⃣ **Credential Issuance** (happens once, at graduation)
\`\`\`
Stanford → Creates Verifiable Credential
         → Signs with Stanford's private key
         → Sends to Alice
Alice → Stores in digital wallet
\`\`\`

2️⃣ **Credential Presentation** (every job application)
\`\`\`
Employer → Requests proof of degree
Alice → Opens wallet
      → Selects Stanford diploma
      → Creates Verifiable Presentation
      → Signs with Alice's private key
      → Sends to Employer
\`\`\`

3️⃣ **Verification** (employer checks)
\`\`\`
Employer → Resolves Stanford's DID → Gets Stanford's public key
         → Verifies Stanford's signature ✅
         → Resolves Alice's DID → Gets Alice's public key
         → Verifies Alice's signature ✅
         → Checks credential not revoked ✅
         → ACCEPT: Alice has Stanford degree
\`\`\`

**Key insight:** Alice proved her degree **without contacting Stanford**. Employer verified it **without contacting Stanford**. Fully decentralized!
          `
        },
        {
          type: "diagram",
          title: "SSI Trust Triangle and Credential Flow",
          content: `sequenceDiagram
    participant Alice as Holder<br/>(Alice)
    participant Wallet as Digital Wallet
    participant Stanford as Issuer<br/>(Stanford University)
    participant Employer as Verifier<br/>(Employer)
    participant Blockchain as DID Registry<br/>(Blockchain/IPFS)

    Note over Stanford,Blockchain: Setup Phase
    Stanford->>Blockchain: Register DID + Public Key
    Alice->>Blockchain: Register DID + Public Key

    Note over Alice,Stanford: Credential Issuance (Graduation)
    Alice->>Stanford: Request diploma credential
    Stanford->>Stanford: Verify Alice graduated
    Stanford->>Stanford: Create Verifiable Credential
    Stanford->>Stanford: Sign with Stanford private key
    Stanford->>Wallet: Issue VC to Alice
    Wallet->>Wallet: Store credential securely

    Note over Alice,Employer: Credential Presentation (Job Application)
    Employer->>Alice: Request proof of degree
    Alice->>Wallet: Open wallet, select diploma
    Wallet->>Wallet: Create Verifiable Presentation
    Wallet->>Wallet: Sign VP with Alice private key
    Wallet->>Employer: Send Verifiable Presentation

    Note over Employer,Blockchain: Verification
    Employer->>Blockchain: Resolve Stanford DID → Public Key
    Employer->>Employer: Verify Stanford signature ✅
    Employer->>Blockchain: Resolve Alice DID → Public Key
    Employer->>Employer: Verify Alice signature ✅
    Employer->>Stanford: Check revocation status (optional)
    Employer->>Employer: DECISION: Accept credential`,
          caption:
            "Complete SSI flow showing credential issuance, storage, presentation, and verification in a decentralized system"
        },
        {
          type: "text",
          title: "SSI vs. Traditional Identity Systems",
          content: `
## Comparison: Traditional OAuth/SAML vs. SSI

| Aspect | Traditional (OAuth/SAML) | Self-Sovereign Identity (SSI) |
|--------|--------------------------|-------------------------------|
| **Identity Owner** | Identity Provider (Google, Facebook) | **User** (you own your DID) |
| **Data Storage** | Centralized servers | **Decentralized** (your wallet) |
| **Authentication** | IdP online required | **Offline possible** (cryptographic proof) |
| **Privacy** | IdP sees all logins | **Zero-knowledge possible** (prove claims without revealing data) |
| **Data Sharing** | All-or-nothing | **Selective disclosure** (share only what's needed) |
| **Portability** | Locked to IdP | **Portable** (take credentials anywhere) |
| **Single Point of Failure** | Yes (IdP downtime = no access) | **No** (distributed verification) |
| **Revocation** | IdP can ban you instantly | **Credential-level** (revoke specific credentials) |
| **Tracking** | IdP tracks all usage | **Minimal** (pairwise DIDs prevent correlation) |
| **Vendor Lock-in** | Yes | **No** (open standards) |

## Real-World SSI Use Cases

### 1. **Age Verification (Zero-Knowledge Proof)**

**Traditional way:**
\`\`\`
Bouncer: "Show me your ID"
You: [Hand over driver's license]
Bouncer sees: Name, address, exact birthdate, photo, license number, organ donor status
\`\`\`

**SSI way (with zero-knowledge proof):**
\`\`\`
Bouncer: "Prove you're over 21"
You: [Wallet creates ZK proof]
Bouncer sees: "This person is over 21: TRUE"
           + Issuer signature (DMV)
           + Nothing else
\`\`\`

✅ **Privacy preserved**: No personal data revealed, only the claim "over 21"

### 2. **Education Verification**

**Traditional:**
- Employer calls university to verify degree (takes days/weeks)
- University charges fee
- Privacy concerns: Employer learns more than needed

**SSI:**
- Instant cryptographic verification
- No need to contact university
- Free
- Student controls what information is shared

### 3. **Healthcare Records**

**Traditional:**
- Medical records locked in hospital systems
- Can't easily share between providers
- No patient control

**SSI:**
- You hold medical credentials in wallet
- Share specific records with new doctor
- Emergency responders can access critical info (if you authorize)
- Full audit trail of who accessed what

### 4. **Cross-Border Identity (EU Digital Identity Wallet)**

**Traditional:**
- Different IDs for different countries
- Bureaucracy when moving between countries
- Fragmented digital services

**SSI (EU eIDAS 2.0):**
- One wallet, works across all EU countries
- Use Finnish driver's license in Spain
- Access government services anywhere in EU
- Same wallet for private sector (banking, travel, etc.)

**Timeline:** Mandatory by 2026 for all EU member states

### 5. **Professional Credentials**

**Traditional:**
- LinkedIn profile (controlled by LinkedIn)
- Certifications in PDF (easily forged)
- Reference checks (time-consuming)

**SSI:**
- Employer issues verifiable employment credential
- Training providers issue verifiable certifications
- You control and present them anywhere
- Instant verification, tamper-proof

## SSI Benefits Summary

### For Users (Holders)
✅ **Own your identity** - No platform can take it away
✅ **Privacy** - Share only what's necessary
✅ **Portability** - One wallet, works everywhere
✅ **Security** - No central honeypot for hackers
✅ **Convenience** - Store everything in one place

### For Issuers (Universities, Governments)
✅ **Reduced costs** - No verification hotline needed
✅ **Fraud reduction** - Cryptographically secure
✅ **Scalability** - Issue millions of credentials
✅ **Compliance** - GDPR-friendly (user controls data)

### For Verifiers (Employers, Services)
✅ **Instant verification** - No waiting for issuer
✅ **Trust** - Cryptographic proof of authenticity
✅ **Cost savings** - No third-party verification services
✅ **Privacy-preserving** - Zero-knowledge proofs

## Challenges and Considerations

### 1. **Key Management**
❌ **Problem:** If you lose your private keys, you lose your identity
✅ **Solutions:**
- Social recovery (trusted contacts help recover)
- Multi-device sync (encrypted cloud backup)
- Hardware security modules (secure element in phone)

### 2. **Adoption**
❌ **Problem:** Network effects - need issuers AND verifiers
✅ **Progress:**
- EU mandating EUDI wallet (2026)
- Government pilots (Canada, Singapore, UK)
- Enterprise adoption (Microsoft, IBM, Workday)

### 3. **Complexity**
❌ **Problem:** Harder to understand than "Sign in with Google"
✅ **Solutions:**
- Better UX design
- Gradual adoption (start with simple use cases)
- Education

### 4. **Regulatory Uncertainty**
❌ **Problem:** Legal frameworks still evolving
✅ **Progress:**
- EU eIDAS 2.0 (2024)
- GDPR alignment
- National digital identity programs

### 5. **Revocation**
❌ **Problem:** How to revoke credentials efficiently and privately?
✅ **Solutions:**
- Status List 2021 (W3C standard)
- Cryptographic accumulators
- Blockchain-based revocation registries

## The Future of Identity

By 2030, SSI is predicted to be mainstream:

- **80% of new digital identities** will use SSI principles
- **Government adoption** in most developed nations
- **Enterprise SSI** for employee credentials, vendor management
- **Consumer SSI** for shopping, social media, healthcare

**The vision:** A world where you truly own your digital identity, control your data, and seamlessly prove claims without sacrificing privacy.
          `
        }
      ],
      quiz: {
        id: "ssi-fundamentals-quiz",
        title: "SSI Fundamentals Quiz",
        description: "Test your understanding of Self-Sovereign Identity principles and concepts",
        passingScore: 70,
        questions: [
          {
            id: "ssi-q1",
            question: "What is the PRIMARY difference between traditional identity systems (OAuth/SAML) and Self-Sovereign Identity?",
            options: [
              "SSI is faster than traditional systems",
              "In SSI, the user owns and controls their identity data instead of a centralized provider",
              "SSI doesn't require cryptography",
              "SSI only works with blockchain"
            ],
            correctAnswer: 1,
            explanation: "The fundamental difference is ownership and control. In traditional systems, identity providers (Google, Facebook, etc.) own and control your identity data. In SSI, YOU own your Decentralized Identifier (DID) and control your credentials through private keys."
          },
          {
            id: "ssi-q2",
            question: "In the SSI Trust Triangle, what are the three roles?",
            options: [
              "User, Server, Database",
              "Issuer, Holder, Verifier",
              "Client, Provider, Authenticator",
              "Sender, Receiver, Validator"
            ],
            correctAnswer: 1,
            explanation: "The Trust Triangle consists of: Issuer (issues credentials like a university), Holder (you - stores credentials in wallet), and Verifier (checks credentials like an employer). This model enables decentralized trust without a central authority."
          },
          {
            id: "ssi-q3",
            question: "What is the advantage of zero-knowledge proofs in SSI for age verification?",
            options: [
              "Faster verification speed",
              "You can prove you're over 21 without revealing your exact birthdate or other personal information",
              "The verifier doesn't need internet connection",
              "It's cheaper to implement"
            ],
            correctAnswer: 1,
            explanation: "Zero-knowledge proofs enable selective disclosure - you can prove a claim ('I am over 21') without revealing the underlying data (exact birthdate, name, address). This is a fundamental privacy feature of SSI that traditional IDs cannot provide."
          },
          {
            id: "ssi-q4",
            question: "According to Christopher Allen's principles, what does 'Persistence' mean in SSI?",
            options: [
              "Data must be backed up regularly",
              "Identities must be long-lived and work forever (or as long as the user wants)",
              "The system must always be online",
              "Credentials must be stored on blockchain"
            ],
            correctAnswer: 1,
            explanation: "Persistence means your digital identity should be long-lived and durable. Your DID should work indefinitely (or until you choose to deactivate it), not depend on a company staying in business or a service remaining available."
          },
          {
            id: "ssi-q5",
            question: "What happens if you lose your private keys in an SSI system?",
            options: [
              "You can reset your password like in traditional systems",
              "The identity provider can recover your account",
              "You lose access to your identity unless you have recovery mechanisms in place",
              "Nothing, your DID still works"
            ],
            correctAnswer: 2,
            explanation: "This is a critical challenge in SSI: losing your private keys means losing access to your DID and credentials. There's no 'forgot password' option. Solutions include social recovery (trusted contacts help recover), multi-device sync, or hardware security modules. This trade-off comes with true ownership and control."
          }
        ]
      }
    },
    {
      id: "dids-and-methods",
      slug: "dids-and-methods",
      title: "Decentralized Identifiers (DIDs) & DID Methods",
      description:
        "Deep dive into DID architecture, DID Documents, resolution, and comparing DID methods (did:web, did:key, did:ethr, did:ion)",
      estimatedMinutes: 45,
      content: [
        {
          type: "text",
          title: "Understanding Decentralized Identifiers (DIDs)",
          content: `
A **Decentralized Identifier (DID)** is a new type of identifier that is globally unique, resolvable with high availability, and cryptographically verifiable. DIDs are the foundation of Self-Sovereign Identity.

## DID Syntax

DIDs follow a simple URI scheme:

\`\`\`
did:method:method-specific-identifier
\`\`\`

**Examples:**
\`\`\`
did:ethr:0x1234567890abcdef1234567890abcdef12345678
did:web:example.com:user:alice
did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH
did:ion:EiClWZ5MQmYPkjGkU0T4WD9Ar7z8E6fL2aB1Hd5zPsU3dA
\`\`\`

### DID Components

1. **Scheme**: Always \`did:\`
2. **Method**: The DID method (determines how to create/resolve)
3. **Method-Specific Identifier**: Unique within that method

## DID Documents

When you resolve a DID, you get back a **DID Document** - a JSON-LD document containing:

- **Verification Methods**: Public keys for cryptographic verification
- **Authentication**: Which keys can authenticate as this DID
- **Service Endpoints**: Where to contact the DID subject
- **DID Controller**: Who controls this DID

### Example DID Document

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:example:123456789abcdefghi",
  "controller": "did:example:123456789abcdefghi",

  "verificationMethod": [{
    "id": "did:example:123456789abcdefghi#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
  }, {
    "id": "did:example:123456789abcdefghi#keys-2",
    "type": "JsonWebKey2020",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyJwk": {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ"
    }
  }],

  "authentication": [
    "did:example:123456789abcdefghi#keys-1",
    {
      "id": "did:example:123456789abcdefghi#keys-2",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:example:123456789abcdefghi",
      "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
    }
  ],

  "assertionMethod": [
    "did:example:123456789abcdefghi#keys-1"
  ],

  "capabilityInvocation": [
    "did:example:123456789abcdefghi#keys-1"
  ],

  "capabilityDelegation": [
    "did:example:123456789abcdefghi#keys-1"
  ],

  "keyAgreement": [{
    "id": "did:example:123456789abcdefghi#keys-3",
    "type": "X25519KeyAgreementKey2020",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyMultibase": "z9hFgmPVfmBZwRvFEyniQDBkz9LmV7gDEqytWyGZLmDXE"
  }],

  "service": [{
    "id": "did:example:123456789abcdefghi#vcs",
    "type": "VerifiableCredentialService",
    "serviceEndpoint": "https://example.com/vc/"
  }, {
    "id": "did:example:123456789abcdefghi#hub",
    "type": "IdentityHub",
    "serviceEndpoint": "https://hub.example.com/.identity/did:example:123456789abcdefghi"
  }]
}
\`\`\`

### Verification Relationships

DID Documents define multiple verification relationships:

| Relationship | Purpose | Use Case |
|--------------|---------|----------|
| **authentication** | Prove you control this DID | Login, DID Auth |
| **assertionMethod** | Sign Verifiable Credentials | Issue credentials as this DID |
| **keyAgreement** | Establish encrypted communication | DIDComm messaging |
| **capabilityInvocation** | Invoke cryptographic capabilities | Smart contract interaction |
| **capabilityDelegation** | Delegate capabilities to others | Allow agent to act on your behalf |

## DID Resolution

**DID Resolution** is the process of retrieving a DID Document from a DID.

\`\`\`
Input:  did:ethr:0x1234...
        ↓
      [DID Resolver]
        ↓
Output: DID Document (JSON)
\`\`\`

### Resolution Process

1. **Parse DID**: Extract method (\`ethr\`) and identifier (\`0x1234...\`)
2. **Method-Specific Resolution**: Call the appropriate resolver for that method
3. **Retrieve Document**: Fetch from blockchain, web server, IPFS, etc.
4. **Validate**: Ensure document is valid and not revoked
5. **Return**: DID Document in JSON-LD format

### Universal Resolver

The **Universal Resolver** (dev.uniresolver.io) supports 80+ DID methods:

\`\`\`bash
curl -X GET "https://dev.uniresolver.io/1.0/identifiers/did:ethr:0x1234..."
\`\`\`

Returns the DID Document for any supported method.
          `
        },
        {
          type: "text",
          title: "DID Methods Comparison",
          content: `
There are 150+ DID methods registered with W3C. Let's compare the most popular ones.

## did:key - Simplest (No Blockchain)

**Philosophy:** A DID that's just a public key, nothing more.

**Format:**
\`\`\`
did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH
\`\`\`

**How it works:**
1. Generate a public/private key pair
2. Encode the public key in multibase format
3. Prefix with \`did:key:\`
4. **No registration anywhere**. The DID itself contains all information.

**DID Document (derived on-the-fly):**
\`\`\`json
{
  "id": "did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH",
  "verificationMethod": [{
    "id": "did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH",
    "publicKeyMultibase": "z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH"
  }],
  "authentication": ["did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH"]
}
\`\`\`

**Pros:**
- ✅ **Simplest** - No blockchain, no registration, no network needed
- ✅ **Offline** - Works completely offline
- ✅ **Free** - No transaction costs
- ✅ **Fast** - Instant creation and resolution
- ✅ **Perfect for testing**

**Cons:**
- ❌ **No key rotation** - Can't update keys without changing DID
- ❌ **No service endpoints** - Can't add contact information
- ❌ **No multi-key** - Only one key per DID
- ❌ **Temporary use only** - Not suitable for long-lived identities

**Best for:** Testing, temporary sessions, peer-to-peer connections, development

---

## did:web - DNS-Based (Familiar Infrastructure)

**Philosophy:** Use existing web infrastructure for DIDs.

**Format:**
\`\`\`
did:web:example.com
did:web:example.com:user:alice
did:web:example.com:path:to:document
\`\`\`

**How it works:**
1. Host a DID Document on your web server
2. Serve it at a well-known location:
   - \`https://example.com/.well-known/did.json\`
   - \`https://example.com/user/alice/did.json\`

**Resolution:**
\`\`\`
did:web:example.com:user:alice
         ↓
GET https://example.com/user/alice/did.json
         ↓
Return DID Document
\`\`\`

**Example did.json:**
\`\`\`json
{
  "id": "did:web:example.com:user:alice",
  "verificationMethod": [{
    "id": "did:web:example.com:user:alice#key-1",
    "type": "EcdsaSecp256k1VerificationKey2019",
    "controller": "did:web:example.com:user:alice",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "secp256k1",
      "x": "NtngWpJUr-rlNNbs0u-Aa8e16OwB5NbZB0HgZwgjA0M",
      "y": "h0kkuJU4H2-l_7dUfB4HpbZqPDlPkIKWH9k8YUYkd8M"
    }
  }],
  "authentication": ["did:web:example.com:user:alice#key-1"],
  "service": [{
    "id": "did:web:example.com:user:alice#hub",
    "type": "IdentityHub",
    "serviceEndpoint": "https://hub.example.com"
  }]
}
\`\`\`

**Pros:**
- ✅ **Familiar** - Uses existing web infrastructure (DNS, HTTPS)
- ✅ **Easy setup** - Just host a JSON file
- ✅ **No blockchain** - No transaction costs or delays
- ✅ **Key rotation** - Update the file to change keys
- ✅ **Service endpoints** - Full DID Document support
- ✅ **Trust transfer** - If you trust example.com, you trust did:web:example.com

**Cons:**
- ❌ **Centralized** - Depends on DNS and web hosting
- ❌ **Not censorship-resistant** - Domain can be seized
- ❌ **Requires HTTPS** - SSL certificate management
- ❌ **Single point of failure** - If server down, DID unreachable

**Best for:** Organizations with existing web presence, enterprise SSI, government digital IDs

**Real-world examples:**
- \`did:web:identity.foundation\` - Decentralized Identity Foundation
- \`did:web:did.actor:alice\` - DID hosting service

---

## did:ethr - Ethereum Blockchain

**Philosophy:** Anchor DIDs to Ethereum addresses, leverage smart contract ecosystem.

**Format:**
\`\`\`
did:ethr:0x1234567890abcdef1234567890abcdef12345678
did:ethr:mainnet:0x1234567890abcdef1234567890abcdef12345678
did:ethr:0x1:0x1234567890abcdef1234567890abcdef12345678  // Mainnet
did:ethr:0x89:0x1234567890abcdef1234567890abcdef12345678  // Polygon
\`\`\`

**How it works:**
1. Your Ethereum address IS your DID
2. DID Document stored/updated via **ERC-1056 DID Registry** smart contract
3. Pay gas fees to update document

**ERC-1056 Registry Operations:**
\`\`\`solidity
// Add a public key
function setAttribute(address identity, bytes32 name, bytes value, uint validity) public;

// Add a delegate (another key that can act on your behalf)
function addDelegate(address identity, bytes32 delegateType, address delegate, uint validity) public;

// Revoke a delegate
function revokeDelegate(address identity, bytes32 delegateType, address delegate) public;
\`\`\`

**Pros:**
- ✅ **Decentralized** - No central authority (Ethereum blockchain)
- ✅ **Ethereum ecosystem** - Works with smart contracts, wallets
- ✅ **Key rotation** - Update keys via smart contract
- ✅ **Delegates** - Allow others to act on your behalf (time-limited)
- ✅ **Established** - Battle-tested, widely supported

**Cons:**
- ❌ **Gas fees** - Costs money to update DID Document (varies with network)
- ❌ **Not offline** - Need Ethereum node to resolve
- ❌ **Slow** - Block confirmation times (12 seconds on mainnet)
- ❌ **Blockchain bloat** - Every update stored on-chain

**Best for:** Ethereum dApps, crypto wallets, blockchain-native applications

**Cost example (2025):**
- Create DID: Free (just use your address)
- Add public key: ~0.002 ETH (~$5) on mainnet, ~$0.01 on Polygon
- Update delegate: ~0.001 ETH (~$2.50)

---

## did:ion - Microsoft's ION (Bitcoin + IPFS)

**Philosophy:** Combine Bitcoin's security with IPFS scalability (Sidetree protocol).

**Format:**
\`\`\`
did:ion:EiClWZ5MQmYPkjGkU0T4WD9Ar7z8E6fL2aB1Hd5zPsU3dA
\`\`\`

**How it works:**
1. Create DID operations (create, update, recover, deactivate)
2. Batch thousands of operations together
3. Store batch in **IPFS** (content-addressed storage)
4. Anchor IPFS hash to **Bitcoin blockchain**
5. Result: Thousands of DID operations in one Bitcoin transaction

**Architecture:**
\`\`\`
  DID Operations (create, update)
         ↓
   Batch Operations
         ↓
  Store in IPFS → CID: QmXoypiz...
         ↓
  Anchor CID to Bitcoin
         ↓
  Bitcoin TX: 1 satoshi + OP_RETURN with CID
\`\`\`

**Pros:**
- ✅ **Highly scalable** - Thousands of DIDs per Bitcoin transaction
- ✅ **Low cost** - Amortized cost across batches (~$0.01 per DID)
- ✅ **Bitcoin security** - Inherits Bitcoin's immutability
- ✅ **IPFS resilience** - Content-addressed, distributed storage
- ✅ **Key rotation** - Full DID Document updates supported
- ✅ **Microsoft backing** - Production-ready, used in Microsoft Entra

**Cons:**
- ❌ **Complex** - Most sophisticated DID method
- ❌ **Not instant** - Batching delay (typically 10-15 minutes)
- ❌ **Requires ION node** - Or rely on public nodes (trust issue)
- ❌ **IPFS dependency** - Need IPFS gateway to resolve

**Best for:** Enterprise SSI at scale, government digital IDs, long-lived identities

**Real-world usage:**
- Microsoft Entra Verified ID
- Some EU Digital Identity Wallet implementations

---

## DID Method Comparison Table

| Feature | did:key | did:web | did:ethr | did:ion |
|---------|---------|---------|----------|---------|
| **Decentralization** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Cost** | Free | Low | Medium-High (gas) | Low (amortized) |
| **Speed** | Instant | Fast (<1s) | Medium (~12s) | Slow (~15min) |
| **Key Rotation** | ❌ | ✅ | ✅ | ✅ |
| **Offline** | ✅ | ❌ | ❌ | ❌ |
| **Scalability** | ✅ | ✅ | ⚠️ (blockchain limits) | ✅ (batching) |
| **Blockchain** | None | None | Ethereum | Bitcoin + IPFS |
| **Best For** | Testing | Organizations | Ethereum dApps | Enterprise SSI |
| **Maturity** | Stable | Stable | Stable | Production |

## Choosing a DID Method

### Decision Tree

\`\`\`
Need long-lived identity?
  No → did:key (testing, temporary)
  Yes ↓

Need to work offline?
  Yes → did:key (limited) or did:peer (advanced)
  No ↓

Already have web domain?
  Yes → did:web (simple, familiar)
  No ↓

Using Ethereum ecosystem?
  Yes → did:ethr (smart contracts, wallets)
  No ↓

Need maximum decentralization + scale?
  Yes → did:ion (enterprise, government)
\`\`\`

### Recommendations by Use Case

| Use Case | Recommended Method | Why |
|----------|-------------------|-----|
| **Testing/Development** | did:key | No setup, instant, free |
| **Enterprise SSI** | did:web or did:ion | did:web for simplicity, did:ion for scale |
| **Government Digital ID** | did:ion | Decentralized, scalable, battle-tested |
| **Crypto Wallet** | did:ethr | Native Ethereum integration |
| **Mobile App (offline)** | did:key or did:peer | Works without network |
| **Organization Website** | did:web | Leverage existing domain trust |
| **DIDComm Messaging** | did:key or did:peer | Lightweight, peer-to-peer |
          `
        },
        {
          type: "code",
          title: "Working with DIDs in JavaScript",
          language: "javascript",
          content: `// Complete DID implementation examples using popular libraries

import { DIDResolver, Resolver } from 'did-resolver'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { getResolver as getWebResolver } from 'web-did-resolver'
import { getResolver as getEthrResolver } from 'ethr-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { DID } from 'dids'
import { generateKeyPair } from '@stablelib/ed25519'

// ========================================
// 1. CREATE DIDs (Different Methods)
// ========================================

/**
 * Create a did:key (simplest - no blockchain)
 */
async function createDidKey() {
  // Generate Ed25519 key pair
  const { publicKey, secretKey } = generateKeyPair()

  // Create DID provider
  const provider = new Ed25519Provider(secretKey)
  const did = new DID({ provider, resolver: getResolver() })

  // Authenticate (prove you own the private key)
  await did.authenticate()

  console.log('Created did:key:', did.id)
  // Output: did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH

  return did
}

/**
 * Create a did:web (host DID Document on your server)
 */
async function createDidWeb(domain, path = '') {
  const did = \`did:web:\${domain}\${path ? ':' + path.replace(/\\//g, ':') : ''}\`

  // Generate key pair for this DID
  const { publicKey, secretKey } = generateKeyPair()
  const publicKeyMultibase = \`z\${Buffer.from(publicKey).toString('base64')}\`

  // Create DID Document
  const didDocument = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": did,
    "verificationMethod": [{
      "id": \`\${did}#key-1\`,
      "type": "Ed25519VerificationKey2020",
      "controller": did,
      "publicKeyMultibase": publicKeyMultibase
    }],
    "authentication": [\`\${did}#key-1\`],
    "assertionMethod": [\`\${did}#key-1\`],
    "service": [{
      "id": \`\${did}#hub\`,
      "type": "IdentityHub",
      "serviceEndpoint": \`https://\${domain}/hub\`
    }]
  }

  console.log('Created did:web:', did)
  console.log('Host this at: https://' + domain + '/.well-known/did.json')
  console.log(JSON.stringify(didDocument, null, 2))

  // In production, upload didDocument to your web server
  // await uploadToWebServer(didDocument, \`https://\${domain}/.well-known/did.json\`)

  return { did, didDocument, secretKey }
}

/**
 * Create a did:ethr (Ethereum-based)
 */
async function createDidEthr() {
  const { EthrDID } = await import('ethr-did')
  const { Wallet } = await import('ethers')

  // Create Ethereum wallet
  const wallet = Wallet.createRandom()

  // Create DID from Ethereum address
  const ethrDid = new EthrDID({
    identifier: wallet.address,
    privateKey: wallet.privateKey,
    chainNameOrId: 1, // Ethereum mainnet
  })

  console.log('Created did:ethr:', ethrDid.did)
  console.log('Ethereum address:', wallet.address)
  // Output: did:ethr:0x1234567890abcdef1234567890abcdef12345678

  return { ethrDid, wallet }
}

// ========================================
// 2. RESOLVE DIDs (Get DID Documents)
// ========================================

/**
 * Setup Universal Resolver (supports multiple DID methods)
 */
function setupResolver() {
  const resolver = new Resolver({
    ...getKeyResolver(),     // did:key
    ...getWebResolver(),     // did:web
    ...getEthrResolver({     // did:ethr
      networks: [
        {
          name: 'mainnet',
          rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
          registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b' // ERC-1056 Registry
        }
      ]
    }),
  })

  return resolver
}

/**
 * Resolve any DID to get its DID Document
 */
async function resolveDID(did) {
  const resolver = setupResolver()

  try {
    const result = await resolver.resolve(did)

    if (result.didDocument) {
      console.log(\`✅ Resolved \${did}\`)
      console.log('DID Document:', JSON.stringify(result.didDocument, null, 2))
      return result.didDocument
    } else {
      console.log(\`❌ Failed to resolve \${did}\`)
      console.log('Error:', result.didResolutionMetadata.error)
      return null
    }
  } catch (error) {
    console.error('Resolution error:', error)
    return null
  }
}

// ========================================
// 3. DID AUTHENTICATION
// ========================================

/**
 * Authenticate with a DID (prove you control the private key)
 */
async function authenticateWithDID(did, secretKey) {
  // Create authentication challenge
  const challenge = \`login-challenge-\${Date.now()}-\${Math.random()}\`

  console.log('🔐 Authenticating with DID:', did.id)
  console.log('Challenge:', challenge)

  // Create DID provider
  const provider = new Ed25519Provider(secretKey)
  const authenticatedDID = new DID({ provider, resolver: setupResolver() })
  await authenticatedDID.authenticate()

  // Sign the challenge
  const jws = await authenticatedDID.createJWS({ challenge })

  console.log('✅ Signed challenge (JWS):', JSON.stringify(jws, null, 2))

  return jws
}

/**
 * Verify DID Authentication
 */
async function verifyDIDAuth(did, jws) {
  const resolver = setupResolver()

  // Resolve DID to get public key
  const { didDocument } = await resolver.resolve(did)
  if (!didDocument) {
    throw new Error('DID not found')
  }

  // Extract public key from DID Document
  const verificationMethod = didDocument.verificationMethod?.[0]
  if (!verificationMethod) {
    throw new Error('No verification method found')
  }

  // Verify JWS signature
  const { verifyJWS } = await import('did-jwt')
  const verified = await verifyJWS(jws, {
    resolver,
    audience: did
  })

  if (verified) {
    console.log('✅ Authentication verified!')
    console.log('Payload:', verified.payload)
    return true
  } else {
    console.log('❌ Authentication failed!')
    return false
  }
}

// ========================================
// 4. UPDATE DID DOCUMENTS (Key Rotation)
// ========================================

/**
 * Update did:web (just update the JSON file on your server)
 */
async function updateDidWeb(domain, newPublicKey) {
  const did = \`did:web:\${domain}\`

  // Fetch current DID Document
  const response = await fetch(\`https://\${domain}/.well-known/did.json\`)
  const currentDoc = await response.json()

  // Add new verification method
  const newVerificationMethod = {
    "id": \`\${did}#key-2\`,
    "type": "Ed25519VerificationKey2020",
    "controller": did,
    "publicKeyMultibase": \`z\${Buffer.from(newPublicKey).toString('base64')}\`
  }

  currentDoc.verificationMethod.push(newVerificationMethod)
  currentDoc.authentication.push(\`\${did}#key-2\`)

  console.log('Updated DID Document:', JSON.stringify(currentDoc, null, 2))

  // Upload updated document
  // await uploadToWebServer(currentDoc, \`https://\${domain}/.well-known/did.json\`)

  return currentDoc
}

/**
 * Update did:ethr (requires Ethereum transaction)
 */
async function updateDidEthr(ethrDid, wallet, newPublicKey) {
  const { ethers } = await import('ethers')

  // Connect to Ethereum network
  const provider = new ethers.providers.InfuraProvider('mainnet', 'YOUR-PROJECT-ID')
  const signer = wallet.connect(provider)

  // ERC-1056 DID Registry contract
  const registryAddress = '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
  const registryABI = [
    'function setAttribute(address identity, bytes32 name, bytes value, uint validity) public'
  ]

  const registry = new ethers.Contract(registryAddress, registryABI, signer)

  // Set new public key attribute
  const name = ethers.utils.formatBytes32String('did/pub/Ed25519/veriKey/base64')
  const value = Buffer.from(newPublicKey).toString('base64')
  const validity = 31536000 // 1 year in seconds

  console.log('📝 Sending Ethereum transaction to update DID...')

  const tx = await registry.setAttribute(
    wallet.address,
    name,
    ethers.utils.toUtf8Bytes(value),
    validity
  )

  console.log('Transaction sent:', tx.hash)
  await tx.wait()
  console.log('✅ DID Document updated on Ethereum!')

  return tx
}

// ========================================
// 5. COMPLETE EXAMPLE
// ========================================

async function completeExample() {
  console.log('=== DID Complete Example ===\\n')

  // 1. Create a did:key
  console.log('1️⃣  Creating did:key...')
  const didKey = await createDidKey()
  console.log()

  // 2. Resolve the did:key
  console.log('2️⃣  Resolving did:key...')
  await resolveDID(didKey.id)
  console.log()

  // 3. Create a did:web
  console.log('3️⃣  Creating did:web...')
  const { did: didWeb, secretKey } = await createDidWeb('example.com', 'user/alice')
  console.log()

  // 4. Authenticate with DID
  console.log('4️⃣  Authenticating with DID...')
  const jws = await authenticateWithDID(didKey, didKey.provider.seed)
  console.log()

  // 5. Verify authentication
  console.log('5️⃣  Verifying DID authentication...')
  await verifyDIDAuth(didKey.id, jws)
  console.log()

  console.log('=== Example Complete ===')
}

// Run example
completeExample().catch(console.error)

export {
  createDidKey,
  createDidWeb,
  createDidEthr,
  resolveDID,
  authenticateWithDID,
  verifyDIDAuth,
  updateDidWeb,
  updateDidEthr
}`,
          caption: "Production-ready DID implementation with creation, resolution, authentication, and key rotation for did:key, did:web, and did:ethr methods"
        }
      ],
      quiz: {
        id: "dids-quiz",
        title: "DIDs and DID Methods Quiz",
        description: "Test your understanding of Decentralized Identifiers and DID methods",
        passingScore: 70,
        questions: [
          {
            id: "did-q1",
            question: "What does a DID resolve to?",
            options: [
              "A user's email address",
              "A DID Document containing public keys and service endpoints",
              "A blockchain transaction",
              "An OAuth access token"
            ],
            correctAnswer: 1,
            explanation: "When you resolve a DID (like did:ethr:0x1234...), you get back a DID Document - a JSON-LD document containing verification methods (public keys), authentication methods, service endpoints, and other metadata about the DID."
          },
          {
            id: "did-q2",
            question: "What is the main advantage of did:key compared to other DID methods?",
            options: [
              "It's the most secure",
              "It's completely self-contained and works offline without any blockchain or registration",
              "It supports unlimited key rotation",
              "It's the cheapest"
            ],
            correctAnswer: 1,
            explanation: "did:key is self-contained - the DID itself contains all the information needed (it's derived from the public key). No blockchain, no registration, no network required. The DID Document is generated on-the-fly from the key. Perfect for testing and temporary use."
          },
          {
            id: "did-q3",
            question: "How does did:ion achieve scalability despite using Bitcoin?",
            options: [
              "It uses Lightning Network",
              "It batches thousands of DID operations together and anchors only one IPFS hash to Bitcoin",
              "It doesn't actually use Bitcoin",
              "It uses a sidechain"
            ],
            correctAnswer: 1,
            explanation: "did:ion uses the Sidetree protocol to batch thousands of DID operations (create, update, etc.) together, store the batch in IPFS, and anchor only the IPFS content hash (CID) to Bitcoin. This means one Bitcoin transaction can represent thousands of DID operations, achieving massive scalability."
          },
          {
            id: "did-q4",
            question: "What is the main trade-off of using did:web?",
            options: [
              "It's too expensive",
              "It's centralized - depends on DNS and web hosting, sacrificing decentralization for simplicity",
              "It doesn't support key rotation",
              "It requires blockchain"
            ],
            correctAnswer: 1,
            explanation: "did:web trades decentralization for simplicity and familiarity. It relies on centralized DNS and web hosting infrastructure. If the domain is seized or the server goes down, the DID becomes unreachable. However, this makes it easy to set up and leverages existing web trust."
          },
          {
            id: "did-q5",
            question: "In a DID Document, what is the 'authentication' verification relationship used for?",
            options: [
              "To encrypt messages",
              "To prove you control the DID (e.g., for login/DID Auth)",
              "To issue verifiable credentials",
              "To delegate permissions"
            ],
            correctAnswer: 1,
            explanation: "The 'authentication' relationship specifies which public keys can be used to authenticate as this DID - proving you control the DID's private keys. This is used for DID Auth (login), similar to how you prove ownership in other systems. Other relationships serve different purposes: assertionMethod for issuing credentials, keyAgreement for encryption, etc."
          }
        ]
      }
    },
    {
      id: "verifiable-credentials",
      slug: "verifiable-credentials",
      title: "Verifiable Credentials & Verifiable Presentations",
      description:
        "Learn how to issue, hold, and verify cryptographically-signed credentials with selective disclosure and zero-knowledge proofs",
      estimatedMinutes: 50,
      content: [
        {
          type: "text",
          title: "Understanding Verifiable Credentials",
          content: `
## What Are Verifiable Credentials?

**Verifiable Credentials (VCs)** are the digital equivalent of physical credentials (diplomas, licenses, certificates), but with superpowers:

### Physical Credentials (Current)
\`\`\`
University Diploma (paper)
├─ Can be forged (fake degrees are a $1B industry)
├─ Hard to verify (call university, wait days)
├─ Can't selectively disclose (show whole document)
└─ Lost forever if destroyed

Driver's License (plastic)
├─ Reveals everything (even when you just need to prove age)
├─ Can be stolen and used by others
├─ Hard to revoke (still valid after you report it stolen)
└─ Physical object required
\`\`\`

### Verifiable Credentials (Future)
\`\`\`
Digital Diploma (VC)
├─ ✅ Cryptographically signed (unforgeable)
├─ ✅ Instant verification (check signature)
├─ ✅ Selective disclosure (share only GPA, not full transcript)
└─ ✅ Cloud backup (never lost)

Digital License (VC)
├─ ✅ Prove age >21 without revealing birthdate
├─ ✅ Cryptographically bound to you (can't be stolen)
├─ ✅ Instant revocation (if lost, disable immediately)
└─ ✅ In your phone (always available)
\`\`\`

## The Trust Triangle

SSI operates on a three-party model:

\`\`\`
        Issuer
      (University)
         /  \\
        /    \\
    Issues   Trusts
      VC      Issuer
      /        \\
     /          \\
 Holder  ----→  Verifier
(You)   Presents  (Employer)
        VP
\`\`\`

**Roles:**

1. **Issuer**: Creates and signs the credential
   - Example: University issues diploma VC
   - Signs with their cryptographic key
   - Publishes public key in their DID Document

2. **Holder**: Stores credential in wallet
   - You (the graduate)
   - Controls when/where to present it
   - Can create Verifiable Presentations

3. **Verifier**: Checks credential validity
   - Example: Employer verifying your degree
   - Verifies cryptographic signature
   - Trusts the issuer's public key

## Verifiable Credential Structure

Here's what a VC actually looks like (W3C VC Data Model 2.0):

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.w3.org/ns/credentials/examples/v2"
  ],
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": {
    "id": "did:web:university.edu",
    "name": "Example University"
  },
  "validFrom": "2024-01-15T00:00:00Z",
  "validUntil": "2034-01-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:alice",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science in Computer Science",
      "degreeSchool": "School of Engineering"
    },
    "gpa": "3.8",
    "graduationDate": "2024-05-15"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-01-15T10:30:00Z",
    "verificationMethod": "did:web:university.edu#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3FXQjecWRwCr...base58-encoded-signature"
  }
}
\`\`\`

**Key Components:**

- **@context**: Defines vocabulary and data types
- **type**: What kind of credential (can have multiple types)
- **issuer**: DID of who issued it (university)
- **validFrom/validUntil**: Credential lifetime
- **credentialSubject**: The claims about the holder
  - **id**: Holder's DID (who the credential is about)
  - **Claims**: Degree type, GPA, graduation date, etc.
- **proof**: Cryptographic signature
  - **verificationMethod**: Points to issuer's public key in DID Document
  - **proofValue**: The actual digital signature

## How Verification Works

### Step-by-Step Verification Process

1. **Holder presents credential to verifier** (employer)

2. **Verifier extracts issuer DID** from credential
   \`\`\`
   "issuer": { "id": "did:web:university.edu" }
   \`\`\`

3. **Verifier resolves DID to DID Document**
   \`\`\`
   GET https://university.edu/.well-known/did.json
   \`\`\`

4. **Verifier finds issuer's public key** in DID Document
   \`\`\`json
   {
     "verificationMethod": [{
       "id": "did:web:university.edu#key-1",
       "type": "Ed25519VerificationKey2020",
       "publicKeyMultibase": "z6MkpT..."
     }]
   }
   \`\`\`

5. **Verifier checks signature** using public key
   \`\`\`javascript
   const isValid = await verifySignature(
     credentialData,
     proof.proofValue,
     publicKey
   )
   // Returns: true ✅ (signature valid)
   \`\`\`

6. **Verifier checks additional constraints**
   - Is credential expired? (check validUntil)
   - Is it for the right holder? (credentialSubject.id matches presenter's DID)
   - Is issuer trusted? (do we trust this university?)
   - Is credential revoked? (check revocation registry)

**Result:** If all checks pass, verifier trusts the claims.

## Verifiable Presentations

A **Verifiable Presentation (VP)** is a package that holders create to present credentials to verifiers.

### Why Presentations?

You rarely present just one credential. You might need to prove:
- "I'm over 21" (driver's license VC) AND
- "I'm a student" (student ID VC) AND
- "I live in this city" (utility bill VC)

**Solution:** Bundle multiple VCs into one VP.

### VP Structure

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2"
  ],
  "type": ["VerifiablePresentation"],
  "holder": "did:example:alice",
  "verifiableCredential": [
    { /* University Degree VC */ },
    { /* Professional Certification VC */ }
  ],
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2025-01-15T14:30:00Z",
    "verificationMethod": "did:example:alice#key-1",
    "proofPurpose": "authentication",
    "challenge": "random-nonce-from-verifier-abc123",
    "domain": "employer.com",
    "proofValue": "z58DAdFfa9..."
  }
}
\`\`\`

**Key Differences from VC:**

- **holder**: The DID presenting (proving control)
- **verifiableCredential**: Array of VCs being presented
- **proof**: Holder's signature (not issuer's)
  - **challenge**: Random nonce from verifier (prevents replay attacks)
  - **domain**: Who requested it (prevents presentation reuse)

## Selective Disclosure

**Problem:** Driver's license has 10 fields. To prove age >21, you have to show all 10 fields.

**Solution:** Selective Disclosure lets you reveal only specific fields.

### BBS+ Signatures

**BBS+** is a cryptographic signature scheme that enables selective disclosure.

**How it works:**

1. **Issuer creates credential** with BBS+ signature
   \`\`\`
   Credential fields:
   - Name: Alice Anderson
   - Address: 123 Main St
   - Birthdate: 1995-03-15
   - License Number: D1234567
   - Photo: <binary>
   - Organ Donor: Yes
   \`\`\`

2. **Holder selectively discloses** only Name + Photo for hotel check-in
   \`\`\`
   Disclosed:
   - Name: Alice Anderson
   - Photo: <binary>

   Hidden (but proof exists):
   - Address: [REDACTED]
   - Birthdate: [REDACTED]
   - License Number: [REDACTED]
   - Organ Donor: [REDACTED]
   \`\`\`

3. **Verifier sees only disclosed fields** but can verify:
   - Signature is valid (all fields were originally signed)
   - No tampering occurred
   - Issuer is legitimate

**Magic:** Verifier can't see hidden fields, but cryptography proves they exist and were signed.

### Zero-Knowledge Proofs (ZKPs)

**Even more powerful:** Prove properties about data WITHOUT revealing the data.

**Example: Prove Age >21**

\`\`\`
Traditional:
  Birthdate: 1995-03-15
  Math: 2025 - 1995 = 30
  Result: 30 > 21 ✅

ZKP (with BBS+):
  Birthdate: [HIDDEN]
  Cryptographic proof: "Birthdate satisfies (2025 - birthdate > 21)"
  Result: Proof verifies ✅

Verifier learns: "Person is over 21"
Verifier doesn't learn: Exact birthdate, age
\`\`\`

**Real-World Use Cases:**
- Prove income >$50K (without revealing exact salary)
- Prove credit score >700 (without revealing 745)
- Prove eligible for loan (without revealing all financial data)

## Production Code Examples

### Issuing a Verifiable Credential

\`\`\`typescript
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020'
import { issue } from '@digitalbazaar/vc'
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'

// University's key pair (from DID Document)
const issuerKeyPair = await Ed25519VerificationKey2020.generate({
  id: 'did:web:university.edu#key-1',
  controller: 'did:web:university.edu'
})

// Create credential
const credential = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://www.w3.org/ns/credentials/examples/v2'
  ],
  type: ['VerifiableCredential', 'UniversityDegreeCredential'],
  issuer: {
    id: 'did:web:university.edu',
    name: 'Example University'
  },
  issuanceDate: new Date().toISOString(),
  credentialSubject: {
    id: 'did:example:alice',
    degree: {
      type: 'BachelorDegree',
      name: 'Bachelor of Science in Computer Science'
    },
    gpa: '3.8'
  }
}

// Sign credential
const suite = new Ed25519Signature2020({ key: issuerKeyPair })
const verifiableCredential = await issue({
  credential,
  suite,
  documentLoader
})

console.log('Issued VC:', verifiableCredential)
// Send to holder's wallet
\`\`\`

### Verifying a Credential

\`\`\`typescript
import { verify } from '@digitalbazaar/vc'
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020'

async function verifyCredential(verifiableCredential: any) {
  const suite = new Ed25519Signature2020()

  const result = await verify({
    credential: verifiableCredential,
    suite,
    documentLoader, // Resolves DIDs to DID Documents
    purpose: new AssertionProofPurpose()
  })

  if (result.verified) {
    console.log('✅ Credential is valid!')
    console.log('Issuer:', verifiableCredential.issuer.id)
    console.log('Subject:', verifiableCredential.credentialSubject.id)
    console.log('Claims:', verifiableCredential.credentialSubject)
    return true
  } else {
    console.log('❌ Credential verification failed')
    console.log('Error:', result.error)
    return false
  }
}

// Example usage
const isValid = await verifyCredential(degreeCredential)
\`\`\`

### Creating a Verifiable Presentation

\`\`\`typescript
import { signPresentation } from '@digitalbazaar/vc'

// Holder creates presentation
async function createPresentation(
  credentials: any[],
  holderDID: string,
  holderKeyPair: any,
  challenge: string,
  domain: string
) {
  const presentation = {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: ['VerifiablePresentation'],
    holder: holderDID,
    verifiableCredential: credentials
  }

  const suite = new Ed25519Signature2020({ key: holderKeyPair })

  const verifiablePresentation = await signPresentation({
    presentation,
    suite,
    challenge,  // From verifier (prevents replay)
    domain,     // Verifier's domain
    documentLoader
  })

  return verifiablePresentation
}

// Example: Alice presents degree to employer
const vp = await createPresentation(
  [degreeCredential, certificationCredential],
  'did:example:alice',
  aliceKeyPair,
  'nonce-from-employer-xyz789',
  'employer.com'
)

console.log('Created VP:', vp)
// Send to verifier
\`\`\`

## Credential Revocation

**Problem:** What if a credential needs to be invalidated?
- Student expelled (revoke diploma)
- License suspended (revoke driver's license)
- Employee fired (revoke access credential)

### Revocation Methods

**1. Status List 2021 (W3C Standard)**

Credentials include a reference to a status list:

\`\`\`json
{
  "credentialStatus": {
    "id": "https://university.edu/status/1#94567",
    "type": "StatusList2021Entry",
    "statusPurpose": "revocation",
    "statusListIndex": "94567",
    "statusListCredential": "https://university.edu/credentials/status/1"
  }
}
\`\`\`

Verifier checks if bit #94567 in the status list is set to 1 (revoked) or 0 (active).

**2. Revocation Registry (Hyperledger Indy)**

Blockchain-based revocation:
- Issuer publishes revocation registry on ledger
- Can mark credentials as revoked
- Privacy-preserving (doesn't reveal which credential was checked)

**3. Expiration (Simple)**

Just set short validity periods:
\`\`\`json
{
  "validUntil": "2025-12-31T23:59:59Z"
}
\`\`\`

After expiration, credential is no longer valid.

## Key Takeaways

1. **Verifiable Credentials** are cryptographically-signed digital credentials that can be instantly verified

2. **Trust Triangle**: Issuer creates, Holder stores, Verifier checks

3. **Selective Disclosure** (BBS+) lets holders share only necessary fields

4. **Zero-Knowledge Proofs** prove properties without revealing underlying data

5. **Verifiable Presentations** bundle multiple VCs for comprehensive proof

6. **Revocation** handles invalidation of credentials (Status List 2021, expiration)

**Next:** We'll explore digital wallets that hold these credentials and the SSI ecosystem.
          `
        },
        {
          type: "code",
          title: "Building a VC Issuance System",
          language: "typescript",
          code: `/**
 * Complete Verifiable Credential Issuance System
 * Demonstrates issuing, storing, presenting, and verifying VCs
 */

import { Veramo, createAgent } from '@veramo/core'
import { CredentialPlugin } from '@veramo/credential-w3c'
import { DIDManager } from '@veramo/did-manager'
import { KeyManager } from '@veramo/key-manager'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

// Initialize Veramo agent
const agent = createAgent({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dbConnection))
      }
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:web',
      providers: {
        'did:web': new WebDIDProvider({
          defaultKms: 'local'
        })
      }
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...webDidResolver()
      })
    }),
    new CredentialPlugin()
  ]
})

// 1. University issues degree credential
async function issueDegreeClaim(
  studentDID: string,
  degreeType: string,
  major: string,
  gpa: number,
  graduationDate: string
) {
  const credential = await agent.createVerifiableCredential({
    credential: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      issuer: {
        id: 'did:web:university.edu',
        name: 'Example University'
      },
      issuanceDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 years
      credentialSubject: {
        id: studentDID,
        degree: {
          type: degreeType,
          name: \`\${degreeType} in \${major}\`,
          degreeSchool: 'School of Engineering'
        },
        gpa: gpa.toString(),
        graduationDate,
        honors: gpa >= 3.8 ? 'Summa Cum Laude' : gpa >= 3.5 ? 'Magna Cum Laude' : undefined
      },
      credentialStatus: {
        id: 'https://university.edu/status/1#\${Date.now()}',
        type: 'StatusList2021Entry',
        statusPurpose: 'revocation',
        statusListIndex: Math.floor(Math.random() * 100000).toString(),
        statusListCredential: 'https://university.edu/credentials/status/1'
      }
    },
    proofFormat: 'jwt'
  })

  console.log('✅ Issued degree credential:', credential)
  return credential
}

// 2. Student stores credential in wallet
interface Wallet {
  credentials: Map<string, any>
  addCredential(vc: any): void
  getCredential(id: string): any
  listCredentials(): any[]
}

class SimpleWallet implements Wallet {
  credentials: Map<string, any> = new Map()

  addCredential(vc: any): void {
    const id = vc.id || vc.proof.jws
    this.credentials.set(id, vc)
    console.log(\`💼 Added credential to wallet: \${vc.type.join(', ')}\`)
  }

  getCredential(id: string): any {
    return this.credentials.get(id)
  }

  listCredentials(): any[] {
    return Array.from(this.credentials.values())
  }

  // Create presentation with selected credentials
  async createPresentation(
    credentialIds: string[],
    challenge: string,
    domain: string
  ) {
    const selectedCredentials = credentialIds
      .map(id => this.credentials.get(id))
      .filter(Boolean)

    const presentation = await agent.createVerifiablePresentation({
      presentation: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        holder: 'did:example:alice',
        verifiableCredential: selectedCredentials
      },
      challenge,
      domain,
      proofFormat: 'jwt'
    })

    return presentation
  }
}

// 3. Employer verifies credential
async function verifyDegreeCredential(
  vc: any,
  requiredDegree?: string,
  minimumGPA?: number
) {
  console.log('🔍 Verifying credential...')

  // Step 1: Verify cryptographic signature
  const verificationResult = await agent.verifyCredential({
    credential: vc
  })

  if (!verificationResult.verified) {
    console.log('❌ Signature verification failed')
    return {
      valid: false,
      reason: 'Invalid signature',
      details: verificationResult.error
    }
  }

  console.log('✅ Signature valid')

  // Step 2: Check expiration
  if (vc.expirationDate && new Date(vc.expirationDate) < new Date()) {
    console.log('❌ Credential expired')
    return {
      valid: false,
      reason: 'Credential expired',
      expirationDate: vc.expirationDate
    }
  }

  console.log('✅ Not expired')

  // Step 3: Check issuer is trusted
  const trustedIssuers = [
    'did:web:university.edu',
    'did:web:mit.edu',
    'did:web:stanford.edu'
  ]

  const issuerID = typeof vc.issuer === 'string' ? vc.issuer : vc.issuer.id

  if (!trustedIssuers.includes(issuerID)) {
    console.log('⚠️  Issuer not in trusted list')
    return {
      valid: false,
      reason: 'Untrusted issuer',
      issuer: issuerID
    }
  }

  console.log('✅ Issuer trusted')

  // Step 4: Verify specific claims
  const subject = vc.credentialSubject

  if (requiredDegree && subject.degree.type !== requiredDegree) {
    console.log(\`❌ Degree type mismatch. Required: \${requiredDegree}, Got: \${subject.degree.type}\`)
    return {
      valid: false,
      reason: 'Degree requirement not met'
    }
  }

  if (minimumGPA && parseFloat(subject.gpa) < minimumGPA) {
    console.log(\`❌ GPA too low. Required: \${minimumGPA}, Got: \${subject.gpa}\`)
    return {
      valid: false,
      reason: 'GPA requirement not met'
    }
  }

  console.log('✅ All checks passed')

  return {
    valid: true,
    subject: {
      id: subject.id,
      degree: subject.degree.name,
      gpa: subject.gpa,
      graduationDate: subject.graduationDate,
      honors: subject.honors
    },
    issuer: vc.issuer.name || issuerID
  }
}

// 4. Complete workflow
async function completeVCWorkflow() {
  console.log('\\n=== VC Issuance & Verification Workflow ===\\n')

  // University issues degree
  const degreeVC = await issueDegreeClaim(
    'did:example:alice',
    'BachelorDegree',
    'Computer Science',
    3.9,
    '2024-05-15'
  )

  // Student stores in wallet
  const aliceWallet = new SimpleWallet()
  aliceWallet.addCredential(degreeVC)

  console.log(\`\\n💼 Alice's wallet now has \${aliceWallet.listCredentials().length} credential(s)\\n\`)

  // Employer requests proof
  console.log('📧 Employer: "Please prove you have a CS degree with GPA > 3.5"\\n')

  // Alice creates presentation
  const challenge = 'random-nonce-xyz789'
  const vp = await aliceWallet.createPresentation(
    [degreeVC.id],
    challenge,
    'employer.com'
  )

  console.log('📤 Alice sends verifiable presentation\\n')

  // Employer verifies
  const result = await verifyDegreeCredential(
    vp.verifiableCredential[0],
    'BachelorDegree',
    3.5
  )

  if (result.valid) {
    console.log('\\n🎉 Employment offer approved!')
    console.log('Verified details:', result.subject)
  } else {
    console.log(\`\\n❌ Employment offer denied: \${result.reason}\`)
  }
}

// Run the workflow
completeVCWorkflow().catch(console.error)

/**
 * Expected Output:
 *
 * === VC Issuance & Verification Workflow ===
 *
 * ✅ Issued degree credential: { ... }
 * 💼 Added credential to wallet: VerifiableCredential, UniversityDegreeCredential
 *
 * 💼 Alice's wallet now has 1 credential(s)
 *
 * 📧 Employer: "Please prove you have a CS degree with GPA > 3.5"
 *
 * 📤 Alice sends verifiable presentation
 *
 * 🔍 Verifying credential...
 * ✅ Signature valid
 * ✅ Not expired
 * ✅ Issuer trusted
 * ✅ All checks passed
 *
 * 🎉 Employment offer approved!
 * Verified details: {
 *   id: 'did:example:alice',
 *   degree: 'BachelorDegree in Computer Science',
 *   gpa: '3.9',
 *   graduationDate: '2024-05-15',
 *   honors: 'Summa Cum Laude'
 * }
 */`
        }
      ],
      quiz: {
        id: "verifiable-credentials-quiz",
        title: "Verifiable Credentials Quiz",
        description: "Test your understanding of VCs, VPs, selective disclosure, and verification",
        passingScore: 70,
        questions: [
          {
            id: "vc-q1",
            question: "What is the primary advantage of Verifiable Credentials over traditional physical credentials?",
            options: [
              "They are cheaper to produce",
              "They are cryptographically signed making them unforgeable and instantly verifiable",
              "They look better",
              "They require internet connection"
            ],
            correctAnswer: 1,
            explanation: "The primary advantage is cryptographic security: VCs are signed by the issuer making them mathematically unforgeable, and verification is instant by checking the signature against the issuer's public key. Physical credentials can be forged (fake degrees are a $1B industry) and require manual verification processes."
          },
          {
            id: "vc-q2",
            question: "In the SSI Trust Triangle, what are the three roles?",
            options: [
              "User, Server, Database",
              "Issuer, Holder, Verifier",
              "Client, Provider, Consumer",
              "Subject, Object, Predicate"
            ],
            correctAnswer: 1,
            explanation: "The Trust Triangle consists of: (1) Issuer - creates and signs credentials (e.g., university), (2) Holder - stores credentials in wallet (e.g., you), and (3) Verifier - checks credential validity (e.g., employer). This model enables decentralized trust without a central authority."
          },
          {
            id: "vc-q3",
            question: "What is selective disclosure and which cryptographic technique enables it?",
            options: [
              "Hiding your DID, using encryption",
              "Revealing only specific fields from a credential, using BBS+ signatures",
              "Deleting old credentials, using revocation lists",
              "Choosing which verifiers to trust, using public key infrastructure"
            ],
            correctAnswer: 1,
            explanation: "Selective disclosure allows revealing only specific fields from a credential (e.g., sharing only name and photo from a driver's license, hiding address and birthdate). BBS+ signatures make this cryptographically possible - verifiers can validate the signature on disclosed fields while hidden fields remain provably signed but unrevealed."
          },
          {
            id: "vc-q4",
            question: "What is a Verifiable Presentation (VP) and why is it needed?",
            options: [
              "A PowerPoint slide with credentials, for sharing",
              "A package that bundles multiple VCs together with the holder's proof of control",
              "A public display of all your credentials",
              "A presentation layer for mobile apps"
            ],
            correctAnswer: 1,
            explanation: "A Verifiable Presentation is a cryptographically-signed package created by the holder that bundles one or more VCs together. It's needed because verifiers often require proof of multiple credentials (e.g., degree + certification + employment), and the VP includes the holder's signature proving they control the DIDs and aren't just forwarding someone else's credentials. The VP also includes challenge and domain to prevent replay attacks."
          },
          {
            id: "vc-q5",
            question: "How does Zero-Knowledge Proof (ZKP) differ from selective disclosure?",
            options: [
              "ZKPs prove properties about data (e.g., age >21) without revealing the underlying data (birthdate)",
              "ZKPs are faster than selective disclosure",
              "ZKPs don't use cryptography",
              "They are the same thing"
            ],
            correctAnswer: 0,
            explanation: "ZKPs go beyond selective disclosure by proving properties or predicates about data without revealing the data itself. For example, proving 'I am over 21' without revealing your birthdate, or 'My credit score is >700' without revealing it's 745. Selective disclosure reveals specific fields but ZKPs can prove mathematical relationships while keeping all underlying data hidden."
          },
          {
            id: "vc-q6",
            question: "What is the purpose of the 'challenge' and 'domain' fields in a Verifiable Presentation?",
            options: [
              "To make the presentation harder to understand",
              "To prevent replay attacks - challenge ensures freshness, domain ensures it's for the intended verifier",
              "To encrypt the presentation",
              "To add metadata for analytics"
            ],
            correctAnswer: 1,
            explanation: "The 'challenge' (a random nonce from the verifier) prevents replay attacks by ensuring the presentation is fresh and created specifically for this verification request. The 'domain' field (verifier's domain like 'employer.com') ensures the presentation can't be reused with a different verifier. Together they cryptographically bind the presentation to a specific verification context."
          }
        ]
      }
    },
    {
      id: "digital-wallets-ecosystem",
      slug: "digital-wallets-ecosystem",
      title: "Digital Wallets & SSI Ecosystem",
      description:
        "Explore digital wallets, DIDComm protocol, real-world implementations, and the global SSI ecosystem",
      estimatedMinutes: 45,
      content: [
        {
          type: "text",
          title: "Digital Identity Wallets",
          content: `
## What Are Digital Identity Wallets?

**Digital Identity Wallets** are software applications that store and manage your:
- Decentralized Identifiers (DIDs)
- Verifiable Credentials (VCs)
- Private keys for cryptographic operations
- Verifiable Presentations (VPs) you've created

**Think of it as:**
- Apple Wallet/Google Pay... but for your entire digital identity
- Your physical wallet... but containing diplomas, licenses, and certificates
- A password manager... but storing proofs instead of passwords

## Wallet Types

### 1. Mobile Wallets (Most Common)

**Examples:**
- **EU Digital Identity Wallet** (eIDAS 2.0 - launching 2026)
- **Microsoft Authenticator** (with Entra Verified ID support)
- **Trinsic Wallet** (enterprise SSI)
- **Lissi Wallet** (European SSI)

**Use Cases:**
- Store government IDs, driver's licenses
- Educational credentials (diplomas, certifications)
- Employment verification
- Access to services (hotels, car rentals, age verification)

**Features:**
- Biometric protection (Face ID, fingerprint)
- Cloud backup (encrypted)
- QR code presentation
- NFC sharing (tap-to-share)

### 2. Browser-Based Wallets

**Examples:**
- **Spruce Wallet** (DIDKit-based)
- **Bloom Wallet** (identity + credit)
- **Dock Wallet** (web + mobile)

**Use Cases:**
- Login to websites with DIDs (DID Auth)
- Prove credentials for SaaS access
- Professional networking (LinkedIn alternative)

**Features:**
- Browser extension
- Website integration
- Cross-device sync
- Export/import credentials

### 3. Hardware Wallets (High Security)

**Examples:**
- **YubiKey** (with FIDO2 + DID support)
- **Ledger** (cryptocurrency wallet with DID)
- **Trezor** (with SSI extensions)

**Use Cases:**
- High-value credentials (property deeds, stock certificates)
- Government/military applications
- Healthcare records (HIPAA compliance)

**Features:**
- Physical device required
- Air-gapped security
- Tamper-proof
- Multi-signature support

### 4. Custodial vs. Non-Custodial

**Non-Custodial (Recommended):**
\`\`\`
You control your private keys
├─ Keys stored on your device
├─ You are responsible for backup
├─ No one can access without your permission
└─ True self-sovereign identity
\`\`\`

**Custodial (Easier but Less Sovereign):**
\`\`\`
Provider holds your keys
├─ Keys stored on provider's servers
├─ Provider can recover your account
├─ Provider can access your credentials
└─ Easier UX, but trust required
\`\`\`

**Industry trend:** Moving towards non-custodial with social recovery mechanisms.

## Wallet Capabilities

### Core Functions

1. **DID Management**
   - Generate new DIDs (did:key, did:web, did:ion)
   - Store multiple DIDs for different contexts
   - Export DID for use in other wallets
   - Update DID Documents

2. **Credential Storage**
   - Receive credentials from issuers
   - Organize by type, issuer, or expiration
   - Search and filter credentials
   - Archive expired credentials

3. **Presentation Creation**
   - Select credentials to share
   - Create Verifiable Presentations
   - Sign with your DID
   - Apply selective disclosure

4. **Verification**
   - Verify incoming credentials before storing
   - Check issuer trust
   - Validate signatures
   - Check revocation status

5. **Backup & Recovery**
   - Encrypted cloud backup
   - Seed phrase recovery (12-24 words)
   - Social recovery (trusted contacts)
   - Multi-device sync

## DIDComm Protocol

**DIDComm** is the secure, private messaging protocol for SSI.

### What Problem Does It Solve?

**Traditional messaging:**
\`\`\`
Alice → Email → Gmail Server → Bob
         ↓
    Google reads everything
    Metadata exposed (who, when, subject)
    No forward secrecy
\`\`\`

**DIDComm:**
\`\`\`
Alice → Encrypted Message → Bob
         ↓
    End-to-end encrypted
    Metadata protected
    Forward secrecy
    Repudiable (can't prove Alice sent it)
\`\`\`

### DIDComm Message Structure

\`\`\`json
{
  "id": "1234567890",
  "type": "https://didcomm.org/present-proof/3.0/request-presentation",
  "from": "did:example:verifier",
  "to": ["did:example:alice"],
  "created_time": 1516269022,
  "expires_time": 1516385931,
  "body": {
    "challenge": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "domain": "employer.com",
    "presentation_definition": {
      "input_descriptors": [{
        "constraints": {
          "fields": [{
            "path": ["$.credentialSubject.degree.type"],
            "filter": { "const": "BachelorDegree" }
          }]
        }
      }]
    }
  }
}
\`\`\`

**Key Features:**

- **type**: What kind of message (credential offer, presentation request, etc.)
- **from/to**: DIDs of sender and recipient(s)
- **body**: Encrypted payload
- **Forward secrecy**: Each message uses unique encryption keys

### Common DIDComm Protocols

1. **Present Proof Protocol**
   - Verifier requests presentation
   - Holder selects credentials
   - Holder creates and sends VP
   - Verifier verifies and responds

2. **Issue Credential Protocol**
   - Holder requests credential
   - Issuer creates credential
   - Issuer sends signed VC
   - Holder stores in wallet

3. **Trust Ping Protocol**
   - Check if DID is reachable
   - Establish connection
   - Test encryption

4. **Routing Protocol**
   - Route messages through mediators
   - Support for mobile devices (push notifications)
   - NAT traversal

## Real-World Wallet Implementations

### EU Digital Identity Wallet (eIDAS 2.0)

**Status:** Mandated by EU regulation, launching 2026

**Features:**
- Government-issued to all EU citizens
- Interoperable across member states
- Use for banking, healthcare, government services
- Cross-border recognition

**Credentials Supported:**
- National ID card
- Driver's license
- Health insurance card
- Educational degrees
- Professional certifications
- Company registration

**Implementation:**
\`\`\`typescript
// Conceptual API (based on ARF - Architecture Reference Framework)
import { EUDIWallet } from '@eudi/wallet'

const wallet = new EUDIWallet({
  country: 'DE', // Germany
  userId: 'DE-12345678'
})

// Request credential from government
await wallet.requestCredential({
  issuer: 'did:web:german-government.de',
  credentialType: 'NationalIDCard',
  auth: biometricAuth
})

// Present to service provider
const vp = await wallet.createPresentation({
  verifier: 'did:web:bank.eu',
  credentials: ['NationalIDCard'],
  selectiveDisclosure: {
    fields: ['name', 'dateOfBirth', 'nationality']
  }
})

await wallet.presentTo('https://bank.eu/verify', vp)
\`\`\`

### Microsoft Entra Verified ID

**Status:** Production, available now

**Use Cases:**
- Employee onboarding verification
- Contractor access control
- Education credential verification
- Professional certification

**Features:**
- Azure AD integration
- OIDC/OAuth compatibility
- Enterprise SSO support
- Compliance (SOC 2, GDPR)

**Implementation:**
\`\`\`typescript
import { VerifiedIdClient } from '@azure/identity'

// Issue employee credential
async function issueEmployeeCredential(employeeId: string) {
  const client = new VerifiedIdClient({
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID
  })

  const issuanceRequest = {
    authority: 'did:web:verifiedid.contoso.com',
    includeQRCode: true,
    registration: {
      clientName: 'Contoso Corp'
    },
    callback: {
      url: 'https://contoso.com/api/issuer/issuance-callback',
      state: employeeId,
      headers: {
        'api-key': process.env.API_KEY
      }
    },
    type: 'VerifiedEmployee',
    manifest: 'https://verifiedid.contoso.com/manifests/employee',
    claims: {
      employeeId,
      department: 'Engineering',
      role: 'Software Engineer',
      startDate: '2024-01-15'
    }
  }

  const response = await client.createIssuanceRequest(issuanceRequest)
  return response.url // QR code URL for employee to scan
}

// Verify employee credential
async function verifyEmployee(presentationRequest: any) {
  const client = new VerifiedIdClient({
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID
  })

  const verification = await client.verifyPresentation({
    presentation: presentationRequest,
    acceptedIssuers: ['did:web:verifiedid.contoso.com'],
    trustedIssuerConfiguration: {
      type: 'VerifiedEmployee',
      minimumClaimsRequired: ['employeeId', 'department']
    }
  })

  return verification
}
\`\`\`

### Mobile Driver's License (mDL) - ISO 18013-5

**Status:** Deployed in 10+ US states, accepted by TSA

**Features:**
- Tap-to-share via NFC
- QR code fallback
- Selective disclosure (e.g., prove age >21 without showing birthdate)
- Offline verification

**States with mDL:**
- Arizona, Colorado, Connecticut, Georgia, Iowa, Kentucky, Maryland, Mississippi, Missouri, Oklahoma, Utah

**Use Cases:**
- Airport security (TSA)
- Age verification (bars, stores)
- Traffic stops (police)
- Hotel check-in

## The SSI Ecosystem

### Standards Bodies

**W3C (World Wide Web Consortium):**
- DID Core 1.0 (Recommendation 2022)
- Verifiable Credentials Data Model v2.0 (2025)
- VC JSON Schema specification
- ODRL (rights management)

**DIF (Decentralized Identity Foundation):**
- Presentation Exchange
- Credential Manifest
- SIOP (Self-Issued OpenID Provider)
- Universal Resolver

**IETF (Internet Engineering Task Force):**
- DID Resolution
- Status List 2021
- Linked Data Proofs

**ISO (International Organization for Standardization):**
- ISO 18013-5 (Mobile Driver's License)
- ISO 23220 (DID Resolution)

### Major Projects & Implementations

**1. Hyperledger (Linux Foundation)**

- **Aries**: Framework for SSI agents, wallets
- **Indy**: Blockchain for DIDs, schema registry
- **AnonCreds**: Privacy-preserving credentials (ZKPs)

**Use:** Government IDs (Canada, British Columbia), healthcare

**2. OpenID Foundation**

- **SIOP v2**: Self-Issued OpenID Provider (DID-based login)
- **OpenID4VC**: OpenID for Verifiable Credentials
- **OpenID4VP**: OpenID for Verifiable Presentations

**Use:** Bridges SSI with existing OAuth/OIDC infrastructure

**3. Trust Over IP (ToIP) Foundation**

- **ToIP Stack**: 4-layer model (utilities, DIDs, credentials, applications)
- **Governance frameworks**
- **Interoperability profiles**

**Members:** Mastercard, IBM, Microsoft, Accenture, governments

### Enterprise Adoption

**Financial Services:**
- **Mastercard**: Digital identity verification
- **Visa**: Cross-border credential verification
- **SWIFT**: KYC credentials for banks

**Healthcare:**
- **CommonPass**: COVID vaccination credentials (used by 25 airlines)
- **SMART Health Cards**: Verifiable health credentials
- **Good Health Pass**: Interoperability framework

**Education:**
- **Blockcerts**: MIT, Learning Machine
- **European Blockchain Services Infrastructure (EBSI)**: EU diplomas
- **Skills wallets**: Lifelong learning credentials

**Government:**
- **European Union**: eIDAS 2.0 (80% of citizens by 2026)
- **Canada**: PCTF (Pan-Canadian Trust Framework)
- **Singapore**: National Digital Identity
- **Australia**: myGovID

## Privacy & Security Considerations

### Privacy Wins

✅ **Selective Disclosure**: Share only what's needed
✅ **Minimal Data**: No unnecessary attributes collected
✅ **User Control**: You decide when to share
✅ **No Tracking**: Verifiers can't correlate across services (with proper DID usage)
✅ **Data Sovereignty**: You own your data

### Privacy Risks

⚠️ **Correlation via DID**: Using same DID everywhere = trackable
**Solution:** Use different DIDs for different contexts (pairwise DIDs)

⚠️ **Issuer Knows**: Issuer knows they gave you a credential
**Solution:** Blind signatures (issuer signs without seeing content)

⚠️ **Verifier Surveillance**: Verifiers could build databases of who presented what
**Solution:** Privacy-preserving verification, ephemeral sessions

### Security Best Practices

1. **Key Management**
   - Use hardware wallets for high-value credentials
   - Regular backups (encrypted)
   - Multi-signature for important operations

2. **Revocation Monitoring**
   - Check revocation status before presenting
   - Subscribe to issuer's revocation updates
   - Automatic expiration for sensitive credentials

3. **Wallet Attestation**
   - Verify wallet software integrity
   - Use wallets from trusted providers
   - Enable app-level biometric protection

4. **Phishing Resistance**
   - Verify verifier's DID before presenting
   - Check domain in presentation request
   - Use wallets with built-in verification

## The Future of Digital Wallets

### 2025-2026 (Near Term)

- **EU Wallet Rollout**: 80% of EU citizens with digital wallet
- **US mDL Expansion**: All 50 states offering mobile driver's licenses
- **Enterprise Adoption**: Major corporations deploying employee credential wallets
- **Banking Integration**: Verifiable credentials for KYC, replacing document uploads

### 2027-2030 (Medium Term)

- **Global Interoperability**: EU wallets work in US, Asia-Pacific
- **Credential Marketplace**: Buy/sell verified credentials (not personal info, but proofs)
- **Social Recovery Standard**: Lose device? Trusted contacts help recover
- **Biometric Binding**: Credentials cryptographically tied to biometrics

### 2030+ (Long Term)

- **Born Digital**: Children receive DIDs at birth
- **Lifelong Credentials**: From birth certificate to death certificate, all digital
- **AI-Assisted Verification**: AI agents verify credentials on your behalf
- **Quantum-Resistant**: Credentials protected against quantum computers

## Key Takeaways

1. **Digital Wallets** store DIDs, VCs, and keys - your complete digital identity

2. **DIDComm** provides secure, private, peer-to-peer messaging for SSI

3. **Real Implementations** are already deployed: EU wallets (2026), Microsoft Entra, mDLs

4. **Ecosystem Standards** (W3C, DIF, ISO) ensure interoperability

5. **Privacy by Design**: Selective disclosure, minimal data, user control

6. **Enterprise Adoption** is accelerating in finance, healthcare, education, government

**This is not hypothetical.** SSI is being deployed at scale right now. The question is whether you'll be ready.
          `
        },
        {
          type: "code",
          title: "Building a Complete SSI Wallet",
          language: "typescript",
          code: `/**
 * Complete Digital Identity Wallet Implementation
 * Demonstrates DID management, credential storage, and DIDComm messaging
 */

import { createAgent, IIdentifier, IKey } from '@veramo/core'
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'
import { CredentialPlugin, W3cMessageHandler } from '@veramo/credential-w3c'
import { DIDComm, DIDCommMessageHandler, IDIDComm } from '@veramo/did-comm'
import { MessageHandler } from '@veramo/message-handler'

/**
 * Digital Wallet Class
 * Manages DIDs, Credentials, and secure messaging
 */
class DigitalWallet {
  private agent: any
  private credentials: Map<string, any> = new Map()

  constructor() {
    // Initialize Veramo agent with all capabilities
    this.agent = createAgent({
      plugins: [
        new KeyManager({
          store: new MemoryKeyStore(),
          kms: {
            local: new KeyManagementSystem(new MemoryPrivateKeyStore())
          }
        }),
        new DIDManager({
          store: new MemoryDIDStore(),
          defaultProvider: 'did:key',
          providers: {
            'did:key': new KeyDIDProvider({
              defaultKms: 'local'
            }),
            'did:web': new WebDIDProvider({
              defaultKms: 'local'
            })
          }
        }),
        new CredentialPlugin(),
        new DIDComm(),
        new MessageHandler({
          messageHandlers: [
            new DIDCommMessageHandler(),
            new W3cMessageHandler()
          ]
        })
      ]
    })
  }

  /**
   * Create a new DID for specific context
   * @param alias Human-readable name
   * @param method DID method (did:key, did:web, etc.)
   */
  async createDID(alias: string, method: 'did:key' | 'did:web' = 'did:key'): Promise<IIdentifier> {
    console.log(\`🆔 Creating new DID (\${method}) with alias: \${alias}\`)

    const identifier = await this.agent.didManagerCreate({
      alias,
      provider: method,
      kms: 'local'
    })

    console.log(\`✅ Created DID: \${identifier.did}\`)
    return identifier
  }

  /**
   * List all DIDs in wallet
   */
  async listDIDs(): Promise<IIdentifier[]> {
    const identifiers = await this.agent.didManagerFind()
    console.log(\`\\n📋 Wallet contains \${identifiers.length} DID(s):\`)

    identifiers.forEach((id: IIdentifier) => {
      console.log(\`  - \${id.alias || 'No alias'}: \${id.did}\`)
    })

    return identifiers
  }

  /**
   * Receive and store a credential
   * @param vc Verifiable Credential (JWT or JSON-LD)
   */
  async receiveCredential(vc: any): Promise<void> {
    console.log(\`\\n📥 Receiving credential...\`)

    // Verify before storing
    const verification = await this.agent.verifyCredential({ credential: vc })

    if (!verification.verified) {
      console.log('❌ Credential verification failed!')
      console.log('Error:', verification.error)
      throw new Error('Invalid credential')
    }

    console.log('✅ Credential verified')

    // Store in wallet
    const id = vc.id || vc.proof.jwt || Date.now().toString()
    this.credentials.set(id, vc)

    const credType = Array.isArray(vc.type) ? vc.type.join(', ') : vc.type
    console.log(\`💼 Stored credential: \${credType}\`)
    console.log(\`   Issuer: \${typeof vc.issuer === 'string' ? vc.issuer : vc.issuer.id}\`)
    console.log(\`   Subject: \${vc.credentialSubject.id}\`)
  }

  /**
   * List all credentials in wallet
   */
  listCredentials(): any[] {
    console.log(\`\\n💼 Wallet contains \${this.credentials.size} credential(s):\`)

    Array.from(this.credentials.values()).forEach((vc, index) => {
      const type = Array.isArray(vc.type) ? vc.type.slice(1).join(', ') : vc.type
      const issuer = typeof vc.issuer === 'string' ? vc.issuer : vc.issuer.name || vc.issuer.id
      console.log(\`  \${index + 1}. \${type}\`)
      console.log(\`     Issued by: \${issuer}\`)
      console.log(\`     Issued: \${new Date(vc.issuanceDate).toLocaleDateString()}\`)
    })

    return Array.from(this.credentials.values())
  }

  /**
   * Create Verifiable Presentation from selected credentials
   * @param credentialIds IDs of credentials to include
   * @param holderDID DID presenting the credentials
   * @param challenge Nonce from verifier
   * @param domain Verifier's domain
   */
  async createPresentation(
    credentialIds: string[],
    holderDID: string,
    challenge: string,
    domain: string
  ): Promise<any> {
    console.log(\`\\n📤 Creating Verifiable Presentation...\`)
    console.log(\`   Holder: \${holderDID}\`)
    console.log(\`   For: \${domain}\`)
    console.log(\`   Credentials: \${credentialIds.length}\`)

    // Get selected credentials
    const selectedCredentials = credentialIds
      .map(id => this.credentials.get(id))
      .filter(Boolean)

    if (selectedCredentials.length === 0) {
      throw new Error('No valid credentials found')
    }

    // Create presentation
    const vp = await this.agent.createVerifiablePresentation({
      presentation: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        holder: holderDID,
        verifiableCredential: selectedCredentials
      },
      challenge,
      domain,
      proofFormat: 'jwt'
    })

    console.log('✅ Presentation created and signed')
    return vp
  }

  /**
   * Send DIDComm message to another DID
   * @param to Recipient DID
   * @param from Sender DID
   * @param message Message payload
   */
  async sendDIDCommMessage(
    to: string,
    from: string,
    message: any
  ): Promise<any> {
    console.log(\`\\n📧 Sending DIDComm message...\`)
    console.log(\`   From: \${from}\`)
    console.log(\`   To: \${to}\`)

    const didCommMessage = {
      type: message.type || 'https://didcomm.org/basicmessage/2.0/message',
      from,
      to: [to],
      id: Date.now().toString(),
      body: message.body,
      created_time: Math.floor(Date.now() / 1000)
    }

    // Pack message (encrypt)
    const packedMessage = await this.agent.packDIDCommMessage({
      packing: 'authcrypt', // Authenticated encryption
      message: didCommMessage
    })

    console.log('✅ Message packed and encrypted')
    return packedMessage
  }

  /**
   * Receive and decrypt DIDComm message
   * @param packedMessage Encrypted message
   */
  async receiveDIDCommMessage(packedMessage: any): Promise<any> {
    console.log(\`\\n📬 Receiving DIDComm message...\`)

    // Unpack message (decrypt)
    const unpackedMessage = await this.agent.unpackDIDCommMessage({
      message: packedMessage
    })

    console.log('✅ Message decrypted')
    console.log(\`   From: \${unpackedMessage.message.from}\`)
    console.log(\`   Type: \${unpackedMessage.message.type}\`)

    return unpackedMessage.message
  }

  /**
   * Request credential from issuer using DIDComm
   */
  async requestCredential(
    issuerDID: string,
    holderDID: string,
    credentialType: string,
    claims: any
  ): Promise<void> {
    console.log(\`\\n📨 Requesting credential from issuer...\`)

    const requestMessage = await this.sendDIDCommMessage(
      issuerDID,
      holderDID,
      {
        type: 'https://didcomm.org/issue-credential/3.0/request-credential',
        body: {
          credentialType,
          claims
        }
      }
    )

    console.log('✅ Credential request sent')
    // In real implementation, issuer would respond with credential
  }

  /**
   * Export wallet backup (encrypted)
   */
  async exportBackup(password: string): Promise<string> {
    const backup = {
      dids: await this.agent.didManagerFind(),
      credentials: Array.from(this.credentials.entries())
    }

    // Encrypt backup (simplified - use proper encryption in production)
    const encrypted = Buffer.from(JSON.stringify(backup)).toString('base64')

    console.log(\`\\n💾 Backup created (encrypted)\`)
    console.log(\`   DIDs: \${backup.dids.length}\`)
    console.log(\`   Credentials: \${backup.credentials.length}\`)

    return encrypted
  }

  /**
   * Import wallet backup
   */
  async importBackup(encryptedBackup: string, password: string): Promise<void> {
    console.log(\`\\n📂 Importing backup...\`)

    // Decrypt backup (simplified)
    const decrypted = Buffer.from(encryptedBackup, 'base64').toString()
    const backup = JSON.parse(decrypted)

    // Restore credentials
    backup.credentials.forEach(([id, vc]: [string, any]) => {
      this.credentials.set(id, vc)
    })

    console.log('✅ Backup restored')
    console.log(\`   DIDs: \${backup.dids.length}\`)
    console.log(\`   Credentials: \${backup.credentials.length}\`)
  }
}

/**
 * Complete Wallet Workflow Demo
 */
async function walletDemo() {
  console.log('\\n╔═══════════════════════════════════════╗')
  console.log('║  Digital Identity Wallet Demo         ║')
  console.log('╚═══════════════════════════════════════╝\\n')

  // 1. Initialize wallet
  const aliceWallet = new DigitalWallet()

  // 2. Create DIDs for different contexts
  const personalDID = await aliceWallet.createDID('Personal Identity', 'did:key')
  const professionalDID = await aliceWallet.createDID('Professional Identity', 'did:key')

  // 3. List DIDs
  await aliceWallet.listDIDs()

  // 4. Simulate receiving credentials
  console.log('\\n--- Receiving Credentials ---')

  const degreeCredential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'UniversityDegreeCredential'],
    issuer: {
      id: 'did:web:university.edu',
      name: 'Example University'
    },
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: personalDID.did,
      degree: {
        type: 'BachelorDegree',
        name: 'Computer Science'
      },
      gpa: '3.9'
    }
    // In production, would have proof/signature
  }

  await aliceWallet.receiveCredential(degreeCredential)

  // 5. List stored credentials
  aliceWallet.listCredentials()

  // 6. Create presentation for job application
  console.log('\\n--- Creating Presentation for Employer ---')

  const vp = await aliceWallet.createPresentation(
    [degreeCredential.id],
    professionalDID.did,
    'challenge-from-employer-xyz',
    'employer.com'
  )

  console.log('✅ Presentation ready to send to employer')

  // 7. DIDComm messaging
  console.log('\\n--- Secure Messaging with DIDComm ---')

  const message = await aliceWallet.sendDIDCommMessage(
    'did:example:recruiter',
    professionalDID.did,
    {
      type: 'https://didcomm.org/present-proof/3.0/presentation',
      body: { presentation: vp }
    }
  )

  // 8. Backup wallet
  console.log('\\n--- Backing Up Wallet ---')
  const backup = await aliceWallet.exportBackup('secure-password-123')
  console.log(\`Backup size: \${backup.length} characters\`)

  console.log('\\n╔═══════════════════════════════════════╗')
  console.log('║  Demo Complete!                        ║')
  console.log('╚═══════════════════════════════════════╝\\n')
}

// Run the demo
walletDemo().catch(console.error)`
        }
      ],
      quiz: {
        id: "digital-wallets-quiz",
        title: "Digital Wallets & SSI Ecosystem Quiz",
        description: "Test your understanding of digital wallets, DIDComm, and the SSI ecosystem",
        passingScore: 70,
        questions: [
          {
            id: "wallet-q1",
            question: "What is the primary difference between custodial and non-custodial digital wallets?",
            options: [
              "Custodial wallets are more secure",
              "Non-custodial wallets store private keys on the user's device, while custodial wallets store keys on the provider's servers",
              "Custodial wallets are faster",
              "They are the same thing"
            ],
            correctAnswer: 1,
            explanation: "Non-custodial wallets store private keys on the user's device, giving the user full control and true self-sovereignty, but requiring them to manage backups. Custodial wallets store keys on the provider's servers, making recovery easier but requiring trust in the provider and sacrificing some sovereignty. The industry trend is toward non-custodial with social recovery mechanisms."
          },
          {
            id: "wallet-q2",
            question: "What is DIDComm and what problem does it solve?",
            options: [
              "A way to compress DIDs for storage",
              "A secure, private, peer-to-peer messaging protocol that provides end-to-end encryption and metadata protection",
              "A blockchain for storing DIDs",
              "A programming language for DIDs"
            ],
            correctAnswer: 1,
            explanation: "DIDComm is a secure messaging protocol for SSI that provides end-to-end encryption, metadata protection, forward secrecy, and repudiability. Unlike traditional messaging (email, SMS) where intermediaries can read content and metadata, DIDComm ensures only sender and recipient can decrypt messages, and even metadata like 'who messaged whom' is protected."
          },
          {
            id: "wallet-q3",
            question: "What is the EU Digital Identity Wallet (eIDAS 2.0) and when is it launching?",
            options: [
              "A cryptocurrency wallet, launched in 2020",
              "A government-mandated digital identity wallet for all EU citizens, launching in 2026 with 80% adoption target",
              "A private company's product, available now",
              "An optional wallet only for businesses"
            ],
            correctAnswer: 1,
            explanation: "The EU Digital Identity Wallet is mandated by eIDAS 2.0 regulation, requiring all EU member states to provide digital identity wallets to citizens by 2026, targeting 80% adoption. These wallets will be interoperable across member states and used for government services, banking, healthcare, and cross-border identity verification - representing the largest-scale SSI deployment globally."
          },
          {
            id: "wallet-q4",
            question: "What are the core functions of a digital identity wallet?",
            options: [
              "Only storing passwords",
              "DID management, credential storage, presentation creation, verification, and backup/recovery",
              "Just displaying QR codes",
              "Only cryptocurrency storage"
            ],
            correctAnswer: 1,
            explanation: "Digital identity wallets provide five core functions: (1) DID Management - generate, store, export DIDs, (2) Credential Storage - receive, organize, search VCs, (3) Presentation Creation - select credentials, create VPs, sign with DID, (4) Verification - verify incoming credentials, check issuer trust, validate signatures, and (5) Backup & Recovery - encrypted backups, seed phrase recovery, social recovery, multi-device sync."
          },
          {
            id: "wallet-q5",
            question: "What is a Mobile Driver's License (mDL) based on ISO 18013-5?",
            options: [
              "A photo of your license on your phone",
              "A digital driver's license with NFC tap-to-share, selective disclosure, and offline verification capabilities",
              "An app to book driving lessons",
              "A GPS navigation system"
            ],
            correctAnswer: 1,
            explanation: "mDL (Mobile Driver's License) following ISO 18013-5 is a verifiable credential version of a driver's license with advanced capabilities: NFC tap-to-share for instant verification, QR code fallback, selective disclosure (e.g., prove age >21 without showing birthdate), and offline verification. Currently deployed in 10+ US states and accepted by TSA at airports."
          },
          {
            id: "wallet-q6",
            question: "Why might you use different DIDs for different contexts (pairwise DIDs)?",
            options: [
              "It's required by law",
              "To prevent correlation and tracking across different services, preserving privacy",
              "To save storage space",
              "There is no reason - use one DID everywhere"
            ],
            correctAnswer: 1,
            explanation: "Using different DIDs for different contexts (pairwise DIDs) is a privacy best practice that prevents correlation tracking. If you use the same DID everywhere (employer, bank, social media), these services could collude to track your activities across platforms. By using context-specific DIDs (one for work, one for finance, one for social), you maintain privacy while still proving your identity when needed."
          }
        ]
      }
    }
  ]
}
