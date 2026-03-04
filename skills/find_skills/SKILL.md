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
Run 
px skills find [query].
Example:
- "how to make React app faster" -> 
px skills find react performance

### Step 3: Present Options
Present relevant skills:
1. Skill name and description
2. Install command: 
px skills add <package>
3. Link to learn more at skills.sh

### Step 4: Offer to Install
If user agrees, run:

px skills add <owner/repo@skill> -g -y

## Common Categories
- Frameworks (React, Flutter)
- Testing
- Deployment / CI-CD
- Design systems

## When No Skills Are Found
1. Acknowledge no exact match found.
2. Offer to help directly with general capabilities.
3. Suggest creating a skill: 
px skills init my-skill.
