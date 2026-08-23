/* ─── App-wide constants ─────────────────────────────────── */

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const COLORS = [
  { id: 'gold',   hex: '#c8a96e' }, { id: 'silver', hex: '#9ba3af' },
  { id: 'rose',   hex: '#c47c7c' }, { id: 'sage',   hex: '#7ca885' },
  { id: 'slate',  hex: '#7c8fa0' }, { id: 'amber',  hex: '#c49a4a' },
  { id: 'mauve',  hex: '#9a7ca8' }, { id: 'terra',  hex: '#a07060' },
  { id: 'teal',   hex: '#5a9a8a' }, { id: 'cream',  hex: '#b8a898' },
]

export const CATEGORIES = [
  { id: 'health',   label: 'Health',   color: '#7ca885' },
  { id: 'mind',     label: 'Mind',     color: '#9a7ca8' },
  { id: 'body',     label: 'Body',     color: '#c8a96e' },
  { id: 'social',   label: 'Social',   color: '#7c8fa0' },
  { id: 'growth',   label: 'Growth',   color: '#c49a4a' },
  { id: 'work',     label: 'Work',     color: '#9ba3af' },
  { id: 'creative', label: 'Creative', color: '#c47c7c' },
]

export const ICONS = [
  'droplet', 'bolt', 'book', 'moon', 'heart', 'star',
  'flame', 'run', 'music', 'brain', 'leaf', 'pen',
  'dumbbell', 'coffee', 'sun',
]

export const HABIT_TEMPLATES = [
  { id: 'morning', label: 'Morning Ritual', emoji: '🌅', habits: [
    { label: 'Wake up early',  icon_id: 'sun',      color_id: 'amber',  category_id: 'health', goal: 7, schedule_days: [0,1,2,3,4,5,6] },
    { label: 'Meditate',       icon_id: 'brain',    color_id: 'mauve',  category_id: 'mind',   goal: 7, schedule_days: [0,1,2,3,4,5,6] },
    { label: 'Exercise',       icon_id: 'dumbbell', color_id: 'gold',   category_id: 'body',   goal: 5, schedule_days: [1,2,3,4,5] },
    { label: 'Read 30 min',    icon_id: 'book',     color_id: 'sage',   category_id: 'mind',   goal: 7, schedule_days: [0,1,2,3,4,5,6] },
  ]},
  { id: 'athlete', label: 'Athlete', emoji: '⚡', habits: [
    { label: 'Workout',        icon_id: 'dumbbell', color_id: 'gold',   category_id: 'body',   goal: 5, schedule_days: [1,2,3,4,5] },
    { label: 'Run 5k',         icon_id: 'run',      color_id: 'rose',   category_id: 'body',   goal: 4, schedule_days: [1,3,5,0] },
    { label: 'Hydrate 3L',     icon_id: 'droplet',  color_id: 'slate',  category_id: 'health', goal: 7, schedule_days: [0,1,2,3,4,5,6] },
    { label: 'Sleep 8h',       icon_id: 'moon',     color_id: 'mauve',  category_id: 'health', goal: 7, schedule_days: [0,1,2,3,4,5,6] },
  ]},
  { id: 'student', label: 'Student', emoji: '📚', habits: [
    { label: 'Study 2h',       icon_id: 'book',     color_id: 'slate',  category_id: 'growth', goal: 6, schedule_days: [1,2,3,4,5,6] },
    { label: 'No phone 9-12',  icon_id: 'brain',    color_id: 'mauve',  category_id: 'mind',   goal: 5, schedule_days: [1,2,3,4,5] },
    { label: 'Journal',        icon_id: 'pen',      color_id: 'sage',   category_id: 'mind',   goal: 7, schedule_days: [0,1,2,3,4,5,6] },
    { label: 'Walk outside',   icon_id: 'leaf',     color_id: 'sage',   category_id: 'health', goal: 5, schedule_days: [1,2,3,4,5] },
  ]},
  { id: 'mindful', label: 'Mindfulness', emoji: '🧘', habits: [
    { label: 'Meditate',       icon_id: 'brain',    color_id: 'mauve',  category_id: 'mind',   goal: 7, schedule_days: [0,1,2,3,4,5,6] },
    { label: 'Gratitude',      icon_id: 'heart',    color_id: 'rose',   category_id: 'mind',   goal: 7, schedule_days: [0,1,2,3,4,5,6] },
    { label: 'Digital detox',  icon_id: 'moon',     color_id: 'teal',   category_id: 'mind',   goal: 3, schedule_days: [6,0] },
    { label: 'Nature walk',    icon_id: 'leaf',     color_id: 'sage',   category_id: 'health', goal: 5, schedule_days: [1,2,3,4,5] },
  ]},
  { id: 'creative', label: 'Creative', emoji: '🎨', habits: [
    { label: 'Create daily',   icon_id: 'pen',      color_id: 'rose',   category_id: 'creative', goal: 7, schedule_days: [0,1,2,3,4,5,6] },
    { label: 'Listen',         icon_id: 'music',    color_id: 'mauve',  category_id: 'creative', goal: 5, schedule_days: [1,2,3,4,5] },
    { label: 'Read fiction',   icon_id: 'book',     color_id: 'amber',  category_id: 'creative', goal: 7, schedule_days: [0,1,2,3,4,5,6] },
  ]},
]

export const MILESTONES = [3, 7, 14, 21, 30, 60, 100, 200, 365]

// Neumorphic OLED token object — shared across components
export const T = {
  bg:          '#0a0a0a',
  surface:     '#111111',
  raised:      '#161616',
  sunken:      '#080808',
  border:      '#1e1e1e',
  fg:          '#f0ece4',
  fgMuted:     '#7a7672',
  fgDim:       '#3d3a37',
  accent:      '#c8a96e',
  accentDim:   'rgba(200,169,110,0.15)',
  shadowOut:   '6px 6px 14px #050505, -4px -4px 10px #1a1a1a',
  shadowIn:    'inset 3px 3px 8px #050505, inset -3px -3px 8px #1a1a1a',
  shadowSm:    '3px 3px 8px #050505, -2px -2px 6px #191919',
  shadowBtn:   '4px 4px 10px #050505, -3px -3px 8px #1c1c1c',
  shadowBtnPr: 'inset 2px 2px 6px #050505, inset -2px -2px 6px #1a1a1a',
} as const

export const E = 'cubic-bezier(0.16,1,0.3,1)'
