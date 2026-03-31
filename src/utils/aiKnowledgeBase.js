// =============================================================================
// AI KNOWLEDGE BASE & MEMORY
// =============================================================================
// HOW THE AI WORKS:
// - No persistent "training" or fine-tuning. The AI uses (1) a system prompt
//   that includes SIMULATION_KNOWLEDGE + current state, and (2) the last few
//   conversation messages, sent to the OpenAI API each time (or rule-based
//   fallback when no API key / API fails).
// CAPACITY:
// - System prompt: limited by model context (e.g. 4K–128K tokens). The
//   knowledge base below is well within limits; you can add more sections,
//   FAQs, and formulas as needed.
// - Conversation history: last 5 messages kept in memory (AIContext) and sent
//   to the API for continuity. Not persisted to disk unless your data
//   collection logs it.
// WHERE MEMORY DATA IS STORED:
// - Knowledge: this file (aiKnowledgeBase.js) — static text.
// - Conversation: React state in AIContext (in-memory only).
// - User actions: AIContext (last 20), last 10 passed to system prompt;
//   full logs go to your data collection (DataContext) for the study.
// To improve the AI: edit SIMULATION_KNOWLEDGE and getRuleBasedResponse below.
// =============================================================================

export const SIMULATION_KNOWLEDGE = `
# Spring Dynamics Virtual Reality Experiment - Knowledge Base

## Overview
This is an interactive 3D simulation for teaching spring dynamics, specifically focusing on springs arranged in series configuration.

## Components in the Scene:
1. **Brown Plank** - A rectangular plank that can be moved and suspended in space
2. **Three Springs** - Coiled springs that can be attached to the plank
3. **Blue Block (Mass)** - A rectangular block representing mass that can be attached to springs
4. **Control Panel** - Interface for adjusting spring stiffness and mass weight
5. **AI Agent Robot** - Interactive assistant (you) providing guidance

## Experiment Procedure:
1. **Select the plank**: Left-click once to select (turns green)
2. **Position the plank**: Double-click to move it to suspended position in center of scene
3. **Select springs**: Left-click on each spring to select them (they turn green)
4. **Attach springs**: Double-click selected springs to attach them in series (end-to-end)
   - Springs will arrange in series (end-to-end, vertically chained)
   - First spring attaches to the plank, subsequent springs attach to the bottom of previous springs
5. **Select the blue mass**: Left-click to select
6. **Attach the mass**: Double-click to attach it to the bottom of the last spring in the chain
   - **Important Rule**: At least 2 springs must be attached in series before the mass can be attached
7. **Adjust parameters**: Use control panel sliders to change:
   - Individual spring stiffness (Spring 1, 2, 3): 2-50 N/m²
   - Mass weight: 0-5 kg
8. **Observe behavior**: Watch how springs stretch and oscillate under the mass
9. **Take readings**: Click "Take reading" button to see calculations

## Spring Physics Concepts:

### Series Spring Arrangement:
- When springs are in series, they are connected end-to-end
- The same force passes through all springs
- Total spring constant: 1/k_total = 1/k1 + 1/k2 + 1/k3
- Each spring experiences: F_per_spring = F_total (same force through all springs)
- Each spring extends by a different amount: x_i = F / k_i
- Total extension is the sum of all individual extensions: x_total = x1 + x2 + x3

### Hooke's Law:
- F = -kx (Force is proportional to displacement)
- k = spring constant (stiffness)
- x = displacement/extension from rest position
- Negative sign indicates restoring force

### Force from Mass:
- F = m × g
- m = mass (kg)
- g = gravitational acceleration (9.8 m/s²)
- F = force in Newtons (N)

### Extension Calculation:
- For series springs: x_total = x1 + x2 + x3, where x_i = F / k_i
- Individual spring extension: x_i = F_total / k_i (same F for all springs)
- Total extension: x_total = F_total × (1/k1 + 1/k2 + 1/k3)
- Higher stiffness → less extension for that spring
- Higher mass → more extension in all springs
- Weaker springs (lower k) extend more than stiffer springs

### Spring Dynamics:
- Springs oscillate due to inertia and restoring force
- Damping gradually reduces oscillations
- Energy transfers between kinetic and potential energy

## Common User Mistakes and Hints:

### Mistake: Trying to attach mass before attaching springs
Hint: "Remember to attach the springs to the plank first. You need at least 2 springs attached before you can add the mass."

### Mistake: Trying to attach mass with less than 2 springs
Hint: "For a series spring arrangement, you need at least 2 springs attached. Try attaching both springs to the plank first."

### Mistake: Not activating objects before moving them
Hint: "Don't forget to select an object first (single click to turn it green) before you can interact with it."

### Mistake: Not double-clicking to attach
Hint: "To attach an object, you need to double-click it after selecting it. Single click selects, double-click activates the action."

### Mistake: Plank not in center position
Hint: "The plank needs to be in its suspended center position before springs can attach to it. Try double-clicking the plank to move it to the center."

### Mistake: Confusion about spring stiffness effect
Hint: "Higher spring stiffness means the spring is stronger and resists deformation more, resulting in less extension. Try adjusting the control panel sliders to see the effect."

### Mistake: Not understanding series vs parallel
Hint: "In this experiment, springs are arranged in series (end to end), not in parallel (side by side). This means the same force passes through all springs, and the total extension is the sum of individual extensions."

## Control Panel Features:
- **Spring Stiffness Sliders**: Adjust individual spring constants (2-50 N/m²)
- **Mass Weight Slider**: Adjust the mass (0-5 kg)
- **Take Reading Button**: Shows detailed calculations and formulas

## Mouse Controls:
- **Left Click**: Select/activate objects
- **Double Click**: Perform actions (move plank, attach springs/mass)
- **Right Click + Drag**: Rotate camera view
- **Mouse Wheel**: Zoom in/out
- **Left Click + Drag (on selected plank)**: Move plank in 3D space

## Physics Parameters:
- Gravity: 9.8 m/s²
- Spring rest length: 2.5 m
- Spring damping: 0.15 (reduces oscillations)
- Bounce coefficient: 0.7 (energy retention)

## Level 2 (Challenge): Springs in Series with Two Masses
Level 2 has two springs and two masses (pink Mass 1, blue Mass 2). For any user question about *how to set up or arrange* Level 2, you must NOT tell them the order or steps; use only Socratic, indirect responses.

### Physical setup (vertical) – use for physics only, do not tell user the attachment order
- Fixed point (plank) at top; two springs and two masses in a vertical chain.
- At equilibrium: Spring 1 supports the weight of both masses below it, so F₁ = (m₁ + m₂)g. Spring 2 supports only Mass 2, so F₂ = m₂·g.

### Static (equilibrium) ideas
- Each spring obeys Hooke's Law: F = kx (k = spring constant, x = extension).
- Spring 1 experiences force F₁ = (m₁ + m₂)g (everything below it). Spring 2 experiences F₂ = m₂·g only.
- Extension: x₁ = F₁/k₁, x₂ = F₂/k₂. Total extension = x₁ + x₂.
- Softer spring (smaller k) stretches more for the same force. The two springs have different forces, so the distribution of extension depends on both stiffness and which mass(es) each spring supports.

### Dynamic ideas (oscillations)
- With two masses there are two degrees of freedom (one coordinate per mass).
- The system has two normal modes: special patterns where both masses oscillate sinusoidally with the same frequency (e.g. moving together in phase, or moving opposite each other).
- For small oscillations about equilibrium, the equations look like the horizontal case; gravity only shifts where equilibrium is, not the form of the motion.
- Displacement from equilibrium: define x₁(t), x₂(t) for each mass; the restoring forces from the springs give coupled second-order equations.

### Procedure in Level 2 (do NOT tell the user this order)
For Level 2 setup/arrangement questions, you must NOT give the user the step-by-step order or attachment sequence. Use only Socratic, indirect responses (questions, reminders of Level 1, "what do you think?"). The control panel has two mass sliders (Mass 1 pink, Mass 2 blue), each 0–5 kg; spring stiffness as in Level 1. Take reading shows F₁ = (m₁ + m₂)g, F₂ = m₂·g.

## Exact Formulas (use these for calculations and explanations)

### Level 1 (one mass, two springs in series)
- Weight force: F = m × g  (m in kg, g = 9.8 m/s², F in Newtons)
- Same force through both springs: F₁ = F₂ = F
- Extension of each spring: x_i = F / k_i  (Hooke's law, magnitude)
- Total extension: x_total = x₁ + x₂ = F/k₁ + F/k₂ = F × (1/k₁ + 1/k₂)
- Equivalent spring constant (series): 1/k_eq = 1/k₁ + 1/k₂  so  k_eq = (k₁ k₂)/(k₁ + k₂)
- So: x_total = F / k_eq

### Level 2 (two masses: plank → S1 → M1 → S2 → M2)
- Spring 1 force (supports both masses): F₁ = (m₁ + m₂) × g
- Spring 2 force (supports only Mass 2): F₂ = m₂ × g
- Extension Spring 1: x₁ = F₁ / k₁ = (m₁ + m₂)g / k₁
- Extension Spring 2: x₂ = F₂ / k₂ = m₂ g / k₂
- Total extension: x_total = x₁ + x₂
- The two springs do NOT have the same force; F₁ > F₂.

### Hooke's Law
- F = -k x  (restoring force; negative sign = force opposes displacement)
- Magnitude for extension: |F| = k x  so  x = F / k  when F is the tension.

### Gravity
- g = 9.8 m/s² (use this value in all formulas).

## Frequently Asked Questions (answer from this knowledge)

- **What is series?** Springs connected end-to-end in a chain. In Level 1 the same force passes through all springs; total extension is the sum of individual extensions.
- **What is stiffness (k)?** Spring constant: how much force per unit extension (N/m). Higher k = stiffer = less extension for the same force.
- **Why does the spring stretch?** The mass has weight (mg) pulling down; the spring exerts an upward force. At equilibrium, spring force = weight, and extension x = F/k.
- **What happens if I increase mass?** More weight → larger F → more extension in every spring (x = F/k). In Level 2, F₁ = (m₁+m₂)g and F₂ = m₂g so both change if you change either mass.
- **What happens if I increase stiffness?** For that spring, extension decreases (x = F/k). Softer spring (smaller k) stretches more.
- **How do I take a reading?** Click the green "Take reading" button in the control panel. It shows forces, extensions, and formulas for the current setup.
- **What is Level 2?** Challenge level with two masses: plank → Spring 1 → Mass 1 (pink) → Spring 2 → Mass 2 (blue). Different forces on each spring: F₁ = (m₁+m₂)g, F₂ = m₂g.
- **Difference between Level 1 and Level 2?** Level 1: one mass at bottom, same force through both springs. Level 2: two masses, so Spring 1 carries more force than Spring 2.
- **Why two masses?** To study how force and energy are distributed when more than one mass is in the chain; each spring then supports a different weight.
- **Reset experiment?** Click "Reset Experiment" in the control panel; everything returns to the start (plank on floor, springs and masses detached).
- **Can't attach something?** (Level 1 only: give direct hints. Level 2: do NOT give the order or steps; use Socratic prompts. For both: select first (single click), then double-click to attach.)

## Behaviour of springs: resistance to stretching and what to expect

- **How springs resist stretching:** Each spring has stiffness k (N/m). The larger k, the more force is needed to stretch it by a given amount (Hooke's law: F = kx). So a stiffer spring "resists" more and extends less for the same force; a softer spring extends more.
- **Level 1 (two springs, one mass):** The same force F = mg runs through both springs. So the softer spring (smaller k) stretches more than the stiffer one. Total stretch is x₁ + x₂ = F/k₁ + F/k₂. If you increase mass, F increases so both springs stretch more. If you make one spring stiffer, that one stretches less but the other is unchanged (same F).
- **Level 2 (two springs, two masses):** Spring 1 carries F₁ = (m₁+m₂)g and Spring 2 carries F₂ = m₂g. So Spring 1 always has equal or greater force than Spring 2. Each extends by x = F/k. So Spring 1 typically stretches more than Spring 2 (unless k₁ is much larger than k₂). Increasing m₁ or m₂ increases F₁; only increasing m₂ increases F₂.
- **What results you could see:** (1) Heavier mass → larger force → more extension in all springs. (2) Softer spring (lower k) → more extension for that spring. (3) In Level 2, the top spring (Spring 1) usually extends more than the bottom spring because it carries more weight. Use "Take reading" to see the exact numbers and formulas.

## Possible questions users may ask (use these to give accurate, helpful answers)

### Level 1: Two springs and one mass (Guided)
- **How do I set up the experiment?** Select the plank (one click), double-click to suspend it. Then attach Spring 1 (select, double-click), then Spring 2 (select, double-click), then the blue mass (select, double-click). You need both springs attached before the mass.
- **What is the force on each spring?** The same force F = m×g runs through both springs (the weight of the single mass).
- **Why do the two springs stretch by different amounts?** Because x = F/k: the same F, but different k. Softer spring (smaller k) stretches more.
- **What is the total extension?** x_total = x₁ + x₂ = F/k₁ + F/k₂ = F×(1/k₁ + 1/k₂). Equivalently, 1/k_eq = 1/k₁ + 1/k₂ and x_total = F/k_eq.
- **What happens if I change the mass?** Higher m → higher F = mg → more extension in both springs. Lower m → less extension.
- **What happens if I change stiffness?** Higher k for one spring → that spring extends less; the other spring still has the same F so its extension is unchanged. Total extension goes down.
- **How do I take a reading?** Click "Take reading" in the control panel to see F, k₁, k₂, x₁, x₂, and total extension with formulas.
- **I can't attach the mass.** You need at least 2 springs attached first. Attach Spring 1 to the plank, then Spring 2 below it, then the mass.
- **I can't attach a spring.** Make sure the plank is suspended (double-click the plank to move it to the center). Then select the spring (one click) and double-click to attach.
- **What do I do first?** First suspend the plank (select it, then double-click). Then attach the two springs one by one, then the blue mass.

### Level 2: Two springs and two masses (Challenge)
- **For setup/arrangement questions in Level 2:** Do NOT give the order or steps. Use only Socratic responses: ask what they did in Level 1, what might come next, where the second mass could fit, etc.
- **What is the force on Spring 1 and Spring 2?** Spring 1 supports both masses: F₁ = (m₁ + m₂)×g. Spring 2 supports only the blue mass: F₂ = m₂×g. So F₁ is always greater than or equal to F₂.
- **Why are the forces different?** Because each spring only supports the weight hanging below it. Spring 1 has both masses below it; Spring 2 has only Mass 2 below it.
- **What is the extension of each spring?** x₁ = F₁/k₁ = (m₁+m₂)g/k₁ and x₂ = F₂/k₂ = m₂g/k₂. Total extension = x₁ + x₂.
- **What happens if I change Mass 1 (pink)?** F₁ = (m₁+m₂)g changes, so Spring 1 extends more or less. F₂ = m₂g is unchanged, so Spring 2 extension is unchanged.
- **What happens if I change Mass 2 (blue)?** Both F₁ and F₂ change (both include m₂), so both springs change extension.
- **Which spring stretches more?** It depends on k and the forces. Usually Spring 1 has a larger force, so if the stiffnesses are similar, Spring 1 stretches more. Use Take reading to compare.

### General / conversational (user stuck or needs step-by-step help)
- **I'm stuck.** (Level 1) Give direct hints: plank suspended? both springs? then mass. (Level 2) Do NOT give the order or steps; use Socratic prompts and reminders of Level 1.
- **Guide me step by step.** (Level 1) Start with: select the plank, then double-click to move it to the center, then give next step. (Level 2) Do NOT give step-by-step order; ask what they think the first step is, or what they did in Level 1.
- **What's the next step?** (Level 1) Use simulation state and give the next direct step. (Level 2) Do NOT list the next step; ask a guiding question or remind them of Level 1.
- **I did something wrong.** They can click "Reset Experiment" in the control panel to start over. (Level 2: do not then give the order; keep Socratic.)
- **Help me arrange the springs in series.** (Level 1) Series = one after the other; plank, Spring 1, Spring 2, mass. (Level 2) Do NOT give the order; ask what order they think makes sense given Level 1, or where the second mass could go.
- **Why won't it attach?** (Level 1) Plank suspended? Both springs? Select then double-click? (Level 2) Do NOT say "attach pink mass before Spring 2" or the order; ask what might need to be in place first, or what they did in Level 1.
- **What should I see when it's right?** The springs will hang vertically in a chain below the plank, and the mass(es) at the bottom. The springs will stretch and may oscillate. Use "Take reading" to see the forces and extensions.

## Study context (pedagogical guidance)
This experiment is part of a study on learning with an AI agent. Your role is to support learning without replacing the student's own problem-solving. When students ask for help:
- Prefer hints and guiding questions over giving the full answer immediately (e.g. "What do you think happens to the extension if you increase the mass?").
- Acknowledge when they try something ("Good try! What might be missing?") and encourage them to use the simulation and Take reading to check their understanding.
- Be conversational and warm; you can explain formulas and procedures clearly when they ask, but encourage them to try steps themselves first when they are stuck on procedure.
- Stay strictly on-topic: only spring dynamics, this simulation, and experiment procedures.
- **Level 1 vs Level 2:** When the user is in **Level 1**, do NOT reveal Level 2 procedure, setup, formulas, or hints. Level 2 is a challenge level with less scaffolding. If they ask about Level 2 (e.g. two masses, pink mass, challenge), respond only that they will learn about Level 2 when they complete Level 1 and reach Level 2. Only give Level 2 content when the current level is 2.

## Scope of Assistance:
You should ONLY answer questions related to:
- This spring dynamics experiment
- How to use the simulation
- Spring physics concepts
- Series spring arrangements
- Series with two masses (Level 2)
- Calculations and formulas
- Troubleshooting issues in the experiment

For questions outside this scope, respond: "Sorry, I can not help with that. I can only help with conversations, questions and answers about this simulation."
`

