import type { Lesson } from "@/types"

/**
 * Vendor-specific implementation examples and hands-on labs
 * These lessons provide real-world context using actual IAM vendors
 */

export const vendorOAuth2Lesson: Lesson = {
  id: "oauth2-vendors",
  title: "OAuth 2.0 in the Real World: Vendor Implementations",
  slug: "oauth2-vendors",
  description:
    "See how major vendors (Okta, Microsoft Entra, Google, AWS, and open-source Ory) implement OAuth 2.0 in practice.",
  duration: 30,
  order: 7,
  content: [
    {
      type: "text",
      content: `# OAuth 2.0 in the Real World: Vendor Implementations

While OAuth 2.0 is a standard, each vendor implements it with their own APIs, SDKs, and conventions. Understanding these differences helps you work effectively with real identity platforms.`,
    },
    {
      type: "text",
      title: "Vendor Landscape Overview",
      content: `**Full-Stack IDaaS (Identity as a Service):**
- **Okta / Auth0** - Standards-first CIAM and workforce IAM
- **Microsoft Entra ID** (formerly Azure AD) - Enterprise workforce + external identity
- **Google Identity Platform** - CIAM with Firebase integration
- **AWS Cognito** - Managed CIAM for AWS applications
- **Ping Identity** - Enterprise federation specialist

**Developer-First Platforms:**
- **Clerk** - Modern B2B/B2C with components
- **Stytch** - Passwordless-first authentication
- **FusionAuth** - Self-hosted or managed CIAM

**Open-Source / Self-Hosted:**
- **Ory (Hydra)** - Modular OAuth 2.0 & OIDC provider
- **Keycloak** - Full-featured IdP from Red Hat
- **ZITADEL** - Cloud-native identity platform`,
    },
    {
      type: "text",
      title: "Okta / Auth0: Standards-First Approach",
      content: `**Philosophy:** Developer-friendly OAuth 2.0 with extensive documentation

**Authorization Endpoint Pattern:**
\`\`\`
https://{domain}.okta.com/oauth2/v1/authorize
https://{domain}.auth0.com/authorize
\`\`\`

**Unique Characteristics:**
- **Auth0 Rules & Actions**: Custom JavaScript logic in auth flow
- **Universal Login**: Centralized, customizable login page
- **Extensive SDK Support**: Official libraries for 20+ languages
- **Auth0 <-> Okta Interop**: SAML federation between the two platforms

**Example: Authorization Code Flow**
\`\`\`typescript
// Auth0 SDK example
import { Auth0Client } from '@auth0/auth0-spa-js';

const auth0 = new Auth0Client({
  domain: 'your-tenant.auth0.com',
  client_id: 'your-client-id',
  redirect_uri: window.location.origin,
  audience: 'https://api.yourdomain.com',
  scope: 'openid profile email read:data'
});

// Start login
await auth0.loginWithRedirect();

// Handle callback
const { access_token } = await auth0.getTokenSilently();
\`\`\`

**When to Use:**
- Need fast time-to-market
- Want extensive marketplace integrations
- Require both B2C and workforce IAM`,
    },
    {
      type: "text",
      title: "Microsoft Entra ID: Enterprise Powerhouse",
      content: `**Philosophy:** Comprehensive identity for Microsoft ecosystem and beyond

**Authorization Endpoint:**
\`\`\`
https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
\`\`\`

**Unique Characteristics:**
- **Microsoft Graph Integration**: Single API for M365, Azure, Windows
- **Conditional Access**: Risk-based authentication policies
- **First-Party Passkeys**: Windows Hello + Microsoft Authenticator
- **B2C vs External ID**: Separate products for customer vs workforce

**Example: MSAL (Microsoft Authentication Library)**
\`\`\`typescript
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'your-client-id',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  }
};

const pca = new PublicClientApplication(msalConfig);

// Interactive login
const loginResponse = await pca.loginPopup({
  scopes: ['user.read', 'mail.read']
});

// Silent token acquisition
const tokenResponse = await pca.acquireTokenSilent({
  scopes: ['user.read'],
  account: loginResponse.account
});
\`\`\`

**When to Use:**
- Microsoft-centric environment
- Need strong enterprise features (Conditional Access)
- Want seamless M365 integration`,
    },
    {
      type: "text",
      title: "Google Identity Platform: CIAM Simplified",
      content: `**Philosophy:** Simple CIAM with Firebase developer experience

**Authorization Endpoint:**
\`\`\`
https://accounts.google.com/o/oauth2/v2/auth
\`\`\`

**Unique Characteristics:**
- **Firebase Authentication**: Managed auth for mobile/web apps
- **Identity Platform**: Enterprise upgrade with SAML/OIDC/MFA
- **One Tap & Auto Sign-In**: Streamlined UX for Google users
- **Clear Documentation**: Frequently updated OAuth guides

**Example: Google OAuth (Firebase)**
\`\`\`typescript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth(initializeApp(firebaseConfig));
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');

// Redirect-based flow
await signInWithRedirect(auth, provider);

// Get result after redirect
const result = await getRedirectResult(auth);
const credential = GoogleAuthProvider.credentialFromResult(result);
const accessToken = credential.accessToken;
\`\`\`

**When to Use:**
- Building mobile or web apps
- Want Google-quality UX patterns
- Need quick Firebase integration`,
    },
    {
      type: "text",
      title: "AWS Cognito: AWS-Native Identity",
      content: `**Philosophy:** Managed CIAM tightly integrated with AWS services

**Authorization Endpoint:**
\`\`\`
https://{domain}.auth.{region}.amazoncognito.com/oauth2/authorize
\`\`\`

**Unique Characteristics:**
- **User Pools vs Identity Pools**: Separate concepts for auth vs federation
- **Amplify Integration**: Quick setup for mobile/web
- **Lambda Triggers**: Customize auth flow with serverless functions
- **Client Auth Method Constraints**: Requires \`client_secret_post\`

**Example: Amplify Auth**
\`\`\`typescript
import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser } from '@aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_xxxxx',
      userPoolClientId: 'xxxxxxxxxxxxx',
      loginWith: {
        oauth: {
          domain: 'your-domain.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'profile', 'email'],
          redirectSignIn: ['http://localhost:3000/'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code',
        }
      }
    }
  }
});

// Sign in with hosted UI
await signIn({ provider: 'Google' });

// Get current user
const user = await getCurrentUser();
\`\`\`

**Caveats:**
- WebAuthn passkeys available but check MFA eligibility
- Some OIDC IdP integrations require specific auth methods

**When to Use:**
- AWS-centric architecture
- Want tight IAM integration
- Need cost-effective CIAM`,
    },
    {
      type: "text",
      title: "Ory Hydra: Open-Source OAuth 2.0 Provider",
      content: `**Philosophy:** Modular, self-hosted, standards-compliant OAuth 2.0

**Why Ory Hydra:**
- **OpenID Certified**: Fully compliant OIDC provider
- **Cloud-Native**: Built for Kubernetes and microservices
- **Modular Stack**: Works with Ory Kratos (identity), Keto (authz)
- **No Vendor Lock-In**: Self-hosted or Ory Cloud

**Authorization Endpoint:**
\`\`\`
https://your-hydra.example.com/oauth2/auth
\`\`\`

**Key Differences from Commercial IDaaS:**
- **Headless**: No built-in UI (you build login/consent screens)
- **Bring Your Own Identity**: Integrates with Ory Kratos or your user DB
- **Full Control**: Deploy anywhere, customize everything

**Example: OAuth 2.0 Authorization Code Flow**
\`\`\`typescript
// 1. Redirect user to Hydra's authorization endpoint
const authUrl = new URL('https://hydra.example.com/oauth2/auth');
authUrl.searchParams.set('client_id', 'my-client');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'openid profile email');
authUrl.searchParams.set('redirect_uri', 'https://app.example.com/callback');
authUrl.searchParams.set('state', generateRandomState());
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');

window.location.href = authUrl.toString();

// 2. Hydra redirects to YOUR login UI (you build this)
// Your UI authenticates user with Ory Kratos or your system

// 3. Your UI accepts login/consent, tells Hydra
await fetch('https://hydra.example.com/oauth2/auth/requests/login/accept', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'user-123',
    remember: true,
    remember_for: 3600
  })
});

// 4. Exchange code for tokens (standard OAuth)
const tokenResponse = await fetch('https://hydra.example.com/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: 'https://app.example.com/callback',
    client_id: 'my-client',
    code_verifier: codeVerifier
  })
});

const { access_token, id_token, refresh_token } = await tokenResponse.json();
\`\`\`

**When to Use:**
- Need self-hosted OAuth 2.0 provider
- Want full control and customization
- Building cloud-native microservices
- Require vendor-agnostic solution`,
    },
    {
      type: "text",
      title: "Vendor Comparison Matrix",
      content: `| Feature | Okta/Auth0 | Microsoft Entra | Google Identity | AWS Cognito | Ory Hydra |
|---------|------------|-----------------|-----------------|-------------|-----------|
| **Deployment** | SaaS | SaaS | SaaS | AWS-only SaaS | Self-hosted |
| **OIDC Certified** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PKCE Support** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Refresh Token Rotation** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Built-in UI** | ✅ | ✅ | ✅ | ✅ | ❌ (Headless) |
| **Social Login** | ✅ | ✅ | ✅ | ✅ | Via integration |
| **WebAuthn/Passkeys** | ✅ | ✅ | ✅ | ✅ | Via Kratos |
| **Customization** | Rules/Actions | Custom policies | Limited | Lambda triggers | Full control |
| **Pricing** | Per MAU | Per user | Per MAU | Per MAU | Free (OSS) |
| **Best For** | Fast CIAM | Microsoft shops | Mobile/Web apps | AWS ecosystem | Self-hosting |`,
    },
    {
      type: "text",
      title: "Implementation Decision Tree",
      content: `**Choose Okta/Auth0 if:**
- You need comprehensive CIAM + workforce IAM
- Want extensive integrations and marketplace
- Prefer developer-friendly APIs and SDKs

**Choose Microsoft Entra if:**
- You're in the Microsoft ecosystem (M365, Azure)
- Need enterprise features (Conditional Access)
- Want first-party passkeys integration

**Choose Google Identity if:**
- Building mobile or web applications
- Want Firebase integration
- Prioritize Google-quality UX

**Choose AWS Cognito if:**
- AWS is your primary cloud
- Need cost-effective solution at scale
- Want tight AWS service integration

**Choose Ory Hydra if:**
- Need full control and self-hosting
- Want vendor-agnostic solution
- Building cloud-native microservices
- Require customization beyond what SaaS offers`,
    },
  ],
  keyTakeaways: [
    "All major vendors implement OAuth 2.0, but with different APIs and conventions",
    "Okta/Auth0 focuses on developer experience and standards",
    "Microsoft Entra excels in enterprise features and M365 integration",
    "Google Identity Platform provides simple CIAM with Firebase",
    "AWS Cognito offers tight AWS integration with cost efficiency",
    "Ory Hydra provides open-source, self-hosted OAuth 2.0 compliance",
    "Choose vendors based on ecosystem fit, not just OAuth features",
  ],
}

