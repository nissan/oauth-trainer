# Module Migration Plan: TypeScript → MDX

This document outlines the plan to migrate all remaining modules (00, 02-09) from TypeScript to MDX format.

## Migration Status

### ✅ Completed (2/11 modules)
- **Module 01**: Auth Fundamentals (5 lessons)
- **Module 10**: Applied Case Study (7 lessons, password-protected)

### 🚧 Pending Migration (9/11 modules)
- **Module 00**: Executive Overview
- **Module 02**: OAuth 2.0
- **Module 03**: OpenID Connect (OIDC)
- **Module 04**: SAML 2.0
- **Module 05**: FIDO2 & WebAuthn
- **Module 06**: Zanzibar & Fine-Grained Authorization
- **Module 07**: Emerging Trends
- **Module 08**: SSI & Decentralized Identity
- **Module 09**: Applied Applications

## Benefits of MDX Migration

1. **Richer Content**: Support for interactive React components within lessons
2. **Better Maintainability**: Markdown-first approach with component embedding
3. **Type Safety**: Frontmatter validation with TypeScript
4. **Consistency**: Unified content structure across all modules
5. **Extensibility**: Easy to add new interactive features (e.g., CaseStudyResponse)

## Migration Workflow (Per Module)

### Phase 1: Setup
1. Create module directory: `content/modules/XX-module-slug/`
2. Create `module.json` with metadata
3. Create `quiz.json` with quiz questions
4. Create `lessons/` subdirectory

### Phase 2: Content Migration
For each lesson:
1. Create `XX-lesson-slug.mdx` file
2. Add frontmatter (title, description, slug, duration, order, keyTakeaways)
3. Convert TypeScript content to MDX markdown
4. Add interactive components if needed
5. Test MDX rendering

### Phase 3: Integration
1. Add lesson imports to `app/learn/[moduleSlug]/[lessonSlug]/mdx-content.tsx`
2. Verify lesson navigation works
3. Test quiz functionality
4. Update progress tracking

### Phase 4: Validation
1. Build test (`pnpm build`)
2. Visual verification in dev mode
3. Test user flow end-to-end
4. Update module card to remove "Coming Soon" badge

## Detailed Migration Plan by Module

### Priority 1: Foundation Modules (Weeks 1-2)

#### Module 00: Executive Overview
- **Lessons**: 3
- **Complexity**: Low (intro content)
- **Estimated Time**: 2 hours
- **Special Notes**: Entry point for executives, keep simple and visual

#### Module 02: OAuth 2.0
- **Lessons**: 8
- **Complexity**: High (core protocol)
- **Estimated Time**: 6 hours
- **Special Notes**: Many code examples, consider interactive flow diagrams

### Priority 2: Enterprise Standards (Weeks 3-4)

#### Module 03: OpenID Connect (OIDC)
- **Lessons**: 6
- **Complexity**: High (builds on OAuth)
- **Estimated Time**: 5 hours
- **Special Notes**: JWT visualization components could be valuable

#### Module 04: SAML 2.0
- **Lessons**: 5
- **Complexity**: Medium (XML-heavy)
- **Estimated Time**: 4 hours
- **Special Notes**: XML code blocks need proper escaping

### Priority 3: Modern Auth (Weeks 5-6)

#### Module 05: FIDO2 & WebAuthn
- **Lessons**: 6
- **Complexity**: High (cryptographic concepts)
- **Estimated Time**: 5 hours
- **Special Notes**: Consider interactive WebAuthn demo component

#### Module 06: Zanzibar & Fine-Grained Authorization
- **Lessons**: 7
- **Complexity**: Very High (advanced concepts)
- **Estimated Time**: 6 hours
- **Special Notes**: Relationship graphs, permission modeling visualizations

### Priority 4: Emerging Tech (Weeks 7-8)

#### Module 07: Emerging Trends
- **Lessons**: 5
- **Complexity**: Medium (survey of trends)
- **Estimated Time**: 4 hours
- **Special Notes**: Keep content fresh, update regularly

