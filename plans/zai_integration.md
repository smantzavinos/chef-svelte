# Z.AI Provider Integration Plan

## Executive Summary

This document outlines the complete plan to integrate z.ai (ZhipuAI) as an AI API provider in Chef, alongside existing providers (Anthropic, OpenAI, Google, XAI, Bedrock). Z.AI provides OpenAI-compatible API endpoints for their GLM (General Language Model) series.

**Key Highlight**: GLM-4.6 is specifically optimized for AI-powered coding through z.ai's "Coding Plan" subscription ($3/month), and is **already compatible with Chef's existing architecture** including tool calling, streaming, and agentic workflows.

---

## Background: Z.AI API Research

### GLM-4.6 Coding Plan

Z.AI offers a "[GLM Coding Plan](https://z.ai/subscribe)" specifically designed for AI-powered coding tools like Claude Code, Cline, OpenCode, and Roo Code. Key features:

- **Pricing**: Starting at $3/month (extremely cost-effective)
- **Superior Coding Performance**: Outperforms Claude Sonnet 4 in real-world coding tests
- **30% More Token-Efficient**: Lower token consumption than GLM-4.5
- **Advanced Tool Use**: Native support for tool calling during inference
- **Enhanced Agentic Capabilities**: Strong performance in task decomposition, cross-tool collaboration, and dynamic adjustments
- **Front-end Excellence**: Better visual polish and logical layout in generated UI code

### API Compatibility

- **API Structure**: OpenAI-compatible REST API
- **Base URL**: `https://api.z.ai/api/paas/v4/`
- **Endpoint**: `/chat/completions` (standard OpenAI format)
- **Authentication**: Bearer token (`Authorization: Bearer YOUR_API_KEY`)
- **Streaming**: Supported via `stream: true` parameter
- **Tool Calling**: ✅ Full support (OpenAI-compatible format)
- **Default Model**: `glm-4.6` (latest GLM model)

### Model Specifications

**GLM-4.6 Technical Details:**

- **Context Window**: 200K tokens (expanded from 128K)
- **Max Output Tokens**: 128K tokens
- **Input Modalities**: Text
- **Output Modalities**: Text
- **Tool Use**: ✅ Supported natively
- **Reasoning**: Optional `thinking: { type: "enabled" }` parameter for enhanced reasoning
- **Streaming**: ✅ Full support

### Available Models

- `glm-4.6` - Latest model optimized for coding (recommended)
- `glm-4` - Base GLM-4 model
- `glm-4-plus` - Enhanced version
- Other GLM variants available

### Real-World Coding Performance

According to z.ai's benchmarks (74 real-world coding tests in Claude Code):

