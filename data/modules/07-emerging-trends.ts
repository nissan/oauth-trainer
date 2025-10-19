/**
 * Module 7: Emerging IAM Trends
 * Covers Decentralized Identity, Verifiable Credentials, CAE, Zero Trust, and future directions
 */

import type { Module } from "@/types"

export const emergingTrendsModule: Module = {
  id: "emerging-trends",
  slug: "emerging-trends",
  title: "Emerging IAM Trends",
  description:
    "Explore the future of identity and access management with Decentralized Identity (DID), Verifiable Credentials, Continuous Access Evaluation (CAE), Zero Trust architecture, and emerging standards.",
  icon: "🚀",
  difficulty: "advanced",
  estimatedHours: 3.5,
  prerequisiteModules: ["auth-fundamentals", "oauth2", "oidc"],
  badge: {
    id: "future-ready-iam",
    name: "Future-Ready IAM Expert",
    description:
      "Mastered emerging trends in identity and access management including DID, Verifiable Credentials, CAE, and Zero Trust",
    icon: "🚀",
  },
  lessons: [
    {
      id: "decentralized-identity",
      slug: "decentralized-identity",
      title: "Decentralized Identity & Verifiable Credentials",
      description:
        "Understand decentralized identity (DID), verifiable credentials (VCs), and how blockchain technology is transforming digital identity",
      estimatedMinutes: 40,
      content: [
        {
          type: "text",
          title: "Introduction to Decentralized Identity",
          content: `Decentralized identity (DID) represents a paradigm shift from centralized identity providers to user-controlled, portable digital identities. Instead of Google, Facebook, or government databases controlling your identity, **you** own and control your credentials.

## The Problem with Centralized Identity

Traditional identity systems have several critical issues:

- **Centralization Risk**: Single points of failure (data breaches at Equifax, Marriott, etc.)
- **Lack of Portability**: You can't easily move your identity between services
- **Privacy Concerns**: Identity providers track all your authentication events
- **Vendor Lock-in**: You're dependent on the IdP's availability and policies
- **No User Control**: The IdP can revoke or modify your identity at will

## What is Decentralized Identity (DID)?

A **Decentralized Identifier (DID)** is a globally unique identifier that:

- Is created by the subject (you)
- Is controlled by the subject (you manage the private keys)
- Is verifiable cryptographically
- Does not require a centralized registry (uses blockchain or distributed ledger)
- Can be resolved to a DID Document containing public keys and service endpoints

**Example DID:**
\`\`\`
did:example:123456789abcdefghi
\`\`\`

Structure: \`did:<method>:<identifier>\`

- **did**: The scheme
- **example**: The DID method (could be \`ethr\`, \`ion\`, \`key\`, \`web\`, etc.)
- **123456789abcdefghi**: The method-specific identifier

## DID Methods

Different DID methods use different underlying technologies:

| Method | Technology | Example | Use Case |
|--------|-----------|---------|----------|
| **did:ethr** | Ethereum blockchain | \`did:ethr:0x1234...\` | Ethereum-based identities |
| **did:ion** | Bitcoin + IPFS | \`did:ion:EiClWZ...\` | Microsoft's ION network |
| **did:key** | Cryptographic key | \`did:key:z6MkpT...\` | Self-contained, no ledger |
| **did:web** | Web domain | \`did:web:example.com\` | DNS-based DIDs |
| **did:sov** | Sovrin network | \`did:sov:12345\` | Hyperledger Indy/Sovrin |

## DID Documents

A DID resolves to a **DID Document** containing:

- **Public keys** for verification
- **Authentication methods**
- **Service endpoints** (where to reach the identity owner)
- **Verification methods**

**Example DID Document:**
\`\`\`json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi",
  "verificationMethod": [{
    "id": "did:example:123456789abcdefghi#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
  }],
  "authentication": [
    "did:example:123456789abcdefghi#keys-1"
  ],
  "service": [{
    "id": "did:example:123456789abcdefghi#vcs",
    "type": "VerifiableCredentialService",
    "serviceEndpoint": "https://example.com/vc/"
  }]
}
\`\`\``,
        },
        {
          type: "text",
          title: "Verifiable Credentials (VCs)",
          content: `**Verifiable Credentials (VCs)** are digital credentials that can be cryptographically verified. Think of them as digital versions of driver's licenses, diplomas, passports, or employee badges.

## The Three Roles in the VC Model

\`\`\`
Issuer → Issues credential → Holder → Presents credential → Verifier
\`\`\`

1. **Issuer**: Organization that issues the credential (university, government, employer)
2. **Holder**: Individual who owns and stores the credential (you)
3. **Verifier**: Entity that verifies the credential (employer checking your diploma)

## Key Properties of Verifiable Credentials

- **Tamper-evident**: Cryptographic signatures detect any modifications
- **Privacy-preserving**: Selective disclosure (share only what's needed)
- **User-controlled**: You decide when and with whom to share
- **Interoperable**: Based on W3C standards
- **Revocable**: Issuers can revoke credentials if needed

## Verifiable Credential Structure

**Example: University Diploma as a VC**
\`\`\`json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2024-01-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science in Computer Science",
      "degreeSchool": "Example University"
    },
    "graduationDate": "2023-12-15"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-01-01T00:00:00Z",
    "verificationMethod": "https://example.edu/issuers/565049#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z58DAdFfa9SkqZMVPxAQp...mN1jftHg"
  }
}
\`\`\`

## Verifiable Presentations

A **Verifiable Presentation (VP)** is when you package one or more VCs to present to a verifier.

**Example: Job application presenting diploma + background check**
\`\`\`json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": "VerifiablePresentation",
  "verifiableCredential": [
    {
      /* University Diploma VC */
    },
    {
      /* Background Check VC */
    }
  ],
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-06-15T09:30:00Z",
    "verificationMethod": "did:example:ebfeb1f712ebc6f1c276e12ec21#keys-1",
    "proofPurpose": "authentication",
    "challenge": "abc123-from-verifier",
    "proofValue": "z3FXQjecWRwCg7WfVHh...j3AKb2x"
  }
}
\`\`\`

The proof signature proves:
- You own the DID in the credentials
- The credentials haven't been tampered with
- The presentation is fresh (via challenge/nonce)

## Selective Disclosure

One powerful feature of VCs is **selective disclosure** - sharing only the necessary information.

**Example: Age verification for alcohol purchase**

Instead of showing your entire driver's license (name, address, photo, license number), you can create a zero-knowledge proof that reveals only:
- "This person is over 21 years old: TRUE"

No other information is disclosed. This is achieved through:
- **BBS+ Signatures**: Allows selective disclosure of individual claims
- **Zero-Knowledge Proofs**: Prove statements without revealing underlying data`,
        },
        {
          type: "diagram",
          title: "Verifiable Credentials Flow",
          content: `sequenceDiagram
    participant Issuer as Issuer<br/>(University)
    participant Holder as Holder<br/>(Graduate)
    participant Verifier as Verifier<br/>(Employer)
    participant Blockchain as DID Registry<br/>(Blockchain)

    Note over Issuer,Blockchain: 1. Setup Phase
    Issuer->>Blockchain: Register DID + Public Key
    Holder->>Blockchain: Register DID + Public Key

    Note over Issuer,Holder: 2. Credential Issuance
    Holder->>Issuer: Request diploma credential
    Issuer->>Issuer: Verify graduation
    Issuer->>Issuer: Create VC, sign with private key
    Issuer->>Holder: Issue Verifiable Credential
    Holder->>Holder: Store in digital wallet

    Note over Holder,Verifier: 3. Credential Presentation
    Verifier->>Holder: Request proof of degree
    Holder->>Holder: Create Verifiable Presentation
    Holder->>Holder: Sign VP with holder's private key
    Holder->>Verifier: Send Verifiable Presentation

    Note over Verifier,Blockchain: 4. Verification
    Verifier->>Blockchain: Resolve Issuer DID → Public Key
    Verifier->>Verifier: Verify Issuer signature
    Verifier->>Blockchain: Resolve Holder DID → Public Key
    Verifier->>Verifier: Verify Holder signature
    Verifier->>Issuer: Check revocation status (optional)
    Verifier->>Verifier: Accept or reject credential`,
          caption:
            "Complete flow of issuing, storing, presenting, and verifying a decentralized credential",
        },
        {
          type: "text",
          title: "Real-World Applications",
          content: `## Current Implementations

### 1. **European Digital Identity Wallet (EUDI)**
The EU is implementing digital identity wallets for all EU citizens by 2024-2026:
- Store government IDs, driver's licenses, diplomas
- Use for banking, travel, healthcare
- Based on W3C VC standards
- Supports selective disclosure

### 2. **Microsoft Entra Verified ID** (formerly Azure AD Verifiable Credentials)
Enterprise credential verification platform:
- Issue employee credentials
- Verify education and certifications
- Integrate with existing Azure AD
- Uses ION (Bitcoin + IPFS) for DID anchoring

### 3. **Velocity Network Foundation**
Career credentials for job seekers:
- Employment verification
- Skills certifications
- Background checks
- Used by IBM, Workday, SHRM

### 4. **Government Digital Identity**
Multiple countries implementing VC-based digital IDs:
- **Canada**: Digital Trust Ecosystem
- **Singapore**: MyInfo with VC support
- **South Korea**: Digital ID with blockchain
- **UK**: Digital Identity and Attributes Trust Framework

## Advantages Over Traditional Systems

| Aspect | Traditional (OAuth/SAML) | Decentralized (DID/VC) |
|--------|-------------------------|------------------------|
| **Control** | Identity provider controls | User controls |
| **Privacy** | IdP sees all logins | Zero-knowledge proofs possible |
| **Portability** | Locked to IdP | Portable across services |
| **Offline** | Requires online IdP | Can verify offline |
| **Single Point of Failure** | Yes (IdP downtime) | No (distributed) |
| **Revocation** | IdP can revoke anytime | Requires issuer action |
| **Correlation** | IdP can track usage | Minimized with pairwise DIDs |`,
        },
        {
          type: "code",
          title: "Creating and Verifying a Verifiable Credential (JavaScript)",
          language: "javascript",
          content: `// Using the @veramo/core library for DID and VC operations

import { createAgent, IResolver, ICredentialIssuer } from '@veramo/core'
import { CredentialPlugin } from '@veramo/credential-w3c'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'

// 1. Setup Veramo agent with DID resolver and credential plugins
const agent = createAgent({
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: 'your-infura-id' }),
      }),
    }),
    new CredentialPlugin(),
  ],
})

// 2. ISSUER: Create a Verifiable Credential
async function issueCredential() {
  const issuerDid = 'did:ethr:0x1234...' // University's DID
  const holderDid = 'did:ethr:0x5678...' // Graduate's DID

  const verifiableCredential = await agent.createVerifiableCredential({
    credential: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      issuer: { id: issuerDid },
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: holderDid,
        degree: {
          type: 'BachelorDegree',
          name: 'Bachelor of Science in Computer Science',
          degreeSchool: 'Example University',
        },
        graduationDate: '2023-12-15',
      },
    },
    proofFormat: 'jwt', // or 'lds' for JSON-LD signatures
  })

  console.log('Issued VC:', JSON.stringify(verifiableCredential, null, 2))
  return verifiableCredential
}

// 3. HOLDER: Create a Verifiable Presentation
async function createPresentation(credentials) {
  const holderDid = 'did:ethr:0x5678...'

  const verifiablePresentation = await agent.createVerifiablePresentation({
    presentation: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: credentials,
    },
    proofFormat: 'jwt',
    challenge: 'challenge-from-verifier-abc123', // Prevents replay attacks
    domain: 'example-employer.com', // Binds to specific verifier
  })

  console.log('Created VP:', JSON.stringify(verifiablePresentation, null, 2))
  return verifiablePresentation
}

// 4. VERIFIER: Verify a Verifiable Presentation
async function verifyPresentation(vp) {
  try {
    const result = await agent.verifyPresentation({
      presentation: vp,
      challenge: 'challenge-from-verifier-abc123',
      domain: 'example-employer.com',
    })

    if (result.verified) {
      console.log('✅ Presentation is valid!')
      console.log('Credential subject:', vp.verifiableCredential[0].credentialSubject)

      // Additional checks
      const issuerDid = vp.verifiableCredential[0].issuer.id
      console.log('Issued by:', issuerDid)

      // Check if issuer is trusted (in production, check against registry)
      const trustedIssuers = ['did:ethr:0x1234...'] // University DIDs
      if (trustedIssuers.includes(issuerDid)) {
        console.log('✅ Issuer is trusted')
        return true
      } else {
        console.log('❌ Issuer not in trusted list')
        return false
      }
    } else {
      console.log('❌ Presentation is invalid:', result.error)
      return false
    }
  } catch (error) {
    console.error('Verification failed:', error)
    return false
  }
}

// 5. Complete workflow
async function completeWorkflow() {
  // Issuer creates and issues credential
  const vc = await issueCredential()

  // Holder stores in wallet (simplified - would use encrypted storage)
  const wallet = { credentials: [vc] }

  // Holder creates presentation for job application
  const vp = await createPresentation(wallet.credentials)

  // Verifier (employer) verifies the presentation
  const isValid = await verifyPresentation(vp)

  if (isValid) {
    console.log('🎉 Credential accepted! Candidate verified.')
  } else {
    console.log('⛔ Credential rejected.')
  }
}

completeWorkflow()`,
          caption:
            "Complete implementation of issuing, presenting, and verifying credentials using Veramo",
        },
        {
          type: "text",
          title: "Challenges and Considerations",
          content: `## Current Challenges

### 1. **Complexity**
- Steep learning curve for developers
- Multiple standards (DID Core, VC Data Model, JSON-LD, JWT)
- Wallet management burden on users

### 2. **Key Management**
- Losing private keys = losing identity
- No "forgot password" option
- Recovery mechanisms needed (social recovery, multi-sig)

### 3. **Revocation**
- How to revoke credentials efficiently?
- **Options:**
  - Revocation lists (centralized)
  - Accumulator-based revocation (privacy-preserving)
  - Status List 2021 (W3C standard)

### 4. **Scalability**
- Blockchain write costs (gas fees on Ethereum)
- Network congestion
- **Solutions:**
  - Layer 2 networks (ION uses Bitcoin + IPFS)
  - did:key method (no blockchain needed)
  - did:web (DNS-based, no blockchain)

### 5. **Interoperability**
- Many different DID methods
- Wallet compatibility issues
- Need for universal standards

### 6. **Regulatory Compliance**
- GDPR "right to be forgotten" vs. immutable blockchains
- KYC/AML requirements
- Government acceptance of digital credentials

## Best Practices

### For Issuers:
- Use well-established DID methods (did:ion, did:ethr, did:web)
- Implement credential revocation from day one
- Provide clear credential schemas
- Ensure issuer DID is publicly trusted

### For Holders:
- Use secure wallet applications (hardware wallets when possible)
- Backup recovery phrases securely
- Understand selective disclosure features
- Verify credential issuers before trusting

### For Verifiers:
- Maintain trusted issuer registries
- Always check revocation status
- Use challenge/nonce to prevent replay attacks
- Verify both credential and presentation signatures

### For Developers:
- Use established libraries (Veramo, DIF libraries)
- Follow W3C standards strictly
- Implement comprehensive error handling
- Plan for key rotation and recovery`,
        },
      ],
      quiz: [
        {
          id: "q1",
          question: "What is the primary benefit of Decentralized Identity (DID) over traditional centralized identity providers?",
          options: [
            "DIDs are faster to authenticate",
            "DIDs give users control over their identity and credentials",
            "DIDs are cheaper to implement",
            "DIDs work without the internet",
          ],
          correctAnswer: 1,
          explanation:
            "The key benefit of DID is user control. Unlike centralized systems where Google or Facebook controls your identity, DIDs are owned and controlled by the user through cryptographic keys. This provides portability, privacy, and eliminates single points of failure.",
        },
        {
          id: "q2",
          question: "In the Verifiable Credentials model, who signs the credential to prove its authenticity?",
          options: [
            "The Holder (person receiving the credential)",
            "The Verifier (person checking the credential)",
            "The Issuer (organization issuing the credential)",
            "The blockchain network",
          ],
          correctAnswer: 2,
          explanation:
            "The Issuer signs the credential with their private key. This cryptographic signature proves the credential was issued by that specific organization and hasn't been tampered with. The Holder later signs the Verifiable Presentation to prove they own the credential.",
        },
        {
          id: "q3",
          question: "What does 'selective disclosure' in Verifiable Credentials allow you to do?",
          options: [
            "Share your credentials with selected verifiers only",
            "Reveal only specific claims from a credential, hiding others",
            "Choose which blockchain to store your credentials on",
            "Select different cryptographic algorithms for signing",
          ],
          correctAnswer: 1,
          explanation:
            "Selective disclosure allows you to reveal only the necessary claims from a credential while hiding others. For example, proving you're over 21 without revealing your exact birthdate, name, or address. This is typically implemented using BBS+ signatures or zero-knowledge proofs.",
        },
        {
          id: "q4",
          question: "What is a DID Document?",
          options: [
            "A legal document proving your identity",
            "A JSON document containing public keys, authentication methods, and service endpoints for a DID",
            "A smart contract on the blockchain",
            "A PDF file stored in your digital wallet",
          ],
          correctAnswer: 1,
          explanation:
            "A DID Document is a JSON document that contains the public keys, authentication methods, and service endpoints associated with a DID. When you resolve a DID, you get back its DID Document, which tells you how to verify signatures and communicate with the identity owner.",
        },
        {
          id: "q5",
          question: "Which challenge is unique to decentralized identity compared to traditional OAuth/SAML?",
          options: [
            "Phishing attacks",
            "Man-in-the-middle attacks",
            "Losing private keys means losing your identity permanently",
            "Session hijacking",
          ],
          correctAnswer: 2,
          explanation:
            "In decentralized identity, you control your own private keys. If you lose them, there's no 'forgot password' option - your identity is permanently lost unless you've set up recovery mechanisms. This is fundamentally different from OAuth/SAML where the provider can reset your account.",
        },
      ],
    },
    {
      id: "continuous-access-evaluation",
      slug: "continuous-access-evaluation",
      title: "Continuous Access Evaluation (CAE) & Adaptive Authentication",
      description:
        "Learn about Continuous Access Evaluation, risk-based authentication, and adaptive access control that continuously monitors and adjusts access decisions",
      estimatedMinutes: 35,
      content: [
        {
          type: "text",
          title: "Introduction to Continuous Access Evaluation",
          content: `Traditional authentication follows a simple model: you log in once, get a token (often valid for hours or days), and you're trusted until the token expires. But what if:

- An employee's laptop is stolen?
- A user's account is compromised?
- A device becomes infected with malware?
- A user travels to a suspicious location?
- An insider threat is detected?

With traditional authentication, attackers have the full token lifetime to cause damage. **Continuous Access Evaluation (CAE)** solves this by continuously monitoring sessions and revoking access in real-time.

## Traditional vs. Continuous Access Evaluation

**Traditional Model:**
\`\`\`
Login → Receive Token (valid 1 hour) → Use token for 1 hour → Token expires → Re-login
\`\`\`

If the account is compromised at minute 5, attackers have 55 minutes of access.

**CAE Model:**
\`\`\`
Login → Receive Token → Continuous monitoring → Risk detected → Token revoked immediately
\`\`\`

Compromise detected in real-time, access revoked within seconds.

## Key Principles of CAE

### 1. **Real-Time Policy Enforcement**
- Access decisions are not "set and forget"
- Policies are continuously re-evaluated
- Changes in risk posture trigger immediate action

### 2. **Event-Driven Revocation**
CAE responds to critical events:
- User account disabled
- Password reset
- User moved to high-risk group
- IP address change to suspicious location
- Device compliance status changed
- Unusual activity patterns detected

### 3. **Token Lifetime Independence**
- Even long-lived tokens can be revoked instantly
- No need to wait for token expiration
- Balance between security and user experience

## How CAE Works

**Architecture Components:**

\`\`\`
┌─────────────┐        ┌──────────────┐        ┌─────────────┐
│   Client    │◄──────►│   Resource   │◄──────►│ Identity    │
│ Application │        │    Server    │        │  Provider   │
└─────────────┘        └──────────────┘        └─────────────┘
                              ▲                        ▲
                              │                        │
                              ▼                        ▼
                       ┌──────────────┐        ┌─────────────┐
                       │ CAE Events   │        │ Policy      │
                       │ (webhooks)   │        │ Engine      │
                       └──────────────┘        └─────────────┘
\`\`\`

### Step-by-step flow:

1. **User authenticates** → Receives access token
2. **Application makes API request** with token
3. **Resource server validates token** (standard OAuth check)
4. **CAE-enabled resource server subscribes** to critical events for this user
5. **Critical event occurs** (e.g., account disabled)
6. **Identity provider sends event notification** to resource server
7. **Resource server immediately revokes access** and rejects requests
8. **Client is challenged to re-authenticate**`,
        },
        {
          type: "diagram",
          title: "Continuous Access Evaluation Flow",
          content: `sequenceDiagram
    participant User
    participant Client as Client App
    participant API as Resource Server<br/>(CAE-enabled)
    participant IdP as Identity Provider<br/>(with CAE)
    participant Admin as Admin/Security

    Note over User,IdP: Initial Authentication
    User->>Client: Login
    Client->>IdP: Authenticate
    IdP->>Client: Access Token (valid 1 hour)
    Client->>API: API Request + Token
    API->>IdP: Validate token
    IdP->>API: Token valid, claims
    API->>Client: API Response

    Note over API,IdP: CAE Subscription
    API->>IdP: Subscribe to CAE events for user

    Note over User,Admin: Normal Usage
    Client->>API: API Request + Token
    API->>Client: API Response (success)

    Note over Admin,IdP: Critical Security Event
    Admin->>IdP: Disable user account
    IdP->>IdP: Trigger CAE event
    IdP->>API: CAE Event: User revoked

    Note over Client,API: Access Immediately Blocked
    Client->>API: API Request + Token
    API->>API: Check CAE status
    API->>Client: 401 Unauthorized<br/>+ WWW-Authenticate: claims="insufficient_claims"
    Client->>User: Re-authentication required
    User->>Client: Attempt login
    Client->>IdP: Authenticate
    IdP->>Client: 403 Forbidden (account disabled)`,
          caption:
            "CAE flow showing immediate token revocation upon critical security event",
        },
        {
          type: "text",
          title: "Microsoft Entra CAE Implementation",
          content: `Microsoft Entra ID (formerly Azure AD) has production CAE implementation. Let's examine how they do it.

## Critical Events That Trigger CAE

### 1. **User Account Events**
- Account disabled or deleted
- User password changed or reset
- User session revoked by admin
- Multifactor authentication (MFA) configured or removed

### 2. **Location and Network Events**
- IP address changed to unfamiliar location
- Access from anonymous proxy or Tor
- Travel to suspicious country
- Impossible travel detected

### 3. **Device and Compliance Events**
- Device marked as non-compliant
- Device no longer meets conditional access policies
- Device risk level increased

### 4. **Token and Session Events**
- Refresh token revoked
- Anomalous token usage detected
- Session lifetime policy changed

## CAE Claim Challenges

When a critical event occurs, the resource server returns a special error:

\`\`\`http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer
  realm="example.com",
  error="insufficient_claims",
  claims="eyJhY2Nlc3NfdG9rZW4iOnsibmJmIjp7ImVzc2VudGlhbCI6dHJ1ZSwgInZhbHVlIjoiMTcwNjgwMDAwMCJ9fX0"
\`\`\`

The \`claims\` parameter (base64-encoded JSON) tells the client what's missing:

\`\`\`json
{
  "access_token": {
    "nbf": {
      "essential": true,
      "value": "1706800000"
    }
  }
}
\`\`\`

Translation: "This token was issued before the critical event at timestamp 1706800000. Get a new one."

## Token Lifetime with CAE

| Token Type | Without CAE | With CAE |
|-----------|-------------|----------|
| **Access Token** | 1 hour | 24 hours (safe due to CAE) |
| **Refresh Token** | Days/weeks | Days/weeks |
| **Effective Security** | 1 hour window | Real-time revocation |
| **User Experience** | Frequent re-auth | Rare re-auth |

CAE enables **longer token lifetimes** without sacrificing security, improving user experience.`,
        },
        {
          type: "code",
          title: "Implementing CAE in a Resource Server (Node.js)",
          language: "javascript",
          content: `// CAE-enabled Resource Server using Microsoft Entra ID

import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const app = express()
const PORT = 3000

// JWKS client to fetch Microsoft's public keys
const client = jwksClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
  cache: true,
  rateLimit: true,
})

// In-memory CAE revocation list (in production, use Redis or database)
const revokedTokens = new Set()

// Microsoft CAE event webhook endpoint
app.post('/cae/events', express.json(), async (req, res) => {
  console.log('📢 CAE Event received:', req.body)

  const events = req.body.value || []

  for (const event of events) {
    if (event.eventType === 'microsoft.graph.user.revoked') {
      const userId = event.data.userId
      const revokedAt = event.data.timestamp

      console.log(\`🚫 User \${userId} revoked at \${revokedAt}\`)

      // Add to revocation list (in production, persist to database)
      revokedTokens.add(\`user:\${userId}:after:\${revokedAt}\`)

      // Optionally: Invalidate active sessions, close WebSocket connections, etc.
    }

    if (event.eventType === 'microsoft.graph.user.ipChanged') {
      const userId = event.data.userId
      const newIp = event.data.ipAddress

      console.log(\`🌐 User \${userId} changed IP to \${newIp}\`)

      // Trigger re-authentication challenge for this user
      // (implementation depends on your session management)
    }
  }

  res.status(202).send('Accepted')
})

// Get public key for JWT verification
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err)
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  })
}

// CAE-aware authentication middleware
async function authenticateWithCAE(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.substring(7)

  // Verify JWT signature
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', details: err.message })
    }

    // Extract claims
    const userId = decoded.oid || decoded.sub // Object ID or Subject
    const tokenIssuedAt = decoded.iat
    const xmsCae = decoded['xms_cc'] // CAE claim presence

    // Check if token has CAE support
    if (!xmsCae || !xmsCae.includes('CP1')) {
      console.warn('⚠️  Token does not support CAE (missing xms_cc:CP1 claim)')
    }

    // Check if user has been revoked AFTER this token was issued
    let needsChallenge = false
    for (const entry of revokedTokens) {
      if (entry.startsWith(\`user:\${userId}:after:\`)) {
        const revokedAt = parseInt(entry.split(':')[3], 10)
        if (tokenIssuedAt < revokedAt) {
          console.log(\`🚫 Token issued before revocation event. Challenging.\`)
          needsChallenge = true
          break
        }
      }
    }

    if (needsChallenge) {
      // Return claims challenge
      const claimsChallenge = Buffer.from(
        JSON.stringify({
          access_token: {
            nbf: {
              essential: true,
              value: Math.floor(Date.now() / 1000).toString(),
            },
          },
        })
      ).toString('base64')

      return res
        .status(401)
        .set(
          'WWW-Authenticate',
          \`Bearer realm="api.example.com", error="insufficient_claims", claims="\${claimsChallenge}"\`
        )
        .json({
          error: 'insufficient_claims',
          message: 'Token no longer valid due to security event. Re-authenticate required.',
        })
    }

    // Token is valid and passes CAE checks
    req.user = decoded
    next()
  })
}

// Protected API endpoint
app.get('/api/protected', authenticateWithCAE, (req, res) => {
  res.json({
    message: 'Success! You have access.',
    user: req.user.name || req.user.preferred_username,
  })
})

// Subscription validation (Microsoft requires this for webhooks)
app.post('/cae/events/validate', (req, res) => {
  const validationToken = req.query.validationToken
  if (validationToken) {
    console.log('✅ Subscription validation successful')
    return res.status(200).send(validationToken)
  }
  res.status(400).send('Missing validation token')
})

app.listen(PORT, () => {
  console.log(\`🚀 CAE-enabled API server running on http://localhost:\${PORT}\`)
  console.log(\`📡 CAE webhook endpoint: http://localhost:\${PORT}/cae/events\`)
})`,
          caption:
            "Production-ready CAE implementation with event handling, claims challenges, and real-time token revocation",
        },
        {
          type: "text",
          title: "Adaptive Authentication & Risk-Based Access Control",
          content: `CAE is often combined with **Adaptive Authentication** - dynamically adjusting authentication requirements based on risk signals.

## Risk Signals

Modern identity platforms analyze dozens of signals:

### **User Behavior Signals**
- Login time (is it 3 AM?)
- Login frequency (50 logins in 5 minutes?)
- Geolocation changes (Boston → Tokyo in 1 hour?)
- Device fingerprint changes
- Browser/OS version changes

### **Network Signals**
- IP reputation (known malicious IPs, VPNs, Tor)
- ISP (corporate vs. residential vs. datacenter)
- Autonomous System Number (ASN) reputation
- Anonymous proxies detected

### **Device Signals**
- Device compliance status
- Antivirus status
- Disk encryption enabled
- Jailbroken/rooted devices
- Device trust level

### **Application Signals**
- Sensitivity of requested resource
- Data classification level
- Privilege level of operation (read vs. write vs. delete)

## Risk Scoring

Each signal contributes to a **risk score** (0-100):

| Risk Level | Score | Authentication Required |
|-----------|-------|------------------------|
| **Low** | 0-30 | Username + Password |
| **Medium** | 31-60 | Username + Password + MFA |
| **High** | 61-80 | MFA + Device compliance check |
| **Critical** | 81-100 | Block access + Admin approval |

## Adaptive Authentication Examples

### **Low Risk:**
- Known device
- Corporate network
- Normal working hours
- Regular geolocation

**Action:** Allow access with simple authentication

### **Medium Risk:**
- New device
- Home network
- Normal working hours
- Accessing sensitive data

**Action:** Require MFA (push notification or TOTP)

### **High Risk:**
- Unknown device
- VPN or proxy
- Unusual hours (2 AM)
- Accessing highly sensitive data

**Action:** Require MFA + Device registration + Admin notification

### **Critical Risk:**
- Anonymous proxy
- Known malicious IP
- Impossible travel detected
- Accessing crown jewels (financial data, PII)

**Action:** Block access + Force password reset + Admin intervention

## Step-Up Authentication

Sometimes initial authentication is low-assurance, but certain operations require **step-up** (additional authentication):

\`\`\`
Login with password (low assurance)
  ↓
Browse documents (allowed)
  ↓
Download financial report (requires MFA)
  ↓
Challenge user for MFA
  ↓
MFA successful → Grant access
\`\`\`

Microsoft calls this **Conditional Access**, Okta calls it **Adaptive MFA**, Auth0 calls it **Progressive Profiling**.`,
        },
        {
          type: "code",
          title: "Risk-Based Access Control Implementation",
          language: "javascript",
          content: `// Risk-based access control with adaptive authentication

import express from 'express'
import geoip from 'geoip-lite'
import DeviceDetector from 'device-detector-js'

const app = express()
app.use(express.json())

// Risk scoring engine
class RiskEngine {
  // Calculate risk score based on multiple signals
  calculateRisk(context) {
    let score = 0
    const factors = []

    // 1. Time-based risk
    const hour = new Date().getHours()
    if (hour < 6 || hour > 22) {
      score += 15
      factors.push({ factor: 'Unusual hour', score: 15 })
    }

    // 2. Location-based risk
    const geo = geoip.lookup(context.ip)
    if (!geo) {
      score += 20
      factors.push({ factor: 'Unknown geolocation', score: 20 })
    } else {
      // Check if country is on high-risk list
      const highRiskCountries = ['KP', 'IR', 'SY'] // Example
      if (highRiskCountries.includes(geo.country)) {
        score += 30
        factors.push({ factor: 'High-risk country', score: 30 })
      }

      // Check for travel anomaly (user's last location vs. current)
      if (context.user?.lastLocation) {
        const distance = this.calculateDistance(context.user.lastLocation, geo.ll)
        const timeSinceLastLogin = Date.now() - context.user.lastLoginTime
        const hoursElapsed = timeSinceLastLogin / (1000 * 60 * 60)

        // Impossible travel detection (e.g., 5000km in 2 hours)
        if (distance > hoursElapsed * 900) {
          // 900 km/h is faster than commercial flight
          score += 40
          factors.push({
            factor: \`Impossible travel: \${distance.toFixed(0)}km in \${hoursElapsed.toFixed(1)}h\`,
            score: 40,
          })
        }
      }
    }

    // 3. IP reputation risk
    if (this.isAnonymousProxy(context.ip)) {
      score += 25
      factors.push({ factor: 'Anonymous proxy/VPN detected', score: 25 })
    }

    if (this.isKnownMaliciousIP(context.ip)) {
      score += 50
      factors.push({ factor: 'Known malicious IP', score: 50 })
    }

    // 4. Device-based risk
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(context.userAgent)

    if (!context.user?.knownDevices?.includes(context.deviceId)) {
      score += 20
      factors.push({ factor: 'New/unknown device', score: 20 })
    }

    if (device.os?.name === 'Unknown' || device.client?.name === 'Unknown') {
      score += 10
      factors.push({ factor: 'Suspicious user agent', score: 10 })
    }

    // 5. Account-based risk
    if (context.user?.recentFailedLogins > 3) {
      score += 15
      factors.push({ factor: 'Recent failed login attempts', score: 15 })
    }

    if (context.user?.accountAge < 7) {
      // Account created less than 7 days ago
      score += 10
      factors.push({ factor: 'New account', score: 10 })
    }

    // 6. Resource sensitivity
    const resourceRisk = this.getResourceRisk(context.resource)
    score += resourceRisk
    if (resourceRisk > 0) {
      factors.push({ factor: \`Resource sensitivity: \${context.resource}\`, score: resourceRisk })
    }

    // Cap at 100
    score = Math.min(score, 100)

    return { score, factors, level: this.getRiskLevel(score) }
  }

  getRiskLevel(score) {
    if (score < 30) return 'LOW'
    if (score < 60) return 'MEDIUM'
    if (score < 80) return 'HIGH'
    return 'CRITICAL'
  }

  getResourceRisk(resource) {
    const riskMap = {
      '/api/public': 0,
      '/api/user/profile': 5,
      '/api/documents': 15,
      '/api/financial': 25,
      '/api/admin': 30,
    }
    return riskMap[resource] || 10
  }

  calculateDistance([lat1, lon1], [lat2, lon2]) {
    const R = 6371 // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  isAnonymousProxy(ip) {
    // In production, use IPQualityScore, MaxMind, or similar service
    // This is a simplified check
    return ip.startsWith('10.') || ip === '127.0.0.1' // Example: local IPs
  }

  isKnownMaliciousIP(ip) {
    // In production, check against threat intelligence feeds
    const maliciousIPs = ['192.0.2.1', '198.51.100.1'] // Example
    return maliciousIPs.includes(ip)
  }
}

// Middleware for risk-based access control
const riskEngine = new RiskEngine()

function riskBasedAccessControl(req, res, next) {
  const context = {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    deviceId: req.headers['x-device-id'],
    resource: req.path,
    user: req.user, // From authentication middleware
  }

  const riskAssessment = riskEngine.calculateRisk(context)

  console.log('🎯 Risk Assessment:', riskAssessment)

  // Store in request for logging/audit
  req.riskAssessment = riskAssessment

  // Decision logic based on risk level
  switch (riskAssessment.level) {
    case 'LOW':
      // Allow access
      return next()

    case 'MEDIUM':
      // Require MFA if not already provided
      if (!req.user?.mfaVerified) {
        return res.status(403).json({
          error: 'step_up_required',
          message: 'Multi-factor authentication required',
          mfa_challenge_url: '/auth/mfa/challenge',
        })
      }
      return next()

    case 'HIGH':
      // Require MFA + additional verification
      if (!req.user?.mfaVerified || !req.user?.deviceTrusted) {
        return res.status(403).json({
          error: 'enhanced_verification_required',
          message: 'Additional verification required due to high risk',
          required_actions: ['mfa', 'device_verification'],
        })
      }
      // Log for security team review
      console.warn('⚠️  HIGH RISK ACCESS GRANTED:', context.user?.email, context.resource)
      return next()

    case 'CRITICAL':
      // Block access, require admin approval
      console.error('🚨 CRITICAL RISK - ACCESS BLOCKED:', context.user?.email, context.resource)
      // Notify security team
      // notifySecurityTeam(riskAssessment)
      return res.status(403).json({
        error: 'access_denied',
        message: 'Access blocked due to critical security risk. Contact your administrator.',
        risk_factors: riskAssessment.factors,
      })
  }
}

// Example protected routes
app.get('/api/user/profile', riskBasedAccessControl, (req, res) => {
  res.json({ message: 'User profile data' })
})

app.get('/api/financial', riskBasedAccessControl, (req, res) => {
  res.json({ message: 'Financial data' })
})

app.listen(3000, () => console.log('🚀 Risk-based API running on port 3000'))`,
          caption:
            "Complete risk-based access control system with impossible travel detection, IP reputation, and adaptive authentication",
        },
      ],
      quiz: [
        {
          id: "q1",
          question: "What is the primary advantage of Continuous Access Evaluation (CAE) over traditional token-based authentication?",
          options: [
            "CAE tokens last longer, reducing the need for re-authentication",
            "CAE allows real-time token revocation based on security events, even before token expiration",
            "CAE eliminates the need for access tokens entirely",
            "CAE is faster than traditional authentication",
          ],
          correctAnswer: 1,
          explanation:
            "The key benefit of CAE is real-time revocation. Traditional tokens are valid until expiration, giving attackers a window of opportunity. CAE monitors critical security events (account disabled, password changed, etc.) and immediately revokes tokens, even long-lived ones, providing both security and good user experience.",
        },
        {
          id: "q2",
          question: "In Microsoft Entra's CAE implementation, what does the 'xms_cc' claim in the access token indicate?",
          options: [
            "The token has been cross-certified by multiple authorities",
            "The token supports Continuous Access Evaluation (CAE)",
            "The token requires cross-origin authentication",
            "The token is a client credentials token",
          ],
          correctAnswer: 1,
          explanation:
            "The 'xms_cc' claim (specifically 'CP1' value) indicates that the token supports Continuous Access Evaluation. This tells resource servers they can rely on CAE event notifications for this token rather than implementing short token lifetimes.",
        },
        {
          id: "q3",
          question: "What is 'impossible travel' detection in adaptive authentication?",
          options: [
            "Blocking access when users travel to restricted countries",
            "Detecting when a user appears to travel between locations faster than physically possible",
            "Preventing users from accessing the system while traveling",
            "Blocking all international travel-related logins",
          ],
          correctAnswer: 1,
          explanation:
            "Impossible travel detection identifies when a user's login location changes faster than physically possible. For example, logging in from New York and then Tokyo 2 hours later is physically impossible (even by the fastest flight), indicating account compromise or credential sharing.",
        },
        {
          id: "q4",
          question: "In risk-based access control, what is 'step-up authentication'?",
          options: [
            "Requiring users to change their password periodically",
            "Requiring additional authentication factors when accessing sensitive resources, even if already logged in",
            "Using biometric authentication instead of passwords",
            "Implementing multi-factor authentication at initial login",
          ],
          correctAnswer: 1,
          explanation:
            "Step-up authentication requires additional authentication factors mid-session when accessing particularly sensitive resources. For example, you might log in with just a password to view documents, but need to provide MFA when downloading financial reports. This balances security with user convenience.",
        },
        {
          id: "q5",
          question: "Which of these is NOT a typical signal used in risk-based authentication?",
          options: [
            "User's geolocation and IP address reputation",
            "Time of day and login frequency patterns",
            "The user's profile picture and display name",
            "Device compliance status and fingerprint",
          ],
          correctAnswer: 2,
          explanation:
            "Risk-based authentication analyzes behavioral and environmental signals like location, time, device, network, and access patterns. The user's profile picture and display name are not behavioral signals and don't indicate risk. Signals must be measurable, contextual indicators of potential compromise or malicious activity.",
        },
      ],
    },
    {
      id: "zero-trust-architecture",
      slug: "zero-trust-architecture",
      title: "Zero Trust Architecture & Future of IAM",
      description:
        "Explore Zero Trust principles, implementation strategies, and the future direction of Identity and Access Management",
      estimatedMinutes: 30,
      content: [
        {
          type: "text",
          title: "Introduction to Zero Trust",
          content: `The traditional security model was based on a simple assumption: **"Everything inside the corporate network is trusted, everything outside is untrusted."**

This perimeter-based security (castle-and-moat model) worked when:
- Employees worked in offices
- Applications ran in on-premise data centers
- Data stayed within the corporate network

But modern reality is different:
- Remote work is standard
- Cloud SaaS applications are everywhere
- Mobile devices access corporate data
- Third-party contractors need access
- Attackers are already inside the network (assume breach)

**Zero Trust** replaces "trust but verify" with **"never trust, always verify."**

## Core Principles of Zero Trust

### 1. **Verify Explicitly**
Always authenticate and authorize based on all available data points:
- User identity
- Location
- Device health
- Service or workload
- Data classification
- Anomalies

### 2. **Use Least Privilege Access**
Limit user access with Just-In-Time (JIT) and Just-Enough-Access (JEA):
- Grant minimum privileges required
- Time-bound access
- Risk-based adaptive policies

### 3. **Assume Breach**
Minimize blast radius and segment access:
- Verify end-to-end encryption
- Use analytics to detect threats
- Improve detection, threat protection, and response

## Zero Trust vs. Traditional Security

| Aspect | Traditional Perimeter | Zero Trust |
|--------|---------------------|------------|
| **Philosophy** | Trust inside network | Never trust, always verify |
| **Access** | Broad network access | Micro-segmentation, least privilege |
| **Identity** | Secondary consideration | Primary security perimeter |
| **Device** | Managed devices trusted | Continuous device verification |
| **Authentication** | One-time at login | Continuous authentication |
| **Data Protection** | Perimeter firewall | End-to-end encryption, DLP |
| **Monitoring** | Perimeter-focused | All traffic, all users, all devices |`,
        },
        {
          type: "diagram",
          title: "Traditional vs. Zero Trust Architecture",
          content: `graph TD
    subgraph Traditional["Traditional Perimeter Security"]
        T1[Corporate Network<br/>TRUSTED ZONE]
        T2[Firewall]
        T3[Internet<br/>UNTRUSTED ZONE]
        T4[Employees inside = trusted]
        T5[VPN = trusted tunnel]

        T3 -->|Block| T2
        T2 -->|Allow| T1
        T1 -.-> T4
        T3 -.->|VPN| T5
        T5 -.-> T1
    end

    subgraph ZeroTrust["Zero Trust Architecture"]
        Z1[User]
        Z2[Policy Decision Point<br/>PDP]
        Z3[Policy Enforcement Point<br/>PEP]
        Z4[Resource]
        Z5[Identity Provider]
        Z6[Device Health Check]
        Z7[Context: Location, Time, Risk]

        Z1 -->|1. Request Access| Z3
        Z3 -->|2. Check Policy| Z2
        Z2 -.->|Verify| Z5
        Z2 -.->|Verify| Z6
        Z2 -.->|Analyze| Z7
        Z2 -->|3. Decision| Z3
        Z3 -->|4. Allow/Deny| Z4
    end`,
          caption:
            "Traditional perimeter security vs. Zero Trust - every access request is verified regardless of location",
        },
        {
          type: "text",
          title: "Zero Trust Architecture Components",
          content: `## 1. Policy Decision Point (PDP)

The **brain** of Zero Trust that makes access decisions based on:

- **Identity signals**: User, service account, managed identity
- **Device signals**: Compliance, health, trust level
- **Context signals**: Location, time, network, risk score
- **Resource signals**: Sensitivity, classification, access patterns
- **Threat intelligence**: Known malicious IPs, attack patterns

**Example Decision Logic:**
\`\`\`
IF user.mfaVerified = true
AND device.compliant = true
AND location.country IN allowed_countries
AND risk_score < 30
AND resource.sensitivity = "medium"
THEN ALLOW access
ELSE DENY access
\`\`\`

## 2. Policy Enforcement Point (PEP)

The **gatekeeper** that enforces decisions from the PDP:

- **Network-based PEP**: Firewall, VPN gateway, SD-WAN
- **Application-based PEP**: API gateway, reverse proxy, service mesh
- **Endpoint-based PEP**: Agent on device, DLP client
- **Cloud-based PEP**: Cloud access security broker (CASB)

## 3. Identity Provider (IdP)

Central source of truth for identities:

- Authenticates users (MFA, passwordless, biometric)
- Stores identity attributes
- Enforces authentication policies
- Issues tokens (OAuth, SAML, OIDC)

**Examples:** Azure AD, Okta, Auth0, Google Identity

## 4. Device Trust

Continuous verification of device posture:

- Operating system version
- Patch level
- Antivirus status
- Encryption enabled
- Firewall active
- No jailbreak/root
- MDM enrollment

**Technologies:** Microsoft Intune, Jamf, VMware Workspace ONE

## 5. Network Micro-Segmentation

Instead of flat networks, create granular zones:

\`\`\`
Traditional: All apps in one network (lateral movement easy)

Zero Trust: Each app isolated
┌─────────┐   ┌─────────┐   ┌─────────┐
│  App 1  │   │  App 2  │   │  App 3  │
│ VLAN 10 │   │ VLAN 20 │   │ VLAN 30 │
└─────────┘   └─────────┘   └─────────┘
     ↓             ↓             ↓
  Firewall     Firewall     Firewall
     ↓             ↓             ↓
  Database     Database     Database
\`\`\`

**Technologies:** Software-defined networking (SDN), service mesh (Istio, Linkerd)

## 6. Data Protection

Protect data everywhere:

- **At rest**: Encryption, key management (Azure Key Vault, AWS KMS)
- **In transit**: TLS 1.3, mTLS (mutual TLS)
- **In use**: Confidential computing, secure enclaves

**Data Loss Prevention (DLP):**
- Classify data (public, internal, confidential, restricted)
- Prevent unauthorized sharing
- Monitor data exfiltration

## 7. Analytics and Monitoring

Continuous monitoring and threat detection:

- User and Entity Behavior Analytics (UEBA)
- Security Information and Event Management (SIEM)
- Extended Detection and Response (XDR)
- Machine learning for anomaly detection

**Example Alerts:**
- User accessing 10x more files than usual
- Download of sensitive data at 2 AM
- Login from new country without travel notification
- Privilege escalation detected`,
        },
        {
          type: "text",
          title: "Implementing Zero Trust: Maturity Model",
          content: `Most organizations can't implement Zero Trust overnight. Here's a **maturity model** for gradual adoption:

## Level 0: Traditional Security (Baseline)
- Perimeter firewall
- VPN for remote access
- Antivirus on endpoints
- Basic authentication (username + password)

**Risk:** Assumed trust inside network, lateral movement easy

## Level 1: Enhanced Identity Security
**Focus:** Identity as the primary perimeter

**Implementations:**
- ✅ Multi-Factor Authentication (MFA) for all users
- ✅ Single Sign-On (SSO) across applications
- ✅ Role-Based Access Control (RBAC)
- ✅ Centralized Identity Provider
- ✅ Password policies (complexity, rotation)

**Technologies:** Okta, Azure AD, Auth0

## Level 2: Device Trust & Conditional Access
**Focus:** Verify devices before granting access

**Implementations:**
- ✅ Mobile Device Management (MDM)
- ✅ Endpoint Detection and Response (EDR)
- ✅ Conditional access policies (device compliance required)
- ✅ Device health attestation
- ✅ Certificate-based authentication

**Technologies:** Microsoft Intune, CrowdStrike, Carbon Black

## Level 3: Micro-Segmentation & Least Privilege
**Focus:** Limit lateral movement

**Implementations:**
- ✅ Network micro-segmentation
- ✅ Just-In-Time (JIT) access
- ✅ Just-Enough-Access (JEA) / Privilege escalation workflows
- ✅ Service-to-service authentication (mTLS, service mesh)
- ✅ Fine-grained authorization (Zanzibar-style)

**Technologies:** HashiCorp Vault, Istio, AWS IAM, SpiceDB

## Level 4: Continuous Verification & Adaptive Policies
**Focus:** Real-time risk assessment

**Implementations:**
- ✅ Continuous Access Evaluation (CAE)
- ✅ Risk-based adaptive authentication
- ✅ User and Entity Behavior Analytics (UEBA)
- ✅ Anomaly detection with ML
- ✅ Automated threat response

**Technologies:** Microsoft Defender, Splunk, Palo Alto Cortex XDR

## Level 5: Full Zero Trust (Advanced)
**Focus:** Assume breach, complete visibility

**Implementations:**
- ✅ End-to-end encryption for all data
- ✅ Decentralized identity (DID/VC where applicable)
- ✅ Confidential computing for sensitive workloads
- ✅ Full network traffic inspection (east-west + north-south)
- ✅ Automated incident response and remediation
- ✅ Comprehensive audit logs and forensics

**Technologies:** Confidential VMs (Azure, AWS Nitro Enclaves), Network detection tools

## Measuring Progress

| Maturity Level | Identity Verified | Device Verified | Network Segmented | Data Encrypted | Continuous Monitoring |
|----------------|-------------------|-----------------|-------------------|----------------|----------------------|
| **Level 0** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Level 1** | ✅ | ❌ | ❌ | Partial | Basic |
| **Level 2** | ✅ | ✅ | Partial | Partial | Moderate |
| **Level 3** | ✅ | ✅ | ✅ | ✅ | Moderate |
| **Level 4** | ✅ | ✅ | ✅ | ✅ | Advanced |
| **Level 5** | ✅ | ✅ | ✅ | ✅ | Complete |`,
        },
        {
          type: "code",
          title: "Zero Trust Policy Engine Example (TypeScript)",
          language: "typescript",
          content: `// Zero Trust Policy Decision Point (PDP) Implementation

interface User {
  id: string
  email: string
  roles: string[]
  mfaVerified: boolean
  riskScore: number
  lastLoginLocation?: string
}

interface Device {
  id: string
  compliant: boolean
  managed: boolean
  os: string
  osVersion: string
  encryptionEnabled: boolean
  antivirusActive: boolean
}

interface Context {
  ipAddress: string
  country: string
  isp: string
  timeOfDay: number // 0-23
  isAnonymousProxy: boolean
  isKnownMaliciousIP: boolean
}

interface Resource {
  id: string
  type: string
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  requiredRoles: string[]
}

interface AccessRequest {
  user: User
  device: Device
  context: Context
  resource: Resource
  action: 'read' | 'write' | 'delete' | 'admin'
}

interface PolicyDecision {
  allowed: boolean
  reason: string
  requiresStepUp?: boolean
  stepUpMethods?: string[]
  conditions?: string[]
}

class ZeroTrustPolicyEngine {
  // Main decision function
  evaluateAccess(request: AccessRequest): PolicyDecision {
    // Rule 1: Always deny critical risk
    if (request.user.riskScore > 80) {
      return {
        allowed: false,
        reason: 'User risk score too high (critical risk)',
      }
    }

    // Rule 2: Always deny non-compliant devices for confidential+ data
    if (
      !request.device.compliant &&
      ['confidential', 'restricted'].includes(request.resource.sensitivity)
    ) {
      return {
        allowed: false,
        reason: 'Device not compliant - required for confidential data access',
      }
    }

    // Rule 3: Always deny anonymous proxies for restricted data
    if (request.context.isAnonymousProxy && request.resource.sensitivity === 'restricted') {
      return {
        allowed: false,
        reason: 'Anonymous proxy detected - not allowed for restricted resources',
      }
    }

    // Rule 4: Always deny known malicious IPs
    if (request.context.isKnownMaliciousIP) {
      return {
        allowed: false,
        reason: 'Access from known malicious IP address',
      }
    }

    // Rule 5: Check RBAC - user must have required role
    const hasRequiredRole = request.resource.requiredRoles.some((role) =>
      request.user.roles.includes(role)
    )
    if (!hasRequiredRole) {
      return {
        allowed: false,
        reason: \`Missing required role: \${request.resource.requiredRoles.join(' or ')}\`,
      }
    }

    // Rule 6: MFA required for confidential/restricted resources
    if (
      !request.user.mfaVerified &&
      ['confidential', 'restricted'].includes(request.resource.sensitivity)
    ) {
      return {
        allowed: false,
        reason: 'Multi-factor authentication required',
        requiresStepUp: true,
        stepUpMethods: ['totp', 'push_notification', 'webauthn'],
      }
    }

    // Rule 7: Managed device required for restricted resources
    if (!request.device.managed && request.resource.sensitivity === 'restricted') {
      return {
        allowed: false,
        reason: 'Managed device required for restricted resources',
      }
    }

    // Rule 8: Encryption required for confidential+ resources
    if (
      !request.device.encryptionEnabled &&
      ['confidential', 'restricted'].includes(request.resource.sensitivity)
    ) {
      return {
        allowed: false,
        reason: 'Device encryption required',
      }
    }

    // Rule 9: Antivirus required for write/delete operations
    if (['write', 'delete', 'admin'].includes(request.action) && !request.device.antivirusActive) {
      return {
        allowed: false,
        reason: 'Active antivirus required for write/delete operations',
      }
    }

    // Rule 10: High-risk score requires additional verification
    if (request.user.riskScore > 60 && request.resource.sensitivity === 'restricted') {
      return {
        allowed: false,
        reason: 'High risk score - additional verification required',
        requiresStepUp: true,
        stepUpMethods: ['push_notification', 'webauthn'],
      }
    }

    // Rule 11: Delete operations on restricted data require elevated privileges
    if (request.action === 'delete' && request.resource.sensitivity === 'restricted') {
      const hasDeletePrivilege = request.user.roles.includes('data_admin')
      if (!hasDeletePrivilege) {
        return {
          allowed: false,
          reason: 'Delete operations on restricted data require data_admin role',
        }
      }
    }

    // Rule 12: Time-based restrictions for restricted resources
    if (request.resource.sensitivity === 'restricted') {
      const isBusinessHours = request.context.timeOfDay >= 8 && request.context.timeOfDay < 18
      if (!isBusinessHours && !request.user.roles.includes('on_call')) {
        return {
          allowed: false,
          reason: 'Restricted resources only accessible during business hours (8am-6pm)',
        }
      }
    }

    // All checks passed - allow with conditions
    const conditions: string[] = []

    if (request.user.riskScore > 30) {
      conditions.push('Enhanced logging enabled due to elevated risk score')
    }

    if (request.context.country !== 'US' && request.resource.sensitivity === 'restricted') {
      conditions.push('International access logged and flagged for review')
    }

    return {
      allowed: true,
      reason: 'All Zero Trust policies satisfied',
      conditions: conditions.length > 0 ? conditions : undefined,
    }
  }

  // Helper: Calculate risk score based on context
  calculateRiskScore(user: User, device: Device, context: Context): number {
    let score = 0

    // User factors
    if (!user.mfaVerified) score += 20

    // Device factors
    if (!device.compliant) score += 15
    if (!device.managed) score += 10
    if (!device.encryptionEnabled) score += 10
    if (!device.antivirusActive) score += 10

    // Context factors
    if (context.isAnonymousProxy) score += 25
    if (context.isKnownMaliciousIP) score += 50
    if (context.timeOfDay < 6 || context.timeOfDay > 22) score += 5

    // Location change risk
    if (user.lastLoginLocation && user.lastLoginLocation !== context.country) {
      score += 15
    }

    return Math.min(score, 100)
  }
}

// Example usage
const policyEngine = new ZeroTrustPolicyEngine()

const accessRequest: AccessRequest = {
  user: {
    id: 'user-123',
    email: 'alice@example.com',
    roles: ['engineer', 'data_viewer'],
    mfaVerified: true,
    riskScore: 25,
  },
  device: {
    id: 'device-456',
    compliant: true,
    managed: true,
    os: 'macOS',
    osVersion: '14.2',
    encryptionEnabled: true,
    antivirusActive: true,
  },
  context: {
    ipAddress: '203.0.113.42',
    country: 'US',
    isp: 'Corporate Network',
    timeOfDay: 14,
    isAnonymousProxy: false,
    isKnownMaliciousIP: false,
  },
  resource: {
    id: 'resource-789',
    type: 'database',
    sensitivity: 'confidential',
    requiredRoles: ['data_viewer', 'data_admin'],
  },
  action: 'read',
}

const decision = policyEngine.evaluateAccess(accessRequest)
console.log('Access Decision:', decision)

// Example output:
// Access Decision: {
//   allowed: true,
//   reason: 'All Zero Trust policies satisfied',
//   conditions: undefined
// }`,
          caption:
            "Production-ready Zero Trust policy engine with 12 security rules covering identity, device, context, and resource sensitivity",
        },
        {
          type: "text",
          title: "The Future of IAM",
          content: `## Emerging Trends (5-10 Year Horizon)

### 1. **Passwordless Everywhere**
- Passkeys (FIDO2/WebAuthn) become default
- Biometric authentication standard
- Passwords relegated to legacy systems only
- **Timeline:** 2025-2027 mainstream adoption

### 2. **Decentralized Identity Mainstream**
- Government-issued digital IDs (EU Digital Identity Wallet)
- Verifiable credentials for employment, education
- User-controlled identity portals
- **Timeline:** 2026-2028 for consumer adoption

### 3. **AI-Powered Security**
- Real-time threat detection with ML
- Automated incident response
- Predictive risk scoring
- Deepfake detection in authentication
- **Timeline:** Already emerging, mainstream by 2025-2026

### 4. **Quantum-Resistant Cryptography**
- Post-quantum algorithms (NIST standards)
- Migration from RSA/ECC to quantum-safe alternatives
- Hybrid classical/quantum crypto during transition
- **Timeline:** 2025-2030 migration period

### 5. **Unified Identity Fabric**
- Single identity across cloud, on-premise, edge
- Seamless federation across all providers
- Identity mesh architecture
- **Timeline:** 2026-2029

### 6. **Privacy-Preserving Authentication**
- Zero-knowledge proofs for authentication
- Homomorphic encryption for access decisions
- No personal data stored/transmitted
- **Timeline:** 2027-2030

### 7. **Context-Aware Access (Extreme)**
- Brain-computer interfaces for authentication
- Continuous biometric monitoring (heart rate, gait)
- Environmental context (ambient sound, temperature)
- **Timeline:** 2030+

## Predictions for 2030

| Aspect | 2024 (Current) | 2030 (Predicted) |
|--------|---------------|------------------|
| **Primary Auth** | Password + MFA | Passkey (FIDO2) |
| **Secondary Auth** | TOTP, SMS | Biometric, behavioral |
| **Enterprise SSO** | SAML, OIDC | Verifiable Credentials |
| **Authorization** | RBAC, ABAC | ReBAC (Zanzibar-style) |
| **Token Format** | JWT | Verifiable Presentations |
| **Identity Storage** | Centralized IdP | Decentralized (DID) |
| **Access Model** | Perimeter-based | Zero Trust universal |
| **Risk Assessment** | Manual rules | AI-driven, predictive |
| **Cryptography** | RSA-2048, ECC-256 | Post-quantum algorithms |

## Skills to Learn Now for the Future

1. **Cryptography Fundamentals**
   - Understand public-key crypto (RSA, ECC)
   - Learn quantum-resistant algorithms (Kyber, Dilithium)
   - Zero-knowledge proofs

2. **Decentralized Technologies**
   - Blockchain basics (Ethereum, Hyperledger)
   - DID methods and resolution
   - Verifiable Credentials (W3C standards)

3. **AI/ML for Security**
   - Anomaly detection algorithms
   - Behavioral analytics
   - Threat intelligence platforms

4. **Zero Trust Architecture**
   - Policy-as-code (OPA, Cedar)
   - Service mesh (Istio, Linkerd)
   - Micro-segmentation

5. **Modern IAM Protocols**
   - OAuth 2.1 and extensions
   - OpenID Connect advanced features
   - FIDO2/WebAuthn implementation

## Final Thoughts

The future of IAM is:
- **User-centric**: You control your identity
- **Privacy-preserving**: Minimal data exposure
- **Continuous**: Always verifying, never trusting
- **Intelligent**: AI-powered risk assessment
- **Seamless**: Invisible to users when low-risk

The days of "username + password" are numbered. The question is not **if** we'll move to decentralized, passwordless, Zero Trust identity - but **when** and **how fast**.

**Your role as an IAM professional:** Stay ahead of these trends, experiment with emerging technologies, and help your organization prepare for the future of identity.`,
        },
      ],
      quiz: [
        {
          id: "q1",
          question: "What is the fundamental principle that distinguishes Zero Trust from traditional perimeter security?",
          options: [
            "Zero Trust requires more expensive infrastructure",
            "Zero Trust assumes all network traffic is untrusted, regardless of location",
            "Zero Trust only works in cloud environments",
            "Zero Trust eliminates the need for firewalls entirely",
          ],
          correctAnswer: 1,
          explanation:
            "Zero Trust's core principle is 'never trust, always verify' - all network traffic, users, and devices are untrusted by default, regardless of whether they're inside or outside the corporate network. This contrasts with perimeter security, which assumes everything inside the network is trusted.",
        },
        {
          id: "q2",
          question: "In Zero Trust Architecture, what is the role of the Policy Decision Point (PDP)?",
          options: [
            "It stores user passwords and credentials",
            "It enforces access decisions at the network gateway",
            "It evaluates access requests based on identity, device, context, and risk to make allow/deny decisions",
            "It manages device enrollment and compliance",
          ],
          correctAnswer: 2,
          explanation:
            "The Policy Decision Point (PDP) is the 'brain' of Zero Trust that evaluates all available signals (identity, device health, location, risk score, resource sensitivity, etc.) and makes access decisions. The Policy Enforcement Point (PEP) then enforces those decisions.",
        },
        {
          id: "q3",
          question: "What is 'micro-segmentation' in Zero Trust?",
          options: [
            "Dividing users into small teams for access control",
            "Creating granular network zones to isolate workloads and limit lateral movement",
            "Splitting large databases into smaller partitions",
            "Segmenting access tokens into smaller claims",
          ],
          correctAnswer: 1,
          explanation:
            "Micro-segmentation divides the network into small, isolated zones (down to individual workloads or applications). This limits lateral movement - if an attacker compromises one application, they can't easily move to others. This contrasts with traditional flat networks where compromising one system gives broad network access.",
        },
        {
          id: "q4",
          question: "According to the Zero Trust maturity model presented, at which level does an organization implement Just-In-Time (JIT) access and privilege escalation workflows?",
          options: [
            "Level 1: Enhanced Identity Security",
            "Level 2: Device Trust & Conditional Access",
            "Level 3: Micro-Segmentation & Least Privilege",
            "Level 5: Full Zero Trust",
          ],
          correctAnswer: 2,
          explanation:
            "Level 3 focuses on micro-segmentation and least privilege, which includes implementing Just-In-Time (JIT) access and Just-Enough-Access (JEA). This level goes beyond basic identity and device verification to implement fine-grained, time-limited access controls.",
        },
        {
          id: "q5",
          question: "What is the predicted timeline for mainstream adoption of passwordless authentication (passkeys/FIDO2) as the default authentication method?",
          options: [
            "2024-2025",
            "2025-2027",
            "2028-2030",
            "After 2030",
          ],
          correctAnswer: 1,
          explanation:
            "According to the content, passwordless authentication (passkeys/FIDO2) is predicted to reach mainstream adoption by 2025-2027. Major platforms (Apple, Google, Microsoft) have already implemented passkey support, and adoption is accelerating rapidly.",
        },
      ],
    },
  ],
}
