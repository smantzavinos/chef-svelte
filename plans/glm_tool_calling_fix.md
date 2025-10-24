# GLM-4.6 Tool Calling Fix Plan

## Issue Summary

GLM-4.6 is incorrectly formatting tool call parameters, specifically passing arrays as strings instead of actual JSON arrays. This causes validation errors when the model attempts to use tools.

### Example Error

```
Error: Invalid arguments for tool view: Type validation failed:
Value: {"path":"/home/project/src/routes/+page.svelte","view_range":"[1, 50]"}
Error message: [
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "string",
    "path": ["view_range"],
    "message": "Expected array, received string"
  }
]
```

**Expected:** `view_range: [1, 50]`  
**Actual:** `view_range: "[1, 50]"`

## Root Cause Analysis

### Tool Schema Definition

Location: `/chef-agent/tools/view.ts`

```typescript
export const viewParameters = z.object({
  path: z.string().describe('The absolute path to the file to read.'),
  view_range: z.array(z.number()).nullable().describe(viewRangeDescription),
});
```

The schema correctly defines `view_range` as `z.array(z.number()).nullable()`, but GLM-4.6 is outputting it as a string containing an array representation.

### Why This Happens

1. **Model Training:** GLM-4.6 may not have been fine-tuned with as many tool calling examples as OpenAI/Anthropic models
2. **JSON Serialization:** The model appears to be "stringifying" array parameters instead of passing them as native JSON arrays
3. **Schema Interpretation:** The model may be treating the schema description as a formatting guide rather than a strict type requirement

### Current Prompt System

Chef uses provider-specific prompts to guide model behavior:

**File:** `/chef-agent/prompts/system.ts`

```typescript
export function generalSystemPrompt(options: SystemPromptOptions) {
  const result = stripIndents`${GENERAL_SYSTEM_PROMPT_PRELUDE}
  ${openAi(options)}      // OpenAI-specific guidance
  ${google(options)}      // Google-specific guidance
  ${solutionConstraints(options)}
  ${formattingInstructions(options)}
  // ... other prompts
  `;
  return result;
}
```

**File:** `/chef-agent/types.ts`

```typescript
export interface SystemPromptOptions {
  enableBulkEdits: boolean;
  includeTemplate: boolean;
  openaiProxyEnabled: boolean;
  usingOpenAi: boolean; // Flag for OpenAI
  usingGoogle: boolean; // Flag for Google
  resendProxyEnabled: boolean;
  enableResend: boolean;
  // MISSING: usingZai flag
}
```

## Proposed Solution

### Approach: Add ZAI-Specific System Prompt

Similar to how OpenAI and Google have dedicated prompt sections, create a ZAI-specific prompt that explicitly teaches proper tool calling format.

### Benefits of This Approach

1. **Non-invasive:** Doesn't modify tool schemas or core logic
2. **Proven Pattern:** Follows existing OpenAI/Google prompt pattern
3. **Flexible:** Can be refined based on GLM-4.6's behavior
4. **Model-Specific:** Only applies to ZAI without affecting other providers

### Alternative Approaches Considered

**Option A: Modify Tool Schema to Accept Strings**

```typescript
view_range: z.union([z.array(z.number()), z.string().transform((val) => JSON.parse(val))]).nullable();
```

❌ **Rejected:** This is a workaround that masks the real issue and could allow malformed data

**Option B: Post-Process Tool Calls**
Add middleware to convert string arrays to actual arrays before validation
❌ **Rejected:** Adds complexity and may hide other formatting issues

**Option C: Use Different Tool Format**
Switch to simpler tool schemas without complex types
❌ **Rejected:** Limits functionality and doesn't solve the root cause

## Implementation Plan

### Phase 1: Create ZAI-Specific Prompt

**File:** `/chef-agent/prompts/zai.ts` (NEW)

