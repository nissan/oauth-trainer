/**
 * Module 4: SAML 2.0 (Security Assertion Markup Language)
 *
 * This module covers enterprise Single Sign-On (SSO) using SAML 2.0,
 * including assertions, bindings, profiles, metadata, and security considerations.
 */

import type { Module } from "@/types"

export const samlModule: Module = {
  id: "saml",
  slug: "saml",
  title: "SAML 2.0",
  description: "Master enterprise Single Sign-On with SAML 2.0, XML-based federation, assertions, and security best practices.",
  icon: "🔐",
  difficulty: "intermediate",
  estimatedHours: 4,
  prerequisiteModules: ["oauth2-core", "oidc"],
  learningObjectives: [
    "Understand SAML 2.0 architecture and core components",
    "Learn how SAML assertions convey identity information",
    "Master SAML bindings and protocols",
    "Implement SAML-based enterprise SSO",
    "Understand SAML security considerations and vulnerabilities",
    "Compare SAML with OAuth 2.0 and OpenID Connect"
  ],
  badge: {
    id: "saml-expert",
    name: "SAML Expert",
    description: "Mastered enterprise SSO with SAML 2.0",
    icon: "🔐"
  },
  lessons: [
    {
      id: "saml-fundamentals",
      slug: "saml-fundamentals",
      title: "SAML 2.0 Fundamentals",
      description: "Understanding SAML architecture, components, and use cases in enterprise environments.",
      estimatedMinutes: 30,
      content: [
        {
          type: "text",
          title: "What is SAML?",
          content: `
**SAML (Security Assertion Markup Language)** is an XML-based open standard for exchanging authentication and authorization data between parties, specifically between an **Identity Provider (IdP)** and a **Service Provider (SP)**.

## Key Characteristics

**XML-Based Protocol**
- Uses XML for encoding assertions and messages
- Leverages XML Signature and XML Encryption for security
- Human-readable but verbose compared to JSON (OAuth/OIDC)

**Enterprise-Focused**
- Designed for enterprise Single Sign-On (SSO)
- Widely used in B2B and enterprise applications
- Strong in federated identity scenarios

**Mature Standard**
- SAML 2.0 released in 2005 by OASIS
- Battle-tested in enterprise environments
- Extensive tooling and library support

## SAML vs. OAuth/OIDC

| Feature | SAML 2.0 | OAuth 2.0 | OpenID Connect |
|---------|----------|-----------|----------------|
| **Primary Purpose** | Authentication + Authorization | Delegated Authorization | Authentication |
| **Data Format** | XML | JSON | JSON (JWT) |
| **Token Type** | SAML Assertions | Access Tokens | ID Tokens + Access Tokens |
| **Typical Use Case** | Enterprise SSO, B2B | API access, mobile apps | Consumer login, modern SSO |
| **Browser-Based** | Yes (HTTP POST/Redirect) | Yes + Native apps | Yes + Native apps |
| **Mobile Support** | Limited | Excellent | Excellent |
| **Complexity** | High (XML, crypto) | Medium | Medium |
| **Year Introduced** | 2005 | 2012 | 2014 |

## When to Use SAML

✅ **Use SAML when:**
- Implementing enterprise SSO (Salesforce, Workday, ServiceNow)
- B2B federation with other organizations
- Existing SAML infrastructure in place
- Compliance requirements mandate SAML
- Legacy enterprise applications require it

❌ **Avoid SAML when:**
- Building mobile or native applications
- Modern web APIs (prefer OAuth 2.0)
- Consumer-facing applications (prefer OIDC)
- Microservices architectures
- You want simplicity and JSON-based protocols
          `
        },
        {
          type: "text",
          title: "SAML Architecture and Components",
          content: `
## Core SAML Components

### 1. Identity Provider (IdP)

The **Identity Provider** is the system that:
- Authenticates users (checks credentials)
- Issues SAML assertions about authenticated users
- Manages user identities and attributes
- Signs assertions to prove authenticity

**Examples:**
- **Okta** - Cloud IdP platform
- **Microsoft Entra ID (Azure AD)** - Enterprise identity
- **Ping Identity** - Enterprise federation
- **Auth0** - Cloud identity platform
- **Google Workspace** - Consumer and enterprise
- **OneLogin** - Cloud SSO provider

### 2. Service Provider (SP)

The **Service Provider** is the application that:
- Trusts assertions from the IdP
- Validates SAML assertion signatures
- Grants access based on assertion claims
- Does NOT authenticate users directly

**Examples:**
- **Salesforce** - CRM platform
- **Workday** - HR management system
- **ServiceNow** - IT service management
- **Slack** - Team collaboration
- **Zoom** - Video conferencing
- **GitHub Enterprise** - Code collaboration

### 3. SAML Assertions

**SAML Assertions** are XML documents that contain claims about a user. There are three types:

**Authentication Assertion**
- States that a user was authenticated
- Includes authentication method and timestamp
- Confirms identity

**Attribute Assertion**
- Contains attributes about the user
- Examples: email, name, department, role
- Used for personalization and authorization

**Authorization Decision Assertion**
- States whether user is authorized for specific resource
- Less commonly used in practice
- Application usually handles authorization

### 4. Metadata

**SAML Metadata** describes the configuration of IdPs and SPs:

- **EntityID**: Unique identifier for IdP or SP
- **Endpoints**: URLs for SSO, SLO (Single Logout)
- **Certificates**: Public keys for signature validation
- **Bindings**: Supported protocols (HTTP-POST, HTTP-Redirect)
- **NameID Formats**: How users are identified

Metadata is exchanged during initial setup to establish trust.
          `
        },
        {
          type: "diagram",
          title: "SAML SSO Flow (SP-Initiated)",
          content: `sequenceDiagram
    participant User
    participant SP as Service Provider (Salesforce)
    participant IdP as Identity Provider (Okta)

    User->>SP: Access protected resource
    SP->>SP: User not authenticated
    SP->>User: Redirect to IdP with SAML AuthnRequest
    User->>IdP: Present SAML AuthnRequest
    IdP->>User: Show login page
    User->>IdP: Enter credentials
    IdP->>IdP: Authenticate user
    IdP->>IdP: Generate SAML Assertion (signed)
    IdP->>User: HTTP POST with SAML Response
    User->>SP: Submit SAML Response (via browser)
    SP->>SP: Validate assertion signature
    SP->>SP: Extract user attributes
    SP->>SP: Create session
    SP->>User: Grant access to resource`,
          caption: "Service Provider-initiated SAML SSO flow showing authentication request and assertion exchange"
        },
        {
          type: "text",
          title: "SAML Flow Types",
          content: `
## SP-Initiated Flow

**Most Common Flow**

1. User accesses Service Provider (e.g., Salesforce)
2. SP detects user is not authenticated
3. SP sends **AuthnRequest** to IdP (via browser redirect)
4. IdP authenticates user
5. IdP sends **SAML Response** with assertion back to SP
6. SP validates assertion and grants access

**Use Case:** User directly navigates to application URL

## IdP-Initiated Flow

**Less Common, More Convenient**

1. User logs into IdP portal (e.g., Okta dashboard)
2. User clicks on app icon (e.g., Salesforce)
3. IdP generates SAML assertion
4. IdP posts assertion directly to SP
5. SP validates assertion and grants access

**Use Case:** Users start from a centralized portal

⚠️ **Security Note:** IdP-initiated flow is more vulnerable to CSRF attacks because there's no initial request from SP to bind the session.

## Just-in-Time (JIT) Provisioning

Many SAML implementations support **JIT user provisioning**:

- User doesn't exist in SP's user database
- SP receives SAML assertion with user attributes
- SP automatically creates user account based on assertion
- User is granted access immediately

**Benefits:**
- No manual user provisioning
- Automatic user attribute synchronization
- Reduced administrative overhead
          `
        },
        {
          type: "text",
          title: "SAML Trust Establishment",
          content: `
## How Trust Works in SAML

### Certificate Exchange

Before SAML SSO works, IdP and SP must establish trust:

**1. IdP Configuration**
- IdP administrator uploads IdP metadata to SP
- Metadata includes IdP's public certificate
- SP stores certificate to validate future assertions

**2. SP Configuration**
- SP administrator uploads SP metadata to IdP
- Metadata includes SP's Assertion Consumer Service (ACS) URL
- IdP knows where to send assertions

**3. Entity IDs**
- IdP has unique EntityID (e.g., \`http://www.okta.com/exk1234567890\`)
- SP has unique EntityID (e.g., \`https://salesforce.com\`)
- These are used to identify parties in SAML messages

### Signature Validation

**IdP Signs Assertions:**
\`\`\`xml
<saml:Assertion ID="_abc123" IssueInstant="2024-01-15T10:30:00Z">
  <ds:Signature>
    <ds:SignedInfo>
      <ds:Reference URI="#_abc123">
        <ds:DigestValue>...</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>...</ds:SignatureValue>
  </ds:Signature>
  <!-- Assertion content -->
</saml:Assertion>
\`\`\`

**SP Validates Signature:**
1. Extract signature from assertion
2. Use IdP's public certificate (from metadata)
3. Verify signature matches assertion content
4. If valid, trust the assertion claims

> **Security Tip:** Always validate SAML assertion signatures. An unsigned or invalidly signed assertion should be rejected immediately.

### Metadata Example

**IdP Metadata (simplified):**
\`\`\`xml
<EntityDescriptor entityID="http://www.okta.com/exk123">
  <IDPSSODescriptor>
    <KeyDescriptor use="signing">
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>MIIDpDCCAoygAwIBAgIGAXo...</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </KeyDescriptor>
    <SingleSignOnService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="https://example.okta.com/app/salesforce/sso/saml"/>
  </IDPSSODescriptor>
</EntityDescriptor>
\`\`\`

**SP Metadata (simplified):**
\`\`\`xml
<EntityDescriptor entityID="https://salesforce.com">
  <SPSSODescriptor>
    <AssertionConsumerService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="https://example.salesforce.com/saml/consume"
      index="0"/>
  </SPSSODescriptor>
</EntityDescriptor>
\`\`\`
          `
        },
        {
          type: "interactive",
          title: "🎯 Try It: SAML Concepts Quiz",
          content: `
Test your understanding of SAML fundamentals:

**Question 1:** What is the primary purpose of SAML?
- A) API access delegation
- B) Enterprise Single Sign-On
- C) Mobile authentication
- D) Database encryption

**Question 2:** Which format does SAML use?
- A) JSON
- B) YAML
- C) XML
- D) Protocol Buffers

**Question 3:** In SP-initiated flow, who sends the initial request?
- A) Identity Provider
- B) Service Provider
- C) User's browser
- D) Authorization Server

**Question 4:** What validates a SAML assertion's authenticity?
- A) Password hash
- B) Digital signature
- C) API key
- D) Bearer token

<details>
<summary>View Answers</summary>

1. **B** - Enterprise Single Sign-On is SAML's primary purpose
2. **C** - XML is SAML's data format
3. **B** - Service Provider sends the AuthnRequest
4. **B** - Digital signature using IdP's certificate validates assertions
</details>
          `
        }
      ],
      quiz: {
        id: "saml-fundamentals-quiz",
        title: "SAML Fundamentals Quiz",
        description: "Test your knowledge of SAML 2.0 basics",
        passingScore: 70,
        questions: [
          {
            id: "saml-q1",
            question: "What does SAML stand for?",
            options: [
              "Secure Access Markup Language",
              "Security Assertion Markup Language",
              "Simple Authentication Markup Language",
              "Structured Authentication Message Language"
            ],
            correctAnswer: 1,
            explanation: "SAML stands for Security Assertion Markup Language, an XML-based standard for exchanging authentication and authorization data."
          },
          {
            id: "saml-q2",
            question: "Which component authenticates users in SAML?",
            options: [
              "Service Provider (SP)",
              "Identity Provider (IdP)",
              "Relying Party (RP)",
              "Authorization Server (AS)"
            ],
            correctAnswer: 1,
            explanation: "The Identity Provider (IdP) is responsible for authenticating users and issuing SAML assertions. The Service Provider trusts these assertions."
          },
          {
            id: "saml-q3",
            question: "What is the main advantage of SAML over OAuth 2.0 for enterprise SSO?",
            options: [
              "Better mobile support",
              "Simpler JSON format",
              "Mature enterprise tooling and B2B federation",
              "Native API access delegation"
            ],
            correctAnswer: 2,
            explanation: "SAML excels in enterprise SSO and B2B federation scenarios with mature tooling, while OAuth 2.0 is better for API access and mobile apps."
          }
        ]
      }
    },
    {
      id: "saml-assertions",
      slug: "saml-assertions",
      title: "SAML Assertions Deep Dive",
      description: "Understanding SAML assertion structure, types, attributes, and claim mapping.",
      estimatedMinutes: 35,
      content: [
        {
          type: "text",
          title: "SAML Assertion Structure",
          content: `
A **SAML Assertion** is an XML document that contains claims about an authenticated user. It's the core data structure in SAML.

## Assertion Components

### 1. Assertion Header

\`\`\`xml
<saml:Assertion
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_abc123def456"
  Version="2.0"
  IssueInstant="2024-01-15T10:30:00Z">

  <saml:Issuer>http://www.okta.com/exk123</saml:Issuer>

  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <!-- Digital signature for integrity -->
  </ds:Signature>

  <!-- Subject, Conditions, Statements below -->
</saml:Assertion>
\`\`\`

**Key Fields:**
- **ID**: Unique identifier for this assertion
- **IssueInstant**: Timestamp when assertion was created
- **Issuer**: EntityID of the IdP that issued it
- **Signature**: Digital signature for validation

### 2. Subject

The **Subject** identifies who the assertion is about:

\`\`\`xml
<saml:Subject>
  <saml:NameID
    Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
    alice@example.com
  </saml:NameID>

  <saml:SubjectConfirmation
    Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
    <saml:SubjectConfirmationData
      NotOnOrAfter="2024-01-15T10:35:00Z"
      Recipient="https://salesforce.com/saml/consume"
      InResponseTo="_request123"/>
  </saml:SubjectConfirmation>
</saml:Subject>
\`\`\`

**NameID Formats:**
- **emailAddress**: \`alice@example.com\`
- **persistent**: \`_abc123def456\` (opaque, stable identifier)
- **transient**: \`_xyz789abc123\` (session-specific, changes each time)
- **unspecified**: Custom format

**SubjectConfirmation:**
- **bearer**: Assertion is valid for whoever presents it (most common)
- **NotOnOrAfter**: Assertion expiration time
- **Recipient**: Expected recipient (SP's ACS URL)
- **InResponseTo**: Links to original AuthnRequest

### 3. Conditions

**Conditions** define when and where the assertion is valid:

\`\`\`xml
<saml:Conditions
  NotBefore="2024-01-15T10:30:00Z"
  NotOnOrAfter="2024-01-15T10:35:00Z">

  <saml:AudienceRestriction>
    <saml:Audience>https://salesforce.com</saml:Audience>
  </saml:AudienceRestriction>
</saml:Conditions>
\`\`\`

**Fields:**
- **NotBefore**: Assertion not valid before this time
- **NotOnOrAfter**: Assertion expires after this time (usually 5 minutes)
- **AudienceRestriction**: Assertion only valid for specific SP (prevents replay attacks)

> **Security Tip:** Always validate that the audience matches your SP's EntityID and the current time falls within NotBefore/NotOnOrAfter.
          `
        },
        {
          type: "text",
          title: "Authentication Statement",
          content: `
The **AuthnStatement** describes how and when the user was authenticated:

\`\`\`xml
<saml:AuthnStatement
  AuthnInstant="2024-01-15T10:30:00Z"
  SessionIndex="_session123">

  <saml:AuthnContext>
    <saml:AuthnContextClassRef>
      urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
    </saml:AuthnContextClassRef>
  </saml:AuthnContext>
</saml:AuthnStatement>
\`\`\`

## Authentication Context Classes

These indicate the **strength** of authentication:

| Context Class | Meaning | Example |
|---------------|---------|---------|
| **Password** | Basic password auth | Username + password |
| **PasswordProtectedTransport** | Password over HTTPS | Username + password over TLS |
| **X509** | Certificate-based auth | Client certificate |
| **Kerberos** | Kerberos ticket | Windows Integrated Auth |
| **MobileTwoFactorContract** | Mobile 2FA | SMS or push notification |
| **Smartcard** | Smartcard auth | PIV card |
| **TimeSyncToken** | Hardware token | RSA SecurID |

**Use Case:**
- SP can require minimum authentication strength
- Example: Admin portal requires MFA, regular app accepts password

## Session Management

**SessionIndex** field enables Single Logout (SLO):

- IdP includes unique session identifier
- SP stores SessionIndex with user's session
- During logout, IdP references SessionIndex to end specific session
- Enables coordinated logout across multiple SPs
          `
        },
        {
          type: "text",
          title: "Attribute Statement",
          content: `
The **AttributeStatement** contains user attributes (claims):

\`\`\`xml
<saml:AttributeStatement>
  <saml:Attribute Name="email">
    <saml:AttributeValue>alice@example.com</saml:AttributeValue>
  </saml:Attribute>

  <saml:Attribute Name="firstName">
    <saml:AttributeValue>Alice</saml:AttributeValue>
  </saml:Attribute>

  <saml:Attribute Name="lastName">
    <saml:AttributeValue>Smith</saml:AttributeValue>
  </saml:Attribute>

  <saml:Attribute Name="department">
    <saml:AttributeValue>Engineering</saml:AttributeValue>
  </saml:Attribute>

  <saml:Attribute Name="role">
    <saml:AttributeValue>Admin</saml:AttributeValue>
    <saml:AttributeValue>Developer</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
\`\`\`

## Common SAML Attributes

**User Identity:**
- \`email\` - User's email address
- \`username\` - Username or login ID
- \`employeeID\` - Employee identifier
- \`userPrincipalName\` - UPN (Active Directory)

**Personal Information:**
- \`firstName\` / \`givenName\`
- \`lastName\` / \`surname\`
- \`displayName\`
- \`phone\` / \`mobile\`

**Organization:**
- \`department\`
- \`company\`
- \`title\` - Job title
- \`manager\`
- \`location\` / \`office\`

**Authorization:**
- \`role\` - User roles (can be multi-valued)
- \`groups\` - Group memberships
- \`permissions\` - Specific permissions

## Attribute Mapping

**IdP Side (Okta Example):**

Configure which user directory fields map to SAML attributes:

\`\`\`
IdP User Directory → SAML Attribute
-----------------------------------
user.email → email
user.firstName → firstName
user.lastName → lastName
user.department → department
appuser.role → role
\`\`\`

**SP Side (Salesforce Example):**

Map incoming SAML attributes to application fields:

\`\`\`
SAML Attribute → Salesforce Field
---------------------------------
email → Email
firstName → FirstName
lastName → LastName
department → Department
role → UserRole
\`\`\`

## Just-in-Time (JIT) Provisioning

When user doesn't exist in SP:

1. **SP receives assertion** with attributes
2. **SP extracts attributes** from AttributeStatement
3. **SP creates user account** automatically
4. **SP maps attributes** to local user profile
5. **SP grants access** immediately

**Benefits:**
- No manual user creation
- Attributes stay synchronized
- Reduced IT overhead

**Example JIT Mapping:**
\`\`\`json
{
  "email": "alice@example.com",        // → Salesforce Email
  "firstName": "Alice",                 // → FirstName
  "lastName": "Smith",                  // → LastName
  "department": "Engineering",          // → Department
  "role": ["Admin", "Developer"]        // → UserRole = Admin
}
\`\`\`
          `
        },
        {
          type: "code",
          title: "Complete SAML Assertion Example",
          language: "xml",
          content: `<?xml version="1.0" encoding="UTF-8"?>
<saml:Assertion
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_abc123def456"
  Version="2.0"
  IssueInstant="2024-01-15T10:30:00Z">

  <!-- Issuer: Who created this assertion -->
  <saml:Issuer>http://www.okta.com/exk123</saml:Issuer>

  <!-- Digital Signature (simplified) -->
  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:SignedInfo>
      <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
      <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <ds:Reference URI="#_abc123def456">
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <ds:DigestValue>...</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>...</ds:SignatureValue>
  </ds:Signature>

  <!-- Subject: Who this assertion is about -->
  <saml:Subject>
    <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
      alice@example.com
    </saml:NameID>
    <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
      <saml:SubjectConfirmationData
        NotOnOrAfter="2024-01-15T10:35:00Z"
        Recipient="https://salesforce.com/saml/consume"
        InResponseTo="_request123"/>
    </saml:SubjectConfirmation>
  </saml:Subject>

  <!-- Conditions: When and where assertion is valid -->
  <saml:Conditions
    NotBefore="2024-01-15T10:30:00Z"
    NotOnOrAfter="2024-01-15T10:35:00Z">
    <saml:AudienceRestriction>
      <saml:Audience>https://salesforce.com</saml:Audience>
    </saml:AudienceRestriction>
  </saml:Conditions>

  <!-- AuthnStatement: How user was authenticated -->
  <saml:AuthnStatement
    AuthnInstant="2024-01-15T10:30:00Z"
    SessionIndex="_session123">
    <saml:AuthnContext>
      <saml:AuthnContextClassRef>
        urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
      </saml:AuthnContextClassRef>
    </saml:AuthnContext>
  </saml:AuthnStatement>

  <!-- AttributeStatement: User attributes (claims) -->
  <saml:AttributeStatement>
    <saml:Attribute Name="email">
      <saml:AttributeValue>alice@example.com</saml:AttributeValue>
    </saml:Attribute>
    <saml:Attribute Name="firstName">
      <saml:AttributeValue>Alice</saml:AttributeValue>
    </saml:Attribute>
    <saml:Attribute Name="lastName">
      <saml:AttributeValue>Smith</saml:AttributeValue>
    </saml:Attribute>
    <saml:Attribute Name="department">
      <saml:AttributeValue>Engineering</saml:AttributeValue>
    </saml:Attribute>
    <saml:Attribute Name="role">
      <saml:AttributeValue>Admin</saml:AttributeValue>
      <saml:AttributeValue>Developer</saml:AttributeValue>
    </saml:Attribute>
  </saml:AttributeStatement>
</saml:Assertion>`,
          caption: "Complete SAML 2.0 assertion with signature, subject, conditions, authentication statement, and attributes"
        },
        {
          type: "interactive",
          title: "🔍 Hands-On: Parse a SAML Assertion",
          content: `
**Exercise:** Given the SAML assertion above, answer these questions:

1. **Who issued this assertion?**
   - Hint: Look at \`<saml:Issuer>\`

2. **What is the user's email address?**
   - Hint: Check \`<saml:NameID>\` and attributes

3. **When does this assertion expire?**
   - Hint: Find \`NotOnOrAfter\` in Conditions

4. **Which Service Provider is this assertion for?**
   - Hint: Look at \`<saml:Audience>\`

5. **What roles does the user have?**
   - Hint: Check the \`role\` attribute (multi-valued)

<details>
<summary>View Answers</summary>

1. **Okta** (\`http://www.okta.com/exk123\`)
2. **alice@example.com** (appears in both NameID and email attribute)
3. **2024-01-15T10:35:00Z** (5 minutes after issuance)
4. **Salesforce** (\`https://salesforce.com\`)
5. **Admin** and **Developer** (multi-valued attribute)
</details>
          `
        }
      ],
      quiz: {
        id: "saml-assertions-quiz",
        title: "SAML Assertions Quiz",
        description: "Test your understanding of SAML assertion structure and attributes",
        passingScore: 70,
        questions: [
          {
            id: "saml-assert-q1",
            question: "What validates the integrity of a SAML assertion?",
            options: [
              "The AudienceRestriction element",
              "The digital signature using IdP's private key",
              "The SessionIndex value",
              "The NotOnOrAfter timestamp"
            ],
            correctAnswer: 1,
            explanation: "The digital signature, created with the IdP's private key and validated with the IdP's public certificate, ensures the assertion hasn't been tampered with."
          },
          {
            id: "saml-assert-q2",
            question: "What is the purpose of the AudienceRestriction condition?",
            options: [
              "To limit which users can authenticate",
              "To prevent assertion replay attacks by specifying intended recipient",
              "To set the maximum number of users",
              "To define the authentication method"
            ],
            correctAnswer: 1,
            explanation: "AudienceRestriction specifies which Service Provider the assertion is intended for, preventing an attacker from replaying the assertion to a different SP."
          },
          {
            id: "saml-assert-q3",
            question: "What does a NameID Format of 'persistent' provide?",
            options: [
              "A different identifier for each session",
              "The user's email address",
              "A stable, opaque identifier that doesn't change",
              "The user's username"
            ],
            correctAnswer: 2,
            explanation: "Persistent NameID format provides a stable, opaque identifier that remains the same across sessions while not exposing personal information like email."
          }
        ]
      }
    },
    {
      id: "saml-bindings-protocols",
      slug: "saml-bindings-protocols",
      title: "SAML Bindings and Protocols",
      description: "Learn how SAML messages are transported using HTTP-POST, HTTP-Redirect, and other bindings.",
      estimatedMinutes: 30,
      content: [
        {
          type: "text",
          title: "What are SAML Bindings?",
          content: `
**SAML Bindings** define how SAML messages (requests and responses) are transported between IdP and SP.

## Why Bindings Matter

SAML is an XML-based protocol, but XML messages need to be:
- **Transported** over the network (HTTP, SOAP, etc.)
- **Encoded** for safe transmission
- **Delivered** to the right endpoint

Bindings solve these challenges by mapping SAML messages to transport protocols.

## Common SAML Bindings

### 1. HTTP-POST Binding

**Most Common for Responses**

How it works:
1. IdP generates SAML assertion
2. IdP creates HTML form with assertion in hidden field
3. Form auto-submits via JavaScript to SP's ACS URL
4. Browser POSTs assertion to SP

**Example HTML Form:**
\`\`\`html
<form method="POST" action="https://salesforce.com/saml/consume">
  <input type="hidden" name="SAMLResponse" value="PD94bWwgdm...base64..."/>
  <input type="submit" value="Continue"/>
</form>
<script>
  document.forms[0].submit();
</script>
\`\`\`

**Characteristics:**
- ✅ Can handle large assertions (no URL length limits)
- ✅ More secure (assertion not in URL)
- ✅ Works with complex attributes
- ❌ Requires JavaScript for auto-submit
- ❌ Slightly slower than HTTP-Redirect

### 2. HTTP-Redirect Binding

**Most Common for Requests**

How it works:
1. SP creates SAML AuthnRequest
2. SP compresses and Base64-encodes request
3. SP redirects browser to IdP with request in URL parameter
4. IdP receives and processes request

**Example Redirect URL:**
\`\`\`
https://idp.example.com/sso?SAMLRequest=fZJNT8MwDIb%2FSn...&RelayState=abc123
\`\`\`

**Characteristics:**
- ✅ Simple, no JavaScript required
- ✅ Fast (single redirect)
- ✅ No form submission
- ❌ URL length limits (~2048 chars)
- ❌ Request visible in browser history
- ❌ Not suitable for large messages

### 3. HTTP-Artifact Binding

**Enterprise, High-Security**

How it works:
1. IdP generates assertion
2. IdP creates short "artifact" (reference token)
3. IdP sends artifact to SP via browser redirect
4. SP uses back-channel SOAP call to retrieve actual assertion from IdP

**Flow:**
\`\`\`
Browser: User → SP → IdP → SP (with artifact)
Back-channel: SP → IdP (fetch assertion) → SP
\`\`\`

**Characteristics:**
- ✅ Assertion never passes through browser
- ✅ More secure (back-channel only)
- ✅ No URL length issues
- ❌ More complex setup
- ❌ Requires back-channel connectivity
- ❌ Rarely used in modern implementations

### 4. SOAP Binding

**Legacy, Back-Channel**

- Used for back-channel communication
- Requires direct network connectivity
- Common in older enterprise setups
- Being replaced by RESTful approaches
          `
        },
        {
          type: "diagram",
          title: "HTTP-POST Binding Flow",
          content: `sequenceDiagram
    participant Browser
    participant SP as Service Provider
    participant IdP as Identity Provider

    Browser->>SP: GET /protected-resource
    SP->>Browser: 302 Redirect to IdP (HTTP-Redirect)
    Note over Browser,IdP: SAMLRequest in URL parameter
    Browser->>IdP: GET /sso?SAMLRequest=...
    IdP->>Browser: Show login page
    Browser->>IdP: POST credentials
    IdP->>IdP: Authenticate user
    IdP->>IdP: Generate SAML assertion
    IdP->>Browser: Return HTML form with SAMLResponse
    Note over IdP,Browser: Form auto-submits via JavaScript
    Browser->>SP: POST SAMLResponse to /saml/consume
    SP->>SP: Validate assertion
    SP->>Browser: Grant access (set session cookie)`,
          caption: "HTTP-POST binding flow showing how SAML assertions are transported via browser form submission"
        },
        {
          type: "text",
          title: "SAML Request (AuthnRequest)",
          content: `
The **AuthnRequest** is sent from SP to IdP to initiate authentication.

## AuthnRequest Structure

\`\`\`xml
<samlp:AuthnRequest
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_request123"
  Version="2.0"
  IssueInstant="2024-01-15T10:30:00Z"
  Destination="https://idp.example.com/sso"
  AssertionConsumerServiceURL="https://salesforce.com/saml/consume"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">

  <saml:Issuer>https://salesforce.com</saml:Issuer>

  <samlp:NameIDPolicy
    Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
    AllowCreate="true"/>

  <samlp:RequestedAuthnContext Comparison="exact">
    <saml:AuthnContextClassRef>
      urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
    </saml:AuthnContextClassRef>
  </samlp:RequestedAuthnContext>
</samlp:AuthnRequest>
\`\`\`

## Key Fields

**ID**: Unique request identifier
- SP generates random ID
- Used to prevent replay attacks
- Referenced in response's \`InResponseTo\`

**Destination**: IdP's SSO endpoint
- Where browser should be redirected
- Validates request is for correct IdP

**AssertionConsumerServiceURL (ACS URL)**: Where to send response
- SP's endpoint for receiving assertions
- IdP POSTs assertion here
- Must match metadata configuration

**ProtocolBinding**: How response should be sent
- Usually HTTP-POST for responses
- Tells IdP which binding to use

**Issuer**: SP's EntityID
- Identifies which SP sent request
- IdP uses this to load SP's configuration

**NameIDPolicy**: Requested identifier format
- SP requests specific NameID format
- \`AllowCreate="true"\` allows JIT provisioning

**RequestedAuthnContext**: Required authentication strength
- SP can request minimum auth level
- Example: Require MFA for admin access
- \`Comparison="exact"\` means exact match required

## RelayState Parameter

**RelayState** preserves application state during SSO:

\`\`\`
https://idp.example.com/sso?SAMLRequest=...&RelayState=/dashboard
\`\`\`

**Purpose:**
- Remembers where user was trying to go
- Passed through IdP unchanged
- Returned to SP in SAML response
- SP redirects user to original destination

**Example Flow:**
1. User tries to access \`/dashboard\`
2. SP sends AuthnRequest with \`RelayState=/dashboard\`
3. User authenticates at IdP
4. IdP returns assertion with \`RelayState=/dashboard\`
5. SP creates session and redirects to \`/dashboard\`

> **Security Note:** Always validate RelayState to prevent open redirect vulnerabilities. Only redirect to allowed paths within your application.
          `
        },
        {
          type: "text",
          title: "SAML Response",
          content: `
The **SAML Response** is sent from IdP to SP containing the assertion.

## Response Structure

\`\`\`xml
<samlp:Response
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_response456"
  Version="2.0"
  IssueInstant="2024-01-15T10:30:00Z"
  Destination="https://salesforce.com/saml/consume"
  InResponseTo="_request123">

  <saml:Issuer>http://www.okta.com/exk123</saml:Issuer>

  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>

  <saml:Assertion>
    <!-- Full assertion here (see previous lesson) -->
  </saml:Assertion>
</samlp:Response>
\`\`\`

## Response Validation Steps

**SP must validate:**

1. **Signature**: Verify response/assertion signature
2. **InResponseTo**: Match to original request ID
3. **Destination**: Ensure it's intended for this SP
4. **Issuer**: Verify it's from trusted IdP
5. **Status**: Check for Success status
6. **Conditions**: Validate NotBefore/NotOnOrAfter
7. **Audience**: Must match SP's EntityID
8. **Replay Protection**: Ensure assertion ID hasn't been used before

**Example Validation Code (pseudocode):**
\`\`\`python
def validate_saml_response(response, original_request_id):
    # 1. Verify signature using IdP's public certificate
    if not verify_signature(response, idp_certificate):
        raise SecurityError("Invalid signature")

    # 2. Check InResponseTo matches request
    if response.in_response_to != original_request_id:
        raise SecurityError("InResponseTo mismatch")

    # 3. Validate destination
    if response.destination != SP_ACS_URL:
        raise SecurityError("Invalid destination")

    # 4. Check status
    if response.status != "Success":
        raise AuthenticationError("Authentication failed")

    # 5. Validate assertion conditions
    assertion = response.assertion
    now = datetime.utcnow()

    if assertion.not_before > now or assertion.not_on_or_after < now:
        raise SecurityError("Assertion expired or not yet valid")

    # 6. Validate audience
    if assertion.audience != SP_ENTITY_ID:
        raise SecurityError("Assertion not for this SP")

    # 7. Prevent replay attacks
    if assertion_id_already_used(assertion.id):
        raise SecurityError("Assertion replay detected")

    mark_assertion_as_used(assertion.id)

    return assertion
\`\`\`

## Error Responses

IdP can return error status codes:

\`\`\`xml
<samlp:Status>
  <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Responder">
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:AuthnFailed"/>
  </samlp:StatusCode>
  <samlp:StatusMessage>Invalid credentials</samlp:StatusMessage>
</samlp:Status>
\`\`\`

**Common Status Codes:**
- **Success**: Authentication succeeded
- **Requester**: Error in request (invalid format, missing required field)
- **Responder**: IdP error (authentication failed, internal error)
- **VersionMismatch**: SAML version not supported
- **AuthnFailed**: User authentication failed
- **InvalidNameIDPolicy**: Requested NameID format not supported
          `
        },
        {
          type: "code",
          title: "Encoding/Decoding SAML Messages",
          language: "python",
          content: `import base64
import zlib
from urllib.parse import quote, unquote

# === ENCODING (SP to IdP) ===

def encode_authn_request(authn_request_xml):
    """
    Encode SAML AuthnRequest for HTTP-Redirect binding

    Steps:
    1. Deflate compress (zlib)
    2. Base64 encode
    3. URL encode
    """
    # Step 1: Deflate compress
    compressed = zlib.compress(authn_request_xml.encode('utf-8'))[2:-4]

    # Step 2: Base64 encode
    base64_encoded = base64.b64encode(compressed)

    # Step 3: URL encode
    url_encoded = quote(base64_encoded)

    return url_encoded

# Example usage
authn_request = """<?xml version="1.0"?>
<samlp:AuthnRequest ...>
  <saml:Issuer>https://salesforce.com</saml:Issuer>
  ...
</samlp:AuthnRequest>"""

encoded = encode_authn_request(authn_request)
redirect_url = f"https://idp.example.com/sso?SAMLRequest={encoded}&RelayState=/dashboard"

print(f"Redirect to: {redirect_url}")


# === DECODING (IdP receiving request) ===

def decode_authn_request(encoded_request):
    """
    Decode SAML AuthnRequest from HTTP-Redirect binding

    Steps (reverse of encoding):
    1. URL decode
    2. Base64 decode
    3. Inflate decompress
    """
    # Step 1: URL decode
    url_decoded = unquote(encoded_request)

    # Step 2: Base64 decode
    base64_decoded = base64.b64decode(url_decoded)

    # Step 3: Inflate decompress
    decompressed = zlib.decompress(base64_decoded, -zlib.MAX_WBITS)

    return decompressed.decode('utf-8')

# Example usage (IdP side)
received_request = "fZJNT8MwDIb..."  # From URL parameter
decoded_xml = decode_authn_request(received_request)
print("Received AuthnRequest:")
print(decoded_xml)


# === HTTP-POST ENCODING (IdP to SP) ===

def encode_saml_response(saml_response_xml):
    """
    Encode SAML Response for HTTP-POST binding

    Note: No compression for POST (only Base64)
    """
    # Just Base64 encode (no compression)
    base64_encoded = base64.b64encode(saml_response_xml.encode('utf-8'))
    return base64_encoded.decode('utf-8')

# Example usage (IdP sending response)
saml_response = """<?xml version="1.0"?>
<samlp:Response ...>
  <saml:Assertion>...</saml:Assertion>
</samlp:Response>"""

encoded_response = encode_saml_response(saml_response)

html_form = f"""
<html>
<body onload="document.forms[0].submit()">
  <form method="POST" action="https://salesforce.com/saml/consume">
    <input type="hidden" name="SAMLResponse" value="{encoded_response}"/>
    <input type="hidden" name="RelayState" value="/dashboard"/>
    <noscript>
      <input type="submit" value="Continue"/>
    </noscript>
  </form>
</body>
</html>
"""

print(html_form)


# === DECODING RESPONSE (SP receiving) ===

def decode_saml_response(encoded_response):
    """
    Decode SAML Response from HTTP-POST
    """
    # Just Base64 decode (no decompression)
    decoded = base64.b64decode(encoded_response)
    return decoded.decode('utf-8')

# Example usage (SP side)
received_response = "PD94bWwgdm..."  # From POST parameter
decoded_response_xml = decode_saml_response(received_response)
print("Received SAML Response:")
print(decoded_response_xml)`,
          caption: "Python code showing how to encode/decode SAML messages for HTTP-Redirect and HTTP-POST bindings"
        }
      ],
      quiz: {
        id: "saml-bindings-quiz",
        title: "SAML Bindings Quiz",
        description: "Test your knowledge of SAML message transport bindings",
        passingScore: 70,
        questions: [
          {
            id: "saml-bind-q1",
            question: "Which binding is most commonly used for SAML AuthnRequests?",
            options: [
              "HTTP-POST",
              "HTTP-Redirect",
              "HTTP-Artifact",
              "SOAP"
            ],
            correctAnswer: 1,
            explanation: "HTTP-Redirect is most common for AuthnRequests because they are small and can be compressed and sent via URL parameters efficiently."
          },
          {
            id: "saml-bind-q2",
            question: "What is the purpose of the RelayState parameter?",
            options: [
              "To encrypt the SAML message",
              "To preserve application state during SSO flow",
              "To validate the digital signature",
              "To compress the assertion"
            ],
            correctAnswer: 1,
            explanation: "RelayState preserves the user's intended destination (application state) through the SSO flow, allowing redirect back to the original page after authentication."
          },
          {
            id: "saml-bind-q3",
            question: "Why is HTTP-POST preferred over HTTP-Redirect for SAML Responses?",
            options: [
              "It's faster",
              "It requires less CPU",
              "It can handle larger assertions without URL length limits",
              "It's more secure against all attacks"
            ],
            correctAnswer: 2,
            explanation: "HTTP-POST can handle large SAML assertions with many attributes because the data is in the POST body, not limited by URL length restrictions (~2048 characters)."
          }
        ]
      }
    },
    {
      id: "saml-security",
      slug: "saml-security",
      title: "SAML Security Best Practices",
      description: "Learn common SAML vulnerabilities and how to implement secure SAML integrations.",
      estimatedMinutes: 35,
      content: [
        {
          type: "text",
          title: "SAML Security Threats",
          content: `
SAML implementations face several security vulnerabilities. Understanding these threats is critical for secure enterprise SSO.

## 1. XML Signature Wrapping (XSW) Attacks

**Most Critical SAML Vulnerability**

### How It Works

Attacker modifies a signed SAML assertion by:
1. Taking a valid, signed assertion
2. Moving the signature to a different location in XML
3. Injecting malicious content in the original location
4. SP validates signature (still valid) but processes malicious content

**Example Attack:**
\`\`\`xml
<samlp:Response>
  <!-- Attacker inserts fake assertion here -->
  <saml:Assertion ID="_attacker">
    <saml:Subject>
      <saml:NameID>admin@evil.com</saml:NameID>
    </saml:Subject>
  </saml:Assertion>

  <!-- Original signed assertion moved here -->
  <saml:Assertion ID="_original">
    <ds:Signature>...</ds:Signature>
    <saml:Subject>
      <saml:NameID>user@example.com</saml:NameID>
    </saml:Subject>
  </saml:Assertion>
</samlp:Response>
\`\`\`

**Vulnerable Code** processes first assertion without checking signature reference:
\`\`\`python
# VULNERABLE - processes first assertion
response = parse_xml(saml_response)
assertion = response.find("Assertion")  # Gets attacker's assertion!
validate_signature(response)  # Validates original assertion
# Grants access to admin@evil.com instead of user@example.com
\`\`\`

### Mitigation

✅ **Validate signature BEFORE parsing content**
✅ **Check signature Reference URI matches processed assertion ID**
✅ **Use SAML libraries with XSW protection**
✅ **Validate entire Response signature, not just Assertion**

**Secure Code:**
\`\`\`python
# SECURE - validates signature reference
response = parse_xml(saml_response)
signature = response.find("Signature")
reference_uri = signature.find("Reference").get("URI")  # e.g., "#_abc123"

assertion = response.find("Assertion", id=reference_uri[1:])  # Match!
validate_signature(response, assertion)  # Ensures signature matches content
\`\`\`

## 2. Assertion Replay Attacks

**Attack:** Attacker captures valid assertion and replays it later

### How It Works

1. Attacker intercepts valid SAML assertion (e.g., via network sniffing)
2. Attacker replays assertion to SP
3. SP accepts assertion if not checking for replay
4. Attacker gains unauthorized access

### Mitigation

✅ **Store processed assertion IDs** in cache (Redis, database)
✅ **Reject assertions with duplicate IDs**
✅ **Enforce short NotOnOrAfter times** (5 minutes max)
✅ **Validate NotBefore and NotOnOrAfter timestamps**

**Implementation:**
\`\`\`python
# Redis-based replay protection
import redis
from datetime import timedelta

redis_client = redis.Redis()

def prevent_replay(assertion_id, not_on_or_after):
    # Check if already used
    if redis_client.exists(f"saml:assertion:{assertion_id}"):
        raise SecurityError("Assertion replay detected")

    # Mark as used with expiration
    ttl = (not_on_or_after - datetime.utcnow()).total_seconds()
    redis_client.setex(
        f"saml:assertion:{assertion_id}",
        time=int(ttl),
        value="used"
    )
\`\`\`

## 3. Recipient Attack

**Attack:** Assertion meant for one SP is sent to another SP

### How It Works

1. User authenticates to SP1, receives assertion
2. Attacker captures assertion
3. Attacker sends assertion to SP2
4. SP2 accepts if not validating Recipient/Audience

### Mitigation

✅ **Always validate AudienceRestriction** matches your SP's EntityID
✅ **Validate Recipient** matches your ACS URL
✅ **Validate Destination** in Response

**Validation Code:**
\`\`\`python
def validate_recipient(assertion, response):
    # Check audience matches this SP
    audience = assertion.find("AudienceRestriction/Audience").text
    if audience != SP_ENTITY_ID:
        raise SecurityError(f"Audience mismatch: {audience}")

    # Check recipient matches ACS URL
    recipient = assertion.find("SubjectConfirmationData").get("Recipient")
    if recipient != SP_ACS_URL:
        raise SecurityError(f"Recipient mismatch: {recipient}")

    # Check response destination
    if response.get("Destination") != SP_ACS_URL:
        raise SecurityError("Destination mismatch")
\`\`\`
          `
        },
        {
          type: "text",
          title: "Additional SAML Security Risks",
          content: `
## 4. XML External Entity (XXE) Injection

**Attack:** Attacker injects external entity references in XML

**Malicious SAML:**
\`\`\`xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<samlp:Response>
  <saml:Issuer>&xxe;</saml:Issuer>
</samlp:Response>
\`\`\`

### Mitigation

✅ **Disable external entity processing** in XML parser
\`\`\`python
# Python lxml - secure configuration
from lxml import etree

parser = etree.XMLParser(
    resolve_entities=False,  # Disable XXE
    no_network=True,         # No network access
    remove_blank_text=True
)
xml = etree.fromstring(saml_xml, parser=parser)
\`\`\`

## 5. SAML Logout (SLO) Vulnerabilities

**Attack:** Attacker initiates logout for other users

### CSRF in Logout

Attacker tricks victim into clicking logout URL:
\`\`\`html
<img src="https://idp.example.com/logout?SAMLRequest=..."/>
\`\`\`

### Mitigation

✅ **Require POST for logout requests**
✅ **Implement CSRF tokens**
✅ **Validate LogoutRequest signature**
✅ **Confirm logout with user** before terminating session

## 6. Man-in-the-Middle (MITM)

**Attack:** Attacker intercepts SAML messages

### Mitigation

✅ **Always use HTTPS/TLS** for all SAML endpoints
✅ **Validate TLS certificates** (no self-signed in production)
✅ **Enable HSTS (HTTP Strict Transport Security)**
✅ **Use certificate pinning** for high-security scenarios

**HSTS Header:**
\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains
\`\`\`

## 7. RelayState Open Redirect

**Attack:** Malicious RelayState redirects user to phishing site

**Malicious Request:**
\`\`\`
https://idp.example.com/sso?SAMLRequest=...&RelayState=https://evil.com
\`\`\`

After successful auth, SP redirects to \`https://evil.com\`

### Mitigation

✅ **Validate RelayState is relative path** (not absolute URL)
✅ **Whitelist allowed redirect targets**
✅ **Reject external URLs** in RelayState

**Secure Validation:**
\`\`\`python
from urllib.parse import urlparse

def validate_relay_state(relay_state):
    if not relay_state:
        return "/"  # Default

    # Parse URL
    parsed = urlparse(relay_state)

    # Reject absolute URLs with scheme/netloc
    if parsed.scheme or parsed.netloc:
        raise SecurityError("RelayState must be relative path")

    # Ensure it starts with /
    if not relay_state.startswith("/"):
        relay_state = "/" + relay_state

    # Whitelist allowed paths
    allowed_prefixes = ["/dashboard", "/app", "/settings"]
    if not any(relay_state.startswith(p) for p in allowed_prefixes):
        return "/"  # Default safe path

    return relay_state
\`\`\`

## 8. Weak Cryptographic Algorithms

**Risk:** Using deprecated algorithms weakens security

### Avoid These

❌ **SHA-1** for signatures (collision attacks possible)
❌ **RSA-1024** keys (too short, can be factored)
❌ **MD5** hashing (completely broken)
❌ **3DES** encryption (deprecated)

### Use These

✅ **SHA-256** or **SHA-512** for signatures
✅ **RSA-2048** or **RSA-4096** keys
✅ **AES-256** for encryption
✅ **ECDSA P-256** for signatures (modern alternative)

**Check Signature Algorithm:**
\`\`\`python
def validate_signature_algorithm(assertion):
    sig_method = assertion.find("Signature/SignedInfo/SignatureMethod")
    algorithm = sig_method.get("Algorithm")

    # Reject weak algorithms
    weak_algorithms = [
        "http://www.w3.org/2000/09/xmldsig#rsa-sha1",  # SHA-1
        "http://www.w3.org/2000/09/xmldsig#dsa-sha1",  # DSA-SHA1
    ]

    if algorithm in weak_algorithms:
        raise SecurityError(f"Weak signature algorithm: {algorithm}")

    # Require strong algorithms
    strong_algorithms = [
        "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
        "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512",
    ]

    if algorithm not in strong_algorithms:
        raise SecurityError(f"Algorithm not allowed: {algorithm}")
\`\`\`
          `
        },
        {
          type: "text",
          title: "SAML Security Checklist",
          content: `
## Complete SAML Security Checklist

### Assertion Validation

- [ ] ✅ **Validate digital signature** using IdP's public certificate
- [ ] ✅ **Check signature Reference URI** matches assertion ID (XSW protection)
- [ ] ✅ **Verify Issuer** matches trusted IdP EntityID
- [ ] ✅ **Validate AudienceRestriction** matches SP EntityID
- [ ] ✅ **Check Recipient** matches ACS URL
- [ ] ✅ **Validate NotBefore** (assertion not used too early)
- [ ] ✅ **Validate NotOnOrAfter** (assertion not expired)
- [ ] ✅ **Prevent replay attacks** (store used assertion IDs)
- [ ] ✅ **Verify InResponseTo** matches original request ID (SP-initiated)
- [ ] ✅ **Check signature algorithm** is strong (SHA-256, not SHA-1)

### Transport Security

- [ ] ✅ **Enforce HTTPS/TLS** for all SAML endpoints
- [ ] ✅ **Validate TLS certificates** (no self-signed in production)
- [ ] ✅ **Enable HSTS** header
- [ ] ✅ **Use TLS 1.2+** (disable TLS 1.0/1.1)
- [ ] ✅ **Implement certificate pinning** (high-security environments)

### XML Parsing Security

- [ ] ✅ **Disable XML external entities** (XXE protection)
- [ ] ✅ **Disable DTD processing**
- [ ] ✅ **Disable network access** in XML parser
- [ ] ✅ **Use secure XML parser configuration**
- [ ] ✅ **Limit XML document size** (prevent DoS)

### RelayState Security

- [ ] ✅ **Validate RelayState is relative path**
- [ ] ✅ **Whitelist allowed redirect paths**
- [ ] ✅ **Reject absolute URLs** in RelayState
- [ ] ✅ **Limit RelayState length** (prevent abuse)
- [ ] ✅ **URL-encode RelayState properly**

### Logout Security

- [ ] ✅ **Require POST** for logout requests
- [ ] ✅ **Implement CSRF protection** for logout
- [ ] ✅ **Validate LogoutRequest signature**
- [ ] ✅ **Confirm logout** with user
- [ ] ✅ **Clear all session data** on logout
- [ ] ✅ **Implement Single Logout (SLO)** if using multiple SPs

### Cryptographic Security

- [ ] ✅ **Use RSA-2048+** or ECDSA P-256+ keys
- [ ] ✅ **Use SHA-256+** for signatures (not SHA-1)
- [ ] ✅ **Use AES-256** for encryption
- [ ] ✅ **Rotate certificates regularly** (annually)
- [ ] ✅ **Store private keys securely** (HSM, key vault)

### Metadata Security

- [ ] ✅ **Validate metadata signature** when exchanging
- [ ] ✅ **Use HTTPS** for metadata URLs
- [ ] ✅ **Implement metadata refresh** mechanism
- [ ] ✅ **Monitor certificate expiration**
- [ ] ✅ **Maintain metadata backup**

### Monitoring and Logging

- [ ] ✅ **Log all authentication attempts**
- [ ] ✅ **Log assertion validation failures**
- [ ] ✅ **Monitor for replay attacks**
- [ ] ✅ **Alert on signature validation failures**
- [ ] ✅ **Track SAML error rates**
- [ ] ✅ **Implement anomaly detection**

### Configuration Security

- [ ] ✅ **Limit assertion lifetime** (5 minutes max)
- [ ] ✅ **Implement session timeout**
- [ ] ✅ **Require re-authentication** for sensitive operations
- [ ] ✅ **Disable IdP-initiated SSO** (if not needed - CSRF risk)
- [ ] ✅ **Implement MFA** at IdP
- [ ] ✅ **Review attribute mappings** regularly

> **Pro Tip:** Use a well-maintained SAML library like **OneLogin's python3-saml**, **Shibboleth**, or **SimpleSAMLphp** instead of implementing SAML from scratch. These libraries handle most security concerns automatically.
          `
        },
        {
          type: "interactive",
          title: "🛡️ Security Exercise: Identify Vulnerabilities",
          content: `
**Scenario:** Review this SAML validation code and identify security issues:

\`\`\`python
def process_saml_response(saml_response_base64):
    # Decode response
    saml_xml = base64.b64decode(saml_response_base64)

    # Parse XML
    response = parse_xml(saml_xml)

    # Get first assertion
    assertion = response.find("Assertion")

    # Extract user email
    email = assertion.find("Subject/NameID").text

    # Create session
    create_session(email)

    return {"status": "success", "user": email}
\`\`\`

**Questions:**

1. What critical validation is missing?
2. What attack is this vulnerable to?
3. How would you fix it?

<details>
<summary>View Answer</summary>

**Vulnerabilities Identified:**

1. ❌ **No signature validation** - Attacker can forge assertions
2. ❌ **No XSW protection** - Gets first assertion without checking signature reference
3. ❌ **No replay protection** - Same assertion can be used multiple times
4. ❌ **No audience validation** - Assertion meant for another SP accepted
5. ❌ **No timestamp validation** - Expired assertions accepted
6. ❌ **No XXE protection** - XML parser might process external entities
7. ❌ **No InResponseTo check** - Can't detect CSRF in SP-initiated flow

**Secure Version:**

\`\`\`python
def process_saml_response(saml_response_base64, expected_request_id=None):
    # Decode response
    saml_xml = base64.b64decode(saml_response_base64)

    # Parse XML securely (disable XXE)
    parser = create_secure_xml_parser()
    response = parse_xml(saml_xml, parser=parser)

    # Validate signature and get referenced assertion
    assertion = validate_signature_and_get_assertion(response)

    # Validate timestamps
    validate_timestamps(assertion)

    # Validate audience
    validate_audience(assertion, expected_audience=SP_ENTITY_ID)

    # Prevent replay
    prevent_replay_attack(assertion.get("ID"))

    # Validate InResponseTo (SP-initiated)
    if expected_request_id:
        if response.get("InResponseTo") != expected_request_id:
            raise SecurityError("InResponseTo mismatch")

    # Extract user email
    email = assertion.find("Subject/NameID").text

    # Create session
    create_session(email)

    return {"status": "success", "user": email}
\`\`\`
</details>
          `
        }
      ],
      quiz: {
        id: "saml-security-quiz",
        title: "SAML Security Quiz",
        description: "Test your knowledge of SAML security vulnerabilities and mitigations",
        passingScore: 70,
        questions: [
          {
            id: "saml-sec-q1",
            question: "What is the most critical SAML vulnerability?",
            options: [
              "Weak passwords",
              "XML Signature Wrapping (XSW)",
              "Slow performance",
              "Large XML size"
            ],
            correctAnswer: 1,
            explanation: "XML Signature Wrapping is the most critical SAML vulnerability, allowing attackers to inject malicious content while maintaining a valid signature."
          },
          {
            id: "saml-sec-q2",
            question: "How do you prevent SAML assertion replay attacks?",
            options: [
              "Use longer passwords",
              "Store processed assertion IDs and reject duplicates",
              "Encrypt the assertion",
              "Use HTTP instead of HTTPS"
            ],
            correctAnswer: 1,
            explanation: "Storing processed assertion IDs (with TTL based on NotOnOrAfter) and rejecting duplicates prevents replay attacks where an attacker reuses a captured assertion."
          },
          {
            id: "saml-sec-q3",
            question: "Why should RelayState be validated?",
            options: [
              "To improve performance",
              "To prevent open redirect vulnerabilities",
              "To compress the data",
              "To encrypt sensitive information"
            ],
            correctAnswer: 1,
            explanation: "RelayState must be validated to prevent open redirect attacks where an attacker could redirect users to phishing sites after successful authentication."
          }
        ]
      }
    },
    {
      id: "saml-vs-modern-protocols",
      slug: "saml-vs-modern-protocols",
      title: "SAML vs. OAuth 2.0 vs. OpenID Connect",
      description: "Compare SAML with modern authentication protocols and learn when to use each.",
      estimatedMinutes: 25,
      content: [
        {
          type: "text",
          title: "Protocol Comparison",
          content: `
Understanding the differences between SAML, OAuth 2.0, and OpenID Connect helps you choose the right protocol for your use case.

## Side-by-Side Comparison

| Aspect | SAML 2.0 | OAuth 2.0 | OpenID Connect |
|--------|----------|-----------|----------------|
| **Purpose** | Authentication + Coarse Authorization | Delegated Authorization | Authentication |
| **Year Released** | 2005 | 2012 | 2014 |
| **Data Format** | XML | JSON | JSON (JWT) |
| **Token Type** | SAML Assertions | Access Tokens (opaque/JWT) | ID Token (JWT) + Access Token |
| **Primary Use** | Enterprise SSO, B2B | API access, delegated access | User login, modern SSO |
| **Browser Flow** | HTTP-POST, HTTP-Redirect | Authorization Code, Implicit | Authorization Code + PKCE |
| **Mobile Support** | Poor (not designed for it) | Excellent (native app support) | Excellent (native app support) |
| **API Access** | Not designed for APIs | Perfect for APIs | Via Access Token |
| **Signature** | XML Signature (complex) | JWT Signature (simple) | JWT Signature |
| **Encryption** | XML Encryption | TLS + optional JWE | TLS + optional JWE |
| **Session Management** | SLO (Single Logout) | None (stateless tokens) | Session Management, RP-Initiated Logout |
| **Complexity** | High | Medium | Medium |
| **Enterprise Adoption** | Very High | High | Growing Fast |
| **Consumer Adoption** | Low | High | Very High |
| **Federation** | Excellent (mature) | Not designed for federation | Good (via federation operators) |

## Technical Differences

### 1. Data Format

**SAML (XML):**
\`\`\`xml
<saml:Assertion ID="_abc123">
  <saml:Subject>
    <saml:NameID>alice@example.com</saml:NameID>
  </saml:Subject>
  <saml:AttributeStatement>
    <saml:Attribute Name="email">
      <saml:AttributeValue>alice@example.com</saml:AttributeValue>
    </saml:Attribute>
  </saml:AttributeStatement>
</saml:Assertion>
\`\`\`

**OpenID Connect (JWT):**
\`\`\`json
{
  "iss": "https://idp.example.com",
  "sub": "alice@example.com",
  "aud": "client_abc123",
  "exp": 1516239022,
  "iat": 1516239022,
  "email": "alice@example.com"
}
\`\`\`

**Size Comparison:**
- SAML Assertion: ~2-5 KB (verbose XML)
- ID Token (JWT): ~500-1000 bytes (compact JSON)

### 2. Transport Mechanism

**SAML:**
- Browser-based (HTTP-POST, HTTP-Redirect)
- Requires HTML forms and JavaScript
- Not suitable for mobile native apps

**OAuth/OIDC:**
- Browser-based (Authorization Code)
- Native app support (custom URI schemes, app links)
- Mobile-first design

### 3. Token Structure

**SAML Assertion:**
- Always XML
- Always contains user attributes
- Signed (sometimes encrypted)
- Short-lived (5 minutes typical)

**OAuth Access Token:**
- Can be opaque (reference token) or JWT
- No standardized claims
- Used for API access
- Longer-lived (1 hour typical)

**OIDC ID Token:**
- Always JWT
- Standardized claims (\`sub\`, \`iss\`, \`aud\`, etc.)
- Proof of authentication
- Short-lived (5-10 minutes typical)
          `
        },
        {
          type: "text",
          title: "When to Use Each Protocol",
          content: `
## Use SAML When:

✅ **Enterprise SSO Requirements**
- Integrating with enterprise SaaS (Salesforce, Workday, ServiceNow)
- B2B federation with partner organizations
- Compliance mandates SAML (government, healthcare)

✅ **Existing SAML Infrastructure**
- Organization already uses SAML IdP
- Many applications configured for SAML
- IT team experienced with SAML

✅ **Strong Federation Needs**
- Cross-organization identity federation
- Complex attribute mapping requirements
- Centralized IdP with many SPs

**Example Scenario:**
> A Fortune 500 company needs to provide SSO to 50+ enterprise SaaS applications (Salesforce, Workday, ServiceNow, etc.) for 10,000+ employees. **Use SAML.**

## Use OAuth 2.0 When:

✅ **API Access Control**
- Mobile app needs to call backend APIs
- Third-party apps need limited access to user data
- Microservices need inter-service authorization

✅ **Delegated Authorization**
- User authorizes app to access their Google Drive
- Social media integrations (post on behalf of user)
- IoT devices accessing cloud services

✅ **No User Authentication Needed**
- Machine-to-machine communication
- Service accounts
- Backend integrations

**Example Scenario:**
> A mobile banking app needs to access user's account data from the bank's API. The app should have limited permissions and users should be able to revoke access. **Use OAuth 2.0.**

## Use OpenID Connect When:

✅ **User Authentication (Login)**
- Consumer web applications
- Mobile apps needing user login
- Modern web apps replacing username/password

✅ **Social Login**
- "Sign in with Google/Facebook/GitHub"
- Consumer-facing applications
- Reducing password fatigue

✅ **Modern SSO**
- Cloud-native applications
- Microservices architectures
- Mobile-first platforms

✅ **Need User Profile Information**
- Application needs user's email, name, photo
- Profile synchronization
- Personalization based on identity claims

**Example Scenario:**
> A new SaaS product wants to offer "Sign in with Google" and "Sign in with Microsoft" for quick user onboarding without passwords. **Use OpenID Connect.**

## Hybrid Scenarios

### SAML + OAuth

**Use Together When:**
- Legacy enterprise apps use SAML (Salesforce)
- Modern APIs use OAuth (mobile app → API)
- Need both enterprise SSO and API access

**Architecture:**
\`\`\`
Users → SAML → Enterprise Apps (Salesforce, Workday)
       ↘ OIDC → Modern Apps (React SPA, Mobile)
              → OAuth → APIs (Microservices)
\`\`\`

### Bridge Pattern: SAML to OAuth

Some IdPs (Okta, Auth0) can:
- Accept SAML from corporate IdP
- Issue OAuth/OIDC tokens to modern apps
- Enables gradual migration from SAML to OIDC

**Flow:**
\`\`\`
Corporate IdP (AD FS) → SAML → Cloud IdP (Okta)
                                      ↓
                               OIDC/OAuth
                                      ↓
                              Modern Apps (React, Mobile)
\`\`\`
          `
        },
        {
          type: "text",
          title: "Migration Strategy: SAML to OpenID Connect",
          content: `
Many organizations are migrating from SAML to OpenID Connect for modern applications.

## Why Migrate?

**Benefits of Moving to OIDC:**
- ✅ Better mobile/native app support
- ✅ Simpler implementation (JSON vs. XML)
- ✅ Modern developer experience
- ✅ Smaller token size (faster)
- ✅ Better API integration
- ✅ Active development and improvements

**When to Keep SAML:**
- ✅ Enterprise SaaS apps require it (Salesforce, etc.)
- ✅ Existing SAML infrastructure works well
- ✅ No business driver for migration
- ✅ Team expertise in SAML

## Migration Approach

### Phase 1: Assess Current State

**Inventory Applications:**
- List all SAML-integrated applications
- Identify critical vs. non-critical apps
- Check if apps support OIDC

**Example Assessment:**
| Application | Protocol | OIDC Support? | Priority | Migration Effort |
|-------------|----------|---------------|----------|------------------|
| Salesforce | SAML | Yes (OIDC available) | Medium | Medium |
| Custom App A | SAML | Can be updated | High | Low |
| Legacy HR System | SAML | No OIDC support | Low | Not feasible |
| New Mobile App | None yet | Yes | High | Low (greenfield) |

### Phase 2: Dual-Stack IdP

**Run Both Protocols Simultaneously:**

Configure IdP to support both SAML and OIDC:
\`\`\`
IdP (Okta/Auth0)
├── SAML Endpoints
│   └── Legacy apps continue using SAML
└── OIDC Endpoints
    └── New apps use OIDC
\`\`\`

**Benefits:**
- No "big bang" migration
- Migrate apps incrementally
- Rollback capability
- Test OIDC without disrupting SAML

### Phase 3: Migrate Applications

**Prioritize:**
1. **New applications** - Start with OIDC (easiest)
2. **Custom applications** - Update to OIDC (you control code)
3. **SaaS with OIDC support** - Reconfigure (Salesforce, Slack)
4. **Legacy SaaS** - Keep on SAML (if no OIDC support)

**Migration Steps (per app):**
1. Configure OIDC client in IdP
2. Update application code/configuration
3. Test authentication flow
4. Migrate users gradually (canary deployment)
5. Monitor for issues
6. Decommission SAML configuration

### Phase 4: Sunset SAML

**When Most Apps Migrated:**
- Document remaining SAML apps
- Evaluate business case for keeping SAML
- If only 1-2 apps, may keep SAML indefinitely
- Fully sunset SAML endpoints when possible

## Code Migration Example

**Before (SAML):**
\`\`\`python
# Python Flask app with SAML
from onelogin.saml2.auth import OneLogin_Saml2_Auth

@app.route('/saml/acs', methods=['POST'])
def saml_acs():
    auth = OneLogin_Saml2_Auth(request, saml_settings)
    auth.process_response()

    if auth.is_authenticated():
        user_email = auth.get_nameid()
        attributes = auth.get_attributes()
        create_session(user_email, attributes)
        return redirect('/dashboard')

    return "Authentication failed", 401
\`\`\`

**After (OpenID Connect):**
\`\`\`python
# Python Flask app with OIDC
from authlib.integrations.flask_client import OAuth

oauth = OAuth(app)
oauth.register(
    'okta',
    client_id='client_abc123',
    client_secret='secret',
    server_metadata_url='https://example.okta.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.route('/login')
def login():
    return oauth.okta.authorize_redirect(redirect_uri=url_for('callback', _external=True))

@app.route('/callback')
def callback():
    token = oauth.okta.authorize_access_token()
    user_info = oauth.okta.parse_id_token(token)

    create_session(user_info['email'], user_info)
    return redirect('/dashboard')
\`\`\`

**Benefits of OIDC Version:**
- Fewer lines of code
- Simpler configuration
- Better library support
- Automatic discovery via \`.well-known\` endpoint
- Standard claims (no custom attribute mapping)

## Coexistence Best Practices

**While Running Both:**

1. **Consistent User Identifiers**
   - Use same identifier (email) in both SAML and OIDC
   - Ensures user identity consistent across apps

2. **Unified Session Management**
   - IdP manages single session
   - Both SAML and OIDC apps share SSO session
   - Single logout affects both protocol types

3. **Monitor Both Protocols**
   - Track usage metrics (which apps use SAML vs. OIDC)
   - Monitor authentication success rates
   - Identify migration opportunities

4. **Document Everything**
   - Which apps use which protocol
   - Migration roadmap
   - Rollback procedures
          `
        },
        {
          type: "diagram",
          title: "Protocol Selection Decision Tree",
          content: `graph TD
    A[Need Authentication/Authorization?] --> B{What's the primary use case?}

    B -->|Enterprise SSO for SaaS apps| C{Does app support OIDC?}
    C -->|Yes| D[Use OpenID Connect]
    C -->|No| E[Use SAML 2.0]

    B -->|User login for web/mobile app| F{Consumer or Enterprise?}
    F -->|Consumer| G[Use OpenID Connect]
    F -->|Enterprise with SAML requirement| E
    F -->|Modern Enterprise| D

    B -->|API access control| H{User involved?}
    H -->|Yes - user delegates access| I[Use OAuth 2.0 with user consent]
    H -->|No - machine to machine| J[Use OAuth 2.0 Client Credentials]

    B -->|B2B Federation| K{Partner requirements?}
    K -->|Partner uses SAML| E
    K -->|Modern partner| D

    D --> L[Benefits: Mobile support, modern, simple]
    E --> M[Benefits: Enterprise compatibility, mature]
    I --> N[Benefits: Delegated access, fine-grained scopes]
    J --> O[Benefits: No user interaction, service auth]`,
          caption: "Decision tree for choosing between SAML, OAuth 2.0, and OpenID Connect based on use case requirements"
        },
        {
          type: "interactive",
          title: "🎯 Exercise: Choose the Right Protocol",
          content: `
For each scenario, select the most appropriate protocol(s):

**Scenario 1:** A fintech startup is building a mobile banking app. Users need to log in and the app must call backend APIs to retrieve account balances and transactions.
- A) SAML only
- B) OAuth 2.0 only
- C) OpenID Connect + OAuth 2.0
- D) SAML + OAuth 2.0

**Scenario 2:** A large enterprise (50,000 employees) needs to provide SSO access to Salesforce, Workday, and ServiceNow.
- A) SAML 2.0
- B) OAuth 2.0
- C) OpenID Connect
- D) Custom protocol

**Scenario 3:** A weather data API wants to allow third-party developers to access weather forecasts on behalf of users (users authorize access without sharing passwords).
- A) SAML 2.0
- B) OAuth 2.0
- C) OpenID Connect
- D) Basic Authentication

**Scenario 4:** A modern SaaS productivity tool wants to offer "Sign in with Google" and "Sign in with Microsoft" to consumer and business users.
- A) SAML 2.0
- B) OAuth 2.0
- C) OpenID Connect
- D) LDAP

<details>
<summary>View Answers</summary>

1. **C - OpenID Connect + OAuth 2.0**
   - OIDC for user authentication (login)
   - OAuth 2.0 for API access (account balance, transactions)
   - Mobile-first, modern protocols

2. **A - SAML 2.0**
   - Enterprise SaaS apps (Salesforce, Workday, ServiceNow) primarily support SAML
   - Mature enterprise federation protocol
   - Large employee base typical of SAML environments

3. **B - OAuth 2.0**
   - Delegated authorization use case
   - Third-party apps accessing resources on behalf of users
   - No need for authentication (just authorization)

4. **C - OpenID Connect**
   - Social login ("Sign in with...") uses OIDC
   - Consumer-facing authentication
   - Modern protocol with excellent provider support (Google, Microsoft)
</details>
          `
        }
      ],
      quiz: {
        id: "saml-comparison-quiz",
        title: "SAML vs. Modern Protocols Quiz",
        description: "Test your understanding of when to use SAML, OAuth 2.0, or OpenID Connect",
        passingScore: 70,
        questions: [
          {
            id: "saml-comp-q1",
            question: "What is the main disadvantage of SAML for mobile applications?",
            options: [
              "SAML is too secure for mobile apps",
              "SAML relies on browser-based flows not suited for native apps",
              "SAML tokens are too large",
              "SAML requires passwords"
            ],
            correctAnswer: 1,
            explanation: "SAML was designed for browser-based flows using HTTP-POST/Redirect and HTML forms, which don't work well in native mobile applications. OAuth/OIDC with native app support (PKCE, custom URI schemes) are better suited."
          },
          {
            id: "saml-comp-q2",
            question: "Which protocol is specifically designed for user authentication (not authorization)?",
            options: [
              "OAuth 2.0",
              "SAML 2.0",
              "OpenID Connect",
              "Both SAML and OIDC"
            ],
            correctAnswer: 3,
            explanation: "Both SAML 2.0 and OpenID Connect are designed for authentication (proving who you are). OAuth 2.0 is designed for delegated authorization (granting access), though it's often misused for authentication."
          },
          {
            id: "saml-comp-q3",
            question: "What is a key advantage of SAML over OAuth/OIDC?",
            options: [
              "Smaller token size",
              "Better mobile support",
              "More mature enterprise tooling and B2B federation",
              "Simpler implementation"
            ],
            correctAnswer: 2,
            explanation: "SAML has mature enterprise tooling, extensive B2B federation support, and deep integration with enterprise SaaS applications. However, it has larger tokens (XML), limited mobile support, and more complex implementation than OAuth/OIDC."
          }
        ]
      }
    }
  ]
}
