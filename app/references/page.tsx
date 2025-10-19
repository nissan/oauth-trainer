import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">🔐</div>
            <span className="text-lg font-bold">ReddiTech's Curious Auth Builder</span>
          </Link>
          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <Link href="/learn">
              <Button variant="outline">Learning Hub</Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline">My Progress</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">References & Attributions</h1>
          <p className="text-lg text-muted-foreground">
            This course was built using authoritative sources and industry best practices
          </p>
        </div>

        {/* Development Credits */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Course Development</CardTitle>
            <CardDescription>Built with Claude Code by Anthropic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 font-semibold">Course Design & Content</div>
              <p className="text-sm text-muted-foreground">
                ReddiTech's Curious Auth Builder Training Course was designed and
                developed with assistance from Claude Code, Anthropic's AI-powered coding
                assistant.
              </p>
            </div>
            <div>
              <div className="mb-2 font-semibold">Technology Stack</div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Next.js 15.5.6 with App Router</li>
                <li>• React 19.1.0</li>
                <li>• TypeScript (Strict Mode)</li>
                <li>• Tailwind CSS 4 with PostCSS</li>
                <li>• Shadcn/ui Components</li>
                <li>• Biome 2.2.0 for Code Quality</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Primary Reference Materials */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Primary Reference Materials</h2>
          <p className="mb-6 text-muted-foreground">
            Course content was developed using the following authoritative sources located
            in the <code className="rounded bg-muted px-1.5 py-0.5">reference-docs/</code>{" "}
            directory:
          </p>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  RFC 6749: The OAuth 2.0 Authorization Framework
                </CardTitle>
                <CardDescription>IETF Standards Document</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm">
                  The official OAuth 2.0 specification defining the authorization
                  framework, flows, and security considerations.
                </p>
                <a
                  href="https://datatracker.ietf.org/doc/html/rfc6749"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Official RFC →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  OAuth 2.0 and OpenID Connect: The Professional Guide
                </CardTitle>
                <CardDescription>Comprehensive Industry Guide (PDF)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Professional resource covering OAuth 2.0 and OpenID Connect
                  implementation, security best practices, and real-world scenarios.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  The OpenID Connect Handbook v1.1
                </CardTitle>
                <CardDescription>OpenID Foundation Resource (PDF)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Official handbook covering OpenID Connect protocol, ID Tokens,
                  authentication flows, and enterprise SSO implementations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Web Authentication: An API for Accessing Public Key Credentials - Level
                  2
                </CardTitle>
                <CardDescription>W3C Specification (PDF)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm">
                  W3C specification for the Web Authentication API (WebAuthn), enabling
                  passwordless authentication with FIDO2.
                </p>
                <a
                  href="https://www.w3.org/TR/webauthn-2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View W3C Specification →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NIST Special Publication 5068</CardTitle>
                <CardDescription>
                  National Institute of Standards and Technology (PDF)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  NIST guidelines on digital identity and authentication assurance levels,
                  informing security best practices in the course.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Applied Applications Module References */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Applied Applications Case Study References
          </h2>
          <p className="mb-6 text-muted-foreground">
            Module 09 content was developed through comprehensive research of the following
            platforms and their official documentation:
          </p>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supabase Auth Documentation</CardTitle>
                <CardDescription>Open-Source Authentication Platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm">
                  Official Supabase documentation covering email/password authentication,
                  passwordless (magic links, OTP), OAuth providers, Web3 wallet
                  authentication (EIP-4361), and Row Level Security.
                </p>
                <div className="space-y-1">
                  <a
                    href="https://supabase.com/docs/guides/auth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Authentication Overview →
                  </a>
                  <a
                    href="https://supabase.com/docs/guides/auth/auth-web3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Web3 Sign-Ins (EIP-4361) →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privy Documentation</CardTitle>
                <CardDescription>
                  Embedded Wallets & Progressive Web3 Onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm">
                  Official Privy documentation covering embedded wallets with MPC (Multi-Party
                  Computation), Trusted Execution Environments (TEEs), progressive
                  onboarding, multi-chain support, gasless transactions, and SOC 2
                  compliance.
                </p>
                <a
                  href="https://docs.privy.io/welcome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Privy Documentation →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">LazorKit Documentation</CardTitle>
                <CardDescription>
                  Solana Passkeys with WebAuthn & Smart Wallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm">
                  Official LazorKit documentation covering WebAuthn passkey authentication
                  on Solana, secp256r1 (P-256) curve signatures, SIMD 75 on-chain
                  verification, hardware-backed security (Secure Enclave), smart wallet
                  policies, and session keys.
                </p>
                <a
                  href="https://docs.lazorkit.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View LazorKit Documentation →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EIP-4361: Sign-In with Ethereum</CardTitle>
                <CardDescription>Ethereum Improvement Proposal</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm">
                  Official specification for off-chain authentication using Ethereum
                  accounts, enabling secure wallet-based authentication without gas fees.
                </p>
                <a
                  href="https://eips.ethereum.org/EIPS/eip-4361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View EIP-4361 Specification →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Solana SIMD 75</CardTitle>
                <CardDescription>
                  Solana Improvement Document - secp256r1 Verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Solana proposal adding secp256r1 (P-256) signature verification as a
                  precompiled instruction, enabling on-chain verification of WebAuthn
                  passkey signatures for hardware-backed authentication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Additional Resources</h2>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Web Research & Verification</CardTitle>
              <CardDescription>Industry Best Practices</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Course content was supplemented with web research to verify factual
                accuracy and incorporate current industry best practices from:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• OAuth Working Group documentation</li>
                <li>• OpenID Foundation specifications</li>
                <li>• W3C Web Authentication standards</li>
                <li>• FIDO Alliance resources</li>
                <li>• Google Cloud Identity Platform documentation</li>
                <li>• Microsoft Azure Active Directory (Entra ID) guides</li>
                <li>• Auth0 and Okta developer documentation</li>
                <li>• Supabase official documentation and guides</li>
                <li>• Privy developer resources and integration guides</li>
                <li>• LazorKit SDK documentation and examples</li>
                <li>• Web3Auth documentation and comparisons</li>
                <li>• Ethereum Improvement Proposals (EIPs)</li>
                <li>• Solana Improvement Documents (SIMDs)</li>
                <li>• Security research papers on IAM vulnerabilities</li>
                <li>• MPC and TEE security architecture papers</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Content Accuracy Statement */}
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle>Content Accuracy & Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              All technical content in this course has been cross-referenced against
              official specifications (RFCs, W3C standards) and verified through multiple
              authoritative sources. The course prioritizes factual accuracy and adherence
              to industry standards while providing practical, real-world context.
            </p>
          </CardContent>
        </Card>

        {/* License & Usage */}
        <div className="mt-8 rounded-md border border-border/50 bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Educational Use</h3>
          <p className="text-sm text-muted-foreground">
            This course is designed for educational purposes to help developers and
            security professionals master Identity and Access Management concepts.
            Reference materials are cited in accordance with fair use principles for
            educational content.
          </p>
        </div>
      </main>
    </div>
  )
}
