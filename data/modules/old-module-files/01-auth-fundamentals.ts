import type { Module } from "@/types"

export const authFundamentalsModule: Module = {
  id: "auth-fundamentals",
  title: "Authentication vs Authorization Fundamentals",
  slug: "01-auth-fundamentals",
  description:
    "Master the core concepts of identity: understanding who users are (authentication) and what they can do (authorization). Learn about tokens, claims, scopes, and the evolution of modern IAM.",
  difficulty: "beginner",
  order: 1,
  estimatedHours: 3,
  learningObjectives: [
    "Distinguish between authentication and authorization with real-world examples",
    "Understand the roles of Identity Providers (IdPs) and Relying Parties (RPs)",
    "Identify the purpose and structure of Access Tokens, ID Tokens, and Refresh Tokens",
    "Explain claims, scopes, and audiences in identity systems",
    "Trace the evolution from LDAP through SAML, OAuth, OIDC, to FIDO",
  ],
  lessons: [
    {
      id: "auth-vs-authz",
      title: "Authentication vs Authorization: The Foundation",
      slug: "auth-vs-authz",
      description:
        "Learn the fundamental difference between proving who you are (authentication) and what you're allowed to do (authorization).",
      duration: 15,
      order: 1,
      content: [
        {
          type: "text",
          content: `# Authentication vs Authorization: The Foundation

Two concepts form the bedrock of Identity and Access Management (IAM): **authentication** and **authorization**. While often confused, they serve distinct purposes in securing systems.`,
        },
        {
          type: "text",
          title: "Authentication: Proving Who You Are",
          content: `**Authentication** is the process of verifying identity. When you log into a system, you prove you are who you claim to be.

Common authentication factors include:
- **Something you know**: Password, PIN, security questions
- **Something you have**: Phone, hardware token, smart card
- **Something you are**: Fingerprint, facial recognition, iris scan

**Multi-Factor Authentication (MFA)** combines two or more factors for stronger security. For example, password + SMS code or password + fingerprint.`,
        },
        {
          type: "text",
          title: "Authorization: Deciding What You Can Do",
          content: `**Authorization** determines what an authenticated user is permitted to access or perform. It happens *after* authentication.

Examples:
- An employee can view company documents but only managers can approve expenses
- A user can read their own profile but only admins can delete users
- A mobile app can access your photos but not your contacts (if you only granted photo permission)

Authorization answers: "Now that I know who you are, what are you allowed to do?"`,
        },
        {
          type: "text",
          title: "Real-World Analogy",
          content: `Think of airport security:

1. **Authentication**: You show your ID and boarding pass to prove you're the person on the ticket
2. **Authorization**: The gate agent checks if your ticket allows you to board *this specific flight* at *this specific time*

Your ID proves who you are. Your ticket grants you permission to board.`,
        },
        {
          type: "text",
          title: "In Practice: Web Applications",
          content: `When you sign into a web application:

1. **Authentication**: You enter username and password. The system verifies these credentials and issues a session token
2. **Authorization**: On each request, the system checks the token to determine what resources you can access

These processes are separate but complementary. Strong authentication without proper authorization leaves data exposed. Granular authorization without reliable authentication cannot trust user identity.`,
        },
      ],
      keyTakeaways: [
        "Authentication verifies identity (who you are)",
        "Authorization determines permissions (what you can do)",
        "These are separate processes that work together",
        "MFA strengthens authentication by requiring multiple factors",
        "Authorization happens after successful authentication",
      ],
    },
    {
      id: "idps-and-rps",
      title: "Identity Providers and Relying Parties",
      slug: "idps-and-rps",
      description:
        "Explore the relationship between Identity Providers (IdPs) like Google and Azure AD, and Relying Parties (RPs) that trust them.",
      duration: 20,
      order: 2,
      content: [
        {
          type: "text",
          content: `# Identity Providers and Relying Parties

Modern identity systems rely on **federation**—the practice of trusting an external authority to handle authentication. This architecture involves two key players: Identity Providers and Relying Parties.`,
        },
        {
          type: "text",
          title: "Identity Provider (IdP)",
          content: `An **Identity Provider (IdP)** is a trusted service that authenticates users and issues identity assertions.

**Popular IdPs:**
- **Google Identity**: Enables "Sign in with Google"
- **Microsoft Azure AD / Entra ID**: Enterprise identity for Office 365, Azure
- **Okta**: Cloud-based identity provider for enterprises
- **Auth0**: Developer-friendly authentication platform
- **Keycloak**: Open-source IdP

**What IdPs Do:**
1. Authenticate users (verify credentials)
2. Store user identity information
3. Issue security tokens (assertions) to relying parties
4. Manage sessions and single sign-on (SSO)
5. Enforce authentication policies (MFA, password requirements)`,
        },
        {
          type: "text",
          title: "Relying Party (RP)",
          content: `A **Relying Party (RP)** is an application that *relies* on an external IdP to authenticate users instead of managing credentials itself.

**Examples:**
- A SaaS app that uses "Sign in with Google" is an RP trusting Google (the IdP)
- An internal company portal trusting Azure AD
- A mobile app using OAuth to access user data from Facebook

**Benefits for RPs:**
- No password storage or credential management
- Leverage IdP's security expertise
- Enable single sign-on (SSO) across applications
- Reduce attack surface (no credential database to breach)`,
        },
        {
          type: "text",
          title: "The Trust Relationship",
          content: `The IdP-RP relationship is built on **trust**:

1. **Registration**: RP registers with IdP, receives credentials (client ID, client secret)
2. **User Authentication**: When a user wants to access the RP, they're redirected to the IdP
3. **Assertion**: IdP authenticates user and issues a signed token/assertion
4. **Verification**: RP validates the token signature using IdP's public key
5. **Access Granted**: RP trusts the IdP's assertion and grants access

This trust is formalized through:
- **Metadata Exchange**: IdP publishes metadata (endpoints, public keys)
- **Protocol Standards**: SAML 2.0, OAuth 2.0, OpenID Connect
- **Digital Signatures**: Cryptographic proof that assertions come from the IdP`,
        },
        {
          type: "diagram",
          title: "OAuth 2.0 Flow Between IdP and RP",
          content: `sequenceDiagram
    participant User
    participant RP as Relying Party (App)
    participant IdP as Identity Provider (Google)

    User->>RP: Click "Sign in with Google"
    RP->>IdP: Redirect to Google login (with client_id)
    User->>IdP: Enter credentials
    IdP->>User: Issue authorization code
    User->>RP: Return code to app
    RP->>IdP: Exchange code for access token
    IdP->>RP: Return access token + ID token
    RP->>RP: Validate tokens
    RP->>User: Grant access`,
          caption: "Sequence diagram showing the interaction between a user, relying party application, and identity provider during OAuth 2.0 authentication"
        },
        {
          type: "text",
          title: "Federation at Scale",
          content: `In enterprise environments, federation enables:

**Single Sign-On (SSO)**: Authenticate once, access many applications
- Employee logs into Azure AD in the morning
- Access Salesforce, Workday, Slack without re-authenticating

**External Collaboration**: Partner companies trusting each other's IdPs
- Contractor logs in with their company IdP
- Access client systems without separate credentials

**Social Login**: Consumer apps trusting social IdPs
- Users choose Google, Facebook, or Apple
- No password management for the app`,
        },
      ],
      keyTakeaways: [
        "IdPs authenticate users and issue identity assertions",
        "RPs trust IdPs instead of managing credentials themselves",
        "Trust is established through registration, metadata, and cryptographic signatures",
        "Federation enables SSO and reduces credential sprawl",
        "Examples: Google, Azure AD, Okta (IdPs); SaaS apps, corporate portals (RPs)",
      ],
      prerequisites: ["auth-vs-authz"],
    },
    {
      id: "token-types",
      title: "Token Types: Access, ID, and Refresh Tokens",
      slug: "token-types",
      description:
        "Understand the three critical token types in modern IAM systems and when each is used.",
      duration: 25,
      order: 3,
      content: [
        {
          type: "text",
          content: `# Token Types: Access, ID, and Refresh Tokens

Modern identity systems use **tokens**—cryptographically signed strings that represent identity, permissions, or authentication state. Three token types dominate: Access Tokens, ID Tokens, and Refresh Tokens.`,
        },
        {
          type: "text",
          title: "Access Token: Authorization Credential",
          content: `An **Access Token** is a credential that grants permission to access specific resources. It represents what a user (or client) is **authorized** to do.

**Characteristics:**
- **Purpose**: Authorization (not authentication)
- **Audience**: Resource server (API)
- **Format**: Often opaque (random string) or JWT
- **Lifetime**: Short (minutes to hours)
- **Scope**: Limited permissions (read:profile, write:posts)

**Example Use Case:**
A mobile app uses an access token to call the GitHub API on behalf of the user. The token grants permissions like "read:user" and "public_repo" but not admin access.

**Access Token Structure (JWT Example):**
\`\`\`json
{
  "iss": "https://accounts.google.com",
  "aud": "https://api.example.com",
  "sub": "user123",
  "scope": "read:profile write:posts",
  "exp": 1672531200,
  "iat": 1672527600
}
\`\`\`

Key fields:
- **iss**: Issuer (IdP)
- **aud**: Audience (which API can accept this token)
- **sub**: Subject (user ID)
- **scope**: Permissions granted
- **exp**: Expiration timestamp`,
        },
        {
          type: "text",
          title: "ID Token: Authentication Proof",
          content: `An **ID Token** proves that authentication occurred and provides information about the authenticated user. It represents **who the user is**.

**Characteristics:**
- **Purpose**: Authentication proof
- **Audience**: Client application (RP)
- **Format**: Always JWT (signed JSON)
- **Lifetime**: Short (minutes)
- **Content**: User identity claims (email, name, sub)

**Introduced by OpenID Connect (OIDC)**, ID Tokens are not sent to APIs. They're consumed by the client application to establish a user session.

**ID Token Structure (JWT):**
\`\`\`json
{
  "iss": "https://accounts.google.com",
  "aud": "client-app-id-12345",
  "sub": "110169484474386276334",
  "email": "user@example.com",
  "email_verified": true,
  "name": "Jane Doe",
  "picture": "https://example.com/photo.jpg",
  "iat": 1672527600,
  "exp": 1672531200,
  "nonce": "n-0S6_WzA2Mj"
}
\`\`\`

Key fields:
- **sub**: Unique user identifier
- **email**, **name**, **picture**: User profile claims
- **nonce**: Anti-replay token
- **aud**: Client application ID (not an API)`,
        },
        {
          type: "text",
          title: "Refresh Token: Long-Lived Credential",
          content: `A **Refresh Token** is a long-lived credential used to obtain new access tokens without re-authenticating the user.

**Characteristics:**
- **Purpose**: Obtain fresh access tokens
- **Audience**: Authorization server (IdP)
- **Format**: Opaque string (not JWT)
- **Lifetime**: Long (days to months)
- **Storage**: Secure (encrypted database, secure cookie)

**Why Refresh Tokens?**

Access tokens have short lifetimes for security. If an access token is stolen, it expires quickly. But forcing users to log in every 15 minutes is poor UX.

**Solution**: Issue a refresh token alongside the access token. When the access token expires, use the refresh token to get a new one—without user interaction.

**Refresh Token Flow:**
1. User authenticates, receives access token + refresh token
2. App uses access token to call APIs
3. Access token expires
4. App sends refresh token to IdP
5. IdP validates refresh token, issues new access token
6. Process repeats until refresh token expires or is revoked`,
        },
        {
          type: "code",
          title: "Token Lifecycle Example",
          language: "typescript",
          content: `// Initial authentication
const authResponse = await fetch('https://idp.com/oauth/token', {
  method: 'POST',
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: 'your-client-id',
    client_secret: 'your-client-secret',
  }),
});

const tokens = await authResponse.json();
// {
//   access_token: "eyJhbGciOiJSUzI1NiIs...",
//   id_token: "eyJhbGciOiJSUzI1NiIs...",
//   refresh_token: "v1.MRrtPcZt...",
//   expires_in: 3600
// }

// Use access token to call API
const userData = await fetch('https://api.example.com/user', {
  headers: {
    'Authorization': \`Bearer \${tokens.access_token}\`
  }
});

// When access token expires, refresh it
const refreshResponse = await fetch('https://idp.com/oauth/token', {
  method: 'POST',
  body: JSON.stringify({
    grant_type: 'refresh_token',
    refresh_token: tokens.refresh_token,
    client_id: 'your-client-id',
  }),
});

const newTokens = await refreshResponse.json();
// Get new access_token (and optionally new refresh_token)`,
        },
        {
          type: "text",
          title: "Security Considerations",
          content: `**Access Token Protection:**
- Store in memory (not localStorage for web apps)
- Send only to authorized APIs
- Validate audience and scope on the API side

**ID Token Validation:**
- Verify signature using IdP's public key
- Check issuer, audience, expiration
- Validate nonce to prevent replay attacks

**Refresh Token Security:**
- Store securely (encrypted, HttpOnly cookies)
- Rotate on use (issue new refresh token with each refresh)
- Implement refresh token revocation
- Monitor for suspicious refresh patterns`,
        },
      ],
      keyTakeaways: [
        "Access Tokens grant authorization to access APIs (what you can do)",
        "ID Tokens prove authentication and contain user identity (who you are)",
        "Refresh Tokens enable obtaining new access tokens without re-authentication",
        "Access and ID tokens are short-lived; refresh tokens are long-lived",
        "Each token type has different audiences: APIs, client apps, and IdPs",
      ],
      prerequisites: ["idps-and-rps"],
    },
    {
      id: "claims-scopes-audience",
      title: "Claims, Scopes, and Audiences",
      slug: "claims-scopes-audience",
      description:
        "Learn how identity information is structured and limited through claims, scopes, and audience restrictions.",
      duration: 20,
      order: 4,
      content: [
        {
          type: "text",
          content: `# Claims, Scopes, and Audiences

Identity systems structure user information and permissions through three key concepts: **claims** (statements about the user), **scopes** (requested permissions), and **audiences** (who can use a token).`,
        },
        {
          type: "text",
          title: "Claims: Statements About Identity",
          content: `A **claim** is a piece of information asserted about a subject (user). Claims are name-value pairs included in tokens.

**Standard Claims (OpenID Connect):**
\`\`\`
sub      - Subject (unique user ID)
name     - Full name
email    - Email address
picture  - Profile photo URL
phone    - Phone number
address  - Physical address
\`\`\`

**Custom Claims:**
Organizations can add custom claims for business logic:
\`\`\`
department    - Engineering
employee_id   - EMP-12345
access_level  - 3
groups        - ["admins", "developers"]
\`\`\`

**Example JWT with Claims:**
\`\`\`json
{
  "sub": "auth0|507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "email_verified": true,
  "department": "Engineering",
  "roles": ["developer", "team-lead"],
  "iat": 1672527600,
  "exp": 1672531200
}
\`\`\`

**Why Claims Matter:**
- Enable authorization decisions (check role claim)
- Personalize user experience (display name)
- Reduce API calls (include common user data)`,
        },
        {
          type: "text",
          title: "Scopes: Requesting Permissions",
          content: `A **scope** is a permission that an application requests from a user or authorization server. Scopes define what actions an access token can perform.

**OAuth 2.0 Scopes:**
Scopes follow the pattern: \`resource:action\` or \`permission_name\`

**Examples:**
\`\`\`
read:profile     - Read user profile
write:posts      - Create posts
admin:users      - Manage users
openid           - Request OIDC authentication
email            - Request email claim
profile          - Request profile claims (name, picture)
offline_access   - Request refresh token
\`\`\`

**Scope Request Example:**
\`\`\`
https://idp.com/authorize?
  client_id=abc123&
  scope=openid email profile read:posts write:posts&
  response_type=code&
  redirect_uri=https://app.com/callback
\`\`\`

**User Consent:**
When scopes are requested, users often see a consent screen:

"Example App wants to:"
✓ View your email address
✓ View your profile information
✓ Read your posts
✓ Create posts on your behalf

**Scope Enforcement:**
- **Client-side**: Request only necessary scopes (principle of least privilege)
- **Server-side**: APIs validate scope claims in access tokens before allowing actions`,
        },
        {
          type: "code",
          title: "API Scope Validation",
          language: "typescript",
          content: `// Express.js middleware to check scopes
function requireScope(requiredScope: string) {
  return (req, res, next) => {
    const token = extractToken(req);
    const decoded = verifyAndDecodeToken(token);

    const scopes = decoded.scope?.split(' ') || [];

    if (!scopes.includes(requiredScope)) {
      return res.status(403).json({
        error: 'insufficient_scope',
        message: \`This endpoint requires '\${requiredScope}' scope\`
      });
    }

    next();
  };
}

// Protect endpoints with scope requirements
app.get('/api/posts', requireScope('read:posts'), async (req, res) => {
  const posts = await getPosts();
  res.json(posts);
});

app.post('/api/posts', requireScope('write:posts'), async (req, res) => {
  const newPost = await createPost(req.body);
  res.json(newPost);
});`,
        },
        {
          type: "text",
          title: "Audience: Who Can Use This Token",
          content: `The **audience (aud)** claim specifies which resource server (API) a token is intended for. It prevents token misuse across different services.

**Why Audience Matters:**

Without audience restrictions, a token issued for API-A could be sent to API-B. If both APIs trust the same IdP, API-B might accept the token—even though it wasn't meant for it.

**Example Attack (without audience):**
1. Attacker obtains access token for "read:profile" on Social Network API
2. Attacker sends same token to Banking API (also trusts same IdP)
3. Banking API validates signature (it's valid!) and grants access
4. Attacker accesses bank data with social media token

**Solution: Audience Validation**
\`\`\`json
{
  "iss": "https://idp.example.com",
  "sub": "user123",
  "aud": "https://api.banking.example.com",
  "scope": "read:accounts",
  "exp": 1672531200
}
\`\`\`

Each API must verify that \`aud\` matches its own identifier:

\`\`\`typescript
function validateToken(token: string) {
  const decoded = jwt.verify(token, publicKey);

  if (decoded.aud !== 'https://api.banking.example.com') {
    throw new Error('Token audience mismatch');
  }

  return decoded;
}
\`\`\`

**Multiple Audiences:**
Some tokens support multiple audiences (array):
\`\`\`json
{
  "aud": ["https://api.example.com", "https://admin.example.com"]
}
\`\`\``,
        },
        {
          type: "text",
          title: "Putting It All Together",
          content: `**Claims**, **scopes**, and **audiences** work together:

1. **Application requests scopes**: "I want read:profile and write:posts permissions"
2. **User grants consent**: "Yes, I allow this app to read my profile and create posts"
3. **IdP issues tokens with claims**: Access token includes scope claim and audience
4. **API validates**: Check signature, audience, scope, and expiration
5. **Authorization decision**: Does this token have the right scope for this action?

**Example Flow:**
\`\`\`
Client requests: scope=read:posts write:posts
IdP issues access token:
{
  "iss": "https://idp.com",
  "sub": "user123",
  "aud": "https://api.example.com",
  "scope": "read:posts write:posts",
  "email": "user@example.com",  // claim
  "role": "editor",              // custom claim
  "exp": 1672531200
}

API receives request: GET /api/posts
API validates: aud ✓, scope includes read:posts ✓
API grants access

API receives request: POST /api/posts
API validates: aud ✓, scope includes write:posts ✓
API grants access

API receives request: DELETE /api/users/456
API validates: aud ✓, scope does NOT include admin:users ✗
API denies access (403 Forbidden)
\`\`\``,
        },
      ],
      keyTakeaways: [
        "Claims are statements about the user (email, name, custom attributes)",
        "Scopes define requested permissions (read:profile, write:posts)",
        "Audiences restrict which APIs can accept a token",
        "Scopes are requested by clients, granted by users, enforced by APIs",
        "Audience validation prevents token misuse across different services",
      ],
      prerequisites: ["token-types"],
    },
    {
      id: "iam-evolution",
      title: "IAM Evolution: From LDAP to FIDO",
      slug: "iam-evolution",
      description:
        "Trace the historical evolution of identity systems from directory services through federation to modern passwordless authentication.",
      duration: 20,
      order: 5,
      content: [
        {
          type: "text",
          content: `# IAM Evolution: From LDAP to FIDO

Identity and Access Management has evolved over decades, driven by changing technology landscapes, security threats, and user expectations. Understanding this evolution provides context for why modern protocols exist.`,
        },
        {
          type: "text",
          title: "LDAP Era: Directory Services (1990s-2000s)",
          content: `**Lightweight Directory Access Protocol (LDAP)** emerged as the standard for centralized user directories.

**Key Characteristics:**
- Centralized user storage (username, password, attributes)
- Hierarchical data structure (Organizational Units)
- Used by Active Directory, OpenLDAP
- Primarily for internal networks (VPNs, corporate apps)

**Limitations:**
- Not designed for web-based authentication
- Credential validation requires direct LDAP access (security risk)
- No federation support (each app needs LDAP integration)
- Poor fit for cloud and mobile

**Legacy:** LDAP still powers enterprise directories, but modern systems use it as a backend with federation layers on top.`,
        },
        {
          type: "text",
          title: "SAML Era: Enterprise Federation (2000s-2010s)",
          content: `**Security Assertion Markup Language (SAML 2.0)** brought federation to the enterprise.

**Innovation:**
- XML-based assertions carrying user identity
- Single Sign-On (SSO) across web applications
- Trust between Identity Providers and Service Providers
- Eliminated password sharing between systems

**Use Case:**
Employee authenticates to corporate IdP (e.g., Active Directory Federation Services). Browser carries SAML assertion to SaaS apps (Salesforce, Workday, Slack) without re-authenticating.

**Why It Dominated:**
- Enterprise-focused (legal agreements, trust frameworks)
- Strong security (XML signatures, encryption)
- Mature vendor ecosystem (Shibboleth, Ping Identity)

**Limitations:**
- XML complexity (verbose, hard to debug)
- Poor mobile support (designed for browsers)
- Security vulnerabilities (XML Signature Wrapping attacks)
- Not developer-friendly`,
        },
        {
          type: "text",
          title: "OAuth 2.0: Delegated Authorization (2012)",
          content: `**OAuth 2.0** revolutionized how applications access user data without seeing passwords.

**Problem Solved:**
Before OAuth, users gave apps their passwords:
- Twitter app wants to post tweets → user gives app their Twitter password
- Security disaster: apps store passwords, full account access, hard to revoke

**OAuth Solution:**
- User authorizes app at the IdP (Twitter)
- IdP issues an access token to the app
- App uses token to access APIs (no password needed)
- User can revoke access anytime

**Key Flows:**
- **Authorization Code Flow**: Browser-based apps (most secure)
- **Client Credentials Flow**: Machine-to-machine
- **Device Code Flow**: TVs, IoT devices

**Impact:**
- Enabled API economy (Twitter, GitHub, Google APIs)
- Foundation for modern mobile apps
- Delegated access without sharing credentials

**Limitation:**
OAuth only handles **authorization**. It doesn't standardize **authentication** (who the user is).`,
        },
        {
          type: "text",
          title: "OpenID Connect: Authentication Layer (2014)",
          content: `**OpenID Connect (OIDC)** added authentication on top of OAuth 2.0.

**Innovation:**
- Introduced **ID Token** (JWT) containing user identity
- Standardized user profile claims (email, name, sub)
- Built on OAuth 2.0 (reused flows, added identity layer)

**"Sign in with Google" is OIDC**, not pure OAuth.

**What OIDC Provides:**
1. User authentication proof (ID Token)
2. User profile info (UserInfo endpoint)
3. Standardized discovery (find IdP endpoints automatically)
4. Federation across IdPs

**Why It Won:**
- Developer-friendly (JSON vs XML)
- Mobile-native design
- Ecosystem support (Google, Microsoft, Auth0)
- Works for both consumer (social login) and enterprise (SSO)

**OIDC vs SAML:**
- Both enable SSO
- OIDC: JSON, REST, mobile-friendly, developer-focused
- SAML: XML, enterprise-focused, mature but complex`,
        },
        {
          type: "text",
          title: "FIDO2/WebAuthn: Passwordless Future (2018-Present)",
          content: `**FIDO2 and WebAuthn** aim to eliminate passwords entirely through public key cryptography.

**How It Works:**
1. User registers device (phone, security key)
2. Device generates a **private key** (never leaves device)
3. Device sends **public key** to website
4. During login, website challenges device
5. Device signs challenge with private key
6. Website verifies signature with public key

**Security Benefits:**
- **Phishing-resistant**: Private key tied to specific domain
- **No shared secrets**: Server breach doesn't expose credentials
- **Hardware-bound**: Credentials tied to device (can't be copied)

**Passkeys:** Synced FIDO2 credentials (iCloud Keychain, Google Password Manager)
- Combine security of FIDO with convenience of sync
- Biometric unlock (Face ID, Touch ID)

**Adoption:**
- Supported by all major browsers
- Integrated into Google, Microsoft, Apple ecosystems
- Growing enterprise adoption (Okta, Azure AD)

**The Future:**
FIDO2 represents the industry's bet on a passwordless future, but passwords will coexist for years during transition.`,
        },
        {
          type: "code",
          title: "Evolution Timeline",
          language: "text",
          content: `1990s: LDAP
        ↓  [Centralized directories]
2000s: SAML 2.0
        ↓  [Enterprise SSO, XML-based federation]
2012:  OAuth 2.0
        ↓  [API authorization, delegated access]
2014:  OpenID Connect
        ↓  [Authentication + OAuth, JSON, mobile-friendly]
2018:  FIDO2 / WebAuthn
        ↓  [Passwordless, public key crypto]
Now:   Hybrid Ecosystems
        → OIDC for authentication
        → OAuth for authorization
        → SAML for legacy enterprise
        → FIDO2 for passwordless
        → Zero Trust principles`,
        },
        {
          type: "text",
          title: "Modern IAM Principles",
          content: `Today's IAM systems combine lessons from this evolution:

**Federation**: Trust external IdPs (don't build your own auth)
**Delegation**: OAuth for API access without passwords
**Standards**: OIDC for authentication, SAML for enterprise
**Passwordless**: FIDO2 for phishing-resistant auth
**Zero Trust**: Never trust, always verify (even inside network)

The trend is clear: **fewer passwords, more cryptography, federated trust**.`,
        },
      ],
      keyTakeaways: [
        "LDAP provided centralized directories but lacked federation",
        "SAML enabled enterprise SSO but was complex (XML)",
        "OAuth 2.0 solved delegated API access without passwords",
        "OpenID Connect added authentication on top of OAuth",
        "FIDO2/WebAuthn represents the passwordless future",
        "Modern systems use OIDC + OAuth + Zero Trust principles",
      ],
      prerequisites: ["claims-scopes-audience"],
    },
  ],
  quiz: {
    id: "auth-fundamentals-quiz",
    moduleId: "auth-fundamentals",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        question: "What is the primary difference between authentication and authorization?",
        options: [
          "Authentication verifies identity; authorization determines permissions",
          "Authentication determines permissions; authorization verifies identity",
          "They are the same thing with different names",
          "Authentication is only for mobile apps; authorization is only for web apps",
        ],
        correctAnswer: 0,
        explanation:
          "Authentication proves who you are (identity verification), while authorization determines what you're allowed to do (permission checking). They are distinct but complementary processes.",
        difficulty: "beginner",
        relatedLessonId: "auth-vs-authz",
      },
      {
        id: "q2",
        question:
          "In the IdP-RP relationship, what does the Relying Party (RP) rely on the Identity Provider (IdP) for?",
        options: [
          "Hosting the application",
          "Authenticating users and issuing identity assertions",
          "Storing application data",
          "Providing network security",
        ],
        correctAnswer: 1,
        explanation:
          "The Relying Party trusts the Identity Provider to authenticate users and issue identity assertions (tokens/assertions) instead of managing credentials itself. This enables federation and SSO.",
        difficulty: "beginner",
        relatedLessonId: "idps-and-rps",
      },
      {
        id: "q3",
        question: "Which token type is specifically designed to prove that authentication occurred?",
        options: ["Access Token", "Refresh Token", "ID Token", "Session Token"],
        correctAnswer: 2,
        explanation:
          "ID Tokens (introduced by OpenID Connect) are specifically designed to prove authentication and contain user identity claims. They are always JWTs and are intended for the client application, not APIs.",
        difficulty: "beginner",
        relatedLessonId: "token-types",
      },
      {
        id: "q4",
        question: "What is the primary purpose of a Refresh Token?",
        options: [
          "To access protected APIs",
          "To prove user identity to client applications",
          "To obtain new access tokens without re-authentication",
          "To store user profile information",
        ],
        correctAnswer: 2,
        explanation:
          "Refresh Tokens are long-lived credentials used to obtain new access tokens when they expire, without requiring the user to re-authenticate. This balances security (short-lived access tokens) with user experience (no frequent logins).",
        difficulty: "beginner",
        relatedLessonId: "token-types",
      },
      {
        id: "q5",
        question: "In OAuth 2.0/OIDC, what does a 'scope' represent?",
        options: [
          "The geographic location of a user",
          "A requested permission or capability",
          "The size of a database",
          "A type of encryption algorithm",
        ],
        correctAnswer: 1,
        explanation:
          "Scopes represent requested permissions or capabilities that an application asks for. They define what actions an access token can perform (e.g., 'read:profile', 'write:posts'). Users grant these permissions during the consent flow.",
        difficulty: "beginner",
        relatedLessonId: "claims-scopes-audience",
      },
      {
        id: "q6",
        question: "Why is the audience (aud) claim important in access tokens?",
        options: [
          "It identifies the user",
          "It specifies which API the token is intended for, preventing token misuse",
          "It determines the token expiration time",
          "It contains the user's email address",
        ],
        correctAnswer: 1,
        explanation:
          "The audience claim specifies which resource server (API) the token is intended for. APIs must validate that the audience matches their identifier to prevent tokens issued for one service from being misused at another service.",
        difficulty: "intermediate",
        relatedLessonId: "claims-scopes-audience",
      },
      {
        id: "q7",
        question: "What was the primary limitation that led to OAuth 2.0's creation?",
        options: [
          "SAML was too fast",
          "Applications required users to share passwords to access their data on other services",
          "LDAP didn't support mobile devices",
          "Passwords were too secure",
        ],
        correctAnswer: 1,
        explanation:
          "Before OAuth 2.0, users had to share their passwords with third-party applications to grant access to their data (e.g., giving a Twitter client your Twitter password). OAuth solved this with delegated authorization using access tokens instead of passwords.",
        difficulty: "intermediate",
        relatedLessonId: "iam-evolution",
      },
      {
        id: "q8",
        question: "What innovation did OpenID Connect add on top of OAuth 2.0?",
        options: [
          "Support for mobile devices",
          "XML-based tokens",
          "An authentication layer with ID Tokens containing user identity",
          "Password encryption",
        ],
        correctAnswer: 2,
        explanation:
          "OpenID Connect added an authentication layer on top of OAuth 2.0 by introducing ID Tokens (JWTs containing user identity claims), standardized user profile info, and discovery mechanisms. OAuth 2.0 alone only handles authorization, not authentication.",
        difficulty: "intermediate",
        relatedLessonId: "iam-evolution",
      },
      {
        id: "q9",
        question: "How does FIDO2/WebAuthn improve security compared to password-based authentication?",
        options: [
          "It uses longer passwords",
          "It uses public key cryptography with private keys that never leave the device",
          "It requires users to answer security questions",
          "It stores encrypted passwords in the cloud",
        ],
        correctAnswer: 1,
        explanation:
          "FIDO2/WebAuthn uses public key cryptography where the private key never leaves the user's device and is hardware-bound. This makes it phishing-resistant (keys are tied to specific domains) and eliminates shared secrets (server breaches don't expose credentials).",
        difficulty: "intermediate",
        relatedLessonId: "iam-evolution",
      },
      {
        id: "q10",
        question:
          "Which of the following is a 'claim' in the context of identity tokens?",
        options: [
          "A user's request for data",
          "A piece of information asserted about a user (e.g., email, name)",
          "A permission to access an API",
          "An encryption method",
        ],
        correctAnswer: 1,
        explanation:
          "A claim is a piece of information asserted about a subject (user), represented as a name-value pair in tokens. Examples include 'email', 'name', 'sub' (user ID), or custom claims like 'department' or 'role'.",
        difficulty: "beginner",
        relatedLessonId: "claims-scopes-audience",
      },
    ],
  },
  badge: {
    id: "badge-auth-fundamentals",
    name: "Identity Foundations",
    description: "Master the core concepts of authentication, authorization, and modern IAM",
    icon: "🔐",
    color: "beginner",
    moduleId: "auth-fundamentals",
  },
}
