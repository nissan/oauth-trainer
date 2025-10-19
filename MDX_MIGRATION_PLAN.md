# MDX Migration Plan

## Overview
Migrate OAuth Trainer from hardcoded TypeScript lesson data to MDX (Markdown + JSX) file-based content system for easier course authoring and maintenance.

## Current State
- Lessons stored in `data/modules.ts` as TypeScript objects
- Content defined using `LessonContent` type with structured data
- Requires TypeScript knowledge to add/edit content
- All content lives in code, making contributions difficult

## Target State
- Each lesson is an MDX file in a clear folder structure
- Course authors write Markdown with optional React components
- File system organization mirrors course hierarchy
- Non-technical authors can contribute content
- Git-friendly text files for easy review and version control

## Proposed Folder Structure

```
content/
├── modules/
│   ├── 01-auth-fundamentals/
│   │   ├── module.json              # Module metadata
│   │   ├── lessons/
│   │   │   ├── 01-auth-vs-authz.mdx
│   │   │   ├── 02-identity-providers.mdx
│   │   │   ├── 03-token-types.mdx
│   │   │   └── ...
│   │   └── quiz.json                 # Quiz questions
│   ├── 02-oauth-basics/
│   │   ├── module.json
│   │   ├── lessons/
│   │   │   ├── 01-what-is-oauth.mdx
│   │   │   ├── 02-authorization-flows.mdx
│   │   │   └── ...
│   │   └── quiz.json
│   ├── 03-oauth-flows/
│   ├── 04-openid-connect/
│   ├── 05-saml/
│   ├── 06-fido2-webauthn/
│   ├── 07-authorization-models/
│   ├── 08-modern-iam/
│   ├── 09-applied-applications/
│   └── 10-enterprise-patterns/
```

## Module Metadata (module.json)

```json
{
  "id": "auth-fundamentals",
  "slug": "auth-fundamentals",
  "order": 1,
  "title": "Authentication Fundamentals",
  "description": "Master the core concepts of authentication and authorization",
  "difficulty": "beginner",
  "estimatedHours": 3,
  "badge": {
    "name": "Authentication Master",
    "icon": "🎓",
    "description": "Completed Authentication Fundamentals"
  },
  "learningObjectives": [
    "Distinguish between authentication and authorization",
    "Understand Identity Providers and Relying Parties",
    "Learn about different token types and their purposes"
  ],
  "prerequisiteModules": []
}
```

## Lesson MDX Format

```mdx
---
title: "Authentication vs Authorization"
description: "Learn the fundamental difference between authentication and authorization"
slug: "auth-vs-authz"
duration: 15
order: 1
keyTakeaways:
  - "Authentication verifies who you are (identity)"
  - "Authorization determines what you can access (permissions)"
  - "Both work together to secure applications"
  - "Modern apps use tokens to represent authenticated identity"
prerequisites: []
---

# Authentication vs Authorization

These two concepts are fundamental to security but are often confused...

## What is Authentication?

Authentication is the process of **verifying identity**. When you log in to a website with your username and password, you're authenticating yourself.

<Callout type="info">
Think of authentication like showing your ID at airport security - you're proving who you are.
</Callout>

## What is Authorization?

Authorization is the process of **granting access** to specific resources based on identity.

<ComparisonTable>
  <Row
    concept="Authentication"
    question="Who are you?"
    example="Login with username/password"
  />
  <Row
    concept="Authorization"
    question="What can you do?"
    example="Access admin dashboard"
  />
</ComparisonTable>

## Real-World Example

<CodeBlock language="javascript" title="Express.js Authentication & Authorization">
{`// Authentication: Verify identity
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body.username, req.body.password);
  if (user) {
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Authorization: Check permissions
app.get('/admin', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({ message: 'Welcome to admin panel' });
});`}
</CodeBlock>

## Common Authentication Methods

1. **Password-based**: Traditional username + password
2. **Multi-factor (MFA)**: Password + OTP or biometric
3. **Passwordless**: Magic links, WebAuthn/FIDO2
4. **Federated**: Sign in with Google, GitHub, etc.
```

## Quiz Format (quiz.json)

```json
{
  "passingScore": 80,
  "questions": [
    {
      "id": "q1",
      "question": "What is the primary purpose of authentication?",
      "options": [
        "To verify a user's identity",
        "To grant access to resources",
        "To encrypt user data",
        "To store user passwords"
      ],
      "correctAnswer": 0,
      "explanation": "Authentication verifies who you are, proving your identity to the system."
    }
  ]
}
```

