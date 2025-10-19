/**
 * Module 6: Fine-Grained Authorization (Zanzibar)
 *
 * This module covers modern authorization patterns including Google Zanzibar,
 * Relationship-based Access Control (ReBAC), and implementing scalable permission systems.
 */

import type { Module } from "@/types"

export const zanzibarModule: Module = {
  id: "zanzibar",
  slug: "zanzibar",
  title: "Fine-Grained Authorization",
  description: "Master modern authorization with Google Zanzibar, Amazon Cedar, OpenFGA, and scalable permission systems for complex access control.",
  icon: "🔐",
  difficulty: "advanced",
  estimatedHours: 4,
  prerequisiteModules: ["auth-fundamentals"],
  learningObjectives: [
    "Understand fine-grained authorization and its importance",
    "Learn Google Zanzibar architecture and concepts",
    "Master Relationship-based Access Control (ReBAC)",
    "Implement authorization using Zanzibar-inspired systems (OpenFGA, SpiceDB, Ory Keto)",
    "Compare ReBAC with RBAC, ABAC, and ACLs",
    "Build scalable permission checks at Google scale",
    "Master Amazon Cedar policy-driven authorization",
    "Choose the right authorization system for your use case"
  ],
  badge: {
    id: "authorization-expert",
    name: "Authorization Expert",
    description: "Mastered fine-grained authorization with Zanzibar and ReBAC",
    icon: "🔐"
  },
  lessons: [
    {
      id: "authorization-fundamentals",
      slug: "authorization-fundamentals",
      title: "Authorization Fundamentals",
      description: "Understanding authorization models, from simple ACLs to complex fine-grained systems.",
      duration: 30,
      content: [
        {
          type: "text",
          title: "What is Authorization?",
          content: `
**Authorization** determines what an authenticated user is allowed to do.

## Authentication vs. Authorization

| Aspect | Authentication | Authorization |
|--------|----------------|---------------|
| **Question** | Who are you? | What can you do? |
| **Purpose** | Verify identity | Control access |
| **When** | Login | Every action |
| **Output** | User identity | Permissions/decisions |
| **Example** | Password, passkey, SAML | Read file, delete document |

**Example Flow:**
1. **Authentication**: User logs in with email + password → "You are alice@example.com"
2. **Authorization**: Alice tries to delete document → Check: "Can alice@example.com delete doc123?" → Allowed/Denied

## Why Authorization is Hard

### Simple App (Small Scale)

**Scenario:** Blog with 100 users

\`\`\`
if (user.id === post.authorId) {
  allowDelete()  // Author can delete their own posts
}
\`\`\`

✅ Works fine for simple cases

### Complex App (Large Scale)

**Scenario:** Google Docs with billions of users

**Requirements:**
- ✅ Owner can edit document
- ✅ Users can be granted edit/view permissions
- ✅ Users can share with groups (e.g., "Engineering Team")
- ✅ Groups can contain other groups (nested)
- ✅ Folders inherit permissions to child documents
- ✅ Permissions can be time-limited
- ✅ Check must complete in <10ms for billions of documents

❌ Simple \`if\` statements don't scale!

### The Challenge

**Volume:**
- Billions of users
- Trillions of resources (documents, folders, files)
- Quadrillions of permission checks per day

**Complexity:**
- Nested groups (group contains group contains user)
- Inherited permissions (folder → subfolder → document)
- Multiple permission types (owner, editor, viewer)
- Shared with "anyone with link"
- Organization-level policies

**Performance:**
- Must answer "Can user X access resource Y?" in milliseconds
- Global consistency across data centers
- Real-time permission changes
          `
        },
        {
          type: "text",
          title: "Authorization Models",
          content: `
## 1. Access Control Lists (ACLs)

**Concept:** Each resource has a list of who can access it

**Example:**
\`\`\`json
{
  "document": "doc123",
  "acl": [
    { "user": "alice@example.com", "permission": "owner" },
    { "user": "bob@example.com", "permission": "editor" },
    { "user": "charlie@example.com", "permission": "viewer" }
  ]
}
\`\`\`

**Pros:**
- ✅ Simple to understand
- ✅ Easy to implement for small systems
- ✅ Direct permission assignment

**Cons:**
- ❌ Doesn't scale (each resource stores full list)
- ❌ No group support
- ❌ Hard to audit ("What can Alice access?")
- ❌ Difficult to manage at scale

**Use Case:** Small apps with few users/resources

## 2. Role-Based Access Control (RBAC)

**Concept:** Users are assigned roles, roles have permissions

**Example:**
\`\`\`
User → Role → Permissions

alice@example.com → "Admin" → [create, read, update, delete]
bob@example.com → "Editor" → [read, update]
charlie@example.com → "Viewer" → [read]
\`\`\`

**Authorization Check:**
\`\`\`javascript
function canDelete(user, resource) {
  const userRoles = getRoles(user)  // ["Admin"]
  const requiredRoles = ["Admin", "Owner"]
  return userRoles.some(role => requiredRoles.includes(role))
}
\`\`\`

**Pros:**
- ✅ Scales better than ACLs
- ✅ Easy to understand (roles match job functions)
- ✅ Centralized permission management
- ✅ Works well for enterprise applications

**Cons:**
- ❌ Coarse-grained (all Admins have same permissions)
- ❌ No resource-specific permissions
- ❌ Role explosion (need "Document123Editor" for specific access)
- ❌ Can't express relationships ("Alice is Bob's manager")

**Use Case:** Enterprise apps with clear role hierarchy (HR systems, admin panels)

## 3. Attribute-Based Access Control (ABAC)

**Concept:** Access decisions based on attributes of user, resource, and environment

**Example:**
\`\`\`javascript
function canAccess(user, resource, environment) {
  return (
    user.department === resource.owner.department &&  // Same department
    user.clearanceLevel >= resource.classification &&  // Sufficient clearance
    environment.time >= "09:00" &&                     // Business hours
    environment.time <= "17:00" &&
    environment.location === "office"                  // On-site only
  )
}
\`\`\`

**Policy Example (XACML-style):**
\`\`\`xml
<Rule>
  <Condition>
    <Match>
      <AttributeValue>Engineering</AttributeValue>
      <UserAttribute>department</UserAttribute>
    </Match>
    <Match>
      <UserAttribute>clearanceLevel</UserAttribute>
      <GreaterThanOrEqual/>
      <ResourceAttribute>classification</ResourceAttribute>
    </Match>
  </Condition>
  <Effect>Permit</Effect>
</Rule>
\`\`\`

**Pros:**
- ✅ Very flexible
- ✅ Fine-grained control
- ✅ Context-aware (time, location)
- ✅ Good for compliance (government, healthcare)

**Cons:**
- ❌ Complex to implement
- ❌ Hard to debug ("Why was I denied?")
- ❌ Performance overhead (evaluate complex policies)
- ❌ Difficult to audit

**Use Case:** Government systems, healthcare (HIPAA), classified data

## 4. Relationship-Based Access Control (ReBAC)

**Concept:** Access decisions based on relationships between entities

**Example:**
\`\`\`
alice is owner of doc123
bob is member of Engineering
Engineering is viewer of doc123

Can bob view doc123?
→ Yes (bob → member → Engineering → viewer → doc123)
\`\`\`

**Graph Representation:**
\`\`\`
alice --owner--> doc123
bob --member--> Engineering
Engineering --viewer--> doc123

Query: Can bob view doc123?
Answer: Traverse graph to find path from bob to doc123 with view permission
\`\`\`

**Pros:**
- ✅ Extremely flexible
- ✅ Handles complex relationships (groups, nested groups, inheritance)
- ✅ Scales to billions of entities (Google-proven)
- ✅ Natural for social graphs (Facebook, Google)
- ✅ Easy to reason about

**Cons:**
- ❌ More complex to implement than RBAC
- ❌ Requires specialized infrastructure (graph database or Zanzibar-like system)

**Use Case:** Google Docs, GitHub (organizations/teams), Facebook (friends/groups)

## Comparison Table

| Feature | ACL | RBAC | ABAC | ReBAC (Zanzibar) |
|---------|-----|------|------|------------------|
| **Complexity** | Low | Medium | High | Medium-High |
| **Scalability** | Poor | Good | Medium | Excellent |
| **Flexibility** | Low | Medium | Very High | Very High |
| **Performance** | Fast | Fast | Slow | Very Fast |
| **Groups** | No | Yes | Yes | Yes (nested) |
| **Inheritance** | No | Limited | Yes | Yes |
| **Context-Aware** | No | No | Yes | Limited |
| **Audit ("What can user X access?")** | Hard | Easy | Hard | Medium |
| **Best For** | Small apps | Enterprise apps | Compliance-heavy | Large-scale SaaS |

## Which Model to Use?

**Use ACLs when:**
- Small application (<1000 users, <10,000 resources)
- Simple permission model (owner + viewers)
- No groups needed

**Use RBAC when:**
- Enterprise application
- Clear organizational roles (Admin, Manager, Employee)
- Permissions tied to job functions
- Medium scale (thousands of users)

**Use ABAC when:**
- Government, healthcare, finance
- Complex compliance requirements
- Context matters (time, location, classification)
- Willing to invest in policy management

**Use ReBAC (Zanzibar) when:**
- Large-scale SaaS (millions of users)
- Complex sharing (Google Docs, Dropbox, GitHub)
- Nested groups and inheritance
- Need Google-level scalability
- Resources have relationships (folders contain documents)
          `
        },
        {
          type: "diagram",
          title: "Authorization Models Comparison",
          content: `graph TD
    A[Authorization Need] --> B{Scale?}
    B -->|Small <1K users| C[Use ACLs]
    B -->|Medium <100K users| D{Organizational Roles?}
    B -->|Large >1M users| E[Use ReBAC/Zanzibar]

    D -->|Yes - clear hierarchy| F[Use RBAC]
    D -->|No - complex policies| G{Compliance Heavy?}

    G -->|Yes| H[Use ABAC]
    G -->|No - relationships matter| E

    C --> I[Simple permission lists]
    F --> J[User → Role → Permissions]
    H --> K[Policy engine with attributes]
    E --> L[Relationship graph with tuples]

    I --> M[Fast, limited features]
    J --> N[Scalable, enterprise-friendly]
    K --> O[Flexible, complex setup]
    L --> P[Google-scale, highly flexible]`,
          caption: "Decision tree for selecting the right authorization model based on scale and requirements"
        },
        {
          type: "interactive",
          title: "🎯 Exercise: Identify the Right Model",
          content: `
For each scenario, identify the best authorization model:

**Scenario 1:** A todo list app with 500 users. Each user can only access their own todos. No sharing.
- A) ACL
- B) RBAC
- C) ABAC
- D) ReBAC

**Scenario 2:** An enterprise HR system with 10,000 employees. Permissions tied to job roles: HR Admin, Manager, Employee. Managers can see their direct reports' data.
- A) ACL
- B) RBAC
- C) ABAC
- D) ReBAC

**Scenario 3:** A healthcare records system. Access requires: correct department, sufficient clearance level, on-site location, business hours, and patient consent.
- A) ACL
- B) RBAC
- C) ABAC
- D) ReBAC

**Scenario 4:** A Google Docs alternative with millions of users. Documents can be shared with individuals, groups, or "anyone with link". Folders inherit permissions. Groups can contain other groups.
- A) ACL
- B) RBAC
- C) ABAC
- D) ReBAC

<details>
<summary>View Answers</summary>

1. **A - ACL** - Simple app, no sharing, small scale. ACLs are perfect.
2. **B - RBAC** - Enterprise with clear roles. RBAC handles role hierarchy well.
3. **C - ABAC** - Complex compliance requirements with multiple contextual attributes. ABAC is designed for this.
4. **D - ReBAC (Zanzibar)** - Large-scale with complex sharing, nested groups, and inheritance. Zanzibar is built for this exact use case.
</details>
          `
        }
      ],
      quiz: {
        id: "authz-fundamentals-quiz",
        title: "Authorization Fundamentals Quiz",
        description: "Test your knowledge of authorization models and concepts",
        passingScore: 70,
        questions: [
          {
            id: "authz-q1",
            question: "What is the main difference between authentication and authorization?",
            options: [
              "Authentication is for APIs, authorization is for web apps",
              "Authentication verifies identity, authorization controls access",
              "Authentication is faster than authorization",
              "They are the same thing"
            ],
            correctAnswer: 1,
            explanation: "Authentication answers 'Who are you?' by verifying identity, while authorization answers 'What can you do?' by controlling access to resources."
          },
          {
            id: "authz-q2",
            question: "What is the main limitation of simple ACLs?",
            options: [
              "Too secure",
              "Don't support groups and don't scale well",
              "Too complex to implement",
              "Require expensive hardware"
            ],
            correctAnswer: 1,
            explanation: "ACLs don't scale well because each resource stores a full list of permitted users, and they typically don't support groups or inheritance, making them unsuitable for large systems."
          },
          {
            id: "authz-q3",
            question: "Which authorization model is best for a large-scale SaaS app like Google Docs?",
            options: [
              "ACL (Access Control Lists)",
              "RBAC (Role-Based Access Control)",
              "ABAC (Attribute-Based Access Control)",
              "ReBAC (Relationship-Based Access Control / Zanzibar)"
            ],
            correctAnswer: 3,
            explanation: "ReBAC (Zanzibar) is designed for large-scale SaaS applications with complex sharing, nested groups, and permission inheritance. Google uses it for Docs, Drive, Calendar, and more."
          }
        ]
      }
    },
    {
      id: "google-zanzibar",
      slug: "google-zanzibar",
      title: "Google Zanzibar Architecture",
      description: "Deep dive into Google's Zanzibar authorization system and how it powers billions of permission checks.",
      duration: 40,
      content: [
        {
          type: "text",
          title: "What is Google Zanzibar?",
          content: `
**Zanzibar** is Google's global authorization system that handles permission checks for:

- **Google Drive** (file sharing)
- **Google Docs** (collaborative editing)
- **Google Calendar** (event sharing)
- **Google Cloud** (resource permissions)
- **YouTube** (video access)
- **Google Photos** (album sharing)

## Scale

**Zanzibar handles:**
- **Trillions** of access control lists
- **Millions** of authorization requests per second
- **<10 millisecond** latency (95th percentile)
- **Global consistency** across all data centers

**Published:** Google published the Zanzibar paper in 2019 (USENIX ATC '19)

## Core Concepts

### 1. Relationship Tuples

**Format:** \`<object>#<relation>@<subject>\`

**Examples:**
\`\`\`
doc:roadmap#owner@alice
doc:roadmap#viewer@bob
doc:roadmap#viewer@group:engineering#member
folder:2023#parent@doc:roadmap
group:engineering#member@charlie
\`\`\`

**Breaking Down a Tuple:**

\`\`\`
doc:roadmap#viewer@group:engineering#member
│          │      │                   │
│          │      │                   └─ subject type (member of group)
│          │      └─ subject (the group)
│          └─ relation (permission type)
└─ object (the resource)
\`\`\`

### 2. Namespace Configuration

**Namespaces** define object types and their relationships:

\`\`\`yaml
# Document namespace
name: "document"
relations:
  - name: "owner"
    # Owners are directly assigned users
    userset_rewrite:
      union:
        - this: {}

  - name: "editor"
    # Editors are owners OR directly assigned
    userset_rewrite:
      union:
        - this: {}
        - computed_userset:
            relation: "owner"

  - name: "viewer"
    # Viewers are editors OR directly assigned OR parent folder viewers
    userset_rewrite:
      union:
        - this: {}
        - computed_userset:
            relation: "editor"
        - tuple_to_userset:
            tupleset:
              relation: "parent"
            computed_userset:
              object: "$TUPLE_USERSET_OBJECT"
              relation: "viewer"
\`\`\`

### 3. Check API

**Question:** "Can user X perform action Y on resource Z?"

\`\`\`
Check(
  object: "doc:roadmap",
  relation: "viewer",
  subject: "charlie"
)

→ Returns: true/false
\`\`\`

**Zanzibar's Answer:**
1. Look up tuples for \`doc:roadmap#viewer\`
2. Check if \`charlie\` is directly a viewer
3. Check if \`charlie\` is in any group that's a viewer
4. Check if parent folder grants viewer permission
5. Return \`true\` if any path succeeds

### 4. Expand API

**Question:** "Who has access to resource Z with relation Y?"

\`\`\`
Expand(
  object: "doc:roadmap",
  relation: "viewer"
)

→ Returns: Tree of all users/groups with access
\`\`\`

**Example Output:**
\`\`\`json
{
  "tree": {
    "union": {
      "nodes": [
        { "leaf": { "users": ["alice", "bob"] } },
        {
          "computed": {
            "object": "group:engineering",
            "relation": "member"
          }
        },
        {
          "tuple_to_userset": {
            "tupleset": "doc:roadmap#parent",
            "computed": {
              "object": "folder:2023",
              "relation": "viewer"
            }
          }
        }
      ]
    }
  }
}
\`\`\`

### 5. Zookie (Consistency Token)

**Problem:** User shares document, immediately checks if friend can access → might see stale data

**Solution:** **Zookie** is a consistency token

\`\`\`
1. Write: Share doc with Bob → Returns zookie "abc123"
2. Check: Can Bob view doc? (with zookie "abc123")
   → Zanzibar waits until this replica has processed write
   → Returns true (guaranteed fresh)
\`\`\`

**Zookie ensures:**
- Read-after-write consistency
- No stale permission checks
- User sees immediate effect of permission changes
          `
        },
        {
          type: "text",
          title: "Zanzibar Architecture",
          content: `
## System Components

### 1. ACL Storage

**Purpose:** Store relationship tuples

**Technology:**
- Spanner (Google's globally-distributed database)
- Provides external consistency
- Replicates across data centers

**Schema:**
\`\`\`sql
CREATE TABLE Tuples (
  object_namespace STRING,
  object_id STRING,
  relation STRING,
  subject_namespace STRING,
  subject_id STRING,
  subject_relation STRING,
  created_at TIMESTAMP,
  -- Zookie for consistency
  commit_timestamp TIMESTAMP
)
\`\`\`

**Example Rows:**
| object_namespace | object_id | relation | subject_namespace | subject_id | subject_relation |
|------------------|-----------|----------|-------------------|------------|------------------|
| document | roadmap | viewer | user | alice | |
| document | roadmap | viewer | group | engineering | member |
| folder | 2023 | parent | document | roadmap | |

### 2. Leopard Indexing System

**Problem:** "What can Alice access?" is slow (scan all tuples)

**Solution:** Leopard creates reverse index

**Forward Index (ACL):**
\`\`\`
doc:roadmap → [alice, bob, group:engineering]
\`\`\`

**Reverse Index (Leopard):**
\`\`\`
alice → [doc:roadmap, doc:budget, folder:2023]
\`\`\`

**Enables Fast Queries:**
- List all documents Alice can access
- Revoke Alice's access from all documents
- Audit: What does Alice have access to?

### 3. Zanzibar Servers

**Stateless servers** that:
- Receive Check/Expand requests
- Query ACL storage
- Evaluate namespace configurations
- Return authorization decisions

**Caching:**
- Negative results cached (user doesn't have access)
- Positive results cached with zookie
- Cache invalidation via zookie comparison

### 4. Consistency Layer

**Zookie Implementation:**
\`\`\`
Zookie = (datacenter_id, commit_timestamp)

Example: "us-central1:1234567890"
\`\`\`

**Check with Zookie:**
1. Client writes tuple → Gets zookie
2. Client sends Check request with zookie
3. Zanzibar server checks local commit timestamp
4. If local timestamp < zookie timestamp → Wait for replication
5. Once caught up → Evaluate check
6. Return result (guaranteed fresh)

## Zanzibar Performance

**Latency Targets:**
- **Median:** <5ms
- **95th percentile:** <10ms
- **99th percentile:** <100ms

**Achieved At:**
- Millions of QPS (queries per second)
- Global scale (all Google services)
- Consistent across data centers

**How?**
- Aggressive caching
- Bloom filters for negative checks
- Parallel query evaluation
- Optimized graph traversal
          `
        },
        {
          type: "diagram",
          title: "Zanzibar Check Flow",
          content: `sequenceDiagram
    participant Client
    participant Zanzibar as Zanzibar Server
    participant Cache
    participant ACL as ACL Storage (Spanner)

    Client->>Zanzibar: Check(doc:roadmap, viewer, charlie)
    Zanzibar->>Cache: Lookup cached result
    Cache-->>Zanzibar: Cache miss

    Zanzibar->>ACL: Query tuples for doc:roadmap#viewer
    ACL-->>Zanzibar: [bob, group:engineering#member]

    Note over Zanzibar: charlie not directly viewer<br/>Check group membership

    Zanzibar->>ACL: Query tuples for group:engineering#member
    ACL-->>Zanzibar: [charlie, alice]

    Note over Zanzibar: charlie is member of engineering<br/>engineering is viewer of doc

    Zanzibar->>Zanzibar: Evaluate: charlie → member → engineering → viewer → doc
    Zanzibar->>Cache: Store result (with TTL)
    Zanzibar->>Client: Result: ALLOWED`,
          caption: "Zanzibar authorization check flow showing query evaluation and caching"
        },
        {
          type: "code",
          title: "Zanzibar Example: Google Docs Permissions",
          language: "yaml",
          content: `# Namespace: Document
name: "document"

relations:
  # Owner relation
  - name: "owner"
    userset_rewrite:
      union:
        - this: {}  # Directly assigned owners

  # Editor relation
  - name: "editor"
    userset_rewrite:
      union:
        - this: {}  # Directly assigned editors
        - computed_userset:
            relation: "owner"  # Owners are also editors

  # Commenter relation
  - name: "commenter"
    userset_rewrite:
      union:
        - this: {}
        - computed_userset:
            relation: "editor"  # Editors can comment

  # Viewer relation
  - name: "viewer"
    userset_rewrite:
      union:
        - this: {}  # Directly assigned viewers
        - computed_userset:
            relation: "commenter"  # Commenters can view
        # Inherit from parent folder
        - tuple_to_userset:
            tupleset:
              relation: "parent"
            computed_userset:
              object: "$TUPLE_USERSET_OBJECT"
              relation: "viewer"

---

# Namespace: Folder
name: "folder"

relations:
  - name: "owner"
    userset_rewrite:
      union:
        - this: {}

  - name: "editor"
    userset_rewrite:
      union:
        - this: {}
        - computed_userset:
            relation: "owner"

  - name: "viewer"
    userset_rewrite:
      union:
        - this: {}
        - computed_userset:
            relation: "editor"
        # Inherit from parent folder (nested folders)
        - tuple_to_userset:
            tupleset:
              relation: "parent"
            computed_userset:
              object: "$TUPLE_USERSET_OBJECT"
              relation: "viewer"

  # Parent relation (for folder hierarchy)
  - name: "parent"
    userset_rewrite:
      union:
        - this: {}

---

# Namespace: Group
name: "group"

relations:
  # Member relation
  - name: "member"
    userset_rewrite:
      union:
        - this: {}  # Direct members
        # Nested groups: members of child groups are members
        - tuple_to_userset:
            tupleset:
              relation: "member"
            computed_userset:
              object: "$TUPLE_USERSET_OBJECT"
              relation: "member"

---

# Example Tuples (Relationship Data)

# Users
group:engineering#member@alice
group:engineering#member@bob
group:marketing#member@charlie

# Nested groups
group:all-staff#member@group:engineering#member
group:all-staff#member@group:marketing#member

# Folders
folder:company#owner@alice
folder:company#viewer@group:all-staff#member

# Documents in folder
document:roadmap#parent@folder:company
document:roadmap#owner@alice
document:roadmap#editor@bob

document:budget#parent@folder:company
document:budget#viewer@charlie

---

# Example Check Queries

# Query 1: Can Alice edit the roadmap?
Check(
  object: "document:roadmap",
  relation: "editor",
  subject: "alice"
)
# Result: ALLOWED
# Reason: alice is owner, owners are editors

# Query 2: Can Bob view the roadmap?
Check(
  object: "document:roadmap",
  relation: "viewer",
  subject: "bob"
)
# Result: ALLOWED
# Reason: bob is editor, editors can view

# Query 3: Can Charlie view the roadmap?
Check(
  object: "document:roadmap",
  relation: "viewer",
  subject: "charlie"
)
# Result: ALLOWED
# Reason:
#   1. roadmap is in folder:company
#   2. folder:company is viewable by group:all-staff
#   3. group:all-staff contains group:marketing
#   4. charlie is member of group:marketing
# Path: charlie → member → marketing → member → all-staff → viewer → company → parent → roadmap

# Query 4: Can Charlie edit the budget?
Check(
  object: "document:budget",
  relation: "editor",
  subject: "charlie"
)
# Result: DENIED
# Reason: charlie is only a viewer, not editor`,
          caption: "Complete Zanzibar namespace configuration with examples showing Google Docs-style permissions"
        },
        {
          type: "interactive",
          title: "🔬 Hands-On: Trace Zanzibar Check",
          content: `
**Scenario:** Given these tuples, trace how Zanzibar checks permission:

**Tuples:**
\`\`\`
document:presentation#owner@alice
document:presentation#parent@folder:q4-planning
folder:q4-planning#viewer@group:leadership#member
group:leadership#member@bob
group:leadership#member@dave
\`\`\`

**Question:** Can Bob view \`document:presentation\`?

**Trace the Check:**

1. Check direct viewer assignment → Not found
2. Check if Bob is owner → Not found
3. Check if Bob is editor → Not found
4. Check parent folder permissions → Found: \`document:presentation#parent@folder:q4-planning\`
5. Check if Bob can view \`folder:q4-planning\` → Found: \`folder:q4-planning#viewer@group:leadership#member\`
6. Check if Bob is member of \`group:leadership\` → Found: \`group:leadership#member@bob\`

**Result:** ALLOWED

**Path:** bob → member → group:leadership → viewer → folder:q4-planning → parent → document:presentation

<details>
<summary>What if we check for Dave?</summary>

**Same result:** ALLOWED

Dave follows the same path through group:leadership membership.
</details>

<details>
<summary>What if we check for Alice to edit?</summary>

**Result:** ALLOWED

Alice is the owner. The namespace config defines that owners are also editors (computed_userset).
</details>
          `
        }
      ],
      quiz: {
        id: "zanzibar-quiz",
        title: "Google Zanzibar Quiz",
        description: "Test your understanding of Zanzibar architecture and concepts",
        passingScore: 70,
        questions: [
          {
            id: "zanzibar-q1",
            question: "What is a relationship tuple in Zanzibar?",
            options: [
              "A database table with three columns",
              "A statement of relationship: object#relation@subject",
              "An encryption key",
              "A user's password hash"
            ],
            correctAnswer: 1,
            explanation: "A relationship tuple in Zanzibar expresses a relationship in the format object#relation@subject, like 'doc:roadmap#viewer@alice' meaning Alice is a viewer of the roadmap document."
          },
          {
            id: "zanzibar-q2",
            question: "What is a Zookie in Zanzibar?",
            options: [
              "A type of cookie for authentication",
              "A consistency token ensuring read-after-write freshness",
              "A caching mechanism",
              "A database index"
            ],
            correctAnswer: 1,
            explanation: "A Zookie is a consistency token that ensures read-after-write consistency. When a permission is granted, the zookie ensures subsequent checks see the updated permission, preventing stale reads."
          },
          {
            id: "zanzibar-q3",
            question: "How does Zanzibar achieve <10ms latency at Google scale?",
            options: [
              "Using only in-memory storage",
              "Aggressive caching, Bloom filters, and optimized graph traversal",
              "Limiting the number of users",
              "Pre-computing all permission checks"
            ],
            correctAnswer: 1,
            explanation: "Zanzibar achieves low latency through aggressive caching of check results, Bloom filters for quick negative checks, parallel query evaluation, and optimized graph traversal algorithms."
          }
        ]
      }
    },
    {
      id: "implementing-zanzibar",
      slug: "implementing-zanzibar",
      title: "Implementing Zanzibar-Inspired Authorization",
      description: "Learn how to implement fine-grained authorization using open-source Zanzibar-inspired systems.",
      duration: 35,
      content: [
        {
          type: "text",
          title: "Open-Source Zanzibar Implementations",
          content: `
Since Google published the Zanzibar paper, several open-source implementations have emerged:

## 1. SpiceDB (AuthZed)

**Creator:** AuthZed Inc.
**Language:** Go
**License:** Apache 2.0

**Features:**
- ✅ Full Zanzibar implementation
- ✅ gRPC API
- ✅ Namespace configuration (schema)
- ✅ Check, Expand, Write APIs
- ✅ Zookies (consistency tokens)
- ✅ PostgreSQL, MySQL, CockroachDB storage
- ✅ Built-in caching

**Use Case:** Production-ready, managed service available

**Getting Started:**
\`\`\`bash
# Docker
docker run --rm -p 50051:50051 authzed/spicedb serve --grpc-preshared-key "somerandomkeyhere"

# Or use managed service at authzed.com
\`\`\`

## 2. Ory Keto

**Creator:** Ory Corp
**Language:** Go
**License:** Apache 2.0

**Features:**
- ✅ Zanzibar-inspired
- ✅ REST and gRPC APIs
- ✅ Namespace configuration
- ✅ Check, Expand APIs
- ✅ PostgreSQL, MySQL, CockroachDB storage
- ✅ Integration with Ory ecosystem (Hydra, Kratos)

**Use Case:** Good for Ory users, REST API preference

**Getting Started:**
\`\`\`bash
# Docker
docker run --rm -p 4466:4466 -p 4467:4467 oryd/keto serve
\`\`\`

## 3. OpenFGA (Fine-Grained Authorization)

**Creator:** Auth0/Okta
**Language:** Go
**License:** Apache 2.0

**Features:**
- ✅ Zanzibar-inspired
- ✅ gRPC and HTTP APIs
- ✅ Type system (like namespace config)
- ✅ Check, Expand, ListObjects APIs
- ✅ PostgreSQL, MySQL storage
- ✅ DSL for authorization models

**Use Case:** Auth0 users, good documentation

**Getting Started:**
\`\`\`bash
# Docker
docker run --rm -p 8080:8080 -p 3000:3000 openfga/openfga run
\`\`\`

## 4. Permify

**Creator:** Permify Inc.
**Language:** Go
**License:** Apache 2.0

**Features:**
- ✅ Zanzibar-inspired
- ✅ gRPC and REST APIs
- ✅ Schema definition language
- ✅ Check, Expand APIs
- ✅ PostgreSQL, MySQL storage
- ✅ Developer-friendly UI

**Use Case:** Startups, easy to get started

## Comparison

| Feature | SpiceDB | Ory Keto | OpenFGA | Permify |
|---------|---------|----------|---------|---------|
| **Maturity** | High | High | Medium | Medium |
| **API** | gRPC | REST + gRPC | gRPC + HTTP | gRPC + REST |
| **Managed Service** | Yes (AuthZed) | No | No | Yes |
| **Documentation** | Excellent | Good | Excellent | Good |
| **Community** | Large | Large (Ory) | Growing | Small |
| **Performance** | Excellent | Good | Good | Good |
| **UI/Dashboard** | Yes (Cloud) | No | Limited | Yes |

**Recommendation:**
- **Production:** SpiceDB (most mature, managed service available)
- **Ory Users:** Ory Keto (integrates with Ory ecosystem)
- **Auth0 Users:** OpenFGA (from Okta/Auth0 team)
- **Getting Started:** Permify (easiest to learn)
          `
        },
        {
          type: "text",
          title: "Implementing with SpiceDB",
          content: `
Let's implement Google Docs-style permissions using SpiceDB.

## Step 1: Define Schema

**Create \`schema.zed\`:**

\`\`\`
// Document definition
definition document {
  relation owner: user
  relation editor: user | group#member
  relation viewer: user | group#member

  // Permissions
  permission edit = owner + editor
  permission view = viewer + edit

  // Parent folder (for inheritance)
  relation parent: folder
  permission view_from_parent = parent->view
}

// Folder definition
definition folder {
  relation owner: user
  relation editor: user | group#member
  relation viewer: user | group#member

  permission edit = owner + editor
  permission view = viewer + edit + view_from_parent

  // Nested folders
  relation parent: folder
  permission view_from_parent = parent->view
}

// Group definition (for teams, departments)
definition group {
  relation member: user | group#member  // Nested groups
}
\`\`\`

## Step 2: Write Relationships

\`\`\`javascript
// Node.js client
const { v1 } = require('@authzed/authzed-node')

const client = v1.NewClient(
  "somerandomkeyhere",  // Token
  "localhost:50051"      // Endpoint
)

// Create relationships
async function setupPermissions() {
  // Alice owns the roadmap document
  await client.WriteRelationships({
    updates: [
      {
        operation: v1.RelationshipUpdate_Operation.OPERATION_CREATE,
        relationship: {
          resource: { objectType: 'document', objectId: 'roadmap' },
          relation: 'owner',
          subject: { object: { objectType: 'user', objectId: 'alice' } }
        }
      },
      // Bob is an editor
      {
        operation: v1.RelationshipUpdate_Operation.OPERATION_CREATE,
        relationship: {
          resource: { objectType: 'document', objectId: 'roadmap' },
          relation: 'editor',
          subject: { object: { objectType: 'user', objectId: 'bob' } }
        }
      },
      // Engineering group can view
      {
        operation: v1.RelationshipUpdate_Operation.OPERATION_CREATE,
        relationship: {
          resource: { objectType: 'document', objectId: 'roadmap' },
          relation: 'viewer',
          subject: {
            object: { objectType: 'group', objectId: 'engineering' },
            optionalRelation: 'member'
          }
        }
      },
      // Charlie is member of engineering
      {
        operation: v1.RelationshipUpdate_Operation.OPERATION_CREATE,
        relationship: {
          resource: { objectType: 'group', objectId: 'engineering' },
          relation: 'member',
          subject: { object: { objectType: 'user', objectId: 'charlie' } }
        }
      }
    ]
  })

  console.log("Relationships created")
}
\`\`\`

## Step 3: Check Permissions

\`\`\`javascript
async function checkPermission(user, resource, permission) {
  const response = await client.CheckPermission({
    resource: {
      objectType: resource.type,
      objectId: resource.id
    },
    permission: permission,
    subject: {
      object: {
        objectType: 'user',
        objectId: user
      }
    }
  })

  return response.permissionship === v1.CheckPermissionResponse_Permissionship.PERMISSIONSHIP_HAS_PERMISSION
}

// Check if Charlie can view the roadmap
const canView = await checkPermission(
  'charlie',
  { type: 'document', id: 'roadmap' },
  'view'
)

console.log('Can Charlie view roadmap?', canView)  // true
\`\`\`

## Step 4: List Accessible Resources

\`\`\`javascript
async function listAccessibleDocuments(user, permission) {
  const response = await client.LookupResources({
    resourceObjectType: 'document',
    permission: permission,
    subject: {
      object: {
        objectType: 'user',
        objectId: user
      }
    }
  })

  const documents = []
  for await (const result of response) {
    documents.push(result.resourceObjectId)
  }

  return documents
}

// List all documents Charlie can view
const docs = await listAccessibleDocuments('charlie', 'view')
console.log('Charlie can view:', docs)  // ['roadmap', ...]
\`\`\`

## Step 5: Expand Permission Tree

\`\`\`javascript
async function expandPermissions(resource, permission) {
  const response = await client.ExpandPermissionTree({
    resource: {
      objectType: resource.type,
      objectId: resource.id
    },
    permission: permission
  })

  return response.treeRoot
}

// See who has view permission on roadmap
const tree = await expandPermissions(
  { type: 'document', id: 'roadmap' },
  'view'
)

console.log('Permission tree:', JSON.stringify(tree, null, 2))
// Shows: alice (owner), bob (editor), group:engineering members
\`\`\`

## Step 6: Using Consistency (Zookies)

\`\`\`javascript
async function shareDocumentWithConsistency(docId, userId) {
  // Write relationship and get zookie
  const writeResponse = await client.WriteRelationships({
    updates: [{
      operation: v1.RelationshipUpdate_Operation.OPERATION_CREATE,
      relationship: {
        resource: { objectType: 'document', objectId: docId },
        relation: 'viewer',
        subject: { object: { objectType: 'user', objectId: userId } }
      }
    }]
  })

  const zookie = writeResponse.writtenAt

  // Immediately check with zookie (guaranteed fresh)
  const checkResponse = await client.CheckPermission({
    consistency: {
      atLeastAsFresh: zookie
    },
    resource: { objectType: 'document', objectId: docId },
    permission: 'view',
    subject: { object: { objectType: 'user', objectId: userId } }
  })

  console.log('Access granted immediately:',
    checkResponse.permissionship === v1.CheckPermissionResponse_Permissionship.PERMISSIONSHIP_HAS_PERMISSION
  )
  // true (no stale reads!)
}
\`\`\`
          `
        },
        {
          type: "code",
          title: "Complete Authorization Middleware (Express.js)",
          language: "javascript",
          content: `// authorization-middleware.js
const { v1 } = require('@authzed/authzed-node')

class AuthorizationService {
  constructor(token, endpoint) {
    this.client = v1.NewClient(token, endpoint)
  }

  // Check if user can perform action on resource
  async check(userId, resource, permission, consistency = null) {
    const request = {
      resource: {
        objectType: resource.type,
        objectId: resource.id
      },
      permission: permission,
      subject: {
        object: {
          objectType: 'user',
          objectId: userId
        }
      }
    }

    if (consistency) {
      request.consistency = { atLeastAsFresh: consistency }
    }

    const response = await this.client.CheckPermission(request)
    return response.permissionship === v1.CheckPermissionResponse_Permissionship.PERMISSIONSHIP_HAS_PERMISSION
  }

  // Grant permission
  async grant(resource, relation, subject, subjectRelation = null) {
    const relationship = {
      resource: {
        objectType: resource.type,
        objectId: resource.id
      },
      relation: relation,
      subject: {
        object: {
          objectType: subject.type,
          objectId: subject.id
        }
      }
    }

    if (subjectRelation) {
      relationship.subject.optionalRelation = subjectRelation
    }

    const response = await this.client.WriteRelationships({
      updates: [{
        operation: v1.RelationshipUpdate_Operation.OPERATION_CREATE,
        relationship: relationship
      }]
    })

    return response.writtenAt  // Return zookie
  }

  // Revoke permission
  async revoke(resource, relation, subject, subjectRelation = null) {
    const relationship = {
      resource: {
        objectType: resource.type,
        objectId: resource.id
      },
      relation: relation,
      subject: {
        object: {
          objectType: subject.type,
          objectId: subject.id
        }
      }
    }

    if (subjectRelation) {
      relationship.subject.optionalRelation = subjectRelation
    }

    await this.client.WriteRelationships({
      updates: [{
        operation: v1.RelationshipUpdate_Operation.OPERATION_DELETE,
        relationship: relationship
      }]
    })
  }

  // List resources user can access
  async listResources(userId, resourceType, permission) {
    const response = await this.client.LookupResources({
      resourceObjectType: resourceType,
      permission: permission,
      subject: {
        object: {
          objectType: 'user',
          objectId: userId
        }
      }
    })

    const resources = []
    for await (const result of response) {
      resources.push(result.resourceObjectId)
    }

    return resources
  }
}

// Initialize service
const authz = new AuthorizationService(
  process.env.SPICEDB_TOKEN,
  process.env.SPICEDB_ENDPOINT || 'localhost:50051'
)

// Express middleware for authorization
function authorize(resource, permission) {
  return async (req, res, next) => {
    try {
      // Get user ID from JWT or session
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Determine resource from request
      const resourceInfo = typeof resource === 'function'
        ? resource(req)
        : resource

      // Check permission
      const allowed = await authz.check(userId, resourceInfo, permission)

      if (!allowed) {
        return res.status(403).json({
          error: 'Forbidden',
          message: \`You don't have permission to \${permission} this resource\`
        })
      }

      // Store permission check result in request
      req.authorized = { resource: resourceInfo, permission }
      next()

    } catch (error) {
      console.error('Authorization check failed:', error)
      res.status(500).json({ error: 'Authorization check failed' })
    }
  }
}

// Express routes with authorization

const express = require('express')
const app = express()
app.use(express.json())

// View document
app.get('/documents/:id',
  authorize(
    (req) => ({ type: 'document', id: req.params.id }),
    'view'
  ),
  async (req, res) => {
    // User is authorized, fetch and return document
    const document = await db.documents.findById(req.params.id)
    res.json(document)
  }
)

// Edit document
app.put('/documents/:id',
  authorize(
    (req) => ({ type: 'document', id: req.params.id }),
    'edit'
  ),
  async (req, res) => {
    // User is authorized, update document
    const updated = await db.documents.update(req.params.id, req.body)
    res.json(updated)
  }
)

// Share document
app.post('/documents/:id/share',
  authorize(
    (req) => ({ type: 'document', id: req.params.id }),
    'edit'  // Only editors can share
  ),
  async (req, res) => {
    const { userId, permission } = req.body  // viewer, editor, or owner

    // Grant permission and get zookie
    const zookie = await authz.grant(
      { type: 'document', id: req.params.id },
      permission,
      { type: 'user', id: userId }
    )

    // Verify immediately with zookie (no stale reads)
    const verified = await authz.check(
      userId,
      { type: 'document', id: req.params.id },
      permission,
      zookie
    )

    res.json({
      success: true,
      shared_with: userId,
      permission: permission,
      verified: verified
    })
  }
)

// List user's documents
app.get('/documents',
  async (req, res) => {
    const userId = req.user?.id

    // List all documents user can view
    const documentIds = await authz.listResources(userId, 'document', 'view')

    // Fetch document metadata
    const documents = await db.documents.findByIds(documentIds)

    res.json({ documents })
  }
)

// Revoke access
app.delete('/documents/:id/share/:userId',
  authorize(
    (req) => ({ type: 'document', id: req.params.id }),
    'edit'
  ),
  async (req, res) => {
    await authz.revoke(
      { type: 'document', id: req.params.id },
      'viewer',  // Remove viewer permission
      { type: 'user', id: req.params.userId }
    )

    res.json({ success: true, message: 'Access revoked' })
  }
)

module.exports = { authz, authorize }`,
          caption: "Production-ready Express.js authorization middleware using SpiceDB"
        },
        {
          type: "interactive",
          title: "🎯 Exercise: Design Authorization Schema",
          content: `
**Scenario:** Design a Zanzibar schema for a GitHub-like platform with:

- **Organizations** (e.g., "acme-corp")
- **Teams** within organizations (e.g., "backend-team")
- **Repositories** owned by organizations
- **Issues** within repositories

**Requirements:**
1. Organization owners can manage everything
2. Team members can push to repos the team has access to
3. Anyone can view public repos
4. Only repo collaborators can view private repos
5. Issue creators can edit their own issues
6. Repo collaborators can comment on issues

**Design Task:** Write the schema definitions

<details>
<summary>View Solution</summary>

\`\`\`
definition organization {
  relation owner: user
  relation member: user

  permission admin = owner
  permission view = member + admin
}

definition team {
  relation organization: organization
  relation member: user

  permission view = member + organization->admin
}

definition repository {
  relation organization: organization
  relation team_push: team#member
  relation collaborator: user
  relation public: user:*  // Anyone if public

  permission admin = organization->admin
  permission push = team_push + collaborator + admin
  permission view = public + push
}

definition issue {
  relation repository: repository
  relation creator: user

  permission edit = creator + repository->admin
  permission comment = repository->view
  permission view = repository->view
}
\`\`\`

**Key Concepts Used:**
- **Relation to parent** (\`organization: organization\`)
- **Wildcard** (\`user:*\` for public access)
- **Permission inheritance** (\`repository->admin\`)
- **Computed permissions** (\`push = team_push + collaborator + admin\`)
</details>
          `
        }
      ],
      quiz: {
        id: "implementation-quiz",
        title: "Zanzibar Implementation Quiz",
        description: "Test your knowledge of implementing Zanzibar-inspired authorization",
        passingScore: 70,
        questions: [
          {
            id: "impl-q1",
            question: "Which open-source Zanzibar implementation is most mature and production-ready?",
            options: [
              "Ory Keto",
              "SpiceDB (AuthZed)",
              "OpenFGA",
              "Permify"
            ],
            correctAnswer: 1,
            explanation: "SpiceDB is the most mature Zanzibar implementation with excellent documentation, active development, and a managed service (AuthZed) for production use."
          },
          {
            id: "impl-q2",
            question: "In SpiceDB schema, what does 'permission edit = owner + editor' mean?",
            options: [
              "Only owners can edit",
              "Owners and editors both have edit permission",
              "Editors must also be owners",
              "Mathematical addition"
            ],
            correctAnswer: 1,
            explanation: "The '+' operator represents a union in SpiceDB. 'owner + editor' means users who are either owners OR editors have the edit permission."
          },
          {
            id: "impl-q3",
            question: "Why should you use zookies (consistency tokens) when sharing a document?",
            options: [
              "To encrypt the permission grant",
              "To ensure immediate visibility of the new permission (no stale reads)",
              "To improve performance",
              "To comply with GDPR"
            ],
            correctAnswer: 1,
            explanation: "Zookies ensure read-after-write consistency. When you grant permission and immediately check if the user has access, the zookie guarantees you see the updated permission, preventing stale reads."
          }
        ]
      }
    },
    {
      id: "authorization-systems-comparison",
      slug: "authorization-systems-comparison",
      title: "Modern Authorization Systems: Cedar, OpenFGA, and Zanzibar Implementations",
      description: "Deep dive into Amazon Cedar, OpenFGA, SpiceDB, and Ory Keto - comparing architecture, syntax, and real-world implementations.",
      duration: 45,
      content: [
        {
          type: "text",
          title: "The Authorization Landscape",
          content: `
Modern applications need sophisticated authorization beyond simple role checks. Let's explore the three major paradigms for fine-grained authorization in 2025:

## Three Approaches to Fine-Grained Authorization

### 1. **Graph-Based (Zanzibar-Inspired)**
**Representatives:** Google Zanzibar, SpiceDB, OpenFGA, Ory Keto

**Philosophy:** Model authorization as a **relationship graph**

**Example:**
\`\`\`
user:alice → viewer → document:readme.md
user:alice → member → group:engineering
group:engineering → editor → folder:projects
\`\`\`

**Strengths:**
- ✅ Excellent for hierarchical/nested relationships (Google Drive, GitHub)
- ✅ Handles transitive relationships naturally (group → group → user)
- ✅ Proven at massive scale (Google, Airbnb, Carta)
- ✅ Check queries are fast (graph traversal optimized)

**Challenges:**
- ❌ Complex system to deploy and operate
- ❌ Steeper learning curve
- ❌ Requires relationship data modeling

### 2. **Policy-Based (Logic/Rules)**
**Representatives:** Amazon Cedar, Open Policy Agent (OPA), Cerbos

**Philosophy:** Express authorization as **declarative policies**

**Example (Cedar):**
\`\`\`cedar
permit (
  principal == User::"alice",
  action == Action::"read",
  resource == Document::"readme.md"
);
\`\`\`

**Strengths:**
- ✅ Highly expressive and flexible
- ✅ Excellent for attribute-based access control (ABAC)
- ✅ Policies are auditable and analyzable
- ✅ Simpler to deploy (stateless evaluation)

**Challenges:**
- ❌ Complex policies can be hard to reason about
- ❌ Less natural for deep hierarchies
- ❌ May require policy recompilation for relationship changes

### 3. **Hybrid (Best of Both)**
**Representatives:** Aserto Topaz, Permit.io

**Philosophy:** Combine **relationship graphs** with **policy rules**

**Example:**
- Use Zanzibar-style graph for organizational hierarchies
- Use OPA/Cedar policies for attribute-based decisions

**Strengths:**
- ✅ Flexible: Use the right tool for each use case
- ✅ Can handle both ReBAC and ABAC

**Challenges:**
- ❌ More complex architecture
- ❌ Two systems to learn and maintain

## Comparison Matrix

| System | Type | Language | Open Source | Managed Service | Best For |
|--------|------|----------|-------------|-----------------|----------|
| **Google Zanzibar** | Graph | Internal | ❌ No | ❌ No | Reference design |
| **SpiceDB** | Graph | Schema DSL | ✅ Yes | ✅ AuthZed | Production ReBAC |
| **OpenFGA** | Graph | DSL/JSON | ✅ Yes | ✅ Auth0 | Developer experience |
| **Ory Keto** | Graph | DSL | ✅ Yes | ✅ Ory Cloud | Ory stack integration |
| **Amazon Cedar** | Policy | Cedar | ✅ Yes | ✅ AWS Verified Permissions | AWS-first, analyzable policies |
| **OPA** | Policy | Rego | ✅ Yes | ✅ Styra | Kubernetes, general policy |
| **Cerbos** | Policy | YAML | ✅ Yes | ❌ No | GitOps-friendly ABAC |
| **Aserto Topaz** | Hybrid | OPA + Graph | ✅ Yes | ✅ Aserto | Best of both worlds |
          `
        },
        {
          type: "text",
          title: "Amazon Cedar: Policy-Driven Authorization",
          content: `
Amazon Cedar is an **authorization policy language** developed by AWS and used in **AWS Verified Permissions**. It's designed for **safety, expressiveness, and analyzability**.

## Cedar Design Principles

1. **Purpose-Built for Authorization**: Not a general-purpose language
2. **Analyzable**: Automated reasoning can prove properties about policies
3. **Deterministic**: Same inputs always produce same output
4. **Fast**: Policies evaluate in microseconds
5. **Human-Readable**: Clear syntax for security audits

## Cedar Syntax

Cedar policies consist of **permit** or **forbid** statements with optional **when/unless** conditions.

### Basic Policy Structure

\`\`\`cedar
permit (
  principal,
  action,
  resource
) when {
  condition
};
\`\`\`

### Example 1: Simple RBAC

\`\`\`cedar
// Allow admins to perform any action
permit (
  principal in Role::"admin",
  action,
  resource
);
\`\`\`

### Example 2: Attribute-Based Access Control (ABAC)

\`\`\`cedar
// Allow users to read documents in their department
permit (
  principal,
  action == Action::"read",
  resource
) when {
  principal.department == resource.department
};
\`\`\`

### Example 3: Context-Aware (IP Restriction)

\`\`\`cedar
// Allow access only from corporate network
permit (
  principal,
  action,
  resource
) when {
  context.ip_address like "192.168.*.*"
};
\`\`\`

### Example 4: Time-Based Access

\`\`\`cedar
// Allow access only during business hours
permit (
  principal,
  action,
  resource
) when {
  context.current_time >= time("09:00:00") &&
  context.current_time <= time("17:00:00")
};
\`\`\`

### Example 5: Multi-Factor Authentication Requirement

\`\`\`cedar
// Require MFA for sensitive operations
forbid (
  principal,
  action in [Action::"delete", Action::"transfer"],
  resource
) unless {
  context.mfa_verified == true
};
\`\`\`

## Cedar Entity Model

Cedar uses a typed entity model with principals, actions, and resources.

\`\`\`json
{
  "entities": [
    {
      "uid": { "type": "User", "id": "alice" },
      "attrs": {
        "department": "engineering",
        "role": "developer",
        "email": "alice@example.com"
      },
      "parents": [
        { "type": "Role", "id": "developer" }
      ]
    },
    {
      "uid": { "type": "Document", "id": "doc123" },
      "attrs": {
        "department": "engineering",
        "classification": "confidential"
      }
    }
  ]
}
\`\`\`

## Cedar vs. Zanzibar

| Aspect | Cedar | Zanzibar/OpenFGA |
|--------|-------|------------------|
| **Model** | Policy-driven (ABAC) | Graph-driven (ReBAC) |
| **Strengths** | Flexible, analyzable | Hierarchies, transitive |
| **Data Storage** | Ephemeral (policies) | Persistent (relationships) |
| **Best For** | Attribute rules | Organizational hierarchies |
| **Query Pattern** | "Is this allowed?" | "Who can access X?" + "Is this allowed?" |
| **Complexity** | Simpler deployment | Complex graph database |

## When to Use Cedar

✅ **Use Cedar when:**
- You need attribute-based access control (user.role, resource.classification)
- Policies change more often than relationships
- You want static analysis of authorization logic
- AWS ecosystem (integrates with Cognito, IAM)
- Simpler deployment (no separate graph database)

❌ **Avoid Cedar when:**
- Deep organizational hierarchies (nested groups, inherited permissions)
- Relationship-heavy (Google Drive-style sharing)
- Need to query "who has access?" (reverse lookup)
          `
        },
        {
          type: "code",
          title: "Amazon Cedar Implementation Example",
          language: "typescript",
          content: `// Using Amazon Cedar with AWS Verified Permissions SDK

import {
  VerifiedPermissionsClient,
  IsAuthorizedCommand,
  CreatePolicyCommand,
  BatchIsAuthorizedCommand,
} from "@aws-sdk/client-verifiedpermissions"

// Initialize Cedar client
const client = new VerifiedPermissionsClient({
  region: "us-east-1",
})

const policyStoreId = "PS1234567890" // Your policy store ID

// 1. Create a Cedar policy
async function createPolicy() {
  const policyStatement = \`
permit (
  principal,
  action == Action::"viewDocument",
  resource
) when {
  principal.department == resource.department &&
  resource.classification != "top-secret"
};
\`

  const command = new CreatePolicyCommand({
    policyStoreId,
    definition: {
      static: {
        description: "Allow users to view documents in their department (non-classified)",
        statement: policyStatement,
      },
    },
  })

  const response = await client.send(command)
  console.log("Policy created:", response.policyId)
  return response.policyId
}

// 2. Single authorization check
async function checkAuthorization(userId: string, documentId: string) {
  const command = new IsAuthorizedCommand({
    policyStoreId,
    principal: {
      entityType: "User",
      entityId: userId,
    },
    action: {
      actionType: "Action",
      actionId: "viewDocument",
    },
    resource: {
      entityType: "Document",
      entityId: documentId,
    },
    entities: {
      entityList: [
        {
          identifier: {
            entityType: "User",
            entityId: userId,
          },
          attributes: {
            department: { string: "engineering" },
            role: { string: "developer" },
            mfaVerified: { boolean: true },
          },
        },
        {
          identifier: {
            entityType: "Document",
            entityId: documentId,
          },
          attributes: {
            department: { string: "engineering" },
            classification: { string: "confidential" },
            owner: { string: userId },
          },
        },
      ],
    },
    context: {
      contextMap: {
        ipAddress: { string: "192.168.1.100" },
        timestamp: { long: Date.now() },
      },
    },
  })

  const response = await client.send(command)

  console.log(\`Authorization decision: \${response.decision}\`) // "ALLOW" or "DENY"
  console.log(\`Determining policies: \${JSON.stringify(response.determiningPolicies)}\`)

  return response.decision === "ALLOW"
}

// 3. Batch authorization (check multiple requests at once)
async function batchCheckAuthorization(requests: Array<{
  userId: string
  action: string
  resourceId: string
}>) {
  const command = new BatchIsAuthorizedCommand({
    policyStoreId,
    requests: requests.map(req => ({
      principal: {
        entityType: "User",
        entityId: req.userId,
      },
      action: {
        actionType: "Action",
        actionId: req.action,
      },
      resource: {
        entityType: "Document",
        entityId: req.resourceId,
      },
    })),
  })

  const response = await client.send(command)

  response.results?.forEach((result, index) => {
    console.log(
      \`Request \${index + 1}: \${result.decision} - \${result.determiningPolicies?.length || 0} policies applied\`
    )
  })

  return response.results
}

// 4. Express.js middleware using Cedar
import express from "express"

function cedarAuthMiddleware(action: string) {
  return async (req: express.Request, res: express.Response, next: express.Function) => {
    const userId = req.user?.id // From authentication middleware
    const resourceId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    try {
      const allowed = await checkAuthorization(userId, resourceId)

      if (!allowed) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You do not have permission to perform this action",
        })
      }

      next()
    } catch (error) {
      console.error("Cedar authorization error:", error)
      return res.status(500).json({ error: "Authorization check failed" })
    }
  }
}

// Usage in Express routes
const app = express()

app.get("/documents/:id", cedarAuthMiddleware("viewDocument"), async (req, res) => {
  const document = await db.documents.findById(req.params.id)
  res.json(document)
})

app.delete("/documents/:id", cedarAuthMiddleware("deleteDocument"), async (req, res) => {
  await db.documents.delete(req.params.id)
  res.json({ success: true })
})

// 5. Complex policy example - Document lifecycle
async function createDocumentLifecyclePolicy() {
  const policyStatement = \`
// Allow document owners to always edit
permit (
  principal,
  action == Action::"editDocument",
  resource
) when {
  principal == resource.owner
};

// Allow editors to edit non-finalized documents
permit (
  principal in resource.editors,
  action == Action::"editDocument",
  resource
) when {
  resource.status != "finalized"
};

// Require MFA for sensitive operations
forbid (
  principal,
  action in [Action::"deleteDocument", Action::"exportDocument"],
  resource
) unless {
  context.mfaVerified == true
};

// Block access to top-secret documents outside corporate network
forbid (
  principal,
  action,
  resource
) when {
  resource.classification == "top-secret" &&
  !(context.ipAddress like "192.168.*.*")
};
\`

  const command = new CreatePolicyCommand({
    policyStoreId,
    definition: {
      static: {
        description: "Complete document lifecycle authorization",
        statement: policyStatement,
      },
    },
  })

  await client.send(command)
  console.log("Document lifecycle policy created")
}

export {
  createPolicy,
  checkAuthorization,
  batchCheckAuthorization,
  cedarAuthMiddleware,
  createDocumentLifecyclePolicy,
}`,
          caption: "Complete Cedar authorization implementation with AWS Verified Permissions, including policies, checks, and Express middleware",
        },
        {
          type: "text",
          title: "OpenFGA: Developer-Friendly Zanzibar",
          content: `
**OpenFGA** (Fine-Grained Authorization) is an open-source authorization system developed by **Auth0**, inspired by Google Zanzibar. It prioritizes **developer experience** while maintaining high performance.

## OpenFGA Key Features

1. **Zanzibar-Inspired**: Based on Google's proven authorization model
2. **Simple DSL**: Easy-to-read authorization model syntax
3. **Multiple SDKs**: JavaScript, Go, Python, .NET, Java
4. **VSCode Extension**: Syntax highlighting and validation
5. **Playground**: Interactive model testing at openfga.dev/playground
6. **Performance**: Handles millions of relationship tuples efficiently

## OpenFGA Architecture

\`\`\`
┌─────────────┐
│  Your App   │
└──────┬──────┘
       │
       ├─► Write Tuples (grant permission)
       ├─► Check (is user allowed?)
       └─► ListObjects (what can user access?)
       │
┌──────▼───────────────┐
│   OpenFGA Server     │
│  ┌────────────────┐  │
│  │ Authorization  │  │
│  │     Model      │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │  Relationship  │  │
│  │     Tuples     │  │
│  └────────────────┘  │
└──────────────────────┘
\`\`\`

## OpenFGA DSL Syntax

OpenFGA uses a clean DSL to define authorization models.

### Basic Model Structure

\`\`\`
model
  schema 1.1

type user

type document
  relations
    define owner: [user]
    define editor: [user]
    define viewer: [user]
    define can_view: owner or editor or viewer
    define can_edit: owner or editor
    define can_delete: owner
\`\`\`

### Advanced: GitHub-Style Repository Model

\`\`\`
model
  schema 1.1

type user

type organization
  relations
    define member: [user]
    define admin: [user]

type team
  relations
    define member: [user]

type repository
  relations
    define owner: [user, organization#member]
    define admin: [user, team#member]
    define maintainer: [user, team#member]
    define writer: [user, team#member]
    define reader: [user, team#member]

    // Permissions
    define can_read: reader or writer or maintainer or admin or owner
    define can_write: writer or maintainer or admin or owner
    define can_admin: admin or owner
    define can_delete: owner
\`\`\`

### Parent-Child Relationships (Google Drive-Style)

\`\`\`
model
  schema 1.1

type user

type folder
  relations
    define owner: [user]
    define editor: [user]
    define viewer: [user]
    define parent: [folder]

    // Inherit permissions from parent folder
    define can_view: viewer or editor or owner or parent->can_view
    define can_edit: editor or owner or parent->can_edit

type document
  relations
    define owner: [user]
    define editor: [user]
    define viewer: [user]
    define parent: [folder]

    // Inherit permissions from parent folder
    define can_view: viewer or editor or owner or parent->can_view
    define can_edit: editor or owner or parent->can_edit
    define can_delete: owner
\`\`\`

## Relationship Tuples

Tuples represent "who has what relationship to which resource":

\`\`\`
(user:alice, owner, document:readme)
(user:bob, viewer, document:readme)
(user:charlie, member, team:engineering)
(team:engineering, editor, folder:projects)
\`\`\`

**Format:** \`(subject, relation, object)\`

## OpenFGA API Operations

### 1. Write Tuples (Grant Permissions)

\`\`\`typescript
await fgaClient.write({
  writes: [
    {
      user: "user:alice",
      relation: "owner",
      object: "document:readme"
    },
    {
      user: "user:bob",
      relation: "viewer",
      object: "document:readme"
    }
  ]
})
\`\`\`

### 2. Check (Authorization Decision)

\`\`\`typescript
const { allowed } = await fgaClient.check({
  user: "user:alice",
  relation: "can_edit",
  object: "document:readme"
})

console.log(allowed) // true or false
\`\`\`

### 3. ListObjects (Reverse Lookup)

\`\`\`typescript
const { objects } = await fgaClient.listObjects({
  user: "user:alice",
  relation: "can_view",
  type: "document"
})

console.log(objects) // ["document:readme", "document:proposal", ...]
\`\`\`

## OpenFGA vs. SpiceDB vs. Ory Keto

| Feature | OpenFGA | SpiceDB | Ory Keto |
|---------|---------|---------|----------|
| **Maintainer** | Auth0 | AuthZed | Ory |
| **First Release** | 2022 | 2021 | 2020 |
| **Language** | Go | Go | Go |
| **DSL Quality** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |
| **Managed Service** | ✅ Auth0 FGA | ✅ AuthZed | ✅ Ory Cloud |
| **Developer Experience** | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Great | ⭐⭐⭐ Good |
| **Performance** | High | Very High | High |
| **Consistency** | Eventually consistent | Strong consistency | Eventually consistent |
| **Maturity** | Medium | High | Medium |
| **Best For** | Auth0 users, new projects | Production-critical, scale | Ory stack users |

### Unique Features

**OpenFGA:**
- VSCode extension with autocomplete
- Interactive playground (openfga.dev/playground)
- Simplest onboarding experience

**SpiceDB:**
- **Caveats** (conditional relationships: "editor if MFA verified")
- **Schema versioning** (migrate models without downtime)
- **Zookies** (consistency tokens)
- Most Zanzibar-complete implementation

**Ory Keto:**
- Integrates with Ory Hydra (OAuth), Kratos (identity), Oathkeeper (gateway)
- Part of complete open-source IAM stack
- Modular architecture
          `
        },
        {
          type: "code",
          title: "OpenFGA Implementation Example",
          language: "typescript",
          content: `// Complete OpenFGA implementation for a document management system

import { OpenFgaClient } from "@openfga/sdk"

// 1. Initialize OpenFGA client
const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL || "http://localhost:8080",
  storeId: process.env.FGA_STORE_ID,
  authorizationModelId: process.env.FGA_MODEL_ID, // Optional: pin to specific model version
})

// 2. Define authorization model (done once, typically via CLI or API)
const authorizationModel = {
  schema_version: "1.1",
  type_definitions: [
    {
      type: "user",
    },
    {
      type: "organization",
      relations: {
        member: {
          this: {},
        },
      },
      metadata: {
        relations: {
          member: { directly_related_user_types: [{ type: "user" }] },
        },
      },
    },
    {
      type: "folder",
      relations: {
        owner: {
          this: {},
        },
        editor: {
          this: {},
        },
        viewer: {
          this: {},
        },
        parent: {
          this: {},
        },
        can_view: {
          union: {
            child: [
              { this: {}, tupleToUserset: { object: "", relation: "owner" } },
              { this: {}, tupleToUserset: { object: "", relation: "editor" } },
              { this: {}, tupleToUserset: { object: "", relation: "viewer" } },
              {
                tupleToUserset: {
                  tupleset: { object: "", relation: "parent" },
                  computedUserset: { object: "", relation: "can_view" },
                },
              },
            ],
          },
        },
        can_edit: {
          union: {
            child: [
              { this: {}, tupleToUserset: { object: "", relation: "owner" } },
              { this: {}, tupleToUserset: { object: "", relation: "editor" } },
              {
                tupleToUserset: {
                  tupleset: { object: "", relation: "parent" },
                  computedUserset: { object: "", relation: "can_edit" },
                },
              },
            ],
          },
        },
      },
      metadata: {
        relations: {
          owner: { directly_related_user_types: [{ type: "user" }] },
          editor: { directly_related_user_types: [{ type: "user" }, { type: "organization", relation: "member" }] },
          viewer: { directly_related_user_types: [{ type: "user" }] },
          parent: { directly_related_user_types: [{ type: "folder" }] },
        },
      },
    },
    {
      type: "document",
      relations: {
        owner: {
          this: {},
        },
        editor: {
          this: {},
        },
        viewer: {
          this: {},
        },
        parent: {
          this: {},
        },
        can_view: {
          union: {
            child: [
              { this: {}, tupleToUserset: { object: "", relation: "owner" } },
              { this: {}, tupleToUserset: { object: "", relation: "editor" } },
              { this: {}, tupleToUserset: { object: "", relation: "viewer" } },
              {
                tupleToUserset: {
                  tupleset: { object: "", relation: "parent" },
                  computedUserset: { object: "", relation: "can_view" },
                },
              },
            ],
          },
        },
        can_edit: {
          union: {
            child: [
              { this: {}, tupleToUserset: { object: "", relation: "owner" } },
              { this: {}, tupleToUserset: { object: "", relation: "editor" } },
              {
                tupleToUserset: {
                  tupleset: { object: "", relation: "parent" },
                  computedUserset: { object: "", relation: "can_edit" },
                },
              },
            ],
          },
        },
        can_delete: {
          this: {},
          tupleToUserset: { object: "", relation: "owner" },
        },
      },
      metadata: {
        relations: {
          owner: { directly_related_user_types: [{ type: "user" }] },
          editor: { directly_related_user_types: [{ type: "user" }] },
          viewer: { directly_related_user_types: [{ type: "user" }] },
          parent: { directly_related_user_types: [{ type: "folder" }] },
        },
      },
    },
  ],
}

// 3. Helper functions for common operations

/**
 * Grant a user permission to a resource
 */
async function grantPermission(
  userId: string,
  relation: "owner" | "editor" | "viewer",
  resourceType: "document" | "folder",
  resourceId: string
) {
  await fgaClient.write({
    writes: [
      {
        user: \`user:\${userId}\`,
        relation,
        object: \`\${resourceType}:\${resourceId}\`,
      },
    ],
  })
  console.log(\`✅ Granted \${relation} permission to user:\${userId} on \${resourceType}:\${resourceId}\`)
}

/**
 * Remove a user's permission from a resource
 */
async function revokePermission(
  userId: string,
  relation: "owner" | "editor" | "viewer",
  resourceType: "document" | "folder",
  resourceId: string
) {
  await fgaClient.write({
    deletes: [
      {
        user: \`user:\${userId}\`,
        relation,
        object: \`\${resourceType}:\${resourceId}\`,
      },
    ],
  })
  console.log(\`❌ Revoked \${relation} permission from user:\${userId} on \${resourceType}:\${resourceId}\`)
}

/**
 * Check if a user can perform an action on a resource
 */
async function checkAccess(
  userId: string,
  permission: "can_view" | "can_edit" | "can_delete",
  resourceType: "document" | "folder",
  resourceId: string
): Promise<boolean> {
  const { allowed } = await fgaClient.check({
    user: \`user:\${userId}\`,
    relation: permission,
    object: \`\${resourceType}:\${resourceId}\`,
  })
  return allowed
}

/**
 * List all resources a user can access
 */
async function listAccessibleResources(
  userId: string,
  permission: "can_view" | "can_edit",
  resourceType: "document" | "folder"
): Promise<string[]> {
  const { objects } = await fgaClient.listObjects({
    user: \`user:\${userId}\`,
    relation: permission,
    type: resourceType,
  })
  return objects
}

/**
 * Set folder hierarchy (child inherits from parent)
 */
async function setFolderParent(childFolderId: string, parentFolderId: string) {
  await fgaClient.write({
    writes: [
      {
        user: \`folder:\${parentFolderId}\`,
        relation: "parent",
        object: \`folder:\${childFolderId}\`,
      },
    ],
  })
  console.log(\`🗂️  Set folder:\${parentFolderId} as parent of folder:\${childFolderId}\`)
}

/**
 * Move document into folder (inherits permissions)
 */
async function moveDocumentToFolder(documentId: string, folderId: string) {
  await fgaClient.write({
    writes: [
      {
        user: \`folder:\${folderId}\`,
        relation: "parent",
        object: \`document:\${documentId}\`,
      },
    ],
  })
  console.log(\`📄 Moved document:\${documentId} into folder:\${folderId}\`)
}

// 4. Express.js middleware
import express from "express"

function requirePermission(permission: "can_view" | "can_edit" | "can_delete") {
  return async (req: express.Request, res: express.Response, next: express.Function) => {
    const userId = req.user?.id // From auth middleware
    const resourceType = req.params.resourceType as "document" | "folder"
    const resourceId = req.params.resourceId

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    try {
      const allowed = await checkAccess(userId, permission, resourceType, resourceId)

      if (!allowed) {
        return res.status(403).json({
          error: "Forbidden",
          message: \`You do not have \${permission} permission on this resource\`,
        })
      }

      next()
    } catch (error) {
      console.error("OpenFGA authorization error:", error)
      return res.status(500).json({ error: "Authorization check failed" })
    }
  }
}

// 5. Example API routes
const app = express()

// View document
app.get("/api/:resourceType/:resourceId", requirePermission("can_view"), async (req, res) => {
  const { resourceType, resourceId } = req.params
  const resource = await db[resourceType].findById(resourceId)
  res.json(resource)
})

// Edit document
app.put("/api/:resourceType/:resourceId", requirePermission("can_edit"), async (req, res) => {
  const { resourceType, resourceId } = req.params
  const updated = await db[resourceType].update(resourceId, req.body)
  res.json(updated)
})

// Delete document
app.delete("/api/:resourceType/:resourceId", requirePermission("can_delete"), async (req, res) => {
  const { resourceType, resourceId } = req.params
  await db[resourceType].delete(resourceId)
  res.json({ success: true })
})

// Share document with user
app.post("/api/documents/:documentId/share", requirePermission("can_edit"), async (req, res) => {
  const { documentId } = req.params
  const { userId, role } = req.body // role: "owner" | "editor" | "viewer"

  await grantPermission(userId, role, "document", documentId)

  res.json({
    success: true,
    message: \`Shared document with user \${userId} as \${role}\`,
  })
})

// List all documents I can view
app.get("/api/documents", async (req, res) => {
  const userId = req.user?.id

  const documents = await listAccessibleResources(userId, "can_view", "document")

  res.json({ documents })
})

// 6. Example usage scenario
async function exampleScenario() {
  // Create folder hierarchy: /projects -> /projects/2024 -> /projects/2024/q1
  await grantPermission("alice", "owner", "folder", "projects")
  await setFolderParent("projects-2024", "projects")
  await setFolderParent("projects-2024-q1", "projects-2024")

  // Alice creates document in /projects/2024/q1
  await grantPermission("alice", "owner", "document", "roadmap")
  await moveDocumentToFolder("roadmap", "projects-2024-q1")

  // Bob is granted viewer access to /projects (top-level folder)
  await grantPermission("bob", "viewer", "folder", "projects")

  // Check: Can Bob view the roadmap document?
  // YES - because Bob is viewer on /projects, which is inherited through folder hierarchy
  const bobCanView = await checkAccess("bob", "can_view", "document", "roadmap")
  console.log(\`Can Bob view roadmap? \${bobCanView}\`) // true

  // Check: Can Bob edit the roadmap document?
  // NO - Bob only has viewer permission, not editor
  const bobCanEdit = await checkAccess("bob", "can_edit", "document", "roadmap")
  console.log(\`Can Bob edit roadmap? \${bobCanEdit}\`) // false

  // Alice grants Charlie direct editor access to the roadmap
  await grantPermission("charlie", "editor", "document", "roadmap")

  // Check: Can Charlie edit the roadmap?
  // YES - Charlie has direct editor permission
  const charlieCanEdit = await checkAccess("charlie", "can_edit", "document", "roadmap")
  console.log(\`Can Charlie edit roadmap? \${charlieCanEdit}\`) // true

  // List all documents Alice can edit
  const aliceDocuments = await listAccessibleResources("alice", "can_edit", "document")
  console.log(\`Alice can edit: \${aliceDocuments.join(", ")}\`)
}

export {
  grantPermission,
  revokePermission,
  checkAccess,
  listAccessibleResources,
  setFolderParent,
  moveDocumentToFolder,
  requirePermission,
}`,
          caption: "Production-ready OpenFGA implementation with folder hierarchies, permission inheritance, and Express middleware",
        },
        {
          type: "text",
          title: "Choosing the Right Authorization System",
          content: `
## Decision Framework

### Use **Amazon Cedar** when:

✅ Your authorization is primarily **attribute-based** (user roles, resource tags, context)
\`\`\`
Examples:
- "Admins can delete any document"
- "Users can view documents in their department"
- "Require MFA for financial transactions"
- "Block access from non-corporate IPs"
\`\`\`

✅ You're in the **AWS ecosystem** (Cognito, API Gateway, Lambda)

✅ You need **static analysis** of policies (prove security properties)

✅ Simpler deployment (no separate graph database needed)

✅ Policies change frequently; relationships are relatively static

---

### Use **OpenFGA/SpiceDB/Ory Keto** (Zanzibar) when:

✅ Your authorization involves **hierarchical relationships**
\`\`\`
Examples:
- Google Drive-style folder permissions
- GitHub repository/organization structure
- Nested teams and groups
- "Alice is editor because she's in Engineering team, which has editor access to Projects folder"
\`\`\`

✅ You need **transitive relationships** (group contains group contains user)

✅ You need to answer **"who can access X?"** (reverse lookup)

✅ Sharing/collaboration is central to your product

✅ You need proven scale (billions of users, trillions of resources)

---

### Use **Hybrid (Aserto, Permit.io)** when:

✅ You need **both** relationship hierarchies AND attribute-based rules

✅ You want flexibility to use the right tool for each use case

✅ You're willing to manage additional complexity

---

## Real-World Examples

### Scenario 1: SaaS B2B Application (Slack, Notion)

**Requirement:**
- Multi-tenant (organizations)
- Workspaces/channels with nested permissions
- Teams and user groups
- Role-based access (admin, member, guest)

**Best Choice:** **OpenFGA or SpiceDB**

**Why:** Deep organizational hierarchies, team-based sharing, and collaboration patterns match Zanzibar's strengths.

**Model:**
\`\`\`
organization → workspace → channel
user → team → workspace (team members inherit workspace access)
\`\`\`

---

### Scenario 2: Cloud Infrastructure (AWS, Datadog)

**Requirement:**
- Resource-based policies (S3 buckets, EC2 instances)
- Attribute-based access (tags, regions, resource types)
- Conditional policies (IP restrictions, time-based, MFA)

**Best Choice:** **Amazon Cedar**

**Why:** Attribute-rich, policy-driven authorization with analyzability. No deep hierarchies.

**Policy:**
\`\`\`cedar
permit (
  principal in Role::"DataScientist",
  action == Action::"Read",
  resource
) when {
  resource.environment == "development" &&
  context.mfaVerified == true
};
\`\`\`

---

### Scenario 3: Document Management (Google Drive, Dropbox)

**Requirement:**
- Folder hierarchies (inherit permissions)
- Direct sharing (user → document)
- Group sharing (team → folder → documents)
- Public links

**Best Choice:** **OpenFGA or SpiceDB**

**Why:** Classic Zanzibar use case with folder hierarchies and transitive permissions.

**Model:**
\`\`\`
folder → subfolder → document (permissions inherit down)
user → group → folder (group members get folder access)
\`\`\`

---

### Scenario 4: Banking/Financial Application

**Requirement:**
- Strict compliance requirements
- Auditable authorization decisions
- Time-based restrictions
- Transaction amount limits
- Multi-factor authentication for sensitive operations

**Best Choice:** **Amazon Cedar**

**Why:** Analyzability (prove security properties), deterministic evaluation, context-aware policies.

**Policy:**
\`\`\`cedar
forbid (
  principal,
  action == Action::"Transfer",
  resource
) unless {
  context.mfaVerified == true &&
  context.ipAddress in IpRange::"CorporateNetwork" &&
  resource.amount < principal.dailyLimit
};
\`\`\`

---

## Performance Comparison

| System | Check Latency | Throughput | Scale |
|--------|---------------|------------|-------|
| **Cedar (AWS Verified Permissions)** | <5ms | Very High | AWS-scale |
| **OpenFGA** | <10ms | High | Millions of tuples |
| **SpiceDB** | <10ms | Very High | Billions of tuples |
| **Ory Keto** | <20ms | Medium-High | Millions of tuples |

**Note:** Actual performance depends on deployment, query complexity, and data size.

---

## Migration Strategy

### From RBAC to Fine-Grained Authorization

**Phase 1: Parallel Run**
- Keep existing RBAC
- Implement new system (Cedar/OpenFGA) in shadow mode
- Compare decisions, log discrepancies

**Phase 2: Gradual Rollout**
- Start with non-critical resources
- Use feature flags to control % of traffic
- Monitor performance and correctness

**Phase 3: Full Migration**
- Switch all traffic to new system
- Deprecate old RBAC code
- Clean up legacy permissions

---

## Summary Table

| Factor | Cedar | Zanzibar (OpenFGA/SpiceDB) |
|--------|-------|---------------------------|
| **Model** | Policy (ABAC) | Graph (ReBAC) |
| **Learning Curve** | Medium | Steep |
| **Deployment** | Simpler | Complex (graph DB) |
| **Best For** | Attributes, conditions | Hierarchies, relationships |
| **Maturity** | New (2023+) | Proven (2019+) |
| **Ecosystem** | AWS-centric | Vendor-neutral |
| **Reverse Lookup** | ❌ Limited | ✅ Excellent ("who can access?") |
| **Analysis** | ✅ Automated reasoning | ❌ No formal verification |
| **Performance** | Excellent | Excellent |

Choose based on your **authorization patterns**, not just technology preferences. If in doubt, prototype with both!
          `
        }
      ],
      quiz: {
        id: "systems-comparison-quiz",
        title: "Authorization Systems Comparison Quiz",
        description: "Test your knowledge of Cedar, OpenFGA, and modern authorization systems",
        passingScore: 70,
        questions: [
          {
            id: "sys-q1",
            question: "What is the primary difference between Amazon Cedar and OpenFGA's approach to authorization?",
            options: [
              "Cedar is open source while OpenFGA is proprietary",
              "Cedar is policy-driven (ABAC) while OpenFGA is graph-driven (ReBAC)",
              "Cedar is faster than OpenFGA",
              "OpenFGA only works with AWS services"
            ],
            correctAnswer: 1,
            explanation: "Cedar uses a policy-driven approach (ABAC - Attribute-Based Access Control) where authorization rules are expressed as declarative policies. OpenFGA uses a graph-driven approach (ReBAC - Relationship-Based Access Control) where authorization is modeled as relationships in a graph, following Google Zanzibar's design."
          },
          {
            id: "sys-q2",
            question: "Which authorization system would be BEST for a document management system with folder hierarchies and inherited permissions (like Google Drive)?",
            options: [
              "Amazon Cedar - better for hierarchies",
              "OpenFGA/SpiceDB - designed for relationship graphs",
              "OPA (Open Policy Agent)",
              "Simple RBAC roles"
            ],
            correctAnswer: 1,
            explanation: "OpenFGA/SpiceDB are ideal for document management with folder hierarchies because they model authorization as a graph with parent-child relationships. Permissions naturally inherit down the tree (folder → subfolder → document), which is exactly what Zanzibar-inspired systems excel at."
          },
          {
            id: "sys-q3",
            question: "What is a unique advantage of Amazon Cedar compared to Zanzibar-inspired systems?",
            options: [
              "Faster query performance",
              "Better for nested groups",
              "Automated reasoning and policy analysis (can prove security properties)",
              "Supports more programming languages"
            ],
            correctAnswer: 2,
            explanation: "Cedar's standout feature is automated reasoning - it can analyze policies to prove security properties, detect conflicts, and verify that policies behave as intended. This is unique among authorization systems and particularly valuable for compliance-heavy industries like finance and healthcare."
          },
          {
            id: "sys-q4",
            question: "In OpenFGA, what does the 'parent' relation enable in a folder/document model?",
            options: [
              "It allows deleting parent folders",
              "It enables permission inheritance from parent to child resources",
              "It creates a backup of the parent folder",
              "It locks the parent folder"
            ],
            correctAnswer: 1,
            explanation: "The 'parent' relation in OpenFGA enables permission inheritance. For example, 'define can_view: viewer or parent->can_view' means a user can view a document if they're a direct viewer OR if they have can_view permission on the parent folder. This allows permissions to cascade down the hierarchy."
          },
          {
            id: "sys-q5",
            question: "Which statement about Cedar policies is TRUE?",
            options: [
              "Cedar policies are always 'permit' - you cannot forbid access",
              "Cedar policies can include 'when' and 'unless' conditions for context-aware decisions",
              "Cedar requires a separate graph database like SpiceDB",
              "Cedar policies cannot check user attributes"
            ],
            correctAnswer: 1,
            explanation: "Cedar policies support both 'permit' and 'forbid' statements with 'when' and 'unless' conditions. This allows context-aware authorization like 'permit when context.mfaVerified == true' or 'forbid unless context.ipAddress like \"192.168.*\"'. This makes Cedar excellent for attribute-based and conditional access control."
          },
          {
            id: "sys-q6",
            question: "What is the main advantage of OpenFGA's 'listObjects' API compared to just checking individual permissions?",
            options: [
              "It's faster than individual checks",
              "It enables reverse lookup: 'show me ALL documents user Alice can view'",
              "It's required for write operations",
              "It automatically grants permissions"
            ],
            correctAnswer: 1,
            explanation: "The listObjects API enables reverse lookup - instead of asking 'can Alice view document X?', you can ask 'what are ALL documents Alice can view?'. This is essential for features like 'show my documents' or 'list accessible folders'. Cedar doesn't have this capability built-in, which is a key difference from Zanzibar-inspired systems."
          }
        ]
      }
    }
  ]
}
