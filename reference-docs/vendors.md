# 🧩 Identity & Auth Vendors — Products, Standards & Ory Open Source Ecosystem (2025)

> Legend: **OIDC** = OpenID Connect · **OAuth2** · **SAML** · **SCIM** · **WebAuthn/FIDO2** = passkeys/security keys

---

## A) Full-stack IDaaS (Customer & Workforce IAM)

| Vendor | Product(s) | Primary Use | Standards | Notable take / variations |
|---|---|---|---|---|
| **Okta** (includes Auth0) | **Customer Identity Cloud (Auth0)**, **Workforce Identity Cloud** | CIAM & workforce SSO/MFA | **OIDC, OAuth2, SAML**, WebAuthn/FIDO2 | Positions OAuth/OIDC as core patterns; extensive flow docs and dev tooling. Auth0 ↔ Okta SAML/RelayState interop notes. |
| **Microsoft** | **Entra ID** (formerly Azure AD), **Entra External ID** | Workforce/CIAM | **OIDC, OAuth2, SAML**, WebAuthn/FIDO2 **passkeys** | First-party passkeys via Entra + Microsoft Authenticator; clear matrices of passkey compatibility; External ID supports OAuth2/OIDC/SAML. |
| **Google Cloud** | **Identity Platform** (managed CIAM), **Cloud Identity**, **Firebase Authentication** | CIAM | **OIDC/OAuth2**, **SAML** | Identity Platform has first-class OIDC and SAML guides; frequently updated docs. |
| **AWS** | **Amazon Cognito**, **IAM Identity Center** | CIAM; workforce SSO | **OIDC/OAuth2**, **SAML**, WebAuthn **passkeys** | Cognito supports OIDC IdPs with some constraints (e.g., client auth method); passwordless (OTP & WebAuthn passkeys) with MFA caveats. |
| **Ping Identity** | **PingOne**, **PingFederate**, **DaVinci** | Enterprise SSO/MFA/CIAM | **OIDC/OAuth2**, **SAML**, WebAuthn/FIDO2 | FIDO2 server certified; PingOne acts as OP for OIDC apps; deep enterprise federation story. |
| **ForgeRock** | **ForgeRock Identity Cloud / AM / IDM / DS** | Enterprise IAM platform | **OIDC/OAuth2**, **SAML**, SCIM | Cloud and on-prem; SAML IdP/SP guides; examples emphasize audience-restricted tokens. |
| **Keycloak** | **Keycloak** | Self-hosted IdP | **OIDC/OAuth2**, **SAML** | Fully compliant OIDC provider; popular for self-hosted SSO. |
| **Cisco/Duo** | **Duo** (MFA/SSO) | MFA + WebAuthn | WebAuthn/FIDO2, SAML, OIDC | Explicit FIDO2 security key guidance; U2F-only keys not supported in Duo’s current flows. |

---

## B) Dev-first CIAM (Passwordless, SDK-heavy)

| Vendor | Product(s) | Primary Use | Standards | Notable take / variations |
|---|---|---|---|---|
| **Clerk** | **Clerk** | B2B/B2C auth components | **OIDC/OAuth2**, **SAML** | Can act as an **OIDC OP** for SSO; active investment in enterprise SSO; some community notes on OIDC compliance maturity. |
| **Stytch** | **Stytch B2B & Consumer** | Passwordless + OAuth | **OIDC/OAuth2**; WebAuthn **passkeys** | Extensive passkey & OAuth SDKs; dev-first API references. |
| **Descope** | **Descope** | No/low-code flows | **OIDC/OAuth2**, **SAML**, WebAuthn **passkeys** | Turn-key passkey flows; interop guides with Auth0; client SDK examples. |
| **FusionAuth** | **FusionAuth** | Self-host/managed CIAM | **OIDC/OAuth2**, **SAML**, WebAuthn **passkeys** | Straightforward OIDC/SAML and passkeys docs; “works with any OAuth/OIDC library” stance. |
| **Frontegg** | **Frontegg** | B2B SSO + user mgmt | **OIDC/OAuth2**, **SAML**, SCIM | Ready-made SSO (OIDC/SAML) + SCIM/Directory Sync patterns; strong B2B focus. |
| **WorkOS** | **WorkOS SSO, Directory Sync (SCIM)** | Enterprise-ready features for apps | **SAML/OIDC**, **SCIM** | Abstracts SCIM and directory sync; dev guides for SCIM & provisioning. |

---

## C) Open-source / Self-host IdP stacks

