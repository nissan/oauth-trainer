import type { Module } from "@/types"

export const oauth2Module: Module = {
  id: "oauth2-core",
  title: "OAuth 2.0: Delegated Authorization",
  slug: "oauth2-core",
  description:
    "Deep dive into OAuth 2.0 authorization flows, security best practices, and token lifecycle management. Learn when to use each grant type and how to avoid common security pitfalls.",
  difficulty: "beginner",
  order: 2,
  estimatedHours: 4,
  learningObjectives: [
    "Understand the four key roles in OAuth 2.0 (Resource Owner, Client, Authorization Server, Resource Server)",
    "Implement Authorization Code Flow with PKCE for secure mobile and web apps",
    "Use Client Credentials Flow for machine-to-machine communication",
    "Manage token lifecycle with refresh tokens, introspection, and revocation",
    "Identify and prevent common OAuth security vulnerabilities",
  ],
  prerequisites: ["auth-fundamentals"],
  lessons: [
    {
      id: "oauth-roles",
      title: "The Four Roles of OAuth 2.0",
      slug: "oauth-roles",
      description:
        "Understand the fundamental architecture: Resource Owner, Client, Authorization Server, and Resource Server.",
      duration: 15,
      order: 1,
      content: [
        {
          type: "text",
          content: `# The Four Roles of OAuth 2.0

OAuth 2.0 defines four distinct roles that interact to enable delegated authorization. Understanding these roles is essential to comprehending any OAuth flow.`,
        },
        {
          type: "text",
          title: "1. Resource Owner (The User)",
          content: `The **Resource Owner** is the entity (typically a human user) that owns the protected resources and can grant access to them.

**Examples:**
- A user with a Google Drive account (owns files)
- A GitHub user (owns repositories)
- A user with calendar events on Microsoft 365

**Authority:**
The Resource Owner has the power to:
- Grant or deny access to their resources
- Revoke previously granted access
- Define scope limitations (e.g., "read-only access")

**In Practice:**
When you click "Allow" on a permission dialog, you're acting as the Resource Owner, granting a client app access to your resources.`,
        },
        {
          type: "text",
          title: "2. Client (The Application)",
          content: `The **Client** is an application requesting access to protected resources on behalf of the Resource Owner.

**Client Types:**
- **Public Clients**: Cannot securely store credentials (mobile apps, SPAs, desktop apps)
- **Confidential Clients**: Can securely store secrets (server-side web apps, backend services)

**Examples:**
- A mobile app requesting access to your Google Photos
- A web app that posts tweets on your behalf
- A third-party analytics tool reading your GitHub stats

**Client Registration:**
Before using OAuth, clients must register with the Authorization Server to receive:
- **Client ID**: Public identifier for the application
- **Client Secret**: Confidential credential (for confidential clients only)
- **Redirect URIs**: Approved callback URLs

**Example Registration:**
\`\`\`json
{
  "client_id": "abc123xyz789",
  "client_name": "Awesome Photo Editor",
  "client_secret": "secret_xyz_NEVER_EXPOSE",
  "redirect_uris": [
    "https://photoeditor.example.com/callback",
    "myapp://callback"
  ],
  "grant_types": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_method": "client_secret_basic"
}
\`\`\``,
        },
        {
          type: "text",
          title: "3. Authorization Server (The Gatekeeper)",
          content: `The **Authorization Server** authenticates the Resource Owner and issues access tokens to the Client after obtaining authorization.

**Responsibilities:**
- Authenticate the Resource Owner
- Present consent screen (scope permissions)
- Validate Client credentials
- Issue Access Tokens, ID Tokens (OIDC), and Refresh Tokens
- Enforce security policies (MFA, conditional access)

**Popular Authorization Servers:**
- **Google Identity Platform**
- **Microsoft Azure AD / Entra ID**
- **Okta**
- **Auth0**
- **Keycloak** (open-source)

**Key Endpoints:**
\`\`\`
Authorization Endpoint: /oauth/authorize
  → User authentication and consent

Token Endpoint: /oauth/token
  → Exchange codes/refresh tokens for access tokens

Introspection Endpoint: /oauth/introspect
  → Validate and inspect tokens

Revocation Endpoint: /oauth/revoke
  → Revoke tokens
\`\`\``,
        },
        {
          type: "text",
          title: "4. Resource Server (The Protected API)",
          content: `The **Resource Server** hosts the protected resources and validates access tokens before serving requests.

**Responsibilities:**
- Validate access tokens (signature, expiration, audience, scope)
- Enforce authorization policies
- Serve protected resources (APIs, data)
- Log access for auditing

**Examples:**
- Google Drive API (stores files)
- GitHub API (repositories, issues)
- Stripe API (payment data)

**Token Validation:**
\`\`\`typescript
// Resource Server validates incoming token
app.get('/api/photos', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  try {
    // Validate token signature, expiration, audience
    const decoded = await validateToken(token);

    // Check required scope
    if (!decoded.scope?.includes('read:photos')) {
      return res.status(403).json({ error: 'insufficient_scope' });
    }

    // Serve protected resource
    const photos = await getPhotos(decoded.sub);
    res.json(photos);
  } catch (error) {
    res.status(401).json({ error: 'invalid_token' });
  }
});
\`\`\``,
        },
        {
          type: "diagram",
          title: "OAuth 2.0 Role Interaction",
          content: `sequenceDiagram
    participant RO as Resource Owner (User)
    participant Client as Client (App)
    participant AS as Authorization Server
    participant RS as Resource Server (API)

    Client->>RO: Requests authorization
    Client->>AS: Redirects user to /authorize
    AS->>RO: Authenticates user
    AS->>RO: Shows consent screen
    RO->>AS: Grants permission
    AS->>Client: Returns authorization code
    Client->>AS: Exchanges code for tokens
    AS->>Client: Returns access token
    Client->>RS: Requests resource with token
    RS->>RS: Validates token
    RS->>Client: Returns protected resource`,
          caption: "The four OAuth 2.0 roles interacting during the authorization code flow"
        },
        {
          type: "text",
          title: "Important Distinctions",
          content: `**Authorization Server vs Resource Server:**
These are often separate systems:
- **Authorization Server**: Google's OAuth server (\`accounts.google.com\`)
- **Resource Server**: Google Drive API (\`drive.googleapis.com\`)

But they can be the same system in simpler architectures.

**Resource Owner vs Client:**
- **Resource Owner**: Owns the data
- **Client**: Requests access on behalf of the Resource Owner

Critical: The Client acts on behalf of the user but is NOT the user.`,
        },
      ],
      keyTakeaways: [
        "Resource Owner (user) owns protected resources and grants access",
        "Client (application) requests access on behalf of the user",
        "Authorization Server authenticates users and issues tokens",
        "Resource Server hosts protected APIs and validates tokens",
        "These roles interact through standardized endpoints and flows",
      ],
    },
    {
      id: "authorization-code-flow",
      title: "Authorization Code Flow with PKCE",
      slug: "authorization-code-flow",
      description:
        "Learn the most secure OAuth flow for web and mobile apps, enhanced with PKCE for public clients.",
      duration: 30,
      order: 2,
      content: [
        {
          type: "text",
          content: `# Authorization Code Flow with PKCE

The **Authorization Code Flow** is the most secure and widely used OAuth 2.0 flow. Enhanced with **PKCE (Proof Key for Code Exchange)**, it's suitable for both server-side web apps and public clients like mobile apps and SPAs.`,
        },
        {
          type: "text",
          title: "Why Authorization Code Flow?",
          content: `**Security Benefits:**
1. **Access token never exposed to browser**: Only authorization code passes through browser
2. **Client authentication**: Confidential clients prove identity with client secret
3. **PKCE prevents interception**: Protects public clients from authorization code theft

**Before PKCE:**
Mobile apps couldn't securely use this flow (no client secret). They used Implicit Flow, which exposed access tokens in URLs.

**After PKCE (RFC 7636, 2015):**
Public clients can use Authorization Code Flow securely without client secrets.`,
        },
        {
          type: "text",
          title: "PKCE: Proof Key for Code Exchange",
          content: `PKCE adds cryptographic proof to prevent authorization code interception attacks.

**The Attack (without PKCE):**
1. Malicious app observes authorization code in redirect
2. Malicious app exchanges code for token (no secret required for public clients)
3. Malicious app steals user's access token

**PKCE Solution:**
1. Client generates random **code_verifier** (43-128 characters)
2. Client creates **code_challenge** = SHA256(code_verifier)
3. Client sends code_challenge with auth request
4. Authorization Server stores code_challenge with the code
5. Client sends code_verifier when exchanging code for token
6. Authorization Server verifies: SHA256(code_verifier) === code_challenge

**Result:** Only the original client that started the flow can complete it.`,
        },
        {
          type: "code",
          title: "Step 1: Generate PKCE Values",
          language: "typescript",
          content: `// Generate PKCE code verifier and challenge
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

function base64URLEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
}

// Example usage
const codeVerifier = generateCodeVerifier();
const codeChallenge = await generateCodeChallenge(codeVerifier);

console.log('Code Verifier:', codeVerifier);
// Output: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"

console.log('Code Challenge:', codeChallenge);
// Output: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"`,
        },
        {
          type: "code",
          title: "Step 2: Authorization Request",
          language: "typescript",
          content: `// Redirect user to authorization endpoint
const authParams = new URLSearchParams({
  response_type: 'code',
  client_id: 'your-client-id',
  redirect_uri: 'https://yourapp.com/callback',
  scope: 'openid profile email read:data',
  state: generateRandomState(), // CSRF protection
  code_challenge: codeChallenge,
  code_challenge_method: 'S256', // SHA-256
});

const authUrl = \`https://auth.example.com/oauth/authorize?\${authParams}\`;

// Redirect user
window.location.href = authUrl;

// User sees login screen and consent dialog
// After approval, redirected to:
// https://yourapp.com/callback?code=AUTH_CODE&state=STATE_VALUE`,
        },
        {
          type: "code",
          title: "Step 3: Token Exchange",
          language: "typescript",
          content: `// Handle callback and exchange code for tokens
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Verify state parameter (CSRF protection)
  if (state !== expectedState) {
    return res.status(400).send('Invalid state');
  }

  // Exchange authorization code for tokens
  const tokenResponse = await fetch('https://auth.example.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://yourapp.com/callback',
      client_id: 'your-client-id',
      // For confidential clients: include client_secret
      // client_secret: 'your-client-secret',
      code_verifier: codeVerifier, // PKCE verification
    }),
  });

  const tokens = await tokenResponse.json();
  /*
  {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "v1.MRrtPcZt...",
    "scope": "openid profile email read:data",
    "id_token": "eyJhbGciOiJSUzI1NiIs..." // if OIDC
  }
  */

  // Store tokens securely
  storeTokensSecurely(tokens);

  res.redirect('/dashboard');
});`,
        },
        {
          type: "diagram",
          title: "Complete Authorization Code Flow with PKCE",
          content: `sequenceDiagram
    participant User
    participant App as Client App
    participant AS as Authorization Server
    participant API as Resource Server

    App->>App: Generate code_verifier & code_challenge
    App->>AS: GET /authorize<br/>?code_challenge=CHALLENGE<br/>&code_challenge_method=S256<br/>&client_id=...&scope=...
    AS->>User: Show login page
    User->>AS: Enter credentials
    AS->>User: Show consent screen
    User->>AS: Approve scopes
    AS->>AS: Store code_challenge with auth code
    AS->>App: Redirect with authorization code
    App->>AS: POST /token<br/>code=AUTH_CODE<br/>code_verifier=VERIFIER<br/>client_id=...
    AS->>AS: Verify SHA256(code_verifier) === code_challenge
    AS->>App: Return access_token + refresh_token
    App->>API: GET /api/resource<br/>Authorization: Bearer ACCESS_TOKEN
    API->>API: Validate token
    API->>App: Return protected resource`,
          caption: "Complete OAuth 2.0 authorization code flow with PKCE protection from start to API access"
        },
        {
          type: "text",
          title: "Security Best Practices",
          content: `**Always Use PKCE:**
Even for confidential clients, PKCE adds defense-in-depth against code interception.

**State Parameter:**
Protects against CSRF attacks. Generate a random value, store it in session, and verify it matches on callback.

**Nonce (OIDC):**
For ID Tokens, include a nonce in the auth request and verify it in the returned ID Token to prevent replay attacks.

**Validate Redirect URIs:**
Authorization Servers must strictly validate redirect_uri against pre-registered values. Attackers exploit loose validation to steal codes.

**Short-Lived Authorization Codes:**
Codes should expire in seconds (typically 60s) and be single-use only.

**Token Storage:**
- **Web apps**: Store tokens server-side in encrypted sessions
- **Mobile apps**: Use secure storage (Keychain on iOS, Keystore on Android)
- **SPAs**: Store in memory, not localStorage (XSS risk)`,
        },
      ],
      keyTakeaways: [
        "Authorization Code Flow is the most secure OAuth flow",
        "PKCE protects public clients from authorization code interception",
        "Access tokens never pass through the browser (only auth codes)",
        "State parameter prevents CSRF attacks",
        "Always validate redirect URIs strictly on the server",
      ],
      prerequisites: ["oauth-roles"],
    },
    {
      id: "client-credentials",
      title: "Client Credentials Flow: Machine-to-Machine",
      slug: "client-credentials",
      description:
        "Implement server-to-server authentication without user involvement for backend services and APIs.",
      duration: 20,
      order: 3,
      content: [
        {
          type: "text",
          content: `# Client Credentials Flow: Machine-to-Machine

The **Client Credentials Flow** enables machine-to-machine (M2M) authentication where no user is involved. It's designed for backend services, daemons, and CLIs that need to access APIs with their own identity.`,
        },
        {
          type: "text",
          title: "When to Use Client Credentials",
          content: `**Use Cases:**
- **Backend Service Communication**: Microservice A calls Microservice B
- **Scheduled Jobs**: Cron job fetching data from an API
- **CLI Tools**: Developer tool authenticating to deploy infrastructure
- **System Integrations**: CRM syncing data with email service

**Key Characteristic**: No user context. The client acts on its own behalf, not on behalf of a user.

**NOT Suitable For:**
- User-facing applications
- Mobile apps
- SPAs
- Any scenario requiring user consent`,
        },
        {
          type: "code",
          title: "Client Credentials Request",
          language: "typescript",
          content: `// Request access token using client credentials
async function getAccessToken() {
  const tokenResponse = await fetch('https://auth.example.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Basic authentication with client_id and client_secret
      'Authorization': 'Basic ' + btoa(\`\${CLIENT_ID}:\${CLIENT_SECRET}\`),
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'read:users write:logs', // Requested permissions
    }),
  });

  const tokens = await tokenResponse.json();
  /*
  {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "read:users write:logs"
  }
  */

  return tokens.access_token;
}

// Use the token to call an API
async function callAPI() {
  const accessToken = await getAccessToken();

  const response = await fetch('https://api.example.com/users', {
    headers: {
      'Authorization': \`Bearer \${accessToken}\`,
    },
  });

  return response.json();
}`,
        },
        {
          type: "diagram",
          title: "Client Credentials Flow Diagram",
          content: `sequenceDiagram
    participant Service as Backend Service
    participant AS as Authorization Server
    participant API as Resource Server

    Service->>AS: POST /token<br/>grant_type=client_credentials<br/>client_id=...<br/>client_secret=...
    AS->>AS: Validate client credentials
    AS->>Service: Return access_token
    Service->>API: GET /resource<br/>Authorization: Bearer ACCESS_TOKEN
    API->>API: Validate token (audience, scope)
    API->>Service: Return protected resource`,
          caption: "Machine-to-machine OAuth 2.0 client credentials flow without user involvement"
        },
        {
          type: "text",
          title: "Security Considerations",
          content: `**Client Secret Protection:**
The client secret is the only credential. If leaked, anyone can obtain access tokens.

**Best Practices:**
1. **Environment Variables**: Never hardcode secrets
2. **Secret Rotation**: Regularly rotate client secrets
3. **Secret Managers**: Use AWS Secrets Manager, Azure Key Vault, HashiCorp Vault
4. **Least Privilege**: Request only necessary scopes
5. **Network Security**: Use mTLS for additional client authentication

**Example: Using Environment Variables**
\`\`\`typescript
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('OAuth credentials not configured');
}
\`\`\`

**Token Caching:**
Client credentials tokens don't contain user context, so they can be cached and reused until expiration:

\`\`\`typescript
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // Fetch new token
  const response = await fetch('https://auth.example.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(\`\${CLIENT_ID}:\${CLIENT_SECRET}\`),
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'api:access',
    }),
  });

  const data = await response.json();

  // Cache token with buffer time before expiration
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 60s buffer
  };

  return cachedToken.token;
}
\`\`\``,
        },
        {
          type: "text",
          title: "Alternative: Mutual TLS (mTLS)",
          content: `For high-security environments, **mTLS** provides certificate-based client authentication:

1. Client presents X.509 certificate during TLS handshake
2. Authorization Server validates certificate against trusted CA
3. No client secret needed (certificate is the credential)

**Benefits:**
- Stronger than shared secrets
- Certificate rotation via PKI infrastructure
- Non-repudiation (cryptographic proof of client identity)

**OAuth 2.0 Mutual-TLS Client Authentication (RFC 8705)** standardizes this approach.`,
        },
      ],
      keyTakeaways: [
        "Client Credentials Flow is for machine-to-machine authentication",
        "No user involvement; client acts on its own behalf",
        "Client secret must be protected like a password",
        "Tokens can be cached until expiration (no user context)",
        "Use secret managers and rotate credentials regularly",
      ],
      prerequisites: ["authorization-code-flow"],
    },
    {
      id: "device-code-flow",
      title: "Device Code Flow: Input-Constrained Devices",
      slug: "device-code-flow",
      description:
        "Authenticate users on devices without easy text input like smart TVs, IoT devices, and gaming consoles.",
      duration: 15,
      order: 4,
      content: [
        {
          type: "text",
          content: `# Device Code Flow: Input-Constrained Devices

The **Device Code Flow (RFC 8628)** solves authentication for devices that lack easy text input or a web browser, such as smart TVs, streaming devices, and IoT gadgets.`,
        },
        {
          type: "text",
          title: "The Problem",
          content: `Entering complex passwords with a TV remote is painful. Devices like:
- **Smart TVs** (Netflix, YouTube apps)
- **Streaming Devices** (Roku, Apple TV, Chromecast)
- **Game Consoles** (PlayStation, Xbox)
- **IoT Devices** (smart speakers, printers)

These devices need OAuth authentication but can't easily collect credentials.`,
        },
        {
          type: "text",
          title: "The Solution: Device Code Flow",
          content: `**User Experience:**
1. TV app displays: "Go to https://example.com/device and enter code: **A1B2-C3D4**"
2. User opens their phone/computer browser
3. User visits the URL and enters the code
4. User authenticates and approves
5. TV app automatically logs in

**No credential entry on the device itself.**`,
        },
        {
          type: "code",
          title: "Step 1: Device Requests Code",
          language: "typescript",
          content: `// Device (TV app) initiates flow
async function initiateDeviceFlow() {
  const response = await fetch('https://auth.example.com/oauth/device/code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: 'smart-tv-app',
      scope: 'profile email video:stream',
    }),
  });

  const data = await response.json();
  /*
  {
    "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
    "user_code": "A1B2-C3D4",
    "verification_uri": "https://example.com/device",
    "verification_uri_complete": "https://example.com/device?code=A1B2-C3D4",
    "expires_in": 1800,
    "interval": 5
  }
  */

  return data;
}

// Display to user
const deviceFlow = await initiateDeviceFlow();
console.log(\`Go to \${deviceFlow.verification_uri}\`);
console.log(\`Enter code: \${deviceFlow.user_code}\`);
// Optionally show QR code with verification_uri_complete`,
        },
        {
          type: "code",
          title: "Step 2: Device Polls for Token",
          language: "typescript",
          content: `// Device polls authorization server for token
async function pollForToken(deviceCode: string, interval: number) {
  while (true) {
    await sleep(interval * 1000); // Wait before polling

    const response = await fetch('https://auth.example.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: deviceCode,
        client_id: 'smart-tv-app',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Success! User approved
      return data.access_token;
    }

    if (data.error === 'authorization_pending') {
      // User hasn't approved yet, continue polling
      continue;
    }

    if (data.error === 'slow_down') {
      // We're polling too fast, increase interval
      interval += 5;
      continue;
    }

    if (data.error === 'expired_token') {
      throw new Error('Device code expired');
    }

    if (data.error === 'access_denied') {
      throw new Error('User denied access');
    }

    throw new Error(\`Unexpected error: \${data.error}\`);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}`,
        },
        {
          type: "diagram",
          title: "Device Code Flow - Complete Sequence",
          content: `sequenceDiagram
    participant Device as Smart TV
    participant AS as Authorization Server
    participant User
    participant Browser as User's Browser

    Device->>AS: POST /device/code<br/>(client_id, scope)
    AS->>Device: device_code, user_code,<br/>verification_uri
    Device->>User: Display: "Visit example.com/device<br/>Enter code: A1B2-C3D4"

    loop Polling
        Device->>AS: POST /token<br/>(device_code)
        AS->>Device: authorization_pending
    end

    User->>Browser: Opens verification_uri
    Browser->>AS: Navigate to activation page
    AS->>Browser: Show code entry form
    User->>Browser: Enter user_code
    Browser->>AS: Submit code
    AS->>User: Authenticate (if needed)
    AS->>User: Show consent screen
    User->>AS: Approve scopes
    AS->>AS: Mark device_code as authorized

    Device->>AS: POST /token<br/>(device_code)
    AS->>Device: access_token + refresh_token
    Device->>User: "Login successful!"`,
          caption: "Device code flow showing simultaneous device polling and user authorization on a separate device"
        },
        {
          type: "text",
          title: "Security Considerations",
          content: `**User Code Properties:**
- Short (6-8 characters)
- Easy to type (avoid ambiguous characters: O vs 0, I vs 1)
- Case-insensitive
- Time-limited (typically 15-30 minutes)

**Polling Best Practices:**
- Respect the \`interval\` parameter (typically 5 seconds)
- Handle \`slow_down\` errors by increasing interval
- Stop polling after code expiration
- Don't hammer the server (leads to rate limiting)

**UX Improvements:**
- Display QR code with \`verification_uri_complete\` for easier mobile scanning
- Show countdown timer for code expiration
- Animate polling state (e.g., "Waiting for approval...")

**Attack Mitigation:**
- Device codes must be single-use
- Short expiration windows
- Rate limiting on code verification endpoint
- Optional: Require device code + client secret for confidential clients`,
        },
      ],
      keyTakeaways: [
        "Device Code Flow enables authentication on input-constrained devices",
        "User enters a short code on a separate device (phone/computer)",
        "Device polls the authorization server until user approves",
        "Common on smart TVs, streaming devices, and IoT",
        "Respect polling intervals and handle error codes properly",
      ],
      prerequisites: ["client-credentials"],
    },
    {
      id: "token-lifecycle",
      title: "Token Lifecycle: Introspection and Revocation",
      slug: "token-lifecycle",
      description:
        "Manage the complete lifecycle of tokens from issuance through refresh to revocation.",
      duration: 25,
      order: 5,
      content: [
        {
          type: "text",
          content: `# Token Lifecycle: Introspection and Revocation

Tokens aren't just issued and forgotten. Managing their complete lifecycle—validation, refresh, introspection, and revocation—is essential for security and compliance.`,
        },
        {
          type: "text",
          title: "Token Lifecycle Stages",
          content: `**1. Issuance**: Authorization server creates and signs token
**2. Use**: Resource server validates and accepts token
**3. Refresh**: Client exchanges refresh token for new access token
**4. Introspection**: Server checks token status and metadata
**5. Revocation**: Token is explicitly invalidated before expiration
**6. Expiration**: Token naturally expires based on \`exp\` claim`,
        },
        {
          type: "text",
          title: "Token Introspection (RFC 7662)",
          content: `**Introspection** allows resource servers to query the authorization server about a token's current state.

**Why Introspect?**
- **Opaque Tokens**: If tokens aren't JWTs, you need to ask the AS about them
- **Real-Time Status**: Check if token was revoked (JWT expiration isn't enough)
- **Metadata Retrieval**: Get scope, client_id, user info associated with token

**Introspection Endpoint:**
\`\`\`
POST /oauth/introspect
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

token=ACCESS_TOKEN_HERE
\`\`\``        },
        {
          type: "code",
          title: "Introspection Request Example",
          language: "typescript",
          content: `// Resource server introspects a token
async function introspectToken(token: string) {
  const response = await fetch('https://auth.example.com/oauth/introspect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(\`\${RS_CLIENT_ID}:\${RS_CLIENT_SECRET}\`),
    },
    body: new URLSearchParams({ token }),
  });

  const result = await response.json();
  /*
  {
    "active": true,
    "scope": "read:profile write:posts",
    "client_id": "mobile-app-xyz",
    "username": "john.doe",
    "token_type": "Bearer",
    "exp": 1672531200,
    "iat": 1672527600,
    "sub": "user-12345",
    "aud": "https://api.example.com"
  }
  */

  return result;
}

// Middleware to validate token via introspection
async function validateTokenMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const introspection = await introspectToken(token);

  if (!introspection.active) {
    return res.status(401).json({ error: 'Token is not active' });
  }

  // Check required scope
  const scopes = introspection.scope.split(' ');
  if (!scopes.includes('read:data')) {
    return res.status(403).json({ error: 'Insufficient scope' });
  }

  req.user = { sub: introspection.sub, scopes };
  next();
}`,
        },
        {
          type: "text",
          title: "Token Revocation (RFC 7009)",
          content: `**Revocation** explicitly invalidates a token before its natural expiration.

**When to Revoke:**
- User logs out
- User revokes app access
- Security incident (compromised token)
- User changes password
- Account deactivation

**Revocation Endpoint:**
\`\`\`
POST /oauth/revoke
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

token=TOKEN_TO_REVOKE
token_type_hint=access_token (or refresh_token)
\`\`\`

**What Gets Revoked:**
- **Revoking access token**: Invalidates just that token
- **Revoking refresh token**: Invalidates refresh token AND all associated access tokens

This creates a token family relationship where revoking the "parent" refresh token cascades to "children" access tokens.`,
        },
        {
          type: "code",
          title: "Token Revocation Example",
          language: "typescript",
          content: `// Client revokes token on logout
async function logout(tokens: { accessToken: string; refreshToken: string }) {
  // Revoke refresh token (cascades to access tokens)
  await fetch('https://auth.example.com/oauth/revoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(\`\${CLIENT_ID}:\${CLIENT_SECRET}\`),
    },
    body: new URLSearchParams({
      token: tokens.refreshToken,
      token_type_hint: 'refresh_token',
    }),
  });

  // Clear local token storage
  clearTokens();

  console.log('Logged out successfully');
}

// Handling revoked tokens on API
app.get('/api/data', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  // Option 1: Introspect token (checks revocation status)
  const introspection = await introspectToken(token);
  if (!introspection.active) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  // Option 2: Check against revocation list (if maintaining one)
  if (isTokenRevoked(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  res.json({ data: 'protected resource' });
});`,
        },
        {
          type: "text",
          title: "Refresh Token Rotation",
          content: `**Refresh Token Rotation** improves security by issuing a new refresh token each time it's used.

**Flow:**
1. Client uses Refresh Token A to get new access token
2. Authorization server returns: new access token + **new Refresh Token B**
3. Client discards Refresh Token A, stores Refresh Token B
4. Next refresh: use Refresh Token B, receive Refresh Token C
5. Repeat...

**Security Benefits:**
- **Limits blast radius**: Stolen refresh token has short window before rotation
- **Detects theft**: If Token A is used after Token B was issued → potential theft detected
- **Automatic revocation**: Token reuse triggers revocation of entire family

**Implementation:**
\`\`\`typescript
// Authorization server issues new refresh token
app.post('/oauth/token', async (req, res) => {
  const { grant_type, refresh_token } = req.body;

  if (grant_type === 'refresh_token') {
    // Validate refresh token
    const tokenData = await validateRefreshToken(refresh_token);

    if (!tokenData) {
      return res.status(401).json({ error: 'invalid_grant' });
    }

    // Check if token was already used (potential theft)
    if (tokenData.used) {
      // Revoke entire token family
      await revokeTokenFamily(tokenData.familyId);
      return res.status(401).json({ error: 'token_reuse_detected' });
    }

    // Mark current token as used
    await markTokenAsUsed(refresh_token);

    // Issue new tokens with rotation
    const newAccessToken = generateAccessToken(tokenData.userId);
    const newRefreshToken = generateRefreshToken(tokenData.userId, tokenData.familyId);

    res.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_in: 3600,
      token_type: 'Bearer',
    });
  }
});
\`\`\``,
        },
        {
          type: "text",
          title: "Token Expiration Best Practices",
          content: `**Access Token Lifetimes:**
- **Standard Web/Mobile**: 15-60 minutes
- **High Security**: 5-15 minutes
- **Low Risk APIs**: 1-2 hours

**Refresh Token Lifetimes:**
- **Web Apps**: 30-90 days
- **Mobile Apps**: 90 days to 1 year
- **High Security**: 7-14 days with rotation

**Absolute vs Sliding Expiration:**
- **Absolute**: Refresh token expires at fixed time (e.g., 90 days from issuance)
- **Sliding**: Expiration extends on each use (e.g., 30 days of inactivity)

**Balancing Act:**
- Shorter lifetimes = more secure, worse UX
- Longer lifetimes = better UX, more risk
- Solution: Short access tokens + long refresh tokens + rotation`,
        },
      ],
      keyTakeaways: [
        "Introspection checks real-time token status and metadata",
        "Revocation explicitly invalidates tokens before expiration",
        "Revoking refresh tokens cascades to associated access tokens",
        "Refresh token rotation limits exposure from theft",
        "Balance token lifetimes between security and user experience",
      ],
      prerequisites: ["device-code-flow"],
    },
    {
      id: "oauth-security",
      title: "OAuth 2.0 Security Pitfalls",
      slug: "oauth-security",
      description:
        "Identify and prevent common OAuth security vulnerabilities including replay attacks, token leakage, and redirect URI manipulation.",
      duration: 25,
      order: 6,
      content: [
        {
          type: "text",
          content: `# OAuth 2.0 Security Pitfalls

While OAuth 2.0 is powerful, it's also complex. Misconfigurations and implementation flaws can lead to serious security vulnerabilities. Understanding these pitfalls is essential for secure deployments.`,
        },
        {
          type: "text",
          title: "1. Redirect URI Manipulation",
          content: `**The Attack:**
Attacker manipulates the redirect_uri parameter to send the authorization code to their own server.

**Vulnerable Flow:**
\`\`\`
https://auth.example.com/authorize?
  client_id=legitimate-app&
  redirect_uri=https://attacker.com/steal&  ← Attacker-controlled!
  response_type=code
\`\`\`

If the authorization server doesn't validate redirect URIs, the code is sent to the attacker.

**Prevention:**
1. **Pre-register redirect URIs**: Store allowed URIs during client registration
2. **Exact match validation**: Don't use substring or regex matching
3. **No wildcard domains**: \`*.example.com\` is dangerous
4. **HTTPS only**: Except \`localhost\` for development

**Secure Configuration:**
\`\`\`json
{
  "client_id": "abc123",
  "redirect_uris": [
    "https://app.example.com/callback",
    "myapp://callback"
  ]
}
\`\`\`

**Server Validation:**
\`\`\`typescript
function validateRedirectUri(providedUri: string, registeredUris: string[]) {
  // Exact match only - no substring or pattern matching
  return registeredUris.includes(providedUri);
}
\`\`\``,
        },
        {
          type: "text",
          title: "2. Authorization Code Replay Attack",
          content: `**The Attack:**
Attacker intercepts authorization code and uses it before the legitimate client.

**Without PKCE:**
1. User authenticates, code sent to legitimate app
2. Attacker intercepts code (network sniffing, browser history)
3. Attacker exchanges code for token
4. Attacker gains access to user's account

**Prevention:**
1. **Use PKCE**: Code verifier proves client that started flow is completing it
2. **Single-use codes**: Mark code as used after first exchange
3. **Short expiration**: Codes expire in 60 seconds
4. **TLS/HTTPS**: Prevent interception in transit

**Detection:**
\`\`\`typescript
async function exchangeCode(code: string) {
  const codeRecord = await db.getAuthCode(code);

  if (!codeRecord) {
    throw new Error('Invalid authorization code');
  }

  if (codeRecord.used) {
    // Code reuse detected - potential attack
    await revokeAllTokensForClient(codeRecord.clientId);
    throw new Error('Authorization code already used');
  }

  if (Date.now() > codeRecord.expiresAt) {
    throw new Error('Authorization code expired');
  }

  // Mark as used
  await db.markCodeAsUsed(code);

  return generateTokens(codeRecord);
}
\`\`\``,
        },
        {
          type: "text",
          title: "3. Token Leakage via Referrer Header",
          content: `**The Attack:**
Access tokens in URLs leak through Referer headers when users click external links.

**Vulnerable (Implicit Flow - Deprecated):**
\`\`\`
https://app.example.com/callback#access_token=SECRET_TOKEN
\`\`\`

User clicks external link:
\`\`\`html
<a href="https://external-site.com">Click here</a>
\`\`\`

Referer header sent to external site:
\`\`\`
Referer: https://app.example.com/callback#access_token=SECRET_TOKEN
\`\`\`

**Why Implicit Flow is Deprecated:**
Tokens in URL fragments are logged in browser history, analytics, and leak via Referer headers.

**Solution: Use Authorization Code Flow**
Tokens never appear in URLs. Only authorization codes (single-use, short-lived) are in URLs.

**Additional Protection:**
\`\`\`html
<!-- Prevent Referer header leakage -->
<meta name="referrer" content="no-referrer">

<!-- Or selectively for external links -->
<a href="https://external.com" rel="noreferrer">External Link</a>
\`\`\``,
        },
        {
          type: "text",
          title: "4. Cross-Site Request Forgery (CSRF)",
          content: `**The Attack:**
Attacker tricks victim into completing an OAuth flow that links attacker's account.

**Attack Flow:**
1. Attacker initiates OAuth flow, gets authorization code
2. Attacker stops before completing token exchange
3. Attacker sends callback URL with their code to victim
4. Victim clicks link, code is exchanged, victim's session links to attacker's account

**Consequence:**
Victim unknowingly links their app account to attacker's OAuth identity. Attacker can now access victim's data.

**Prevention: State Parameter**
\`\`\`typescript
// Step 1: Generate random state before redirect
const state = crypto.randomBytes(32).toString('hex');
await storeStateInSession(state);

const authUrl = \`https://auth.example.com/authorize?
  client_id=\${CLIENT_ID}&
  redirect_uri=\${REDIRECT_URI}&
  state=\${state}&
  response_type=code\`;

res.redirect(authUrl);

// Step 2: Validate state on callback
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const expectedState = await getStateFromSession();

  if (state !== expectedState) {
    return res.status(400).send('CSRF attack detected: state mismatch');
  }

  // Proceed with token exchange
  const tokens = await exchangeCode(code);
  res.redirect('/dashboard');
});
\`\`\``,
        },
        {
          type: "text",
          title: "5. Insufficient Scope Validation",
          content: `**The Attack:**
API doesn't validate scopes in access tokens, allowing unauthorized actions.

**Vulnerable API:**
\`\`\`typescript
app.delete('/api/users/:id', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.verify(token, publicKey);

  // BUG: No scope check!
  await deleteUser(req.params.id);
  res.json({ success: true });
});
\`\`\`

Attacker with \`read:users\` scope can call this endpoint because it doesn't check for \`delete:users\`.

**Secure API:**
\`\`\`typescript
function requireScope(requiredScope: string) {
  return (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = jwt.verify(token, publicKey);

    const scopes = decoded.scope?.split(' ') || [];

    if (!scopes.includes(requiredScope)) {
      return res.status(403).json({
        error: 'insufficient_scope',
        required_scope: requiredScope,
      });
    }

    req.user = decoded;
    next();
  };
}

app.delete('/api/users/:id', requireScope('delete:users'), async (req, res) => {
  await deleteUser(req.params.id);
  res.json({ success: true });
});
\`\`\``,
        },
        {
          type: "text",
          title: "6. Client Impersonation",
          content: `**The Attack:**
Public client (mobile app) impersonates another client by using stolen client_id.

**Scenario:**
1. Attacker extracts \`client_id\` from legitimate mobile app
2. Attacker builds malicious app with same \`client_id\`
3. Users authenticate via attacker's app
4. Attacker intercepts tokens

**Prevention: PKCE + Dynamic Client Registration**

**PKCE** prevents code interception even if client_id is known.

**Dynamic Client Registration (RFC 7591):**
Instead of static client_id, apps register at runtime and receive unique credentials per installation.

**Additional: App Attestation**
- iOS: App Attest API
- Android: Play Integrity API

These prove the client is the legitimate app binary, not a modified/fake version.`,
        },
        {
          type: "text",
          title: "Security Checklist",
          content: `**Authorization Server:**
- ✓ Validate redirect URIs (exact match, pre-registered)
- ✓ Enforce PKCE for public clients
- ✓ Single-use authorization codes
- ✓ Short code expiration (60 seconds)
- ✓ Require HTTPS for all endpoints
- ✓ Implement rate limiting
- ✓ Support token revocation
- ✓ Rotate refresh tokens

**Client Application:**
- ✓ Use Authorization Code Flow with PKCE
- ✓ Never use Implicit Flow (deprecated)
- ✓ Validate state parameter (CSRF protection)
- ✓ Store tokens securely (not localStorage for SPAs)
- ✓ Use short-lived access tokens
- ✓ Implement token refresh logic
- ✓ Revoke tokens on logout
- ✓ Don't log tokens or include in error messages

**Resource Server (API):**
- ✓ Validate token signature
- ✓ Check expiration (\`exp\` claim)
- ✓ Verify audience (\`aud\` claim)
- ✓ Enforce scope requirements
- ✓ Use introspection for opaque tokens
- ✓ Implement rate limiting
- ✓ Log access for auditing`,
        },
      ],
      keyTakeaways: [
        "Always validate redirect URIs with exact matching",
        "Use PKCE to prevent authorization code interception",
        "Never put tokens in URLs (use Authorization Code Flow, not Implicit)",
        "Validate state parameter to prevent CSRF attacks",
        "APIs must check both token validity AND required scopes",
      ],
      prerequisites: ["token-lifecycle"],
    },
  ],
  quiz: {
    id: "oauth2-quiz",
    moduleId: "oauth2-core",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        question: "What are the four roles defined in OAuth 2.0?",
        options: [
          "User, Application, Database, Server",
          "Resource Owner, Client, Authorization Server, Resource Server",
          "Frontend, Backend, API, IdP",
          "Admin, User, Guest, System",
        ],
        correctAnswer: 1,
        explanation:
          "OAuth 2.0 defines four roles: Resource Owner (user), Client (application), Authorization Server (issues tokens), and Resource Server (hosts protected APIs).",
        difficulty: "beginner",
        relatedLessonId: "oauth-roles",
      },
      {
        id: "q2",
        question: "What does PKCE stand for and what problem does it solve?",
        options: [
          "Public Key Cryptography Extension - encrypts tokens",
          "Proof Key for Code Exchange - prevents authorization code interception",
          "Private Key Certificate Exchange - validates client identity",
          "Protected Key Code Encryption - secures refresh tokens",
        ],
        correctAnswer: 1,
        explanation:
          "PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks by requiring the client to prove it initiated the OAuth flow. It uses a code verifier and code challenge.",
        difficulty: "intermediate",
        relatedLessonId: "authorization-code-flow",
      },
      {
        id: "q3",
        question: "When should you use the Client Credentials Flow?",
        options: [
          "For user-facing web applications",
          "For mobile apps requiring user authentication",
          "For machine-to-machine communication without user context",
          "For single-page applications (SPAs)",
        ],
        correctAnswer: 2,
        explanation:
          "Client Credentials Flow is designed for machine-to-machine authentication where no user is involved, such as backend services, daemons, or scheduled jobs.",
        difficulty: "beginner",
        relatedLessonId: "client-credentials",
      },
      {
        id: "q4",
        question: "What is the primary purpose of the Device Code Flow?",
        options: [
          "To authenticate servers",
          "To enable authentication on input-constrained devices like smart TVs",
          "To validate mobile app certificates",
          "To sync passwords across devices",
        ],
        correctAnswer: 1,
        explanation:
          "Device Code Flow enables authentication on devices without easy text input (smart TVs, IoT) by having users enter a code on a separate device like their phone or computer.",
        difficulty: "beginner",
        relatedLessonId: "device-code-flow",
      },
      {
        id: "q5",
        question: "What is the purpose of token introspection (RFC 7662)?",
        options: [
          "To encrypt access tokens",
          "To check a token's current status and metadata at the authorization server",
          "To compress tokens for faster transmission",
          "To convert JWT tokens to opaque tokens",
        ],
        correctAnswer: 1,
        explanation:
          "Token introspection allows resource servers to query the authorization server about a token's current state, including whether it's active, revoked, and what scopes/metadata it contains.",
        difficulty: "intermediate",
        relatedLessonId: "token-lifecycle",
      },
      {
        id: "q6",
        question: "What happens when you revoke a refresh token?",
        options: [
          "Only the refresh token is invalidated",
          "The refresh token and all associated access tokens are invalidated",
          "Nothing - refresh tokens cannot be revoked",
          "Only access tokens are invalidated",
        ],
        correctAnswer: 1,
        explanation:
          "Revoking a refresh token creates a cascading effect that invalidates both the refresh token and all access tokens issued from it, due to the token family relationship.",
        difficulty: "intermediate",
        relatedLessonId: "token-lifecycle",
      },
      {
        id: "q7",
        question: "Why is redirect URI validation critical for OAuth security?",
        options: [
          "It improves performance",
          "It prevents attackers from receiving authorization codes by manipulating the redirect_uri parameter",
          "It encrypts the authorization code",
          "It validates user passwords",
        ],
        correctAnswer: 1,
        explanation:
          "Strict redirect URI validation prevents attackers from manipulating the redirect_uri parameter to send authorization codes to attacker-controlled servers. URIs must be pre-registered and validated with exact matching.",
        difficulty: "intermediate",
        relatedLessonId: "oauth-security",
      },
      {
        id: "q8",
        question: "What is the purpose of the 'state' parameter in OAuth 2.0?",
        options: [
          "To store user session data",
          "To prevent Cross-Site Request Forgery (CSRF) attacks",
          "To encrypt the authorization code",
          "To specify which US state the user is from",
        ],
        correctAnswer: 1,
        explanation:
          "The state parameter prevents CSRF attacks by providing a random value that must match between the authorization request and callback, ensuring the callback is in response to a request from the same client.",
        difficulty: "intermediate",
        relatedLessonId: "oauth-security",
      },
      {
        id: "q9",
        question: "Why is the Implicit Flow deprecated and should not be used?",
        options: [
          "It's too slow",
          "Access tokens are exposed in URLs, leading to leakage via browser history and Referer headers",
          "It doesn't support mobile apps",
          "It requires too many API calls",
        ],
        correctAnswer: 1,
        explanation:
          "Implicit Flow is deprecated because access tokens appear in URL fragments, which are logged in browser history, leak via Referer headers, and can be intercepted. Authorization Code Flow with PKCE is now recommended instead.",
        difficulty: "intermediate",
        relatedLessonId: "oauth-security",
      },
      {
        id: "q10",
        question: "What is refresh token rotation and why is it important?",
        options: [
          "Changing refresh token format every month",
          "Issuing a new refresh token each time the current one is used, limiting exposure from theft",
          "Backing up refresh tokens to multiple servers",
          "Encrypting refresh tokens differently each time",
        ],
        correctAnswer: 1,
        explanation:
          "Refresh token rotation issues a new refresh token each time one is used. This limits the window of exposure if a token is stolen and enables detection of token theft through reuse detection.",
        difficulty: "expert",
        relatedLessonId: "token-lifecycle",
      },
    ],
  },
  badge: {
    id: "badge-oauth2",
    name: "OAuth 2.0 Master",
    description: "Expert in OAuth flows, PKCE, token management, and security best practices",
    icon: "🔑",
    color: "beginner",
    moduleId: "oauth2-core",
  },
}
