/**
 * Pool of ~100 multiple-choice questions for the spring dynamics knowledge quiz.
 * Each session gets 10 random questions to reduce answer-sharing between students.
 * Each question: question, options[], correctIndex, explanationCorrect, explanationsWrong[].
 */

function shuffleArray(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Returns n random questions from the pool (default 10). Call once per quiz session. */
export function getRandomQuizSet(n = 10) {
  const shuffled = shuffleArray(QUIZ_QUESTIONS_POOL)
  return shuffled.slice(0, n)
}

/** Full pool for reference; use getRandomQuizSet(10) for the actual quiz. */
export const QUIZ_QUESTIONS_POOL = [
  {
    id: 1,
    question: "What is the relationship between force and extension in a spring?",
    options: ["F = k / x", "F = kx", "F = x / k", "F = k + x"],
    correctIndex: 1,
    explanationCorrect: "Correct. Hooke's law states that the force F needed to extend a spring is proportional to the extension x, so F equals k times x, where k is the spring constant.",
    explanationsWrong: ["F = k over x would mean force decreases as extension increases, which is the opposite of how springs work.", "That's the inverse relationship; in Hooke's law, force is proportional to extension, not the other way around.", "Force and extension are not added; they are proportional. The correct relationship is F = kx."]
  },
  {
    id: 2,
    question: "When two springs are connected in series, what can you say about the force through them?",
    options: ["The force is different in each spring", "The same force passes through both springs", "The force is zero in the second spring", "The force doubles in the second spring"],
    correctIndex: 1,
    explanationCorrect: "Correct. In a series arrangement, the springs are connected end to end, so the same force is transmitted through both springs.",
    explanationsWrong: ["In series, the springs are in a line, so the same tension or load passes through both.", "The second spring still supports the weight below it, so the force is not zero.", "The force doesn't double; it's the same through both springs in series."]
  },
  {
    id: 3,
    question: "How do you find the total extension when two springs are in series?",
    options: ["Take the average of the two extensions", "Add the individual extensions together", "Use only the extension of the stiffer spring", "Subtract the smaller extension from the larger"],
    correctIndex: 1,
    explanationCorrect: "Correct. The total extension is the sum of each spring's extension: x total equals x1 plus x2, because each spring stretches according to the force on it.",
    explanationsWrong: ["Averages are used for other purposes; total stretch is the sum of both.", "Both springs contribute to the total stretch; we need both extensions.", "We add the extensions, not subtract them, to get the total length change."]
  },
  {
    id: 4,
    question: "What is the weight force on a mass due to gravity?",
    options: ["F = m / g", "F = mg", "F = g / m", "F = m + g"],
    correctIndex: 1,
    explanationCorrect: "Correct. The weight of an object is its mass m times the acceleration due to gravity g, so F = mg. That's the force that stretches the spring when the mass is hanging.",
    explanationsWrong: ["Dividing mass by g doesn't give force; weight is mass times g.", "We multiply mass by g to get weight, not divide g by mass.", "Force isn't mass plus g; it's mass multiplied by g."]
  },
  {
    id: 5,
    question: "If a spring has a higher spring constant k, what happens to its extension for the same force?",
    options: ["Extension increases", "Extension decreases", "Extension stays the same", "Extension becomes zero"],
    correctIndex: 1,
    explanationCorrect: "Correct. A stiffer spring has a higher k. Since x = F over k, a larger k means a smaller extension for the same force.",
    explanationsWrong: ["A stiffer spring stretches less for the same force, so extension decreases.", "Extension depends on F and k; changing k changes the extension.", "The spring still stretches; it just stretches less when k is higher."]
  },
  {
    id: 6,
    question: "When you increase the mass hanging from a spring, what happens to the extension?",
    options: ["Extension decreases", "Extension stays the same", "Extension increases", "Extension becomes zero"],
    correctIndex: 2,
    explanationCorrect: "Correct. A heavier mass has a larger weight F = mg, so the force on the spring increases. Since x = F over k, the extension increases.",
    explanationsWrong: ["More mass means more weight and more force, so the spring stretches more.", "The force changes with mass, so the extension changes too.", "The spring still stretches; with more mass it stretches more."]
  },
  {
    id: 7,
    question: "For two springs in series, how is the equivalent spring constant k_eq related to k1 and k2?",
    options: ["k_eq = k1 + k2", "1/k_eq = 1/k1 + 1/k2", "k_eq = k1 × k2", "k_eq = k1 = k2"],
    correctIndex: 1,
    explanationCorrect: "Correct. For springs in series, the reciprocals add: 1 over k_eq equals 1 over k1 plus 1 over k2. So the combined spring is softer than either spring alone.",
    explanationsWrong: ["We add the reciprocals of k, not k itself; k_eq is less than either k.", "The equivalent constant isn't the product; it's found from 1 over k1 plus 1 over k2.", "The two springs can have different k values; the formula uses both."]
  },
  {
    id: 8,
    question: "In this experiment, what is the correct order to set up the equipment?",
    options: ["Mass first, then springs, then plank", "Plank, then mass, then springs", "Plank, then springs, then mass", "Springs, then plank, then mass"],
    correctIndex: 2,
    explanationCorrect: "Correct. You suspend the plank first, then attach the springs in series to the plank, then attach the mass to the bottom of the last spring.",
    explanationsWrong: ["The mass attaches last, after the springs are in place.", "Springs go between the plank and the mass, not before the plank.", "The plank must be suspended first so the springs can attach to it."]
  },
  {
    id: 9,
    question: "What does the spring constant k represent?",
    options: ["The length of the spring", "The mass of the spring", "Stiffness: force per unit extension", "The extension of the spring"],
    correctIndex: 2,
    explanationCorrect: "Correct. The spring constant k is the stiffness: it tells you how much force is needed per unit of extension. Higher k means a stiffer spring.",
    explanationsWrong: ["k is not a length; it has units of force per length, like newtons per meter.", "k describes how the spring responds to force, not its mass.", "Extension changes with force; k is the constant that relates them."]
  },
  {
    id: 10,
    question: "If both springs in series have the same force F through them, how is each extension related to F?",
    options: ["Both extensions equal F", "x1 = F/k1 and x2 = F/k2", "x1 + x2 = F", "x1 = x2 = k"],
    correctIndex: 1,
    explanationCorrect: "Correct. Each spring extends by x = F over k. So the first spring extends by F over k1 and the second by F over k2. The stiffer spring stretches less.",
    explanationsWrong: ["Extension has units of length; F is force. Each extension is F divided by that spring's k.", "The sum of extensions is the total extension; each one is F over its own k.", "k is the constant; the extensions are F over k1 and F over k2."]
  },
  {
    id: 11,
    question: "What does the negative sign in F = -kx mean?",
    options: ["The force is always negative", "The restoring force opposes the displacement", "The spring constant is negative", "Extension must be negative"],
    correctIndex: 1,
    explanationCorrect: "Correct. The minus sign means the force the spring exerts opposes the direction of stretch or compression—it restores the spring toward equilibrium.",
    explanationsWrong: ["The force can be positive or negative depending on direction; the sign indicates opposition to displacement.", "The spring constant k is positive; the minus sign refers to the direction of force.", "Extension x can be positive (stretch) or negative (compression); the minus sign gives the correct force direction."]
  },
  {
    id: 12,
    question: "In the simulation, how do you attach a spring to the plank?",
    options: ["Right-click the spring", "Single-click the spring", "Select the spring with one click, then double-click to attach", "Drag the spring onto the plank"],
    correctIndex: 2,
    explanationCorrect: "Correct. You select an object with a single click (it turns green), then double-click to perform the attach action.",
    explanationsWrong: ["Right-click is used for rotating the camera, not for attaching.", "Single click only selects; you need to double-click to attach.", "Attachment is done by select then double-click, not by dragging."]
  },
  {
    id: 13,
    question: "Why must at least two springs be attached before you can attach the mass in Level 1?",
    options: ["The simulation does not allow one spring", "A series arrangement requires multiple springs", "The mass would be too heavy for one spring", "It is only a rule with no physics reason"],
    correctIndex: 1,
    explanationCorrect: "Correct. This experiment studies springs in series. With only one spring there is no series arrangement, so the setup requires at least two springs.",
    explanationsWrong: ["The simulation allows one spring, but the experiment is about series so we use two.", "The number of springs is about the experiment design (series), not about weight capacity.", "The rule reflects the physics: we are modeling two springs in series with one mass."]
  },
  {
    id: 14,
    question: "Which value of g is used for weight in this experiment?",
    options: ["10 m/s²", "9.8 m/s²", "9 m/s²", "It varies with the mass"],
    correctIndex: 1,
    explanationCorrect: "Correct. We use g = 9.8 m/s² as the standard acceleration due to gravity for calculating weight F = mg.",
    explanationsWrong: ["We use 9.8 m/s² for accuracy; 10 is sometimes used as an approximation.", "g is 9.8 m/s², not 9.", "g is a constant 9.8 m/s²; it does not change with the mass."]
  },
  {
    id: 15,
    question: "What happens to the total extension if you replace one spring with a stiffer spring (higher k)?",
    options: ["Total extension increases", "Total extension decreases", "Total extension stays the same", "It depends only on the mass"],
    correctIndex: 1,
    explanationCorrect: "Correct. For series springs the total extension is x1 + x2. A stiffer spring has smaller x for the same force, so the total extension decreases.",
    explanationsWrong: ["A stiffer spring stretches less, so total extension goes down.", "Changing k changes the extensions; total extension is not unchanged.", "Mass sets the force, but extension also depends on k; stiffer means less stretch."]
  },
  {
    id: 16,
    question: "Where is the 'Take reading' button located?",
    options: ["Top left of the screen", "On the plank", "In the Control Panel on the right", "At the bottom of the screen"],
    correctIndex: 2,
    explanationCorrect: "Correct. The Control Panel on the right side of the screen contains the sliders and the green 'Take reading' button.",
    explanationsWrong: ["The top left has the Finished and other navigation buttons, not Take reading.", "Take reading is in the Control Panel, not on the plank.", "The Control Panel is on the right, where Take reading lives."]
  },
  {
    id: 17,
    question: "What does 'springs in series' mean?",
    options: ["Springs side by side", "Springs connected end to end in a line", "Springs with the same stiffness", "Springs that move together"],
    correctIndex: 1,
    explanationCorrect: "Correct. In series, the springs are connected end to end so that the same force passes through each; they form a single chain.",
    explanationsWrong: ["Side by side would be parallel, not series.", "Series refers to how they are connected (end to end), not to having the same k.", "They do move together in a chain, but the key is end-to-end connection."]
  },
  {
    id: 18,
    question: "If you double the mass, what happens to the force on the springs (in Level 1)?",
    options: ["Force halves", "Force doubles", "Force stays the same", "Force quadruples"],
    correctIndex: 1,
    explanationCorrect: "Correct. Weight is F = mg, so doubling the mass doubles the force. That same force passes through both springs in series.",
    explanationsWrong: ["Doubling mass doubles weight, so force increases.", "Force equals weight, which depends on mass; it does not stay the same.", "Force is proportional to mass, so doubling mass doubles force, not quadruples."]
  },
  {
    id: 19,
    question: "How do you move the plank to the suspended position?",
    options: ["Drag it with the mouse", "Single-click the plank", "Single-click to select, then double-click to move it to the center", "Use the keyboard"],
    correctIndex: 2,
    explanationCorrect: "Correct. Click the plank once to select it (it turns green), then double-click to move it to the suspended position in the center.",
    explanationsWrong: ["Dragging moves it in 3D; the suspended position is set by double-click.", "Single click only selects; double-click performs the move to center.", "The action is select then double-click, not keyboard."]
  },
  {
    id: 20,
    question: "What is the unit of the spring constant k?",
    options: ["m (meters)", "kg (kilograms)", "N/m (newtons per meter)", "N (newtons)"],
    correctIndex: 2,
    explanationCorrect: "Correct. Spring constant k has units of force per length: newtons per meter (N/m). It tells how many newtons of force per meter of extension.",
    explanationsWrong: ["k is not a length; it is force per length.", "k is not mass; it has units N/m.", "k is force per unit extension (N/m), not force alone."]
  },
  { id: 21, question: "For series springs with the same force F, which spring stretches more?", options: ["The stiffer one (higher k)", "The softer one (lower k)", "Both stretch the same", "Neither stretches"], correctIndex: 1, explanationCorrect: "Correct. Since x = F/k, the spring with the smaller k (softer) has the larger extension for the same force.", explanationsWrong: ["The stiffer spring has larger k, so it stretches less.", "They have different k values, so their extensions differ.", "Both stretch, but by different amounts: x = F/k for each."] },
  { id: 22, question: "What does the 'Reset Experiment' button do?", options: ["Only resets the sliders", "Puts the plank back and detaches all springs and masses", "Restarts the level", "Clears the readings"], correctIndex: 1, explanationCorrect: "Correct. Reset Experiment returns the plank to the floor and detaches all springs and masses so you can set up again from the start.", explanationsWrong: ["Reset affects the whole setup, not just sliders.", "It resets the physical setup; level change is separate.", "It resets the experiment setup; readings are cleared when you take a new one."] },
  { id: 23, question: "In F = kx, what does x represent?", options: ["The length of the spring", "The extension or displacement from equilibrium", "The force", "The mass"], correctIndex: 1, explanationCorrect: "Correct. x is the extension—how far the spring is stretched or compressed from its natural (equilibrium) length.", explanationsWrong: ["x is the change in length (extension), not the total length.", "The force is F; x is the displacement.", "x is extension (length change), not mass."] },
  { id: 24, question: "Why does the Knowledge quiz button sometimes not appear?", options: ["It is always visible", "You must complete the experiment and take a reading first", "Only in Level 2", "After you click Finished"], correctIndex: 1, explanationCorrect: "Correct. The Knowledge quiz is unlocked only after you complete the full Level 1 setup and click 'Take reading'.", explanationsWrong: ["It appears only after completing the experiment and taking a reading.", "It unlocks in Level 1 after take reading, not only in Level 2.", "You don't need to click Finished first; take reading unlocks it."] },
  { id: 25, question: "How many springs are used in the Level 1 (Guided) setup?", options: ["One", "Two", "Three", "Four"], correctIndex: 1, explanationCorrect: "Correct. Level 1 uses two springs in series with one mass at the bottom.", explanationsWrong: ["Level 1 uses two springs in series.", "We use two springs, not three.", "Level 1 has two springs."] },
  { id: 26, question: "When the mass is attached and at rest, what is true about the spring force?", options: ["Spring force is zero", "Spring force equals the weight of the mass", "Spring force is greater than the weight", "Spring force is half the weight"], correctIndex: 1, explanationCorrect: "Correct. At equilibrium, the upward spring force balances the downward weight, so they are equal in magnitude.", explanationsWrong: ["At rest the spring force is not zero; it balances the weight.", "At equilibrium, spring force equals weight, not more.", "Spring force equals weight at equilibrium, not half."] },
  { id: 27, question: "What is the formula for total extension in two springs in series with force F?", options: ["x_total = F × (k1 + k2)", "x_total = F/k1 + F/k2", "x_total = F/(k1 + k2)", "x_total = k1 + k2"], correctIndex: 1, explanationCorrect: "Correct. Each spring extends by F/k, so total extension is x1 + x2 = F/k1 + F/k2 = F(1/k1 + 1/k2).", explanationsWrong: ["We add the extensions F/k1 and F/k2, not F times (k1+k2).", "Total extension is F/k1 + F/k2, not F divided by (k1+k2).", "Total extension has units of length; it is F/k1 + F/k2."] },
  { id: 28, question: "How do you rotate the camera view in the simulation?", options: ["Single-click and drag", "Right-click and drag", "Use the A and D keys", "Scroll the mouse wheel"], correctIndex: 1, explanationCorrect: "Correct. Right-click and drag rotates the camera so you can view the experiment from different angles.", explanationsWrong: ["Right-click + drag is for rotating the camera.", "A and D move the camera horizontally; right-drag rotates.", "Mouse wheel zooms; right-drag rotates."] },
  { id: 29, question: "What does a higher spring stiffness (higher k) mean?", options: ["The spring is easier to stretch", "The spring is harder to stretch", "The spring is longer", "The spring has more mass"], correctIndex: 1, explanationCorrect: "Correct. Higher k means more force is needed for a given extension, so the spring is harder to stretch (stiffer).", explanationsWrong: ["Higher k means harder to stretch, not easier.", "Stiffness is about force per extension, not length.", "k is stiffness, not mass."] },
  { id: 30, question: "In Level 1, what force does each spring experience?", options: ["Spring 1 has more force than Spring 2", "Spring 2 has more force than Spring 1", "Both experience the same force (the weight of the mass)", "The force is zero"], correctIndex: 2, explanationCorrect: "Correct. In series, the same force—the weight of the single mass—passes through both springs.", explanationsWrong: ["In series the force is the same through both springs.", "Both springs feel the same force in series.", "The weight of the mass is the force through both springs."] },
  { id: 31, question: "Which action do you use to zoom in or out?", options: ["Left-click and drag", "Right-click and drag", "Mouse wheel", "Double-click"], correctIndex: 2, explanationCorrect: "Correct. The mouse wheel zooms the camera in and out.", explanationsWrong: ["Left-drag is for other actions; wheel zooms.", "Right-drag rotates; wheel zooms.", "Double-click is for attach/move; wheel zooms."] },
  { id: 32, question: "If k1 = k2 for two springs in series, how does k_eq compare to k1?", options: ["k_eq = k1", "k_eq > k1", "k_eq < k1", "k_eq = 2*k1"], correctIndex: 2, explanationCorrect: "Correct. For series, 1/k_eq = 1/k1 + 1/k2, so k_eq is always less than either k. The combined spring is softer.", explanationsWrong: ["The equivalent is softer than each, so k_eq < k1.", "k_eq is less than k1 for series.", "We add reciprocals; k_eq = k1/2 when k1=k2, so k_eq < k1."] },
  { id: 33, question: "What color does an object turn when you select it?", options: ["Blue", "Red", "Green", "Yellow"], correctIndex: 2, explanationCorrect: "Correct. When you single-click to select an object, it turns green to show it is selected.", explanationsWrong: ["Selected objects turn green.", "Green indicates selection.", "The selection highlight is green."] },
  { id: 34, question: "What is the blue block in the simulation?", options: ["The plank", "The mass (or Mass 2 in Level 2)", "A spring", "The robot"], correctIndex: 1, explanationCorrect: "Correct. The blue block is the mass that hangs from the spring(s). In Level 2 it is Mass 2; in Level 1 it is the only mass.", explanationsWrong: ["The plank is brown; the blue block is the mass.", "The blue block is the mass.", "The blue block represents the mass."] },
  { id: 35, question: "In the equivalent spring constant formula for series, 1/k_eq = 1/k1 + 1/k2, what is true about k_eq?", options: ["k_eq is the average of k1 and k2", "k_eq is always less than the smaller of k1 and k2", "k_eq is always between k1 and k2", "k_eq equals k1 + k2"], correctIndex: 2, explanationCorrect: "Correct. For two springs in series, k_eq is less than both k1 and k2, and lies between them in the sense that 1/k_eq is the sum of reciprocals.", explanationsWrong: ["k_eq is not the average; it comes from 1/k_eq = 1/k1 + 1/k2.", "k_eq is less than both k1 and k2, so it's less than the smaller one.", "We don't add k1 and k2; we add their reciprocals."] },
  { id: 36, question: "Why might the mass not attach when you double-click it?", options: ["You need only one spring attached", "You need at least two springs attached first", "The plank must be on the floor", "You must use the keyboard"], correctIndex: 1, explanationCorrect: "Correct. In Level 1 you need both springs attached in series before the mass can be attached.", explanationsWrong: ["You need two springs, not one.", "The plank should be suspended for the springs; then two springs, then mass.", "Attachment is by select and double-click, not keyboard."] },
  { id: 37, question: "What quantity does the 'Take reading' button display?", options: ["Only the mass", "Forces, spring constants, extensions, and formulas", "Only the extension", "Only the stiffness"], correctIndex: 1, explanationCorrect: "Correct. Take reading shows the current forces, spring constants, extensions, and the formulas used for the setup.", explanationsWrong: ["It shows forces, k, extensions, and formulas.", "It shows more than extension alone.", "It shows forces, extensions, and formulas, not just stiffness."] },
  { id: 38, question: "If you double the spring constant of one spring, what happens to the total extension?", options: ["Total extension doubles", "Total extension halves", "Total extension decreases (but not necessarily by half)", "Total extension stays the same"], correctIndex: 2, explanationCorrect: "Correct. Total extension is F/k1 + F/k2. Doubling one k reduces that spring's extension, so total extension decreases.", explanationsWrong: ["Doubling k reduces that spring's extension, so total decreases.", "Total extension goes down when one k increases.", "The other spring's extension is unchanged; total still decreases."] },
  { id: 39, question: "What does 'equivalent spring constant' mean for two springs in series?", options: ["The average of the two constants", "One spring that would stretch the same as the two together under the same force", "The sum of the two constants", "The stiffer of the two"], correctIndex: 1, explanationCorrect: "Correct. The equivalent spring constant k_eq is the constant of a single spring that would give the same total extension as the two in series for the same force.", explanationsWrong: ["k_eq is not the average; it comes from 1/k_eq = 1/k1 + 1/k2.", "That's the idea: one spring behaving like the pair.", "We don't add k1 and k2; the equivalent is found from reciprocals."] },
  { id: 40, question: "In Level 2, how many masses are there?", options: ["One", "Two (pink and blue)", "Three", "None"], correctIndex: 1, explanationCorrect: "Correct. Level 2 has two masses: Mass 1 (pink) and Mass 2 (blue), with two springs in the chain.", explanationsWrong: ["Level 2 has two masses.", "There are two masses in Level 2.", "Level 2 includes the pink and blue masses."] },
  { id: 41, question: "What is Hooke's Law?", options: ["F = ma", "F = -kx", "E = mc²", "v = u + at"], correctIndex: 1, explanationCorrect: "Correct. Hooke's Law is F = -kx.", explanationsWrong: ["F = ma is Newton's second law.", "Hooke's Law is F = -kx.", "Other options are different formulas."] },
  { id: 42, question: "Which spring stretches more in Level 1 for the same force?", options: ["The one with higher k", "The one with lower k", "Both the same", "Neither"], correctIndex: 1, explanationCorrect: "Correct. x = F/k, so lower k means more extension.", explanationsWrong: ["Higher k means less extension.", "Softer spring (lower k) stretches more.", "Different k means different extensions."] },
  { id: 43, question: "Where are the spring stiffness sliders?", options: ["On the plank", "In the Control Panel", "Bottom left", "In the quiz"], correctIndex: 1, explanationCorrect: "Correct. The Control Panel on the right has the sliders.", explanationsWrong: ["Sliders are in the Control Panel.", "Control Panel has the sliders.", "Spring stiffness is in the Control Panel."] },
  { id: 44, question: "Correct order in Level 2?", options: ["Plank, S1, S2, Pink, Blue", "Plank, S1, Pink, S2, Blue", "Plank, Pink, S1, Blue, S2", "S1, Plank, S2, Pink, Blue"], correctIndex: 1, explanationCorrect: "Correct. Plank, Spring 1, Mass 1 (pink), Spring 2, Mass 2 (blue).", explanationsWrong: ["Pink goes after S1, before S2.", "Order: plank, S1, pink, S2, blue.", "S2 attaches below pink mass."] },
  { id: 45, question: "In Level 2, which force is larger?", options: ["F2", "They are equal", "F1 is larger or equal", "F1 is half of F2"], correctIndex: 2, explanationCorrect: "Correct. F1 = (m1+m2)g, F2 = m2*g, so F1 ≥ F2.", explanationsWrong: ["Spring 1 carries more weight.", "F1 = (m1+m2)g, F2 = m2*g.", "F1 supports both masses."] },
  { id: 46, question: "How do you select an object?", options: ["Double-click", "Right-click", "Single-click", "Hover"], correctIndex: 2, explanationCorrect: "Correct. Single click selects (green); then double-click to act.", explanationsWrong: ["Single click selects first.", "Single click selects the object.", "Selection is single click."] },
  { id: 47, question: "Mass slider range?", options: ["0–10 kg", "0–5 kg", "1–10 kg", "0–3 kg"], correctIndex: 1, explanationCorrect: "Correct. Mass sliders go from 0 to 5 kg.", explanationsWrong: ["Range is 0–5 kg.", "0 to 5 kg.", "Sliders are 0–5 kg."] },
  { id: 48, question: "Spring stiffness slider range?", options: ["0–50", "2–50 N/m²", "1–100", "5–50"], correctIndex: 1, explanationCorrect: "Correct. Stiffness from 2 to 50 N/m².", explanationsWrong: ["2–50 N/m².", "Minimum 2, max 50.", "Sliders 2 to 50."] },
  { id: 49, question: "Why do springs oscillate?", options: ["Gravity only", "Restoring force and inertia", "Friction", "Simulation only"], correctIndex: 1, explanationCorrect: "Correct. Restoring force and inertia cause overshoot and oscillation.", explanationsWrong: ["Restoring force and inertia.", "Spring force and mass inertia.", "Real physics causes oscillation."] },
  { id: 50, question: "What is the pink block in Level 2?", options: ["Spring 1", "Mass 1", "The plank", "Mass 2"], correctIndex: 1, explanationCorrect: "Correct. Pink block is Mass 1, between Spring 1 and Spring 2.", explanationsWrong: ["Pink is Mass 1.", "It's Mass 1.", "Pink = Mass 1, blue = Mass 2."] },
  { id: 51, question: "What is the unit of extension x?", options: ["N (newtons)", "kg", "m (meters)", "N/m"], correctIndex: 2, explanationCorrect: "Correct. Extension is a length, so its unit is meters (m).", explanationsWrong: ["Extension is length, not force.", "Mass is kg; extension is length.", "N/m is for k, not x."] },
  { id: 52, question: "In series, if k1 is very large (very stiff), what happens to that spring's extension?", options: ["It is very large", "It is nearly zero", "It equals the other spring's", "It is negative"], correctIndex: 1, explanationCorrect: "Correct. x = F/k; very large k means very small x.", explanationsWrong: ["Stiff spring stretches very little.", "Nearly zero extension for very stiff.", "Large k gives small x."] },
  { id: 53, question: "What does the green 'Take reading' button show?", options: ["Only mass and g", "Forces, k values, extensions, and formulas", "Only the level", "Only spring colors"], correctIndex: 1, explanationCorrect: "Correct. Take reading displays forces, spring constants, extensions, and the formulas.", explanationsWrong: ["It shows more: forces, k, extensions, formulas.", "It shows numerical results and formulas.", "Level and colors are not in the reading."] },
  { id: 54, question: "How do you attach the second spring in Level 1?", options: ["Attach to the plank", "Attach to the bottom of the first spring", "Attach to the mass", "Drag onto the first spring"], correctIndex: 1, explanationCorrect: "Correct. The second spring attaches to the bottom of the first spring.", explanationsWrong: ["First spring attaches to plank; second to first.", "Second spring goes below the first.", "Attach to the bottom of Spring 1."] },
  { id: 55, question: "When is the system in equilibrium?", options: ["When moving fast", "When spring force balances weight and acceleration is zero", "When mass is zero", "When k is zero"], correctIndex: 1, explanationCorrect: "Correct. Equilibrium is when net force is zero (spring force = weight) and the mass is at rest.", explanationsWrong: ["At rest with balanced forces.", "Equilibrium means no acceleration.", "Spring force equals weight at rest."] },
  { id: 56, question: "What is weight?", options: ["Mass times acceleration", "Mass times g (gravity)", "Force times extension", "k times x"], correctIndex: 1, explanationCorrect: "Correct. Weight is F = mg.", explanationsWrong: ["Weight is mg, not mass times arbitrary acceleration.", "Weight is mg.", "kx is spring force, not weight."] },
  { id: 57, question: "In Level 2, what force does Spring 2 experience?", options: ["(m1 + m2)g", "m2 g only", "m1 g only", "Zero"], correctIndex: 1, explanationCorrect: "Correct. Spring 2 supports only Mass 2, so F2 = m2*g.", explanationsWrong: ["Spring 2 supports only the blue mass.", "F2 = m2*g.", "Spring 1 supports both; Spring 2 supports m2 only."] },
  { id: 58, question: "Why add springs in series in this experiment?", options: ["To make the spring stiffer", "To study how total extension and equivalent k work", "To reduce the force", "To avoid oscillation"], correctIndex: 1, explanationCorrect: "Correct. The experiment explores series combination: total extension and equivalent spring constant.", explanationsWrong: ["Series makes combined spring softer.", "We study series behavior.", "Goal is to understand series springs."] },
  { id: 59, question: "What happens if you try to attach the mass before two springs are attached?", options: ["It attaches anyway", "The mass cannot be attached yet", "One spring is enough", "The plank resets"], correctIndex: 1, explanationCorrect: "Correct. In Level 1 you must attach two springs first, then the mass.", explanationsWrong: ["Two springs required first.", "Setup order: two springs then mass.", "Mass attaches last."] },
  { id: 60, question: "Which formula gives the extension of one spring?", options: ["x = k/F", "x = F/k", "x = F + k", "x = F k"], correctIndex: 1, explanationCorrect: "Correct. From F = kx we get x = F/k.", explanationsWrong: ["x = F/k, not k/F.", "Extension is F divided by k.", "x = F/k."] },
  { id: 61, question: "What does 'series' mean for springs?", options: ["Same stiffness", "Connected in a line, same force through each", "Side by side", "Same length"], correctIndex: 1, explanationCorrect: "Correct. In series, springs are in a line and the same force passes through each.", explanationsWrong: ["Series = end to end, same force.", "Not side by side; that's parallel.", "Series is about connection and force."] },
  { id: 62, question: "Where is the Reset Experiment button?", options: ["Top left", "In the Control Panel", "On the plank", "Bottom center"], correctIndex: 1, explanationCorrect: "Correct. Reset Experiment is in the Control Panel.", explanationsWrong: ["Control Panel has Reset.", "It's in the Control Panel.", "Right-side panel has Reset."] },
  { id: 63, question: "If mass increases, what happens to extension (same k)?", options: ["Extension decreases", "Extension increases", "Stays the same", "Becomes zero"], correctIndex: 1, explanationCorrect: "Correct. More mass means more weight F = mg, so x = F/k increases.", explanationsWrong: ["More force, more extension.", "x = F/k; F increases so x increases.", "Extension increases with mass."] },
  { id: 64, question: "What is k_eq for two identical springs in series (each with k)?", options: ["k_eq = k", "k_eq = 2k", "k_eq = k/2", "k_eq = k²"], correctIndex: 2, explanationCorrect: "Correct. 1/k_eq = 1/k + 1/k = 2/k, so k_eq = k/2.", explanationsWrong: ["Equivalent is softer: k_eq = k/2.", "1/k_eq = 2/k gives k_eq = k/2.", "Two in series gives half the stiffness."] },
  { id: 65, question: "How do you know an object is selected?", options: ["It turns blue", "It turns green", "It disappears", "It flashes"], correctIndex: 1, explanationCorrect: "Correct. Selected objects turn green.", explanationsWrong: ["Green indicates selection.", "Selection is shown by green.", "Green = selected."] },
  { id: 66, question: "In Level 1, what is the force through Spring 1?", options: ["Half the weight", "Equal to the weight of the mass", "Zero", "Double the weight"], correctIndex: 1, explanationCorrect: "Correct. The same force (weight of the mass) passes through both springs.", explanationsWrong: ["Same force through both springs.", "Force = weight of mass.", "Spring 1 carries the full weight."] },
  { id: 67, question: "What does the negative sign in F = -kx indicate?", options: ["Force is negative", "Direction: force opposes displacement", "k is negative", "x must be negative"], correctIndex: 1, explanationCorrect: "Correct. The minus sign means the force opposes the displacement (restoring force).", explanationsWrong: ["Direction of force vs displacement.", "Restoring force opposes stretch.", "Minus sign = opposition."] },
  { id: 68, question: "Which value of g is used here?", options: ["10", "9.8", "9", "Depends on mass"], correctIndex: 1, explanationCorrect: "Correct. g = 9.8 m/s² is used.", explanationsWrong: ["We use 9.8 m/s².", "g is 9.8.", "Constant 9.8 m/s²."] },
  { id: 69, question: "Total extension for two springs in series equals?", options: ["x1 only", "x1 + x2", "x1 - x2", "The larger of x1, x2"], correctIndex: 1, explanationCorrect: "Correct. Total extension is the sum of the two extensions.", explanationsWrong: ["We add both extensions.", "x_total = x1 + x2.", "Sum of individual extensions."] },
  { id: 70, question: "What is the plank?", options: ["A spring", "The fixed support from which springs hang", "A mass", "The blue block"], correctIndex: 1, explanationCorrect: "Correct. The plank is the support; springs attach below it.", explanationsWrong: ["Plank is the top support.", "Springs hang from the plank.", "Plank is not a spring or mass."] },
  { id: 71, question: "If k1 = 10 and k2 = 10 (N/m), what is k_eq?", options: ["20", "10", "5", "100"], correctIndex: 2, explanationCorrect: "Correct. 1/k_eq = 1/10 + 1/10 = 2/10, so k_eq = 5 N/m.", explanationsWrong: ["k_eq = k/2 = 5.", "Add reciprocals: 1/10+1/10 = 2/10, k_eq=5.", "Equivalent stiffness is 5 N/m."] },
  { id: 72, question: "How do you zoom?", options: ["Right-drag", "Mouse wheel", "Double-click", "A/D keys"], correctIndex: 1, explanationCorrect: "Correct. Mouse wheel zooms in and out.", explanationsWrong: ["Wheel zooms.", "Scroll to zoom.", "Mouse wheel for zoom."] },
  { id: 73, question: "When is the Knowledge quiz available?", options: ["From the start", "After completing setup and taking a reading", "Only in Level 2", "After Reset"], correctIndex: 1, explanationCorrect: "Correct. Complete the experiment and click Take reading to unlock the quiz.", explanationsWrong: ["Unlock after take reading.", "After setup and take reading.", "Complete experiment first."] },
  { id: 74, question: "What does stiffer mean?", options: ["Longer spring", "Higher k, harder to stretch", "Softer", "More mass"], correctIndex: 1, explanationCorrect: "Correct. Stiffer = higher k = more force needed per unit extension.", explanationsWrong: ["Stiffer = higher k.", "Harder to stretch = stiffer.", "k higher means stiffer."] },
  { id: 75, question: "In Level 2, Spring 1 supports which masses?", options: ["Only Mass 1", "Mass 1 and Mass 2 (both)", "Only Mass 2", "None"], correctIndex: 1, explanationCorrect: "Correct. Spring 1 supports the whole chain: Mass 1 and Mass 2.", explanationsWrong: ["Spring 1 carries both masses.", "F1 = (m1+m2)g.", "Both pink and blue."] },
  { id: 76, question: "What is F = kx used for?", options: ["Weight", "Spring force and extension", "Velocity", "Energy"], correctIndex: 1, explanationCorrect: "Correct. F = kx relates spring force to extension.", explanationsWrong: ["Hooke's law: force and extension.", "Spring force vs extension.", "F = kx is Hooke's law."] },
  { id: 77, question: "How many springs in Level 1?", options: ["1", "2", "3", "4"], correctIndex: 1, explanationCorrect: "Correct. Level 1 uses two springs in series.", explanationsWrong: ["Two springs in Level 1.", "We use two springs.", "Level 1 has two springs."] },
  { id: 78, question: "Equivalent spring constant for series: 1/k_eq = ?", options: ["k1 + k2", "1/k1 + 1/k2", "k1 k2", "k1 - k2"], correctIndex: 1, explanationCorrect: "Correct. 1/k_eq = 1/k1 + 1/k2.", explanationsWrong: ["Reciprocals add.", "1/k1 + 1/k2.", "Not k1+k2; reciprocals."] },
  { id: 79, question: "What does Take reading display?", options: ["Only extension", "Forces, k, extensions, formulas", "Only mass", "Only g"], correctIndex: 1, explanationCorrect: "Correct. It shows forces, spring constants, extensions, and formulas.", explanationsWrong: ["It shows forces, k, x, formulas.", "Multiple quantities and formulas.", "Full reading, not just one value."] },
  { id: 80, question: "At equilibrium, spring force vs weight?", options: ["Spring force is zero", "Spring force equals weight", "Spring force is greater", "Weight is zero"], correctIndex: 1, explanationCorrect: "Correct. At rest, spring force balances weight (equal magnitude).", explanationsWrong: ["They balance at equilibrium.", "Equal in magnitude.", "Spring force = weight at rest."] },
  { id: 81, question: "Which action attaches a spring?", options: ["Drag", "Select then double-click", "Right-click", "Press Enter"], correctIndex: 1, explanationCorrect: "Correct. Single-click to select, double-click to attach.", explanationsWrong: ["Select then double-click.", "Double-click after selecting.", "Same as other attachments."] },
  { id: 82, question: "Unit of force in this experiment?", options: ["kg", "m", "N (newtons)", "N/m"], correctIndex: 2, explanationCorrect: "Correct. Force is in newtons (N).", explanationsWrong: ["Force in N.", "Newtons.", "N for force."] },
  { id: 83, question: "Softer spring means?", options: ["Higher k", "Lower k", "Same k", "Zero k"], correctIndex: 1, explanationCorrect: "Correct. Softer = lower k = easier to stretch.", explanationsWrong: ["Softer = lower k.", "Lower k = softer.", "Small k = softer."] },
  { id: 84, question: "In Level 2, extension of Spring 2 depends on?", options: ["m1 only", "m2 and k2", "m1 + m2 only", "k1 only"], correctIndex: 1, explanationCorrect: "Correct. Spring 2 extension is F2/k2 = (m2*g)/k2.", explanationsWrong: ["x2 = F2/k2, F2 = m2*g.", "m2 and k2 determine x2.", "Spring 2: force m2*g, stiffness k2."] },
  { id: 85, question: "Why two springs in Level 1?", options: ["To study series", "One is enough", "To double the force", "To reduce extension"], correctIndex: 0, explanationCorrect: "Correct. The experiment is about springs in series.", explanationsWrong: ["We study series combination.", "Two springs in series.", "Experiment design: series."] },
  { id: 86, question: "Camera rotation?", options: ["Left-drag", "Right-drag", "Wheel", "Double-click"], correctIndex: 1, explanationCorrect: "Correct. Right-click and drag to rotate the camera.", explanationsWrong: ["Right-drag rotates.", "Camera: right-drag.", "Rotate with right mouse."] },
  { id: 87, question: "What is the blue block in Level 1?", options: ["Spring", "The mass", "Plank", "Support"], correctIndex: 1, explanationCorrect: "Correct. The blue block is the mass hanging from the springs.", explanationsWrong: ["Blue = mass.", "It's the mass.", "Mass is blue."] },
  { id: 88, question: "Doubling mass (same k) changes extension how?", options: ["Halves", "Doubles", "Unchanged", "Quadruples"], correctIndex: 1, explanationCorrect: "Correct. F = mg doubles, so x = F/k doubles.", explanationsWrong: ["Force doubles, extension doubles.", "x proportional to F.", "Doubling F doubles x."] },
  { id: 89, question: "Reset Experiment does what?", options: ["Only sliders", "Resets plank and detaches springs and masses", "Only readings", "Restarts level"], correctIndex: 1, explanationCorrect: "Correct. Reset returns plank and detaches springs and masses.", explanationsWrong: ["Full setup reset.", "Plank and attachments reset.", "Start over with setup."] },
  { id: 90, question: "x = F/k implies: for same F, higher k gives?", options: ["Larger x", "Smaller x", "Same x", "Zero x"], correctIndex: 1, explanationCorrect: "Correct. x = F/k, so higher k means smaller x.", explanationsWrong: ["Higher k, smaller x.", "Stiffer stretches less.", "Inverse relation."] },
  { id: 91, question: "Level 2 has how many springs?", options: ["1", "2", "3", "0"], correctIndex: 1, explanationCorrect: "Correct. Level 2 also has two springs in series.", explanationsWrong: ["Two springs in Level 2.", "Same as Level 1: two springs.", "Two springs."] },
  { id: 92, question: "Weight formula?", options: ["F = kx", "F = mg", "F = ma", "F = mv"], correctIndex: 1, explanationCorrect: "Correct. Weight is F = mg.", explanationsWrong: ["Weight = mg.", "F = mg for weight.", "mg is weight."] },
  { id: 93, question: "Where is Control Panel?", options: ["Top", "Right side", "Left", "Bottom"], correctIndex: 1, explanationCorrect: "Correct. Control Panel is on the right.", explanationsWrong: ["On the right.", "Right side of screen.", "Sliders and buttons on right."] },
  { id: 94, question: "Selection highlight color?", options: ["Red", "Blue", "Green", "Yellow"], correctIndex: 2, explanationCorrect: "Correct. Selected objects turn green.", explanationsWrong: ["Green for selection.", "Selection = green.", "Green highlight."] },
  { id: 95, question: "What does k represent?", options: ["Mass", "Stiffness (force per unit extension)", "Length", "Velocity"], correctIndex: 1, explanationCorrect: "Correct. k is stiffness: force per unit extension.", explanationsWrong: ["k = stiffness.", "Force per extension.", "N/m = stiffness."] },
  { id: 96, question: "Same force through both springs in Level 1?", options: ["No", "Yes", "Only Spring 1", "Only Spring 2"], correctIndex: 1, explanationCorrect: "Correct. In series, the same force passes through both springs.", explanationsWrong: ["Yes, same force in series.", "Same force through both.", "Series: same force."] },
  { id: 97, question: "How to move plank to center?", options: ["Drag", "Select then double-click", "Right-click", "Keyboard"], correctIndex: 1, explanationCorrect: "Correct. Select plank, then double-click to move to suspended position.", explanationsWrong: ["Select then double-click.", "Double-click after select.", "Same as other actions."] },
  { id: 98, question: "Total extension x1 + x2 for same F?", options: ["F/k1 only", "F/k1 + F/k2", "F/(k1+k2)", "F k1 k2"], correctIndex: 1, explanationCorrect: "Correct. Each extends by F/k, so total = F/k1 + F/k2.", explanationsWrong: ["x_total = F/k1 + F/k2.", "Sum of F/k for each.", "Add the two extensions."] },
  { id: 99, question: "In Level 2, F1 vs F2?", options: ["F1 < F2", "F1 = F2", "F1 > F2 (or equal if m1=0)", "F1 = 2 F2"], correctIndex: 2, explanationCorrect: "Correct. F1 = (m1+m2)g ≥ F2 = m2*g.", explanationsWrong: ["Spring 1 carries more or equal.", "F1 supports both masses.", "F1 ≥ F2."] },
  { id: 100, question: "What is measured by 'Take reading'?", options: ["Only mass", "Forces, spring constants, extensions, and formulas", "Only g", "Only level"], correctIndex: 1, explanationCorrect: "Correct. Take reading shows forces, k values, extensions, and the formulas.", explanationsWrong: ["It shows forces, k, extensions, formulas.", "Multiple quantities.", "Full reading display."] }
]