#### Module 08: SSI & Decentralized Identity
- **Lessons**: 6
- **Complexity**: High (blockchain, DIDs, VCs)
- **Estimated Time**: 5 hours
- **Special Notes**: DID/VC visualization components

#### Module 09: Applied Applications
- **Lessons**: 5
- **Complexity**: Medium (practical implementation)
- **Estimated Time**: 4 hours
- **Special Notes**: Code-heavy, real-world scenarios

## Migration Template

### module.json Structure
```json
{
  "id": "XX-module-slug",
  "slug": "XX-module-slug",
  "order": XX,
  "title": "Module Title",
  "description": "Module description",
  "difficulty": "beginner|intermediate|expert",
  "estimatedHours": X,
  "badge": {
    "name": "Badge Name",
    "icon": "🎯",
    "description": "Badge description"
  },
  "learningObjectives": [
    "Objective 1",
    "Objective 2"
  ],
  "prerequisiteModules": ["01-auth-fundamentals"]
}
```

### Lesson MDX Frontmatter
```yaml
---
title: "Lesson Title"
description: "Lesson description"
slug: "XX-lesson-slug"
duration: 15
order: 1
keyTakeaways:
  - "Key takeaway 1"
  - "Key takeaway 2"
prerequisites:
  - "previous-lesson-slug"
---
```

### quiz.json Structure
```json
{
  "passingScore": 80,
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Explanation of correct answer"
    }
  ]
}
```

## MDX Gotchas & Best Practices

### Escaping in Template Literals
When using JSX components with template literal props (e.g., `<CaseStudyResponse sampleResponse={`...`}>`):

1. **Curly Braces**: Escape as `{"{"}` and `{"}"}`
2. **Triple Backticks**: Escape as `\`\`\``
3. **Code Blocks**: Use escaped backticks for code fences

### Example
```mdx
<CaseStudyResponse
  sampleResponse={`
1. **JSON Example**:
   \`\`\`json
   {"{"}
     "key": "value"
   {"}"}
   \`\`\`

2. **Code Block**:
   \`\`\`javascript
   function example() {"{"}
     return true;
   {"}"}
   \`\`\`
  `}
/>
```

## Testing Checklist

For each migrated module:

- [ ] Build succeeds (`pnpm build`)
- [ ] All lessons render without MDX errors
- [ ] Code blocks display correctly
- [ ] Interactive components work
- [ ] Quiz loads and submits correctly
- [ ] Progress tracking saves
- [ ] Navigation between lessons works
- [ ] Module completion triggers badge

## Automation Opportunities

1. **Content Extraction Script**: Parse TypeScript module files and extract to MDX
2. **Frontmatter Generator**: Auto-generate frontmatter from TypeScript metadata
3. **Quiz Converter**: Convert TypeScript quiz arrays to JSON format
4. **Import Generator**: Auto-generate mdx-content.tsx import statements

## Timeline

- **Week 1-2**: Modules 00, 02 (Foundation)
- **Week 3-4**: Modules 03, 04 (Enterprise)
- **Week 5-6**: Modules 05, 06 (Modern Auth)
- **Week 7-8**: Modules 07, 08, 09 (Emerging)
- **Week 9**: Testing, polish, final deployment

**Total Estimated Time**: 9 weeks (41 hours of migration work)

## Next Steps

1. Start with Module 00 (Executive Overview) - lowest complexity
2. Set up module directory structure
3. Migrate first lesson as proof-of-concept
4. Create reusable components for common patterns
5. Document any new patterns discovered
6. Iterate through remaining modules

## Success Metrics

- ✅ All 11 modules migrated to MDX
- ✅ Build succeeds without errors
- ✅ All quizzes functional
- ✅ No "Coming Soon" badges remaining
- ✅ User progress preserved during migration
- ✅ Mobile-responsive on all lessons
- ✅ Accessibility maintained (WCAG 2.1 AA)
