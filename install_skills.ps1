$skills = @{
    "architecture_patterns" = @"
---
name: architecture_patterns
description: Master backend architecture patterns: Clean Architecture, Hexagonal, DDD.
---

# Architecture Patterns

## 1. Clean Architecture (Uncle Bob)
Dependency Rule: **Source code dependencies must point only inward, toward higher-level policies.**
- **Entities**: Core business rules (Enterprise wide).
- **Use Cases**: Application-specific business rules.
- **Interface Adapters**: Controllers, Gateways, Presenters.
- **Frameworks & Drivers**: Database, UI, Web Frameworks (Details).

## 2. Hexagonal Architecture (Ports & Adapters)
- **Core Domain**: Business logic (inside hexagon).
- **Ports**: Interfaces defining interactions (Input/Output).
- **Adapters**: Implementations of ports (db, rest api, etc).
  - *Primary Adapters*: Drive the application (e.g. API Controller).
  - *Secondary Adapters*: Driven by the application (e.g. SQL Repository).

## 3. Domain-Driven Design (DDD)
- **Ubiquitous Language**: Language shared by team and experts.
- **Entities**: Objects defined by identity, not attributes.
- **Value Objects**: Immutable objects defined by attributes.
- **Aggregates**: Cluster of objects treated as a unit for data changes.
- **Repositories**: Abstraction for retrieving aggregates.

## Best Practices
- **Library-First**: Don't reinvent the wheel. Use proven libraries for auth, validation, etc.
- **Naming**: Use domain-specific names ('OrderCalculator'), not generic ones ('utils', 'helpers').
- **Separation**: Keep business logic OUT of controllers and UI.
"@

    "better_auth_best_practices" = @"
---
name: better_auth_best_practices
description: Integration guide for Better Auth, a TypeScript-first, framework-agnostic auth framework.
---

# Better Auth Integration Guide

Better Auth is a TypeScript-first, framework-agnostic auth framework supporting email/password, OAuth, magic links, passkeys, and more via plugins.

## Core Config
- **Environment Variables**:
  - `BETTER_AUTH_SECRET`: Encryption secret (min 32 chars)
  - `BETTER_AUTH_URL`: Base URL
- **File Location**: Look for `auth.ts` in `./lib`, `./utils`, or `./src`.

## Database
- Direct connections: `pg.Pool`, `mysql2`, `better-sqlite3`, `bun:sqlite`
- ORM adapters: `drizzle`, `prisma`, `mongodb`
  - **Critical**: Use adapter model names (e.g., `modelName: "user"`), not table names.

## Session Management
- **Secondary Storage**: Stored here by default if defined.
- **Database**: `session.storeSessionInDatabase: true` to persist.
- **Stateless**: No DB + cookieCache.

## User & Account Config
- User: `user.modelName`, `user.fields` (mapping), `user.additionalFields`.
- Account: `account.modelName`.
- Required: `email` and `name` fields.

## Plugins
Import from `better-auth/plugins/<name>` (tree-shakable), NOT `better-auth/plugins`.
Popular: `twoFactor`, `organization`, `passkey`, `magicLink`, `oauthProvider`.

## Client
Import from `better-auth/client` (vanilla) or framework specific (e.g. `better-auth/react`).
Methods: `signIn`, `signUp`, `useSession`.

## Common Gotchas
1. **Model vs Table Name**: Config uses ORM model name (`user`), not DB table name (`users`).
2. **Schema**: Re-run CLI (`npx @better-auth/cli migrate`) after adding plugins.
3. **Stateless**: If no DB, sessions are only in cookies.

## Resources
- [Docs](https://better-auth.com/docs)
"@

    "find_skills" = @"
---
name: find_skills
description: Helps discover and install skills from the open agent skills ecosystem.
---

# Find Skills

This skill helps you discover and install skills from the open agent skills ecosystem.

## When to Use This Skill
- User asks "how do I do X" where X might be a common task with an existing skill
- User says "find a skill for X" or "is there a skill for X"
- User creates a new empty project and might need standard tools
- User expresses interest in extending capabilities

## How to Help Users Find Skills

### Step 1: Understand What They Need
Identify the domain (React, testing, etc.) and the specific task.

### Step 2: Search for Skills
Run `npx skills find [query]`.
Example:
- "how to make React app faster" -> `npx skills find react performance`

### Step 3: Present Options
Present relevant skills:
1. Skill name and description
2. Install command: `npx skills add <package>`
3. Link to learn more at skills.sh

### Step 4: Offer to Install
If user agrees, run:
`npx skills add <owner/repo@skill> -g -y`

## Common Categories
- Frameworks (React, Flutter)
- Testing
- Deployment / CI-CD
- Design systems

## When No Skills Are Found
1. Acknowledge no exact match found.
2. Offer to help directly with general capabilities.
3. Suggest creating a skill: `npx skills init my-skill`.
"@

    "flutter_expert" = @"
---
name: flutter_expert
description: Senior mobile engineer building high-performance cross-platform applications with Flutter 3 and Dart.
---

# Flutter Expert
Senior mobile engineer building high-performance cross-platform applications with Flutter 3 and Dart.

## Role Definition
You are a senior Flutter developer with 6+ years of experience. You specialize in Flutter 3.19+, Riverpod 2.0, GoRouter, and building apps for iOS, Android, Web, and Desktop. You write performant, maintainable Dart code with proper state management.

## When to Use This Skill
- Building cross-platform Flutter applications
- Implementing state management (Riverpod, Bloc)
- Setting up navigation with GoRouter
- Creating custom widgets and animations
- Optimizing Flutter performance
- Platform-specific implementations

## Core Workflow
1. Setup - Project structure, dependencies, routing
2. State - Riverpod providers or Bloc setup
3. Widgets - Reusable, const-optimized components
4. Test - Widget tests, integration tests
5. Optimize - Profile, reduce rebuilds

## Constraints

### MUST DO
- Use const constructors wherever possible
- Implement proper keys for lists
- Use Consumer/ConsumerWidget for state (not StatefulWidget)
- Follow Material/Cupertino design guidelines
- Profile with DevTools, fix jank
- Test widgets with flutter_test

### MUST NOT DO
- Build widgets inside build() method
- Mutate state directly (always create new instances)
- Use setState for app-wide state
- Skip const on static widgets
- Ignore platform-specific behavior
- Block UI thread with heavy computation (use compute())

## Output Templates
When implementing Flutter features, provide:
1. Widget code with proper const usage
2. Provider/Bloc definitions
3. Route configuration if needed
4. Test file structure

## Knowledge Reference
Flutter 3.19+, Dart 3.3+, Riverpod 2.0, Bloc 8.x, GoRouter, freezed, json_serializable, Dio, flutter_hooks
"@

    "marketing_psychology" = @"
---
name: marketing_psychology
description: Apply psychological principles and mental models to marketing.
---

# Marketing Psychology & Mental Models

Help users understand why people buy, how to influence behavior ethically, and how to make better marketing decisions.

## Foundational Thinking Models
- **First Principles**: Break problems down to basic truths. Ask "why" repeatedly (5 Whys).
- **Jobs to Be Done**: Focus on the outcome customers want, not features. (A drill buyer wants a hole, not a drill).
- **Inversion**: Ask "What would guarantee failure?" and avoid those things.
- **Occam's Razor**: Simplest explanation is usually correct.
- **Pareto Principle (80/20)**: Focus on the 20% of efforts that drive 80% of results.
- **Second-Order Thinking**: Consider effects of effects. (Flash sales boost revenue but retrain customers to wait for discounts).

## Pricing Psychology
- **Charm Pricing**: Left-digit effect ($9.99 vs $10.00).
- **Anchoring**: First price seen sets the context.
- **Decoy Effect**: A third option makes one of the other two look better.

## Persuasion
- **Reciprocity**: Give value first to get value back.
- **Social Proof**: People follow the crowd (testimonials, "bestseller").
- **Scarcity/Urgency**: FOMO drives action.

## Task-Specific Questions
1. What specific behavior are you trying to influence?
2. What does your customer believe before encountering your marketing?
3. What is currently preventing the desired action?
"@

    "mcp_builder" = @"
---
name: mcp_builder
description: Guide for building high-quality MCP servers.
---

# MCP Builder

Create MCP (Model Context Protocol) servers that enable LLMs to interact with external services.

## High-Level Workflow

### Phase 1: Planning
- **API Coverage**: Balance comprehensive coverage with specialized workflow tools.
- **Tool Naming**: specific and consistent (e.g. `github_create_issue`).
- **Stack**: TypeScript (recommended) or Python.

### Phase 2: Implementation
- **Tools**:
  - Use Zod (TS) / Pydantic (Python) for schemas.
  - Clear descriptions for tools and arguments are CRITICAL for agent performance.
  - Return structured data where possible.
- **Error Handling**: actionable error messages.

### Phase 3: Review & Test
- **MCP Inspector**: Use `npx @modelcontextprotocol/inspector` to test.
- **Checklist**:
  - Full type coverage?
  - Clear tool descriptions?
  - Actionable errors?

### Phase 4: Evaluation
- Create 10 complex, realistic questions to test if an agent can use your server effectively.
- Questions should often require multiple tool calls.

## Reference
- TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Python SDK: https://github.com/modelcontextprotocol/python-sdk
"@

    "mobile_android_design" = @"
---
name: mobile_android_design
description: Master Material Design 3 and Jetpack Compose to build modern, adaptive Android applications.
---

# Android Mobile Design

Master Material Design 3 (Material You) and Jetpack Compose to build modern, adaptive Android applications that integrate seamlessly with the Android ecosystem.

## When to Use This Skill
- Designing Android app interfaces following Material Design 3
- Building Jetpack Compose UI and layouts
- Implementing Android navigation patterns (Navigation Compose)
- Creating adaptive layouts for phones, tablets, and foldables
- Using Material 3 theming with dynamic colors
- Building accessible Android interfaces

## Core Concepts

### 1. Material Design 3 Principles
- **Personalization**: Dynamic color adapts UI to user's wallpaper
- **Accessibility**: Tonal palettes ensure sufficient color contrast
- **Large Screens**: Responsive layouts for tablets and foldables

### 2. Jetpack Compose Layout System
Use `Column` and `Row` for arrangements.
```kotlin
// Vertical arrangement
Column(
    modifier = Modifier.padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp)
) {
    Text(text = "Title", style = MaterialTheme.typography.headlineSmall)
}
```

## Best Practices
1. **Use Material Theme**: Access colors via `MaterialTheme.colorScheme`
2. **Support Dynamic Color**: Enable dynamic color on Android 12+
3. **Adaptive Layouts**: Use `WindowSizeClass`
4. **Touch Targets**: Minimum 48dp
5. **State Hoisting**: Hoist state to make components reusable

## Common Issues
- **Recomposition**: Avoid unstable lambdas
- **State Loss**: Use `rememberSaveable`
- **Performance**: Use `LazyColumn` for lists

## Resources
- [Material Design 3](https://m3.material.io/)
- [Jetpack Compose Documentation](https://developer.android.com/jetpack/compose)
"@

    "software_architecture" = @"
---
name: software_architecture
description: Guidance for quality-focused software development based on Clean Architecture and DDD.
---

# Software Architecture

## Code Style & General Principles
- **Early Returns**: Use early returns to reduce nesting.
- **Decomposition**: Split long functions (>80 lines) and files (>200 lines).
- **Arrow Functions**: Prefer arrow functions in JS/TS.

## Best Practices

### Library-First Approach
- **Search First**: Check npm/libraries before writing custom code.
- **Use Standard Utils**: Don't write own `retry` logic (use `cockatiel`, etc).
- **When to Code Custom**:
  - Specific business logic
  - Performance-critical paths
  - Security-sensitive control

### Architecture & Design
- **Clean Architecture & DDD**:
  - Separate domain entities from infrastructure.
  - Business logic independent of frameworks.
- **Naming**:
  - **AVOID**: `utils`, `helpers`, `common`, `shared`.
  - **USE**: Domain names (`UserAuthenticator`, `InvoiceGenerator`).
- **Separation of Concerns**:
  - No database queries in controllers.
  - No business logic in UI.

## Anti-Patterns
- **NIH Syndrome**: Don't build custom auth; use Auth0/Better-Auth/Supabase.
- **Generic Dumping Grounds**: Avoid `utils.js` with 50 unrelated functions.
"@

    "systematic_debugging" = @"
---
name: systematic_debugging
description: A systematic approach to debugging that prioritizes root cause analysis over random fixes.
---

# Systematic Debugging

**The Iron Law**: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

## The Four Phases

### Phase 1: Root Cause Investigation
1. **Read Error Messages**: Don't skip them. Note line numbers and error codes.
2. **Reproduce Consistently**: precise steps to trigger the bug.
3. **Check Recent Changes**: Git diff, new dependencies.
4. **Gather Evidence**: Log data entry/exit at component boundaries.

### Phase 2: Pattern Analysis
- **Find Working Examples**: Similar code that isn't broken?
- **Identify Differences**: List every difference between working/broken.

### Phase 3: Hypothesis and Testing
1. **Form Hypothesis**: "I think X is the root cause because Y".
2. **Test Minimally**: Change ONE variable at a time to test hypothesis.
3. **Verify**: Did it work? If not, form NEW hypothesis.

### Phase 4: Implementation
1. **Fail First**: Create a failing test case (reproduction).
2. **Implement Fix**: Address root cause. ONE change at a time.
3. **Verify Fix**: Ensure test passes and no regressions.

## Red Flags - STOP AND THINK
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "I don't fully understand but this might work"
- 3+ failed fix attempts -> **Question Architecture** instead of trying fix #4.
"@

    "seo-aeo-best-practices" = @"
---
name: seo-aeo-best-practices
description: SEO and AEO (Answer Engine Optimization) best practices including EEAT principles, structured data, and technical SEO. Use when implementing metadata, sitemaps, structured data, or optimizing content for search engines and AI assistants.
license: MIT
metadata:
  author: sanity
  version: "1.0.0"
---

# SEO & AEO Best Practices

Principles for optimizing content for both traditional search engines (SEO) and AI-powered answer engines (AEO). Includes Google's EEAT guidelines and structured data implementation.

## When to Apply

Reference these guidelines when:
- Implementing metadata and Open Graph tags
- Creating sitemaps and robots.txt
- Adding JSON-LD structured data
- Optimizing content for featured snippets
- Preparing content for AI assistants (ChatGPT, Perplexity, etc.)
- Evaluating content quality using EEAT principles

## Core Concepts

### SEO (Search Engine Optimization)
Optimizing content to rank well in traditional search results (Google, Bing).

### AEO (Answer Engine Optimization)
Optimizing content to be selected as authoritative answers by AI systems.

### EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)
Google's framework for evaluating content quality.

## Resources

See resources/ for detailed guidance:
- EEAT implementation
- Structured data patterns
- Technical SEO checklist
- AI/AEO considerations
"@

    "seo-keyword-strategist" = @"
---
name: seo-keyword-strategist
description: Analyzes keyword usage in provided content, calculates density, suggests semantic variations and LSI keywords based on the topic. Prevents over-optimization. Use PROACTIVELY for content optimization.
metadata:
  model: haiku
---

## Use this skill when

- Working on seo keyword strategist tasks or workflows
- Needing guidance, best practices, or checklists for seo keyword strategist

## Do not use this skill when

- The task is unrelated to seo keyword strategist
- You need a different domain or tool outside this scope

## Instructions

- Clarify goals, constraints, and required inputs.
- Apply relevant best practices and validate outcomes.
- Provide actionable steps and verification.
- If detailed examples are required, open resources/implementation-playbook.md.

You are a keyword strategist analyzing content for semantic optimization opportunities.

## Focus Areas

- Primary/secondary keyword identification
- Keyword density calculation and optimization
- Entity and topical relevance analysis
- LSI keyword generation from content
- Semantic variation suggestions
- Natural language patterns
- Over-optimization detection

## Keyword Density Guidelines

**Best Practice Recommendations:**
- Primary keyword: 0.5-1.5% density
- Avoid keyword stuffing
- Natural placement throughout content
- Entity co-occurrence patterns
- Semantic variations for diversity

## Entity Analysis Framework

1. Identify primary entity relationships
2. Map related entities and concepts
3. Analyze competitor entity usage
4. Build topical authority signals
5. Create entity-rich content sections

## Approach

1. Extract current keyword usage from provided content
2. Calculate keyword density percentages
3. Identify entities and related concepts in text
4. Determine likely search intent from content type
5. Generate LSI keywords based on topic
6. Suggest optimal keyword distribution
7. Flag over-optimization issues

## Output

**Keyword Strategy Package:**
```
Primary: [keyword] (0.8% density, 12 uses)
Secondary: [keywords] (3-5 targets)
LSI Keywords: [20-30 semantic variations]
Entities: [related concepts to include]
```

**Deliverables:**
- Keyword density analysis
- Entity and concept mapping
- LSI keyword suggestions (20-30)
- Search intent assessment
- Content optimization checklist
- Keyword placement recommendations
- Over-optimization warnings

**Advanced Recommendations:**
- Question-based keywords for PAA
- Voice search optimization terms
- Featured snippet opportunities
- Keyword clustering for topic hubs

**Platform Integration:**
- WordPress: Integration with SEO plugins
- Static sites: Frontmatter keyword schema

Focus on natural keyword integration and semantic relevance. Build topical depth through related concepts.
"@

    "google-official-seo-guide" = @"
---
name: google-official-seo-guide
description: Official Google SEO guide covering search optimization, structured data, technical SEO, and best practices.
---

# Google Official SEO Guide

## When to Use This Skill
This skill should be triggered when users ask about:

### SEO & Search Optimization
- Improving website ranking in Google Search
- Implementing SEO best practices
- Optimizing meta tags, titles, and descriptions
- Fixing crawling or indexing issues
- Understanding how Google Search works

### Structured Data & Rich Results
- Adding VideoObject, BroadcastEvent, or Clip structured data
- Implementing schema.org markup for rich results
- Creating sitemaps and robots.txt files
- Setting up breadcrumb navigation
- Configuring hreflang for multi-language sites

### Technical SEO
- Mobile-first indexing optimization
- JavaScript SEO and rendering issues
- Managing duplicate content with canonical tags
- Configuring robots meta tags
- URL structure and internal linking

### Search Console & Monitoring
- Using Google Search Console reports
- Debugging search visibility issues
- Monitoring crawl errors and indexing status
- Analyzing search performance metrics

### Content & Links
- Writing effective anchor text
- Internal and external linking strategies
- Avoiding spam policies violations
- Managing site migrations and redirects

## Key Concepts

### The Three Stages of Google Search
1. Crawling: Googlebot discovers and fetches pages from the web
2. Indexing: Google analyzes page content and stores it in the index
3. Serving: Google returns relevant results for user queries

### Important SEO Principles
- Mobile-First Indexing: Google primarily uses the mobile version of content for indexing and ranking
- Canonical URLs: Specify the preferred version of duplicate or similar pages
- Structured Data: Use schema.org markup to help Google understand your content
- Search Essentials: Technical, content, and spam requirements for Google Search eligibility

### Common Structured Data Types
- VideoObject: For video content and features
- BroadcastEvent: For livestream videos (LIVE badge)
- Clip: For video key moments/timestamps
- SeekToAction: For auto-detected key moments in videos

## Quick Reference

### Example 1: Basic VideoObject Structured Data
```json
{ "@context": "https://schema.org", "@type": "VideoObject", "name": "Video title", "description": "Video description", "thumbnailUrl": [ "https://example.com/photos/1x1/photo.jpg", "https://example.com/photos/4x3/photo.jpg", "https://example.com/photos/16x9/photo.jpg" ], "uploadDate": "2024-03-31T08:00:00+08:00", "duration": "PT1M54S", "contentUrl": "https://example.com/video.mp4", "embedUrl": "https://example.com/embed/123" }
```
Use this for: Adding basic video metadata to help Google understand and display your videos in search results.

### Example 2: LIVE Badge with BroadcastEvent
```json
{ "@context": "https://schema.org", "@type": "VideoObject", "name": "Livestream title", "uploadDate": "2024-10-27T14:00:00+00:00", "publication": { "@type": "BroadcastEvent", "isLiveBroadcast": true, "startDate": "2024-10-27T14:00:00+00:00", "endDate": "2024-10-27T14:37:14+00:00" } }
```
Use this for: Enabling the LIVE badge on livestream videos in Google Search results.

### Example 3: Video Key Moments with Clip
```json
{ "@context": "https://schema.org", "@type": "VideoObject", "name": "Cat video", "hasPart": [ { "@type": "Clip", "name": "Cat jumps", "startOffset": 30, "endOffset": 45, "url": "https://example.com/video?t=30" }, { "@type": "Clip", "name": "Cat misses the fence", "startOffset": 111, "endOffset": 150, "url": "https://example.com/video?t=111" } ] }
```
Use this for: Manually specifying important timestamps/chapters in your video for the key moments feature.

### Example 5: Crawlable Links
```html
<!-- Recommended: Google can crawl these --> <a href="https://example.com">Link text</a> <a href="/products/category/shoes">Link text</a> <a href="./products/category/shoes">Link text</a> <!-- Not recommended: May not be crawled --> <a routerLink="products/category">Link text</a> <a onclick="goto('https://example.com')">Link text</a> <span href="https://example.com">Link text</span>
```
Use this for: Ensuring your links are discoverable and crawlable by Googlebot.

### Example 7: robots meta tags
```html
<!-- Don't index this page --> <meta name="robots" content="noindex"> <!-- Don't follow links on this page --> <meta name="robots" content="nofollow"> <!-- Don't index and don't follow --> <meta name="robots" content="noindex, nofollow"> <!-- Don't show snippet in search results --> <meta name="robots" content="nosnippet">
```
Use this for: Controlling how Google crawls and indexes specific pages.

## Working with This Skill

### For Beginners
Start with fundamentals to understand:
- How Google Search works (crawling → indexing → serving)
- Basic SEO principles
- Search Essentials requirements

### For Web Developers
Priority reading:
1. fundamentals: Understand the technical foundation
2. crawling: Optimize Googlebot access and crawl efficiency
3. indexing: Implement proper meta tags and redirects
4. specialty: Add structured data for rich features

## Common Pitfalls to Avoid

### Spam Policy Violations
- ❌ Keyword stuffing in content or meta tags
- ❌ Hidden text or links
- ❌ Buying/selling links for ranking
- ❌ Cloaking (showing different content to Google vs users)

### Mobile-First Indexing Issues
- ❌ Different content on mobile vs desktop
- ❌ Blocking resources on mobile
- ❌ Missing structured data on mobile

### Structured Data Mistakes
- ❌ Using unsupported formats or properties
- ❌ Missing required fields
- ❌ Different URLs in mobile vs desktop markup

## Tips & Best Practices

### SEO Fundamentals
1. Create unique, descriptive titles and meta descriptions for each page
2. Use meaningful heading structure (H1, H2, H3)
3. Optimize images with descriptive alt text
4. Ensure fast page load times (especially on mobile)
5. Build a logical site structure with clear navigation

### Technical SEO
1. Submit and maintain an XML sitemap
2. Use robots.txt appropriately (crawl control, not indexing control)
3. Implement canonical tags for duplicate content
4. Use HTTPS for security
5. Ensure mobile-friendliness (responsive design recommended)

### Content Strategy
1. Focus on creating helpful, people-first content
2. Match user intent with your content
3. Keep content fresh and up-to-date
4. Use natural language, avoid keyword stuffing
5. Build internal links with descriptive anchor text
"@

    "critical-thinking-logical-reasoning" = @"
---
name: critical-thinking-logical-reasoning
description: Guidelines to examine information, arguments, and claims using logic and reasoning, providing clear, actionable critique.
---

The following guidelines help you think critically and perform logical reasoning.
Your role is to examine information, arguments, and claims using logic and reasoning, then provide clear, actionable critique.
One of your goals is to avoid signal dilution, context collapse, quality degradation and degraded reasoning for future agent or human understanding of the meeting by ensuring you keep the signal to noise ratio high and that domain insights are preserved.
When analysing content:
1. Understand the argument first - Can you state it in a way the speaker would agree with? If not, you are not ready to critique.
2. Identify the core claim(s) - What is actually being asserted? Separate conclusions from supporting points.
3. Examine the evidence - Is it sufficient? Relevant? From credible sources?
4. Spot logical issues - Look for fallacies, unsupported leaps, circular reasoning, false dichotomies, appeals to authority/emotion, hasty generalisations. Note: empirical claims need evidence; normative claims need justified principles; definitional claims need consistency.
5. Surface hidden assumptions - What must be true for this argument to hold?
6. Consider what is missing - Alternative explanations, contradictory evidence, unstated limitations.
7. Assess internal consistency - Does the argument contradict itself?
8. Consider burden of proof - Who needs to prove what? Is the evidence proportional to the claim's significance?
Structure your response as:

## Summary
One sentence stating the core claim and your overall assessment of its strength.

## Key Issues
Bullet the most significant problems, each with a brief explanation of why it matters. Where an argument is weak, briefly note how it could be strengthened - this distinguishes fixable flaws from fundamental problems. If there are no problems, omit this section.

## Questions to Probe
2-5 questions that would clarify ambiguity, test key assumptions, or reveal whether the argument holds under scrutiny. Frame as questions a decision-maker should ask before acting on this reasoning.

## Bottom Line
One-two sentence summary and actionable takeaway.
Guidelines:
- Assume individuals have good intentions by default; at worst, people may be misinformed or mistaken in their reasoning. Be charitable but rigorous in your critique.
- Prioritise issues that genuinely affect the conclusion over minor technical flaws. Your purpose is to inform well-reasoned decisions, not to manufacture disagreement or nitpick.
- Be direct. State problems plainly without hedging.
- Critique the argument, not the person making it.
- Critique the reasoning and logic. Do not fact-check empirical claims unless they are obviously implausible or internally contradictory.
- Apply the 'so what' test: even if you identify a flaw, consider whether it materially affects the practical decision or conclusion at hand.
- Acknowledge uncertainty in your own analysis. Flag where your critique depends on assumptions or where you lack domain context.
- Distinguish between 'flawed' and 'wrong' - weak reasoning does not automatically mean false conclusions.
- If the argument is sound, say so. Do not manufacture criticism.
- Provide concise output, no fluff.
- Always use Australian English spelling.
"@

    "section-logic-polisher" = @"
---
name: section-logic-polisher
description: Polish section logic ensuring clear thesis and strong argument bridges.
---

# Section Logic Polisher (thesis + argument bridges)
Purpose: close the main "paper feel" gap that remains even when a subsection is long and citation-dense:
- missing/weak thesis (paragraph 1 never commits to a claim)
- weak inter-paragraph flow (paragraph islands; no content-bearing bridges)
This is a local, per-H3 polish step that happens after drafting and before merging.

## What this skill blocks on (and what it does not)
Blocking (must fix):
- paragraph 1 lacks an explicit thesis / takeaway (a content claim)
Non-blocking (diagnostic only):
- connector word counts (e.g., "moreover/however/therefore"). Counts are a proxy for paragraph islands, but forcing them as a quota often creates "generator cadence" (paragraph-initial adverbs). Treat these stats as signals, not goals.

## Role prompt: Logic Editor (argument flow)
\`\`\`
You are the logic editor for one survey subsection. Your job is to make the subsection read like a single argument: - paragraph 1 commits to a clear thesis (content claim) - each paragraph has an explicit logical relation to the previous one - bridges are content-bearing (contrast/causal/implication), not slide narration Constraints: - do not add new citations - do not change citation keys - do not invent facts Editing lens: - if a paragraph does not advance the argument (claim/contrast/eval/limitation), compress or delete it - if a transition is empty, rewrite it as a content-bearing bridge
\`\`\`

## Inputs
- sections/ (expects H3 body files like S<sec>_<sub>.md)
- outline/subsection_briefs.jsonl (use thesis + paragraph_plan[].connector_phrase as intent)
- Optional: outline/writer_context_packs.jsonl (preferred; has trimmed anchors/comparisons + must_use)

## Outputs
- output/SECTION_LOGIC_REPORT.md (PASS/FAIL for thesis; connector stats shown for diagnosis)

Manual / LLM-first (in place):
- Update the H3 body files under sections/ (e.g., sections/S<sec>_<sub>.md) to fix thesis/bridges (no new citations; keep keys stable)

## Workflow (self-loop)
1. Run the checker script to surface the exact failing files.
2. For each failing H3 file:
   - Work on the concrete H3 body file (pattern): sections/S<sec>_<sub>.md
   - Use outline/subsection_briefs.jsonl as the source of truth for the subsection thesis and paragraph-plan intent.
   - If available, prefer outline/writer_context_packs.jsonl to stay aligned with must_use anchors/constraints (no new cites).

   **Thesis (blocking)**
   - Make paragraph 1 end with a conclusion-first thesis sentence.
   - Prefer a content claim, not meta narration. Avoid repetitive openers like This subsection argues/surveys ....
   - Minimal shape (3 sentences; paraphrase, don’t copy):
     - claim / tension
     - why it matters (protocol/evaluation relevance)
     - how the subsection will resolve it (what contrasts/anchors it will use)

   **Flow (fix only when needed)**
   - Add 1–2 short bridges where paragraphs feel disconnected.
   - Prefer subject-first sentences and mid-sentence glue (because/while/which) over paragraph-start adverbs.
   - Avoid PPT navigation (Next, we ..., We now turn to ...).

3. Rerun the checker until output/SECTION_LOGIC_REPORT.md is PASS, then proceed to transition-weaver and section-merger.

## Examples

### Thesis signal (paragraph 1)
Bad (topic setup only):
- Tool interfaces vary across agent systems, and many recent works explore different designs.

Better (conclusion-first claim):
- A central tension in tool interfaces is balancing expressivity with verifiability; as a result, interface contracts often determine which evaluation claims transfer across environments.

Bad (meta narration):
- This subsection argues that memory is important for agents.

Better (content claim):
- Memory designs trade off retrieval reliability against write-time contamination, and this trade-off shows up as distinct failure modes under fixed evaluation protocols.

### Bridges (avoid paragraph islands)
Bad (no relation):
- X does ... (para 2)
- Y does ... (para 3)

Better (explicit tie):
- Whereas X optimizes for <axis>, Y shifts the bottleneck to <axis>; under fixed budgets, this changes whether the reported gains reflect better planning or simply more expensive search.

## Done criteria
- output/SECTION_LOGIC_REPORT.md shows - Status: PASS
- No section file contains placeholders (TODO/…/...) or outline meta markers (Intent:/RQ:/Evidence needs:)
- Every H3 has a clear paragraph-1 thesis; bridges are added only where flow is actually broken
"@

    "context7" = @"
---
name: context7
description: Retrieve current documentation for software libraries and components by querying the Context7 API.
---

# Context7

## Overview
This skill enables retrieval of current documentation for software libraries and components by querying the Context7 API via curl. Use it instead of relying on potentially outdated training data.

## Workflow

### Step 1: Search for the Library
To find the Context7 library ID, query the search endpoint:

\`\`\`bash
curl -s "https://context7.com/api/v2/libs/search?libraryName=LIBRARY_NAME&query=TOPIC" | jq '.results[0]'
\`\`\`

Parameters:
- libraryName (required): The library name to search for (e.g., "react", "nextjs", "fastapi", "axios")
- query (required): A description of the topic for relevance ranking

Response fields:
- id: Library identifier for the context endpoint (e.g., /websites/react_dev_reference)
- title: Human-readable library name
- description: Brief description of the library
- totalSnippets: Number of documentation snippets available

### Step 2: Fetch Documentation
To retrieve documentation, use the library ID from step 1:

\`\`\`bash
curl -s "https://context7.com/api/v2/context?libraryId=LIBRARY_ID&query=TOPIC&type=txt"
\`\`\`

Parameters:
- libraryId (required): The library ID from search results
- query (required): The specific topic to retrieve documentation for
- type (optional): Response format - json (default) or txt (plain text, more readable)

## Examples

### React hooks documentation
\`\`\`bash
# Find React library ID
curl -s "https://context7.com/api/v2/libs/search?libraryName=react&query=hooks" | jq '.results[0].id'
# Returns: "/websites/react_dev_reference"

# Fetch useState documentation
curl -s "https://context7.com/api/v2/context?libraryId=/websites/react_dev_reference&query=useState&type=txt"
\`\`\`

### Next.js routing documentation
\`\`\`bash
# Find Next.js library ID
curl -s "https://context7.com/api/v2/libs/search?libraryName=nextjs&query=routing" | jq '.results[0].id'

# Fetch app router documentation
curl -s "https://context7.com/api/v2/context?libraryId=/vercel/next.js&query=app+router&type=txt"
\`\`\`

### FastAPI dependency injection
\`\`\`bash
# Find FastAPI library ID
curl -s "https://context7.com/api/v2/libs/search?libraryName=fastapi&query=dependencies" | jq '.results[0].id'

# Fetch dependency injection documentation
curl -s "https://context7.com/api/v2/context?libraryId=/fastapi/fastapi&query=dependency+injection&type=txt"
\`\`\`

## Tips
- Use type=txt for more readable output
- Use jq to filter and format JSON responses
- Be specific with the query parameter to improve relevance ranking
- If the first search result is not correct, check additional results in the array
- URL-encode query parameters containing spaces (use + or %20)
- No API key is required for basic usage (rate-limited)
"@

    "interaction-design" = @"
---
name: interaction-design
description: Create engaging, intuitive interactions through motion, feedback, and thoughtful state transitions that enhance usability.
---

# Interaction Design
Create engaging, intuitive interactions through motion, feedback, and thoughtful state transitions that enhance usability and delight users.

## When to Use This Skill
- Adding microinteractions to enhance user feedback
- Implementing smooth page and component transitions
- Designing loading states and skeleton screens
- Creating gesture-based interactions
- Building notification and toast systems
- Implementing drag-and-drop interfaces
- Adding scroll-triggered animations
- Designing hover and focus states

## Core Principles

### 1. Purposeful Motion
Motion should communicate, not decorate:
- Feedback: Confirm user actions occurred
- Orientation: Show where elements come from/go to
- Focus: Direct attention to important changes
- Continuity: Maintain context during transitions

### 3. Easing Functions
\`\`\`css
/* Common easings */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Decelerate - entering */
--ease-in: cubic-bezier(0.55, 0, 1, 0.45); /* Accelerate - exiting */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* Both - moving between */
--spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot - playful */
\`\`\`

## Quick Start: Button Microinteraction
\`\`\`jsx
import { motion } from "framer-motion";

export function InteractiveButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      {children}
    </motion.button>
  );
}
\`\`\`

## Interaction Patterns

### 1. Loading States
Skeleton Screens: Preserve layout while loading
\`\`\`jsx
function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg" />
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
\`\`\`

### 2. State Transitions
Toggle with smooth transition:
\`\`\`jsx
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={\` relative w-12 h-6 rounded-full transition-colors duration-200 \${checked ? "bg-blue-600" : "bg-gray-300"} \`}
    >
      <motion.span
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
\`\`\`

### 3. Page Transitions
Framer Motion layout animations:
\`\`\`jsx
import { AnimatePresence, motion } from "framer-motion";

function PageTransition({ children, key }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
\`\`\`

## Best Practices
1. Performance First: Use transform and opacity for smooth 60fps
2. Reduce Motion Support: Always respect prefers-reduced-motion
3. Consistent Timing: Use a timing scale across the app
4. Natural Physics: Prefer spring animations over linear
5. Interruptible: Allow users to cancel long animations
6. Progressive Enhancement: Work without JS animations
7. Test on Devices: Performance varies significantly
"@

    "database-schema-designer" = @"
---
name: database-schema-designer
description: Design production-ready database schemas with best practices built-in (SQL/NoSQL).
---

# Database Schema Designer
Design production-ready database schemas with best practices built-in.

## Quick Start
Just describe your data model:
\`\`\`
design a schema for an e-commerce platform with users, products, orders
\`\`\`

## Process Overview
1.  **Analysis**: Identify entities, relationships, access patterns, and choose SQL/NoSQL.
2.  **Design**: Normalize (3NF for SQL), define keys, types, and constraints.
3.  **Optimize**: Plan indexing, consideration denormalization, add timestamps.
4.  **Migrate**: Generate migration scripts, ensure backward compatibility.

## Verification Checklist
After designing a schema:
-  Every table has a primary key
-  All relationships have foreign key constraints
-  ON DELETE strategy defined for each FK
-  Indexes exist on all foreign keys
-  Indexes exist on frequently queried columns
-  Appropriate data types (DECIMAL for money, etc.)
-  NOT NULL on required fields
-  UNIQUE constraints where needed
-  CHECK constraints for validation
-  created_at and updated_at timestamps
-  Migration scripts are reversible
-  Tested on staging with production data

## Normal Forms & Best Practices

### 1st Normal Form (1NF)
Avoid multiple values in a column. Use separate tables.

### 2nd Normal Form (2NF)
Eliminate partial dependencies. All non-key attributes must depend on the full primary key.

### 3rd Normal Form (3NF)
Eliminate transitive dependencies. Non-key attributes should not depend on other non-key attributes.

### Common Patterns
- **Money**: ALWAYS use DECIMAL(10, 2), NEVER FLOAT.
- **Boolean**: is_active BOOLEAN DEFAULT TRUE (PostgreSQL) or TINYINT(1) (MySQL).
- **Dates**: store in UTC TIMESTAMP.
- **Indexes**: Index FKs and frequently queried columns. Use composite indexes with most selective column first.

### Polygot Persistence
- **SQL**: Relational data, complex queries, transactions (Users, Orders, Billing).
- **NoSQL**: High write throughput, flexible schema, massive scale (Logs, Analytics, Content, Sessions).
"@

    "responsive-design" = @"
---
name: responsive-design
description: Master modern responsive design techniques (Container Queries, Fluid Typography, Grid/Flexbox) for all screen sizes.
---

# Responsive Design
Master modern responsive design techniques to create interfaces that adapt seamlessly across all screen sizes and device contexts.

## Core Capabilities

### 1. Container Queries
- Component-level responsiveness independent of viewport
- Container query units (cqi, cqw, cqh)
- Style queries for conditional styling

### 2. Fluid Typography & Spacing
- CSS clamp() for fluid scaling
- Viewport-relative units (vw, vh, dvh)
- Fluid type scales with min/max bounds

### 3. Layout Patterns
- CSS Grid for 2D layouts
- Flexbox for 1D distribution
- Intrinsic layouts (content-based sizing)

### 4. Breakpoint Strategy
- Mobile-first media queries
- Content-based breakpoints

## Modern Breakpoint Scale
\`\`\`css
/* Mobile-first breakpoints */
/* Base: Mobile (< 640px) */
@media (min-width: 640px) { /* sm: Landscape phones, small tablets */ }
@media (min-width: 768px) { /* md: Tablets */ }
@media (min-width: 1024px) { /* lg: Laptops, small desktops */ }
@media (min-width: 1280px) { /* xl: Desktops */ }
@media (min-width: 1536px) { /* 2xl: Large desktops */ }
\`\`\`

## Key Patterns

### Pattern 1: Container Queries
\`\`\`css
.card-container { container-type: inline-size; container-name: card; }
@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: 200px 1fr; gap: 1rem; }
}
.card-title { font-size: clamp(1rem, 5cqi, 2rem); }
\`\`\`

### Pattern 2: Fluid Typography
\`\`\`css
:root {
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-xl: clamp(1.25rem, 1rem + 1.25vw, 1.5rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
}
\`\`\`

### Pattern 3: CSS Grid Responsive Layout
\`\`\`css
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
}
\`\`\`

### Pattern 5: Responsive Images
\`\`\`jsx
function ResponsiveHero() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet="/hero-wide.webp" type="image/webp" />
      <source media="(min-width: 768px)" srcSet="/hero-medium.webp" type="image/webp" />
      <img src="/hero-mobile.jpg" alt="Hero" className="w-full h-auto" />
    </picture>
  );
}
\`\`\`

## Best Practices
1. **Mobile-First**: Start with mobile styles, enhance for larger screens.
2. **Content Breakpoints**: Set breakpoints based on content, not devices.
3. **Fluid Over Fixed**: Use fluid values for typography and spacing.
4. **Container Queries**: Use for component-level responsiveness.
5. **Touch Targets**: Maintain 44x44px minimum on mobile.
"@

    "design-md" = @"
---
name: design-md
description: Synthesize a 'Semantic Design System' into a DESIGN.md file to serve as a source of truth for UI generation.
---

# Stitch DESIGN.md Skill
You are an expert Design Systems Lead. Your goal is to analyze the provided technical assets and synthesize a "Semantic Design System" into a file named DESIGN.md.

## The Goal
The DESIGN.md file will serve as the "source of truth" for prompting Stitch (or other agents) to generate new screens that align perfectly with the existing design language.

## Analysis & Synthesis Instructions

### 1. Extract Project Identity (JSON)
- Locate the Project Title and specific Project ID.

### 2. Define the Atmosphere (Image/HTML)
Evaluate the screenshot and HTML structure to capture the overall "vibe." Use evocative adjectives (e.g., "Airy," "Dense," "Minimalist").

### 3. Map the Color Palette
Identify key colors. For each, provide:
- Descriptive Name (e.g., "Deep Muted Teal-Navy")
- Hex Code (e.g., "#294056")
- Functional Role (e.g., "Primary Action")

### 4. Translate Geometry & Shape
Convert technical values to physical descriptions:
- \`rounded-full\` -> "Pill-shaped"
- \`rounded-lg\` -> "Subtly rounded corners"

### 5. Describe Depth & Elevation
Explain layers and shadows (e.g., "Flat," "Whisper-soft diffused shadows").

## Output Format (DESIGN.md Structure)
\`\`\`markdown
# Design System: [Project Title]
**Project ID:** [Insert Project ID Here]

## 1. Visual Theme & Atmosphere
(Description of the mood, density, and aesthetic philosophy.)

## 2. Color Palette & Roles
(List colors by Descriptive Name + Hex Code + Functional Role.)

## 3. Typography Rules
(Description of font family, weight usage for headers vs. body, and letter-spacing character.)

## 4. Component Stylings
* **Buttons:** (Shape description, color assignment, behavior).
* **Cards/Containers:** (Corner roundness description, background color, shadow depth).
* **Inputs/Forms:** (Stroke style, background).

## 5. Layout Principles
(Description of whitespace strategy, margins, and grid alignment.)
\`\`\`

## Best Practices
- **Be Descriptive**: Use "Ocean-deep Cerulean" instead of just "blue".
- **Be Functional**: Explain *why* an element is used.
- **Be Precise**: Include exact hex codes.
"@

    "comprehensive-app-design" = @"
---
name: comprehensive-app-design
description: A meta-skill that orchestrates context7, interaction-design, database-schema-designer, responsive-design, and design-md to build comprehensive applications.
---

# Comprehensive App Design Orchestrator

## Overview
This skill guides you through using a suite of specialized skills to design and build high-quality applications. It combines valid documentation retrieval, database design, visual design system creation, responsive layout implementation, and interaction design.

## Workflow

### Phase 1: Foundation & Data (database-schema-designer)
1.  **Define the Data Model**: Use `database-schema-designer` patterns to create a robust schema.
    -   *Prompting*: "Design a schema for [app description] dealing with [entities]."
    -   *Check*: Ensure 3NF, proper indexing, and correct data types (DECIMAL for money).

### Phase 2: Design Language (design-md)
1.  **Establish the Design System**: Use `design-md` complexity to create a `DESIGN.md` file.
    -   *Action*: Analyze existing assets or define a new system.
    -   *Output*: Create `DESIGN.md` with Visual Theme, Color Palette, Typography, Component Styling, and Layout Principles.
    -   *Usage*: Reference this file in all future UI generation prompts.

### Phase 3: Technical Context (context7)
1.  **Fetch Latest Docs**: Use `context7` to get the most recent documentation for your chosen stack.
    -   *Action*: Search for and fetch docs for your framework (e.g., Next.js, React, Tailwind).
    -   *Example*: \`curl -s "https://context7.com/api/v2/context?libraryId=..."\`
    -   *Goal*: Ensure you are using valid, up-to-date syntax and features.

### Phase 4: Component Implementation (responsive-design)
1.  **Build Responsive Components**: Apply `responsive-design` patterns.
    -   *Core*: Use Container Queries for components, Fluid Typography for text, and Mobile-First breakpoints.
    -   *Check*: Verify layouts work on mobile, tablet, and desktop using the defined breakpoint scale.

### Phase 5: Interaction & Polish (interaction-design)
1.  **Add Life to UI**: infuse `interaction-design` principles.
    -   *Action*: Add purposeful motion, loading states (skeletons), and microinteractions (hover/tap).
    -   *Tool*: Use Framer Motion or CSS transitions as per the skill guide.

## Unified Prompt
To trigger this workflow for a user request:

> "I will now proceed with the Comprehensive App Design workflow.
> 1. **Database**: I will design the schema for your data needs.
> 2. **Design System**: I will establish the `DESIGN.md` based on your preferences.
> 3. **Documentation**: I will fetch the latest docs for our stack using Context7 to ensure code validity.
> 4. **Implementation**: I will build responsive, mobile-first components.
> 5. **Interactions**: I will add polish with smooth interactions.
>
> **Please provide input**:
> - What is the core functionality of your app?
> - Do you have a specific design vibe in mind?
> - What is your preferred tech stack?"

If the user usage is unclear, **ask for clarification** on which specific aspect (Data, Design, or Logic) they want to focus on first.
"@

    "ui-ux-expert" = @"
---
name: ui-ux-expert
description: Expert guidance on UI/UX design including User-Centered Design, Accessibility (WCAG 2.2), Design Systems, and Responsive Design.
---

## 1. Overview
You are an elite UI/UX designer with deep expertise in:
- User-Centered Design: User research, personas, journey mapping, usability testing
- Accessibility: WCAG 2.2 AA/AAA compliance, ARIA patterns, screen readers, keyboard navigation
- Design Systems: Component libraries, design tokens, pattern documentation, Figma
- Responsive Design: Mobile-first, fluid layouts, breakpoints, adaptive interfaces
- Visual Design: Typography, color theory, spacing systems, visual hierarchy
- Prototyping: Figma, interactive prototypes, micro-interactions, animation principles
- Design Thinking: Ideation, wireframing, user flows, information architecture
- Usability: Heuristic evaluation, A/B testing, analytics integration, user feedback
You design interfaces that are:
- Accessible: WCAG 2.2 compliant, inclusive, universally usable
- User-Friendly: Intuitive navigation, clear information architecture
- Consistent: Design system-driven, predictable patterns
- Responsive: Mobile-first, adaptive across all devices
- Performant: Optimized assets, fast load times, smooth interactions
Risk Level: LOW
- Focus areas: Design quality, accessibility compliance, usability issues
- Impact: Poor UX affects user satisfaction, accessibility violations may have legal implications
- Mitigation: Follow WCAG 2.2 guidelines, conduct usability testing, iterate based on user feedback

## 2. Core Principles
1. TDD First: Write component tests before implementation to validate accessibility, responsive behavior, and user interactions
2. Performance Aware: Optimize for Core Web Vitals (LCP, FID, CLS), lazy load images, minimize layout shifts
3. User-Centered Design: Research-driven decisions validated through usability testing
4. Accessibility Excellence: WCAG 2.2 Level AA compliance as baseline
5. Design System Thinking: Consistent, reusable components with design tokens
6. Mobile-First Responsive: Start with mobile, scale up progressively
7. Iterative Improvement: Test early, test often, iterate based on feedback

## 5. Core Responsibilities

### 1. User-Centered Design Approach
You will prioritize user needs in all design decisions:
- Conduct user research to understand pain points and goals
- Create user personas based on real data and research
- Map user journeys to identify friction points
- Design interfaces that align with mental models
- Validate designs through usability testing
- Iterate based on user feedback and analytics
- Apply design thinking methodologies

### 2. Accessibility First
You will ensure all designs are accessible:
- Meet WCAG 2.2 Level AA compliance (AAA when possible)
- Design with keyboard navigation in mind
- Ensure sufficient color contrast (4.5:1 for text)
- Provide text alternatives for all non-text content
- Create logical focus order and tab sequences
- Use semantic HTML and ARIA when needed
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Support assistive technologies

### 3. Design System Excellence
You will create and maintain scalable design systems:
- Define design tokens (colors, spacing, typography)
- Create reusable component libraries
- Document patterns and usage guidelines
- Ensure consistency across all touchpoints
- Version control design assets
- Collaborate with developers on implementation
- Build in Figma with proper component structure

### 4. Responsive & Mobile-First Design
You will design for all screen sizes:
- Start with mobile layouts, scale up to desktop
- Define breakpoints based on content, not devices
- Use fluid typography and spacing
- Design touch-friendly interfaces (44x44px minimum)
- Optimize for different orientations
- Consider context of use for different devices
- Test across multiple screen sizes

### 5. Visual Design Principles
You will apply strong visual design:
- Establish clear visual hierarchy
- Use typography effectively (scale, weight, line height)
- Apply color purposefully with accessible palettes
- Create consistent spacing systems (4px or 8px grid)
- Use white space to improve readability
- Design for scannability with proper chunking
- Apply gestalt principles for grouping

## 5. Accessibility Standards (WCAG 2.2)

### 5.1 Core WCAG 2.2 Principles (POUR)
Perceivable: Information must be presentable to users in ways they can perceive.
- Provide text alternatives for non-text content
- Provide captions and transcripts for media
- Make content adaptable to different presentations
- Ensure sufficient color contrast (4.5:1 for text, 3:1 for large text)
Operable: User interface components must be operable.
- Make all functionality keyboard accessible
- Give users enough time to read and use content
- Don't design content that causes seizures
- Provide ways to help users navigate and find content
- Make target sizes at least 44x44px (WCAG 2.2)
Understandable: Information and operation must be understandable.
- Make text readable and understandable
- Make content appear and operate in predictable ways
- Help users avoid and correct mistakes
- Provide clear error messages and recovery paths
Robust: Content must be robust enough for assistive technologies.
- Maximize compatibility with current and future tools
- Use valid, semantic HTML
- Implement ARIA correctly (don't over-use)

### 5.2 Critical Accessibility Requirements
Color Contrast (WCAG 2.2 Level AA):
```
Text Contrast: - Normal text (< 24px): 4.5:1 minimum - Large text (≥ 24px): 3:1 minimum - UI components: 3:1 minimum Examples: ✅ #000000 on #FFFFFF (21:1) - Excellent ✅ #595959 on #FFFFFF (7:1) - Good ✅ #767676 on #FFFFFF (4.6:1) - Passes AA ❌ #959595 on #FFFFFF (3.9:1) - Fails AA Tools: - WebAIM Contrast Checker - Stark plugin for Figma - Chrome DevTools Accessibility Panel
```

Keyboard Navigation:
- All interactive elements must be reachable via Tab
- Logical tab order following visual order
- Visible focus indicators (3px outline minimum)
- Skip links to bypass repetitive content
- No keyboard traps
- Support Escape to close modals/menus

Screen Reader Support:
```html
<!-- Semantic HTML --> <nav>, <main>, <article>, <aside>, <header>, <footer> <!-- ARIA Landmarks when semantic HTML isn't possible --> role="navigation", role="main", role="search" <!-- ARIA Labels --> <button aria-label="Close dialog">×</button> <!-- ARIA Live Regions --> <div aria-live="polite" aria-atomic="true"> Changes announced to screen readers </div> <!-- ARIA States --> <button aria-pressed="true">Active</button> <div aria-expanded="false">Collapsed</div>
```

Form Accessibility:
```html
<!-- Label Association --> <label for="email">Email Address *</label> <input id="email" type="email" required> <!-- Error Handling --> <input id="email" type="email" aria-invalid="true" aria-describedby="email-error" > <span id="email-error" role="alert"> Please enter a valid email address </span> <!-- Fieldset for Radio Groups --> <fieldset> <legend>Shipping Method</legend> <input type="radio" id="standard" name="shipping"> <label for="standard">Standard</label> </fieldset>
```

## 13. Critical Reminders

### Design Process
- Start with research, not assumptions - validate with real users
- Create user personas based on actual user data
- Map user journeys to identify pain points and opportunities
- Sketch multiple concepts before committing to high-fidelity
- Test early and often with real users
- Iterate based on feedback and analytics
- Document design decisions and rationale

### Accessibility
- WCAG 2.2 Level AA is the minimum standard
- Test with keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Use actual screen readers (NVDA, JAWS, VoiceOver)
- Color contrast: 4.5:1 for text, 3:1 for UI components
- Touch targets: 44x44px minimum for all interactive elements
- Provide text alternatives for all non-text content
- Use semantic HTML before reaching for ARIA
- Focus indicators must be clearly visible (3px minimum)
"@

    "sqlite-database-expert" = @"
---
name: sqlite-database-expert
description: Expert on SQLite embedded database development, secure SQL patterns, optimization, and migrations.
---

# SQLite Database Expert

## 0. Mandatory Reading Protocol
CRITICAL: Before implementing ANY database operation, you MUST read the relevant reference files.

## 1. Overview
Risk Level: MEDIUM
Justification: SQLite databases in desktop applications handle user data locally, present SQL injection risks if queries aren't properly parameterized, and require careful migration management to prevent data loss.
You are an expert in SQLite embedded database development, specializing in:
- Secure SQL patterns with parameterized queries to prevent SQL injection
- Database migrations with version control and rollback capabilities
- Full-Text Search (FTS5) for efficient text searching
- Performance optimization including indexing, WAL mode, and connection management
- Rust/Tauri integration using rusqlite and sea-query

### Core Principles
1. TDD First - Write tests before implementation; use in-memory SQLite for fast test execution
2. Performance Aware - Optimize with WAL mode, prepared statements, batch operations, and proper indexing
3. Security First - Always use parameterized queries; never concatenate user input
4. Transaction Safety - Wrap related operations in transactions for atomicity
5. Migration Discipline - Version all schema changes with rollback capability

### Primary Use Cases
- Local data persistence for desktop applications
- Offline-first application data storage
- Full-text search implementation
- Configuration and settings storage
- Cache and temporary data management

## 2. Core Responsibilities

### 2.1 Security-First Database Operations
1. ALWAYS use parameterized queries - Never concatenate user input into SQL strings
2. Validate all inputs before database operations
3. Implement proper error handling without exposing database internals
4. Use transactions for data integrity
5. Apply principle of least privilege for database access

### 2.2 Data Integrity Principles
1. Schema versioning with migration tracking
2. Foreign key enforcement with PRAGMA foreign_keys = ON
3. Constraint validation at database level
4. Backup strategies before destructive operations

## 5. Security Standards

### 5.1 Key Vulnerabilities
Mitigation: Update to SQLite 3.44.0+ and always use parameterized queries.

### 5.3 SQL Injection Prevention
Critical Rules:
1. NEVER use string formatting for SQL queries
2. ALWAYS use ? positional or :name named parameters
3. Whitelist column/table names for dynamic queries

## 7.1 Performance Patterns

### Pattern 1: WAL Mode
```sql
-- Good: Enable WAL for concurrent read/write
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000; -- 64MB
```

### Pattern 2: Batch Inserts
Use \`executemany\` or transactions for batch operations. Avoid committing per row.

### Pattern 3: Connection Pooling
Reuse connections.

### Pattern 4: Index Optimization
Use covering and partial indexes where appropriate.

### Pattern 5: VACUUM Scheduling
Run VACUUM during idle times or when freelist count is high.
"@

    "testing-expert" = @"
---
name: testing-expert
description: Expert in testing strategies for React, Next.js, and NestJS applications. Covers unit, integration, and E2E testing.
---

# Testing Expert Skill
Expert in testing strategies for React, Next.js, and NestJS applications.

## When to Use This Skill
- Writing unit tests
- Creating integration tests
- Setting up E2E tests
- Testing React components
- Testing API endpoints
- Testing database operations
- Setting up test infrastructure
- Reviewing test coverage

## Project Context Discovery
1. Scan Documentation: Check .agent/SYSTEM/ARCHITECTURE.md for testing architecture
2. Identify Tools: Jest/Vitest, React Testing Library, Supertest, Playwright/Cypress
3. Discover Patterns: Review existing test files, utilities, mocking patterns
4. Use Project-Specific Skills: Check for [project]-testing-expert skill

## Core Testing Principles

### Testing Pyramid
- Unit Tests (70%): Fast, isolated, test individual functions/components
- Integration Tests (20%): Test component interactions
- E2E Tests (10%): Test full user flows

### Coverage Targets
- Line coverage: > 80%
- Branch coverage: > 75%
- Function coverage: > 85%
- Critical paths: 100%

## Test Quality (AAA Pattern)
```typescript
it('should return users filtered by organization', async () => {
  // Arrange: Set up test data
  const organizationId = 'org1';
  const expectedUsers = [{ organization: organizationId }];
  // Act: Execute the code being tested
  const result = await service.findAll(organizationId);
  // Assert: Verify the result
  expect(result).toEqual(expectedUsers);
});
```

## Good Tests Are
- Independent (no test dependencies)
- Fast (< 100ms each)
- Repeatable (same result every time)
- Meaningful (test real behavior)
- Maintainable (easy to update)

## Testing Best Practices Summary
1. Test Isolation: Each test independent, clean up after
2. Meaningful Tests: Test behavior, not implementation
3. Mocking Strategy: Mock external dependencies, not what you're testing
4. Test Data: Use factories, keep data minimal, clean up
5. Coverage: High coverage, focus on critical paths
"@

    "c4-architecture" = @"
---
name: c4-architecture
description: Generate software architecture documentation using C4 model diagrams in Mermaid syntax.
---

# C4 Architecture Documentation
Generate software architecture documentation using C4 model diagrams in Mermaid syntax.

## Workflow
1. Understand scope - Determine which C4 level(s) are needed.
2. Analyze codebase - Identify components, containers, and relationships.
3. Generate diagrams - Create Mermaid C4 diagrams.
4. Document - Write diagrams to markdown files with context.

## C4 Diagram Levels
- **System Context (Level 1)**: Big picture. User <-> System relationships.
- **Container Diagram (Level 2)**: High-level tech choices. Deployable units (SPA, API, DB).
- **Component Diagram (Level 3)**: Internals. Controllers, Services, Repositories.
- **Dynamic Diagram**: Runtime flow (e.g., Request -> Service -> DB).

## Syntax Reference (Mermaid C4)

### People and Systems
\`\`\`mermaid
Person(alias, "Label", "Description")
Person_Ext(alias, "Label", "Description")
System(alias, "Label", "Description")
System_Ext(alias, "Label", "Description")
SystemDb(alias, "Label", "Description")
\`\`\`

### Containers
\`\`\`mermaid
Container(alias, "Label", "Tech", "Description")
ContainerDb(alias, "Label", "Tech", "Description")
\`\`\`

### Components
\`\`\`mermaid
Component(alias, "Label", "Tech", "Description")
\`\`\`

### Relationships
\`\`\`mermaid
Rel(from, to, "Label", "Tech")
Rel_U(from, to, "Label")
Rel_D(from, to, "Label")
Rel_L(from, to, "Label")
Rel_R(from, to, "Label")
\`\`\`

## Best Practices
1. **Unidirectional Arrows**: Avoid ambiguity.
2. **Action Verbs**: Label relationships (e.g., "Persists to", "Authenticates with").
3. **Tech Labels**: Include protocols/formats (e.g., "JSON/HTTPS").
4. **Limits**: Keep diagrams under 20 elements.
5. **Aliases**: Use descriptive aliases (e.g., \`authService\`).
"@

    "using-superpowers" = @"
---
name: using-superpowers
description: A mandatory skill for using other skills effectively. Forces the agent to check if a skill applies before responding.
---

# using-superpowers

## The Rule
Invoke relevant or requested skills BEFORE any response or action. Even a 1% chance a skill might apply means that you should invoke the skill to check.

## Skill Priority
1. **Process skills first** (brainstorming, debugging) - these determine HOW to approach the task.
2. **Implementation skills second** (frontend-design, mcp-builder) - these guide execution.

## Flow
1. **User message received**: Analyze the request.
2. **Might any skill apply?**: 
   - YES (even 1%): **Invoke Skill tool**.
   - NO: Respond normally.
3. **Announce**: "Using [skill] to [purpose]".
4. **Has checklist?**:
   - YES: Create Todo/Write todo per item.
   - NO: Follow skill exactly.
5. **Follow skill exactly**: Stick to the instructions.

## Red Flags
- Rationalizing not using a skill.
- Skipping steps in a rigid skill.
"@

    "domain-name-brainstormer" = @"
---
name: domain-name-brainstormer
description: Brainstorm available domain names for projects, checking availability and suggesting creative alternatives.
---

# Domain Name Brainstormer
This skill helps you find the perfect domain name for your project by generating creative options and checking what's actually available to register.

## When to Use This Skill
- Starting a new project or company
- Launching a product or service
- Creating a personal brand or portfolio site
- Rebranding an existing project

## What This Skill Does
1. **Understands Your Project**: Analyzes what you're building and who it's for.
2. **Generates Creative Names**: Creates relevant, memorable domain options.
3. **Checks Availability**: Verifies which domains are actually available (simulated).
4. **Multiple Extensions**: Suggests .com, .io, .dev, .ai, .app, and more.
5. **Provides Alternatives**: Offers variations if top choices are taken.

## How to Use
- **Basic**: "Help me brainstorm domain names for a personal finance app"
- **Specific**: "I need a domain name for my AI writing assistant. Prefer short names with .ai or .io extension."
- **Keywords**: "Suggest domain names using the words 'pixel' or 'studio'"

## Top TLDs
- **.com**: Universal, trusted.
- **.io**: Tech startups, dev tools.
- **.dev**: Developer-focused.
- **.ai**: AI/ML products.
- **.app**: Mobile/web apps.
"@

    "feedback-mastery" = @"
---
name: feedback-mastery
description: Frameworks for navigating difficult workplace conversations and delivering effective feedback (SBI Model).
---

# Feedback Mastery
This skill provides frameworks for navigating difficult workplace conversations and delivering effective feedback.

## When to Use This Skill
- Preparing to give feedback to a colleague or direct report.
- Addressing performance issues or missed expectations.
- Navigating conflict between team members.
- Having 1:1 conversations about sensitive topics.

## Core Framework: SBI Model
**Situation-Behavior-Impact (SBI)** structures feedback to be specific, objective, and actionable.

1. **Situation**: Describe the specific context (when/where).
   - "During Tuesday's code review..."
2. **Behavior**: Describe the observable behavior (what happened).
   - "...you provided detailed comments on security vulnerabilities..."
3. **Impact**: Describe the result of the behavior (why it matters).
   - "...which saved the team hours of debugging later."

## The 3-Step Delivery Formula
1. **Open with neutrality and intent**: "I'd like to talk about..."
2. **Present the issue using facts, not blame**: Use SBI.
3. **Encourage dialogue and solutions**: "What are your thoughts?"

## Preparation Checklist
- [ ] Understand the specific issue.
- [ ] Have concrete examples (SBI).
- [ ] Define the goal of the conversation.
- [ ] Manage your emotions (calm, neutral).
- [ ] Consider their perspective.
"@

    "production_engineering" = @"
---
name: production_engineering
description: Production-grade engineering thinking, focusing on constraint-based UI, explicit state modeling, edge-case handling, and failure-first development.
---

# Production Engineering & Thinking

This skill provides a comprehensive guide to moving from "building apps" to "engineering production-grade systems". It focuses on preventing breakage through system-level reasoning.

## 🧠 Core Production Mindset

The difference between a hobbyist and a top-tier engineer is not just knowing how to build, but knowing **how to prevent breakage**.

### The 5-Question Antigravity Check
Before shipping *any* screen or feature, answer these:
1. **What if screen is smaller?** (Constraint-based layout)
2. **What if data is empty?** (Empty states)
3. **What if API fails?** (Error states)
4. **What if user taps twice?** (Idempotency)
5. **What if app resumes mid-flow?** (Lifecycle persistence)

If you can answer all 5, the feature is production-ready.

---

## 1️⃣ UI: Constraint-First Layout Thinking

**Rule of Thumb:** If it *can* resize, it *WILL* resize.

**Stop thinking:** "I want this button here."
**Start thinking:** "What happens if screen = small / text = big / keyboard opens?"

### Core Concepts to Internalize
- **Flexible vs Expanded**: Know the precise difference in column/row flexing.
- **LayoutBuilder**: Build responsive logic based on available constraints.
- **MediaQuery**: Adapt to device size and orientation.
- **SafeArea**: Respect device notches and system UI.
- **Scroll-First**: almost everything should be scrollable by default to handle overflow.

---

## 2️⃣ Logic: State & Flow Mapping

**Problem:** "Sometimes logic is missing, AI guesses wrong."
**Solution:** AI cannot guess business rules. You must **Enumerate States Explicitly**.

Before coding, write the state table:
```
STATE A → user not logged in
STATE B → loading
STATE C → success
STATE D → error
STATE E → empty data
```

**Prompting Strategy:**
> "Implement UI + logic for these 5 states: [List States]"

---

## 3️⃣ Edge-Case Thinking (Failure Modes)

Happy paths are easy. Real engineering handles the failures.

**Ask:** "How can this screen fail?"
- No internet / Slow network
- Empty API response
- Keyboard pushes UI up (overflow)
- Device rotation
- Double-tap interactions (logic duplication)
- App killed and resumed

---

## 4️⃣ Specification Writing (AI Collaboration)

To get "Elite" results from AI, provide "System-Focussed" prompts, not "Output-Focussed" ones.

❌ **Weak Prompt:** "Build a login screen"
✅ **Elite Prompt:**
> "Build a login screen with:
> - loading state
> - disabled button during request
> - error handling
> - keyboard-safe layout
> - retry logic"

---

## 🧩 Missing Skills Checklist

### UI & Layout
- Responsive Layout Engineering
- Constraint-Based UI Design
- Overflow & Resize Handling
- Keyboard-Safe UI Design
- Scroll-First Screen Architecture

### Logic & State
- Explicit State Modeling
- State-Driven UI Rendering
- Async Flow Control
- Idempotent Action Handling

### Quality & Stability
- Happy Path vs Failure Path Separation
- User Stress Testing (Big/Small text/screens)
- Regression Awareness

---

## 🏷️ The "One-Liner" for Excellence
**"Production-Grade UI & Logic Design (Edge-Case & State-Driven Development)"**
"@
}





$skillsDir = Join-Path $PWD "skills"

if (!(Test-Path -Path $skillsDir)) {
    New-Item -ItemType Directory -Path $skillsDir | Out-Null
    Write-Host "Created base skills directory: $skillsDir" -ForegroundColor Green
}

foreach ($skillName in $skills.Keys) {
    $skillPath = Join-Path $skillsDir $skillName
    if (!(Test-Path -Path $skillPath)) {
        New-Item -ItemType Directory -Path $skillPath | Out-Null
    }
    
    $filePath = Join-Path $skillPath "SKILL.md"
    $skills[$skillName] | Set-Content -Path $filePath -Encoding UTF8
    Write-Host "Installed skill: $skillName" -ForegroundColor Cyan
}

Write-Host "`nAll skills installed successfully!" -ForegroundColor Green
Write-Host "You can now copy this script to any project and run '.\install_skills.ps1' to setup your environment." -ForegroundColor Yellow
