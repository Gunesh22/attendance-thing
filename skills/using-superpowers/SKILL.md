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
