/**
 * Module 9: Applied Applications - Real-World Case Studies
 *
 * This module examines real-world implementations of authentication and authorization
 * principles through case studies of LazorKit, Privy, Supabase Auth, and other platforms,
 * demonstrating how the theoretical concepts from previous modules are applied in production.
 */

import type { Module } from "@/types"

export const appliedApplicationsModule: Module = {
  id: "applied-applications",
  slug: "applied-applications",
  title: "Applied Applications: Real-World Case Studies",
  description:
    "Explore how authentication and authorization principles are implemented in production through comprehensive case studies of LazorKit, Privy, Supabase Auth, and Web3 authentication platforms.",
  icon: "🛠️",
  difficulty: "advanced",
  estimatedHours: 3.5,
  prerequisiteModules: ["auth-fundamentals", "oauth2", "oidc", "fido2"],
  learningObjectives: [
    "Analyze how theoretical IAM concepts are applied in production systems",
    "Compare and contrast different authentication architecture approaches",
    "Understand Web3 wallet authentication and embedded wallet security",
    "Evaluate trade-offs in authentication platform selection",
    "Learn from real-world implementation patterns and best practices",
    "Apply course principles to practical authentication challenges"
  ],
  badge: {
    id: "applied-applications-expert",
    name: "Applied Applications Expert",
    description:
      "Mastered real-world authentication implementations and can evaluate and apply IAM solutions in production contexts",
    icon: "🛠️"
  },
  lessons: [
    {
      id: "supabase-auth-case-study",
      slug: "supabase-auth-case-study",
      title: "Supabase Auth: Open-Source Authentication Platform",
      description:
        "Deep dive into Supabase Auth's comprehensive authentication system supporting email/password, passwordless, OAuth, and Web3 wallets",
      estimatedMinutes: 50,
      content: [
        {
          type: "text",
          title: "Supabase Auth Overview",
          content: `
## What is Supabase Auth?

**Supabase Auth** is an open-source authentication solution that's part of the larger Supabase Backend-as-a-Service (BaaS) platform. It provides a **comprehensive, database-integrated authentication system** that bridges traditional web2 authentication with modern web3 wallet-based authentication.

### The Supabase Philosophy

**Core Principle:** Use **PostgreSQL at the core** and leverage Postgres' built-in authentication functionality wherever possible.

\`\`\`
Traditional Auth Stack               Supabase Stack
├─ Auth Service (Auth0)             ├─ Supabase Auth
├─ User Database (MySQL)            ├─ PostgreSQL (all-in-one)
├─ Session Store (Redis)            ├─ Postgres (sessions)
├─ Email Service (SendGrid)         ├─ Integrated
└─ Analytics (Mixpanel)             └─ Postgres (analytics)

Result: 5 services → 1 service
\`\`\`

**Why this matters:**
- Simplified stack (fewer moving parts)
- Cohesive developer experience
- Lower costs (no per-service fees)
- Built-in database integration

## Authentication Methods Supported

Supabase Auth supports a **comprehensive suite** of authentication methods:

### 1. Email & Password
**Traditional authentication** with secure password hashing (bcrypt):

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password-123',
  options: {
    data: {
      first_name: 'Alice',
      age: 27
    }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password-123'
})
\`\`\`

### 2. Passwordless Authentication

**Magic Links** (email-based) and **OTP** (email or SMS):

\`\`\`typescript
// Magic link (email)
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://example.com/welcome'
  }
})

// OTP via email
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    shouldCreateUser: true
  }
})

// OTP via SMS
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890',
})
\`\`\`

**How it works:**
- **Magic Link:** User clicks link in email → automatic sign-in
- **OTP:** User enters 6-digit code → verified sign-in
- **Auto-signup:** If user doesn't exist, automatically create account

### 3. OAuth Providers

**Social logins** with 20+ providers:

\`\`\`typescript
// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://example.com/auth/callback'
  }
})

// Sign in with GitHub
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'repo user'
  }
})
\`\`\`

**Supported Providers:**
- Google, GitHub, GitLab, Bitbucket
- Apple, Facebook, Twitter, Discord
- Azure, AWS Cognito, LinkedIn
- Slack, Spotify, Notion, Zoom
- And many more (20+ total)

### 4. Web3 Wallet Authentication (NEW in 2024)

**Sign in with Ethereum or Solana wallets** using EIP-4361 (Sign-In with Ethereum):

\`\`\`typescript
// Sign in with Ethereum wallet (MetaMask, WalletConnect, etc.)
const { data, error } = await supabase.auth.signInWithWeb3({
  chain: 'ethereum',
  statement: 'I accept the Terms of Service at https://example.com/tos',
})

// Sign in with Solana wallet (Phantom, Solflare, etc.)
const { data, error } = await supabase.auth.signInWithWeb3({
  chain: 'solana',
  statement: 'I accept the Terms of Service at https://example.com/tos',
})
\`\`\`

**How it works (EIP-4361 standard):**
1. App requests signature from wallet
2. Wallet presents message to user
3. User approves and signs message with private key
4. Supabase Auth verifies signature
5. Session created for wallet address

**Important:** Web3 wallet users **won't have an email/phone** associated with their account.

## Architecture: How Supabase Auth Works

### The Authentication Flow

\`\`\`
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ 1. signInWithPassword()
       ↓
┌─────────────────────────────┐
│   Supabase Auth (GoTrue)    │
│                             │
│  ┌──────────────────────┐  │
│  │ Verify credentials   │  │
│  └──────────────────────┘  │
│           ↓                 │
│  ┌──────────────────────┐  │
│  │ Generate JWT tokens  │  │
│  │ - Access Token       │  │
│  │ - Refresh Token      │  │
│  └──────────────────────┘  │
└──────────┬──────────────────┘
           │ 2. Return tokens
           ↓
    ┌─────────────┐
    │ PostgreSQL  │
    │             │
    │ auth.users  │
    │ auth.sessions│
    └─────────────┘
\`\`\`

### Key Components

**1. GoTrue (Auth Service)**
- Written in **Go** for performance
- Handles authentication logic
- Issues JWT tokens
- Manages sessions

**2. PostgreSQL Database**
- Stores user accounts in \`auth.users\` table
- Stores sessions in \`auth.sessions\` table
- Built-in Row Level Security (RLS)

**3. JWT Tokens**
- **Access Token:** Short-lived (1 hour), used for API requests
- **Refresh Token:** Long-lived (reusable), used to get new access tokens

**4. Row Level Security (RLS)**
Postgres feature that restricts data access:

\`\`\`sql
-- Only allow users to read their own data
CREATE POLICY "Users can view own data"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to update their own data
CREATE POLICY "Users can update own data"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);
\`\`\`

## Web3 Authentication Deep Dive

### The Problem Supabase Auth Solves

**Traditional approach (manual Web3 auth):**
\`\`\`
1. Connect wallet (MetaMask)
2. Generate nonce (random challenge)
3. Store nonce in database
4. Request signature from wallet
5. Verify signature server-side
6. Check nonce hasn't been reused
7. Create session manually
8. Implement token refresh logic
9. Handle wallet disconnection
10. Clean up stale sessions

Result: 100+ lines of code, security pitfalls
\`\`\`

**Supabase Auth approach:**
\`\`\`typescript
const { data, error } = await supabase.auth.signInWithWeb3({
  chain: 'ethereum'
})

Result: 3 lines of code, production-ready
\`\`\`

### EIP-4361: Sign-In with Ethereum Standard

**What is EIP-4361?**

A standard for **off-chain authentication** using Ethereum accounts. Instead of on-chain transactions (expensive gas fees), users sign a message **off-chain** to prove ownership.

**Message Format:**
\`\`\`
example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

I accept the Terms of Service at https://example.com/tos

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: 32891756
Issued At: 2025-01-15T12:34:56.789Z
Expiration Time: 2025-01-15T13:34:56.789Z
\`\`\`

**Why this is secure:**
- Message includes **domain** (prevents phishing)
- Message includes **nonce** (prevents replay attacks)
- Message includes **expiration** (limited validity)
- Signature proves **wallet ownership** without revealing private key

### Implementation Example

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function signInWithWallet() {
  // 1. Check if wallet is available
  if (typeof window.ethereum === 'undefined') {
    throw new Error('No Ethereum wallet found. Install MetaMask.')
  }

  // 2. Request wallet connection
  const provider = new ethers.BrowserProvider(window.ethereum)
  const accounts = await provider.send('eth_requestAccounts', [])
  const address = accounts[0]

  console.log('Connected wallet:', address)

  // 3. Sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithWeb3({
    chain: 'ethereum',
    statement: 'I accept the Terms of Service at https://example.com/tos',
  })

  if (error) {
    console.error('Authentication failed:', error)
    return
  }

  console.log('Authenticated user:', data.user)
  console.log('Session:', data.session)

  // 4. User is now signed in!
  // Access token is automatically included in all Supabase requests
}

// Listen for account changes
window.ethereum.on('accountsChanged', async (accounts) => {
  if (accounts.length === 0) {
    // User disconnected wallet
    await supabase.auth.signOut()
  } else {
    // User switched accounts
    await signInWithWallet()
  }
})
\`\`\`

### Security Considerations

**Rate Limiting:**
- Default: **30 Web3 logins per 5 minutes per IP address**
- Configurable in dashboard
- Prevents brute-force attacks

**CAPTCHA Protection:**
- Enable CAPTCHA for Web3 sign-ins
- Prevents automated abuse
- Important because creating Web3 wallets is **free and easy to automate**

**No Email/Phone:**
- Web3 wallet users have **no email or phone number**
- Can't recover account via email/SMS
- Wallet = sole authentication method

**Recommendation:** Allow users to **link email** after Web3 sign-in:

\`\`\`typescript
// After Web3 sign-in, prompt user to add email
const { error } = await supabase.auth.updateUser({
  email: 'user@example.com'
})

// Now they can recover via email if wallet is lost
\`\`\`

## Comparison to Other Platforms

### Supabase Auth vs Auth0

| Feature | Supabase Auth | Auth0 |
|---------|---------------|-------|
| **Pricing** | $25/mo (50K MAU) | ~$1,500/mo (10K MAU) |
| **Free Tier** | 50,000 MAU | 7,000 MAU |
| **Open Source** | ✅ Yes | ❌ No |
| **Database Integration** | ✅ Native (Postgres) | ⚠️ External |
| **Web3 Wallets** | ✅ Native | ⚠️ Via extensions |
| **Self-Hosting** | ✅ Yes | ❌ No |
| **Enterprise SSO** | ✅ SAML | ✅ SAML + more |
| **Best For** | Startups, SMBs, Web3 | Enterprise |

**Key Insight:** Supabase is **60x cheaper** for 50K MAU than Auth0.

### Supabase Auth vs Privy

| Feature | Supabase Auth | Privy |
|---------|---------------|-------|
| **Primary Focus** | Full-stack BaaS | Web3 wallet onboarding |
| **Embedded Wallets** | ❌ No | ✅ Yes (MPC-based) |
| **Web3 Wallet Sign-In** | ✅ Yes | ✅ Yes |
| **OAuth/Social** | ✅ Yes (20+ providers) | ✅ Yes (10+ providers) |
| **Database** | ✅ Included (Postgres) | ❌ Bring your own |
| **Pricing** | Pay-per-use | Custom (higher) |
| **Progressive Onboarding** | ⚠️ Manual | ✅ Built-in |
| **Best For** | Web2 + Web3 hybrid apps | Pure Web3 dApps |

**Key Insight:** Privy is **specialized for Web3**, Supabase is **general-purpose with Web3 support**.

## Real-World Use Cases

### Use Case 1: Hybrid Social + Web3 App

**Scenario:** NFT marketplace where users can sign in with Google OR their Ethereum wallet

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Option 1: Sign in with Google
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

// Option 2: Sign in with Ethereum wallet
async function signInWithEthereum() {
  const { data, error } = await supabase.auth.signInWithWeb3({
    chain: 'ethereum'
  })
}

// Check current user
const { data: { user } } = await supabase.auth.getUser()

if (user) {
  console.log('User ID:', user.id)
  console.log('Email:', user.email) // Only for OAuth users
  console.log('Wallet:', user.user_metadata?.wallet_address) // Only for Web3 users

  // Fetch user's NFT collection
  const { data: nfts } = await supabase
    .from('nfts')
    .select('*')
    .eq('owner_id', user.id)
}
\`\`\`

### Use Case 2: Passwordless SaaS with Magic Links

**Scenario:** B2B SaaS tool with magic link authentication (no passwords)

\`\`\`typescript
// Send magic link
async function sendMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://app.example.com/dashboard'
    }
  })

  if (error) {
    console.error('Failed to send magic link:', error)
    return
  }

  console.log('Magic link sent to:', email)
}

// User clicks link in email, automatically signed in
// On redirect:
const { data: { session } } = await supabase.auth.getSession()

if (session) {
  // User is authenticated!
  console.log('Logged in as:', session.user.email)
}
\`\`\`

### Use Case 3: Multi-Tenant App with Row-Level Security

**Scenario:** Project management tool where users can only see their team's data

\`\`\`sql
-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see projects in their team
CREATE POLICY "Team members can view team projects"
  ON projects
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id
      FROM team_members
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Team admins can delete projects
CREATE POLICY "Team admins can delete projects"
  ON projects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM team_members
      WHERE user_id = auth.uid()
        AND team_id = projects.team_id
        AND role = 'admin'
    )
  );
\`\`\`

**Client code:**
\`\`\`typescript
// RLS is enforced automatically!
const { data: projects } = await supabase
  .from('projects')
  .select('*')
// Only returns projects user has access to
\`\`\`

## Key Takeaways

1. **Supabase Auth is a comprehensive, open-source authentication platform** that supports email/password, passwordless (magic links, OTP), OAuth (20+ providers), and Web3 wallets (Ethereum, Solana)

2. **Database-first approach** using PostgreSQL provides unified data model, built-in Row Level Security, and simplified stack

3. **Web3 authentication uses EIP-4361** (Sign-In with Ethereum) for off-chain, gasless wallet-based authentication

4. **Significantly cheaper than competitors** (60x cheaper than Auth0 for 50K MAU) while being open-source and self-hostable

5. **Best for hybrid apps** that need both traditional web2 authentication and modern web3 wallet support

6. **Row Level Security (RLS)** enables database-level authorization tied directly to authentication

**Next:** We'll explore Privy's embedded wallet approach and LazorKit's Solana-specific passkey solution.
          `
        },
        {
          type: "code",
          title: "Complete Supabase Auth Implementation",
          language: "typescript",
          code: `/**
 * Complete Supabase Auth Implementation
 * Demonstrates email/password, magic links, OAuth, and Web3 wallet authentication
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'
import { ethers } from 'ethers'

// Initialize Supabase client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Authentication Service
 * Handles all authentication methods
 */
class SupabaseAuthService {
  private client: SupabaseClient

  constructor(client: SupabaseClient) {
    this.client = client
  }

  /**
   * Email/Password Authentication
   */
  async signUpWithEmail(email: string, password: string, userData?: any) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: userData, // Custom user metadata
        emailRedirectTo: \`\${window.location.origin}/auth/callback\`
      }
    })

    if (error) {
      console.error('Sign up failed:', error.message)
      throw error
    }

    console.log('✅ User registered:', data.user?.email)
    return data
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Sign in failed:', error.message)
      throw error
    }

    console.log('✅ Signed in as:', data.user.email)
    return data
  }

  /**
   * Passwordless Authentication (Magic Links)
   */
  async sendMagicLink(email: string) {
    const { data, error } = await this.client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: \`\${window.location.origin}/dashboard\`,
        shouldCreateUser: true // Auto-signup if user doesn't exist
      }
    })

    if (error) {
      console.error('Failed to send magic link:', error.message)
      throw error
    }

    console.log('📧 Magic link sent to:', email)
    return data
  }

  /**
   * OTP Authentication (Email or SMS)
   */
  async sendEmailOTP(email: string) {
    const { data, error } = await this.client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    })

    if (error) {
      console.error('Failed to send OTP:', error.message)
      throw error
    }

    console.log('📱 OTP sent to email:', email)
    return data
  }

  async verifyOTP(email: string, token: string) {
    const { data, error } = await this.client.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })

    if (error) {
      console.error('OTP verification failed:', error.message)
      throw error
    }

    console.log('✅ OTP verified, signed in as:', data.user?.email)
    return data
  }

  /**
   * OAuth Authentication (Social Logins)
   */
  async signInWithGoogle() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: \`\${window.location.origin}/auth/callback\`,
        scopes: 'email profile'
      }
    })

    if (error) {
      console.error('Google sign in failed:', error.message)
      throw error
    }

    console.log('🔗 Redirecting to Google...')
    return data
  }

  async signInWithGitHub() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: \`\${window.location.origin}/auth/callback\`,
        scopes: 'user:email'
      }
    })

    if (error) {
      console.error('GitHub sign in failed:', error.message)
      throw error
    }

    console.log('🔗 Redirecting to GitHub...')
    return data
  }

  /**
   * Web3 Wallet Authentication (Ethereum)
   */
  async signInWithEthereum() {
    // 1. Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
    }

    try {
      // 2. Request wallet connection
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0]

      console.log('🦊 Connected to wallet:', address)

      // 3. Authenticate with Supabase
      const { data, error } = await this.client.auth.signInWithWeb3({
        chain: 'ethereum',
        statement: 'Sign in to MyApp with your Ethereum wallet',
      })

      if (error) {
        console.error('Web3 authentication failed:', error.message)
        throw error
      }

      console.log('✅ Authenticated with wallet:', address)
      console.log('User ID:', data.user?.id)

      return data
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request')
      }
      throw error
    }
  }

  /**
   * Web3 Wallet Authentication (Solana)
   */
  async signInWithSolana() {
    // Check if Phantom wallet is installed
    if (typeof window.solana === 'undefined') {
      throw new Error('Phantom wallet is not installed. Please install Phantom to continue.')
    }

    try {
      // Connect to Phantom wallet
      const resp = await window.solana.connect()
      const publicKey = resp.publicKey.toString()

      console.log('👻 Connected to Phantom:', publicKey)

      // Authenticate with Supabase
      const { data, error } = await this.client.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'Sign in to MyApp with your Solana wallet',
      })

      if (error) {
        console.error('Solana authentication failed:', error.message)
        throw error
      }

      console.log('✅ Authenticated with Solana wallet:', publicKey)
      return data
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request')
      }
      throw error
    }
  }

  /**
   * Session Management
   */
  async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await this.client.auth.getSession()

    if (error) {
      console.error('Failed to get session:', error.message)
      return null
    }

    return session
  }

  async getUser(): Promise<User | null> {
    const { data: { user }, error } = await this.client.auth.getUser()

    if (error) {
      console.error('Failed to get user:', error.message)
      return null
    }

    return user
  }

  async refreshSession() {
    const { data, error } = await this.client.auth.refreshSession()

    if (error) {
      console.error('Failed to refresh session:', error.message)
      throw error
    }

    console.log('✅ Session refreshed')
    return data.session
  }

  async signOut() {
    const { error } = await this.client.auth.signOut()

    if (error) {
      console.error('Sign out failed:', error.message)
      throw error
    }

    console.log('✅ Signed out successfully')
  }

  /**
   * Account Management
   */
  async updateUserEmail(newEmail: string) {
    const { data, error } = await this.client.auth.updateUser({
      email: newEmail
    })

    if (error) {
      console.error('Failed to update email:', error.message)
      throw error
    }

    console.log('✅ Email updated to:', newEmail)
    console.log('⚠️  Confirmation email sent, please verify')
    return data
  }

  async updateUserPassword(newPassword: string) {
    const { data, error } = await this.client.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Failed to update password:', error.message)
      throw error
    }

    console.log('✅ Password updated successfully')
    return data
  }

  async resetPasswordRequest(email: string) {
    const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: \`\${window.location.origin}/auth/reset-password\`
    })

    if (error) {
      console.error('Failed to send reset email:', error.message)
      throw error
    }

    console.log('📧 Password reset email sent to:', email)
    return data
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = this.client.auth.onAuthStateChange(callback)
    return subscription
  }
}

/**
 * Example Usage
 */
async function demonstrateSupabaseAuth() {
  const authService = new SupabaseAuthService(supabase)

  console.log('\\n=== Supabase Auth Demo ===\\n')

  // 1. Email/Password Sign Up
  try {
    await authService.signUpWithEmail('alice@example.com', 'secure-password-123', {
      first_name: 'Alice',
      last_name: 'Anderson'
    })
  } catch (error) {
    console.log('User might already exist, trying sign in...')
  }

  // 2. Email/Password Sign In
  await authService.signInWithEmail('alice@example.com', 'secure-password-123')

  // 3. Get current user
  const user = await authService.getUser()
  console.log('\\nCurrent user:', user?.email)

  // 4. Get current session
  const session = await authService.getSession()
  console.log('Access token (first 50 chars):', session?.access_token.substring(0, 50) + '...')

  // 5. Sign out
  await authService.signOut()

  console.log('\\n=== Demo Complete ===\\n')
}

// Run demo
demonstrateSupabaseAuth().catch(console.error)

// Export for use in React components
export { SupabaseAuthService, supabase }

/**
 * React Hook Example
 */
/*
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase-auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
*/`
        }
      ],
      quiz: {
        id: "supabase-auth-quiz",
        title: "Supabase Auth Quiz",
        description: "Test your understanding of Supabase Auth implementation and features",
        passingScore: 70,
        questions: [
          {
            id: "sup-q1",
            question: "What is the core philosophy behind Supabase Auth's architecture?",
            options: [
              "Use microservices for each authentication method",
              "Leverage PostgreSQL at the core for authentication, sessions, and data storage",
              "Build everything from scratch without dependencies",
              "Use Redis for all session management"
            ],
            correctAnswer: 1,
            explanation: "Supabase Auth's core philosophy is to use PostgreSQL at the core and leverage Postgres' built-in authentication functionality wherever possible. This approach simplifies the stack (fewer services), provides cohesive developer experience, lowers costs, and enables built-in database integration with features like Row Level Security."
          },
          {
            id: "sup-q2",
            question: "Which authentication methods does Supabase Auth support?",
            options: [
              "Only email and password",
              "Email/password, passwordless (magic links, OTP), OAuth (20+ providers), and Web3 wallets (Ethereum, Solana)",
              "Only OAuth providers",
              "Only Web3 wallets"
            ],
            correctAnswer: 1,
            explanation: "Supabase Auth is comprehensive, supporting: (1) Email/password with bcrypt hashing, (2) Passwordless via magic links and OTP (email/SMS), (3) OAuth with 20+ providers (Google, GitHub, Apple, etc.), and (4) Web3 wallet authentication for Ethereum and Solana using the EIP-4361 standard."
          },
          {
            id: "sup-q3",
            question: "How does Supabase Auth implement Web3 wallet authentication?",
            options: [
              "By storing private keys on the server",
              "Using EIP-4361 (Sign-In with Ethereum) for off-chain signature verification",
              "By requiring on-chain transactions with gas fees",
              "By creating new wallet addresses for users"
            ],
            correctAnswer: 1,
            explanation: "Supabase Auth uses EIP-4361 (Sign-In with Ethereum) standard for off-chain authentication. Users sign a message with their wallet (no gas fees), which includes domain, nonce, and expiration. Supabase Auth verifies the signature cryptographically to prove wallet ownership without needing on-chain transactions or exposing private keys."
          },
          {
            id: "sup-q4",
            question: "What is a key security concern with Web3 wallet authentication in Supabase?",
            options: [
              "Wallet users have no email or phone number associated with their account",
              "It's more expensive than traditional auth",
              "It requires blockchain transactions",
              "Private keys are stored on Supabase servers"
            ],
            correctAnswer: 0,
            explanation: "Web3 wallet users authenticate using only their wallet address, which means they have no email or phone number associated with their account. This can open projects to abuse since creating Web3 wallets is free and easy to automate. Supabase recommends rate limiting, CAPTCHA protection, and encouraging users to link an email after wallet sign-in for account recovery."
          },
          {
            id: "sup-q5",
            question: "How does Supabase Auth's Row Level Security (RLS) integrate with authentication?",
            options: [
              "RLS is a separate system unrelated to authentication",
              "RLS policies use auth.uid() to automatically restrict database access based on the authenticated user",
              "RLS only works with email/password authentication",
              "RLS requires manual token verification in application code"
            ],
            correctAnswer: 1,
            explanation: "Row Level Security (RLS) is a PostgreSQL feature that integrates directly with Supabase Auth. Policies can use auth.uid() to get the current authenticated user's ID and restrict data access at the database level. This means authorization is enforced automatically by Postgres, not in application code, providing a secure and maintainable approach to multi-tenancy and data isolation."
          },
          {
            id: "sup-q6",
            question: "What is Supabase Auth's pricing advantage compared to Auth0?",
            options: [
              "Slightly cheaper by 10-20%",
              "Approximately 60x cheaper for 50,000 MAU ($25/mo vs ~$1,500/mo)",
              "Same pricing but better features",
              "More expensive but worth it"
            ],
            correctAnswer: 1,
            explanation: "Supabase Auth is dramatically cheaper than Auth0: $25/month for 50,000 MAU on Supabase vs approximately $1,500/month for the same usage on Auth0 - roughly 60x cheaper. Supabase also offers a generous free tier with 50,000 MAU (vs Auth0's 7,000 MAU free tier), is open-source, and self-hostable, making it particularly attractive for startups and SMBs."
          }
        ]
      }
    },
    {
      id: "privy-embedded-wallets",
      slug: "privy-embedded-wallets",
      title: "Privy: Embedded Wallets & Progressive Onboarding",
      description:
        "Explore Privy's approach to Web3 authentication with embedded wallets, MPC-based security, and seamless Web2-to-Web3 user onboarding",
      estimatedMinutes: 60,
      content: [
        {
          type: "text",
          title: "Privy Embedded Wallets Overview",
          content: `
## What is Privy?

**Privy** is a **Web3-native authentication platform** that specializes in **embedded wallets** and **progressive onboarding** - making it easy to onboard Web2 users into Web3 applications without requiring them to install MetaMask or understand seed phrases.

### The Core Problem Privy Solves

**Traditional Web3 onboarding friction:**
\`\`\`
User wants to use your dApp
  ↓
"Install MetaMask" → User abandons (60% drop-off)
  ↓
"Create wallet" → User confused about seed phrases (30% drop-off)
  ↓
"Write down 12 words" → User loses paper (20% drop-off)
  ↓
"Buy crypto for gas" → User gives up (50% drop-off)
  ↓
RESULT: 95% abandonment rate
\`\`\`

**Privy's approach:**
\`\`\`
User wants to use your dApp
  ↓
"Sign in with Google" → Instant sign-in (90% success)
  ↓
Embedded wallet auto-created (invisible to user)
  ↓
User starts using dApp immediately
  ↓
Later: "Link your MetaMask for advanced features" (optional)
  ↓
RESULT: 90% conversion rate
\`\`\`

### What are Embedded Wallets?

**Embedded wallets** are blockchain wallets that:
- Are **created and managed by the application** (not a browser extension)
- Use **Web2 authentication** (email, Google, Twitter) as the entry point
- Store **private keys securely** using MPC (Multi-Party Computation)
- Provide **gasless transactions** (app pays gas fees)
- Enable **progressive onboarding** (start simple, add complexity later)

**Key Insight:** Users don't need to know they have a wallet. They just "sign in with Google" and can interact with blockchain apps immediately.

## Privy's Architecture

### High-Level Flow

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                      User's Browser                      │
│                                                          │
│  1. Sign in with Google                                 │
│     ↓                                                    │
│  2. Privy SDK creates embedded wallet                   │
│     ↓                                                    │
│  3. Private key sharded across 3 locations              │
│     ↓                                                    │
│  4. User can sign transactions                          │
└─────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
    ┌────────┐          ┌─────────┐         ┌──────────┐
    │ Shard 1│          │ Shard 2 │         │ Shard 3  │
    │ (TEE)  │          │ (TEE)   │         │ (Browser)│
    │ Privy  │          │ Privy   │         │ Local    │
    └────────┘          └─────────┘         └──────────┘

    Key reconstruction requires 2 of 3 shards
    Single shard compromise = wallet is safe
\`\`\`

### Multi-Party Computation (MPC) Explained

**Traditional wallet:**
\`\`\`
Private Key → Single Point of Failure
If stolen → Wallet compromised
If lost → Wallet unrecoverable
\`\`\`

**MPC-based wallet (Privy):**
\`\`\`
Private Key split into 3 shards using Shamir's Secret Sharing:
- Shard 1: Privy TEE (AWS Nitro Enclave)
- Shard 2: Privy TEE (different region)
- Shard 3: User's device (encrypted in browser storage)

To sign transaction:
1. Reconstruct key using 2 of 3 shards
2. Sign transaction in secure environment
3. Immediately destroy reconstructed key
4. Never expose full key to any single location
\`\`\`

**Security Properties:**
- **Theft resistance:** Attacker needs to compromise 2 of 3 shards (extremely difficult)
- **Recovery:** User can recover wallet with 2 shards if device is lost
- **No seed phrases:** Users never see 12-word mnemonic
- **TEE protection:** Trusted Execution Environments prevent unauthorized access

### Authentication Methods

Privy supports **multiple authentication flows**:

\`\`\`typescript
import { usePrivy } from '@privy-io/react-auth'

function AuthComponent() {
  const { login } = usePrivy()

  return (
    <>
      {/* 1. Social OAuth */}
      <button onClick={() => login({ loginMethod: 'google' })}>
        Sign in with Google
      </button>

      {/* 2. Email (passwordless) */}
      <button onClick={() => login({ loginMethod: 'email' })}>
        Sign in with Email
      </button>

      {/* 3. SMS (phone number) */}
      <button onClick={() => login({ loginMethod: 'sms' })}>
        Sign in with Phone
      </button>

      {/* 4. External wallet (MetaMask, WalletConnect) */}
      <button onClick={() => login({ loginMethod: 'wallet' })}>
        Connect Wallet
      </button>

      {/* 5. Passkeys (WebAuthn) */}
      <button onClick={() => login({ loginMethod: 'passkey' })}>
        Sign in with Passkey
      </button>
    </>
  )
}
\`\`\`

**Supported Methods:**
- **OAuth:** Google, Twitter, Discord, GitHub, LinkedIn, Apple, TikTok, Farcaster
- **Email:** Passwordless magic links or OTP codes
- **SMS:** Phone number with OTP verification
- **Wallet:** MetaMask, Coinbase Wallet, WalletConnect, Rainbow
- **Passkeys:** FIDO2/WebAuthn for biometric authentication

## Progressive Onboarding: The Privy Philosophy

### What is Progressive Onboarding?

**Start Simple → Add Complexity Over Time**

Instead of overwhelming users with Web3 concepts upfront, Privy enables a **gradual introduction**:

\`\`\`
Level 1: Web2 User (Day 1)
  ├─ Sign in with Google
  ├─ Embedded wallet created (invisible)
  ├─ Can use dApp features
  └─ Transactions paid by app (gasless)

Level 2: Curious User (Week 1)
  ├─ "What's this wallet thing?"
  ├─ Export wallet to see balance
  ├─ Link external wallet (MetaMask)
  └─ Start understanding blockchain

Level 3: Power User (Month 1)
  ├─ Transfer funds between wallets
  ├─ Use embedded wallet AND external wallet
  ├─ Export private key (optional)
  └─ Full control and understanding
\`\`\`

### Implementation Example

\`\`\`typescript
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState, useEffect } from 'react'

function ProgressiveOnboardingExample() {
  const { user, authenticated, login, logout } = usePrivy()
  const { wallets } = useWallets()

  const [onboardingLevel, setOnboardingLevel] = useState(1)

  useEffect(() => {
    if (!authenticated) return

    // Determine user's onboarding level
    const hasLinkedWallet = user?.linkedAccounts?.some(
      account => account.type === 'wallet'
    )
    const hasExportedKey = localStorage.getItem('hasExportedKey') === 'true'

    if (hasExportedKey) {
      setOnboardingLevel(3) // Power user
    } else if (hasLinkedWallet) {
      setOnboardingLevel(2) // Curious user
    } else {
      setOnboardingLevel(1) // Web2 user
    }
  }, [user, authenticated])

  if (!authenticated) {
    return (
      <div>
        <h2>Welcome! Get started in seconds</h2>
        <button onClick={() => login({ loginMethod: 'google' })}>
          Sign in with Google
        </button>
        <p className="text-sm text-gray-500">
          No wallet needed - we'll create one for you
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2>Welcome back, {user?.email?.address || user?.wallet?.address}</h2>

      {/* Level 1: Basic usage */}
      {onboardingLevel >= 1 && (
        <div className="feature-card">
          <h3>✅ You're ready to use the app!</h3>
          <p>Your embedded wallet: {wallets[0]?.address}</p>
          <button>Start Trading NFTs</button>
        </div>
      )}

      {/* Level 2: Link external wallet */}
      {onboardingLevel === 1 && (
        <div className="upgrade-card">
          <h3>💡 Want more control?</h3>
          <p>Link your MetaMask wallet for advanced features</p>
          <button onClick={() => login({ loginMethod: 'wallet' })}>
            Link External Wallet
          </button>
        </div>
      )}

      {/* Level 2: Export options */}
      {onboardingLevel === 2 && (
        <div className="upgrade-card">
          <h3>🔒 Take full custody</h3>
          <p>Export your private key to use your wallet anywhere</p>
          <button onClick={() => {
            // Show export flow
            localStorage.setItem('hasExportedKey', 'true')
            setOnboardingLevel(3)
          }}>
            Export Private Key
          </button>
        </div>
      )}

      {/* Level 3: Power user features */}
      {onboardingLevel === 3 && (
        <div className="feature-card">
          <h3>🚀 Power User Mode</h3>
          <p>All advanced features unlocked</p>
          <ul>
            <li>✅ Embedded wallet</li>
            <li>✅ External wallet linked</li>
            <li>✅ Private key exported</li>
          </ul>
        </div>
      )}
    </div>
  )
}
\`\`\`

## Multi-Chain Support

Privy supports **multiple blockchain networks**:

\`\`\`typescript
import { usePrivy } from '@privy-io/react-auth'

function MultiChainExample() {
  const { createWallet } = usePrivy()

  const createEthereumWallet = async () => {
    const wallet = await createWallet({
      chainType: 'ethereum'
    })
    console.log('Ethereum wallet:', wallet.address)
  }

  const createSolanaWallet = async () => {
    const wallet = await createWallet({
      chainType: 'solana'
    })
    console.log('Solana wallet:', wallet.address)
  }

  const createBitcoinWallet = async () => {
    const wallet = await createWallet({
      chainType: 'bitcoin-segwit'
    })
    console.log('Bitcoin wallet:', wallet.address)
  }

  return (
    <div>
      <h2>Create Multi-Chain Wallets</h2>
      <button onClick={createEthereumWallet}>Create ETH Wallet</button>
      <button onClick={createSolanaWallet}>Create Solana Wallet</button>
      <button onClick={createBitcoinWallet}>Create Bitcoin Wallet</button>
    </div>
  )
}
\`\`\`

**Supported Chains:**
- **EVM Chains:** Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, BNB Chain, Zora, and 500+ others
- **Non-EVM:** Solana, Bitcoin (SegWit), TRON, Stellar
- **Custom Networks:** Configure any EVM-compatible chain

## Security Model Deep Dive

### Threat Model

**What Privy protects against:**

1. **Server compromise:** Even if Privy's servers are hacked, attacker only gets 2 of 3 shards from TEEs (not enough to reconstruct key)

2. **Device theft:** If user's device is stolen, attacker only has 1 shard (not enough)

3. **Insider threat:** Privy employees cannot access user wallets (TEE prevents unauthorized access)

4. **Phishing:** Private keys never exposed to user or application, so can't be phished

**What Privy does NOT protect against:**

1. **Transaction signing abuse:** If your application code is malicious and tricks users into signing bad transactions, Privy can't prevent it

2. **Session hijacking:** If attacker steals user's session token, they can sign transactions

3. **Social engineering:** If user approves malicious transaction, it will execute

### Trusted Execution Environments (TEEs)

**What are TEEs?**

Isolated compute environments that:
- Run code in **hardware-encrypted enclaves**
- Prevent **external access** (even by cloud provider or OS)
- Provide **cryptographic attestation** (proof of isolation)
- Used by: AWS Nitro Enclaves, Intel SGX, ARM TrustZone

**Privy's TEE Architecture:**
\`\`\`
┌──────────────────────────────────────┐
│     AWS Server (untrusted)           │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Nitro Enclave (TEE)           │ │
│  │                                │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │   Key Shard 1            │ │ │
│  │  │   (encrypted in memory)  │ │ │
│  │  └──────────────────────────┘ │ │
│  │                                │ │
│  │  Only accessible via:          │ │
│  │  - User authentication         │ │
│  │  - Cryptographic attestation   │ │
│  └────────────────────────────────┘ │
│                                      │
│  Root access cannot read enclave    │
└──────────────────────────────────────┘
\`\`\`

**Key Properties:**
- **Memory encryption:** Data inside enclave is encrypted by hardware
- **Isolated execution:** Host OS cannot inspect enclave memory
- **Attestation:** Enclave can prove it's running correct code
- **Audited:** Privy's TEE implementation is SOC 2 Type II compliant

### SOC 2 Compliance

**What is SOC 2?**

An auditing standard for service providers that store customer data. Privy has **SOC 2 Type II** certification, which means:

- **Security:** Systems are protected against unauthorized access
- **Availability:** Systems are available for operation and use
- **Confidentiality:** Information is protected as committed or agreed
- **Independent audit:** Third-party verification of security controls

**Why this matters for Web3:**
- Most Web3 wallet providers are NOT SOC 2 compliant
- Privy is production-ready for **enterprise use cases**
- Institutional investors require SOC 2 for custody solutions

## Transaction Management

### Gasless Transactions (Sponsored)

**Problem:** New users don't have ETH for gas fees

**Solution:** Application sponsors gas fees using **Privy's Paymaster**

\`\`\`typescript
import { usePrivy, useSendTransaction } from '@privy-io/react-auth'

function GaslessTransaction() {
  const { sendTransaction } = useSendTransaction()

  const mintNFT = async () => {
    // User has NO ETH in their wallet
    // App pays gas fees via Privy's paymaster
    const txHash = await sendTransaction({
      to: '0xNFT_CONTRACT_ADDRESS',
      data: encodeFunctionData({
        abi: NFT_ABI,
        functionName: 'mint',
        args: [userAddress]
      }),
      // Privy automatically sponsors gas
      sponsored: true
    })

    console.log('NFT minted (user paid $0 for gas):', txHash)
  }

  return <button onClick={mintNFT}>Mint NFT (Free!)</button>
}
\`\`\`

**How it works:**
1. User initiates transaction
2. Privy's paymaster pre-funds transaction on blockchain
3. Transaction executes
4. Your app is billed for gas cost (+ small fee)

**Use cases:**
- **Onboarding:** Let users try your dApp before buying crypto
- **Free-to-play games:** Players don't need gas for game actions
- **Social apps:** Posting/commenting without gas friction

### Transaction Policies (Enterprise)

**Problem:** Need to limit what embedded wallets can do

**Solution:** Set spending limits and allowlists

\`\`\`typescript
// Configure wallet policy via Privy Dashboard API
const policy = {
  spending_limits: {
    daily_limit_usd: 100,
    per_transaction_limit_usd: 10
  },
  allowed_contracts: [
    '0xYOUR_NFT_CONTRACT',
    '0xYOUR_GAME_CONTRACT'
  ],
  allowed_methods: [
    'mint(address)',
    'transfer(address,uint256)'
  ],
  block_high_risk: true
}
\`\`\`

**Enforcement:**
- Privy validates transactions **before signing**
- Blocks transactions that violate policy
- Alerts admins to suspicious activity

## Real-World Implementation

### Complete Privy Integration Example

\`\`\`typescript
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

// 1. Wrap app with PrivyProvider
function App() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['google', 'email', 'wallet', 'sms'],
        appearance: {
          theme: 'dark',
          accentColor: '#6A6FF5',
          logo: 'https://your-app.com/logo.png'
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Auto-create for new users
          requireUserPasswordOnCreate: false // No password needed
        },
        mfa: {
          noPromptOnMfaRequired: false
        }
      }}
    >
      <MainApp />
    </PrivyProvider>
  )
}

// 2. Use Privy hooks in components
function MainApp() {
  const { authenticated, user, login, logout } = usePrivy()
  const { wallets, ready } = useWallets()
  const [balance, setBalance] = useState<string>('0')

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy')
  const externalWallet = wallets.find(w => w.walletClientType !== 'privy')

  // Fetch wallet balance
  useEffect(() => {
    if (!embeddedWallet) return

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http()
    })

    publicClient.getBalance({
      address: embeddedWallet.address as \`0x\${string}\`
    }).then(balance => {
      setBalance((Number(balance) / 1e18).toFixed(4))
    })
  }, [embeddedWallet])

  if (!authenticated) {
    return (
      <div className="login-screen">
        <h1>Welcome to Web3 App</h1>
        <p>No wallet? No problem. Sign in to get started.</p>

        <button onClick={() => login({ loginMethod: 'google' })}>
          🌐 Sign in with Google
        </button>

        <button onClick={() => login({ loginMethod: 'email' })}>
          📧 Sign in with Email
        </button>

        <button onClick={() => login({ loginMethod: 'wallet' })}>
          🦊 Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, {user?.email?.address || 'Anon'}</h2>
        <button onClick={logout}>Sign Out</button>
      </header>

      <div className="wallet-info">
        <h3>Your Wallets</h3>

        {/* Embedded Wallet */}
        {embeddedWallet && (
          <div className="wallet-card">
            <h4>🔐 Embedded Wallet</h4>
            <p>Address: {embeddedWallet.address}</p>
            <p>Balance: {balance} ETH</p>
            <p>Created automatically when you signed in</p>
          </div>
        )}

        {/* External Wallet */}
        {externalWallet && (
          <div className="wallet-card">
            <h4>🦊 External Wallet</h4>
            <p>Address: {externalWallet.address}</p>
            <p>Connected via {externalWallet.connectorType}</p>
          </div>
        )}

        {/* Link External Wallet */}
        {!externalWallet && (
          <button onClick={() => login({ loginMethod: 'wallet' })}>
            + Link External Wallet
          </button>
        )}
      </div>

      <div className="linked-accounts">
        <h3>Linked Accounts</h3>
        <ul>
          {user?.linkedAccounts?.map(account => (
            <li key={account.type}>
              {account.type}: {account.email || account.address || account.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
\`\`\`

## Comparison to Other Platforms

### Privy vs Web3Auth

| Feature | Privy | Web3Auth |
|---------|-------|----------|
| **MPC Implementation** | ✅ 3-shard (2-of-3 threshold) | ✅ 5-shard (3-of-5 threshold) |
| **TEE Security** | ✅ AWS Nitro Enclaves | ✅ Yes |
| **Self-Custody** | ⚠️ Hybrid (can export key) | ✅ Full (user holds shard) |
| **Multi-Chain** | ✅ EVM, Solana, Bitcoin | ✅ All major chains |
| **Enterprise Focus** | ✅ Strong (SOC 2) | ✅ Strong |
| **Pricing** | Custom (higher for features) | Custom |
| **Best For** | Production Web3 apps | Blockchain-agnostic apps |

**Key Difference:** Web3Auth is more **blockchain-agnostic**, Privy is more **opinionated and easier to integrate**.

### Privy vs Supabase Auth (Web3 feature comparison)

| Feature | Privy | Supabase Auth |
|---------|-------|---------------|
| **Embedded Wallets** | ✅ Yes (MPC-based) | ❌ No |
| **External Wallet Sign-In** | ✅ Yes | ✅ Yes (EIP-4361) |
| **Gasless Transactions** | ✅ Built-in paymaster | ❌ Bring your own |
| **Progressive Onboarding** | ✅ Core feature | ⚠️ Manual implementation |
| **Database** | ❌ Bring your own | ✅ Included (Postgres) |
| **General-Purpose Auth** | ⚠️ Web3-focused | ✅ Full-featured |
| **Pricing** | Higher | Lower |
| **Best For** | Pure Web3 dApps | Hybrid Web2+Web3 apps |

**Key Insight:** Privy is **specialized for Web3** with embedded wallets, Supabase is **general-purpose** with Web3 support added.

## Key Takeaways

1. **Privy specializes in embedded wallets** using MPC (Multi-Party Computation) to split private keys into 3 shards, eliminating seed phrases and enabling Web2-style authentication

2. **Progressive onboarding** allows users to start with simple "Sign in with Google" and gradually learn Web3 concepts (wallet → gas → self-custody)

3. **Multi-chain support** includes EVM (Ethereum, Polygon, etc.), Solana, Bitcoin, TRON, and Stellar - all with the same unified API

4. **Enterprise-grade security** with SOC 2 Type II compliance, Trusted Execution Environments (TEEs), and hardware-encrypted key shards

5. **Gasless transactions** via built-in paymaster enable frictionless onboarding where applications sponsor gas fees

6. **Hybrid wallet model** supports both embedded wallets (managed by Privy) and external wallets (MetaMask, Coinbase Wallet) in the same user session

**Next:** We'll explore LazorKit's Solana-specific passkey implementation and compare platform selection criteria.
          `
        },
        {
          type: "code",
          title: "Complete Privy Implementation with All Features",
          language: "typescript",
          code: `/**
 * Complete Privy Integration Example
 * Demonstrates embedded wallets, external wallets, multi-chain, gasless transactions, and progressive onboarding
 */

import {
  PrivyProvider,
  usePrivy,
  useWallets,
  useSendTransaction,
  useLoginWithEmail,
  useLoginWithSMS,
  useLoginWithOAuth,
  WalletWithMetadata
} from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { createPublicClient, http, parseEther, encodeFunctionData } from 'viem'
import { mainnet, polygon, arbitrum, base } from 'viem/chains'

/**
 * Step 1: Configure Privy Provider
 */
export function PrivyAppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Authentication methods to enable
        loginMethods: [
          'email',
          'sms',
          'google',
          'twitter',
          'discord',
          'github',
          'wallet',
          'apple',
          'passkey'
        ],

        // UI customization
        appearance: {
          theme: 'dark',
          accentColor: '#6A6FF5',
          logo: 'https://your-app.com/logo.png',
          showWalletLoginFirst: false, // Show social logins first
          walletChainType: 'ethereum-and-solana' // Support both
        },

        // Embedded wallet configuration
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Auto-create for new users
          requireUserPasswordOnCreate: false, // No password needed
          noPromptOnSignature: false // Prompt for transaction approval
        },

        // Multi-factor authentication
        mfa: {
          noPromptOnMfaRequired: false
        },

        // Supported external wallets
        supportedChains: [mainnet, polygon, arbitrum, base],

        // Legal requirements
        legal: {
          termsAndConditionsUrl: 'https://your-app.com/terms',
          privacyPolicyUrl: 'https://your-app.com/privacy'
        }
      }}
    >
      {children}
    </PrivyProvider>
  )
}

/**
 * Step 2: Authentication Component
 */
function AuthenticationDemo() {
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    linkEmail,
    linkWallet,
    linkGoogle,
    unlinkEmail,
    unlinkWallet,
    exportWallet
  } = usePrivy()

  const { loginWithEmail } = useLoginWithEmail()
  const { loginWithCode } = useLoginWithSMS()
  const { loginWithOAuth } = useLoginWithOAuth()

  // Wait for Privy to initialize
  if (!ready) {
    return <div>Loading Privy...</div>
  }

  // Not authenticated
  if (!authenticated) {
    return (
      <div className="auth-screen">
        <h1>Welcome to Our Web3 App</h1>
        <p>Choose how you'd like to sign in</p>

        <div className="auth-buttons">
          {/* Email authentication */}
          <button
            onClick={() => {
              const email = prompt('Enter your email:')
              if (email) {
                loginWithEmail({ email })
              }
            }}
          >
            📧 Sign in with Email
          </button>

          {/* SMS authentication */}
          <button
            onClick={() => {
              const phone = prompt('Enter your phone number:')
              if (phone) {
                loginWithCode({ phoneNumber: phone })
              }
            }}
          >
            📱 Sign in with SMS
          </button>

          {/* OAuth providers */}
          <button onClick={() => login({ loginMethod: 'google' })}>
            🌐 Sign in with Google
          </button>

          <button onClick={() => login({ loginMethod: 'twitter' })}>
            🐦 Sign in with Twitter
          </button>

          <button onClick={() => login({ loginMethod: 'discord' })}>
            💬 Sign in with Discord
          </button>

          {/* External wallet */}
          <button onClick={() => login({ loginMethod: 'wallet' })}>
            🦊 Connect Wallet
          </button>

          {/* Passkey (WebAuthn) */}
          <button onClick={() => login({ loginMethod: 'passkey' })}>
            🔐 Sign in with Passkey
          </button>
        </div>

        <p className="help-text">
          ℹ️ Don't have a wallet? No problem! We'll create one for you when you sign in.
        </p>
      </div>
    )
  }

  // Authenticated - show user info
  return (
    <div className="user-profile">
      <h2>Welcome back!</h2>

      <div className="user-details">
        <h3>User Information</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div className="linked-accounts">
        <h3>Linked Accounts</h3>
        {user?.linkedAccounts?.map((account, index) => (
          <div key={index} className="account-badge">
            <span>{account.type}: </span>
            <span>{account.email || account.address || account.username}</span>
            {account.type === 'wallet' && (
              <button onClick={() => unlinkWallet(account.address!)}>
                Unlink
              </button>
            )}
          </div>
        ))}

        {/* Link additional accounts */}
        <div className="link-actions">
          <button onClick={() => linkEmail()}>+ Link Email</button>
          <button onClick={() => linkWallet()}>+ Link Wallet</button>
          <button onClick={() => linkGoogle()}>+ Link Google</button>
        </div>
      </div>

      <button onClick={logout} className="logout-btn">
        Sign Out
      </button>
    </div>
  )
}

/**
 * Step 3: Wallet Management Component
 */
function WalletManagement() {
  const { user } = usePrivy()
  const { wallets, ready } = useWallets()
  const [balances, setBalances] = useState<Record<string, string>>({})

  // Separate embedded and external wallets
  const embeddedWallets = wallets.filter(w => w.walletClientType === 'privy')
  const externalWallets = wallets.filter(w => w.walletClientType !== 'privy')

  // Fetch balances for all wallets
  useEffect(() => {
    if (!ready) return

    const fetchBalances = async () => {
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http()
      })

      const newBalances: Record<string, string> = {}

      for (const wallet of wallets) {
        try {
          const balance = await publicClient.getBalance({
            address: wallet.address as \`0x\${string}\`
          })
          newBalances[wallet.address] = (Number(balance) / 1e18).toFixed(4)
        } catch (error) {
          console.error(\`Failed to fetch balance for \${wallet.address}\`, error)
          newBalances[wallet.address] = 'Error'
        }
      }

      setBalances(newBalances)
    }

    fetchBalances()
  }, [wallets, ready])

  if (!ready) {
    return <div>Loading wallets...</div>
  }

  return (
    <div className="wallet-dashboard">
      <h2>Your Wallets</h2>

      {/* Embedded Wallets */}
      {embeddedWallets.length > 0 && (
        <div className="wallet-section">
          <h3>🔐 Embedded Wallets (Managed by Privy)</h3>
          {embeddedWallets.map(wallet => (
            <WalletCard
              key={wallet.address}
              wallet={wallet}
              balance={balances[wallet.address] || '...'}
              isEmbedded={true}
            />
          ))}
        </div>
      )}

      {/* External Wallets */}
      {externalWallets.length > 0 && (
        <div className="wallet-section">
          <h3>🦊 External Wallets (MetaMask, etc.)</h3>
          {externalWallets.map(wallet => (
            <WalletCard
              key={wallet.address}
              wallet={wallet}
              balance={balances[wallet.address] || '...'}
              isEmbedded={false}
            />
          ))}
        </div>
      )}

      {/* No wallets */}
      {wallets.length === 0 && (
        <div className="empty-state">
          <p>No wallets found. This shouldn't happen!</p>
        </div>
      )}
    </div>
  )
}

/**
 * Wallet Card Component
 */
function WalletCard({
  wallet,
  balance,
  isEmbedded
}: {
  wallet: WalletWithMetadata
  balance: string
  isEmbedded: boolean
}) {
  const { exportWallet } = usePrivy()

  const handleExport = async () => {
    if (!isEmbedded) {
      alert('Cannot export external wallets')
      return
    }

    try {
      await exportWallet()
      console.log('Wallet exported successfully')
    } catch (error) {
      console.error('Failed to export wallet:', error)
    }
  }

  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <h4>{isEmbedded ? '🔐 Embedded' : '🦊 External'}</h4>
        <span className="chain-badge">{wallet.chainType}</span>
      </div>

      <div className="wallet-details">
        <div className="address">
          <label>Address:</label>
          <code>{wallet.address}</code>
        </div>

        <div className="balance">
          <label>Balance:</label>
          <span>{balance} ETH</span>
        </div>

        {wallet.walletClient && (
          <div className="client-type">
            <label>Client:</label>
            <span>{wallet.walletClientType}</span>
          </div>
        )}
      </div>

      {isEmbedded && (
        <div className="wallet-actions">
          <button onClick={handleExport}>Export Private Key</button>
          <p className="warning-text">
            ⚠️ Only export if you understand the risks
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Step 4: Transaction Component (Gasless)
 */
function GaslessTransactionDemo() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { sendTransaction } = useSendTransaction()
  const [txHash, setTxHash] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy')

  const sendGaslessTransaction = async () => {
    if (!embeddedWallet) {
      alert('No embedded wallet found')
      return
    }

    setLoading(true)

    try {
      // Example: Mint an NFT (gasless)
      const hash = await sendTransaction({
        to: '0xYOUR_NFT_CONTRACT_ADDRESS' as \`0x\${string}\`,
        data: encodeFunctionData({
          abi: [
            {
              name: 'mint',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [{ name: 'to', type: 'address' }],
              outputs: []
            }
          ],
          functionName: 'mint',
          args: [embeddedWallet.address as \`0x\${string}\`]
        }),
        // Privy sponsors the gas!
        sponsored: true
      })

      setTxHash(hash.transactionHash)
      console.log('✅ Transaction sent (user paid $0 for gas):', hash)
    } catch (error) {
      console.error('❌ Transaction failed:', error)
      alert('Transaction failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="transaction-demo">
      <h2>Gasless Transactions</h2>
      <p>
        Send blockchain transactions without needing ETH for gas.
        Your app pays the gas fees via Privy's paymaster.
      </p>

      <button
        onClick={sendGaslessTransaction}
        disabled={loading || !embeddedWallet}
      >
        {loading ? 'Sending...' : 'Mint NFT (Gasless)'}
      </button>

      {txHash && (
        <div className="success-message">
          <h3>✅ Transaction Successful!</h3>
          <p>Transaction Hash:</p>
          <code>{txHash}</code>
          <a
            href={\`https://etherscan.io/tx/\${txHash}\`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan →
          </a>
        </div>
      )}
    </div>
  )
}

/**
 * Step 5: Progressive Onboarding Implementation
 */
function ProgressiveOnboardingFlow() {
  const { user, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!authenticated) {
      setStep(0)
      return
    }

    // Determine onboarding progress
    const hasExternalWallet = wallets.some(w => w.walletClientType !== 'privy')
    const hasExportedKey = localStorage.getItem('has-exported-key') === 'true'

    if (hasExportedKey) {
      setStep(3) // Power user
    } else if (hasExternalWallet) {
      setStep(2) // Intermediate
    } else {
      setStep(1) // Beginner
    }
  }, [authenticated, wallets])

  const markKeyExported = () => {
    localStorage.setItem('has-exported-key', 'true')
    setStep(3)
  }

  return (
    <div className="onboarding-flow">
      <div className="progress-indicator">
        <div className={\`step \${step >= 1 ? 'active' : ''}\`}>1. Sign In</div>
        <div className={\`step \${step >= 2 ? 'active' : ''}\`}>2. Link Wallet</div>
        <div className={\`step \${step >= 3 ? 'active' : ''}\`}>3. Export Key</div>
      </div>

      {step === 1 && (
        <div className="step-content">
          <h2>✅ Welcome! You're ready to go</h2>
          <p>An embedded wallet was automatically created for you.</p>
          <p>You can start using the app immediately - no setup needed.</p>

          <div className="next-step-hint">
            <h3>💡 Want more control?</h3>
            <p>Link your MetaMask wallet for advanced features</p>
            <button>Link External Wallet →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h2>🚀 Great! You've linked an external wallet</h2>
          <p>You can now use both your embedded wallet and MetaMask.</p>

          <div className="next-step-hint">
            <h3>🔒 Take full custody</h3>
            <p>Export your embedded wallet's private key to use it anywhere</p>
            <button onClick={markKeyExported}>Export Private Key →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <h2>🎉 Power User Unlocked!</h2>
          <p>You have full control over all your wallets:</p>
          <ul>
            <li>✅ Embedded wallet (managed by Privy)</li>
            <li>✅ External wallet (MetaMask)</li>
            <li>✅ Private key exported (full custody)</li>
          </ul>
          <p>You can use your wallets anywhere in the Web3 ecosystem.</p>
        </div>
      )}
    </div>
  )
}

/**
 * Export all components
 */
export {
  AuthenticationDemo,
  WalletManagement,
  GaslessTransactionDemo,
  ProgressiveOnboardingFlow
}`
        }
      ],
      quiz: {
        id: "privy-quiz",
        title: "Privy Embedded Wallets Quiz",
        description: "Test your understanding of Privy's architecture, security model, and implementation",
        passingScore: 70,
        questions: [
          {
            id: "priv-q1",
            question: "What is the core problem that Privy's embedded wallets solve?",
            options: [
              "Making blockchain transactions faster",
              "Reducing Web3 onboarding friction by eliminating the need for users to install wallets or manage seed phrases",
              "Lowering gas fees for transactions",
              "Supporting more blockchain networks"
            ],
            correctAnswer: 1,
            explanation: "Privy solves the Web3 onboarding friction problem. Traditional Web3 requires users to install MetaMask, create a wallet, write down seed phrases, and buy crypto for gas - leading to ~95% abandonment. Privy lets users 'Sign in with Google' and automatically creates an embedded wallet (invisible to the user), achieving ~90% conversion rates."
          },
          {
            id: "priv-q2",
            question: "How does Privy's MPC (Multi-Party Computation) architecture secure private keys?",
            options: [
              "Stores the full private key encrypted on Privy's servers",
              "Splits the private key into 3 shards using Shamir's Secret Sharing, distributed across 2 TEEs and user's device; requires 2-of-3 to reconstruct",
              "Uses a single hardware security module (HSM)",
              "Stores keys in the user's browser localStorage"
            ],
            correctAnswer: 1,
            explanation: "Privy uses Shamir's Secret Sharing to split each private key into 3 shards: Shard 1 in Privy TEE (AWS Nitro Enclave), Shard 2 in another Privy TEE (different region), and Shard 3 encrypted in user's browser storage. To sign a transaction, 2 of 3 shards are required to reconstruct the key. This means even if one location is compromised, the wallet remains secure."
          },
          {
            id: "priv-q3",
            question: "What are Trusted Execution Environments (TEEs) and why does Privy use them?",
            options: [
              "Cloud servers with standard encryption",
              "Hardware-encrypted compute enclaves (like AWS Nitro) that isolate key shards and prevent external access, even by cloud providers",
              "Blockchain-based key storage systems",
              "Third-party key management services"
            ],
            correctAnswer: 1,
            explanation: "TEEs are hardware-encrypted compute enclaves (like AWS Nitro Enclaves, Intel SGX) that run code in complete isolation. Memory inside TEEs is encrypted by hardware, and even the host OS or cloud provider cannot inspect the enclave's memory. Privy uses TEEs to store key shards, ensuring that even if Privy's servers are compromised or insiders attempt access, the key shards remain protected by hardware-level encryption."
          },
          {
            id: "priv-q4",
            question: "What is 'progressive onboarding' in the context of Privy?",
            options: [
              "Gradually increasing gas fees as users become more experienced",
              "Starting users with simple Web2 authentication (Google) and embedded wallets, then progressively introducing Web3 concepts (external wallets, key export) as they become comfortable",
              "Slowly migrating from Ethereum to other blockchains",
              "Requiring users to complete tutorials before using features"
            ],
            correctAnswer: 1,
            explanation: "Progressive onboarding is Privy's philosophy of starting simple and adding complexity over time. Level 1: User signs in with Google, embedded wallet auto-created (invisible), can use dApp immediately. Level 2: User learns about wallets, can link MetaMask for advanced features. Level 3: User exports private key, takes full custody. This approach reduces initial friction (90% conversion) while allowing power users to graduate to full Web3 capabilities."
          },
          {
            id: "priv-q5",
            question: "How do gasless transactions work in Privy?",
            options: [
              "Users must pre-fund their wallets with ETH",
              "Application sponsors gas fees via Privy's paymaster; transactions execute with sponsored: true flag, and the app is billed for gas costs",
              "Transactions are free and never cost gas",
              "Users pay with credit cards instead of crypto"
            ],
            correctAnswer: 1,
            explanation: "Privy's gasless transaction feature allows applications to sponsor gas fees for users via Privy's paymaster. When sending a transaction with { sponsored: true }, Privy's paymaster pre-funds the transaction on the blockchain, executes it, and then bills the application for the gas cost (plus a small fee). This enables onboarding users who have zero crypto, letting them try the dApp before buying ETH."
          },
          {
            id: "priv-q6",
            question: "What is Privy's SOC 2 Type II certification and why does it matter for Web3?",
            options: [
              "A blockchain security audit",
              "An independent third-party audit verifying security, availability, and confidentiality controls; makes Privy enterprise-ready and suitable for institutional custody",
              "A certification for smart contract safety",
              "A standard for decentralized applications"
            ],
            correctAnswer: 1,
            explanation: "SOC 2 Type II is a rigorous auditing standard for service providers that store customer data. It requires independent third-party verification of security, availability, and confidentiality controls. Most Web3 wallet providers are NOT SOC 2 compliant. Privy's certification makes it production-ready for enterprise use cases and institutional investors who require SOC 2 for custody solutions - bridging the gap between Web3 innovation and enterprise security requirements."
          }
        ]
      }
    },
    {
      id: "lazorkit-solana-passkeys",
      slug: "lazorkit-solana-passkeys",
      title: "LazorKit: Solana Passkeys & Smart Wallets",
      description:
        "Examine LazorKit's innovative Solana-specific implementation of WebAuthn passkeys with secp256r1 curve support and on-chain signature verification",
      estimatedMinutes: 50,
      content: [
        {
          type: "text",
          title: "LazorKit Solana Passkeys Overview",
          content: `
## What is LazorKit?

**LazorKit** is a **Solana-specific smart wallet system** that enables **passwordless authentication** using **WebAuthn passkeys** with **on-chain signature verification**. Unlike traditional Solana wallets that use ed25519 signatures, LazorKit leverages the **secp256r1 (P-256) curve** - the same cryptographic curve used by Apple Passkeys, Android biometrics, and hardware security modules.

### The Innovation: Native Passkey Support on Solana

**The Challenge:**
\`\`\`
Traditional Solana wallets (Phantom, Solflare, etc.):
  ├─ Use ed25519 signatures
  ├─ Require browser extensions or mobile apps
  ├─ Users manage seed phrases (12-24 words)
  └─ Can't use hardware biometrics natively

Result: Familiar Web3 friction
\`\`\`

**LazorKit's Solution:**
\`\`\`
LazorKit smart wallets:
  ├─ Use secp256r1 signatures (WebAuthn standard)
  ├─ Work directly in browser (no extension needed)
  ├─ Leverage device biometrics (Face ID, Touch ID, fingerprint)
  ├─ On-chain signature verification via SIMD 75
  └─ No seed phrases needed

Result: True passwordless Web3
\`\`\`

### What Makes LazorKit Special?

**1. Solana-Native Passkeys**
- First implementation of **WebAuthn passkeys on Solana**
- Uses **secp256r1 curve** (P-256), same as Apple/Android
- **On-chain verification** via Solana's SIMD 75 precompile

**2. Smart Wallet Architecture**
- Programmable wallet logic on-chain
- Policy engine for transaction rules
- Gasless transactions via paymaster
- Session keys for temporary access

**3. Beta Stage (Not Production Ready)**
- Still in **active development**
- Breaking changes expected
- Recommended for **prototyping and experimentation** only

## Technical Architecture

### secp256r1 (P-256) Curve Support

**What is secp256r1?**

A NIST-standardized elliptic curve (also called P-256) used by:
- **Apple:** Secure Enclave for Face ID / Touch ID
- **Android:** StrongBox / Titan M chip
- **YubiKey:** FIDO2 hardware keys
- **WebAuthn:** W3C standard for passwordless auth

**Why it matters:**
\`\`\`
Traditional Web3:
  User's device → Generates ed25519 key
                → Not hardware-backed
                → Software-only security

LazorKit approach:
  User's device → Generates secp256r1 key in Secure Enclave
                → Hardware-backed (can't be extracted)
                → Biometric-protected
                → Phishing-resistant
\`\`\`

### Solana SIMD 75: On-Chain secp256r1 Verification

**What is SIMD 75?**

A Solana Improvement Document that adds **secp256r1 signature verification** as a **precompiled instruction** on Solana. This allows smart contracts to verify WebAuthn signatures directly on-chain.

**Before SIMD 75:**
\`\`\`
Solana supported:
  ✅ ed25519 (native Solana signatures)
  ✅ secp256k1 (Ethereum, Bitcoin)
  ❌ secp256r1 (WebAuthn, Apple, Android)

Result: Couldn't verify passkey signatures on-chain
\`\`\`

**After SIMD 75:**
\`\`\`
Solana now supports:
  ✅ ed25519
  ✅ secp256k1
  ✅ secp256r1 (NEW!)

Result: Can verify passkey signatures on-chain!
\`\`\`

### LazorKit Smart Wallet Flow

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                   User's Device                          │
│                                                          │
│  1. User initiates wallet creation                      │
│     ↓                                                    │
│  2. Browser calls navigator.credentials.create()        │
│     ↓                                                    │
│  3. Device generates secp256r1 keypair in Secure Enclave│
│     - Private key: Stays in hardware (can't extract)    │
│     - Public key: Returned to browser                   │
│     ↓                                                    │
│  4. LazorKit SDK creates smart wallet on Solana         │
│     - Stores public key as wallet authority             │
│     - Deploys programmable wallet contract              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Solana Blockchain (On-Chain)                │
│                                                          │
│  ┌───────────────────────────────────────┐             │
│  │  LazorKit Smart Wallet Program        │             │
│  │                                       │             │
│  │  - Owner: secp256r1 public key        │             │
│  │  - Policy: Transaction rules          │             │
│  │  - Paymaster: Gas sponsorship         │             │
│  └───────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────┘

When user signs transaction:
  1. Browser prompts biometric (Face ID)
  2. Secure Enclave signs transaction with secp256r1 private key
  3. Signature sent to Solana
  4. SIMD 75 precompile verifies signature on-chain
  5. Transaction executes if valid
\`\`\`

## WebAuthn Integration

### Creating a Passkey Wallet

\`\`\`typescript
import { LazorKit } from '@lazorkit/sdk'

async function createPasskeyWallet() {
  const lazorKit = new LazorKit({
    network: 'devnet' // or 'mainnet-beta'
  })

  try {
    // 1. Prompt user to create passkey
    // This triggers Face ID / Touch ID / Windows Hello
    const wallet = await lazorKit.createWallet({
      authenticatorType: 'platform', // Use device's built-in authenticator
      userDisplayName: 'Alice Anderson',
      userId: 'alice@example.com'
    })

    console.log('✅ Passkey wallet created!')
    console.log('Wallet Address:', wallet.address)
    console.log('Public Key (secp256r1):', wallet.publicKey)

    // 2. Behind the scenes:
    // - Browser called navigator.credentials.create()
    // - Device generated secp256r1 keypair in Secure Enclave
    // - LazorKit deployed smart wallet to Solana with public key
    // - Private key NEVER leaves device hardware

    return wallet
  } catch (error) {
    console.error('❌ Failed to create wallet:', error)
    throw error
  }
}

// Create wallet on page load
createPasskeyWallet()
\`\`\`

### Signing Transactions with Passkeys

\`\`\`typescript
import { LazorKit } from '@lazorkit/sdk'
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

async function sendSolWithPasskey() {
  const lazorKit = new LazorKit({ network: 'devnet' })

  // 1. Get user's passkey wallet
  const wallet = await lazorKit.getWallet()

  if (!wallet) {
    console.error('No wallet found. Create one first.')
    return
  }

  // 2. Build Solana transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: 'RECIPIENT_ADDRESS',
      lamports: 0.1 * LAMPORTS_PER_SOL // Send 0.1 SOL
    })
  )

  try {
    // 3. Sign transaction with passkey (triggers biometric prompt)
    console.log('🔐 Prompting for biometric authentication...')

    const signature = await wallet.signTransaction(transaction)

    console.log('✅ Transaction signed with passkey!')
    console.log('Signature (secp256r1):', signature)

    // 4. Behind the scenes:
    // - Browser showed Face ID / Touch ID prompt
    // - User authenticated with biometric
    // - Secure Enclave signed transaction with secp256r1 private key
    // - Signature returned to JavaScript (private key never exposed)

    // 5. Send transaction to Solana
    const txHash = await lazorKit.sendTransaction(transaction, signature)

    console.log('📤 Transaction sent to Solana')
    console.log('Transaction Hash:', txHash)
    console.log(\`View on Explorer: https://explorer.solana.com/tx/\${txHash}?cluster=devnet\`)

    // 6. On-chain verification:
    // - Solana receives transaction
    // - SIMD 75 precompile verifies secp256r1 signature
    // - Smart wallet program checks signature matches owner public key
    // - Transaction executes if valid

  } catch (error) {
    console.error('❌ Transaction failed:', error)
  }
}

// Send transaction
sendSolWithPasskey()
\`\`\`

### The WebAuthn API Under the Hood

**What happens when you call \`createWallet()\`?**

\`\`\`typescript
// LazorKit internally calls:
const credential = await navigator.credentials.create({
  publicKey: {
    // Challenge (prevents replay attacks)
    challenge: new Uint8Array(32), // Random bytes from server

    // Relying Party (your website)
    rp: {
      name: 'LazorKit App',
      id: 'your-app.com'
    },

    // User info
    user: {
      id: new Uint8Array(16), // Random user ID
      name: 'alice@example.com',
      displayName: 'Alice Anderson'
    },

    // Cryptographic parameters
    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7 // ES256 (secp256r1 with SHA-256)
      }
    ],

    // Authenticator selection
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Use device's built-in authenticator
      requireResidentKey: true, // Passkey stored on device
      userVerification: 'required' // Require biometric
    },

    // Timeout
    timeout: 60000 // 60 seconds
  }
})

console.log('Credential created:', credential)

// Extract public key
const publicKey = credential.response.getPublicKey()
console.log('Public key (secp256r1):', publicKey)

// Deploy smart wallet to Solana with this public key
\`\`\`

## Smart Wallet Features

### 1. Policy Engine (Transaction Rules)

**Problem:** Users want granular control over wallet permissions

**Solution:** On-chain policy engine

\`\`\`typescript
import { LazorKit, PolicyEngine } from '@lazorkit/sdk'

async function configurePolicies() {
  const wallet = await lazorKit.getWallet()

  // Define policy: Max 1 SOL per transaction
  await wallet.addPolicy({
    type: 'spending_limit',
    maxAmount: 1 * LAMPORTS_PER_SOL,
    timeWindow: 3600 // 1 hour
  })

  // Define policy: Only allow specific program IDs
  await wallet.addPolicy({
    type: 'program_allowlist',
    allowedPrograms: [
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // SPL Token
      'YOUR_NFT_PROGRAM_ID'
    ]
  })

  // Define policy: Require multi-sig for large amounts
  await wallet.addPolicy({
    type: 'multi_sig',
    threshold: 2,
    signers: [wallet.publicKey, GUARDIAN_PUBLIC_KEY],
    triggerAmount: 10 * LAMPORTS_PER_SOL // Trigger for > 10 SOL
  })

  console.log('✅ Policies configured')
}
\`\`\`

**Enforcement:**
- Policies are stored **on-chain** in smart wallet program
- Every transaction is validated against policies **before execution**
- Invalid transactions are rejected by the smart wallet program

### 2. Session Keys (Temporary Access)

**Problem:** Users don't want to approve every transaction (e.g., in games)

**Solution:** Delegate temporary signing authority

\`\`\`typescript
import { LazorKit } from '@lazorkit/sdk'

async function createSessionKey() {
  const wallet = await lazorKit.getWallet()

  // Create session key that expires in 1 hour
  const sessionKey = await wallet.createSessionKey({
    expiresIn: 3600, // 1 hour
    scope: {
      allowedPrograms: ['GAME_PROGRAM_ID'],
      maxTransactionsPerMinute: 10,
      maxAmountPerTransaction: 0.01 * LAMPORTS_PER_SOL
    }
  })

  console.log('Session Key:', sessionKey.publicKey)

  // Game can now sign transactions with session key
  // No biometric prompt needed until session expires
  const transaction = buildGameTransaction()
  const signature = await sessionKey.sign(transaction)

  console.log('Transaction signed with session key (no biometric)')
}
\`\`\`

**Security:**
- Session keys are **ephemeral** (short-lived)
- **Scoped permissions** (can only do specific things)
- **Revocable** (user can cancel anytime)
- **On-chain tracking** (audit trail of session key usage)

### 3. Gasless Transactions (Paymaster)

**Problem:** New users don't have SOL for transaction fees

**Solution:** Application sponsors fees

\`\`\`typescript
import { LazorKit } from '@lazorkit/sdk'

async function gaslessTransaction() {
  const wallet = await lazorKit.getWallet()

  // Configure paymaster
  const paymaster = lazorKit.getPaymaster({
    sponsor: 'YOUR_PAYMASTER_ACCOUNT'
  })

  // Build transaction
  const transaction = new Transaction().add(
    // Your transaction instructions
  )

  // Send gasless transaction
  // Paymaster pays the fees, app is billed later
  const txHash = await wallet.sendTransaction(transaction, {
    paymaster: paymaster,
    gasless: true
  })

  console.log('✅ Transaction sent (user paid $0 for fees)')
  console.log('Transaction Hash:', txHash)
}
\`\`\`

## Security Model

### Hardware-Backed Security

**Traditional wallet security:**
\`\`\`
Private key stored in:
  ├─ Browser localStorage (can be stolen by XSS)
  ├─ Browser extension (can be compromised)
  └─ Software keystore (can be extracted)

If malware runs on device → Private key compromised
\`\`\`

**LazorKit passkey security:**
\`\`\`
Private key stored in:
  ├─ Apple Secure Enclave (iPhone/Mac)
  ├─ Android StrongBox (Pixel, Samsung)
  ├─ Windows Hello TPM (Surface, Dell)
  └─ YubiKey FIDO2 chip

Even if malware runs on device → Private key safe (hardware-isolated)
\`\`\`

**Key Security Properties:**

1. **Private key never leaves hardware**
   - Stored in Trusted Execution Environment (TEE)
   - Signing happens inside secure enclave
   - Key cannot be extracted, even by OS

2. **Biometric authentication required**
   - Every transaction requires Face ID / Touch ID
   - Protects against unauthorized access
   - No "approve once" vulnerability

3. **Phishing-resistant**
   - WebAuthn includes domain binding
   - Signature only valid for specific website
   - Prevents phishing attacks

### Beta Stage Warnings

**LazorKit is currently in BETA. Do NOT use for production or mainnet funds.**

**Known Limitations:**
- Smart wallet contracts may have bugs
- API is subject to breaking changes
- Limited ecosystem support
- No insurance fund
- Limited customer support

**Recommended Use Cases:**
- Prototyping and experimentation
- Educational demos
- Devnet testing
- Hackathon projects

**NOT Recommended For:**
- Production applications
- Mainnet deployments
- Managing real user funds
- Enterprise applications

## Comparison to Other Solutions

### LazorKit vs Privy (for Solana)

| Feature | LazorKit | Privy (Solana) |
|---------|----------|----------------|
| **Authentication** | WebAuthn passkeys | Email, OAuth, passkeys |
| **Key Management** | Hardware-backed (Secure Enclave) | MPC (3-shard) |
| **Signature Curve** | secp256r1 (P-256) | ed25519 (Solana native) |
| **On-Chain Verification** | ✅ Yes (SIMD 75) | ❌ No (relies on off-chain MPC) |
| **Smart Wallet** | ✅ Yes (programmable) | ⚠️ Basic |
| **Gasless Transactions** | ✅ Yes | ✅ Yes |
| **Multi-Chain** | ❌ Solana only | ✅ EVM + Solana + more |
| **Production Ready** | ❌ Beta | ✅ Yes |
| **Best For** | Solana-specific passkey experiments | Production Web3 apps |

**Key Insight:** LazorKit is **Solana-specific and experimental**, Privy is **multi-chain and production-ready**.

### LazorKit vs Traditional Solana Wallets (Phantom)

| Feature | LazorKit | Phantom Wallet |
|---------|----------|----------------|
| **Signature Type** | secp256r1 (WebAuthn) | ed25519 (Solana native) |
| **Hardware Backing** | ✅ Always (Secure Enclave) | ⚠️ Optional (Ledger support) |
| **Seed Phrase** | ❌ No seed phrase | ✅ 12-word seed phrase required |
| **Browser Extension** | ❌ Not needed | ✅ Required |
| **Biometric Auth** | ✅ Built-in (Face ID, Touch ID) | ⚠️ Via device unlock |
| **Smart Wallet** | ✅ Programmable on-chain | ❌ Standard wallet |
| **Phishing Resistance** | ✅ Domain-bound signatures | ⚠️ User must verify URL |
| **Adoption** | ❌ Very low (beta) | ✅ Very high (millions of users) |

**Key Insight:** LazorKit offers **superior security** but is **early-stage**, Phantom is **proven and widely adopted**.

## Real-World Implementation Example

\`\`\`typescript
/**
 * Complete LazorKit Implementation
 * Demonstrates passkey wallet creation, transaction signing, and policy configuration
 */

import {
  LazorKit,
  LazorKitWallet,
  PolicyEngine,
  SessionKey
} from '@lazorkit/sdk'
import {
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey
} from '@solana/web3.js'

// Initialize LazorKit
const lazorKit = new LazorKit({
  network: 'devnet', // or 'mainnet-beta'
  rpcUrl: 'https://api.devnet.solana.com'
})

/**
 * Step 1: Create Passkey Wallet
 */
async function createWallet(userName: string, userEmail: string) {
  try {
    console.log('Creating passkey wallet...')
    console.log('Please authenticate with biometric')

    const wallet = await lazorKit.createWallet({
      authenticatorType: 'platform', // Device's built-in authenticator
      userDisplayName: userName,
      userId: userEmail
    })

    console.log('✅ Wallet created successfully!')
    console.log('Address:', wallet.address)
    console.log('Public Key (secp256r1):', wallet.publicKey.toBase58())

    // Store wallet reference for later use
    localStorage.setItem('lazorkit-wallet-id', wallet.id)

    return wallet
  } catch (error: any) {
    console.error('Failed to create wallet:', error)

    if (error.name === 'NotAllowedError') {
      throw new Error('User cancelled biometric authentication')
    } else if (error.name === 'NotSupportedError') {
      throw new Error('WebAuthn not supported on this device')
    } else {
      throw error
    }
  }
}

/**
 * Step 2: Get Existing Wallet
 */
async function getWallet(): Promise<LazorKitWallet> {
  const walletId = localStorage.getItem('lazorkit-wallet-id')

  if (!walletId) {
    throw new Error('No wallet found. Create one first.')
  }

  const wallet = await lazorKit.getWallet(walletId)

  if (!wallet) {
    throw new Error('Wallet not found')
  }

  return wallet
}

/**
 * Step 3: Send SOL with Passkey Signature
 */
async function sendSol(recipientAddress: string, amount: number) {
  const wallet = await getWallet()

  // Build transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(wallet.address),
      toPubkey: new PublicKey(recipientAddress),
      lamports: amount * LAMPORTS_PER_SOL
    })
  )

  try {
    console.log(\`Sending \${amount} SOL to \${recipientAddress}\`)
    console.log('🔐 Please authenticate with biometric...')

    // Sign with passkey (triggers Face ID / Touch ID)
    const signature = await wallet.signTransaction(transaction)

    console.log('✅ Transaction signed!')

    // Send to Solana
    const txHash = await lazorKit.sendTransaction(transaction, signature)

    console.log('📤 Transaction sent!')
    console.log('Transaction Hash:', txHash)
    console.log(\`View: https://explorer.solana.com/tx/\${txHash}?cluster=devnet\`)

    return txHash
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

/**
 * Step 4: Configure Wallet Policies
 */
async function setupPolicies() {
  const wallet = await getWallet()

  console.log('Configuring wallet policies...')

  // Policy 1: Spending limit (max 1 SOL per hour)
  await wallet.addPolicy({
    type: 'spending_limit',
    maxAmount: 1 * LAMPORTS_PER_SOL,
    timeWindow: 3600 // 1 hour in seconds
  })

  console.log('✅ Spending limit policy added: 1 SOL/hour')

  // Policy 2: Program allowlist
  await wallet.addPolicy({
    type: 'program_allowlist',
    allowedPrograms: [
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // SPL Token
      '11111111111111111111111111111111' // System Program
    ]
  })

  console.log('✅ Program allowlist policy added')

  // Policy 3: Daily transaction limit
  await wallet.addPolicy({
    type: 'rate_limit',
    maxTransactions: 10,
    timeWindow: 86400 // 24 hours
  })

  console.log('✅ Rate limit policy added: 10 tx/day')
}

/**
 * Step 5: Create Session Key for Gaming
 */
async function createGamingSession(gameProgramId: string) {
  const wallet = await getWallet()

  console.log('Creating gaming session key...')

  const sessionKey = await wallet.createSessionKey({
    expiresIn: 3600, // 1 hour
    scope: {
      allowedPrograms: [gameProgramId],
      maxTransactionsPerMinute: 30, // Fast-paced game
      maxAmountPerTransaction: 0.001 * LAMPORTS_PER_SOL // Micro-transactions
    }
  })

  console.log('✅ Session key created!')
  console.log('Public Key:', sessionKey.publicKey.toBase58())
  console.log('Expires in: 1 hour')

  // Return session key for game to use
  return sessionKey
}

/**
 * Step 6: Gasless Transaction (Sponsored by App)
 */
async function sendGaslessTransaction(recipientAddress: string) {
  const wallet = await getWallet()

  // Configure paymaster
  const paymaster = lazorKit.getPaymaster({
    sponsor: process.env.PAYMASTER_ACCOUNT! // Your paymaster account
  })

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(wallet.address),
      toPubkey: new PublicKey(recipientAddress),
      lamports: 0.01 * LAMPORTS_PER_SOL
    })
  )

  console.log('Sending gasless transaction...')
  console.log('🔐 Please authenticate with biometric...')

  // Sign and send with paymaster
  const signature = await wallet.signTransaction(transaction)
  const txHash = await lazorKit.sendTransaction(transaction, signature, {
    paymaster: paymaster
  })

  console.log('✅ Gasless transaction sent!')
  console.log('User paid: $0.00 (sponsored by app)')
  console.log('Transaction Hash:', txHash)

  return txHash
}

/**
 * Demo Application
 */
async function demoApp() {
  console.log('\\n=== LazorKit Passkey Wallet Demo ===\\n')

  try {
    // Step 1: Create wallet
    const wallet = await createWallet('Alice Anderson', 'alice@example.com')

    // Step 2: Configure policies
    await setupPolicies()

    // Step 3: Send SOL
    await sendSol('RECIPIENT_ADDRESS', 0.1)

    // Step 4: Create gaming session
    const sessionKey = await createGamingSession('GAME_PROGRAM_ID')

    // Step 5: Send gasless transaction
    await sendGaslessTransaction('RECIPIENT_ADDRESS')

    console.log('\\n=== Demo Complete ===\\n')
  } catch (error) {
    console.error('Demo failed:', error)
  }
}

// Run demo
demoApp()

export {
  createWallet,
  getWallet,
  sendSol,
  setupPolicies,
  createGamingSession,
  sendGaslessTransaction
}
\`\`\`

## Key Takeaways

1. **LazorKit enables native passkey authentication on Solana** using WebAuthn and secp256r1 (P-256) curve, leveraging device Secure Enclaves for hardware-backed security

2. **Solana SIMD 75 precompile** enables on-chain verification of secp256r1 signatures, making passkey-based smart wallets possible without off-chain components

3. **Hardware-backed security** ensures private keys never leave Secure Enclave, providing phishing resistance and protection against malware even on compromised devices

4. **Smart wallet features** include programmable policies (spending limits, program allowlists), session keys for temporary access, and gasless transactions via paymaster integration

5. **Currently in beta stage** - LazorKit is experimental and NOT recommended for production use or mainnet deployments with real funds

6. **Solana-specific solution** - Unlike multi-chain platforms (Privy, Web3Auth), LazorKit is optimized exclusively for Solana blockchain

**Next:** We'll compare all platforms and provide decision frameworks for choosing the right authentication solution.
          `
        }
      ],
      quiz: {
        id: "lazorkit-quiz",
        title: "LazorKit Solana Passkeys Quiz",
        description: "Test your understanding of LazorKit's passkey implementation and smart wallet features",
        passingScore: 70,
        questions: [
          {
            id: "laz-q1",
            question: "What cryptographic curve does LazorKit use for passkey signatures, and why is it significant?",
            options: [
              "ed25519, because it's the native Solana signature algorithm",
              "secp256r1 (P-256), because it's the standard used by Apple Secure Enclave, Android StrongBox, and WebAuthn",
              "secp256k1, because it's compatible with Ethereum",
              "RSA-2048, for maximum security"
            ],
            correctAnswer: 1,
            explanation: "LazorKit uses secp256r1 (P-256), the NIST-standardized elliptic curve used by Apple's Secure Enclave (Face ID/Touch ID), Android StrongBox, YubiKeys, and the WebAuthn standard. This enables hardware-backed passkey authentication where private keys are stored in device security chips and never exposed to software, providing superior security compared to software-only wallets."
          },
          {
            id: "laz-q2",
            question: "What is Solana SIMD 75 and why is it critical for LazorKit?",
            options: [
              "A smart contract standard for NFTs",
              "A precompiled instruction that enables on-chain verification of secp256r1 (WebAuthn) signatures",
              "A consensus mechanism upgrade",
              "A token standard for fungible assets"
            ],
            correctAnswer: 1,
            explanation: "SIMD 75 is a Solana Improvement Document that adds secp256r1 signature verification as a precompiled instruction. Before SIMD 75, Solana could only verify ed25519 and secp256k1 signatures on-chain. SIMD 75 enables smart contracts to verify WebAuthn/passkey signatures (secp256r1) directly on Solana, making LazorKit's passkey-based smart wallets possible without requiring off-chain verification components."
          },
          {
            id: "laz-q3",
            question: "How do LazorKit passkeys provide superior security compared to traditional software wallets?",
            options: [
              "Passkeys use longer seed phrases",
              "Private keys are stored in hardware security chips (Secure Enclave) and cannot be extracted, even by malware on the device",
              "Passkeys use stronger encryption algorithms",
              "Passkeys are backed up to the cloud"
            ],
            correctAnswer: 1,
            explanation: "LazorKit passkeys leverage hardware security by storing private keys in Trusted Execution Environments (TEEs) like Apple's Secure Enclave or Android StrongBox. These hardware chips are isolated from the main operating system - private keys never leave the secure chip, signing happens inside the hardware, and even if malware compromises the device, the private key remains protected. Traditional software wallets store keys in browser storage or software keystores, which can be extracted by malware."
          },
          {
            id: "laz-q4",
            question: "What are LazorKit smart wallet policies and how are they enforced?",
            options: [
              "Client-side rules checked by JavaScript",
              "On-chain programmable rules (spending limits, program allowlists, rate limits) validated by the smart wallet program before transaction execution",
              "Server-side rules enforced by LazorKit's API",
              "Browser extension permissions"
            ],
            correctAnswer: 1,
            explanation: "LazorKit smart wallet policies are programmable rules stored on-chain in the smart wallet program. Policies can include spending limits (e.g., max 1 SOL/hour), program allowlists (only interact with specific contracts), and rate limits (max transactions per day). These policies are enforced by the smart wallet program itself - every transaction is validated against the on-chain policies before execution. Invalid transactions are rejected by the smart contract, not by client-side code that could be bypassed."
          },
          {
            id: "laz-q5",
            question: "What is the current production readiness status of LazorKit?",
            options: [
              "Production-ready and recommended for mainnet deployments",
              "Beta stage - suitable for prototyping and devnet testing, NOT recommended for production or real user funds",
              "Enterprise-ready with SOC 2 compliance",
              "Deprecated and no longer maintained"
            ],
            correctAnswer: 1,
            explanation: "LazorKit is currently in BETA stage and is NOT production-ready. It's recommended only for prototyping, educational demos, devnet testing, and hackathon projects. The platform has known limitations including potential smart contract bugs, breaking API changes, limited ecosystem support, no insurance fund, and limited customer support. Users should NOT deploy LazorKit on mainnet or use it to manage real user funds."
          },
          {
            id: "laz-q6",
            question: "How do LazorKit session keys work, and what problem do they solve?",
            options: [
              "Permanent keys that never expire",
              "Ephemeral keys with scoped permissions that allow temporary signing authority without biometric prompts, ideal for gaming and frequent transactions",
              "Backup keys stored in the cloud",
              "Keys shared between multiple users"
            ],
            correctAnswer: 1,
            explanation: "LazorKit session keys solve the user experience problem of requiring biometric authentication for every transaction (which is annoying in fast-paced games or apps with frequent transactions). Session keys are ephemeral (short-lived, e.g., 1 hour), have scoped permissions (limited to specific programs and amounts), are revocable (user can cancel anytime), and have on-chain audit trails. Applications can use session keys to sign transactions without prompting for biometrics each time, while maintaining security through strict scoping and expiration."
          }
        ]
      }
    }
  ]
}
