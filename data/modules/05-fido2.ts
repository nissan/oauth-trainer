/**
 * Module 5: FIDO2 & WebAuthn (Passwordless Authentication)
 *
 * This module covers modern passwordless authentication using FIDO2/WebAuthn,
 * including passkeys, hardware authenticators, biometrics, and phishing resistance.
 */

import type { Module } from "@/types"

export const fido2Module: Module = {
  id: "fido2",
  slug: "fido2",
  title: "FIDO2 & WebAuthn",
  description: "Master passwordless authentication with FIDO2, WebAuthn, passkeys, and hardware-bound credentials for phishing-resistant security.",
  icon: "🔑",
  difficulty: "intermediate",
  estimatedHours: 3.5,
  prerequisiteModules: ["auth-fundamentals"],
  learningObjectives: [
    "Understand FIDO2 architecture and WebAuthn API",
    "Learn how public key cryptography enables passwordless authentication",
    "Implement passkeys and hardware authenticators",
    "Master registration and authentication ceremonies",
    "Understand attestation and credential backup",
    "Build phishing-resistant authentication flows"
  ],
  badge: {
    id: "passwordless-expert",
    name: "Passwordless Expert",
    description: "Mastered FIDO2 and WebAuthn passwordless authentication",
    icon: "🔑"
  },
  lessons: [
    {
      id: "fido2-fundamentals",
      slug: "fido2-fundamentals",
      title: "FIDO2 & WebAuthn Fundamentals",
      description: "Understanding passwordless authentication, FIDO Alliance, and the WebAuthn standard.",
      estimatedMinutes: 30,
      content: [
        {
          type: "text",
          title: "The Password Problem",
          content: `
Passwords have been the dominant authentication method for decades, but they have critical weaknesses:

## Why Passwords Are Broken

**Security Issues:**
- 🚨 **Phishing attacks** - Users enter passwords on fake sites
- 🚨 **Credential stuffing** - Reused passwords across sites
- 🚨 **Weak passwords** - "password123", "qwerty"
- 🚨 **Database breaches** - Billions of passwords leaked
- 🚨 **Shoulder surfing** - Passwords visible when typed
- 🚨 **Keyloggers** - Malware captures keystrokes

**Usability Problems:**
- 😫 Password fatigue (average user has 100+ accounts)
- 😫 Forgotten passwords (30% of users reset monthly)
- 😫 Complex requirements (uppercase, numbers, symbols)
- 😫 Frequent rotation policies
- 😫 Help desk burden (20-50% of calls are password resets)

## The Passwordless Solution: FIDO2

**FIDO2** eliminates passwords using **public key cryptography** and **hardware-bound credentials**.

### Key Benefits

**Security:**
- ✅ **Phishing-resistant** - No password to steal
- ✅ **No shared secrets** - Private key never leaves device
- ✅ **Hardware-bound** - Can't be copied or transmitted
- ✅ **Biometric local** - Fingerprint/face never sent to server
- ✅ **Origin-binding** - Only works on legitimate domain

**Usability:**
- ✅ **Fast login** - Touch fingerprint or face scan
- ✅ **No password to remember** - Credentials tied to device
- ✅ **Works offline** - No network needed for local verification
- ✅ **Cross-platform** - Sync via passkeys (iCloud, Google)

**Cost Reduction:**
- ✅ **Fewer help desk calls** - No password resets
- ✅ **Reduced fraud** - Phishing attacks fail
- ✅ **Better user retention** - Easier authentication
          `
        },
        {
          type: "text",
          title: "What is FIDO2?",
          content: `
**FIDO2** is a set of standards for passwordless authentication developed by the **FIDO Alliance** and **W3C**.

## FIDO2 Components

### 1. WebAuthn (Web Authentication API)

**WebAuthn** is the W3C browser API that:
- Enables websites to use public key credentials
- Provides JavaScript APIs for registration and authentication
- Supported by all major browsers (Chrome, Firefox, Safari, Edge)
- Works on desktop and mobile

**Browser Support (2024):**
- ✅ Chrome 67+ (May 2018)
- ✅ Firefox 60+ (May 2018)
- ✅ Safari 13+ (September 2019)
- ✅ Edge 18+ (October 2018)
- ✅ iOS Safari 14+ (September 2020)
- ✅ Chrome Android 70+ (October 2018)

### 2. CTAP (Client to Authenticator Protocol)

**CTAP** is the protocol between:
- **CTAP1** (U2F): Security keys via USB/NFC (legacy)
- **CTAP2**: Modern protocol supporting USB, NFC, Bluetooth

**Authenticator Types:**
- **Platform authenticators**: Built into device (Touch ID, Face ID, Windows Hello)
- **Roaming authenticators**: External devices (YubiKey, security keys)

## FIDO2 Architecture

\`\`\`
┌─────────────────────────────────────────────────┐
│           User (Person)                         │
└─────────────────┬───────────────────────────────┘
                  │ Biometric/PIN
                  ↓
┌─────────────────────────────────────────────────┐
│     Platform Authenticator (Device)             │
│  • Touch ID / Face ID (iOS)                     │
│  • Windows Hello (Windows)                      │
│  • Fingerprint sensor (Android)                 │
│                                                  │
│  OR                                              │
│                                                  │
│     Roaming Authenticator (Security Key)        │
│  • YubiKey                                       │
│  • Titan Security Key (Google)                  │
│  • FEITIAN Keys                                 │
└─────────────────┬───────────────────────────────┘
                  │ CTAP2 (USB/NFC/Bluetooth)
                  ↓
┌─────────────────────────────────────────────────┐
│           Browser (Chrome, Safari)              │
│         WebAuthn API (JavaScript)               │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS
                  ↓
┌─────────────────────────────────────────────────┐
│       Relying Party (Your Website)              │
│    • Registration endpoint                      │
│    • Authentication endpoint                    │
│    • Credential storage (public keys)           │
└─────────────────────────────────────────────────┘
\`\`\`

## How FIDO2 Works (High-Level)

### Registration (Create Credential)

1. **User** visits website and clicks "Register with passkey"
2. **Website** requests browser to create credential
3. **Browser** calls WebAuthn API
4. **Authenticator** prompts for biometric/PIN
5. **User** provides fingerprint/face scan
6. **Authenticator** generates key pair (private + public)
7. **Private key** stored securely in authenticator (never leaves)
8. **Public key** sent to website
9. **Website** stores public key associated with user account

### Authentication (Verify Identity)

1. **User** visits website and clicks "Sign in with passkey"
2. **Website** sends challenge (random bytes)
3. **Browser** calls WebAuthn API with challenge
4. **Authenticator** prompts for biometric/PIN
5. **User** provides fingerprint/face scan
6. **Authenticator** signs challenge with private key
7. **Signature** sent to website (private key never transmitted)
8. **Website** verifies signature using stored public key
9. **User** authenticated and granted access

> **Key Insight:** The private key NEVER leaves the authenticator. Only signatures and public keys are transmitted.
          `
        },
        {
          type: "diagram",
          title: "FIDO2 Registration Flow",
          content: `sequenceDiagram
    participant User
    participant Browser
    participant Authenticator as Authenticator (Touch ID)
    participant RP as Relying Party (Website)

    User->>Browser: Click "Register with passkey"
    Browser->>RP: Request registration options
    RP->>RP: Generate challenge (random bytes)
    RP->>Browser: Return challenge + user info
    Browser->>Authenticator: navigator.credentials.create()
    Authenticator->>User: Prompt for biometric/PIN
    User->>Authenticator: Provide fingerprint
    Authenticator->>Authenticator: Generate key pair
    Authenticator->>Authenticator: Store private key (secure enclave)
    Authenticator->>Browser: Return public key + attestation
    Browser->>RP: Send public key + attestation
    RP->>RP: Verify attestation
    RP->>RP: Store public key with user account
    RP->>Browser: Registration success
    Browser->>User: Account created!`,
          caption: "FIDO2 registration ceremony showing public key creation and storage"
        },
        {
          type: "text",
          title: "FIDO2 vs. Traditional Authentication",
          content: `
## Comparison Table

| Aspect | Passwords | Password + 2FA | FIDO2 Passkeys |
|--------|-----------|----------------|----------------|
| **Phishing Resistance** | ❌ No | ⚠️ Partial (SMS/TOTP phishable) | ✅ Yes (origin-bound) |
| **User Experience** | 😫 Type password | 😫 Type password + code | 😊 Touch/face scan |
| **Credential Theft** | ❌ Easy (database breach) | ⚠️ Passwords still leaked | ✅ Impossible (private key never leaves device) |
| **Account Takeover** | ❌ High risk | ⚠️ Medium risk | ✅ Very low risk |
| **Password Reuse** | ❌ Common | ⚠️ Still possible | ✅ N/A (no passwords) |
| **Help Desk Calls** | 😫 20-50% of tickets | 😫 Still high | 😊 Minimal |
| **Setup Time** | 10 seconds | 30-60 seconds | 15 seconds |
| **Login Time** | 10-20 seconds | 30-45 seconds | 2-5 seconds |
| **Works Offline** | ❌ No (server validation) | ❌ No | ✅ Yes (local biometric) |
| **Cost** | Low | Medium (SMS, TOTP app) | Low (built into devices) |
| **Adoption Barrier** | None | Low (app installation) | Low (device support) |

## Real-World Attack Scenarios

### Scenario 1: Phishing Attack

**With Passwords:**
1. Attacker creates fake login page: \`https://gooogle.com\` (note extra 'o')
2. User enters username + password
3. ❌ **Attacker captures credentials**
4. Attacker logs into real site with stolen credentials
5. **Result: Account compromised**

**With FIDO2:**
1. Attacker creates fake login page: \`https://gooogle.com\`
2. User clicks "Sign in with passkey"
3. ✅ **Browser checks origin: gooogle.com ≠ google.com**
4. Authenticator refuses to sign (origin mismatch)
5. **Result: Attack fails**

### Scenario 2: Database Breach

**With Passwords:**
1. Attacker breaches website database
2. ❌ **Attacker steals password hashes**
3. Attacker cracks hashes offline (weak passwords)
4. Attacker tries credentials on other sites (password reuse)
5. **Result: Multiple accounts compromised**

**With FIDO2:**
1. Attacker breaches website database
2. ✅ **Attacker only finds public keys**
3. Public keys are useless without private keys
4. Private keys locked in authenticator hardware
5. **Result: No useful data stolen**

### Scenario 3: Man-in-the-Middle (MITM)

**With Passwords:**
1. Attacker intercepts HTTPS connection (rare but possible)
2. User types password
3. ❌ **Attacker captures password in transit** (if weak TLS)
4. **Result: Password compromised**

**With FIDO2:**
1. Attacker attempts MITM
2. ✅ **Challenge-response is time-bound**
3. Signature only valid for specific origin + challenge
4. Cannot be replayed
5. **Result: Attack fails**

## Passkeys: The Future

**Passkeys** are FIDO credentials that sync across devices:

**Apple Passkeys (iCloud Keychain):**
- Sync across iPhone, iPad, Mac via iCloud
- End-to-end encrypted
- Accessible via Face ID / Touch ID

**Google Password Manager:**
- Sync across Android, Chrome
- Encrypted with user's Google account
- Accessible via fingerprint / screen lock

**Benefits:**
- ✅ No lock-in to single device
- ✅ Credential backup (device loss protection)
- ✅ Seamless cross-device experience
- ✅ Still phishing-resistant

> **Note:** Even with cloud sync, private keys are encrypted and only decryptable on user's trusted devices.
          `
        },
        {
          type: "interactive",
          title: "🎯 Try It: FIDO2 Concepts Quiz",
          content: `
Test your understanding of FIDO2 fundamentals:

**Question 1:** What makes FIDO2 phishing-resistant?
- A) Strong passwords
- B) Origin-binding (credentials only work on legitimate domain)
- C) SMS codes
- D) Email verification

**Question 2:** Where is the private key stored in FIDO2?
- A) In the browser's localStorage
- B) On the website's server
- C) In the authenticator hardware (never leaves device)
- D) In a cloud database

**Question 3:** What happens if an attacker steals the public key from a database?
- A) Attacker can impersonate user
- B) Attacker can decrypt user data
- C) Attacker can log in as user
- D) Nothing - public key is useless without private key

**Question 4:** What are "passkeys"?
- A) Passwords that are easier to remember
- B) FIDO credentials that sync across devices via encrypted cloud
- C) Hardware security keys
- D) One-time passwords

<details>
<summary>View Answers</summary>

1. **B** - Origin-binding ensures credentials only work on the legitimate domain, preventing phishing
2. **C** - Private key is stored in authenticator hardware and never leaves the device
3. **D** - Public keys are useless without the corresponding private key, which never leaves the authenticator
4. **B** - Passkeys are FIDO credentials that sync across user's devices via encrypted cloud (iCloud, Google)
</details>
          `
        }
      ],
      quiz: {
        id: "fido2-fundamentals-quiz",
        title: "FIDO2 Fundamentals Quiz",
        description: "Test your knowledge of FIDO2 and WebAuthn basics",
        passingScore: 70,
        questions: [
          {
            id: "fido2-q1",
            question: "What does FIDO stand for?",
            options: [
              "Fast Identity Digital Online",
              "Fast Identity Online",
              "Federated Identity Digital Online",
              "Fingerprint Identity Digital Online"
            ],
            correctAnswer: 1,
            explanation: "FIDO stands for Fast Identity Online. It's an open standard for passwordless authentication developed by the FIDO Alliance."
          },
          {
            id: "fido2-q2",
            question: "Which component of FIDO2 is the browser API for credential management?",
            options: [
              "CTAP (Client to Authenticator Protocol)",
              "WebAuthn (Web Authentication API)",
              "U2F (Universal 2nd Factor)",
              "UAF (Universal Authentication Framework)"
            ],
            correctAnswer: 1,
            explanation: "WebAuthn is the W3C browser API that websites use to create and use public key credentials for passwordless authentication."
          },
          {
            id: "fido2-q3",
            question: "Why is FIDO2 resistant to phishing attacks?",
            options: [
              "It uses very strong passwords",
              "It sends OTP codes via SMS",
              "Credentials are origin-bound and only work on the legitimate domain",
              "It encrypts all communications"
            ],
            correctAnswer: 2,
            explanation: "FIDO2 credentials are bound to the origin (domain). The browser verifies the origin matches before allowing the authenticator to sign, preventing use on phishing sites."
          }
        ]
      }
    },
    {
      id: "webauthn-api",
      slug: "webauthn-api",
      title: "WebAuthn API Deep Dive",
      description: "Master the Web Authentication API for implementing passwordless authentication in web applications.",
      estimatedMinutes: 40,
      content: [
        {
          type: "text",
          title: "WebAuthn API Overview",
          content: `
The **Web Authentication API** (WebAuthn) provides two main operations:

## 1. Registration (Creating Credentials)

**JavaScript API:**
\`\`\`javascript
const credential = await navigator.credentials.create({
  publicKey: publicKeyCredentialCreationOptions
})
\`\`\`

**Returns:** \`PublicKeyCredential\` object containing the new credential's public key

## 2. Authentication (Verifying Identity)

**JavaScript API:**
\`\`\`javascript
const assertion = await navigator.credentials.get({
  publicKey: publicKeyCredentialRequestOptions
})
\`\`\`

**Returns:** \`PublicKeyCredential\` object containing the authentication assertion

## PublicKeyCredential Interface

Both operations return a \`PublicKeyCredential\` with these properties:

\`\`\`typescript
interface PublicKeyCredential {
  id: string                    // Base64url-encoded credential ID
  rawId: ArrayBuffer            // Raw credential ID bytes
  type: "public-key"            // Always "public-key" for WebAuthn
  response: AuthenticatorResponse  // Registration or Authentication response
}
\`\`\`

## Authenticator Types

**Platform Authenticators:**
- Built into the device/OS
- Examples: Touch ID, Face ID, Windows Hello
- User verification: Biometric or device PIN
- \`authenticatorAttachment: "platform"\`

**Roaming Authenticators:**
- External security keys
- Examples: YubiKey, Google Titan, Feitian
- Connection: USB, NFC, or Bluetooth
- \`authenticatorAttachment: "cross-platform"\`

**You can require a specific type:**
\`\`\`javascript
authenticatorSelection: {
  authenticatorAttachment: "platform"  // Require Touch ID/Face ID/Windows Hello
}
\`\`\`
          `
        },
        {
          type: "text",
          title: "Registration Flow (Creating a Credential)",
          content: `
## Step 1: Generate Registration Options (Server-Side)

The **Relying Party** (your server) generates options for registration:

\`\`\`javascript
// Server-side (Node.js example)
const registrationOptions = {
  challenge: crypto.randomBytes(32),  // Random challenge (must be fresh)

  rp: {
    name: "Example Corp",              // Your organization name
    id: "example.com"                  // Your domain (no protocol, no port)
  },

  user: {
    id: crypto.randomBytes(16),        // Unique user identifier (never changes)
    name: "alice@example.com",         // User's username/email (visible)
    displayName: "Alice Smith"         // User's display name
  },

  pubKeyCredParams: [                  // Supported algorithms
    { alg: -7, type: "public-key" },   // ES256 (ECDSA with SHA-256)
    { alg: -257, type: "public-key" }  // RS256 (RSA with SHA-256)
  ],

  authenticatorSelection: {
    authenticatorAttachment: "platform",  // Prefer built-in (Touch ID, etc.)
    userVerification: "required",         // Require biometric/PIN
    residentKey: "required"               // Create discoverable credential (passkey)
  },

  timeout: 60000,                      // 60 seconds

  attestation: "none"                  // Don't request attestation (privacy)
}

// Store challenge associated with user session
sessionStore.set(sessionId, { challenge, userId })

// Send to browser
res.json(registrationOptions)
\`\`\`

## Step 2: Call WebAuthn API (Browser-Side)

\`\`\`javascript
// Browser-side JavaScript
async function registerCredential(options) {
  try {
    // Convert challenge and user.id from base64url to ArrayBuffer
    options.challenge = base64urlDecode(options.challenge)
    options.user.id = base64urlDecode(options.user.id)

    // Call WebAuthn API
    const credential = await navigator.credentials.create({
      publicKey: options
    })

    // At this point:
    // 1. Browser prompted user for biometric/PIN
    // 2. User provided Touch ID/Face ID
    // 3. Authenticator generated key pair
    // 4. Private key stored in secure hardware
    // 5. Public key returned in credential object

    return credential
  } catch (error) {
    console.error("Registration failed:", error)
    throw error
  }
}
\`\`\`

## Step 3: Send Credential to Server

\`\`\`javascript
// Convert credential to JSON-serializable format
const credentialJSON = {
  id: credential.id,
  rawId: base64urlEncode(credential.rawId),
  type: credential.type,
  response: {
    clientDataJSON: base64urlEncode(credential.response.clientDataJSON),
    attestationObject: base64urlEncode(credential.response.attestationObject)
  }
}

// Send to server
await fetch('/register/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentialJSON)
})
\`\`\`

## Step 4: Verify and Store (Server-Side)

\`\`\`javascript
// Server-side verification
const { challenge, userId } = sessionStore.get(sessionId)

// Decode response
const clientDataJSON = JSON.parse(
  base64urlDecode(credentialJSON.response.clientDataJSON).toString()
)
const attestationObject = cbor.decode(
  base64urlDecode(credentialJSON.response.attestationObject)
)

// Verify challenge matches
if (clientDataJSON.challenge !== base64urlEncode(challenge)) {
  throw new Error("Challenge mismatch")
}

// Verify origin
if (clientDataJSON.origin !== "https://example.com") {
  throw new Error("Origin mismatch")
}

// Verify type
if (clientDataJSON.type !== "webauthn.create") {
  throw new Error("Invalid ceremony type")
}

// Extract public key from authenticator data
const authData = attestationObject.authData
const publicKey = extractPublicKey(authData)  // COSE format

// Store credential in database
await db.credentials.create({
  userId: userId,
  credentialId: credentialJSON.rawId,
  publicKey: publicKey,
  signCount: 0,
  transports: credential.response.getTransports(),  // USB, NFC, BLE
  createdAt: new Date()
})
\`\`\`

## Important Registration Concepts

### Challenge

**Purpose:** Prevent replay attacks

- Must be cryptographically random (32+ bytes)
- Must be unique per registration attempt
- Stored server-side, associated with session
- Verified in response's \`clientDataJSON\`

### User ID

**Purpose:** Unique identifier for the user

- Must be unique and stable (never changes)
- Typically a database UUID or random bytes
- **NOT** the username (usernames can change)
- Used to look up credentials during authentication

### Resident Key (Discoverable Credential)

**Purpose:** Enable username-less authentication

\`\`\`javascript
residentKey: "required"  // Creates passkey (stored on authenticator)
\`\`\`

- **Resident key**: Credential stored on authenticator
- Allows authentication without username
- Required for true passwordless (no username entry)
- Examples: Touch ID, Face ID, YubiKey 5 series

### User Verification

**Purpose:** Ensure user is present and verified

\`\`\`javascript
userVerification: "required"  // Require biometric/PIN
\`\`\`

- **required**: Must use biometric or PIN
- **preferred**: Use if available, fallback to presence test
- **discouraged**: Only test user presence (tap key)
          `
        },
        {
          type: "code",
          title: "Complete Registration Example (Client-Side)",
          language: "javascript",
          content: `// Complete client-side registration flow

async function registerWithPasskey() {
  try {
    // Step 1: Request registration options from server
    const optionsResponse = await fetch('/register/begin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'alice@example.com',
        displayName: 'Alice Smith'
      })
    })

    const options = await optionsResponse.json()

    // Step 2: Convert base64url strings to ArrayBuffers
    options.challenge = base64urlToBuffer(options.challenge)
    options.user.id = base64urlToBuffer(options.user.id)

    // If excludeCredentials exists, convert those too
    if (options.excludeCredentials) {
      options.excludeCredentials = options.excludeCredentials.map(cred => ({
        ...cred,
        id: base64urlToBuffer(cred.id)
      }))
    }

    // Step 3: Call WebAuthn API to create credential
    console.log('Prompting for biometric...')
    const credential = await navigator.credentials.create({
      publicKey: options
    })

    console.log('Credential created:', credential.id)

    // Step 4: Prepare credential for transmission
    const credentialJSON = {
      id: credential.id,
      rawId: bufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
        attestationObject: bufferToBase64url(credential.response.attestationObject),
        transports: credential.response.getTransports()
      }
    }

    // Step 5: Send to server for verification and storage
    const verifyResponse = await fetch('/register/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentialJSON)
    })

    const result = await verifyResponse.json()

    if (result.success) {
      console.log('Registration successful!')
      return result
    } else {
      throw new Error(result.error || 'Registration failed')
    }

  } catch (error) {
    console.error('Registration error:', error)

    // Handle specific error types
    if (error.name === 'NotAllowedError') {
      alert('Registration cancelled or timed out')
    } else if (error.name === 'InvalidStateError') {
      alert('Authenticator already registered')
    } else if (error.name === 'NotSupportedError') {
      alert('WebAuthn not supported on this device')
    } else {
      alert('Registration failed: ' + error.message)
    }

    throw error
  }
}

// Helper: Convert base64url string to ArrayBuffer
function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

// Helper: Convert ArrayBuffer to base64url string
function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return base64.replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=/g, '')
}

// Usage
document.getElementById('registerButton').addEventListener('click', async () => {
  try {
    await registerWithPasskey()
    window.location.href = '/dashboard'
  } catch (error) {
    console.error('Registration failed:', error)
  }
})`,
          caption: "Complete client-side WebAuthn registration with error handling and base64url conversion"
        },
        {
          type: "text",
          title: "Authentication Flow (Verifying Identity)",
          content: `
## Step 1: Generate Authentication Options (Server-Side)

\`\`\`javascript
// Server-side authentication initiation
const authenticationOptions = {
  challenge: crypto.randomBytes(32),  // Fresh random challenge

  timeout: 60000,                     // 60 seconds

  rpId: "example.com",                // Your domain

  allowCredentials: [                 // List of allowed credentials for this user
    {
      id: credentialIdFromDB,         // Credential ID from registration
      type: "public-key",
      transports: ["internal", "usb", "nfc", "ble"]
    }
  ],

  userVerification: "required"        // Require biometric/PIN
}

// For username-less (discoverable credentials):
// Omit allowCredentials to allow any credential on authenticator

sessionStore.set(sessionId, { challenge, userId })
res.json(authenticationOptions)
\`\`\`

## Step 2: Call WebAuthn API (Browser-Side)

\`\`\`javascript
// Browser-side authentication
async function authenticateWithPasskey(options) {
  try {
    // Convert challenge to ArrayBuffer
    options.challenge = base64urlDecode(options.challenge)

    // Convert credential IDs if present
    if (options.allowCredentials) {
      options.allowCredentials = options.allowCredentials.map(cred => ({
        ...cred,
        id: base64urlDecode(cred.id)
      }))
    }

    // Call WebAuthn API
    const assertion = await navigator.credentials.get({
      publicKey: options
    })

    // At this point:
    // 1. Browser prompted user for biometric/PIN
    // 2. User provided Touch ID/Face ID
    // 3. Authenticator signed challenge with private key
    // 4. Signature returned (private key never left device)

    return assertion
  } catch (error) {
    console.error("Authentication failed:", error)
    throw error
  }
}
\`\`\`

## Step 3: Send Assertion to Server

\`\`\`javascript
// Convert assertion to JSON
const assertionJSON = {
  id: assertion.id,
  rawId: base64urlEncode(assertion.rawId),
  type: assertion.type,
  response: {
    clientDataJSON: base64urlEncode(assertion.response.clientDataJSON),
    authenticatorData: base64urlEncode(assertion.response.authenticatorData),
    signature: base64urlEncode(assertion.response.signature),
    userHandle: base64urlEncode(assertion.response.userHandle)  // User ID
  }
}

await fetch('/authenticate/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(assertionJSON)
})
\`\`\`

## Step 4: Verify Signature (Server-Side)

\`\`\`javascript
// Server-side verification
const { challenge } = sessionStore.get(sessionId)

// Decode response
const clientDataJSON = JSON.parse(
  base64urlDecode(assertionJSON.response.clientDataJSON).toString()
)
const authenticatorData = base64urlDecode(assertionJSON.response.authenticatorData)
const signature = base64urlDecode(assertionJSON.response.signature)

// 1. Verify challenge matches
if (clientDataJSON.challenge !== base64urlEncode(challenge)) {
  throw new Error("Challenge mismatch")
}

// 2. Verify origin
if (clientDataJSON.origin !== "https://example.com") {
  throw new Error("Origin mismatch")
}

// 3. Verify type
if (clientDataJSON.type !== "webauthn.get") {
  throw new Error("Invalid ceremony type")
}

// 4. Look up credential by ID
const credential = await db.credentials.findOne({
  credentialId: assertionJSON.rawId
})

if (!credential) {
  throw new Error("Credential not found")
}

// 5. Verify signature using stored public key
const clientDataHash = crypto.createHash('sha256')
  .update(Buffer.from(assertionJSON.response.clientDataJSON, 'base64url'))
  .digest()

const signedData = Buffer.concat([
  authenticatorData,
  clientDataHash
])

const isValid = crypto.verify(
  null,  // Use algorithm from key
  signedData,
  credential.publicKey,  // Stored during registration
  signature
)

if (!isValid) {
  throw new Error("Invalid signature")
}

// 6. Verify signature counter (prevent cloning)
const signCount = extractSignCount(authenticatorData)
if (signCount <= credential.signCount) {
  throw new Error("Authenticator may be cloned")
}

// Update sign count
await db.credentials.update(credential.id, { signCount })

// 7. Authentication successful
const user = await db.users.findById(credential.userId)
createSession(user)
\`\`\`

## Signature Counter

**Purpose:** Detect cloned authenticators

- Authenticator maintains a counter of signatures
- Counter increments with each authentication
- Server stores last known counter value
- If counter doesn't increase → authenticator may be cloned

**Security Note:** Some authenticators (like macOS Touch ID) don't implement signature counter (always 0). This is acceptable but provides less cloning protection.
          `
        },
        {
          type: "diagram",
          title: "FIDO2 Authentication Flow",
          content: `sequenceDiagram
    participant User
    participant Browser
    participant Authenticator as Authenticator (Touch ID)
    participant RP as Relying Party (Website)

    User->>Browser: Click "Sign in with passkey"
    Browser->>RP: Request authentication options
    RP->>RP: Generate challenge
    RP->>RP: Look up user's credentials
    RP->>Browser: Return challenge + allowed credentials
    Browser->>Authenticator: navigator.credentials.get()
    Authenticator->>User: Prompt for biometric/PIN
    User->>Authenticator: Provide fingerprint
    Authenticator->>Authenticator: Load private key
    Authenticator->>Authenticator: Sign challenge with private key
    Authenticator->>Browser: Return signature + authenticator data
    Browser->>RP: Send signature
    RP->>RP: Verify signature using stored public key
    RP->>RP: Create session
    RP->>Browser: Authentication success
    Browser->>User: Logged in!`,
          caption: "FIDO2 authentication ceremony showing challenge-response signature verification"
        },
        {
          type: "interactive",
          title: "🔬 Hands-On: Understanding WebAuthn Data Flow",
          content: `
**Exercise:** Given this WebAuthn registration response, identify the key components:

\`\`\`json
{
  "id": "AR52dGVzdC1jcmVkLWlk",
  "rawId": "AR52dGVzdC1jcmVkLWlk",
  "type": "public-key",
  "response": {
    "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiw...",
    "attestationObject": "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVi..."
  }
}
\`\`\`

**Questions:**

1. What does \`id\` represent?
2. Where is the public key located?
3. What information is in \`clientDataJSON\`?
4. Is the private key transmitted to the server?

<details>
<summary>View Answers</summary>

1. **Credential ID** - Unique identifier for this credential, used to look it up during authentication
2. **Inside attestationObject** - The public key is embedded in the authenticator data within the attestation object (COSE format)
3. **Challenge, origin, type** - Client data contains the challenge from server, the origin (domain), and ceremony type ("webauthn.create")
4. **NO** - The private key NEVER leaves the authenticator. Only the public key and signatures are transmitted.
</details>
          `
        }
      ],
      quiz: {
        id: "webauthn-api-quiz",
        title: "WebAuthn API Quiz",
        description: "Test your understanding of the Web Authentication API",
        passingScore: 70,
        questions: [
          {
            id: "webauthn-q1",
            question: "What is the purpose of the 'challenge' in WebAuthn?",
            options: [
              "To encrypt the user's password",
              "To prevent replay attacks by ensuring freshness",
              "To store the user's biometric data",
              "To identify the authenticator type"
            ],
            correctAnswer: 1,
            explanation: "The challenge is a cryptographically random value that prevents replay attacks. Each authentication/registration attempt must use a fresh challenge that's verified by the server."
          },
          {
            id: "webauthn-q2",
            question: "What does 'residentKey: required' enable?",
            options: [
              "Stronger encryption",
              "Faster authentication",
              "Username-less authentication (discoverable credentials/passkeys)",
              "Multi-device sync"
            ],
            correctAnswer: 2,
            explanation: "Resident keys (discoverable credentials) allow username-less authentication. The credential is stored on the authenticator along with user information, enabling true passwordless login without entering a username."
          },
          {
            id: "webauthn-q3",
            question: "What is checked during signature verification on the server?",
            options: [
              "Only the signature matches",
              "Signature, challenge, origin, and signature counter",
              "Only the origin matches",
              "Password hash matches"
            ],
            correctAnswer: 1,
            explanation: "Server verification includes: signature validity (using stored public key), challenge match, origin match (prevents phishing), type verification, and signature counter increment (prevents cloning)."
          }
        ]
      }
    },
    {
      id: "passkeys-implementation",
      slug: "passkeys-implementation",
      title: "Implementing Passkeys",
      description: "Learn how to implement passkeys for cross-device synced credentials using iCloud Keychain and Google Password Manager.",
      estimatedMinutes: 35,
      content: [
        {
          type: "text",
          title: "What Are Passkeys?",
          content: `
**Passkeys** are FIDO2 credentials that sync across a user's devices via encrypted cloud storage.

## Traditional FIDO2 vs. Passkeys

### Device-Bound Credentials (Traditional)

**Problem:**
- Credential tied to single device
- Lost device = lost credential
- Can't sign in on new device easily
- Requires registration on each device

**Example:**
- Register Touch ID on iPhone
- ❌ Can't use credential on iPad
- ❌ Can't use credential on Mac
- Need to register separately on each device

### Passkeys (Synced Credentials)

**Solution:**
- Credential syncs across user's devices
- End-to-end encrypted in cloud
- Device loss doesn't lock you out
- Use same passkey on iPhone, iPad, Mac

**Example:**
- Register Touch ID passkey on iPhone
- ✅ Automatically available on iPad (via iCloud)
- ✅ Automatically available on Mac (via iCloud)
- ✅ Can use on any trusted device

## Passkey Providers

### Apple Passkeys (iCloud Keychain)

**Ecosystem:**
- iPhone, iPad, Mac (Safari, Chrome, Edge)
- Requires iCloud Keychain enabled
- End-to-end encrypted with device passcode

**User Experience:**
1. User registers passkey on iPhone (Touch ID/Face ID)
2. Passkey syncs to iCloud Keychain (encrypted)
3. User logs in on iPad → Passkey available via Face ID
4. User logs in on Mac → Passkey available via Touch ID

### Google Password Manager

**Ecosystem:**
- Android devices + Chrome browser
- Syncs via Google account
- End-to-end encrypted

**User Experience:**
1. User registers passkey on Android phone (fingerprint)
2. Passkey syncs to Google Password Manager
3. User logs in on another Android device → Passkey available
4. User logs in on Chrome (desktop) → Passkey available via phone proximity

### Cross-Platform Authentication

**Scenario:** User with iPhone wants to sign in on Windows laptop

**Flow:**
1. User clicks "Sign in with passkey" on Windows Chrome
2. QR code displayed
3. User scans QR code with iPhone
4. iPhone prompts for Face ID
5. iPhone sends assertion to Windows via secure channel
6. User authenticated on Windows

This is called **hybrid authentication** (phone as roaming authenticator).

## Passkey Security Model

### Encryption

**Private Key Storage:**
- Encrypted with device's Secure Enclave / TPM
- Further encrypted for cloud sync
- Only decryptable on user's trusted devices

**Cloud Sync:**
- End-to-end encrypted before upload
- Cloud provider cannot decrypt keys
- Requires user's device passcode/biometric to decrypt

### Trust Model

**Apple iCloud Keychain:**
- Trusted devices managed via Apple ID
- New device requires approval from existing device
- Or verification via SMS/trusted phone number

**Google Password Manager:**
- Trusted devices via Google account
- Screen lock required to access passkeys
- Device encryption required

### Backup and Recovery

**If All Devices Lost:**

**Apple:**
- iCloud Keychain escrow (optional)
- Recovery key (user-generated)
- Account recovery (contact Apple Support)

**Google:**
- Google account recovery
- Trusted contacts
- Recovery phone number/email
          `
        },
        {
          type: "text",
          title: "Implementing Passkeys (Code)",
          content: `
To create passkeys instead of device-bound credentials, use these WebAuthn options:

## Registration for Passkeys

\`\`\`javascript
const registrationOptions = {
  challenge: randomChallenge,

  rp: { name: "Example Corp", id: "example.com" },

  user: {
    id: userIdBytes,
    name: "alice@example.com",
    displayName: "Alice Smith"
  },

  pubKeyCredParams: [
    { alg: -7, type: "public-key" },   // ES256
    { alg: -257, type: "public-key" }  // RS256
  ],

  authenticatorSelection: {
    // ⭐ KEY FOR PASSKEYS ⭐
    residentKey: "required",           // Create discoverable credential
    requireResidentKey: true,          // Legacy compatibility

    userVerification: "required",      // Require biometric/PIN

    authenticatorAttachment: "platform"  // Prefer built-in (optional)
  },

  timeout: 60000,

  attestation: "none"  // Privacy-friendly (don't request attestation)
}
\`\`\`

**Critical Settings:**
- \`residentKey: "required"\` → Creates passkey that syncs
- \`userVerification: "required"\` → Ensures biometric/PIN
- \`authenticatorAttachment: "platform"\` → Prefers Touch ID/Face ID (optional)

## Username-less Authentication

With passkeys, users don't need to enter a username:

\`\`\`javascript
// Authentication WITHOUT username
const authenticationOptions = {
  challenge: randomChallenge,
  rpId: "example.com",
  userVerification: "required",

  // ⭐ OMIT allowCredentials for username-less ⭐
  // This allows ANY passkey on the authenticator to be used
}

// Browser will show list of available passkeys
const assertion = await navigator.credentials.get({
  publicKey: authenticationOptions
})

// assertion.response.userHandle contains the user ID
// Use this to look up the user account
\`\`\`

**Flow:**
1. User clicks "Sign in with passkey" (no username entry)
2. Browser/OS shows list of available passkeys
3. User selects their account
4. User provides biometric (Face ID/Touch ID)
5. Assertion includes \`userHandle\` (user ID from registration)
6. Server looks up user by \`userHandle\`
7. Server verifies signature
8. User authenticated

## Conditional UI (Autofill)

**Best practice:** Let users select passkeys from autofill:

\`\`\`javascript
// Enable passkey autofill in username field
async function setupPasskeyAutofill() {
  // Check browser support
  if (!window.PublicKeyCredential ||
      !PublicKeyCredential.isConditionalMediationAvailable) {
    return  // Fallback to traditional login
  }

  const available = await PublicKeyCredential.isConditionalMediationAvailable()
  if (!available) {
    return
  }

  // Start conditional mediation (autofill)
  const authOptions = {
    challenge: await getChallenge(),
    rpId: "example.com",
    userVerification: "required"
    // No allowCredentials - show all available passkeys
  }

  try {
    const assertion = await navigator.credentials.get({
      publicKey: authOptions,
      mediation: "conditional"  // ⭐ ENABLE AUTOFILL ⭐
    })

    // User selected passkey from autofill
    await verifyAndLogin(assertion)

  } catch (error) {
    console.log("Passkey autofill aborted:", error)
    // User didn't select passkey, continue with traditional login
  }
}

// Call on page load
setupPasskeyAutofill()
\`\`\`

**HTML:**
\`\`\`html
<!-- Add autocomplete="webauthn" to enable passkey autofill -->
<input
  type="text"
  name="username"
  autocomplete="username webauthn"
  placeholder="Email or passkey"
/>
\`\`\`

**User Experience:**
1. User focuses username field
2. Autofill dropdown shows saved passkeys
3. User selects passkey
4. Biometric prompt appears
5. User authenticated (never typed anything!)

## Feature Detection

Always check browser support before using passkeys:

\`\`\`javascript
async function checkPasskeySupport() {
  // Check basic WebAuthn support
  if (!window.PublicKeyCredential) {
    return {
      supported: false,
      reason: "WebAuthn not supported"
    }
  }

  // Check platform authenticator (Touch ID, Face ID, Windows Hello)
  const platformSupported = await PublicKeyCredential
    .isUserVerifyingPlatformAuthenticatorAvailable()

  if (!platformSupported) {
    return {
      supported: false,
      reason: "No biometric authenticator available"
    }
  }

  // Check conditional mediation (autofill)
  let autofillSupported = false
  if (PublicKeyCredential.isConditionalMediationAvailable) {
    autofillSupported = await PublicKeyCredential
      .isConditionalMediationAvailable()
  }

  return {
    supported: true,
    platformAuthenticator: true,
    autofill: autofillSupported
  }
}

// Usage
const support = await checkPasskeySupport()
if (support.supported) {
  showPasskeyOption()  // Show "Sign in with passkey" button
  if (support.autofill) {
    setupPasskeyAutofill()  // Enable autofill
  }
} else {
  console.log("Passkeys not supported:", support.reason)
  // Show traditional login only
}
\`\`\`

## Multi-Credential Management

Users may have multiple passkeys (different accounts, different devices):

\`\`\`javascript
// List user's registered credentials
async function listUserCredentials(userId) {
  const credentials = await db.credentials.find({ userId })

  return credentials.map(cred => ({
    id: cred.credentialId,
    name: cred.deviceName || "Passkey",  // e.g., "iPhone 14 Pro"
    createdAt: cred.createdAt,
    lastUsed: cred.lastUsed,
    transports: cred.transports  // ["internal", "usb", "nfc", "ble"]
  }))
}

// Delete credential (user wants to remove device)
async function deleteCredential(credentialId, userId) {
  await db.credentials.delete({ credentialId, userId })
}

// Rename credential (better UX)
async function renameCredential(credentialId, userId, newName) {
  await db.credentials.update(
    { credentialId, userId },
    { deviceName: newName }
  )
}
\`\`\`

**UI Best Practices:**
- Show list of registered passkeys in account settings
- Allow users to rename (e.g., "Work iPhone", "Personal iPad")
- Show last used timestamp
- Allow deletion of lost/old devices
- Require re-authentication before deletion
          `
        },
        {
          type: "code",
          title: "Complete Passkey Implementation (Full Stack)",
          language: "javascript",
          content: `// ====== SERVER-SIDE (Node.js + Express) ======

const express = require('express')
const crypto = require('crypto')
const { Fido2Lib } = require('fido2-lib')

const app = express()
app.use(express.json())

// Initialize FIDO2 library
const fido2 = new Fido2Lib({
  timeout: 60000,
  rpId: "example.com",
  rpName: "Example Corp",
  challengeSize: 32,
  attestation: "none",
  cryptoParams: [-7, -257],  // ES256, RS256
  authenticatorAttachment: "platform",
  authenticatorRequireResidentKey: true,
  authenticatorUserVerification: "required"
})

// In-memory storage (use database in production)
const users = new Map()
const credentials = new Map()
const sessions = new Map()

// Registration: Begin
app.post('/passkey/register/begin', async (req, res) => {
  const { username, displayName } = req.body

  // Check if user exists
  let user = Array.from(users.values()).find(u => u.username === username)

  if (!user) {
    // Create new user
    user = {
      id: crypto.randomBytes(16),
      username,
      displayName,
      credentials: []
    }
    users.set(user.id.toString('base64url'), user)
  }

  // Generate registration options
  const registrationOptions = await fido2.attestationOptions()

  registrationOptions.user = {
    id: user.id,
    name: username,
    displayName: displayName
  }

  // Exclude existing credentials (prevent duplicate registration)
  registrationOptions.excludeCredentials = user.credentials.map(credId => ({
    type: "public-key",
    id: Buffer.from(credId, 'base64url')
  }))

  // Store challenge in session
  const sessionId = crypto.randomBytes(16).toString('hex')
  sessions.set(sessionId, {
    challenge: registrationOptions.challenge,
    userId: user.id.toString('base64url')
  })

  res.json({
    options: registrationOptions,
    sessionId
  })
})

// Registration: Complete
app.post('/passkey/register/complete', async (req, res) => {
  const { credential, sessionId } = req.body

  const session = sessions.get(sessionId)
  if (!session) {
    return res.status(400).json({ error: "Invalid session" })
  }

  try {
    // Verify attestation
    const attestationExpectations = {
      challenge: session.challenge,
      origin: "https://example.com",
      factor: "either"
    }

    const regResult = await fido2.attestationResult(
      credential,
      attestationExpectations
    )

    // Store credential
    const credentialId = Buffer.from(credential.rawId, 'base64url')
      .toString('base64url')

    credentials.set(credentialId, {
      userId: session.userId,
      publicKey: regResult.authnrData.get("credentialPublicKeyPem"),
      counter: regResult.authnrData.get("counter"),
      transports: credential.response.transports || [],
      createdAt: new Date(),
      lastUsed: new Date()
    })

    // Add to user's credential list
    const user = users.get(session.userId)
    user.credentials.push(credentialId)

    sessions.delete(sessionId)

    res.json({ success: true, userId: session.userId })

  } catch (error) {
    console.error("Registration failed:", error)
    res.status(400).json({ error: error.message })
  }
})

// Authentication: Begin
app.post('/passkey/authenticate/begin', async (req, res) => {
  // Username-less authentication
  const authenticationOptions = await fido2.assertionOptions()

  // Don't set allowCredentials - allow any passkey

  const sessionId = crypto.randomBytes(16).toString('hex')
  sessions.set(sessionId, {
    challenge: authenticationOptions.challenge
  })

  res.json({
    options: authenticationOptions,
    sessionId
  })
})

// Authentication: Complete
app.post('/passkey/authenticate/complete', async (req, res) => {
  const { assertion, sessionId } = req.body

  const session = sessions.get(sessionId)
  if (!session) {
    return res.status(400).json({ error: "Invalid session" })
  }

  try {
    const credentialId = Buffer.from(assertion.rawId, 'base64url')
      .toString('base64url')

    const credential = credentials.get(credentialId)
    if (!credential) {
      return res.status(400).json({ error: "Credential not found" })
    }

    // Verify assertion
    const assertionExpectations = {
      challenge: session.challenge,
      origin: "https://example.com",
      factor: "either",
      publicKey: credential.publicKey,
      prevCounter: credential.counter,
      userHandle: Buffer.from(credential.userId, 'base64url')
    }

    const authnResult = await fido2.assertionResult(
      assertion,
      assertionExpectations
    )

    // Update counter
    credential.counter = authnResult.authnrData.get("counter")
    credential.lastUsed = new Date()

    // Create session
    const user = users.get(credential.userId)
    const userSessionId = crypto.randomBytes(32).toString('hex')
    sessions.set(userSessionId, {
      userId: credential.userId,
      username: user.username
    })

    sessions.delete(sessionId)

    res.json({
      success: true,
      sessionToken: userSessionId,
      user: {
        username: user.username,
        displayName: user.displayName
      }
    })

  } catch (error) {
    console.error("Authentication failed:", error)
    res.status(400).json({ error: error.message })
  }
})

app.listen(3000, () => console.log("Server running on port 3000"))


// ====== CLIENT-SIDE (Browser JavaScript) ======

class PasskeyAuth {
  constructor(apiBase) {
    this.apiBase = apiBase
  }

  // Helper: Convert base64url to ArrayBuffer
  base64urlToBuffer(base64url) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  // Helper: Convert ArrayBuffer to base64url
  bufferToBase64url(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=/g, '')
  }

  // Register new passkey
  async register(username, displayName) {
    // Get registration options from server
    const beginResp = await fetch(\`\${this.apiBase}/passkey/register/begin\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, displayName })
    })

    const { options, sessionId } = await beginResp.json()

    // Convert challenge and user.id to ArrayBuffer
    options.challenge = this.base64urlToBuffer(options.challenge)
    options.user.id = this.base64urlToBuffer(options.user.id)

    if (options.excludeCredentials) {
      options.excludeCredentials = options.excludeCredentials.map(cred => ({
        ...cred,
        id: this.base64urlToBuffer(cred.id)
      }))
    }

    // Create credential
    const credential = await navigator.credentials.create({
      publicKey: options
    })

    // Convert to JSON
    const credentialJSON = {
      id: credential.id,
      rawId: this.bufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: this.bufferToBase64url(credential.response.clientDataJSON),
        attestationObject: this.bufferToBase64url(credential.response.attestationObject),
        transports: credential.response.getTransports()
      }
    }

    // Complete registration
    const completeResp = await fetch(\`\${this.apiBase}/passkey/register/complete\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialJSON, sessionId })
    })

    return completeResp.json()
  }

  // Authenticate with passkey
  async authenticate() {
    // Get authentication options
    const beginResp = await fetch(\`\${this.apiBase}/passkey/authenticate/begin\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    const { options, sessionId } = await beginResp.json()

    // Convert challenge
    options.challenge = this.base64urlToBuffer(options.challenge)

    // Get credential
    const assertion = await navigator.credentials.get({
      publicKey: options
    })

    // Convert to JSON
    const assertionJSON = {
      id: assertion.id,
      rawId: this.bufferToBase64url(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: this.bufferToBase64url(assertion.response.clientDataJSON),
        authenticatorData: this.bufferToBase64url(assertion.response.authenticatorData),
        signature: this.bufferToBase64url(assertion.response.signature),
        userHandle: this.bufferToBase64url(assertion.response.userHandle)
      }
    }

    // Complete authentication
    const completeResp = await fetch(\`\${this.apiBase}/passkey/authenticate/complete\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assertion: assertionJSON, sessionId })
    })

    return completeResp.json()
  }
}

// Usage
const passkeyAuth = new PasskeyAuth('https://example.com')

// Register
document.getElementById('registerBtn').addEventListener('click', async () => {
  try {
    const result = await passkeyAuth.register('alice@example.com', 'Alice Smith')
    console.log('Registration successful:', result)
  } catch (error) {
    console.error('Registration failed:', error)
  }
})

// Authenticate
document.getElementById('loginBtn').addEventListener('click', async () => {
  try {
    const result = await passkeyAuth.authenticate()
    console.log('Login successful:', result)
    localStorage.setItem('sessionToken', result.sessionToken)
  } catch (error) {
    console.error('Login failed:', error)
  }
})`,
          caption: "Complete full-stack passkey implementation with registration, authentication, and username-less login"
        },
        {
          type: "interactive",
          title: "🎯 Exercise: Passkey vs Device-Bound Credentials",
          content: `
**Scenario Analysis:** You're building authentication for a banking app.

**Requirements:**
- High security (phishing-resistant)
- Users have multiple devices (phone, tablet, laptop)
- Must work if user loses their phone
- Easy recovery

**Option A: Device-Bound FIDO2 Credentials**
\`\`\`javascript
authenticatorSelection: {
  residentKey: "discouraged",  // No sync
  userVerification: "required"
}
\`\`\`

**Option B: Passkeys (Synced)**
\`\`\`javascript
authenticatorSelection: {
  residentKey: "required",  // Sync via cloud
  userVerification: "required"
}
\`\`\`

**Questions:**

1. Which option is better for this scenario?
2. What happens if user loses phone with Option A?
3. What security considerations exist for Option B?
4. Can both options prevent phishing?

<details>
<summary>View Answers</summary>

1. **Option B (Passkeys)** is better - syncs across devices and provides backup
2. **Option A (Device-Bound)** - User loses access, must re-register or use recovery method. Poor UX.
3. **Option B Security** - Relies on cloud provider's encryption and device passcode security. Private keys still never leave Secure Enclave unencrypted.
4. **Both prevent phishing** - Origin-binding works for both device-bound and synced credentials

**Best Practice:** Use passkeys (Option B) with account recovery options (backup codes, trusted contacts) for banking apps.
</details>
          `
        }
      ],
      quiz: {
        id: "passkeys-quiz",
        title: "Passkeys Implementation Quiz",
        description: "Test your understanding of passkeys and synced credentials",
        passingScore: 70,
        questions: [
          {
            id: "passkeys-q1",
            question: "What is the key difference between traditional FIDO2 credentials and passkeys?",
            options: [
              "Passkeys are more secure",
              "Passkeys sync across user's devices via encrypted cloud",
              "Passkeys don't require biometrics",
              "Passkeys work without internet"
            ],
            correctAnswer: 1,
            explanation: "Passkeys are FIDO2 credentials that sync across a user's devices via encrypted cloud storage (iCloud Keychain, Google Password Manager), while traditional FIDO2 credentials are bound to a single device."
          },
          {
            id: "passkeys-q2",
            question: "What WebAuthn option enables passkey creation?",
            options: [
              "authenticatorAttachment: 'platform'",
              "residentKey: 'required'",
              "userVerification: 'required'",
              "attestation: 'direct'"
            ],
            correctAnswer: 1,
            explanation: "Setting residentKey: 'required' creates a discoverable credential (passkey) that can sync across devices and enable username-less authentication."
          },
          {
            id: "passkeys-q3",
            question: "What is conditional mediation in WebAuthn?",
            options: [
              "Requiring user to enter password",
              "Passkey autofill in username field",
              "Optional biometric verification",
              "Backup authentication method"
            ],
            correctAnswer: 1,
            explanation: "Conditional mediation (mediation: 'conditional') enables passkey autofill, allowing users to select their passkey directly from the username field's autofill dropdown for seamless authentication."
          }
        ]
      }
    }
  ]
}