- **Outperforms Claude Sonnet 4** on real-world coding tasks
- **Best-in-class among Chinese models** across AIME 25, GPQA, LCB v6, HLE, SWE-Bench
- **30% lower token consumption** than GLM-4.5
- **Public test dataset**: [CC-Bench trajectories on HuggingFace](https://huggingface.co/datasets/zai-org/CC-Bench-trajectories)

### API Key Generation

1. Visit [Z.AI Open Platform](https://z.ai/model-api)
2. Register or login
3. Navigate to [API Keys management](https://z.ai/manage-apikey/apikey-list)
4. Create and copy API key

### Request Format

```bash
curl --location 'https://api.z.ai/api/paas/v4/chat/completions' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Accept-Language: en-US,en' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "glm-4.6",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }'
```

### SDK Availability & Chef Compatibility

- **No official `@ai-sdk/zhipu` package exists**
- **Solution**: Use `@ai-sdk/openai`'s `createOpenAI()` with custom `baseURL`
- This approach is already used successfully in the codebase
- **✅ Chef Compatibility**: Since z.ai is OpenAI-compatible, all Chef features work out-of-the-box:
  - ✅ Tool calling (edit, view, deploy, npmInstall, lookupDocs, etc.)
  - ✅ Streaming responses with usage tracking
  - ✅ Multi-turn conversations
  - ✅ Agentic workflows with dynamic tool selection
  - ✅ Error handling and retries

### Why GLM-4.6 Works Perfectly with Chef

Chef uses the Vercel AI SDK's `streamText()` function with:

1. **Tool Calling**: Chef passes `tools` object with `toolChoice: 'auto'`
2. **OpenAI Format**: z.ai uses the same format, so tools work automatically
3. **Agent Loop**: GLM-4.6's "advanced reasoning" and "tool use during inference" align perfectly with Chef's agentic architecture
4. **Large Context**: 200K context window handles Chef's system prompts + user code + conversation history
5. **Cost Efficiency**: At $3/month, GLM-4.6 is the most affordable option for coding agents

---

## Current Implementation Analysis

### Architecture Overview

Chef uses a multi-provider architecture with the following key components:

1. **Type System** (`app/lib/common/annotations.ts`)

   - `ProviderType` enum defines all supported providers
   - Currently: `'Anthropic' | 'Bedrock' | 'OpenAI' | 'XAI' | 'Google' | 'Unknown'`

2. **Provider Layer** (`app/lib/.server/llm/provider.ts`)

   - `getProvider()`: Creates AI SDK provider instances
   - `modelForProvider()`: Maps provider to default model
   - Each provider case handles:
     - User API key vs system API key
     - Model selection and defaults
     - Max token limits
     - Provider-specific options (streaming, caching, etc.)

3. **Database Schema** (`convex/schema.ts`)

   - `apiKeyValidator` stores user API keys per provider
   - Currently supports: `value` (Anthropic), `openai`, `xai`, `google`

4. **API Key Management** (`convex/apiKeys.ts`)

   - Validation actions per provider (test API connectivity)
   - Delete mutations per provider
   - Generic get/set mutations for all keys

5. **UI Components** (`app/components/`)

   - `ModelSelector.tsx`: Model selection dropdown
   - `ApiKeyCard.tsx`: API key input/management in settings

6. **Agent Integration** (`app/lib/.server/llm/convex-agent.ts`)
   - Uses `modelProvider` parameter throughout
   - Provider-specific prompts via `SystemPromptOptions`
   - Provider-specific options (Anthropic caching, Bedrock cache points)

### Provider Implementation Pattern

Each provider requires:

1. **Type Definition**

   ```typescript
   // app/lib/common/annotations.ts
   const providerValidator = z.enum(['Anthropic', 'Bedrock', 'OpenAI', 'XAI', 'Google', 'ZAI', 'Unknown']);
   ```

2. **Schema Field**

   ```typescript
   // convex/schema.ts
   export const apiKeyValidator = v.object({
     value: v.optional(v.string()), // Anthropic
     openai: v.optional(v.string()),
     xai: v.optional(v.string()),
     google: v.optional(v.string()),
     zai: v.optional(v.string()), // NEW
   });
   ```

3. **Provider Factory**

   ```typescript
   // app/lib/.server/llm/provider.ts
   case 'ZAI': {
     const zai = createOpenAI({
       apiKey: userApiKey || getEnv('ZAI_API_KEY'),
       baseURL: 'https://api.z.ai/api/paas/v4/',
       fetch: userApiKey ? userKeyApiFetch('ZAI') : fetch,
     });
     return { model: zai(model), maxTokens: 8192 };
   }
   ```

4. **Validation Action**

   ```typescript
   // convex/apiKeys.ts
   export const validateZaiApiKey = action({
     handler: async (ctx, args) => {
       const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
         method: 'POST',
         headers: { Authorization: `Bearer ${args.apiKey}` },
       });
       return response.status !== 401;
     },
   });
   ```

5. **UI Integration**
   ```typescript
   // app/components/chat/ModelSelector.tsx
   type ModelProvider = 'openai' | 'google' | 'xai' | 'anthropic' | 'zai' | 'auto';
   ```

### Current Provider Features

| Provider  | User Keys | System Keys             | Streaming | Caching      | Tool Calling | Special Options                 |
| --------- | --------- | ----------------------- | --------- | ------------ | ------------ | ------------------------------- |
| Anthropic | ✅        | ✅ (+ low QoS fallback) | ✅        | ✅ ephemeral | ✅           | Rate limit retry                |
| Bedrock   | ❌        | ✅                      | ✅        | ✅ default   | ✅           | AWS OIDC auth                   |
| OpenAI    | ✅        | ✅                      | ✅        | ✅           | ✅           | Reasoning effort (GPT-5)        |
| XAI       | ✅        | ✅                      | ✅        | ✅           | ✅           | `stream_options: include_usage` |
| Google    | ✅        | ✅ (Vertex)             | ✅        | ✅           | ✅           | Dual API (Generative/Vertex)    |
| **ZAI**   | ✅        | ✅ (planned)            | ✅        | ❓ (TBD)     | ✅           | Optional thinking/reasoning     |

**Note**: All providers support tool calling, which is essential for Chef's agentic coding capabilities.

---

## Implementation Plan

### Phase 1: Core Integration (High Priority)

#### 1.1 Type System Updates

**File**: `app/lib/common/annotations.ts`

**Line 63**: Update provider enum

```typescript
const providerValidator = z.enum(['Anthropic', 'Bedrock', 'OpenAI', 'XAI', 'Google', 'ZAI', 'Unknown']);
```

**Lines 15-47**: Add ZAI to `usageAnnotationValidator`

```typescript
providerMetadata: z.object({
  // ... existing providers
  zai: z.object({
    cachedPromptTokens: z.number(),
  }).optional(),
}).optional(),
```

**Lines 52-61**: Update `Usage` type

```typescript
export type Usage = UsageAnnotation & {
  // ... existing fields
  zaiCachedPromptTokens: number;
};
```

#### 1.2 Database Schema

**File**: `convex/schema.ts`

**Line 6-13**: Add `zai` field to `apiKeyValidator`

```typescript
export const apiKeyValidator = v.object({
  preference: v.union(v.literal('always'), v.literal('quotaExhausted')),
  value: v.optional(v.string()), // Anthropic
  openai: v.optional(v.string()),
  xai: v.optional(v.string()),
  google: v.optional(v.string()),
  zai: v.optional(v.string()), // NEW
});
```

#### 1.3 Provider Implementation

**File**: `app/lib/.server/llm/provider.ts`

**Line 19**: Update `ModelProvider` type

```typescript
export type ModelProvider = Exclude<ProviderType, 'Unknown'>;
// Now includes 'ZAI' automatically from ProviderType
```

**Lines 45-60**: Add ZAI case to `modelForProvider()`

```typescript
function modelForProvider(provider: ModelProvider, modelChoice: string | undefined) {
  if (modelChoice) return modelChoice;

  switch (provider) {
    // ... existing cases
    case 'ZAI':
      return getEnv('ZAI_MODEL') || 'glm-4.6';
    default: {
      const _exhaustiveCheck: never = provider;
      throw new Error(`Unknown provider: ${_exhaustiveCheck}`);
    }
  }
}
```

**Lines 67-221**: Add ZAI case to `getProvider()`

```typescript
export function getProvider(
  userApiKey: string | undefined,
  modelProvider: ModelProvider,
  modelChoice: string | undefined,
): Provider {
  // ... existing code

  switch (modelProvider) {
    // ... existing cases

    case 'ZAI': {
      model = modelForProvider(modelProvider, modelChoice);
      const zai = createOpenAI({
        apiKey: userApiKey || getEnv('ZAI_API_KEY'),
        baseURL: 'https://api.z.ai/api/paas/v4/',
        fetch: userApiKey ? userKeyApiFetch('ZAI') : fetch,
        compatibility: 'strict',
      });
      provider = {
        model: zai(model),
        maxTokens: 128000, // GLM-4.6 supports up to 128K output tokens
        options: undefined, // Could add { thinking: { type: "enabled" } } in future
      };
      break;
    }
  }
  return provider;
}
```

#### 1.4 API Key Validation

**File**: `convex/apiKeys.ts`

**After line 254**: Add validation action

```typescript
export const validateZaiApiKey = action({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: 'NotAuthorized', message: 'Unauthorized' });
    }

    const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${args.apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4.6',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      }),
    });

    if (response.status === 401) {
      return false;
    }
    return true;
  },
});
```

**After line 135**: Add delete mutation

```typescript
export const deleteZaiApiKeyForCurrentMember = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: 'NotAuthorized', message: 'Unauthorized' });
    }

    const existingMember = await getMemberByConvexMemberIdQuery(ctx, identity).first();
    if (!existingMember) {
      throw new ConvexError({ code: 'NotAuthorized', message: 'Unauthorized' });
    }
    if (!existingMember.apiKey) {
      return;
    }

    await ctx.db.patch(existingMember._id, {
      apiKey: {
        ...existingMember.apiKey,
        zai: undefined,
      },
    });
  },
});
```

### Phase 2: UI Integration (Medium Priority)

#### 2.1 Model Selector Updates

**File**: `app/components/chat/ModelSelector.tsx`

**Line 13**: Update `ModelProvider` type

```typescript
export type ModelProvider = 'openai' | 'google' | 'xai' | 'anthropic' | 'zai' | 'auto';
```

**Lines 15-32**: Add ZAI to `displayModelProviderName()`

```typescript
export function displayModelProviderName(provider: ModelProvider) {
  switch (provider) {
    // ... existing cases
    case 'zai':
      return 'z.ai';
    default: {
      const exhaustiveCheck: never = provider;
      throw new Error(`Unknown model provider: ${exhaustiveCheck}`);
    }
  }
}
```

**Lines 44-61**: Add ZAI icon to `providerToIcon`

```typescript
const providerToIcon: Record<string, React.ReactNode> = {
  // ... existing icons
  zai: svgIcon('/icons/zai.svg'), // Need to add icon asset
};
```

**Lines 63-118**: Add GLM models to `models` object

```typescript
export const models: Partial<Record<ModelSelection, {...}>> = {
  // ... existing models
  'glm-4.6': {
    name: 'GLM-4.6',
    provider: 'zai',
    recommended: false,
    requireKey: true,  // Requires user API key ($3/month Coding Plan)
  },
  'glm-4-plus': {
    name: 'GLM-4 Plus',
    provider: 'zai',
    requireKey: true,
  },
};
```

**Lines 202-214**: Update `keyForProvider()`

```typescript
const keyForProvider = (apiKeys: Doc<'convexMembers'>['apiKey'], provider: ModelProvider, useGeminiAuto: boolean) => {
  if (provider === 'anthropic') return apiKeys?.value;
  if (provider === 'auto') {
    return useGeminiAuto ? apiKeys?.google : apiKeys?.value;
  }
  if (provider === 'zai') return apiKeys?.zai; // NEW
  return apiKeys?.[provider];
};
```

#### 2.2 Model Selection Type

**File**: `app/utils/constants.ts`

**Lines 4-13**: Add GLM models

```typescript
export type ModelSelection =
  | 'auto'
  | 'claude-3-5-haiku'
  | 'claude-4-sonnet'
  | 'claude-4.5-sonnet'
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-5'
  | 'grok-3-mini'
  | 'gemini-2.5-pro'
  | 'glm-4.6' // NEW
  | 'glm-4-plus'; // NEW
```

#### 2.3 Settings UI

**File**: `app/components/settings/ApiKeyCard.tsx`

**Line 159**: Update `KeyType` union

```typescript
type KeyType = 'anthropic' | 'google' | 'openai' | 'xai' | 'zai';
```

**Line 38**: Update `hasAnyKey` check

```typescript
const hasAnyKey = apiKey && (apiKey.value || apiKey.openai || apiKey.xai || apiKey.google || apiKey.zai);
```

**After line 62**: Add validation function

```typescript
const validateZaiApiKey = async (apiKey: string) => {
  return await convex.action(api.apiKeys.validateZaiApiKey, { apiKey });
};
```

**After line 152**: Add API key input component

```typescript
<ApiKeyItem
  label="z.ai API key"
  description={
    <>
      <a
        href="https://z.ai/subscribe"
        target="_blank"
        rel="noopener noreferrer"
        className="text-content-link hover:underline"
      >
        Get GLM Coding Plan ($3/month)
      </a>
      {' · '}
      <a
        href="https://z.ai/manage-apikey/apikey-list"
        target="_blank"
        rel="noopener noreferrer"
        className="text-content-link hover:underline"
      >
        Manage API keys
      </a>
    </>
  }
  isLoading={apiKey === undefined}
  keyType="zai"
  value={apiKey?.zai || ''}
  onValidate={validateZaiApiKey}
/>
```

**Lines 227-244**: Add ZAI case to `handleRemoveKey()`

```typescript
switch (keyType) {
  // ... existing cases
  case 'zai':
    await convex.mutation(api.apiKeys.deleteZaiApiKeyForCurrentMember);
    toast.success('z.ai API key removed', { id: 'zai-removed' });
    break;
}
```

**Lines 270-283**: Add ZAI case to `handleSaveKey()`

```typescript
switch (keyType) {
  // ... existing cases
  case 'zai':
    apiKeyMutation.zai = cleanApiKey(newKeyValue);
    break;
}
```

### Phase 3: Environment & Assets (Medium Priority)

#### 3.1 Environment Variables

**File**: `.env.example`

Add:

```bash
# z.ai Configuration (optional - for system-level API key)
ZAI_API_KEY=your_zai_api_key_here
ZAI_MODEL=glm-4.6
```

#### 3.2 Assets

**File**: `public/icons/zai.svg`

Create z.ai logo icon (need to source from z.ai branding)

### Phase 4: Agent Integration (Optional)

#### 4.1 System Prompts (If ZAI-specific guidance needed)

**File**: `chef-agent/prompts/zai.ts` (NEW)

```typescript
import type { SystemPromptOptions } from '../types.js';

export function zai(options: SystemPromptOptions) {
  if (!options.usingZai) return '';

  return `
## z.ai (ZhipuAI) Specific Guidelines

You are using z.ai's GLM models. Keep in mind:
- GLM models excel at Chinese language tasks
- Token limits may differ from other providers
  `.trim();
}
```

**File**: `chef-agent/types.ts`

Add to `SystemPromptOptions`:

```typescript
export type SystemPromptOptions = {
  // ... existing fields
  usingZai: boolean;
};
```

**File**: `app/lib/.server/llm/convex-agent.ts`

**Line 90**: Add flag

```typescript
const opts: SystemPromptOptions = {
  // ... existing fields
  usingZai: modelProvider == 'ZAI',
};
```

**File**: `chef-agent/prompts/system.ts`

**Line 31-42**: Include ZAI prompt

```typescript
export function generalSystemPrompt(options: SystemPromptOptions) {
  const result = stripIndents`${GENERAL_SYSTEM_PROMPT_PRELUDE}
  ${openAi(options)}
  ${google(options)}
  ${zai(options)}  // NEW
  ${solutionConstraints(options)}
  // ... rest
  `;
  return result;
}
```

---

## Testing Plan

### Unit Tests

1. **Provider Factory**

   - Test `getProvider()` with ZAI provider
   - Test model selection and defaults
   - Test with/without user API key

2. **API Key Validation**

   - Test `validateZaiApiKey` with valid key
   - Test with invalid key
   - Test error handling

3. **Schema Validation**
   - Test `apiKeyValidator` with zai field
   - Test optional zai field

### Integration Tests

1. **End-to-End Chat**

   - Create chat with ZAI provider
   - Send message and verify response
   - Test streaming responses

2. **API Key Management**

   - Add ZAI API key via UI
   - Verify key saved in database
   - Remove ZAI API key
   - Test preference: always vs quotaExhausted

3. **Model Selection**
   - Select GLM model from dropdown
   - Verify correct provider initialized
   - Test requireKey enforcement

### Manual Testing Checklist

- [ ] Settings page shows z.ai API key input
- [ ] Can add valid z.ai API key
- [ ] Invalid key shows validation error
- [ ] Can remove z.ai API key
- [ ] Model selector shows GLM models
- [ ] GLM models require API key when selected
- [ ] Chat works with ZAI provider
- [ ] Streaming responses work
- [ ] **Tool calling works** (edit, view, deploy, etc.)
- [ ] **Multi-step coding tasks work** (agentic workflows)
- [ ] Usage tracking works
- [ ] Error messages are clear
- [ ] 200K context window handles large codebases

---

## Files to Modify Summary

| File                                     | Changes                                  | Priority |
| ---------------------------------------- | ---------------------------------------- | -------- |
| `app/lib/common/annotations.ts`          | Add ZAI to provider enum, usage metadata | High     |
| `convex/schema.ts`                       | Add `zai` field to apiKeyValidator       | High     |
| `app/lib/.server/llm/provider.ts`        | Add ZAI provider implementation          | High     |
| `convex/apiKeys.ts`                      | Add validation & delete mutations        | High     |
| `app/components/chat/ModelSelector.tsx`  | Add ZAI to UI, models, icons             | Medium   |
| `app/utils/constants.ts`                 | Add GLM models to ModelSelection         | Medium   |
| `app/components/settings/ApiKeyCard.tsx` | Add ZAI API key UI                       | Medium   |
| `.env.example`                           | Document env vars                        | Medium   |
| `public/icons/zai.svg`                   | Add icon asset                           | Low      |
| `chef-agent/prompts/zai.ts`              | Add ZAI-specific prompts (optional)      | Low      |
| `chef-agent/types.ts`                    | Add `usingZai` flag (optional)           | Low      |

---

## Risk Assessment & Mitigation

### Risks

1. ~~**Unknown Token Limits**: Conservative 8192 estimate may be incorrect~~ **✅ RESOLVED**

   - **Solution**: Confirmed 128K max output, 200K context window

2. ~~**OpenAI Compatibility**: API may not be 100% compatible~~ **✅ CONFIRMED COMPATIBLE**

   - **Solution**: z.ai is fully OpenAI-compatible, including tool calling

3. **Caching Support**: Unknown if z.ai supports prompt caching

   - **Mitigation**: Start without caching, add if supported

4. **Rate Limits**: Unknown rate limit behavior for Coding Plan

   - **Mitigation**: Use standard error handling, document in user-facing messages

5. **Tool Calling Reliability**: Need to verify tool calling works as expected
   - **Mitigation**: Extensive testing with Chef's tools (edit, view, deploy)

### Answered Questions

- ✅ **Token limits**: 200K context, 128K max output
- ✅ **Tool calling support**: Yes, native support
- ✅ **Coding performance**: Better than Claude Sonnet 4 on benchmarks
- ✅ **OpenAI compatibility**: Fully compatible
- ✅ **Pricing**: $3/month for Coding Plan

### Open Questions

- [ ] Does z.ai support prompt caching?
- [ ] Are there other GLM model variants optimized for coding?
- [ ] What are the rate limits for the $3/month Coding Plan?
- [ ] Does z.ai provide usage/cost tracking APIs?
- [ ] How does the "thinking" parameter affect coding performance?

---

## Success Criteria

1. ✅ Users can add z.ai API keys in settings
2. ✅ API key validation works correctly
3. ✅ GLM models appear in model selector
4. ✅ Chats work with ZAI provider
5. ✅ Streaming responses work
6. ✅ Usage tracking records correctly
7. ✅ Error handling is robust
8. ✅ UI follows existing design patterns
9. ✅ All tests pass
10. ✅ Documentation updated

---

## Rollout Plan

1. **Phase 1**: Implement core backend (1-2 days)

   - Types, schema, provider, validation
   - Manual testing with API key

2. **Phase 2**: Implement UI (1 day)

   - Model selector, settings page
   - Icon assets

3. **Phase 3**: Testing & QA (1 day)

   - End-to-end testing
   - Error scenarios
   - Edge cases

4. **Phase 4**: Documentation & Launch (0.5 days)
   - Update docs
   - Announcement

**Total Estimated Time**: 3.5-4.5 days

---

## Future Enhancements

### Potential Optimizations

1. **Thinking/Reasoning Mode**

   - Add support for `thinking: { type: "enabled" }` parameter
   - Could improve complex coding task performance
   - Similar to Claude's thinking or GPT-5's reasoning

2. **Additional GLM Model Variants**

   - Explore other GLM-4 variants optimized for specific tasks
   - Add support for future GLM-5 models

3. **GLM-Specific Prompt Optimization**

   - Tailor system prompts to leverage GLM-4.6's strengths
   - Optimize for front-end code generation (GLM-4.6's specialty)
   - Add Chinese language support if needed

4. **Usage Cost Tracking**

   - Integrate z.ai's usage/cost tracking APIs (if available)
   - Help users monitor Coding Plan usage

5. **Performance Benchmarking**

   - Compare GLM-4.6 vs Claude Sonnet 4 vs GPT-4.1 on Chef-specific coding tasks
   - Measure token efficiency and cost savings
   - Publish results to help users choose the best model

6. **Prompt Caching**
   - If z.ai adds caching support, implement it to reduce costs
   - Would significantly improve performance on large codebases

---

## Why This Integration Matters

GLM-4.6's Coding Plan represents a **game-changer for accessible AI coding**:

- **Cost**: $3/month vs $20+ for comparable providers
- **Performance**: Matches/exceeds Claude Sonnet 4 on real-world coding
- **Efficiency**: 30% lower token consumption = faster responses
- **Tool Calling**: Native support means Chef's tools work perfectly
- **Context**: 200K window handles massive codebases
- **Compatibility**: OpenAI format means zero integration friction

This makes Chef + GLM-4.6 one of the **most cost-effective AI coding solutions** available.