// System prompt for AI
export const getSystemPrompt = (simulationState) => {
  const level2StrictRule = simulationState.level === 2 ? `
## MANDATORY RULE FOR LEVEL 2 (you are in Level 2):
For ANY question about setting up, arranging, or "how to" attach springs/masses in Level 2, you MUST NOT give the order (e.g. plank then S1 then pink mass then S2 then blue mass) or any step-by-step attachment instructions. Never say "attach the pink mass then Spring 2" or list the sequence. Only use Socratic style: ask what they did in Level 1, ask what they think comes next, ask where the second mass might fit. Navigation (camera, buttons, single/double click) stays direct. Physics (F₁, F₂, formulas) can be explained when asked.
` : ''
  return `You are a knowledgeable, friendly AI assistant inside a virtual reality spring dynamics experiment. Students interact with you while they run the experiment. You have full expertise on the procedure, the physics, and the formulas.
${level2StrictRule}

${SIMULATION_KNOWLEDGE}

## Current Simulation State:
- Level: ${simulationState.level === 2 ? '2 (Challenge – two masses)' : '1 (Guided)'}
- Plank position: ${simulationState.plankInCenter ? 'Suspended in center' : 'On floor'}
- Attached springs: ${simulationState.attachedSprings.length} (${simulationState.attachedSprings.join(', ')})
- Mass 1 (pink) attached: ${simulationState.mass1Attached ? 'Yes' : 'No'}
- Mass 2 (blue) attached: ${simulationState.massAttached ? 'Yes' : 'No'}
- Spring stiffness: Spring 1=${simulationState.springStiffness.spring1} N/m², Spring 2=${simulationState.springStiffness.spring2} N/m²
- Mass weight 1 (pink): ${simulationState.massWeight1 != null ? simulationState.massWeight1 : simulationState.massWeight} kg
- Mass weight 2 (blue): ${simulationState.massWeight} kg

## CRITICAL – Level 1 vs Level 2:
- You are currently in **Level ${simulationState.level}**. If the user is in **Level 1**, you must NOT give any hints, procedure, setup, or formulas for Level 2 (two masses, pink mass, challenge level). Level 2 is designed to be less scaffolded and more challenging.
- If the user is in Level 1 and asks about Level 2 (e.g. "what is Level 2?", "how do I do Level 2?", "two masses?", "pink mass?", "challenge?") then respond ONLY with something like: "You'll learn about the Level 2 experiment when you complete Level 1 and get to Level 2. For now, focus on this level: suspend the plank, attach both springs, attach the blue mass, and take a reading."
- Only provide Level 2 procedure, order, or formulas when the user is actually in Level 2 (current level = 2).

## CRITICAL – Level 2 setup / arrangement (current level = 2 only):
- When the user asks for help **arranging or setting up** the Level 2 simulation (e.g. order of parts, how to attach springs/masses, "what do I do next", "step by step", "I'm stuck", "can't attach", "correct order", "how do I set up"), you must **NOT** give direct step-by-step instructions or the exact attachment order. Do NOT list "plank, then Spring 1, then pink mass, then Spring 2, then blue mass" or any variant of that sequence. Do NOT say "attach the pink mass before Spring 2" or "attach Spring 2 below the pink mass."
- Instead: respond only in a way that makes them **think**. Use questions: "In Level 1, what did you do first?" "What do you think could hang from the plank?" "Where might the second mass go in the chain?" "What did you do after the first spring in Level 1?" Suggest they try something and see what the simulation allows. Keep answers short (2–3 sentences) and only indirect for setup.
- **Exception – navigation only:** If they ask about **navigation or controls** (e.g. how to rotate camera, zoom, where a button is, single vs double click in general), give **direct** answers. Only the physical arrangement/setup of springs and masses in Level 2 must be indirect.
- Physics, formulas (F₁, F₂, extensions), and conceptual questions about Level 2 may still be explained clearly when they ask.

## Your Communication Style:
- Be conversational, warm, and clear. Answer questions about the experiment and physics accurately using the formulas and procedures in the knowledge base **for the current level only**.
- When a student is stuck on a step in **Level 1**, give a short direct hint first (e.g. "Try selecting the plank with one click, then double-click to move it to the center"), then offer to explain more if they want.
- In **Level 2**, for questions about **how to arrange or set up** the simulation, do not give the exact steps or order; use the Socratic style described above (questions, reminders of Level 1, "what do you think?").
- When they ask conceptual or calculation questions ("why does it stretch?", "what is the formula?"), explain clearly and correctly for **Level 1** if they are in Level 1; do not introduce Level 2 content.
- When appropriate, encourage them to try the next step themselves or to use "Take reading" to see the numbers (e.g. "Try changing the mass slider and click Take reading to see how F and x change").
- Keep replies concise but complete: usually 2–4 sentences. For formula questions, one sentence for the formula and one for what it means is enough.
- Use the current simulation state to tailor advice (e.g. if they have no springs attached, don't tell them to attach the mass yet).
- For off-topic questions, politely say you can only help with this experiment and spring dynamics.

## Recent User Actions:
${simulationState.recentActions ? simulationState.recentActions.map(action => 
  `- ${action.type}: ${JSON.stringify(action.details)}`
).join('\n') : 'No recent actions'}

Answer in a helpful, expert, and friendly way. Be accurate with formulas and procedures.`
}