```typescript
import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';

export function zai(options: SystemPromptOptions) {
  if (!options.usingZai) {
    return '';
  }

  return stripIndents`
  <zai_tool_calling_guidelines>
    ## CRITICAL: Proper Tool Call Formatting for GLM Models
    
    When making tool calls, you MUST ensure parameters are valid JSON with correct types:
    
    ### Array Parameters
    - Arrays MUST be actual JSON arrays, NOT strings containing array syntax
    - ✅ CORRECT: {"view_range": [1, 50]}
    - ❌ WRONG: {"view_range": "[1, 50]"}
    - ❌ WRONG: {"view_range": "1, 50"}
    
    ### Common Tool Call Examples
    
    **view tool** - Reading a file with line range:
    \`\`\`json
    {
      "path": "/home/project/src/App.tsx",
      "view_range": [1, 100]
    }
    \`\`\`
    
    **view tool** - Reading entire file:
    \`\`\`json
    {
      "path": "/home/project/src/App.tsx",
      "view_range": null
    }
    \`\`\`
    
    **edit tool** - Editing a file:
    \`\`\`json
    {
      "path": "/home/project/src/App.tsx",
      "old_str": "const foo = 1;",
      "new_str": "const foo = 2;"
    }
    \`\`\`
    
    ### Validation Before Tool Calls
    Before making ANY tool call:
    1. Verify all parameters are properly typed (arrays as [], objects as {}, strings as "", numbers as digits)
    2. Do NOT wrap arrays, objects, or numbers in quotes
    3. Ensure JSON is valid and parseable
    
    ### If You Get a Tool Call Error
    If you receive a "Type validation failed" error:
    1. Check if you wrapped an array in quotes - this is the most common mistake
    2. Review the error message carefully - it tells you exactly what type was expected
    3. Reconstruct the tool call with proper JSON types
    4. Try again with corrected parameters
  </zai_tool_calling_guidelines>
  `;
}
```

### Phase 2: Update Type System

**File:** `/chef-agent/types.ts`

Add to `SystemPromptOptions` interface:

```typescript
export interface SystemPromptOptions {
  enableBulkEdits: boolean;
  includeTemplate: boolean;
  openaiProxyEnabled: boolean;
  usingOpenAi: boolean;
  usingGoogle: boolean;
  usingZai: boolean; // NEW
  resendProxyEnabled: boolean;
  enableResend: boolean;
}
```

### Phase 3: Integrate ZAI Prompt into System Prompt

**File:** `/chef-agent/prompts/system.ts`

```typescript
import { zai } from './zai.js'; // ADD import

