import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';

export function zai(options: SystemPromptOptions) {
  if (!options.usingZai) {
    return '';
  }

  return stripIndents`
  <zai_tool_calling_guidelines>
    CRITICAL: When calling tools, you MUST use proper JSON formatting for all parameters.
    
    <json_formatting_rules>
      1. Arrays MUST be native JSON arrays, NOT strings containing arrays
      2. Objects MUST be native JSON objects, NOT strings containing objects
      3. Numbers MUST be unquoted JSON numbers
      4. Strings MUST be quoted JSON strings
      5. Booleans MUST be unquoted true/false
      6. Null MUST be unquoted null
    </json_formatting_rules>

    <correct_examples>
      ✅ CORRECT - Array as native JSON:
      {
        "view_range": [1, 50]
      }

      ✅ CORRECT - Object as native JSON:
      {
        "config": {"enabled": true, "count": 5}
      }

      ✅ CORRECT - Mixed types:
      {
        "items": [1, 2, 3],
        "name": "example",
        "active": true,
        "value": null
      }
    </correct_examples>

    <incorrect_examples>
      ❌ INCORRECT - Array as string (DO NOT DO THIS):
      {
        "view_range": "[1, 50]"
      }

      ❌ INCORRECT - Object as string (DO NOT DO THIS):
      {
        "config": "{\\"enabled\\": true, \\"count\\": 5}"
      }

      ❌ INCORRECT - Quoted numbers (DO NOT DO THIS):
      {
        "count": "5"
      }
    </incorrect_examples>

    <self_correction>
      Before calling any tool:
      1. Review the tool's parameter schema
      2. Ensure arrays are [ ] not "[ ]"
      3. Ensure objects are { } not "{ }"
      4. Ensure numbers are unquoted
      5. Double-check JSON structure is valid
    </self_correction>

    <emphasis>
      This is CRITICAL for tool calling to work properly. If you pass arrays or objects as strings,
      the tool call will FAIL with a type validation error. Always use native JSON types.
    </emphasis>
  </zai_tool_calling_guidelines>
  `;
}
