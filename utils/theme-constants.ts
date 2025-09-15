// Theme color scheme constants and configuration
// These are the source of truth for theme colors and icons
// All theme components use these local constants based on theme name
export const THEME_COLORS = {
  'Personal Stories': '#F59E0B', // Warm orange/amber
  'Help & Support': '#3B82F6',   // Caring blue
  'Events': '#8B5CF6',           // Energetic purple
  'Research & Information': '#10B981' // Professional green
} as const;

export const THEME_CONFIG = {
  'Personal Stories': {
    id: 'personal-stories',
    name: 'Personal Stories',
    color: THEME_COLORS['Personal Stories'],
    description: 'Share your journey and experiences',
    guidelines: 'A place for sharing personal experiences, journeys, milestones, and life with rare diseases',
    icon: 'user'
  },
  'Help & Support': {
    id: 'help-support',
    name: 'Help & Support',
    color: THEME_COLORS['Help & Support'],
    description: 'Ask questions and offer support',
    guidelines: 'A place for asking questions, seeking advice, and offering help to community members',
    icon: 'heart'
  },
  'Events': {
    id: 'events',
    name: 'Events',
    color: THEME_COLORS['Events'],
    description: 'Community gatherings and events',
    guidelines: 'A place for sharing upcoming events, conferences, support group meetings, and community gatherings',
    icon: 'calendar'
  },
  'Research & Information': {
    id: 'research-info',
    name: 'Research & Information',
    color: THEME_COLORS['Research & Information'],
    description: 'Medical information and research',
    guidelines: 'A place for sharing research findings, medical information, treatment updates, and educational content',
    icon: 'book'
  }
} as const;

export type ThemeName = keyof typeof THEME_CONFIG;
export type ThemeId = typeof THEME_CONFIG[ThemeName]['id'];

// Helper function to get theme config by name
export const getThemeConfig = (themeName: string) => {
  return THEME_CONFIG[themeName as ThemeName] || null;
};

// Helper function to get theme color by name
export const getThemeColor = (themeName: string) => {
  return THEME_COLORS[themeName as ThemeName] || '#718096'; // Default gray
};