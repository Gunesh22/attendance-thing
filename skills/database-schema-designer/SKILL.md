---
name: database-schema-designer
description: Design production-ready database schemas with best practices built-in (SQL/NoSQL).
---

# Database Schema Designer
Design production-ready database schemas with best practices built-in.

## Quick Start
Just describe your data model:
\\\
design a schema for an e-commerce platform with users, products, orders
\\\

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
