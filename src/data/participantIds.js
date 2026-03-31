/**
 * Pre-generated anonymous participant login IDs (100 total).
 * Only these IDs can sign in. Use for anonymous participation;
 * researchers assign one ID per participant; no names are collected.
 */
const PARTICIPANT_IDS = [
  'PART-001', 'PART-002', 'PART-003', 'PART-004', 'PART-005',
  'PART-006', 'PART-007', 'PART-008', 'PART-009', 'PART-010',
  'PART-011', 'PART-012', 'PART-013', 'PART-014', 'PART-015',
  'PART-016', 'PART-017', 'PART-018', 'PART-019', 'PART-020',
  'PART-021', 'PART-022', 'PART-023', 'PART-024', 'PART-025',
  'PART-026', 'PART-027', 'PART-028', 'PART-029', 'PART-030',
  'PART-031', 'PART-032', 'PART-033', 'PART-034', 'PART-035',
  'PART-036', 'PART-037', 'PART-038', 'PART-039', 'PART-040',
  'PART-041', 'PART-042', 'PART-043', 'PART-044', 'PART-045',
  'PART-046', 'PART-047', 'PART-048', 'PART-049', 'PART-050',
  'PART-051', 'PART-052', 'PART-053', 'PART-054', 'PART-055',
  'PART-056', 'PART-057', 'PART-058', 'PART-059', 'PART-060',
  'PART-061', 'PART-062', 'PART-063', 'PART-064', 'PART-065',
  'PART-066', 'PART-067', 'PART-068', 'PART-069', 'PART-070',
  'PART-071', 'PART-072', 'PART-073', 'PART-074', 'PART-075',
  'PART-076', 'PART-077', 'PART-078', 'PART-079', 'PART-080',
  'PART-081', 'PART-082', 'PART-083', 'PART-084', 'PART-085',
  'PART-086', 'PART-087', 'PART-088', 'PART-089', 'PART-090',
  'PART-091', 'PART-092', 'PART-093', 'PART-094', 'PART-095',
  'PART-096', 'PART-097', 'PART-098', 'PART-099', 'PART-100'
]

const VALID_IDS_SET = new Set(PARTICIPANT_IDS)

export function isValidParticipantId(value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim().toUpperCase()
  return VALID_IDS_SET.has(trimmed)
}

export function normalizeParticipantId(value) {
  if (typeof value !== 'string') return ''
  return value.trim().toUpperCase()
}

export { PARTICIPANT_IDS, VALID_IDS_SET }
