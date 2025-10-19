import type { Lesson } from "@/types"

/**
 * Passport.js Implementation Guide
 * Practical OAuth 2.0 implementation using the popular Node.js middleware
 */

export const passportOAuthLesson: Lesson = {
  id: "passport-oauth-guide",
  title: "Practical OAuth with Passport.js",
  slug: "passport-oauth-guide",
  description:
    "Learn to implement OAuth 2.0 authentication in Node.js applications using Passport.js, the de-facto standard authentication middleware.",
  duration: 45,
  order: 9,
  content: [
    {
      type: "text",
      content: `# Practical OAuth with Passport.js

**Passport.js** is the most popular authentication middleware for Node.js, with over 500 strategies for different authentication providers. It abstracts the complexity of OAuth flows while remaining flexible and unopinionated.

**Created by:** Jared Hanson
**GitHub:** https://github.com/jaredhanson/passport
**First Release:** 2011
**Weekly Downloads:** ~2 million (npm)`,
    },
    {
      type: "text",
      title: "Why Passport.js?",
      content: `**Philosophy: Minimal & Modular**

- **Unopinionated**: Works with any Express.js app structure
- **Strategy Pattern**: Each authentication method is a separate npm package
- **Flexible**: Doesn't lock you into sessions, databases, or frameworks
- **Battle-Tested**: Used by millions of production apps

**Core Concept: Strategies**

Passport uses "strategies" for different authentication methods:
- \`passport-oauth2\` - Generic OAuth 2.0
- \`passport-google-oauth20\` - Google OAuth
- \`passport-azure-ad\` - Microsoft Entra ID / Azure AD
- \`passport-github2\` - GitHub OAuth
- \`passport-saml\` - SAML 2.0
- \`passport-openidconnect\` - Generic OIDC
- And 500+ more...

Each strategy handles the protocol specifics while Passport manages sessions and user serialization.`,
    },
    {
      type: "code",
      title: "Setup: Install Passport",
      language: "bash",
      content: `# Core Passport
npm install passport passport-oauth2

# Express and session management
npm install express express-session

# Example: Google OAuth strategy
npm install passport-google-oauth20

# TypeScript types (optional)
npm install --save-dev @types/passport @types/express-session @types/passport-google-oauth20`,
    },
    {
      type: "code",
      title: "Basic Setup: Express + Passport",
      language: "typescript",
      content: `// server.ts
import express from 'express';
import session from 'express-session';
import passport from 'passport';

const app = express();

// 1. Configure session middleware (required for Passport)
app.use(session({
  secret: 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// 2. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 3. Serialize user into session
passport.serializeUser((user: any, done) => {
  // Store user ID in session
  done(null, user.id);
});

// 4. Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  // Retrieve user from database
  const user = await getUserById(id);
  done(null, user);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));`,
    },
    {
      type: "text",
      title: "Strategy 1: Google OAuth 2.0",
      content: `**Use Case:** "Sign in with Google" button

**What Passport Handles:**
1. Redirecting user to Google's authorization endpoint
2. Handling the callback with authorization code
3. Exchanging code for access token
4. Fetching user profile from Google
5. Calling your \`verify\` callback with user data

**What You Handle:**
- Finding/creating user in your database
- Deciding what user data to store
- Session management after authentication`,
    },
    {
      type: "code",
      title: "Google OAuth Strategy Configuration",
      language: "typescript",
      content: `// config/passport-google.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    // This callback is called after Google returns user info

    try {
      // 1. Check if user exists in your database
      let user = await findUserByGoogleId(profile.id);

      if (!user) {
        // 2. Create new user if first time
        user = await createUser({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          accessToken, // Optional: store for API calls
          refreshToken // Optional: for offline access
        });
      } else {
        // 3. Update existing user's tokens
        user = await updateUserTokens(user.id, { accessToken, refreshToken });
      }

      // 4. Pass user to Passport (will be serialized into session)
      done(null, user);
    } catch (error) {
      done(error, undefined);
    }
  }
));

// Database helper functions
async function findUserByGoogleId(googleId: string) {
  // Your database query
  return db.users.findOne({ where: { googleId } });
}

async function createUser(data: any) {
  return db.users.create(data);
}

async function updateUserTokens(userId: string, tokens: any) {
  return db.users.update(userId, tokens);
}`,
    },
    {
      type: "code",
      title: "Routes: Login & Callback",
      language: "typescript",
      content: `// routes/auth.ts
import express from 'express';
import passport from 'passport';

const router = express.Router();

// Route 1: Initiate Google OAuth
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    // Optional: request offline access for refresh token
    accessType: 'offline',
    prompt: 'consent'
  })
);

// Route 2: Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    // Success! User is now authenticated
    // req.user contains user object from verify callback
    res.redirect('/dashboard');
  }
);

// Route 3: Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Protected route example
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard',
    user: req.user
  });
});

// Middleware: Check if user is authenticated
function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

export default router;`,
    },
    {
      type: "text",
      title: "Strategy 2: Generic OAuth 2.0",
      content: `**Use Case:** Authenticate with any OAuth 2.0 provider (Okta, GitHub, custom IdP)

**Why Generic Strategy:**
- Provider doesn't have a dedicated Passport strategy
- You want more control over the flow
- Testing with custom OAuth servers (like Ory Hydra)

The \`passport-oauth2\` strategy works with any RFC 6749-compliant provider.`,
    },
    {
      type: "code",
      title: "Generic OAuth 2.0 Strategy",
      language: "typescript",
      content: `// config/passport-oauth2.ts
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

passport.use('custom-oauth', new OAuth2Strategy({
    authorizationURL: 'https://idp.example.com/oauth2/authorize',
    tokenURL: 'https://idp.example.com/oauth2/token',
    clientID: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/auth/callback',
    scope: ['openid', 'profile', 'email'],
    // PKCE support
    pkce: true,
    state: true
  },
  async (accessToken, refreshToken, params, profile, done) => {
    // params.id_token available if OIDC

    try {
      // 1. If OIDC, decode ID token for user info
      let userInfo;
      if (params.id_token) {
        userInfo = decodeJWT(params.id_token);
      } else {
        // 2. Otherwise, call UserInfo endpoint
        userInfo = await fetchUserInfo(accessToken);
      }

      // 3. Find or create user
      let user = await findUserByOAuthId(userInfo.sub);
      if (!user) {
        user = await createUser({
          oauthId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          accessToken,
          refreshToken
        });
      }

      done(null, user);
    } catch (error) {
      done(error, undefined);
    }
  }
));

// Fetch user info from UserInfo endpoint
async function fetchUserInfo(accessToken: string) {
  const response = await fetch('https://idp.example.com/oauth2/userinfo', {
    headers: { 'Authorization': \`Bearer \${accessToken}\` }
  });
  return response.json();
}

// Simple JWT decoder (use jsonwebtoken in production)
function decodeJWT(token: string) {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64').toString());
}`,
    },
    {
      type: "code",
      title: "Routes for Custom OAuth",
      language: "typescript",
      content: `// Initiate OAuth flow
router.get('/auth/custom',
  passport.authenticate('custom-oauth')
);

// Handle callback
router.get('/auth/callback',
  passport.authenticate('custom-oauth', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
  })
);`,
    },
    {
      type: "text",
      title: "Strategy 3: Multiple Providers",
      content: `**Real-World Pattern:** Support Google, Microsoft, and GitHub login

Passport makes it easy to configure multiple strategies simultaneously. Users can choose their preferred provider.`,
    },
    {
      type: "code",
      title: "Multi-Provider Configuration",
      language: "typescript",
      content: `// config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as AzureADStrategy } from 'passport-azure-ad-oauth2';

// Google
passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback'
}, verifyCallback));

// GitHub
passport.use('github', new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: '/auth/github/callback'
}, verifyCallback));

// Microsoft Azure AD
passport.use('azure', new AzureADStrategy({
  clientID: process.env.AZURE_CLIENT_ID!,
  clientSecret: process.env.AZURE_CLIENT_SECRET!,
  callbackURL: '/auth/azure/callback',
  tenant: 'common' // or specific tenant ID
}, verifyCallback));

// Unified verify callback
async function verifyCallback(
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: any
) {
  try {
    // Normalize profile data from different providers
    const normalizedProfile = {
      id: profile.id,
      email: profile.emails?.[0]?.value || profile.email,
      name: profile.displayName || profile.username,
      avatar: profile.photos?.[0]?.value || profile.avatar_url,
      provider: profile.provider
    };

    // Find user by provider and provider ID
    let user = await db.users.findOne({
      where: {
        provider: normalizedProfile.provider,
        providerId: normalizedProfile.id
      }
    });

    if (!user) {
      user = await db.users.create({
        ...normalizedProfile,
        providerId: normalizedProfile.id
      });
    }

    done(null, user);
  } catch (error) {
    done(error, undefined);
  }
}`,
    },
    {
      type: "code",
      title: "Multi-Provider Routes",
      language: "typescript",
      content: `// Login page with multiple options
router.get('/login', (req, res) => {
  res.send(\`
    <h1>Sign In</h1>
    <a href="/auth/google">Sign in with Google</a><br>
    <a href="/auth/github">Sign in with GitHub</a><br>
    <a href="/auth/azure">Sign in with Microsoft</a>
  \`);
});

// Google routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

// GitHub routes
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

// Azure routes
router.get('/auth/azure', passport.authenticate('azure'));
router.get('/auth/azure/callback',
  passport.authenticate('azure', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);`,
    },
    {
      type: "text",
      title: "Advanced: Token Refresh",
      content: `**Problem:** Access tokens expire, but you need to call APIs on behalf of the user

**Solution:** Use refresh tokens to get new access tokens automatically

Passport doesn't handle token refresh automatically—you need custom logic.`,
    },
    {
      type: "code",
      title: "Token Refresh Middleware",
      language: "typescript",
      content: `// middleware/refresh-token.ts
import axios from 'axios';

export async function refreshAccessToken(user: any) {
  if (!user.refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: user.refreshToken,
      grant_type: 'refresh_token'
    });

    // Update user's access token in database
    await db.users.update(user.id, {
      accessToken: response.data.access_token,
      // Some providers issue new refresh tokens
      refreshToken: response.data.refresh_token || user.refreshToken,
      tokenExpiresAt: Date.now() + (response.data.expires_in * 1000)
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

// Middleware to ensure valid token
export async function ensureValidToken(req: any, res: any, next: any) {
  if (!req.user) {
    return res.redirect('/login');
  }

  // Check if token expired
  if (req.user.tokenExpiresAt < Date.now()) {
    try {
      const newToken = await refreshAccessToken(req.user);
      req.user.accessToken = newToken;
    } catch (error) {
      // Refresh failed, require re-login
      return res.redirect('/login');
    }
  }

  next();
}

// Usage in routes
router.get('/api/calendar', ensureValidToken, async (req, res) => {
  // req.user.accessToken is guaranteed to be valid
  const events = await fetchGoogleCalendar(req.user.accessToken);
  res.json(events);
});`,
    },
    {
      type: "text",
      title: "Testing with Ory Hydra",
      content: `Passport works perfectly with self-hosted OAuth servers like Ory Hydra.

**Why Test Locally:**
- No rate limits or API quotas
- Full control over flows
- Test edge cases (token expiration, consent denial)
- Learn OAuth internals

Combine the Ory hands-on lab with Passport for a complete learning experience!`,
    },
    {
      type: "code",
      title: "Passport + Ory Hydra Integration",
      language: "typescript",
      content: `// config/passport-ory.ts
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

passport.use('ory-hydra', new OAuth2Strategy({
    // Endpoints from Ory Hydra
    authorizationURL: 'http://localhost:4444/oauth2/auth',
    tokenURL: 'http://localhost:4444/oauth2/token',
    clientID: 'my-app',
    clientSecret: 'my-secret',
    callbackURL: 'http://localhost:3000/auth/ory/callback',
    scope: ['openid', 'profile', 'email'],
    pkce: true // Ory Hydra supports PKCE
  },
  async (accessToken, refreshToken, params, profile, done) => {
    // params.id_token contains OIDC ID token
    const idToken = decodeJWT(params.id_token);

    // Find or create user based on subject
    let user = await findUserBySub(idToken.sub);
    if (!user) {
      user = await createUser({
        sub: idToken.sub,
        email: idToken.email,
        name: idToken.name
      });
    }

    done(null, user);
  }
));

// Routes
router.get('/auth/ory', passport.authenticate('ory-hydra'));
router.get('/auth/ory/callback',
  passport.authenticate('ory-hydra', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);`,
    },
    {
      type: "text",
      title: "Common Patterns & Best Practices",
      content: `**1. Session vs JWT**
Passport traditionally uses sessions, but you can adapt it for JWT:

\`\`\`typescript
// Skip session serialization for JWT
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Issue JWT after authentication
app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, 'secret');
    res.json({ token });
  }
);
\`\`\`

**2. Error Handling**
\`\`\`typescript
passport.use(new GoogleStrategy({ /* ... */ },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile);
      done(null, user);
    } catch (error) {
      // Pass error to Passport
      done(error, undefined);
    }
  }
));
\`\`\`

**3. Profile Normalization**
Different providers return different profile structures. Normalize them:

\`\`\`typescript
function normalizeProfile(profile: any) {
  return {
    id: profile.id,
    email: profile.emails?.[0]?.value || profile.email || profile._json?.email,
    name: profile.displayName || profile.username || \`\${profile.name?.givenName} \${profile.name?.familyName}\`,
    avatar: profile.photos?.[0]?.value || profile.avatar_url
  };
}
\`\`\`

**4. Account Linking**
Allow users to link multiple OAuth providers to one account:

\`\`\`typescript
async function linkProvider(userId: string, provider: string, providerId: string) {
  await db.linkedAccounts.create({
    userId,
    provider,
    providerId
  });
}
\`\`\``,
    },
    {
      type: "text",
      title: "Passport vs Modern Alternatives",
      content: `**Passport.js (2011):**
- ✅ Mature, battle-tested
- ✅ 500+ strategies
- ✅ Works with any Node.js framework
- ⚠️  Session-first (can use JWT but requires adaptation)
- ⚠️  No TypeScript-first design

**Next-Auth / Auth.js (2020):**
- ✅ Built for Next.js, Svelte, etc.
- ✅ TypeScript-first
- ✅ JWT by default
- ⚠️  Fewer providers than Passport
- ⚠️  Next.js-centric

**Lucia Auth (2023):**
- ✅ Modern, minimal
- ✅ Framework-agnostic
- ✅ TypeScript-native
- ⚠️  Fewer strategies (you build your own)

**When to Use Passport:**
- Express.js application
- Need specific provider (check passport.org/packages)
- Want session-based auth
- Prefer proven solutions`,
    },
  ],
  keyTakeaways: [
    "Passport.js uses a strategy pattern with 500+ authentication providers",
    "Each strategy handles protocol specifics (OAuth, OIDC, SAML)",
    "You control user storage, session management, and business logic",
    "Generic OAuth2Strategy works with any RFC 6749-compliant provider",
    "Multiple providers can coexist (Google, GitHub, Microsoft, custom)",
    "Token refresh requires custom middleware (not handled by Passport)",
    "Passport works with self-hosted OAuth servers like Ory Hydra",
    "Normalize profile data from different providers for consistency",
  ],
}