## Custom MDX Components

Create reusable components for course content:

- `<Callout type="info|warning|success|danger">` - Highlighted boxes
- `<CodeBlock language="..." title="...">` - Syntax-highlighted code
- `<ComparisonTable>` - Side-by-side comparisons
- `<FlowDiagram>` - OAuth flow visualizations
- `<SecurityWarning>` - Important security notes
- `<InteractiveDemo>` - Hands-on examples
- `<ExternalLink>` - Links to external resources
- `<Quiz>` - Inline quiz questions

## Implementation Steps

### Phase 1: Setup (Pre-migration)
- [ ] **CRITICAL**: Complete Playwright test suite for current implementation
- [ ] Establish test baseline to ensure no regressions
- [ ] Install MDX dependencies (`@next/mdx`, `remark-gfm`, `rehype-*`)
- [ ] Configure Next.js for MDX support
- [ ] Create custom MDX components library

### Phase 2: File System Utilities
- [ ] Build `lib/mdx.ts` - utilities to read/parse MDX files
- [ ] Create `lib/content.ts` - file system content loader
- [ ] Implement frontmatter parser with TypeScript types
- [ ] Build module/lesson metadata aggregator
- [ ] Add caching layer for production builds

### Phase 3: Route Updates
- [ ] Update `app/learn/[moduleSlug]/page.tsx` to load from MDX
- [ ] Update `app/learn/[moduleSlug]/[lessonSlug]/page.tsx` for MDX rendering
- [ ] Maintain backward compatibility during migration
- [ ] Add error handling for missing files

### Phase 4: Content Migration
- [ ] Create `content/modules/` directory structure
- [ ] Migrate Module 01 (Auth Fundamentals) as proof of concept
- [ ] Test navigation, progress tracking, and rendering
- [ ] Document migration process for remaining modules
- [ ] Migrate remaining modules incrementally

### Phase 5: Testing & Validation
- [ ] Run full Playwright test suite
- [ ] Verify all tests pass (compare to baseline)
- [ ] Test hot-reload in development
- [ ] Verify production build works correctly
- [ ] Test progress tracking with MDX content

### Phase 6: Cleanup
- [ ] Remove old `data/modules.ts` after full migration
- [ ] Update documentation for content authors
- [ ] Create contribution guide for new lessons
- [ ] Archive old content structure

## Benefits

### For Course Authors
- Write in familiar Markdown syntax
- No TypeScript knowledge required
- Use custom components for rich content
- Easy to preview changes locally
- Standard text editor workflow

### For Developers
- Content separate from code
- Type-safe frontmatter validation
- Hot reload during development
- Standard Next.js MDX patterns
- Easy to extend with new components

### For Maintenance
- Git-friendly text files
- Clear folder hierarchy
- Easy to review content PRs
- Version control for content
- Modular, composable structure

## Technical Dependencies

```json
{
  "@next/mdx": "^15.x",
  "@mdx-js/loader": "^3.x",
  "@mdx-js/react": "^3.x",
  "remark-gfm": "^4.x",
  "remark-frontmatter": "^5.x",
  "rehype-highlight": "^7.x",
  "rehype-slug": "^6.x",
  "rehype-autolink-headings": "^7.x",
  "gray-matter": "^4.x"
}
```

## Rollback Plan

If issues arise during migration:
1. Keep `data/modules.ts` until full migration complete
2. Feature flag to switch between MDX and hardcoded content
3. Git revert available at any phase
4. Playwright tests catch regressions immediately

## Success Criteria

- [ ] All Playwright tests pass (match baseline)
- [ ] All 10 modules migrated to MDX
- [ ] Content authors can add lessons without code changes
- [ ] Dev server hot-reloads MDX changes
- [ ] Production build succeeds
- [ ] No regression in progress tracking
- [ ] Documentation updated

## Timeline Estimate

- Phase 1 (Setup): 1-2 hours
- Phase 2 (Utilities): 2-3 hours
- Phase 3 (Routes): 2-3 hours
- Phase 4 (Migration): 4-6 hours (depends on content volume)
- Phase 5 (Testing): 1-2 hours
- Phase 6 (Cleanup): 1 hour

**Total**: ~11-17 hours for complete migration

## Notes

- Start with one module to validate approach
- Keep backward compatibility during migration
- Document any MDX component patterns
- Consider adding MDX linting for consistency
