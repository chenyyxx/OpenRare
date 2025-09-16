// Modern Design System - Material Design Inspired
export const MODERN_DESIGN_SYSTEM = {
  // Typography - Material Design inspired fonts
  fonts: {
    heading: '"Inter", "Roboto", "Segoe UI", system-ui, sans-serif',
    body: '"Inter", "Roboto", "Segoe UI", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace'
  },

  // Font weights - Reduced from previous bold versions
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  // Colors - Simplified palette
  colors: {
    // Primary - Teal for interactions
    primary: {
      50: '#E6FFFA',
      100: '#B2F5EA', 
      200: '#81E6D9',
      300: '#4FD1C7',
      400: '#38B2AC',
      500: '#319795', // Main teal
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044'
    },

    // Neutral - Gray for content
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },

    // Semantic colors - More visible than subtle
    info: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#3B82F6',
      600: '#2563EB'
    },
    
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      500: '#22C55E',
      600: '#16A34A'
    },

    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#F59E0B',
      600: '#D97706'
    },

    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      500: '#EF4444',
      600: '#DC2626'
    }
  },

  // Border radius - Consistent rounding
  radii: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px  
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px'    // Full round
  },

  // Shadows - Subtle depth
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },

  // Spacing scale
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem'   // 48px
  }
};

// Component style presets
export const COMPONENT_STYLES = {
  // Card preset
  card: {
    bg: 'white',
    borderRadius: MODERN_DESIGN_SYSTEM.radii.lg,
    boxShadow: MODERN_DESIGN_SYSTEM.shadows.md,
    border: '1px solid',
    borderColor: MODERN_DESIGN_SYSTEM.colors.neutral[200],
    p: { base: 4, md: 6 }
  },

  // Button presets
  button: {
    primary: {
      bg: MODERN_DESIGN_SYSTEM.colors.primary[500],
      color: 'white',
      borderRadius: MODERN_DESIGN_SYSTEM.radii.md,
      fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.medium,
      _hover: {
        bg: MODERN_DESIGN_SYSTEM.colors.primary[600],
        transform: 'translateY(-1px)',
        boxShadow: MODERN_DESIGN_SYSTEM.shadows.md
      }
    },
    secondary: {
      bg: 'white',
      color: MODERN_DESIGN_SYSTEM.colors.neutral[700],
      border: '1px solid',
      borderColor: MODERN_DESIGN_SYSTEM.colors.neutral[300],
      borderRadius: MODERN_DESIGN_SYSTEM.radii.md,
      fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.medium,
      _hover: {
        bg: MODERN_DESIGN_SYSTEM.colors.neutral[50],
        borderColor: MODERN_DESIGN_SYSTEM.colors.neutral[400]
      }
    }
  },

  // Badge presets - More visible colors
  badge: {
    info: {
      bg: MODERN_DESIGN_SYSTEM.colors.info[100],
      color: MODERN_DESIGN_SYSTEM.colors.info[600],
      borderRadius: MODERN_DESIGN_SYSTEM.radii.full,
      px: 3,
      py: 1,
      fontSize: 'xs',
      fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.medium
    },
    success: {
      bg: MODERN_DESIGN_SYSTEM.colors.success[100],
      color: MODERN_DESIGN_SYSTEM.colors.success[600],
      borderRadius: MODERN_DESIGN_SYSTEM.radii.full,
      px: 3,
      py: 1,
      fontSize: 'xs',
      fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.medium
    },
    neutral: {
      bg: MODERN_DESIGN_SYSTEM.colors.neutral[100],
      color: MODERN_DESIGN_SYSTEM.colors.neutral[600],
      borderRadius: MODERN_DESIGN_SYSTEM.radii.full,
      px: 3,
      py: 1,
      fontSize: 'xs',
      fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.medium
    }
  }
};

// Typography presets
export const TYPOGRAPHY = {
  heading: {
    fontFamily: MODERN_DESIGN_SYSTEM.fonts.heading,
    fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.semibold,
    color: MODERN_DESIGN_SYSTEM.colors.neutral[800]
  },
  
  body: {
    fontFamily: MODERN_DESIGN_SYSTEM.fonts.body,
    fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.normal,
    color: MODERN_DESIGN_SYSTEM.colors.neutral[700]
  },

  caption: {
    fontFamily: MODERN_DESIGN_SYSTEM.fonts.body,
    fontWeight: MODERN_DESIGN_SYSTEM.fontWeights.normal,
    color: MODERN_DESIGN_SYSTEM.colors.neutral[500],
    fontSize: 'sm'
  }
};