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
