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
\\\mermaid
Person(alias, "Label", "Description")
Person_Ext(alias, "Label", "Description")
System(alias, "Label", "Description")
System_Ext(alias, "Label", "Description")
SystemDb(alias, "Label", "Description")
\\\

### Containers
\\\mermaid
Container(alias, "Label", "Tech", "Description")
ContainerDb(alias, "Label", "Tech", "Description")
\\\

### Components
\\\mermaid
Component(alias, "Label", "Tech", "Description")
\\\

### Relationships
\\\mermaid
Rel(from, to, "Label", "Tech")
Rel_U(from, to, "Label")
Rel_D(from, to, "Label")
Rel_L(from, to, "Label")
Rel_R(from, to, "Label")
\\\

## Best Practices
1. **Unidirectional Arrows**: Avoid ambiguity.
2. **Action Verbs**: Label relationships (e.g., "Persists to", "Authenticates with").
3. **Tech Labels**: Include protocols/formats (e.g., "JSON/HTTPS").
4. **Limits**: Keep diagrams under 20 elements.
5. **Aliases**: Use descriptive aliases (e.g., \uthService\).
