# AI Robot: Knowledge, Memory, and Study Context

This document describes how the AI assistant in the spring dynamics experiment works, where its knowledge and memory live, and how to extend them for the learning study.

## Purpose of the AI in the Study

The experiment is designed to study **student behaviour when an AI agent is present in a learning space**: whether students rely on the AI for problem-solving or attempt to solve problems themselves. The AI is implemented so that:

- It has **accurate, full knowledge** of the experiment (procedure, formulas, physics).
- It can answer **conceptual, procedural, and calculation questions** clearly.
- It is **conversational and supportive**, while the system prompt encourages **hints and encouragement to try steps themselves** where appropriate (to support the study’s goals without over-scaffolding).
- All **user–AI interactions and user actions** are captured in the data collection (e.g. `AI_USER_PROMPT`, `AI_ROBOT_RESPONSE`, and other event logs) for later analysis.

## How the AI Works (No Traditional “Training”)

- The AI is **not** fine-tuned or trained on custom data. It uses:
  1. **System prompt**: A long text sent on each request that includes:
     - The full **knowledge base** (procedure, formulas, FAQs, troubleshooting).
     - The **current simulation state** (level, plank, springs, masses, stiffness, weights).
     - **Instructions** on how to respond (friendly, accurate, hint-first when appropriate).
  2. **Conversation history**: The last few user/assistant messages, for continuity.
  3. **Optional OpenAI API**: If `VITE_OPENAI_API_KEY` is set, the app calls the OpenAI API with the above; otherwise it uses a **rule-based fallback** that matches keywords and simulation state to predefined answers.

So the AI is “trained” only in the sense that **you edit the knowledge base and rules** in code; there is no separate model training step.

## Where Knowledge and Memory Are Stored

| What | Where | Persistence |
|------|--------|-------------|
| **Knowledge base (facts, formulas, procedure, FAQs)** | `src/utils/aiKnowledgeBase.js` → `SIMULATION_KNOWLEDGE` and `getRuleBasedResponse()` | Code (static). Edit this file to add or change what the AI “knows”. |
| **System prompt (built each time)** | `getSystemPrompt(simulationState)` in `aiKnowledgeBase.js` | Built at runtime from knowledge + current state. |
| **Conversation history** | `AIContext` → `conversationHistory` (React state) | In-memory only. Last 5 messages are sent to the API (or used for context). Not saved to disk unless your data collection logs them. |
| **User actions (for AI context)** | `AIContext` → `userActions` (last 20), last 10 in system prompt | In-memory; also logged via `DataContext` for your study. |
| **Study data (events, logs)** | Your data collection (e.g. CSV/JSON export, `logEvent` calls) | Depends on your implementation (e.g. in-memory then export, or server). |

So: **all “memory” the AI uses** is either (1) the static knowledge in `aiKnowledgeBase.js`, or (2) the current simulation state and the short conversation/action buffers in React state. There is no separate database or long-term memory store for the AI.

## Capacity

- **System prompt size**: Limited by the model’s context window (e.g. 4K–128K tokens depending on model). The current knowledge base is well within that; you can add more sections, formulas, and FAQs as needed.
- **Conversation**: Only the last few messages are kept and sent; older messages are dropped. This keeps context manageable and avoids unbounded growth.
- **Rule-based fallback**: `getRuleBasedResponse()` can be extended with as many `if (message.includes(...))` branches as you need. No hard limit; more branches improve coverage when the API is not used.

## How to Improve the AI (Add Knowledge or Behaviour)

1. **Add or edit factual content**
   - Open `src/utils/aiKnowledgeBase.js`.
   - Edit the **`SIMULATION_KNOWLEDGE`** string: add formulas, procedure steps, FAQs, or troubleshooting. The API model will use this text when answering.
   - Ensure formulas and numbers (e.g. g = 9.8, Level 1 vs Level 2 forces) are correct and consistent with the app and with “Take reading”.

2. **Change how the AI is instructed to behave**
   - In the same file, edit **`getSystemPrompt(simulationState)`**: change the “Communication Style” or “Study context” paragraphs to encourage more hints, more direct answers, or different tone, as needed for the study.

3. **Improve fallback when there is no API (or API fails)**
   - In **`getRuleBasedResponse(userMessage, simulationState)`**, add new branches, e.g.:
     - `if (message.includes('your new keyword')) return "Your answer here."`
   - Use `simulationState` (level, attached springs, masses, etc.) to give context-aware answers.

4. **Optional: use a different model or longer answers**
   - In `src/components/AIChatInterface.jsx`, the API call uses `model: 'gpt-3.5-turbo'` and `max_tokens: 280`. You can change the model or increase `max_tokens` if you want longer or more detailed replies.

## Summary

- **Training the AI** = editing `aiKnowledgeBase.js` (and optionally the API call in `AIChatInterface.jsx`). No separate training pipeline.
- **Capacity**: System prompt can be expanded within the model’s context limit; rule-based responses can be extended without a fixed limit.
- **Memory**: Knowledge is in code; conversation and recent actions are in React state and (for study data) in your logging/export.
- The AI is designed to be **smart, accurate, and conversational** while supporting the study’s aim to observe whether students rely on the AI or try problem-solving themselves; you can tune the system prompt and rules to match your exact study design.