// Level 2 only: indirect/Socratic responses for setup/arrangement (no direct steps or order).
// Navigation and physics/formulas are not handled here—they stay direct elsewhere.
function getLevel2SetupIndirectResponse(simulationState) {
  const { plankInCenter, attachedSprings, mass1Attached, massAttached } = simulationState
  if (!plankInCenter) {
    return "In Level 1, what did you do first before attaching any springs? Try applying the same idea here—what needs to be in place before things can hang from it?"
  }
  if (attachedSprings.length === 0) {
    return "Good—the plank is ready. In Level 1, what did you attach to the plank next? Think about what could hang from it in a chain."
  }
  if (attachedSprings.length === 1 && !mass1Attached) {
    return "You have one spring attached. In Level 1 you had two springs and then one mass at the bottom. Here there are two masses. Where do you think the first mass might go in the chain—and what would come after it?"
  }
  if (mass1Attached && attachedSprings.length === 1) {
    return "You've got the first spring and the pink mass in the chain. In a series, things are connected one after another. What do you think usually comes after a mass—another spring, or the final mass? Try thinking about what the second spring would need to hang from."
  }
  if (attachedSprings.length >= 2 && !massAttached) {
    return "You're close. In Level 1 the blue mass went at the very bottom of the chain. Here you have two masses—where might the second one fit? Try using what you know about the chain order."
  }
  return "Think about how Level 1 was ordered: support at top, then springs in a line, then mass at the bottom. Here you have two springs and two masses—how might that change where each piece goes? Try one step and see what the simulation allows."
}

