import type { Module } from "@/types"

export const oidcModule: Module = {
  id: "oidc-core",
  title: "OpenID Connect: Authentication on OAuth 2.0",
  slug: "oidc",
  description: "Master OpenID Connect (OIDC), the authentication layer built on OAuth 2.0. Learn about ID Tokens, UserInfo endpoints, and how OIDC powers modern Single Sign-On.",
  difficulty: "intermediate",
  order: 3,
  estimatedHours: 4.5,
  prerequisites: ["oauth2-core"],
  learningObjectives: [
    "Understand the relationship between OAuth 2.0 and OpenID Connect",
    "Decode and validate ID Tokens (JWT structure)",
    "Use the UserInfo endpoint to retrieve user claims",
    "Implement OIDC flows (Authorization Code with OIDC)",
    "Leverage Discovery documents for dynamic configuration",
    "Distinguish between authentication and authorization use cases"
  ],
  lessons: [
    {
      id: "oidc-fundamentals",
      title: "OIDC Fundamentals: OAuth 2.0 vs OpenID Connect",
      slug: "oidc-fundamentals",
      duration: 25,
      content: [
        {
          type: "text",
          title: "The Authentication Gap in OAuth 2.0",
          content: `**OAuth 2.0 is an authorization framework**, designed to grant access to resources. It excels at delegating permissions but **does not standardize authentication** (proving who the user is).

**The Problem:**
Before OpenID Connect, developers had to build custom authentication on top of OAuth 2.0, leading to:
- Non-standard implementations
- Security vulnerabilities (token confusion, misuse of access tokens as identity proof)
- No interoperability between identity providers

**Real-World Example:**
Imagine using "Sign in with Google" on a website. You want:
1. **Authentication**: Prove you're john@gmail.com
2. **Authorization**: Grant the website access to your Google Calendar (optional)

OAuth 2.0 only standardizes #2. OpenID Connect (OIDC) adds #1 as a first-class feature.`
        },
        {
          type: "text",
          title: "What is OpenID Connect?",
          content: `**OpenID Connect (OIDC)** is a simple identity layer on top of the OAuth 2.0 protocol. It was finalized in 2014 by the OpenID Foundation.

**Key Characteristics:**
- **RESTful** (uses JSON over HTTP, unlike SAML's XML)
- **Built on OAuth 2.0** (reuses flows, endpoints, and terminology)
- **Standardized authentication** (consistent across all identity providers)
- **JWT-based** (ID Tokens are JSON Web Tokens)

**Official Specification:**
OpenID Connect Core 1.0 (https://openid.net/specs/openid-connect-core-1_0.html)

**OIDC = OAuth 2.0 + Authentication + ID Token**`
        },
        {
          type: "text",
          title: "How OIDC Extends OAuth 2.0",
          content: `**The 'openid' Scope:**
To trigger OIDC authentication, clients include **openid** in the authorization request scope:

\`\`\`
GET /authorize?
  response_type=code&
  client_id=my-app&
  redirect_uri=https://myapp.com/callback&
  scope=openid profile email&    ← Key addition
  state=xyz123
\`\`\`

**What Changes:**
1. **ID Token Issued**: Along with the access token, the authorization server issues an **ID Token** (a JWT containing user identity claims)
2. **UserInfo Endpoint**: A new endpoint for retrieving additional user claims
3. **Standard Claims**: Predefined claim names (sub, name, email, etc.)
4. **Discovery Endpoint**: A well-known URL for dynamic configuration`
        },
        {
          type: "text",
          title: "OAuth 2.0 vs. OpenID Connect Comparison",
          content: `| Feature | OAuth 2.0 | OpenID Connect (OIDC) |
|---------|-----------|----------------------|
| **Purpose** | Authorization (access delegation) | Authentication (identity verification) |
| **Primary Token** | Access Token (opaque or JWT) | ID Token (always JWT) |
| **Scope** | Custom scopes (e.g., read:calendar) | openid + profile, email, address, phone |
| **User Info** | No standard | UserInfo endpoint with standard claims |
| **Use Case** | API access, resource permissions | Login, SSO, user identity |
| **Example** | "Grant Dropbox access to my files" | "Sign in with Google" |

**Key Insight:**
OIDC **does not replace** OAuth 2.0. It's OAuth 2.0 **with authentication added**. Most OIDC flows also issue access tokens for API access.`
        },
        {
          type: "text",
          title: "Real-World OIDC Flow",
          content: `**Scenario:** User signs into a web app using "Sign in with Microsoft"

**Step-by-Step:**
1. **User Clicks "Sign in with Microsoft"**
   - App redirects to Microsoft's authorization endpoint with scope=openid profile email

2. **User Authenticates at Microsoft**
   - Microsoft verifies credentials (password, MFA, etc.)

3. **Authorization Code Issued**
   - Microsoft redirects back to app with authorization code

4. **Token Exchange**
   - App exchanges code for tokens at token endpoint
   - **Receives**: Access Token + **ID Token** + Refresh Token

5. **ID Token Validation**
   - App validates ID Token JWT signature
   - Extracts claims: sub (user ID), email, name, picture

6. **Session Established**
   - App creates login session for user
   - Optionally calls UserInfo endpoint for additional claims

**The ID Token proves authentication occurred.** The app now knows who the user is.`
        }
      ],
      keyTakeaways: [
        "OAuth 2.0 provides authorization; OpenID Connect adds authentication",
        "The 'openid' scope triggers OIDC authentication",
        "ID Tokens are JWTs containing identity claims (sub, email, name)",
        "OIDC reuses OAuth 2.0 flows but adds standardized identity features",
        "Use OIDC for login/SSO; use pure OAuth 2.0 for API access delegation"
      ]
    },
    {
      id: "id-tokens-jwt",
      title: "ID Tokens: Structure, Claims, and Validation",
      slug: "id-tokens-jwt",
      duration: 30,
      content: [
        {
          type: "text",
          title: "What is an ID Token?",
          content: `An **ID Token** is a **JSON Web Token (JWT)** that contains claims about the authentication event and the end-user.

**Key Characteristics:**
- **Always a JWT** (unlike access tokens, which can be opaque)
- **Issued by authorization server** alongside access tokens
- **Short-lived** (typically 5-60 minutes)
- **Signed** (always) and optionally **encrypted**
- **Consumed by client application** (not sent to resource servers)

**Purpose:**
The ID Token is proof that authentication occurred. It answers:
- **Who** is the user? (sub claim)
- **When** did they log in? (iat claim)
- **Where** was the token issued? (iss claim)
- **For whom** was it issued? (aud claim)`
        },
        {
          type: "code",
          title: "ID Token Structure (JWT)",
          language: "json",
          content: `// Header (Algorithm and Token Type)
{
  "alg": "RS256",    // RSA Signature with SHA-256
  "typ": "JWT",
  "kid": "abc123"    // Key ID for signature verification
}

// Payload (Claims about the user and authentication)
{
  // Standard OIDC Claims (required)
  "iss": "https://accounts.google.com",        // Issuer
  "sub": "10769150350006150715113082367",      // Subject (unique user ID)
  "aud": "my-client-id.apps.googleusercontent.com", // Audience
  "exp": 1708560000,                           // Expiration time (Unix timestamp)
  "iat": 1708556400,                           // Issued at time

  // Authentication-specific claims
  "auth_time": 1708556395,                     // When user authenticated
  "nonce": "n-0S6_WzA2Mj",                     // CSRF protection value
  "at_hash": "HK6E_P6Dh8Y93mRNtsDB1Q",         // Access token hash

  // User profile claims (if scope included 'profile' and 'email')
  "name": "John Doe",
  "email": "john.doe@example.com",
  "email_verified": true,
  "picture": "https://example.com/photo.jpg",
  "locale": "en-US"
}

// Signature (verifies token hasn't been tampered with)
// HMACSHA256(
//   base64UrlEncode(header) + "." + base64UrlEncode(payload),
//   public_key_from_jwks_endpoint
// )`
        },
        {
          type: "text",
          title: "Required vs. Optional Claims",
          content: `**Required Claims (MUST be present):**
- **iss** (Issuer): URL of the identity provider (e.g., https://accounts.google.com)
- **sub** (Subject): Unique identifier for the user at the issuer (never reassigned)
- **aud** (Audience): Client ID(s) this token was issued for
- **exp** (Expiration): Unix timestamp when token expires
- **iat** (Issued At): Unix timestamp when token was created

**Commonly Used Optional Claims:**
- **auth_time**: When user authenticated (useful for session management)
- **nonce**: Client-provided value to prevent replay attacks
- **at_hash**: Hash of access token (binds ID Token to access token)
- **azp** (Authorized Party): Client ID that requested the token (for multiple audiences)
- **acr** (Authentication Context Class Reference): Level of authentication (e.g., MFA)
- **amr** (Authentication Methods References): How user authenticated (e.g., ["pwd", "mfa"])

**Profile Claims** (if scope=profile):
name, given_name, family_name, middle_name, nickname, picture, website, gender, birthdate, zoneinfo, locale, updated_at

**Email Claims** (if scope=email):
email, email_verified

**Address Claim** (if scope=address):
address (JSON object with street_address, locality, region, postal_code, country)

**Phone Claims** (if scope=phone):
phone_number, phone_number_verified`
        },
        {
          type: "text",
          title: "ID Token Validation (Critical Security Step)",
          content: `**Why Validate?**
An attacker could create a fake ID Token. Validation ensures the token:
1. Came from the expected issuer
2. Was issued for your application
3. Hasn't expired
4. Hasn't been tampered with

**Validation Steps (MUST perform all):**

**1. Verify the signature using JWKS**
- Fetch public keys from issuer's JWKS endpoint (e.g., /.well-known/jwks.json)
- Use key matching the kid (Key ID) in token header
- Verify signature using RS256 (or algorithm from header)

**2. Validate issuer (iss claim)**
- Must match expected identity provider URL
- Example: "https://accounts.google.com"

**3. Validate audience (aud claim)**
- Must contain your client_id
- Reject if aud is for a different application

**4. Validate expiration (exp claim)**
- Current time must be before exp timestamp
- Add clock skew tolerance (typically 60 seconds)

**5. Validate nonce (if present)**
- Must match the nonce sent in authorization request
- Prevents replay attacks

**6. Validate at_hash (if access token received)**
- Hash access token and compare to at_hash claim
- Ensures ID Token and access token belong together

**7. Check auth_time (if max_age was requested)**
- User must have authenticated recently enough

**Security Warning:**
❌ **Never** trust an ID Token without validation
❌ **Never** use ID Tokens to authorize API requests (use access tokens)
✅ **Always** validate signatures using public keys from JWKS endpoint`
        },
        {
          type: "code",
          title: "ID Token Validation Example (Node.js)",
          language: "typescript",
          content: `import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Create JWKS client to fetch public keys
const client = jwksClient({
  jwksUri: 'https://accounts.google.com/.well-known/jwks.json',
  cache: true,
  rateLimit: true
});

// Function to get signing key
function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Validate ID Token
async function validateIdToken(idToken: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      getKey,
      {
        // Validation options
        issuer: 'https://accounts.google.com',        // Expected issuer
        audience: 'my-client-id.apps.googleusercontent.com', // Your client ID
        algorithms: ['RS256'],                         // Allowed algorithms
        clockTolerance: 60                             // 60 seconds clock skew
      },
      (err, decoded) => {
        if (err) return reject(err);

        // Additional custom validation
        const claims = decoded as any;

        // Validate nonce if present
        if (claims.nonce && claims.nonce !== expectedNonce) {
          return reject(new Error('Invalid nonce'));
        }

        // Validate auth_time if max_age was used
        if (maxAge && (Date.now() / 1000) - claims.auth_time > maxAge) {
          return reject(new Error('User authenticated too long ago'));
        }

        resolve(claims);
      }
    );
  });
}

// Usage
try {
  const claims = await validateIdToken(idToken);
  console.log('User authenticated:', claims.sub);
  console.log('Email:', claims.email);
} catch (error) {
  console.error('ID Token validation failed:', error);
}`
        },
        {
          type: "text",
          title: "ID Token vs. Access Token",
          content: `**Common Misconception:**
❌ "I can use the ID Token to call APIs"

**Reality:**
ID Tokens are **not** access tokens. Here's why:

| Aspect | ID Token | Access Token |
|--------|----------|--------------|
| **Purpose** | Prove authentication occurred | Authorize API requests |
| **Audience** | Client application | Resource server (API) |
| **Contains** | User identity claims | Permissions/scopes |
| **Validated By** | Client application | Resource server |
| **Sent To** | Never leaves client | Sent to APIs in Authorization header |
| **Format** | Always JWT | Opaque or JWT |
| **Lifetime** | Short (5-60 min) | Longer (1-24 hours) |

**Best Practice:**
✅ Use ID Tokens to establish user sessions in your application
✅ Use access tokens to call APIs on behalf of the user
✅ Store ID Token claims in session, don't send ID Tokens to backends`
        }
      ],
      keyTakeaways: [
        "ID Tokens are JWTs containing authentication and identity claims",
        "The 'sub' claim is the unique, immutable user identifier",
        "Always validate ID Token signatures using JWKS public keys",
        "Check iss, aud, exp, and nonce claims during validation",
        "ID Tokens prove authentication; access tokens authorize API calls",
        "Never send ID Tokens to resource servers or APIs"
      ]
    },
    {
      id: "userinfo-endpoint",
      title: "UserInfo Endpoint: Retrieving User Claims",
      slug: "userinfo-endpoint",
      duration: 20,
      content: [
        {
          type: "text",
          title: "What is the UserInfo Endpoint?",
          content: `The **UserInfo endpoint** is an OAuth 2.0 protected resource that returns claims about the authenticated end-user.

**Purpose:**
While ID Tokens contain basic identity claims, the UserInfo endpoint provides:
- **Additional claims** not included in the ID Token (to keep ID Token size small)
- **Real-time data** (claims may have changed since ID Token was issued)
- **Aggregated claims** from multiple sources

**Endpoint Location:**
Found in the OpenID Provider's discovery document at:
\`\`\`
https://issuer.example.com/.well-known/openid-configuration
\`\`\`

Look for the **userinfo_endpoint** field:
\`\`\`json
{
  "userinfo_endpoint": "https://accounts.google.com/userinfo/v2/me"
}
\`\`\``
        },
        {
          type: "code",
          title: "Calling the UserInfo Endpoint",
          language: "typescript",
          content: `// Step 1: Exchange authorization code for tokens
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: 'https://myapp.com/callback',
    client_id: 'my-client-id',
    client_secret: 'my-client-secret'
  })
});

const tokens = await tokenResponse.json();
// tokens = { access_token, id_token, refresh_token, ... }

// Step 2: Call UserInfo endpoint with access token
const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  headers: {
    'Authorization': \`Bearer \${tokens.access_token}\`  // ← Access token required
  }
});

const userinfo = await userinfoResponse.json();

// UserInfo Response Example:
{
  "sub": "10769150350006150715113082367",   // Matches ID Token sub
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "email": "john.doe@example.com",
  "email_verified": true,
  "locale": "en",
  "hd": "example.com"  // Hosted domain (for Google Workspace)
}`
        },
        {
          type: "text",
          title: "UserInfo vs. ID Token Claims",
          content: `**When to Use UserInfo Endpoint:**

**Use UserInfo when:**
✅ You need claims not included in the ID Token
✅ You want real-time data (e.g., updated profile picture)
✅ The ID Token is too large with all claims (performance optimization)
✅ You need aggregated/distributed claims

**Use ID Token claims when:**
✅ Basic identity is sufficient (sub, email, name)
✅ You want to minimize network requests
✅ Claims don't change frequently
✅ You're implementing client-side authentication

**Key Differences:**

| Aspect | ID Token Claims | UserInfo Endpoint |
|--------|----------------|-------------------|
| **Delivery** | Returned with tokens | Requires extra API call |
| **Freshness** | Point-in-time (token issuance) | Real-time (current data) |
| **Size** | Limited (keep JWT small) | Unlimited |
| **Authentication** | None (public claims in JWT) | Requires access token |
| **Signature** | Always signed | Optional (can be signed JWT) |

**Best Practice:**
Include essential claims in ID Token (sub, email, name). Fetch additional claims from UserInfo endpoint as needed.`
        },
        {
          type: "text",
          title: "UserInfo Response Formats",
          content: `**JSON Response (Default):**
Content-Type: application/json

\`\`\`json
{
  "sub": "248289761001",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\`

**JWT Response (Signed/Encrypted):**
Content-Type: application/jwt

If the identity provider is configured to sign or encrypt UserInfo responses:

\`\`\`
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDgyODk3NjEwMDEiLCJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmVAZXhhbXBsZS5jb20ifQ.signature
\`\`\`

**When JWT is Used:**
- High-security environments
- Need tamper-proof user data
- Require encryption for sensitive claims

**Validation for JWT UserInfo:**
- Verify signature (same as ID Token validation)
- Check iss and aud claims
- Decrypt if encrypted`
        },
        {
          type: "code",
          title: "Complete UserInfo Integration Example",
          language: "typescript",
          content: `import { Strategy as OIDCStrategy } from 'passport-openidconnect';
import passport from 'passport';

// Configure OIDC strategy with UserInfo
passport.use('oidc', new OIDCStrategy({
    issuer: 'https://accounts.google.com',
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    userInfoURL: 'https://www.googleapis.com/oauth2/v3/userinfo',  // ← UserInfo endpoint
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: 'https://myapp.com/auth/callback',
    scope: ['openid', 'profile', 'email']  // Request specific claims
  },
  async (issuer, profile, done) => {
    // profile.id = sub claim from ID Token
    // profile.displayName = name from UserInfo
    // profile.emails = [{ value: 'user@example.com', verified: true }]

    // Find or create user in database
    let user = await User.findOne({ oidcSub: profile.id });

    if (!user) {
      user = await User.create({
        oidcSub: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value
      });
    } else {
      // Update user info from UserInfo (real-time data)
      user.name = profile.displayName;
      user.picture = profile.photos?.[0]?.value;
      await user.save();
    }

    done(null, user);
  }
));

// Express route
app.get('/auth/google',
  passport.authenticate('oidc')
);

app.get('/auth/callback',
  passport.authenticate('oidc', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);`
        },
        {
          type: "text",
          title: "UserInfo Security Considerations",
          content: `**Access Token Protection:**
The UserInfo endpoint requires a valid access token. Protect it:

✅ **Use HTTPS**: Never send access tokens over HTTP
✅ **Short-lived tokens**: Limit access token lifetime
✅ **Validate scope**: Ensure access token has 'openid' scope
✅ **Rate limiting**: Prevent abuse of UserInfo endpoint

**Privacy Considerations:**

**Minimal Data Principle:**
Only request scopes you actually need:
- Need email? Request scope=openid email (not profile)
- Don't request address or phone if unused

**Consented Claims:**
UserInfo only returns claims the user consented to. If the user denies profile access, you'll only get sub.

**Data Freshness vs. Privacy:**
- Fetching UserInfo every session = real-time data but more tracking
- Using ID Token claims = less tracking but potentially stale data

**Regulatory Compliance:**
- GDPR: User must consent to data collection
- CCPA: Allow users to delete their data
- Store minimal claims, delete when user account closes`
        }
      ],
      keyTakeaways: [
        "UserInfo endpoint returns claims about the authenticated user",
        "Access token (not ID Token) is required to call UserInfo",
        "UserInfo provides real-time, fresh user data",
        "Response can be JSON or signed/encrypted JWT",
        "The 'sub' claim in UserInfo must match the ID Token sub",
        "Only request scopes and claims you actually need (privacy)"
      ]
    },
    {
      id: "oidc-flows",
      title: "OIDC Flows: Authorization Code, Implicit, and Hybrid",
      slug: "oidc-flows",
      duration: 30,
      content: [
        {
          type: "text",
          title: "OIDC Flow Overview",
          content: `OpenID Connect defines **three primary flows** for authentication, each suited to different application types:

**1. Authorization Code Flow**
- **Best for**: Server-side web applications, mobile apps (with PKCE)
- **Security**: Highest (tokens never exposed to browser)
- **Tokens**: Authorization code → Exchange for ID Token + Access Token
- **Status**: ✅ **Recommended** (with PKCE)

**2. Implicit Flow**
- **Best for**: (Deprecated - don't use)
- **Security**: Lower (tokens in URL fragment)
- **Tokens**: ID Token (and optionally Access Token) directly in redirect
- **Status**: ⚠️ **Deprecated** (use Authorization Code + PKCE instead)

**3. Hybrid Flow**
- **Best for**: Complex scenarios needing both front-channel and back-channel tokens
- **Security**: Medium-High
- **Tokens**: Some tokens from authorization endpoint, others from token endpoint
- **Status**: ✅ Used in specific enterprise scenarios

**Current Best Practice (2025):**
Use **Authorization Code Flow with PKCE** for all application types (web, mobile, SPA).`
        },
        {
          type: "code",
          title: "Authorization Code Flow with OIDC",
          language: "typescript",
          content: `// This is OAuth 2.0 Authorization Code Flow + OpenID Connect

// Step 1: Generate PKCE challenge
import crypto from 'crypto';

const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// Step 2: Authorization Request (redirect user to identity provider)
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', 'my-client-id.apps.googleusercontent.com');
authUrl.searchParams.set('redirect_uri', 'https://myapp.com/callback');
authUrl.searchParams.set('scope', 'openid profile email');  // ← OIDC scopes
authUrl.searchParams.set('state', generateRandomState());
authUrl.searchParams.set('nonce', generateRandomNonce());   // ← OIDC addition (replay protection)
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');

// Redirect user
res.redirect(authUrl.toString());

// Step 3: User authenticates, consents, redirects back
// GET /callback?code=AUTH_CODE&state=STATE

// Step 4: Exchange authorization code for tokens
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: 'https://myapp.com/callback',
    client_id: 'my-client-id',
    client_secret: 'my-client-secret',  // Optional for public clients
    code_verifier: codeVerifier         // PKCE verifier
  })
});

const tokens = await tokenResponse.json();

// Response includes:
{
  "access_token": "ya29.a0AfH6...",
  "id_token": "eyJhbGciOiJSUzI1NiIs...",  // ← ID Token (JWT)
  "expires_in": 3600,
  "token_type": "Bearer",
  "refresh_token": "1//0gHN...",
  "scope": "openid profile email"
}

// Step 5: Validate ID Token (see previous lesson)
const claims = await validateIdToken(tokens.id_token);

// Step 6: Create user session
req.session.userId = claims.sub;
req.session.email = claims.email;
req.session.name = claims.name;`
        },
        {
          type: "text",
          title: "Implicit Flow (Deprecated)",
          content: `**Historical Context:**
The Implicit Flow was designed for browser-based apps (SPAs) that couldn't keep secrets. Tokens were returned directly in the URL fragment.

**Why It Was Created:**
Before PKCE, SPAs couldn't securely use Authorization Code Flow (no client secret). Implicit Flow was a workaround.

**Authorization Request (Implicit Flow):**
\`\`\`
GET /authorize?
  response_type=id_token token&  ← Returns tokens directly
  client_id=my-app&
  redirect_uri=https://myapp.com/callback&
  scope=openid profile email&
  state=xyz123&
  nonce=abc456
\`\`\`

**Callback (Tokens in URL Fragment):**
\`\`\`
https://myapp.com/callback#
  access_token=AT123&
  id_token=eyJhbGci...&
  token_type=Bearer&
  expires_in=3600&
  state=xyz123
\`\`\`

**Security Issues:**
❌ Tokens exposed in browser history
❌ Tokens visible in JavaScript (XSS risk)
❌ No refresh tokens (poor UX for long sessions)
❌ Vulnerable to token injection attacks

**Current Recommendation:**
⚠️ **Do NOT use Implicit Flow**
✅ **Use Authorization Code Flow with PKCE** for SPAs instead

**OIDC Spec Status:**
OpenID Connect still documents Implicit Flow for backward compatibility, but OAuth 2.0 Security Best Current Practice (RFC 8252) recommends against it.`
        },
        {
          type: "text",
          title: "Hybrid Flow",
          content: `**What is Hybrid Flow?**
Hybrid Flow combines elements of Authorization Code and Implicit flows. Some tokens are returned from the authorization endpoint (front-channel), others from the token endpoint (back-channel).

**response_type Values:**
- **code id_token**: Authorization code + ID Token from authorization endpoint
- **code token**: Authorization code + Access Token from authorization endpoint
- **code id_token token**: All three from authorization endpoint

**Use Case:**
- Frontend needs immediate ID Token to render UI
- Backend needs authorization code to fetch access token securely
- Common in enterprise scenarios with complex architectures

**Example Authorization Request:**
\`\`\`
GET /authorize?
  response_type=code id_token&  ← Hybrid
  client_id=my-app&
  redirect_uri=https://myapp.com/callback&
  scope=openid profile&
  state=xyz123&
  nonce=abc456&
  response_mode=form_post  ← Optional: POST instead of GET
\`\`\`

**Response (Front-Channel):**
\`\`\`
https://myapp.com/callback#
  code=AUTH_CODE&
  id_token=eyJhbGci...&
  state=xyz123
\`\`\`

**Then Exchange Code (Back-Channel):**
Client uses the authorization code to fetch access token and refresh token from token endpoint.

**When to Use Hybrid Flow:**
- Rarely needed in modern applications
- Legacy enterprise SSO implementations
- Complex multi-party scenarios

**Modern Alternative:**
Use Authorization Code Flow with PKCE and cache ID Token claims on the frontend if needed.`
        },
        {
          type: "code",
          title: "OIDC Flow Selection Guide",
          language: "typescript",
          content: `// Decision tree for choosing OIDC flow in 2025

function selectOIDCFlow(appType: string) {
  switch (appType) {
    case 'server-side-web-app':
      return {
        flow: 'Authorization Code Flow',
        responseType: 'code',
        pkce: 'recommended',  // Even with client secret
        tokens: 'Back-channel (token endpoint)',
        security: 'Highest',
        example: 'Express.js, Django, Rails app'
      };

    case 'single-page-app':
      return {
        flow: 'Authorization Code Flow with PKCE',
        responseType: 'code',
        pkce: 'required',     // No client secret possible
        tokens: 'Back-channel (token endpoint)',
        security: 'High',
        example: 'React, Vue, Angular app',
        note: 'Do NOT use Implicit Flow (deprecated)'
      };

    case 'mobile-app':
      return {
        flow: 'Authorization Code Flow with PKCE',
        responseType: 'code',
        pkce: 'required',
        tokens: 'Back-channel (token endpoint)',
        security: 'High',
        example: 'iOS, Android native app',
        redirectUri: 'Use custom URL scheme or universal links'
      };

    case 'native-desktop-app':
      return {
        flow: 'Authorization Code Flow with PKCE',
        responseType: 'code',
        pkce: 'required',
        tokens: 'Back-channel (token endpoint)',
        security: 'High',
        example: 'Electron, .NET desktop app',
        redirectUri: 'Use loopback redirect (http://127.0.0.1:PORT)'
      };

    case 'cli-tool':
      return {
        flow: 'Device Code Flow (OAuth 2.0 extension)',
        responseType: 'device_code',
        pkce: 'not applicable',
        tokens: 'Polling token endpoint',
        security: 'Medium-High',
        example: 'aws-cli, gcloud, terraform',
        note: 'For input-constrained devices'
      };

    default:
      return {
        flow: 'Authorization Code Flow with PKCE',
        note: 'Default recommendation for all scenarios'
      };
  }
}

// Usage
const config = selectOIDCFlow('single-page-app');
console.log(\`Use: \${config.flow}\`);
console.log(\`PKCE: \${config.pkce}\`);`
        },
        {
          type: "text",
          title: "Response Modes",
          content: `OIDC supports different **response modes** to control how the authorization server returns tokens:

**1. query (Default for Code Flow)**
Tokens/codes in query string:
\`\`\`
https://myapp.com/callback?code=ABC&state=XYZ
\`\`\`

**2. fragment (Default for Implicit/Hybrid)**
Tokens in URL fragment (not sent to server):
\`\`\`
https://myapp.com/callback#access_token=AT&id_token=IT
\`\`\`

**3. form_post**
Tokens sent via HTTP POST with auto-submitting form:
\`\`\`
POST /callback
Content-Type: application/x-www-form-urlencoded

code=ABC&id_token=IT&state=XYZ
\`\`\`

**When to Use form_post:**
✅ Tokens too large for URL (some browsers limit URL length)
✅ Prevent tokens from appearing in browser history
✅ Server-side applications that prefer POST

**Example with form_post:**
\`\`\`
GET /authorize?
  response_type=code&
  response_mode=form_post&  ← Add this
  client_id=my-app&
  redirect_uri=https://myapp.com/callback&
  scope=openid
\`\`\`

The authorization server will POST the code to your redirect_uri instead of using a GET with query parameters.`
        }
      ],
      keyTakeaways: [
        "Use Authorization Code Flow with PKCE for all modern applications",
        "Implicit Flow is deprecated (don't use for new projects)",
        "Hybrid Flow is rarely needed (complex enterprise scenarios only)",
        "response_type=code triggers Authorization Code Flow in OIDC",
        "Always include 'openid' in scope to activate OIDC authentication",
        "response_mode=form_post prevents tokens from appearing in browser history"
      ]
    },
    {
      id: "discovery-dynamic-config",
      title: "Discovery Documents and Dynamic Configuration",
      slug: "discovery-dynamic-config",
      duration: 25,
      content: [
        {
          type: "text",
          title: "What is OpenID Provider Discovery?",
          content: `**OpenID Provider Discovery** allows clients to dynamically discover an identity provider's configuration without hard-coding endpoints.

**The Problem:**
Hard-coding endpoints is fragile:
\`\`\`typescript
const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'; // What if this changes?
const tokenUrl = 'https://oauth2.googleapis.com/token';
\`\`\`

**The Solution:**
Fetch configuration from a **well-known endpoint**:
\`\`\`
https://{issuer}/.well-known/openid-configuration
\`\`\`

**Example for Google:**
\`\`\`
https://accounts.google.com/.well-known/openid-configuration
\`\`\`

**Benefits:**
✅ No hard-coded endpoints (future-proof)
✅ Learn provider capabilities (supported flows, algorithms, scopes)
✅ Automatic JWKS endpoint discovery
✅ Standard across all OIDC providers`
        },
        {
          type: "code",
          title: "Discovery Document Example (Google)",
          language: "json",
          content: `// GET https://accounts.google.com/.well-known/openid-configuration

{
  "issuer": "https://accounts.google.com",
  "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
  "token_endpoint": "https://oauth2.googleapis.com/token",
  "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
  "revocation_endpoint": "https://oauth2.googleapis.com/revoke",
  "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs",

  "response_types_supported": [
    "code",
    "token",
    "id_token",
    "code token",
    "code id_token",
    "token id_token",
    "code token id_token",
    "none"
  ],

  "subject_types_supported": ["public"],

  "id_token_signing_alg_values_supported": ["RS256"],

  "scopes_supported": [
    "openid",
    "email",
    "profile"
  ],

  "token_endpoint_auth_methods_supported": [
    "client_secret_post",
    "client_secret_basic"
  ],

  "claims_supported": [
    "aud",
    "email",
    "email_verified",
    "exp",
    "family_name",
    "given_name",
    "iat",
    "iss",
    "locale",
    "name",
    "picture",
    "sub"
  ],

  "code_challenge_methods_supported": ["plain", "S256"],

  "grant_types_supported": [
    "authorization_code",
    "refresh_token",
    "urn:ietf:params:oauth:grant-type:device_code"
  ]
}`
        },
        {
          type: "code",
          title: "Using Discovery for Dynamic Configuration",
          language: "typescript",
          content: `import { Issuer, Strategy as OIDCStrategy } from 'openid-client';
import passport from 'passport';

// Fetch discovery document and configure client automatically
async function setupOIDC(issuerUrl: string) {
  // Discover provider configuration
  const issuer = await Issuer.discover(issuerUrl);

  console.log('Discovered issuer:', issuer.issuer);
  console.log('Authorization endpoint:', issuer.metadata.authorization_endpoint);
  console.log('Token endpoint:', issuer.metadata.token_endpoint);
  console.log('JWKS URI:', issuer.metadata.jwks_uri);

  // Create client
  const client = new issuer.Client({
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ['https://myapp.com/callback'],
    response_types: ['code']
  });

  // Configure Passport strategy (endpoints auto-discovered)
  passport.use('oidc', new OIDCStrategy(
    {
      client,
      params: {
        scope: 'openid profile email'
      }
    },
    (tokenSet, userinfo, done) => {
      // tokenSet.claims() contains ID Token claims
      // userinfo contains data from UserInfo endpoint

      const user = {
        id: userinfo.sub,
        email: userinfo.email,
        name: userinfo.name
      };

      done(null, user);
    }
  ));

  return client;
}

// Usage with any OIDC provider
await setupOIDC('https://accounts.google.com');          // Google
await setupOIDC('https://login.microsoftonline.com/common/v2.0');  // Microsoft
await setupOIDC('https://dev-abc123.okta.com');          // Okta
await setupOIDC('https://your-tenant.auth0.com');        // Auth0

// No hard-coded endpoints! 🎉`
        },
        {
          type: "text",
          title: "Key Discovery Document Fields",
          content: `**Required Fields:**

**issuer**
- The identity provider's unique identifier
- MUST match the iss claim in ID Tokens
- Example: "https://accounts.google.com"

**authorization_endpoint**
- Where to redirect users for authentication
- Example: "https://accounts.google.com/o/oauth2/v2/auth"

**token_endpoint**
- Where to exchange authorization codes for tokens
- Example: "https://oauth2.googleapis.com/token"

**jwks_uri**
- Public keys for verifying ID Token signatures
- Example: "https://www.googleapis.com/oauth2/v3/certs"

**response_types_supported**
- Which OAuth flows are available
- Example: ["code", "id_token", "code id_token"]

**subject_types_supported**
- How sub claims are calculated
- "public": Same sub for all clients (most common)
- "pairwise": Different sub per client (privacy-focused)

**id_token_signing_alg_values_supported**
- Algorithms for signing ID Tokens
- Common: ["RS256", "ES256"]

**Optional but Common:**

**userinfo_endpoint**
- Where to fetch additional user claims
- Example: "https://openidconnect.googleapis.com/v1/userinfo"

**revocation_endpoint**
- Where to revoke access/refresh tokens
- Example: "https://oauth2.googleapis.com/revoke"

**end_session_endpoint**
- Where to trigger logout (RP-Initiated Logout)
- Example: "https://login.microsoftonline.com/common/oauth2/v2.0/logout"

**scopes_supported**
- Available scopes clients can request
- Example: ["openid", "profile", "email", "offline_access"]

**claims_supported**
- Claims available in ID Tokens and UserInfo
- Example: ["sub", "name", "email", "picture"]

**code_challenge_methods_supported**
- PKCE methods available
- Example: ["S256", "plain"]`
        },
        {
          type: "code",
          title: "Manual Discovery Document Fetch",
          language: "typescript",
          content: `// Manually fetch and parse discovery document

interface OIDCDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  scopes_supported?: string[];
  response_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  // ... many more optional fields
}

async function fetchDiscovery(issuer: string): Promise<OIDCDiscovery> {
  // Construct well-known URL
  const wellKnownUrl = new URL('/.well-known/openid-configuration', issuer);

  const response = await fetch(wellKnownUrl.toString());

  if (!response.ok) {
    throw new Error(\`Discovery failed: \${response.statusText}\`);
  }

  const discovery: OIDCDiscovery = await response.json();

  // Validate required fields
  if (!discovery.issuer || !discovery.authorization_endpoint || !discovery.token_endpoint) {
    throw new Error('Invalid discovery document: missing required fields');
  }

  // Verify issuer matches
  if (discovery.issuer !== issuer) {
    throw new Error(\`Issuer mismatch: expected \${issuer}, got \${discovery.issuer}\`);
  }

  return discovery;
}

// Usage
const googleConfig = await fetchDiscovery('https://accounts.google.com');
console.log('Auth URL:', googleConfig.authorization_endpoint);
console.log('Supported scopes:', googleConfig.scopes_supported);

// Build authorization URL dynamically
const authUrl = new URL(googleConfig.authorization_endpoint);
authUrl.searchParams.set('client_id', 'my-client-id');
authUrl.searchParams.set('redirect_uri', 'https://myapp.com/callback');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'openid email profile');
// redirect user to authUrl`
        },
        {
          type: "text",
          title: "Dynamic Client Registration (Advanced)",
          content: `**What is Dynamic Client Registration?**
Instead of manually registering your application in the provider's console, you can **programmatically register** clients using the Dynamic Client Registration protocol (RFC 7591).

**Discovery Field:**
\`\`\`json
{
  "registration_endpoint": "https://accounts.example.com/register"
}
\`\`\`

**Use Cases:**
- Multi-tenant SaaS apps creating clients on the fly
- Development/testing automation
- Decentralized identity scenarios

**Registration Request Example:**
\`\`\`http
POST /register HTTP/1.1
Host: accounts.example.com
Content-Type: application/json

{
  "redirect_uris": ["https://client.example.com/callback"],
  "token_endpoint_auth_method": "client_secret_basic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "client_name": "My Application",
  "client_uri": "https://client.example.com",
  "logo_uri": "https://client.example.com/logo.png",
  "scope": "openid profile email"
}
\`\`\`

**Response:**
\`\`\`json
{
  "client_id": "s6BhdRkqt3",
  "client_secret": "ZJYCqe3GGRvdrudKyZS0XhGv_Z45DuKhCUk0gBR1vZk",
  "client_id_issued_at": 1708560000,
  "client_secret_expires_at": 1740096000,
  "registration_access_token": "this_is_a_registration_access_token",
  "registration_client_uri": "https://accounts.example.com/register/s6BhdRkqt3"
}
\`\`\`

**Security Note:**
Not all OIDC providers support dynamic registration. Google, Microsoft, and Auth0 require manual registration for security reasons.`
        },
        {
          type: "text",
          title: "Provider-Specific Discovery Examples",
          content: `**Major OIDC Provider Discovery URLs:**

**Google:**
\`\`\`
https://accounts.google.com/.well-known/openid-configuration
\`\`\`

**Microsoft Entra ID (Azure AD):**
\`\`\`
https://login.microsoftonline.com/{tenant-id}/v2.0/.well-known/openid-configuration
\`\`\`
Replace {tenant-id} with your tenant ID or "common" for multi-tenant

**Okta:**
\`\`\`
https://{your-okta-domain}/.well-known/openid-configuration
\`\`\`
Example: https://dev-123456.okta.com/.well-known/openid-configuration

**Auth0:**
\`\`\`
https://{your-tenant}.auth0.com/.well-known/openid-configuration
\`\`\`
Example: https://my-app.us.auth0.com/.well-known/openid-configuration

**Ory Hydra (Self-Hosted):**
\`\`\`
https://your-hydra-instance.com/.well-known/openid-configuration
\`\`\`

**Keycloak:**
\`\`\`
https://{keycloak-domain}/realms/{realm-name}/.well-known/openid-configuration
\`\`\`
Example: https://sso.example.com/realms/myrealm/.well-known/openid-configuration

**Best Practice:**
Always use discovery instead of hard-coding endpoints. Providers can change URLs, add features, or rotate keys.`
        }
      ],
      keyTakeaways: [
        "Discovery documents are at /.well-known/openid-configuration",
        "Discovery provides all endpoints (auth, token, userinfo, jwks)",
        "Use discovery for dynamic configuration (no hard-coded endpoints)",
        "Verify the issuer field matches your expected identity provider",
        "JWKS URI from discovery is used to fetch ID Token signing keys",
        "All major OIDC providers support discovery (Google, Microsoft, Okta, Auth0)"
      ]
    },
    {
      id: "oidc-session-management",
      title: "Session Management and Single Logout",
      slug: "oidc-session-management",
      duration: 25,
      content: [
        {
          type: "text",
          title: "OIDC Session Management Overview",
          content: `**The Session Problem:**
When a user logs in with OIDC, they have sessions in **two places**:
1. **Identity Provider (IdP) session**: At Google, Microsoft, etc.
2. **Application session**: In your web app

**Scenarios to Handle:**

**Scenario 1: IdP Session Expires**
- User logs out at Google
- Your app's session is still active
- User appears logged in but can't refresh tokens

**Scenario 2: User Logs Out of Your App**
- User clicks "Logout" in your app
- Your session ends
- But IdP session remains (SSO to other apps still works)

**Scenario 3: User Wants Global Logout**
- User clicks "Logout Everywhere"
- Should end sessions at BOTH app and IdP
- Log user out of all connected applications

OIDC provides specifications for handling these scenarios:
- **Session Management**: Monitor IdP session status
- **RP-Initiated Logout**: Request logout at IdP
- **Front-Channel Logout**: IdP notifies apps of logout
- **Back-Channel Logout**: IdP sends logout via backchannel`
        },
        {
          type: "text",
          title: "RP-Initiated Logout",
          content: `**What is RP-Initiated Logout?**
The Relying Party (your application) triggers logout at the OpenID Provider.

**Discovery Field:**
\`\`\`json
{
  "end_session_endpoint": "https://accounts.google.com/o/oauth2/v2/logout"
}
\`\`\`

**How It Works:**

**Step 1: User Clicks "Logout" in Your App**
- Destroy local application session
- Clear cookies, tokens

**Step 2: Redirect to IdP's end_session_endpoint**
\`\`\`
GET /logout?
  id_token_hint=<ID_TOKEN>&
  post_logout_redirect_uri=https://myapp.com/goodbye&
  state=random_state
\`\`\`

**Parameters:**
- **id_token_hint**: The ID Token received at login (helps IdP identify the session)
- **post_logout_redirect_uri**: Where to redirect after logout (must be pre-registered)
- **state**: Opaque value returned in redirect (prevents CSRF)

**Step 3: IdP Logs User Out**
- IdP destroys session
- User logged out of all IdP-connected apps (if front-channel logout configured)

**Step 4: Redirect Back to App**
\`\`\`
https://myapp.com/goodbye?state=random_state
\`\`\`

**Security:**
- The post_logout_redirect_uri must be whitelisted in client configuration
- Validate state parameter on return`
        },
        {
          type: "code",
          title: "RP-Initiated Logout Implementation",
          language: "typescript",
          content: `import express from 'express';
import session from 'express-session';

const app = express();

// Logout endpoint
app.post('/logout', async (req, res) => {
  // Step 1: Get ID Token from session
  const idToken = req.session.idToken;

  // Step 2: Destroy local session
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
  });

  // Step 3: Clear session cookie
  res.clearCookie('connect.sid');

  // Step 4: Construct end_session_endpoint URL
  const logoutUrl = new URL(discoveryDoc.end_session_endpoint);
  logoutUrl.searchParams.set('id_token_hint', idToken);
  logoutUrl.searchParams.set('post_logout_redirect_uri', 'https://myapp.com/goodbye');
  logoutUrl.searchParams.set('state', generateRandomState());

  // Step 5: Redirect to IdP logout
  res.redirect(logoutUrl.toString());
});

// Post-logout landing page
app.get('/goodbye', (req, res) => {
  const state = req.query.state;

  // Validate state if you stored it (best practice)
  // if (state !== expectedState) {
  //   return res.status(400).send('Invalid state');
  // }

  res.send(\`
    <h1>You've been logged out</h1>
    <p>Successfully logged out of both the application and identity provider.</p>
    <a href="/">Return to homepage</a>
  \`);
});

// Alternative: Logout without IdP redirect (local only)
app.post('/logout-local', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');

  // User still logged in at IdP (can SSO to other apps)
});`
        },
        {
          type: "text",
          title: "Front-Channel Logout",
          content: `**What is Front-Channel Logout?**
When a user logs out at the IdP, the IdP notifies all Relying Parties using **hidden iframes**.

**Discovery Field:**
\`\`\`json
{
  "frontchannel_logout_supported": true,
  "frontchannel_logout_session_supported": true
}
\`\`\`

**How It Works:**

**Step 1: User Logs Out at IdP**
- User visits https://accounts.google.com and clicks logout

**Step 2: IdP Loads Hidden Iframes**
For each RP registered with front-channel logout, IdP loads:
\`\`\`html
<iframe src="https://rp1.example.com/logout?iss=https://idp.example.com&sid=session123"></iframe>
<iframe src="https://rp2.example.com/logout?iss=https://idp.example.com&sid=session123"></iframe>
\`\`\`

**Step 3: RP's Logout Endpoint Clears Session**
Each RP receives the iframe request and clears the session.

**Step 4: User Logged Out Everywhere**

**Client Registration:**
When registering your client, provide:
\`\`\`json
{
  "frontchannel_logout_uri": "https://myapp.com/frontchannel-logout",
  "frontchannel_logout_session_required": true
}
\`\`\`

**Implementation:**
\`\`\`typescript
// Front-channel logout endpoint (no authentication required)
app.get('/frontchannel-logout', (req, res) => {
  const iss = req.query.iss;  // Issuer
  const sid = req.query.sid;  // Session ID

  // Find session by sid and destroy it
  sessionStore.destroy(sid, (err) => {
    if (err) console.error('Logout error:', err);
  });

  // Return 200 OK (iframe expects success)
  res.status(200).send('Logged out');
});
\`\`\`

**Limitations:**
- Requires third-party cookies (blocked in Safari by default)
- Slower (synchronous iframe loading)
- User must be online
- Not suitable for mobile apps`
        },
        {
          type: "text",
          title: "Back-Channel Logout",
          content: `**What is Back-Channel Logout?**
The IdP sends a **server-to-server** notification when a user logs out, bypassing browser limitations.

**Discovery Field:**
\`\`\`json
{
  "backchannel_logout_supported": true,
  "backchannel_logout_session_supported": true
}
\`\`\`

**How It Works:**

**Step 1: User Logs Out at IdP**

**Step 2: IdP POSTs Logout Token to RPs**
\`\`\`http
POST /backchannel-logout HTTP/1.1
Host: myapp.example.com
Content-Type: application/x-www-form-urlencoded

logout_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Step 3: RP Validates Logout Token**
The logout_token is a JWT containing:
\`\`\`json
{
  "iss": "https://idp.example.com",
  "aud": "my-client-id",
  "iat": 1708560000,
  "jti": "unique-token-id",
  "events": {
    "http://schemas.openid.net/event/backchannel-logout": {}
  },
  "sub": "user123",    // User being logged out
  "sid": "session456"  // Session ID
}
\`\`\`

**Step 4: RP Destroys Session**

**Implementation:**
\`\`\`typescript
import jwt from 'jsonwebtoken';

app.post('/backchannel-logout', async (req, res) => {
  const logoutToken = req.body.logout_token;

  try {
    // Validate JWT signature (same as ID Token validation)
    const decoded = jwt.verify(logoutToken, getPublicKey, {
      issuer: 'https://idp.example.com',
      audience: 'my-client-id'
    });

    // Verify it's a logout event
    if (!decoded.events?.['http://schemas.openid.net/event/backchannel-logout']) {
      return res.status(400).send('Invalid logout token');
    }

    // Destroy session by sub or sid
    if (decoded.sid) {
      await sessionStore.destroy(decoded.sid);
    } else if (decoded.sub) {
      await destroyAllSessionsForUser(decoded.sub);
    }

    res.status(200).send('Logged out');
  } catch (error) {
    console.error('Logout token validation failed:', error);
    res.status(400).send('Invalid token');
  }
});
\`\`\`

**Advantages over Front-Channel:**
✅ Works without third-party cookies
✅ Faster (no iframe loading)
✅ Works when user is offline
✅ Suitable for mobile apps and SPAs

**Client Registration:**
\`\`\`json
{
  "backchannel_logout_uri": "https://myapp.com/backchannel-logout",
  "backchannel_logout_session_required": true
}
\`\`\``
        },
        {
          type: "text",
          title: "Session Management Best Practices",
          content: `**1. Store ID Token for Logout**
Save the ID Token in your session to use as id_token_hint during logout:
\`\`\`typescript
req.session.idToken = tokenSet.id_token;
req.session.userId = claims.sub;
\`\`\`

**2. Implement Both Logout Types**
- **Local Logout**: Clear app session only (user still logged in at IdP)
- **Global Logout**: RP-Initiated Logout (logs out of IdP and all apps)

Offer both options:
\`\`\`html
<button onclick="logoutLocal()">Logout (this app only)</button>
<button onclick="logoutGlobal()">Logout everywhere</button>
\`\`\`

**3. Handle Session Expiration**
When access token expires:
- Try refreshing with refresh token
- If refresh fails, redirect to login (IdP session expired)
- Don't silently fail (causes confusion)

**4. Use Refresh Tokens Wisely**
- Store refresh tokens securely (encrypted, server-side only)
- Set reasonable lifetimes (days to weeks, not years)
- Revoke refresh tokens on logout

**5. Implement Backchannel Logout**
If your IdP supports it, use backchannel logout:
- More reliable than front-channel
- Works in browsers with strict cookie policies
- Better UX (faster logout)

**6. Monitor Session State (Advanced)**
Use OIDC Session Management spec with check_session_iframe:
- Polls IdP to check if session is still active
- Detects when user logs out elsewhere
- Automatically logs user out of your app

**7. Secure Logout Endpoints**
- Validate id_token_hint and state parameters
- Use HTTPS (always)
- Rate limit logout endpoints (prevent DoS)
- Whitelist post_logout_redirect_uri values

**8. Communicate Logout Status**
Show clear messages:
- "Logged out of [App Name]"
- "You are still logged in to [IdP Name]"
- "Click here to log out of [IdP Name] as well"`
        }
      ],
      keyTakeaways: [
        "Users have sessions in both the app and the identity provider",
        "RP-Initiated Logout triggers logout at the IdP via end_session_endpoint",
        "Front-Channel Logout uses iframes (requires third-party cookies)",
        "Back-Channel Logout uses server-to-server JWT notifications (more reliable)",
        "Always provide id_token_hint when calling end_session_endpoint",
        "Offer both local logout and global logout options to users"
      ]
    }
  ],
  quiz: {
    passingScore: 80,
    questions: [
      {
        question: "What is the primary purpose of OpenID Connect (OIDC)?",
        options: [
          "To provide delegated authorization for API access",
          "To add a standardized authentication layer on top of OAuth 2.0",
          "To replace OAuth 2.0 entirely with a new protocol",
          "To encrypt communication between client and server"
        ],
        correctAnswer: 1,
        explanation: "OpenID Connect (OIDC) is a simple identity layer built on top of OAuth 2.0. It adds standardized authentication to OAuth 2.0's authorization framework, providing ID Tokens and the UserInfo endpoint."
      },
      {
        question: "Which scope must be included in an authorization request to trigger OIDC authentication?",
        options: [
          "profile",
          "email",
          "openid",
          "user:read"
        ],
        correctAnswer: 2,
        explanation: "The 'openid' scope is required to trigger OIDC authentication. When included, the authorization server will issue an ID Token in addition to the access token. Other scopes like 'profile' and 'email' are optional."
      },
      {
        question: "What format is an ID Token always in?",
        options: [
          "Opaque string",
          "JSON object",
          "JWT (JSON Web Token)",
          "XML"
        ],
        correctAnswer: 2,
        explanation: "ID Tokens are always JWTs (JSON Web Tokens). Unlike access tokens which can be opaque, ID Tokens must be JWTs so clients can extract and validate the identity claims within them."
      },
      {
        question: "Which claim in an ID Token uniquely identifies the user and never changes?",
        options: [
          "aud (audience)",
          "sub (subject)",
          "iss (issuer)",
          "email"
        ],
        correctAnswer: 1,
        explanation: "The 'sub' (subject) claim is a unique, immutable identifier for the user at that identity provider. Unlike email addresses which can change, the sub claim never changes for a given user."
      },
      {
        question: "What is the purpose of the UserInfo endpoint in OIDC?",
        options: [
          "To exchange authorization codes for tokens",
          "To retrieve additional user claims beyond those in the ID Token",
          "To validate ID Token signatures",
          "To revoke access tokens"
        ],
        correctAnswer: 1,
        explanation: "The UserInfo endpoint is an OAuth 2.0 protected resource that returns additional claims about the authenticated user. It provides real-time data and claims not included in the ID Token to keep the ID Token size manageable."
      },
      {
        question: "When calling the UserInfo endpoint, which token must you provide in the Authorization header?",
        options: [
          "ID Token",
          "Access Token",
          "Refresh Token",
          "Authorization Code"
        ],
        correctAnswer: 1,
        explanation: "You must use the access token (not the ID Token) to call the UserInfo endpoint. The UserInfo endpoint is an OAuth 2.0 protected resource that requires a valid bearer access token with the 'openid' scope."
      },
      {
        question: "Which OIDC flow is currently recommended for Single Page Applications (SPAs) in 2025?",
        options: [
          "Implicit Flow",
          "Authorization Code Flow with PKCE",
          "Hybrid Flow",
          "Resource Owner Password Credentials Flow"
        ],
        correctAnswer: 1,
        explanation: "Authorization Code Flow with PKCE is recommended for all modern application types, including SPAs. The Implicit Flow is deprecated due to security concerns (tokens in URL, no refresh tokens)."
      },
      {
        question: "What is the purpose of validating the 'nonce' claim in an ID Token?",
        options: [
          "To verify the token hasn't expired",
          "To prevent token replay attacks",
          "To check the token audience",
          "To verify the issuer"
        ],
        correctAnswer: 1,
        explanation: "The nonce is a random value sent by the client in the authorization request and returned in the ID Token. Validating it prevents token replay attacks by ensuring the ID Token was issued in response to the current authentication request."
      },
      {
        question: "Where can you find the JWKS endpoint for validating ID Token signatures?",
        options: [
          "In the ID Token itself",
          "In the access token response",
          "In the OpenID Provider's discovery document at /.well-known/openid-configuration",
          "In the authorization response"
        ],
        correctAnswer: 2,
        explanation: "The JWKS (JSON Web Key Set) endpoint URI is published in the OpenID Provider's discovery document at /.well-known/openid-configuration. The 'jwks_uri' field contains the URL where public keys for signature verification can be fetched."
      },
      {
        question: "What is RP-Initiated Logout?",
        options: [
          "When the identity provider automatically logs out inactive users",
          "When the relying party (client application) triggers logout at the identity provider via the end_session_endpoint",
          "When the user manually logs out of all applications simultaneously",
          "When the access token expires and the session ends"
        ],
        correctAnswer: 1,
        explanation: "RP-Initiated Logout is when the Relying Party (your application) triggers logout at the OpenID Provider by redirecting the user to the end_session_endpoint. This allows the application to log the user out of both the local session and the IdP session."
      },
      {
        question: "What is the main advantage of Back-Channel Logout over Front-Channel Logout?",
        options: [
          "It's faster because it uses HTTP/2",
          "It works without requiring third-party cookies and functions even when the user is offline",
          "It doesn't require JWT validation",
          "It only logs out the current application, not all applications"
        ],
        correctAnswer: 1,
        explanation: "Back-Channel Logout uses server-to-server communication (HTTP POST with logout tokens), which doesn't rely on browser features like third-party cookies or iframes. It's more reliable, works when users are offline, and is compatible with modern browser privacy features."
      },
      {
        question: "Which of the following is NOT a valid ID Token validation step?",
        options: [
          "Verify the signature using the public key from the JWKS endpoint",
          "Validate that the 'aud' claim contains your client_id",
          "Check that the current time is before the 'exp' timestamp",
          "Send the ID Token to the resource server API for validation"
        ],
        correctAnswer: 3,
        explanation: "You should NEVER send ID Tokens to resource servers or APIs. ID Tokens are meant for the client application only to prove authentication occurred. Resource servers should validate access tokens, not ID Tokens. All other options are required validation steps."
      }
    ]
  },
  badge: {
    id: "badge-oidc-core",
    name: "OpenID Connect Expert",
    description: "Mastered OpenID Connect authentication, ID Tokens, UserInfo, discovery, and session management",
    icon: "🔓",
    color: "intermediate"
  }
}
