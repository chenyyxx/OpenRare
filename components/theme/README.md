# Theme Components

This directory contains reusable theme components with local theme constants for colors and icons.

## Components

### ThemeIcon
Displays the appropriate icon for each theme type based on theme name.

```tsx
import { ThemeIcon } from './components/theme';

<ThemeIcon themeName="Personal Stories" boxSize={5} />
```

### ThemeBadge
A badge component for displaying theme information on posts.

```tsx
import { ThemeBadge } from './components/theme';

<ThemeBadge 
  themeName="Personal Stories"
  showIcon={true} 
  showText={true} 
/>
```

### ThemeCard
A card component for displaying theme information on explore pages.

```tsx
import { ThemeCard } from './components/theme';

<ThemeCard 
  theme={{
    id: theme.id,
    name: theme.name,
    description: theme.description,
    postCount: theme._count.posts
  }}
  recentPosts={recentPosts}
/>
```

### ThemeVisuals
Additional visual components for various use cases.

```tsx
import { 
  ThemeColorDot, 
  ThemeHeader, 
  ThemeIndicator, 
  ThemeSelectionButton 
} from './components/theme';

// Color dot indicator
<ThemeColorDot themeName="Events" />

// Theme page header
<ThemeHeader 
  themeName={theme.name}
  description={theme.description}
  postCount={theme._count.posts}
/>

// Compact indicator
<ThemeIndicator 
  themeName={theme.name} 
  showText={true} 
/>

// Selection button for forms
<ThemeSelectionButton
  themeName={theme.name}
  description={theme.description}
  isSelected={selectedThemeId === theme.id}
  onClick={() => setSelectedThemeId(theme.id)}
/>
```

## Local Constants

Colors and icons are determined locally by theme name:

**Theme Colors:**
- Personal Stories: `#F59E0B` (orange/amber)
- Help & Support: `#3B82F6` (blue)  
- Events: `#8B5CF6` (purple)
- Research & Information: `#10B981` (green)

**Icon Mapping:**
- Personal Stories → FiUser
- Help & Support → FiHeart  
- Events → FiCalendar
- Research & Information → FiBook

## Usage with API Data

```tsx
// Fetch themes from API
const { themes } = useThemes();

// Use with components - colors/icons determined by theme name
{themes?.map((theme) => (
  <ThemeCard
    key={theme.id}
    theme={{
      id: theme.id,
      name: theme.name,
      description: theme.description,
      postCount: theme._count.posts
    }}
  />
))}
```

All styling is determined locally based on the theme name, ensuring consistency across the application.