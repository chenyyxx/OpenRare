// Theme component exports
export { ThemeIcon } from './ThemeIcon';
export { ThemeBadge } from './ThemeBadge';
export { ThemeCard } from './ThemeCard';
export { 
  ThemeColorDot, 
  ThemeHeader, 
  ThemeIndicator, 
  ThemeSelectionButton 
} from './ThemeVisuals';

// Re-export theme constants for convenience
export { 
  THEME_COLORS, 
  THEME_CONFIG, 
  getThemeConfig, 
  getThemeColor,
  type ThemeName,
  type ThemeId
} from '../../utils/theme-constants';