export function generalSystemPrompt(options: SystemPromptOptions) {
  const result = stripIndents`${GENERAL_SYSTEM_PROMPT_PRELUDE}
  ${openAi(options)}
  ${google(options)}
  ${zai(options)}  // ADD this line
  ${solutionConstraints(options)}
  ${formattingInstructions(options)}
  ${exampleDataInstructions(options)}
  ${secretsInstructions(options)}
  ${openaiProxyGuidelines(options)}
  ${resendProxyGuidelines(options)}
  ${outputInstructions(options)}
  ${openAi(options)}
  ${google(options)}
  `;
  return result;
}
```

### Phase 4: Enable ZAI Flag in Agent

**File:** `/app/lib/.server/llm/convex-agent.ts`

Update the `opts` object around line 86:

```typescript
const opts: SystemPromptOptions = {
  enableBulkEdits: true,
  includeTemplate: true,
  openaiProxyEnabled: getEnv('OPENAI_PROXY_ENABLED') == '1',
  usingOpenAi: modelProvider == 'OpenAI',
  usingGoogle: modelProvider == 'Google',
  usingZai: modelProvider == 'ZAI', // ADD this line
  resendProxyEnabled: getEnv('RESEND_PROXY_ENABLED') == '1',
  enableResend: featureFlags.enableResend,
};
```

## Expected Outcomes

### Immediate Benefits

1. **Explicit Guidance:** GLM-4.6 receives clear, specific instructions about JSON formatting
2. **Error Prevention:** Multiple examples show correct vs incorrect formats
3. **Self-Correction:** Model can reference guidelines when it receives validation errors
4. **Debugging Aid:** When errors occur, model knows to check for quoted arrays

### Success Metrics

1. ✅ `view` tool calls succeed without type validation errors
2. ✅ `edit` tool calls work correctly
3. ✅ Other tools with complex parameters function properly
4. ✅ Model can self-correct when it makes formatting mistakes

### Potential Limitations

1. **Not a Guarantee:** Prompt engineering can guide but not force correct behavior
2. **May Need Iteration:** Prompt might need refinement based on observed behavior
3. **Model Limitations:** If GLM-4.6 has fundamental tool calling limitations, prompts alone may not fully resolve issues

## Testing Plan

### Test Cases

1. **Basic View Tool**

   - Request: "Show me the contents of src/App.tsx"
   - Expected: `view_range: null` or `view_range: [1, -1]` (as array)

2. **View Tool with Range**

   - Request: "Show me lines 1-50 of src/App.tsx"
   - Expected: `view_range: [1, 50]` (as array, not string)

3. **Edit Tool**

   - Request: "Change the title to 'My App'"
   - Expected: All string parameters properly quoted, no issues

4. **Error Recovery**
   - Force a tool call error
   - Observe if model self-corrects based on guidelines

### Manual Testing Checklist

- [ ] View entire file works
- [ ] View file with line range works
- [ ] Edit file works
- [ ] Multiple tool calls in sequence work
- [ ] Model can recover from validation errors
- [ ] No regression in other functionality

## Rollback Plan

If the ZAI-specific prompt causes issues:

1. **Quick Rollback:** Remove `usingZai: true` from convex-agent.ts
2. **Partial Rollback:** Simplify the ZAI prompt to be less verbose
3. **Alternative:** Add post-processing to convert string arrays (Option B from alternatives)

## Future Enhancements

### Potential Improvements

1. **Tool Call Validator:** Add client-side validation before sending to model
2. **Retry with Correction:** Automatically retry failed tool calls with corrected format
3. **Fine-tuning Examples:** Collect successful tool calls to improve prompt
4. **Model Updates:** Monitor GLM-4.7+ releases for improved tool calling

### Monitoring

Track metrics:

- Tool call success rate by provider
- Types of validation errors by provider
- Self-correction success rate

## Additional Context

### GLM-4.6 Capabilities

From research and the z.ai integration plan:

- **Strong Coding Performance:** Outperforms Claude Sonnet 4 on benchmarks
- **Native Tool Support:** Has tool calling capability built-in
- **Thinking Mode Enabled:** Using `thinking: { type: "enabled" }` in provider config
- **OpenAI Compatible:** Uses OpenAI format, which should support proper tool calling

### Why Tool Calling Matters for Chef

Chef relies heavily on tool calls:

- `view` - Reading files to understand code
- `edit` - Making changes to code
- `deploy` - Deploying the application
- `npmInstall` - Installing dependencies
- `lookupDocs` - Finding documentation

Without reliable tool calling, the model cannot effectively help users build applications.

## References

- **Z.AI Integration Plan:** `/plans/zai_integration.md`
- **Tool Definitions:** `/chef-agent/tools/*.ts`
- **Existing Provider Prompts:** `/chef-agent/prompts/openAi.ts`, `/chef-agent/prompts/google.ts`
- **System Prompt Structure:** `/chef-agent/prompts/system.ts`
- **Agent Implementation:** `/app/lib/.server/llm/convex-agent.ts`

## Conclusion

Adding a ZAI-specific prompt with explicit tool calling guidelines is the most straightforward and maintainable solution. It follows existing patterns in the codebase and provides clear guidance to help GLM-4.6 format tool calls correctly.

The implementation is low-risk and can be quickly refined based on real-world testing results.

---

## Implementation Results (2025-10-24)

### ✅ Implementation Complete

All phases of the implementation plan have been successfully completed:

#### Phase 1: Created ZAI-Specific Prompt ✅

**File:** `/chef-agent/prompts/zai.ts`

- Created comprehensive tool calling guidelines with explicit JSON formatting rules
- Included correct/incorrect examples for arrays, objects, numbers, strings, booleans, and null
- Added self-correction checklist and emphasis on native JSON types
- Structured similarly to existing `openAi.ts` and `google.ts` prompts

**Key Guidelines Included:**

- Arrays must be native JSON `[1, 50]` not strings `"[1, 50]"`
- Objects must be native JSON `{}` not strings `"{}"`
- Numbers must be unquoted
- Self-correction steps before making tool calls
- Error recovery guidance

#### Phase 2: Updated Type System ✅

**File:** `/chef-agent/types.ts`

- Added `usingZai: boolean` to `SystemPromptOptions` interface (line 26)
- Maintains consistency with existing `usingOpenAi` and `usingGoogle` flags

#### Phase 3: Integrated ZAI Prompt ✅

**File:** `/chef-agent/prompts/system.ts`

- Imported `zai` function from `./zai.js`
- Added `${zai(options)}` call in `generalSystemPrompt()` function
- Placed alongside existing `openAi()` and `google()` calls (appears twice in prompt for emphasis, matching existing pattern)

#### Phase 4: Enabled ZAI Flag ✅

**File:** `/app/lib/.server/llm/convex-agent.ts`

- Added `usingZai: modelProvider == 'ZAI'` to opts object (line 91)
- Prompt will now activate when user selects GLM-4.6 model

#### Additional Fix ✅

**File:** `/buildSystemPrompts.ts`

- Added `usingZai: true` to `defaultOptions` for system prompt generation script
- Ensures generated documentation includes ZAI-specific guidelines

### Validation

**TypeScript Compilation:** ✅ PASSED

```bash
pnpm run typecheck
# No errors
```

**Linting:** ✅ PASSED

```bash
pnpm run lint
# No errors in new code (warnings only in unrelated svelte5-mcp and template directories)
```

### Files Modified

1. `/chef-agent/prompts/zai.ts` - NEW FILE (70 lines)
2. `/chef-agent/types.ts` - Added `usingZai` flag
3. `/chef-agent/prompts/system.ts` - Integrated ZAI prompt
4. `/app/lib/.server/llm/convex-agent.ts` - Enabled ZAI flag
5. `/buildSystemPrompts.ts` - Added ZAI flag to defaults

### Next Steps

#### Manual Testing Required

The implementation is complete and code-validated, but **real-world testing** is needed:

1. **Basic View Tool Test**

   - User prompt: "Show me the contents of src/routes/+page.svelte"
   - Expected: Model calls `view` with `view_range: null` or `view_range: [start, end]` as array
   - Monitor: Check for type validation errors in console

2. **View Tool with Range Test**

   - User prompt: "Show me lines 1-50 of src/routes/+page.svelte"
   - Expected: Model calls `view` with `view_range: [1, 50]` (native array, not string)
   - Success criteria: No "Expected array, received string" errors

3. **Edit Tool Test**

   - User prompt: "Change the page title to 'My App'"
   - Expected: Model successfully edits file using correct JSON format
   - Success criteria: Edit completes without validation errors

4. **Error Recovery Test**
   - If a type error occurs, observe whether model self-corrects using guidelines
   - Success criteria: Model recognizes the issue and retries with proper format

#### Expected Behavior

**Before implementation:**

```json
{
  "view_range": "[1, 50]" // ❌ String instead of array
}
```

**After implementation:**

```json
{
  "view_range": [1, 50] // ✅ Native JSON array
}
```

#### Monitoring Recommendations

Track the following metrics after deployment:

- GLM-4.6 tool call success rate
- Type validation error frequency
- Self-correction success rate
- User-reported issues with ZAI provider

#### Potential Refinements

If testing reveals continued issues:

1. **Strengthen Prompt**: Add more examples or stronger emphasis
2. **Thinking Mode Benefit**: GLM-4.6's thinking mode may help with self-correction
3. **Error Message Integration**: Consider showing the ZAI guidelines when validation errors occur
4. **Fallback Handling**: Add retry logic with corrected parameters

### Summary

The ZAI-specific prompt implementation is **complete and validated**. The system now provides explicit JSON formatting guidance to GLM-4.6 when making tool calls, following the same pattern as OpenAI and Google provider-specific prompts.

**Status:** ✅ Ready for testing
**Risk Level:** Low (isolated to ZAI provider, follows existing patterns)
**Rollback:** Simple (set `usingZai: false` or remove from system.ts)
