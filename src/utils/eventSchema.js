/**
 * Normalized event schema for data collection.
 * Each event is one row with explicit columns (no packed "details").
 * Used for Supabase table and CSV export.
 */

export const EVENT_CATEGORIES = {
  session: 'session',
  setup: 'setup',
  control: 'control',
  ai: 'ai',
  movement: 'movement',
  quiz: 'quiz'
}

/**
 * Maps eventType + details into a single row object with explicit columns.
 * @param {string} userId
 * @param {string} eventType
 * @param {Object} details
 * @returns {Object} Row with columns: user_id, timestamp, event_type, event_category, level, object_id, direction, numeric_value, message_text, response_text, position_x, position_y, position_z, total_attached, attached_springs_count, fail_reason, robot_active, to_level, spring_stiffness_1, spring_stiffness_2, mass_weight, mass_weight_1
 */
export function eventToRow(userId, eventType, details = {}) {
  const timestamp = new Date().toISOString()
  const row = {
    user_id: userId || '',
    session_id: null,
    timestamp,
    event_type: eventType,
    event_category: getEventCategory(eventType),
    level: null,
    object_id: null,
    direction: null,
    numeric_value: null,
    message_text: null,
    response_text: null,
    position_x: null,
    position_y: null,
    position_z: null,
    total_attached: null,
    attached_springs_count: null,
    fail_reason: null,
    robot_active: null,
    to_level: null,
    spring_stiffness_1: null,
    spring_stiffness_2: null,
    mass_weight: null,
    mass_weight_1: null
  }

  switch (eventType) {
    case 'EXPERIMENT_STARTED':
    case 'EXPERIMENT_FINISHED':
      break

    case 'LEVEL_CHANGED':
      row.to_level = details.toLevel ?? null
      break

    case 'PLANK_SELECTED':
    case 'PLANK_MOVED_TO_CENTER':
    case 'PLANK_UNSUSPENDED_RESET':
      row.object_id = 'plank'
      if (details.position && Array.isArray(details.position)) {
        row.position_x = details.position[0] ?? null
        row.position_y = details.position[1] ?? null
        row.position_z = details.position[2] ?? null
      }
      break

    case 'SPRING_ATTACHED':
    case 'SPRING_DETACHED':
    case 'SPRING_SELECTED':
      row.object_id = details.springId ?? null
      row.total_attached = details.totalAttached ?? null
      if (details.position && Array.isArray(details.position)) {
        row.position_x = details.position[0] ?? null
        row.position_y = details.position[1] ?? null
        row.position_z = details.position[2] ?? null
      }
      break

    case 'SPRING_STIFFNESS_CHANGED':
      row.object_id = details.springId ?? null
      row.numeric_value = details.value ?? null
      if (details.springId === 'spring1') row.spring_stiffness_1 = details.value ?? null
      if (details.springId === 'spring2') row.spring_stiffness_2 = details.value ?? null
      break

    case 'MASS_WEIGHT_CHANGED':
      row.numeric_value = details.value ?? null
      row.mass_weight = details.value ?? null
      break

    case 'MASS_WEIGHT1_CHANGED':
      row.numeric_value = details.value ?? null
      row.mass_weight_1 = details.value ?? null
      break

    case 'TAKE_READING_CLICKED':
      if (details.springStiffness) {
        row.spring_stiffness_1 = details.springStiffness.spring1 ?? null
        row.spring_stiffness_2 = details.springStiffness.spring2 ?? null
      }
      row.mass_weight = details.massWeight ?? null
      row.mass_weight_1 = details.massWeight1 ?? null
      break

    case 'MASS_ATTACHED':
    case 'MASS_ATTACH_FAILED':
    case 'MASS_DETACHED':
    case 'BLOCK_SELECTED':
      row.object_id = 'mass'
      row.attached_springs_count = details.attachedSpringsCount ?? null
      row.fail_reason = details.reason ?? null
      break

    case 'MASS1_ATTACHED':
    case 'MASS1_DETACHED':
    case 'PINK_BLOCK_SELECTED':
      row.object_id = 'mass1'
      break

    case 'ROBOT_CLICKED':
      row.object_id = 'robot'
      row.robot_active = details.active ?? null
      break

    case 'AI_USER_PROMPT':
      row.message_text = details.message ?? null
      break

    case 'AI_ROBOT_RESPONSE':
      row.response_text = details.response ?? null
      break

    case 'KEYBOARD_MOVEMENT':
      row.direction = details.direction ?? null
      break

    case 'EXPERIMENT_RESET':
      break

    case 'QUIZ_RESULT':
      row.numeric_value = details.scoreOutOf10 ?? null
      row.message_text = Array.isArray(details.soughtAiHelpForQuestionNumbers)
        ? details.soughtAiHelpForQuestionNumbers.join(',')
        : (details.soughtAiHelpForQuestionNumbers ?? '')
      break

    default:
      break
  }

  return row
}

function getEventCategory(eventType) {
  const session = ['EXPERIMENT_STARTED', 'EXPERIMENT_FINISHED', 'LEVEL_CHANGED']
  const setup = ['PLANK_SELECTED', 'PLANK_MOVED_TO_CENTER', 'PLANK_UNSUSPENDED_RESET', 'SPRING_ATTACHED', 'SPRING_DETACHED', 'SPRING_SELECTED', 'MASS_ATTACHED', 'MASS_ATTACH_FAILED', 'MASS_DETACHED', 'BLOCK_SELECTED', 'MASS1_ATTACHED', 'MASS1_DETACHED', 'PINK_BLOCK_SELECTED']
  const control = ['SPRING_STIFFNESS_CHANGED', 'MASS_WEIGHT_CHANGED', 'MASS_WEIGHT1_CHANGED', 'TAKE_READING_CLICKED', 'EXPERIMENT_RESET']
  const ai = ['AI_USER_PROMPT', 'AI_ROBOT_RESPONSE', 'ROBOT_CLICKED']
  const movement = ['KEYBOARD_MOVEMENT']
  const quiz = ['QUIZ_RESULT']
  if (session.includes(eventType)) return EVENT_CATEGORIES.session
  if (setup.includes(eventType)) return EVENT_CATEGORIES.setup
  if (control.includes(eventType)) return EVENT_CATEGORIES.control
  if (ai.includes(eventType)) return EVENT_CATEGORIES.ai
  if (movement.includes(eventType)) return EVENT_CATEGORIES.movement
  if (quiz.includes(eventType)) return EVENT_CATEGORIES.quiz
  return 'other'
}

/** Column order for CSV export (matches Supabase table columns) */
export const ROW_COLUMNS = [
  'user_id', 'session_id', 'timestamp', 'event_type', 'event_category', 'level', 'object_id', 'direction',
  'numeric_value', 'message_text', 'response_text', 'position_x', 'position_y', 'position_z',
  'total_attached', 'attached_springs_count', 'fail_reason', 'robot_active', 'to_level',
  'spring_stiffness_1', 'spring_stiffness_2', 'mass_weight', 'mass_weight_1'
]