export const oryHandsOnLab: Lesson = {
  id: "ory-hands-on-lab",
  title: "Advanced Lab: Build Your Own OAuth Server with Ory",
  slug: "ory-hands-on-lab",
  description:
    "Hands-on tutorial: Deploy Ory Hydra (OAuth 2.0 server) and Ory Kratos (Identity) locally with Docker to understand how OAuth providers work under the hood.",
  duration: 60,
  order: 8,
  content: [
    {
      type: "text",
      content: `# Advanced Lab: Build Your Own OAuth Server with Ory

**Goal:** Deploy a complete OAuth 2.0 + OIDC provider using Ory's open-source stack. You'll run Ory Hydra (authorization server) and Ory Kratos (identity management) locally, then implement a working OAuth flow.

**Time:** 60 minutes
**Difficulty:** Advanced
**Prerequisites:** Docker, basic command-line skills

**What You'll Learn:**
- How OAuth 2.0 authorization servers work internally
- The separation between identity (Kratos) and tokens (Hydra)
- Implementing login and consent flows
- Token issuance and validation`,
    },
    {
      type: "text",
      title: "Understanding the Ory Stack",
      content: `**Ory's Modular Architecture:**

1. **Ory Kratos** - Identity & User Management
   - Handles user registration, login, recovery
   - Supports passwords, social login, WebAuthn
   - No tokens—just identity verification

2. **Ory Hydra** - OAuth 2.0 & OIDC Provider
   - Issues access tokens, refresh tokens, ID tokens
   - OpenID Certified
   - Headless (no built-in UI)

3. **Ory Keto** - Authorization (Zanzibar-style)
   - Fine-grained permissions (we'll skip this for now)

4. **Ory Oathkeeper** - Zero Trust Proxy
   - Edge authentication/authorization (optional)

**Why This Separation?**
- **Flexibility**: Use any identity backend with Hydra
- **Standards**: Hydra only does OAuth/OIDC, nothing else
- **Scalability**: Scale identity and token services independently`,
    },
    {
      type: "code",
      title: "Step 1: Setup Project Structure",
      language: "bash",
      content: `# Create project directory
mkdir ory-oauth-lab
cd ory-oauth-lab

# Create subdirectories
mkdir -p hydra kratos consent-app

# We'll use Docker Compose to run everything
touch docker-compose.yml`,
    },
    {
      type: "code",
      title: "Step 2: Docker Compose Configuration",
      language: "yaml",
      content: `# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL for Hydra and Kratos
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ory
      POSTGRES_USER: ory
      POSTGRES_PASSWORD: secret
    networks:
      - ory

  # Ory Hydra - OAuth 2.0 Server
  hydra:
    image: oryd/hydra:v2.2.0
    depends_on:
      - postgres
    ports:
      - "4444:4444" # Public API
      - "4445:4445" # Admin API
    environment:
      DSN: postgres://ory:secret@postgres:5432/ory?sslmode=disable
      URLS_SELF_ISSUER: http://localhost:4444
      URLS_CONSENT: http://localhost:3000/consent
      URLS_LOGIN: http://localhost:3000/login
      URLS_LOGOUT: http://localhost:3000/logout
      SECRETS_SYSTEM: youReallyNeedToChangeThis
      OIDC_SUBJECT_IDENTIFIERS_SUPPORTED_TYPES: public
      OIDC_SUBJECT_IDENTIFIERS_PAIRWISE_SALT: youReallyNeedToChangeThis
    command: serve all --dev
    networks:
      - ory

  # Ory Kratos - Identity Management
  kratos:
    image: oryd/kratos:v1.1.0
    depends_on:
      - postgres
    ports:
      - "4433:4433" # Public API
      - "4434:4434" # Admin API
    environment:
      DSN: postgres://ory:secret@postgres:5432/ory?sslmode=disable
    volumes:
      - ./kratos:/etc/config/kratos
    command: serve -c /etc/config/kratos/kratos.yml --dev --watch-courier
    networks:
      - ory

networks:
  ory:
    driver: bridge`,
    },
    {
      type: "code",
      title: "Step 3: Configure Kratos",
      language: "yaml",
      content: `# Create kratos/kratos.yml
version: v1.1.0

dsn: postgres://ory:secret@postgres:5432/ory?sslmode=disable

serve:
  public:
    base_url: http://localhost:4433/
    cors:
      enabled: true
  admin:
    base_url: http://localhost:4434/

selfservice:
  default_browser_return_url: http://localhost:3000/
  allowed_return_urls:
    - http://localhost:3000

  methods:
    password:
      enabled: true
    oidc:
      enabled: false

  flows:
    error:
      ui_url: http://localhost:3000/error

    settings:
      ui_url: http://localhost:3000/settings

    recovery:
      enabled: true
      ui_url: http://localhost:3000/recovery

    verification:
      enabled: true
      ui_url: http://localhost:3000/verification

    logout:
      after:
        default_browser_return_url: http://localhost:3000/login

    login:
      ui_url: http://localhost:3000/login

    registration:
      ui_url: http://localhost:3000/registration

identity:
  default_schema_id: default
  schemas:
    - id: default
      url: file:///etc/config/kratos/identity.schema.json

courier:
  smtp:
    connection_uri: smtps://test:test@mailslurper:1025/?skip_ssl_verify=true`,
    },
    {
      type: "code",
      title: "Step 4: Kratos Identity Schema",
      language: "json",
      content: `// Create kratos/identity.schema.json
{
  "$id": "https://schemas.ory.sh/presets/kratos/identity.email.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Person",
  "type": "object",
  "properties": {
    "traits": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "format": "email",
          "title": "E-Mail",
          "ory.sh/kratos": {
            "credentials": {
              "password": {
                "identifier": true
              }
            },
            "verification": {
              "via": "email"
            },
            "recovery": {
              "via": "email"
            }
          }
        },
        "name": {
          "type": "object",
          "properties": {
            "first": {
              "type": "string",
              "title": "First Name"
            },
            "last": {
              "type": "string",
              "title": "Last Name"
            }
          }
        }
      },
      "required": ["email"],
      "additionalProperties": false
    }
  }
}`,
    },
    {
      type: "code",
      title: "Step 5: Start Services",
      language: "bash",
      content: `# Start Docker Compose
docker-compose up -d

# Wait for services to initialize (30 seconds)
sleep 30

# Run Hydra migrations
docker-compose exec hydra hydra migrate sql -e --yes

# Run Kratos migrations
docker-compose exec kratos kratos migrate sql -e --yes

# Create OAuth client in Hydra
docker-compose exec hydra hydra create client \\
  --endpoint http://localhost:4445 \\
  --id my-app \\
  --secret my-secret \\
  --grant-type authorization_code,refresh_token \\
  --response-type code \\
  --scope openid,profile,email,offline \\
  --redirect-uri http://localhost:3000/callback

# Verify services are running
curl http://localhost:4444/.well-known/openid-configuration
curl http://localhost:4433/health/ready`,
    },
    {
      type: "text",
      title: "Step 6: Build Consent App (Simplified)",
      content: `You need a small Node.js app to handle Hydra's login and consent redirects.

**Why?** Hydra is headless—it doesn't have login UI. When a user tries to authenticate:
1. Hydra redirects to YOUR login URL (\`/login?login_challenge=...`)
2. Your app shows login form (using Kratos)
3. After login, Hydra redirects to YOUR consent URL (\`/consent?consent_challenge=...`)
4. Your app shows consent screen
5. User approves, you tell Hydra, it issues tokens

This is the **key insight**: Hydra separates token issuance from identity.`,
    },
    {
      type: "code",
      title: "Minimal Consent App (Express.js)",
      language: "javascript",
      content: `// consent-app/server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const HYDRA_ADMIN = 'http://localhost:4445';

// Login endpoint
app.get('/login', async (req, res) => {
  const { login_challenge } = req.query;

  try {
    // Get login request info from Hydra
    const { data: loginRequest } = await axios.get(
      \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/login?login_challenge=\${login_challenge}\`
    );

    // If user already authenticated, skip login
    if (loginRequest.skip) {
      const { data: redirect } = await axios.put(
        \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/login/accept?login_challenge=\${login_challenge}\`,
        { subject: loginRequest.subject }
      );
      return res.redirect(redirect.redirect_to);
    }

    // Show simple login form (in real app, integrate Kratos)
    res.send(\`
      <h1>Login</h1>
      <form method="post" action="/login">
        <input type="hidden" name="challenge" value="\${login_challenge}" />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    \`);
  } catch (error) {
    res.status(500).send('Login error: ' + error.message);
  }
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { challenge, email } = req.body;

  try {
    // In real app: verify credentials with Kratos
    // For demo: auto-accept with email as subject

    const { data: redirect } = await axios.put(
      \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/login/accept?login_challenge=\${challenge}\`,
      {
        subject: email,
        remember: true,
        remember_for: 3600
      }
    );

    res.redirect(redirect.redirect_to);
  } catch (error) {
    res.status(500).send('Login acceptance error: ' + error.message);
  }
});

// Consent endpoint
app.get('/consent', async (req, res) => {
  const { consent_challenge } = req.query;

  try {
    const { data: consentRequest } = await axios.get(
      \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/consent?consent_challenge=\${consent_challenge}\`
    );

    // If consent already given, skip
    if (consentRequest.skip) {
      const { data: redirect } = await axios.put(
        \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/consent/accept?consent_challenge=\${consent_challenge}\`,
        {
          grant_scope: consentRequest.requested_scope,
          grant_access_token_audience: consentRequest.requested_access_token_audience
        }
      );
      return res.redirect(redirect.redirect_to);
    }

    // Show consent screen
    res.send(\`
      <h1>Authorize Application</h1>
      <p><strong>\${consentRequest.client.client_name || consentRequest.client.client_id}</strong> wants access to:</p>
      <ul>
        \${consentRequest.requested_scope.map(scope => \`<li>\${scope}</li>\`).join('')}
      </ul>
      <form method="post" action="/consent">
        <input type="hidden" name="challenge" value="\${consent_challenge}" />
        <button type="submit" name="submit" value="allow">Allow</button>
        <button type="submit" name="submit" value="deny">Deny</button>
      </form>
    \`);
  } catch (error) {
    res.status(500).send('Consent error: ' + error.message);
  }
});

// Handle consent decision
app.post('/consent', async (req, res) => {
  const { challenge, submit } = req.body;

  try {
    if (submit === 'allow') {
      const { data: consentRequest } = await axios.get(
        \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/consent?consent_challenge=\${challenge}\`
      );

      const { data: redirect } = await axios.put(
        \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/consent/accept?consent_challenge=\${challenge}\`,
        {
          grant_scope: consentRequest.requested_scope,
          grant_access_token_audience: consentRequest.requested_access_token_audience,
          remember: true,
          remember_for: 3600,
          session: {
            id_token: {
              email: consentRequest.subject
            }
          }
        }
      );

      res.redirect(redirect.redirect_to);
    } else {
      const { data: redirect } = await axios.put(
        \`\${HYDRA_ADMIN}/admin/oauth2/auth/requests/consent/reject?consent_challenge=\${challenge}\`,
        { error: 'access_denied', error_description: 'User denied consent' }
      );
      res.redirect(redirect.redirect_to);
    }
  } catch (error) {
    res.status(500).send('Consent handling error: ' + error.message);
  }
});

// OAuth callback (receives authorization code)
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for tokens
    const { data: tokens } = await axios.post(
      'http://localhost:4444/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:3000/callback',
        client_id: 'my-app',
        client_secret: 'my-secret'
      })
    );

    res.json({
      message: 'OAuth flow complete!',
      access_token: tokens.access_token,
      id_token: tokens.id_token,
      refresh_token: tokens.refresh_token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Consent app running on http://localhost:3000'));`,
    },
    {
      type: "code",
      title: "Step 7: Install Dependencies & Run",
      language: "bash",
      content: `cd consent-app

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express axios

# Run consent app
node server.js

# In another terminal, test OAuth flow:
open "http://localhost:4444/oauth2/auth?client_id=my-app&response_type=code&scope=openid+profile+email&redirect_uri=http://localhost:3000/callback&state=random123"`,
    },
    {
      type: "text",
      title: "Step 8: Test the Complete Flow",
      content: `**What Happens:**

1. **Authorization Request**: Browser opens Hydra's \`/oauth2/auth\` endpoint
2. **Login Redirect**: Hydra sees no session, redirects to \`http://localhost:3000/login?login_challenge=...\`
3. **User Authenticates**: Consent app shows login form, user enters email/password
4. **Accept Login**: Consent app tells Hydra "user authenticated as email@example.com"
5. **Consent Redirect**: Hydra redirects to \`http://localhost:3000/consent?consent_challenge=...\`
6. **User Approves**: Consent app shows "Allow" button, user clicks
7. **Accept Consent**: Consent app tells Hydra "user granted these scopes"
8. **Authorization Code**: Hydra redirects back to \`/callback?code=...\`
9. **Token Exchange**: Consent app exchanges code for tokens
10. **Success**: Displays access_token, id_token, refresh_token

**Inspect the Tokens:**
\`\`\`bash
# Decode ID token (JWT)
echo "YOUR_ID_TOKEN" | cut -d. -f2 | base64 -d | jq

# You'll see:
{
  "iss": "http://localhost:4444",
  "sub": "user@example.com",
  "aud": ["my-app"],
  "exp": 1234567890,
  "iat": 1234567800,
  "email": "user@example.com"
}
\`\`\``,
    },
    {
      type: "text",
      title: "Key Learnings from This Lab",
      content: `**1. OAuth Separation of Concerns**
- **Hydra**: Only handles OAuth/OIDC protocol and token issuance
- **Your Code**: Handles user authentication (login UI)
- **Result**: You can use ANY identity backend (Kratos, your database, LDAP)

**2. Challenge-Response Pattern**
- Hydra gives you challenges (login_challenge, consent_challenge)
- Your app resolves them (authenticate user, get consent)
- Hydra completes the flow (issues tokens)

**3. Why Headless?**
- **Flexibility**: Build any UX you want
- **Integration**: Works with existing identity systems
- **Standards**: Hydra purely implements OAuth/OIDC specs

**4. Production Considerations**
- Replace simple login form with Ory Kratos integration
- Add HTTPS (Hydra won't run in production without it)
- Use proper session management
- Implement PKCE for public clients
- Add rate limiting and monitoring

**5. Extending the Stack**
- Add **Ory Keto** for fine-grained authorization
- Add **Ory Oathkeeper** for API gateway authentication
- Integrate social login via Kratos OIDC method
- Enable WebAuthn/passkeys in Kratos`,
    },
    {
      type: "text",
      title: "Next Steps & Resources",
      content: `**Advanced Exercises:**
1. Integrate Ory Kratos for real identity management
2. Implement PKCE flow for a SPA client
3. Add refresh token rotation
4. Enable token introspection endpoint
5. Deploy to Kubernetes with Helm charts

**Official Ory Resources:**
- **Ory Documentation**: https://www.ory.sh/docs
- **Ory Hydra Guide**: https://www.ory.sh/docs/hydra
- **Ory Kratos Guide**: https://www.ory.sh/docs/kratos
- **Example Apps**: https://github.com/ory/examples
- **Community Forum**: https://github.com/ory/hydra/discussions

**Why This Matters:**
Understanding how OAuth providers work internally makes you a better IAM engineer. You'll:
- Debug OAuth issues faster
- Make better architectural decisions
- Understand vendor limitations
- Customize flows when needed`,
    },
    {
      type: "code",
      title: "Cleanup",
      language: "bash",
      content: `# Stop all containers
docker-compose down

# Remove volumes (deletes database)
docker-compose down -v

# Remove project
cd ..
rm -rf ory-oauth-lab`,
    },
  ],
  keyTakeaways: [
    "Ory Hydra is an OpenID Certified OAuth 2.0 provider you can self-host",
    "Headless architecture separates token issuance from identity management",
    "Login and consent challenges allow integration with any identity backend",
    "You control the UX by building your own login and consent screens",
    "This modular approach provides flexibility without vendor lock-in",
    "Understanding provider internals helps you work with any IAM system",
    "Production deployments require HTTPS, rate limiting, and proper session management",
  ],
}