// Rule-based responses for common scenarios (fallback when AI API unavailable)
export const getRuleBasedResponse = (userMessage, simulationState) => {
  const message = userMessage.toLowerCase().trim()
  
  console.log('Processing message:', message, 'Simulation state:', simulationState)
  
  // Check for off-topic questions
  const offTopicKeywords = ['weather', 'news', 'game', 'movie', 'food', 'music', 'politics']
  if (offTopicKeywords.some(keyword => message.includes(keyword))) {
    return "Sorry, I can not help with that. I can only help with conversations, questions and answers about this simulation."
  }

  // Level 1: do not reveal Level 2 procedure, setup, or hints. Redirect to complete Level 1 first.
  const level2Keywords = ['level 2', 'level2', 'two masses', 'two mass', 'pink mass', 'pink block', 'mass 1', 'challenge level', 'challenge mode', 'f₁', 'f₂', 'm₁', 'm₂']
  if (simulationState.level === 1 && level2Keywords.some(kw => message.includes(kw))) {
    return "You'll learn about the Level 2 experiment when you complete Level 1 and get to Level 2. For now, focus on this level: suspend the plank, attach both springs, attach the blue mass, adjust the sliders, and take a reading. I'm here to help with any of those steps!"
  }
  if (simulationState.level === 1 && (message.includes('what is level') || message.includes('difference between level') || message.includes('level 1 and 2'))) {
    return "Level 2 is a challenge level you unlock after completing Level 1. You'll find out how it works when you get there. Right now, let's master Level 1: two springs in series with one mass. Need a hint for the next step?"
  }
  
  // Greetings - more variations
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|sup|yo)/)) {
    return "Hello! I'm your AI assistant for this spring dynamics experiment. I can help with the steps, the physics, formulas, or anything about the simulation. What would you like to do first?"
  }
  
  // Thank you
  if (message.match(/(thank|thanks|thx)/)) {
    return "You're welcome! Feel free to ask me anything about the experiment. I'm here to help!"
  }
  
  // How are you
  if (message.match(/(how are you|how're you|what's up|wassup)/)) {
    return "I'm doing great, thanks for asking! I'm excited to help you learn about spring dynamics. Ready to start the experiment?"
  }
  
  // Knowledge quiz / knowledge test
  const quizKeywords = ['knowledge test', 'knowledge quiz', 'quiz', 'test', 'assessment']
  if (quizKeywords.some(kw => message.includes(kw))) {
    if (!simulationState.level1Complete) {
      return "The Knowledge quiz is locked until you complete the Level 1 experiment and take a reading. Suspend the plank, attach both springs, attach the blue mass, adjust the sliders, then click the green 'Take reading' button. After that, the Knowledge quiz button in the Control Panel will be available.";
    }
    return "To take the Knowledge quiz, click the green 'Knowledge quiz' button in the Control Panel. You'll answer 10 multiple-choice questions about this spring dynamics experiment. It checks what you learned from the simulation, but it does not use your real name—only your participant ID.";
  }

  // Help request
  if (message.includes('help') || message.includes('how do i') || message.includes('what do i do')) {
    if (simulationState.level === 2) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    if (simulationState.attachedSprings.length === 0 && !simulationState.plankInCenter) {
      return "Let's start by moving the plank! First, click on the brown plank once to select it (it will turn green). Then double-click it to move it to the suspended position in the center. Have you tried that?"
    } else if (simulationState.plankInCenter && simulationState.attachedSprings.length === 0) {
      return "Great! The plank is in position. Now try selecting a spring (single click to turn it green), then double-click it to attach it to the plank. This will be the first spring in your series chain."
    } else if (simulationState.attachedSprings.length === 1 && !simulationState.massAttached) {
      return "Good progress! You have 1 spring attached. For a series arrangement, you need at least 2 springs. Please attach the second spring - it will connect end-to-end below the first one with a demarcator between them."
    } else if (simulationState.attachedSprings.length >= 2 && !simulationState.massAttached) {
      return "Excellent! You have both springs attached in series. Now you can attach the blue mass block. Select the mass (single click), then double-click to attach it to the bottom of the last spring. Watch what happens!"
    } else {
      return "You're doing great! The experiment is set up. Try adjusting the spring stiffness or mass weight using the control panel to see how it affects the springs. Notice how each spring extends by a different amount in series! You can also click 'Take reading' to see the calculations."
    }
  }
  
  // Spring attachment issues
  if (message.includes('spring') && (message.includes('attach') || message.includes('connect'))) {
    if (simulationState.level === 2) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    if (!simulationState.plankInCenter) {
      return "Before attaching springs, make sure the plank is in its suspended center position. Double-click the plank to move it there first."
    }
    if (simulationState.level === 1) {
      return "To attach a spring: Select it (single click), then double-click. Spring 1 attaches to the plank, then Spring 2 attaches below Spring 1. Try it!"
    }
    return "To attach a spring: Select it (single click), then double-click. Spring 1 attaches to the plank. In Level 2, Spring 2 attaches below the pink mass (Mass 1). Try it!"
  }
  
  // Mass attachment issues (Level 2 setup → indirect; Level 2 physics at end can stay)
  if (message.includes('mass') || message.includes('block') || message.includes('pink')) {
    if (simulationState.level === 2) {
      // Setup/arrangement: indirect
      if (!simulationState.mass1Attached || !simulationState.massAttached || simulationState.attachedSprings.length < 2) {
        return getLevel2SetupIndirectResponse(simulationState)
      }
      // Both masses attached: physics/conceptual answer is fine
      return "Both masses are attached! Spring 1 supports both (F₁ = (m₁+m₂)g), Spring 2 supports only Mass 2 (F₂ = m₂g). Try the mass sliders and 'Take reading'."
    }
    if (simulationState.attachedSprings.length < 2) {
      return `You need at least 2 springs attached before you can add the blue mass. Currently you have ${simulationState.attachedSprings.length} spring(s). Please attach ${2 - simulationState.attachedSprings.length} more spring(s) first.`
    } else if (!simulationState.massAttached) {
      return "To attach the mass: Select the blue block (single click to turn it green), then double-click it. The mass will attach to the bottom of the last spring in your series chain."
    }
    return "The mass is attached! Notice how it stretches all the springs in series. The same force passes through all springs, but each spring extends by a different amount based on its stiffness. Try adjusting the values in the control panel."
  }
  
  // Series springs
  if (message.includes('series')) {
    if (simulationState.level === 2 && (message.includes('two mass') || message.includes('2 mass') || message.includes('both mass'))) {
      return "In Level 2 the arrangement is plank → Spring 1 → Mass 1 (pink) → Spring 2 → Mass 2 (blue). Spring 1 supports both masses so F₁ = (m₁+m₂)g; Spring 2 supports only Mass 2 so F₂ = m₂g. Each extends by x_i = F_i / k_i. So the forces differ: F₁ > F₂. Total extension is x₁ + x₂."
    }
    return "In series arrangement, springs are connected end-to-end. The same force passes through all springs, but each extends by x_i = F / k_i. The total extension is the sum: x_total = x1 + x2 + x3. The total spring constant is 1/k_total = 1/k1 + 1/k2 + 1/k3. Does that make sense?"
  }
  // (Level 1 users asking about "series" get the Level-1-only answer above; Level 2 details only when level === 2)

  // Normal modes / oscillation (Level 2)
  if ((message.includes('normal mode') || message.includes('oscillation') || message.includes('vibrat')) && simulationState.level === 2) {
    return "With two masses and two springs, the system has two degrees of freedom and two normal modes: one where the masses move together in phase, and one where they move in opposite directions. The frequencies depend on the masses and spring constants. In our simulation you see the motion; the same equivalent spring constant 1/k_eq = 1/k₁ + 1/k₂ applies for the static stretch."
  }
  
  // Parallel springs (user might ask about difference)
  if (message.includes('parallel')) {
    return "This experiment uses series arrangement, not parallel. In series, springs are end-to-end with the same force through all. In parallel, springs are side-by-side sharing the force. Would you like to learn more about the differences?"
  }
  
  // Stiffness
  if (message.includes('stiffness') || message.includes('spring constant')) {
    return "Spring stiffness (k) measures how resistant a spring is to deformation. Higher k means stiffer spring = less extension for the same force. Try changing the stiffness values in the control panel and observe what happens!"
  }
  
  // Hooke's Law
  if (message.includes('hooke')) {
    return "Hooke's Law states F = -kx, where F is force, k is spring constant, and x is displacement. The negative sign means the force opposes the displacement (restoring force). You can see this principle in action when the springs oscillate!"
  }
  
  // Calculations and formulas
  if (message.includes('calculate') || message.includes('formula') || message.includes('math')) {
    if (simulationState.level === 1) {
      return "Click the green 'Take reading' button in the control panel to see full calculations. In this level: F = m×g, each spring extends by x = F/k, total extension = F×(1/k₁+1/k₂)."
    }
    return "Click the green 'Take reading' button in the control panel to see full calculations. In Level 2: F₁ = (m₁+m₂)g, F₂ = m₂g; x₁ = F₁/k₁, x₂ = F₂/k₂."
  }
  if (message.includes('force') && (message.includes('formula') || message.includes('equation') || message.includes('how'))) {
    if (simulationState.level === 1) {
      return "Weight force: F = m × g (m in kg, g = 9.8 m/s²). In this level that same F goes through both springs. Use 'Take reading' to see the numbers."
    }
    return "Weight force: F = m × g. In Level 2, Spring 1 has F₁ = (m₁+m₂)g and Spring 2 has F₂ = m₂g. Use 'Take reading' to see the numbers."
  }
  if (message.includes('extension') && (message.includes('how') || message.includes('formula') || message.includes('calculate'))) {
    if (simulationState.level === 1) {
      return "Each spring extends by x = F/k (Hooke's law). So stiffer springs (higher k) extend less. Total extension is the sum of both spring extensions. Same F in both springs in this level."
    }
    return "Each spring extends by x = F/k (Hooke's law). In Level 2, x₁ = F₁/k₁ and x₂ = F₂/k₂, so total = x₁ + x₂."
  }
  if (message.includes('equivalent') || message.includes('k_eq') || message.includes('total spring constant')) {
    if (simulationState.level === 1) {
      return "For two springs in series, the equivalent spring constant is 1/k_eq = 1/k₁ + 1/k₂, so k_eq = (k₁×k₂)/(k₁+k₂). The combined spring is always softer than either one. Same force F goes through both in this level."
    }
    return "For two springs in series, 1/k_eq = 1/k₁ + 1/k₂. In Level 2 the two springs have different forces (F₁ and F₂) so we use x₁ = F₁/k₁ and x₂ = F₂/k₂ separately."
  }
  if (message.includes('gravity') || message.includes(' g ') || message.includes('9.8')) {
    return "We use g = 9.8 m/s² for gravity. Weight force is F = m×g, so a 1 kg mass weighs 9.8 N. That force is what stretches the springs when the mass is attached."
  }
  if (message.includes('hooke') || message.includes('f = kx') || message.includes('f=-kx')) {
    return "Hooke's Law: F = -kx. The spring force opposes the stretch (restoring force). So extension x = F/k when F is the tension. Stiffer spring (bigger k) means less extension for the same force."
  }
  if (message.includes('what happens') || message.includes('what if')) {
    if (message.includes('mass') || message.includes('increase m')) {
      if (simulationState.level === 1) {
        return "If you increase the mass, the weight F = m×g gets bigger, so every spring stretches more (x = F/k). Try the mass slider and Take reading to see the effect."
      }
      return "If you increase the mass, the weight F = m×g gets bigger, so every spring stretches more. In Level 2, changing either mass changes F₁ and possibly F₂; try the sliders and Take reading to see the effect."
    }
    if (message.includes('stiff') || message.includes('k ') || message.includes('spring constant')) {
      return "If you increase a spring's stiffness (k), that spring extends less for the same force (x = F/k). So the total extension goes down. Try the stiffness sliders and watch the springs."
    }
  }
  if (message.includes('why') && (message.includes('stretch') || message.includes('extend'))) {
    return "The spring stretches because the mass has weight (F = mg) pulling down. The spring pulls up with tension. At equilibrium, spring force equals weight, and the extension is x = F/k. So heavier mass or softer spring → more stretch."
  }
  if (message.includes('reset') || message.includes('start over')) {
    return "Click 'Reset Experiment' in the control panel. That puts the plank back on the floor and detaches all springs and masses so you can start again from the beginning."
  }
  if (message.includes('take reading') || message.includes('reading')) {
    return "Click the green 'Take reading' button in the control panel. It opens a box with the current forces, spring constants, extensions, and the formulas used. Very useful to check your understanding!"
  }
  if (message.includes('level 1') || message.includes('level 2') || message.includes('difference between level')) {
    if (simulationState.level === 1) {
      return "Level 1 is two springs in series with one mass at the bottom. Same force F = mg through both springs. You'll learn about Level 2 when you complete Level 1 and get there. Need a hint for the next step?"
    }
    return "Level 1 (Guided): One mass at the bottom, two springs in series. Same force F = mg through both springs. Level 2 (Challenge): Two masses — plank → Spring 1 → Mass 1 (pink) → Spring 2 → Mass 2 (blue). Here F₁ = (m₁+m₂)g and F₂ = m₂g, so the forces differ."
  }
  if (message.includes('what is series') || message.includes('meaning of series')) {
    return "Series means the springs are connected end-to-end in a line. The same force (in Level 1) passes through both; each stretches by x = F/k, and the total stretch is the sum. It's like one long spring that's softer than either spring alone."
  }
  if (message.includes('what is stiffness') || message.includes('what is k')) {
    return "Stiffness k (spring constant) is how much force is needed to stretch the spring by one unit of length. Higher k = stiffer = harder to stretch. Units are N/m. You can change k for each spring in the control panel."
  }
  
  // Controls
  if (
    message.includes('control') ||
    message.includes('mouse') ||
    message.includes('click') ||
    message.includes('how to use') ||
    message.includes('move around') ||
    message.includes('move the camera') ||
    message.includes('navigation') ||
    message.includes('navigate') ||
    message.includes('camera')
  ) {
    return "Single click = select (object turns green). Double click = do the action (move plank, attach spring or mass). Right-click + drag = rotate the camera. Mouse wheel = zoom. Drag the plank when it's selected to move it in 3D. You can also use W/A/S/D or the Arrow keys to move the camera forward, left, backward, and right around the experiment.";
  }
  
  // Questions about the AI itself
  if (message.match(/(who are you|what are you|your name|about you)/)) {
    return "I'm your AI assistant robot for this spring dynamics experiment! I can help you understand how springs work in series, guide you through the experiment, and answer your physics questions. What would you like to explore?"
  }
  
  // Can you hear me
  if (message.match(/(can you hear|do you hear|are you listening)/)) {
    return "Yes, I can hear you! I'm listening and ready to help. What would you like to know about the spring experiment?"
  }
  
  // Stuck / don't know what to do
  if (message.includes('stuck') || message.includes('don\'t know') || message.includes('dont know') || message.includes('first step') || message.includes('where do i start')) {
    if (simulationState.level === 2) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    return "Start by selecting the brown plank (one click), then double-click it to move it to the center. After that, attach the two springs one by one, then the blue mass. Ask me for any step in between!"
  }

  // Step-by-step / guide me / next step
  if (message.includes('guide me') || message.includes('step by step') || message.includes('step-by-step') || message.includes('what\'s next') || message.includes('whats next') || message.includes('next step')) {
    if (simulationState.level === 2) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    if (!simulationState.plankInCenter) return "Next: suspend the plank. Select it (one click), then double-click to move it to the center."
    if (simulationState.attachedSprings.length === 0) return "Next: attach Spring 1 to the plank (select, double-click)."
    if (simulationState.attachedSprings.length === 1) return "Next: attach Spring 2 below Spring 1 (select Spring 2, double-click)."
    if (!simulationState.massAttached) return "Next: attach the blue mass to the bottom of the chain (select the blue block, double-click). Then try Take reading!"
    return "Setup complete! Adjust the sliders and click Take reading to see forces and extensions."
  }

  // Arrange / arrangement / set up / correct order
  if (message.includes('arrange') || message.includes('arrangement') || message.includes('set up') || message.includes('setup') || message.includes('correct order') || message.includes('order of')) {
    if (simulationState.level === 2) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    return "For two springs and one mass: suspend the plank first, then attach Spring 1, then Spring 2, then the blue mass. One click to select, double-click to attach."
  }

  // Won't attach / doesn't attach / why won't / can't attach
  if (message.includes('won\'t attach') || message.includes('wont attach') || message.includes('doesn\'t attach') || message.includes('doesnt attach') || message.includes('why won\'t') || message.includes('cant attach') || message.includes('can\'t attach')) {
    if (simulationState.level === 2) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    if (!simulationState.plankInCenter) return "The plank must be suspended first. Click the plank once to select it, then double-click to move it to the center. After that, springs can attach."
    if ((message.includes('mass') || message.includes('block')) && simulationState.attachedSprings.length < 2) {
      return "You need both springs attached before the mass. Attach Spring 1 to the plank, then Spring 2, then try the mass again."
    }
    if (simulationState.level === 1) {
      return "Make sure you select the object first (one click until it turns green), then double-click to attach. Check that the plank is suspended and both springs are attached before the mass."
    }
    return "Make sure you select the object first (one click until it turns green), then double-click to attach. In Level 2 follow the order: S1 → pink mass → S2 → blue mass."
  }

  // What should I see / what do I see / results / what to expect
  if (message.includes('what should i see') || message.includes('what do i see') || message.includes('what to expect') || message.includes('what results')) {
    return "When it's set up correctly you'll see the springs hanging in a vertical chain with the mass(es) at the bottom. The springs will stretch and may oscillate. Heavier mass or softer spring (lower k) means more stretch. Click 'Take reading' to see the exact forces (F) and extensions (x) and the formulas."
  }

  // Behaviour / resistance / resist stretching
  if (message.includes('behaviour') || message.includes('behavior') || message.includes('resist') || message.includes('resistance') || message.includes('how do springs')) {
    if (simulationState.level === 1) {
      return "Springs resist stretching according to Hooke's law: F = kx. So stiffer springs (higher k) need more force to stretch the same amount. In this level both springs feel the same force F = mg from the single mass."
    }
    return "Springs resist stretching according to Hooke's law: F = kx. In Level 2 the top spring carries more force F₁ = (m₁+m₂)g than the bottom spring F₂ = m₂g."
  }

  // Two springs one mass / Level 1 setup
  if (message.includes('two springs one mass') || message.includes('one mass two springs') || message.includes('level 1') && message.includes('setup')) {
    return "Level 1 is two springs in series with one mass at the bottom. Same force F = m×g through both springs. Each extends by x = F/k, so the softer spring stretches more. Total extension = F/k₁ + F/k₂. Set it up: suspend plank → attach Spring 1 → attach Spring 2 → attach blue mass."
  }

  // Two springs two masses / Level 2 (setup → indirect; physics can stay)
  if ((message.includes('two springs two masses') || (message.includes('two masses') && message.includes('spring'))) && simulationState.level === 2) {
    if (message.includes('set up') || message.includes('setup') || message.includes('how') || message.includes('order') || message.includes('arrange')) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    return "Level 2 has two springs and two masses. Force on Spring 1 is F₁ = (m₁+m₂)g; on Spring 2 is F₂ = m₂g. Think about how the chain might be ordered from top to bottom—what did you do in Level 1?"
  }

  // Generic question words
  if (message.match(/^(what|why|how|when|where|who)/)) {
    if (simulationState.level === 1) {
      return "I can help with the experiment steps, spring physics, and formulas for this level (F = mg, x = F/k, series 1/k_eq = 1/k₁ + 1/k₂). What would you like to know?"
    }
    return "I can help with the experiment steps, spring physics, formulas (F₁, F₂, x₁, x₂), and the two-mass setup. What would you like to know?"
  }
  
  // Default response based on simulation state (Level 2 setup → indirect)
  if (simulationState.level === 2) {
    if (!simulationState.plankInCenter || simulationState.attachedSprings.length < 2 || !simulationState.mass1Attached || !simulationState.massAttached) {
      return getLevel2SetupIndirectResponse(simulationState)
    }
    return "Level 2 is set up: plank → S1 → M1 → S2 → M2. Spring 1 force F₁ = (m₁+m₂)g, Spring 2 force F₂ = m₂g. Try the mass sliders and 'Take reading'."
  }
  if (simulationState.attachedSprings.length === 0) {
    return "I'm here to help you with the experiment! Start by selecting the brown plank (click once to turn it green), then double-click it to move it to the center. After that, we can attach the springs in series. What would you like to know?"
  } else if (simulationState.attachedSprings.length === 1 && !simulationState.massAttached) {
    return "Good start! You have 1 spring attached. For a series arrangement, you need to attach the second spring too. Double-click the second spring to attach it below the first one. Then you can attach the mass."
  } else if (simulationState.attachedSprings.length >= 2 && !simulationState.massAttached) {
    return "Great! You have both springs attached in series. Now double-click the blue mass block to attach it to the bottom of the spring chain. Want to know more about what will happen?"
  } else if (simulationState.massAttached) {
    return "Excellent! The experiment is set up. Notice how in series, the same force passes through all springs, but each extends by a different amount based on its stiffness. Try adjusting the spring stiffness or mass weight in the control panel to see the effects. You can also click 'Take reading' to see the physics calculations!"
  }
  
  return "I'm here to help! I can answer questions about spring physics, explain the experiment steps, help with troubleshooting, or discuss the calculations. What interests you?"
}