| Vendor | Product(s) | Primary Use | Standards | Notable take / variations |
|---|---|---|---|---|
| **Ory** | **Kratos**, **Hydra**, **Keto**, **Oathkeeper**, **Polis**, **MockSAML**, **saml20** | Modular IAM: identity, OAuth/OIDC, ReBAC authz, edge proxy, SAML bridge | **OIDC/OAuth2**, **SAML**, **ReBAC**, WebAuthn | Open-source, cloud-native, modular stack; Kratos = identity, Hydra = OAuth2 provider, Keto = authorization, Oathkeeper = gateway, Polis = SAML bridge. |
| **Ory Kratos** | Identity / User Management / Auth | Headless identity & user management engine. Supports password, social login, passkeys (WebAuthn), MFA, recovery. | OIDC/OAuth2, WebAuthn/FIDO2 | Equivalent to an IdP or authentication backend: competitor to Auth0/Okta’s user store. |
| **Ory Hydra** | OAuth2 / OIDC Provider | Fully-featured OAuth2 & OpenID Connect provider, OpenID Certified, token issuance. | OAuth2, OIDC | Acts as the authorization / token management layer in the stack. |
| **Ory Keto** | Authorization / Permissions (ReBAC / Fine-Grained AuthZ) | Relationship-based access control (Zanzibar-style). | ReBAC, Zanzibar model | Matches what AuthZ systems like SpiceDB/AuthZed do. |
| **Ory Oathkeeper** | Access Proxy / Zero Trust | Identity & Access Proxy that authenticates, authorizes, and modifies HTTP(s) requests. | OIDC/OAuth2, JWT validation | Enforces policy at the edge. |
| **Ory Polis** | SSO / Federation Bridge | Bridges SAML and OIDC to OAuth flows; supports SCIM provisioning. | SAML, OIDC, SCIM | Helps integrate legacy SAML systems into OIDC/OAuth-centric architectures. |
| **Ory MockSAML** | Protocol Utility / Emulator | A lightweight mock SAML 2.0 Identity Provider (for testing). | SAML | Useful for testing SAML-based flows. |
| **Ory saml20** | Protocol Library | A SAML 2.0 parser (TypeScript). | SAML | Low-level building block for SAML message handling. |
| **Ory Keto + Zanzibar Analogs** | Authorization System | Zanzibar-inspired ReBAC authorization DB. | ReBAC | Similar to Google Zanzibar, AuthZed, SpiceDB. |
| **Ory Oathkeeper + Zero Trust Gateways** | Policy Enforcement | Request-level identity & access enforcement at HTTP edge. | OIDC/OAuth2 | Comparable to API gateway authentication filters. |
| **Keycloak** | **Keycloak** | Full IdP | **OIDC/OAuth2**, **SAML** | Established open-source IdP; large community. |
| **Ory / Oso / etc** |  |  |  |  |

---

## D) Fine-grained Authorization (ReBAC, policy engines)

> These complement IdPs — they don’t issue ID/Access tokens, but decide **“can X do Y on Z?”**

| Vendor | Product(s) | Model | Standards / Tech | Notable take |
|---|---|---|---|---|
| **AuthZed** | **SpiceDB (open source)** + AuthZed Cloud | **ReBAC (Zanzibar-style)** | Tuple store, schema, consistency tokens | Zanzibar-inspired FGA DB for permissions at scale. |
| **Aserto** | **Topaz** (open source) + cloud | **ReBAC + OPA** | Zanzibar-like directory + **OPA** policies | Blends OPA with ReBAC; positions “best of both worlds.” |
| **Permit.io** | **Permit Cloud + PDP/OPAL** | RBAC/ABAC/ReBAC | Works with OPA/OpenFGA/Cedar; CLI & Terraform | End-to-end authorization, no-code editor + policy-as-code. |
| **Oso** | **Oso (lib) + Oso Cloud** | RBAC/ABAC + rules | **Polar** policy language | App-embedded authorization with declarative rules. |
| **Cerbos** | **Cerbos PDP** | ABAC w/ YAML policies | gRPC/HTTP PDP | “Policy-as-config,” GitOps-friendly ABAC. |
| **OPA / Styra** | **Open Policy Agent**, **Styra DAS** | General policy engine | Rego; Envoy/K8s integrations | Broad policy engine used for AuthZ, K8s, gateways, etc. |

---

## E) Quick comparisons by **standard**

| Standard | Strong exemplars |
|---|---|
| **OIDC/OAuth2** | Okta/Auth0, Microsoft Entra ID, Google Identity Platform, AWS Cognito, PingOne, ForgeRock, Keycloak, Ory Hydra, ZITADEL, WSO2, Curity, FusionAuth, Frontegg, Clerk, Stytch, Descope. |
| **SAML 2.0** | Microsoft Entra, Google Identity Platform, Ping, ForgeRock, Curity, WSO2, ZITADEL, FusionAuth, Frontegg, Ory Polis. |
| **SCIM / Directory Sync** | WorkOS, Curity, Ory Polis. |
| **WebAuthn / FIDO2 / Passkeys** | Microsoft Entra (Authenticator and security keys), PingOne (FIDO2 server), AWS Cognito (passkeys), Duo (FIDO2 keys), FusionAuth, Stytch, Descope, Ory Kratos. |

