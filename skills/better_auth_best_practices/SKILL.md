---
name: better_auth_best_practices
description: Integration guide for Better Auth, a TypeScript-first, framework-agnostic auth framework.
---

# Better Auth Integration Guide

Better Auth is a TypeScript-first, framework-agnostic auth framework supporting email/password, OAuth, magic links, passkeys, and more via plugins.

## Core Config
- **Environment Variables**:
  - BETTER_AUTH_SECRET: Encryption secret (min 32 chars)
  - BETTER_AUTH_URL: Base URL
- **File Location**: Look for uth.ts in ./lib, ./utils, or ./src.

## Database
- Direct connections: pg.Pool, mysql2, etter-sqlite3, un:sqlite
- ORM adapters: drizzle, prisma, mongodb
  - **Critical**: Use adapter model names (e.g., modelName: "user"), not table names.

## Session Management
- **Secondary Storage**: Stored here by default if defined.
- **Database**: session.storeSessionInDatabase: true to persist.
- **Stateless**: No DB + cookieCache.

## User & Account Config
- User: user.modelName, user.fields (mapping), user.additionalFields.
- Account: ccount.modelName.
- Required: email and 
ame fields.

## Plugins
Import from etter-auth/plugins/<name> (tree-shakable), NOT etter-auth/plugins.
Popular: 	woFactor, organization, passkey, magicLink, oauthProvider.

## Client
Import from etter-auth/client (vanilla) or framework specific (e.g. etter-auth/react).
Methods: signIn, signUp, useSession.

## Common Gotchas
1. **Model vs Table Name**: Config uses ORM model name (user), not DB table name (users).
2. **Schema**: Re-run CLI (
px @better-auth/cli migrate) after adding plugins.
3. **Stateless**: If no DB, sessions are only in cookies.

## Resources
- [Docs](https://better-auth.com/docs)
