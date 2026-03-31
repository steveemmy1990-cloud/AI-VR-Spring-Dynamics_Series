# AI Agent Features

This simulation includes an intelligent AI assistant robot that can observe user actions and provide adaptive scaffolding, hints, and guidance.

## Features

### 1. **Interactive AI Robot**
- Located on the left side of the brown plank
- **Activation**: Click on the robot to activate it
- **Visual Feedback**: Robot changes from white to blue when activated
- **Deactivation**: Click again to deactivate

### 2. **Communication Modes**

#### Text Mode (Default)
- Type your questions in the text input box
- Press Enter or click "Send" to submit
- AI responds in a speech bubble above the input

#### Voice Mode
- Click the speaker icon (🔊) to enable voice mode
- Hold the microphone button to speak
- Release to send your question
- AI responds with text and audio (text-to-speech)

### 3. **AI Capabilities**

The AI assistant:
- **Knows everything** about the spring dynamics experiment
- **Observes all user actions** (clicks, selections, attachments, adjustments)
- **Provides adaptive hints** based on current simulation state
- **Answers questions** about spring physics, procedures, and calculations
- **Scaffolds learning** by guiding rather than giving direct answers
- **Stays in scope** - only answers questions about this experiment

### 4. **What the AI Can Help With**

- **Procedure**: "How do I attach springs to the plank?"
- **Physics concepts**: "What is Hooke's Law?"
- **Troubleshooting**: "Why can't I attach the mass?"
- **Calculations**: "How do I calculate the extension?"
- **Spring dynamics**: "What happens when I increase stiffness?"
- **Parallel springs**: "How do springs in parallel work?"

### 5. **User Action Tracking**

The AI observes and tracks:
- Object selections (plank, springs, block)
- Attachments and detachments
- Position changes
- Control panel adjustments (stiffness, mass)
- Button clicks ("Take reading")

This allows the AI to provide contextual help based on what you're currently doing.

## Setup (Optional OpenAI Integration)

By default, the AI uses intelligent rule-based responses. For enhanced AI capabilities using GPT-3.5:

1. Copy `.env.example` to `.env`
2. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
3. Add your key to `.env`:
   ```
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
4. Restart the development server

**Note**: The rule-based system is quite capable and doesn't require an API key!

## Example Interactions

### Getting Started
**User**: "Hi, how do I start?"  
**AI**: "Hello! I'm your AI assistant for this spring dynamics experiment. I'm here to help you learn about springs in parallel arrangement. What would you like to know?"

### Help with Procedure
**User**: "Help"  
**AI**: "Let's start by moving the plank! First, click on the brown plank once to select it (it will turn green). Then double-click it to move it to the suspended position in the center. Have you tried that?"

### Physics Questions
**User**: "What is Hooke's Law?"  
**AI**: "Hooke's Law states F = -kx, where F is force, k is spring constant, and x is displacement. The negative sign means the force opposes the displacement (restoring force). You can see this principle in action when the springs oscillate!"

### Troubleshooting
**User**: "Why can't I attach the mass?"  
**AI**: "You need at least 2 springs attached to the plank before you can add the mass. This ensures a proper parallel spring arrangement. Can you attach more springs?"

### Off-Topic Questions
**User**: "What's the weather like?"  
**AI**: "Sorry, I am not able to help you with information or communication outside this virtual reality experiment. How can I help you with the spring dynamics experiment?"

## Technical Details

### Architecture
- **AIContext**: Manages robot state, conversation history, and action tracking
- **Action Logging**: All user interactions are logged with timestamps
- **Knowledge Base**: Comprehensive information about spring physics and experiment procedures
- **Rule-Based Fallback**: Intelligent responses without API requirements
- **Web Speech API**: Built-in browser APIs for voice recognition and synthesis

### Browser Compatibility
- **Voice features** require modern browsers (Chrome, Edge, Safari)
- **Text mode** works in all browsers
- No additional installations needed

### Privacy
- All interactions stay local in your browser
- If using OpenAI API, queries are sent to OpenAI's servers
- Rule-based mode processes everything locally

## Tips

1. **Activate the robot first** - Click it before asking questions
2. **Use voice mode** for hands-free interaction while experimenting
3. **Ask for hints** if you're stuck - the AI guides without giving direct answers
4. **Experiment freely** - the AI adapts to your actions
5. **Ask "why"** questions to deepen understanding

## Scope Limitations

The AI assistant is specifically designed for this spring dynamics experiment and will politely decline to answer questions outside its scope, such as:
- General knowledge questions
- Other physics topics not related to springs
- Personal advice or entertainment

This ensures focused, high-quality educational support for the experiment.