---

## F) “What’s their philosophy on the standards?”

- **Okta/Auth0** – “standards-first” developer experience; deep OIDC/OAuth2 content and SAML bridges; pragmatic on legacy SAML while nudging to OIDC.  
- **Microsoft Entra** – Broad protocol support across workforce & external/CIAM; strong **passkeys** stance and detailed compatibility matrices.  
- **Google Identity Platform** – CIAM building blocks; fresh docs showing **OIDC and SAML** integrations.  
- **AWS Cognito** – Practical OIDC & passkeys with guardrails (e.g., certain client auth methods); passwordless guidance with MFA caveats.  
- **Ping/ForgeRock** – Deep enterprise federation; Ping with certified FIDO2 server; ForgeRock with comprehensive SAML/OAuth examples.  
- **Keycloak** – Fully compliant OIDC provider + SAML; community-driven and widely self-hosted.  
- **Clerk/Stytch/Descope/FusionAuth/Frontegg** – Dev-centric SDKs, passwordless & enterprise SSO; SCIM/Directory Sync via Frontegg/WorkOS; Clerk rapidly evolving OIDC/SAML support.  
- **Ory (Kratos/Hydra/Keto/Oathkeeper)** – Modular, open-source, standards-driven; Kratos for identity, Hydra for OIDC/OAuth, Keto for Zanzibar-style authorization, Oathkeeper for Zero Trust proxy, Polis for SAML/SCIM bridging.  
- **Ory vs Commercial Vendors** – Open-source alternative stack with full IAM coverage: identity (Kratos), auth (Hydra), policy (Keto), edge enforcement (Oathkeeper).  
- **AuthZed/Aserto/Permit/Oso/Cerbos/OPA** – Treat authorization as its own tier; many embrace **Zanzibar-style ReBAC** or **policy-as-code** (Rego, Polar, YAML) to decouple permissions from IdP.

---

## G) Picking the right tool (quick guidance)

| Goal | Recommended Vendors |
|---|---|
| **Pure CIAM, fast time-to-market** | Okta/Auth0, Google Identity Platform, AWS Cognito, PingOne, FusionAuth |
| **Developer-led passwordless UX** | Stytch, Descope, FusionAuth, Microsoft Entra passkeys |
| **B2B SSO + SCIM (enterprise features for your SaaS)** | Frontegg, WorkOS |
| **Self-host IdP or “own the stack”** | Keycloak, Ory (Kratos/Hydra/Keto/Oathkeeper/Polis), ZITADEL, WSO2, Curity |
| **Fine-grained authorization (beyond roles)** | AuthZed/SpiceDB, Ory Keto, Aserto, Permit.io, Oso, Cerbos, OPA |

---

## H) Notes & Caveats Worth Knowing

- **Cognito OIDC:** Requires specific client auth methods (`client_secret_post`) which may differ from some IdPs’ defaults.  
- **Cognito passwordless:** WebAuthn passkeys available, but MFA requirements affect eligibility; read caveats.  
- **Clerk:** Rapidly adding enterprise SSO features (OIDC/SAML). Test flows for edge-case OIDC compliance.  
- **Duo:** Ensure keys are **FIDO2** (U2F-only insufficient for some prompts).  
- **ReBAC vs OPA:** If you need Google-Drive-style sharing graphs, start with **SpiceDB/Keto/Topaz/OpenFGA**; if you need attribute-rich policies across infra, **OPA** is ideal—many platforms blend both.

---

## I) Observations & Strengths of the Ory Stack

1. **Modularity & Composability**  
   You don’t buy a monolith — you pick the pieces:  
   - **Kratos** for identity flows  
   - **Hydra** for token issuance / OIDC provider  
   - **Keto** for permissions  
   - **Oathkeeper** for enforcement at the edge  
   - **Polis** for SAML bridging  

2. **Open Standards Focus**  
   Hydra is **OpenID Certified**, showing strong OIDC/OAuth2 compliance.

3. **Zanzibar-style Authorization**  
   Keto is explicitly described as supporting the **Zanzibar** model.

4. **Bridging Legacy / Federation Paths**  
   Polis connects SAML systems to modern OIDC/OAuth2 infrastructure.

5. **Edge Enforcement / Proxy**  
   Oathkeeper enforces authentication/authorization decisions at the HTTP layer—ideal for microservice or Zero Trust environments.

---

### ✅ Summary

- Ory provides the **most modular open-source IAM stack** available today, covering Authentication, Authorization, Federation, and Enforcement.  
- It can replace or augment commercial IdPs like Okta or Auth0, while providing **self-hosted control and extensibility**.  
- For fine-grained authorization and Zero Trust setups, **Ory Keto** and **Oathkeeper** integrate natively, following Zanzibar-inspired principles.

---
