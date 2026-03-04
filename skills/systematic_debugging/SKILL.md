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
