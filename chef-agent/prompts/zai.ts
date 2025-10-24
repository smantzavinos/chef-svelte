import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';

export function zai(options: SystemPromptOptions) {
  if (!options.usingZai) {
    return '';
  }

  return stripIndents`
  <zai_guidelines>
    <available_tools>
      CRITICAL: The ONLY tools available for function calls are:
      - deploy
      - view
      - edit
      - npmInstall
      - lookupDocs
      - addEnvironmentVariables
      - getConvexDeploymentName

      IMPORTANT: <boltArtifact> and <boltAction> are NOT tools. They are XML-like tags that you write
      in your TEXT response to create files. DO NOT try to call them as functions.

      Example of CORRECT usage (in your text response):
      <boltArtifact id="todo-app" title="Todo App">
        <boltAction type="file" filePath="src/App.tsx">
          // your code here
        </boltAction>
      </boltArtifact>

      Example of INCORRECT usage:
      ❌ Calling boltArtifact as a tool (DO NOT DO THIS)
      ❌ Calling boltAction as a tool (DO NOT DO THIS)
    </available_tools>

    <tool_call_json_formatting>
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
        1. Verify the tool name is in the available tools list above
        2. Review the tool's parameter schema
        3. Ensure arrays are [ ] not "[ ]"
        4. Ensure objects are { } not "{ }"
        5. Ensure numbers are unquoted
        6. Double-check JSON structure is valid
      </self_correction>

      <emphasis>
        This is CRITICAL for tool calling to work properly. If you pass arrays or objects as strings,
        the tool call will FAIL with a type validation error. Always use native JSON types.
      </emphasis>
    </tool_call_json_formatting>
  </zai_guidelines>
  `;
}
