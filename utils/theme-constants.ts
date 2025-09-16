// High-contrast, bold color palette for maximum visual impact
export const THEME_COLORS = {
  'Personal Stories': '#E74C3C',    // Bold red - passionate and personal
  'Help & Support': '#3498DB',      // Strong blue - trustworthy and supportive  
  'Events': '#9B59B6',             // Rich purple - creative and engaging
  'Research & Information': '#27AE60' // Deep green - professional and knowledge-focused
} as const;

// Modern design palette with excellent readability
export const MODERN_PALETTE = {
  // Primary colors - teal with better saturation and contrast
  primary: {
    50: '#F0FDFA',
    100: '#CCFBF1', 
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Main primary - vibrant teal
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A'
  },
  
  // Neutral colors with better contrast
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5', 
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B'
  },

  // Minimal accent colors - only essential ones
  accent: {
    success: '#10B981',   // Success green
    warning: '#F59E0B',   // Warning orange  
    error: '#EF4444'      // Error red
  },

  // Background gradients - high contrast and bold
  gradients: {
    primary: 'linear-gradient(135deg, #E74C3C 0%, #3498DB 100%)',
    warm: 'linear-gradient(135deg, #E74C3C 0%, #F39C12 100%)',
    cool: 'linear-gradient(135deg, #3498DB 0%, #9B59B6 100%)',
    sunset: 'linear-gradient(135deg, #E74C3C 0%, #27AE60 100%)'
  }
} as const;

export const THEME_CONFIG = {
  'Personal Stories': {
    id: 'personal-stories',
    name: 'Personal Stories',
    color: THEME_COLORS['Personal Stories'],
    description: 'Share your journey and experiences',
    guidelines: 'A place for sharing personal experiences, journeys, milestones, and life with rare diseases',
    icon: 'user',
    lightBg: 'rgba(231, 76, 60, 0.1)',
    mediumBg: 'rgba(231, 76, 60, 0.2)',
    darkBg: 'rgba(231, 76, 60, 0.9)'
  },
  'Help & Support': {
    id: 'help-support',
    name: 'Help & Support',
    color: THEME_COLORS['Help & Support'],
    description: 'Ask questions and offer support',
    guidelines: 'A place for asking questions, seeking advice, and offering help to community members',
    icon: 'heart',
    lightBg: 'rgba(52, 152, 219, 0.1)',
    mediumBg: 'rgba(52, 152, 219, 0.2)',
    darkBg: 'rgba(52, 152, 219, 0.9)'
  },
  'Events': {
    id: 'events',
    name: 'Events',
    color: THEME_COLORS['Events'],
    description: 'Community gatherings and events',
    guidelines: 'A place for sharing upcoming events, conferences, support group meetings, and community gatherings',
    icon: 'calendar',
    lightBg: 'rgba(155, 89, 182, 0.1)',
    mediumBg: 'rgba(155, 89, 182, 0.2)',
    darkBg: 'rgba(155, 89, 182, 0.9)'
  },
  'Research & Information': {
    id: 'research-info',
    name: 'Research & Information',
    color: THEME_COLORS['Research & Information'],
    description: 'Medical information and research',
    guidelines: 'A place for sharing research findings, medical information, treatment updates, and educational content',
    icon: 'book',
    lightBg: 'rgba(39, 174, 96, 0.1)',
    mediumBg: 'rgba(39, 174, 96, 0.2)',
    darkBg: 'rgba(39, 174, 96, 0.9)'
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
  return THEME_COLORS[themeName as ThemeName] || MODERN_PALETTE.primary[500];
};

// Helper function to get theme background colors
export const getThemeBackgrounds = (themeName: string) => {
  const config = THEME_CONFIG[themeName as ThemeName];
  return config ? {
    light: config.lightBg,
    medium: config.mediumBg,
    dark: config.darkBg,
    main: config.color
  } : {
    light: MODERN_PALETTE.primary[50],
    medium: MODERN_PALETTE.primary[100], 
    dark: MODERN_PALETTE.primary[500],
    main: MODERN_PALETTE.primary[500]
  };
};

// Typography scale for better readability
export const TYPOGRAPHY = {
  fontSize: {
    xs: { base: '12px', md: '14px' },
    sm: { base: '14px', md: '16px' },
    md: { base: '16px', md: '18px' },
    lg: { base: '18px', md: '20px' },
    xl: { base: '20px', md: '24px' },
    '2xl': { base: '24px', md: '30px' },
    '3xl': { base: '30px', md: '36px' },
    '4xl': { base: '36px', md: '48px' }
  }
};