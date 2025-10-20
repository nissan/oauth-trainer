import { Suspense } from "react";

interface MDXContentProps {
  moduleSlug: string;
  lessonSlug: string;
}

// Mapping of module and lesson slugs to MDX imports
// This is required because Turbopack needs static import paths
async function getMDXComponent(moduleSlug: string, lessonSlug: string) {
  // Module 00: Executive Overview
  if (moduleSlug === "00-executive-overview") {
    if (lessonSlug === "01-identity-landscape") {
      const { default: Component } = await import(
        "@/content/modules/00-executive-overview/lessons/01-identity-landscape.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-authentication-authorization-summary") {
      const { default: Component } = await import(
        "@/content/modules/00-executive-overview/lessons/02-authentication-authorization-summary.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-enterprise-passwordless-summary") {
      const { default: Component } = await import(
        "@/content/modules/00-executive-overview/lessons/03-enterprise-passwordless-summary.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-authorization-zero-trust-summary") {
      const { default: Component } = await import(
        "@/content/modules/00-executive-overview/lessons/04-authorization-zero-trust-summary.mdx"
      );
      return Component;
    }
    if (lessonSlug === "05-decentralized-identity-summary") {
      const { default: Component } = await import(
        "@/content/modules/00-executive-overview/lessons/05-decentralized-identity-summary.mdx"
      );
      return Component;
    }
  }

  // Module 02: OAuth 2.0
  if (moduleSlug === "02-oauth2") {
    if (lessonSlug === "01-oauth-roles") {
      const { default: Component } = await import(
        "@/content/modules/02-oauth2/lessons/01-oauth-roles.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-authorization-code-flow") {
      const { default: Component } = await import(
        "@/content/modules/02-oauth2/lessons/02-authorization-code-flow.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-client-credentials") {
      const { default: Component } = await import(
        "@/content/modules/02-oauth2/lessons/03-client-credentials.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-device-code-flow") {
      const { default: Component } = await import(
        "@/content/modules/02-oauth2/lessons/04-device-code-flow.mdx"
      );
      return Component;
    }
    if (lessonSlug === "05-token-lifecycle") {
      const { default: Component } = await import(
        "@/content/modules/02-oauth2/lessons/05-token-lifecycle.mdx"
      );
      return Component;
    }
    if (lessonSlug === "06-oauth-security") {
      const { default: Component } = await import(
        "@/content/modules/02-oauth2/lessons/06-oauth-security.mdx"
      );
      return Component;
    }
  }

  // Module 03: OpenID Connect (OIDC)
  if (moduleSlug === "03-oidc") {
    if (lessonSlug === "01-oidc-fundamentals") {
      const { default: Component } = await import(
        "@/content/modules/03-oidc/lessons/01-oidc-fundamentals.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-id-tokens-jwt") {
      const { default: Component } = await import(
        "@/content/modules/03-oidc/lessons/02-id-tokens-jwt.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-userinfo-endpoint") {
      const { default: Component } = await import(
        "@/content/modules/03-oidc/lessons/03-userinfo-endpoint.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-oidc-flows") {
      const { default: Component } = await import(
        "@/content/modules/03-oidc/lessons/04-oidc-flows.mdx"
      );
      return Component;
    }
    if (lessonSlug === "05-discovery-dynamic-config") {
      const { default: Component } = await import(
        "@/content/modules/03-oidc/lessons/05-discovery-dynamic-config.mdx"
      );
      return Component;
    }
    if (lessonSlug === "06-oidc-session-management") {
      const { default: Component } = await import(
        "@/content/modules/03-oidc/lessons/06-oidc-session-management.mdx"
      );
      return Component;
    }
  }

  // Module 04: SAML 2.0
  if (moduleSlug === "04-saml") {
    if (lessonSlug === "01-saml-fundamentals") {
      const { default: Component } = await import(
        "@/content/modules/04-saml/lessons/01-saml-fundamentals.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-saml-assertions") {
      const { default: Component } = await import(
        "@/content/modules/04-saml/lessons/02-saml-assertions.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-saml-bindings-profiles") {
      const { default: Component } = await import(
        "@/content/modules/04-saml/lessons/03-saml-bindings-profiles.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-saml-vs-oidc") {
      const { default: Component } = await import(
        "@/content/modules/04-saml/lessons/04-saml-vs-oidc.mdx"
      );
      return Component;
    }
    if (lessonSlug === "05-saml-security-best-practices") {
      const { default: Component } = await import(
        "@/content/modules/04-saml/lessons/05-saml-security-best-practices.mdx"
      );
      return Component;
    }
  }

  // Module 05: FIDO2 & WebAuthn
  if (moduleSlug === "05-fido2") {
    if (lessonSlug === "01-fido2-fundamentals") {
      const { default: Component } = await import(
        "@/content/modules/05-fido2/lessons/01-fido2-fundamentals.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-webauthn-api") {
      const { default: Component } = await import(
        "@/content/modules/05-fido2/lessons/02-webauthn-api.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-passkeys-implementation") {
      const { default: Component } = await import(
        "@/content/modules/05-fido2/lessons/03-passkeys-implementation.mdx"
      );
      return Component;
    }
  }

  // Module 06: Zanzibar & Fine-Grained Authorization
  if (moduleSlug === "06-zanzibar") {
    if (lessonSlug === "01-authorization-fundamentals") {
      const { default: Component } = await import(
        "@/content/modules/06-zanzibar/lessons/01-authorization-fundamentals.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-google-zanzibar") {
      const { default: Component } = await import(
        "@/content/modules/06-zanzibar/lessons/02-google-zanzibar.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-implementing-zanzibar") {
      const { default: Component } = await import(
        "@/content/modules/06-zanzibar/lessons/03-implementing-zanzibar.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-authorization-systems-comparison") {
      const { default: Component } = await import(
        "@/content/modules/06-zanzibar/lessons/04-authorization-systems-comparison.mdx"
      );
      return Component;
    }
  }

  // Module 01: Auth Fundamentals
  if (moduleSlug === "01-auth-fundamentals") {
    if (lessonSlug === "01-auth-vs-authz") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/01-auth-vs-authz.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-idps-and-rps") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/02-idps-and-rps.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-token-types") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/03-token-types.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-claims-scopes-audience") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/04-claims-scopes-audience.mdx"
      );
      return Component;
    }
    if (lessonSlug === "05-iam-evolution") {
      const { default: Component } = await import(
        "@/content/modules/01-auth-fundamentals/lessons/05-iam-evolution.mdx"
      );
      return Component;
    }
  }

  // Module 10: Applied Case Study
  if (moduleSlug === "10-applied-case-study") {
    if (lessonSlug === "01-executive-analysis") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/01-executive-analysis.mdx"
      );
      return Component;
    }
    if (lessonSlug === "02-command-control-platform") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/02-command-control-platform.mdx"
      );
      return Component;
    }
    if (lessonSlug === "03-cloud-telemetry-ai") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/03-cloud-telemetry-ai.mdx"
      );
      return Component;
    }
    if (lessonSlug === "04-field-units-offline") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/04-field-units-offline.mdx"
      );
      return Component;
    }
    if (lessonSlug === "05-api-analytics-portal") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/05-api-analytics-portal.mdx"
      );
      return Component;
    }
    if (lessonSlug === "06-partner-federation") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/06-partner-federation.mdx"
      );
      return Component;
    }
    if (lessonSlug === "07-future-architecture") {
      const { default: Component } = await import(
        "@/content/modules/10-applied-case-study/lessons/07-future-architecture.mdx"
      );
      return Component;
    }
  }

  // Return null if no matching MDX file found
  return null;
}

export async function MDXContent({ moduleSlug, lessonSlug }: MDXContentProps) {
  try {
    const Component = await getMDXComponent(moduleSlug, lessonSlug);

    if (!Component) {
      return (
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            MDX content not yet migrated for this lesson. Showing legacy content.
          </p>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className="animate-pulse rounded-md bg-muted p-8">
            <div className="h-4 w-3/4 rounded bg-muted-foreground/20"></div>
          </div>
        }
      >
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <Component />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading MDX content:", error);
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load lesson content. Please try again later.
        </p>
      </div>
    );
  }
}
