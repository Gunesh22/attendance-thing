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
- **Use Standard Utils**: Don't write own etry logic (use cockatiel, etc).
- **When to Code Custom**:
  - Specific business logic
  - Performance-critical paths
  - Security-sensitive control

### Architecture & Design
- **Clean Architecture & DDD**:
  - Separate domain entities from infrastructure.
  - Business logic independent of frameworks.
- **Naming**:
  - **AVOID**: utils, helpers, common, shared.
  - **USE**: Domain names (UserAuthenticator, InvoiceGenerator).
- **Separation of Concerns**:
  - No database queries in controllers.
  - No business logic in UI.

## Anti-Patterns
- **NIH Syndrome**: Don't build custom auth; use Auth0/Better-Auth/Supabase.
- **Generic Dumping Grounds**: Avoid utils.js with 50 unrelated functions.
