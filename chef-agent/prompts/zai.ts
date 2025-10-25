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
        ULTRA CRITICAL - READ THIS CAREFULLY:

        When you write tool call parameters, you are writing RAW JSON, not a string representation of JSON.
        
        Think of it this way:
        - You are constructing a JavaScript object literal
        - NOT writing JSON inside a string
        - NOT serializing or stringifying values
        
        1. ALL parameters in the schema MUST be included in your tool call, even if nullable
        
        2. Arrays - Write them as ACTUAL arrays:
           ✅ CORRECT: [1, 50]           (raw array)
           ❌ WRONG:   "[1, 50]"         (string containing array syntax)
           ❌ WRONG:   '[1, 50]'         (string containing array syntax)
        
        3. Null - Write it as the ACTUAL null keyword:
           ✅ CORRECT: null              (raw null keyword)
           ❌ WRONG:   "null"            (string containing the word null)
           ❌ WRONG:   'null'            (string containing the word null)
        
        4. Objects - Write them as ACTUAL objects:
           ✅ CORRECT: {"key": "value"}  (raw object)
           ❌ WRONG:   "{"key": "value"}" (string containing object syntax)
        
        5. Numbers - Write them as ACTUAL numbers:
           ✅ CORRECT: 42                (raw number)
           ❌ WRONG:   "42"              (string containing a number)
        
        6. Booleans - Write them as ACTUAL booleans:
           ✅ CORRECT: true              (raw boolean)
           ❌ WRONG:   "true"            (string containing the word true)
        
        7. Strings - These ARE the only values that should have quotes:
           ✅ CORRECT: "hello"           (quoted string)
           ❌ WRONG:   hello             (unquoted - this is invalid)
      </json_formatting_rules>

      <correct_examples>
        ✅ CORRECT - view tool with line range:
        {
          "path": "/home/project/src/App.tsx",
          "view_range": [1, 50]
        }

        ✅ CORRECT - view tool reading entire file (MUST include view_range as null):
        {
          "path": "/home/project/src/App.tsx",
          "view_range": null
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
        ❌ INCORRECT - Omitting required parameter (DO NOT DO THIS):
        {
          "path": "/home/project/src/App.tsx"
        }
        (Missing view_range - must be included as null or [start, end])

        ❌ INCORRECT - null as a string (DO NOT DO THIS):
        {
          "path": "/home/project/src/App.tsx",
          "view_range": "null"
        }
        (This passes the STRING "null", not the null VALUE. Remove the quotes!)

        ❌ INCORRECT - Array as string (DO NOT DO THIS):
        {
          "path": "/home/project/src/App.tsx",
          "view_range": "[1, 50]"
        }
        (This passes the STRING "[1, 50]", not an ARRAY. Remove the quotes!)

        ❌ INCORRECT - Object as string (DO NOT DO THIS):
        {
          "config": "{\\"enabled\\": true, \\"count\\": 5}"
        }
        (This passes a STRING, not an OBJECT. Remove the outer quotes!)

        ❌ INCORRECT - Number as string (DO NOT DO THIS):
        {
          "count": "5"
        }
        (This passes the STRING "5", not the NUMBER 5. Remove the quotes!)

        ❌ INCORRECT - Boolean as string (DO NOT DO THIS):
        {
          "active": "true"
        }
        (This passes the STRING "true", not the BOOLEAN true. Remove the quotes!)
      </incorrect_examples>

      <self_correction>
        Before calling any tool, CHECK EACH PARAMETER:
        
        1. Verify the tool name is in the available tools list above
        2. Review the tool's parameter schema to see what type each parameter expects
        3. For EACH parameter, ask yourself:
           - Is this supposed to be an array? → Write [1, 2, 3] NOT "[1, 2, 3]"
           - Is this supposed to be null? → Write null NOT "null"
           - Is this supposed to be an object? → Write {key: value} NOT "{key: value}"
           - Is this supposed to be a number? → Write 42 NOT "42"
           - Is this supposed to be a boolean? → Write true NOT "true"
           - Is this supposed to be a string? → Write "text" (this one DOES have quotes)
        4. Mentally remove any quotes around non-string values
        5. Double-check you haven't accidentally stringified anything
      </self_correction>

      <emphasis>
        ⚠️ CRITICAL REMINDER ⚠️
        
        DO NOT PUT QUOTES AROUND:
        - null (write: null, not "null")
        - arrays (write: [1, 2], not "[1, 2]")
        - objects (write: {a: 1}, not "{a: 1}")
        - numbers (write: 42, not "42")
        - booleans (write: true, not "true")
        
        ONLY PUT QUOTES AROUND:
        - strings (write: "hello", not hello)
        
        If you pass "null" instead of null, the tool will FAIL.
        If you pass "[1, 50]" instead of [1, 50], the tool will FAIL.
        
        This is the most common mistake - DO NOT make it!
      </emphasis>
    </tool_call_json_formatting>
  </zai_guidelines>
  `;
}
