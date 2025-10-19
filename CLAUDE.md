# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OAuth Trainer is an educational web application designed to help users become subject matter experts in Identity and Access Management (IAM). The application covers authentication, authorization, OAuth 2.0, OpenID Connect (OIDC), SAML 2.0, FIDO2/WebAuthn, and emerging IAM trends.

### Core Educational Topics

The application provides comprehensive lessons followed by multiple-choice Q&A to certify users on:

- **Authentication vs Authorization**: Core identity concepts, Identity Providers (IdPs), Relying Parties (RPs), token types (Access, ID, Refresh), claims, scopes, and audiences
- **OAuth 2.0**: Delegated authorization flows (Authorization Code, Client Credentials, Device Code, PKCE), security considerations, token lifecycle management
- **OpenID Connect (OIDC)**: Authentication layer over OAuth, ID Tokens (JWT), UserInfo endpoint, federation, relationship to enterprise SSO
- **SAML 2.0**: XML-based federation, assertions, bindings, enterprise SSO, security challenges
- **FIDO2 & WebAuthn**: Passwordless authentication, passkeys, hardware-bound credentials, phishing resistance
- **Fine-Grained Authorization**: Google Zanzibar model, Relationship-based Access Control (ReBAC), comparisons to OPA and AuthZed/SpiceDB
- **Emerging Trends**: Decentralized Identity (DID), Verifiable Credentials, Continuous Access Evaluation (CAE), Zero Trust

### Reference Materials

The `reference-docs/` directory contains authoritative learning materials including RFC 6749 (OAuth 2.0 spec), OpenID Connect Handbook, Web Authentication API spec, and other professional guides. These should be consulted when creating course content alongside web searches.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server with Turbopack (opens on localhost:3000)
npm run build        # Build for production with Turbopack
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Check code with Biome (linting + formatting)
npm run format       # Auto-format code with Biome
```

## Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **React**: 19.1.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS 4 with PostCSS
- **Code Quality**: Biome 2.2.0 (replaces ESLint + Prettier)
- **Build Tool**: Turbopack (Next.js built-in)

## Code Architecture

### App Router Structure

This project uses Next.js App Router (`app/` directory):
- `app/layout.tsx`: Root layout with Geist fonts (sans + mono) and global styles
- `app/page.tsx`: Home page component
- `app/globals.css`: Global Tailwind styles

### Path Aliases

TypeScript paths configured with `@/*` mapping to project root:
```typescript
import Component from "@/app/components/Component"
```

### Biome Configuration

Biome handles both linting and formatting:
- Enforces recommended rules for Next.js and React
- 2-space indentation
- Organizes imports automatically
- Git integration enabled with `.gitignore` support
- Ignores `node_modules`, `.next`, `dist`, `build`

## Key Development Patterns

When building features for this IAM training application:

1. **Content Organization**: Structure lessons and Q&A around the core topics outlined above. Reference materials in `reference-docs/` should inform technical accuracy.

2. **Educational Flow**: Each topic should include comprehensive lessons followed by multiple-choice certification questions.

3. **Styling**: Uses Tailwind CSS with utility classes. Project includes Geist font family (sans and mono variants) configured in root layout.

4. **TypeScript**: Strict mode enabled. Use proper typing for components, props, and data structures.

5. **Build System**: Turbopack is enabled for both dev and build commands. Builds are fast and optimized.
