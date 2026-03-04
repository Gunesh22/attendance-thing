---
name: mcp_builder
description: Guide for building high-quality MCP servers.
---

# MCP Builder

Create MCP (Model Context Protocol) servers that enable LLMs to interact with external services.

## High-Level Workflow

### Phase 1: Planning
- **API Coverage**: Balance comprehensive coverage with specialized workflow tools.
- **Tool Naming**: specific and consistent (e.g. github_create_issue).
- **Stack**: TypeScript (recommended) or Python.

### Phase 2: Implementation
- **Tools**:
  - Use Zod (TS) / Pydantic (Python) for schemas.
  - Clear descriptions for tools and arguments are CRITICAL for agent performance.
  - Return structured data where possible.
- **Error Handling**: actionable error messages.

### Phase 3: Review & Test
- **MCP Inspector**: Use 
px @modelcontextprotocol/inspector to test.
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
