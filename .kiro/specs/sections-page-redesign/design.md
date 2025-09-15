# Design Document

## Overview

The explore page redesign transforms the platform from disease-specific organization to theme-based content organization. The design introduces 4 main themes (Personal Stories, Help & Support, Events, Research & Information) while maintaining rare disease selection as metadata for posts. The rare diseases page is repurposed as an informational and interest selection interface.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Explore Page  │    │   Theme Pages   │    │ Rare Diseases   │
│                 │    │                 │    │     Page        │
│ - 4 Theme Areas │───▶│ - Theme Posts   │    │                 │
│ - Navigation    │    │ - Disease Filter│    │ - Disease Info  │
│ - Preview Posts │    │ - Post Creation │    │ - Interest Mgmt │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Post Model    │
                    │                 │
                    │ - Theme (new)   │
                    │ - Disease (old  │
                    │   section)      │
                    │ - Content       │
                    └─────────────────┘
```

### Theme Organization

The 4 themes organize content by purpose rather than disease:

1. **Personal Stories** - User experiences, journeys, milestones
2. **Help & Support** - Questions, advice, community support
3. **Events** - Conferences, meetings, community gatherings
4. **Research & Information** - Medical info, research findings, educational content

## Components and Interfaces

### Explore Page Components

#### ThemeCard Component

```typescript
interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    postCount: number;
    recentPosts: Post[];
  };
}
```

#### ExploreLayout Component

```typescript
interface ExploreLayoutProps {
  themes: Theme[];
  featuredPosts?: Post[];
}
```

### Theme Page Components

#### ThemePostList Component

```typescript
interface ThemePostListProps {
  themeId: string;
  posts: Post[];
  diseaseFilter?: string[];
}
```

#### PostCard Component (Enhanced)

```typescript
interface PostCardProps {
  post: Post & {
    theme: Theme;
    disease: Disease;
  };
  showThemeIndicator: boolean;
  showDiseaseInfo: boolean;
}
```

### Rare Diseases Page Components

#### DiseaseSearch Component

```typescript
interface DiseaseSearchProps {
  diseases: Disease[];
  onSelect: (disease: Disease) => void;
  selectedDiseases: Disease[];
}
```

#### DiseaseInfo Component

```typescript
interface DiseaseInfoProps {
  disease: Disease;
  isInterested: boolean;
  onToggleInterest: (diseaseId: string) => void;
}
```

## Data Models

### Enhanced Post Model

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;

  // New theme field
  themeId: string;
  theme: Theme;

  // Renamed from sectionId to diseaseId
  diseaseId: string;
  disease: Disease;

  // Existing fields
  votes: Vote[];
  comments: Comment[];
}
```

### Theme Model

```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  guidelines: string;
  createdAt: Date;

  // Relationships
  posts: Post[];
}
```

### Disease Model (Renamed from Section)

```typescript
interface Disease {
  id: string;
  name: string;
  description?: string;
  definition?: string;
  picture?: string;

  // New fields for information page
  symptoms?: string[];
  treatments?: string[];
  resources?: string[];

  // Relationships
  posts: Post[];
  interestedUsers: User[];
}
```

### User Interest Model (Reusing Existing Follow System)

```typescript
// Reuse existing follow relationship between User and Disease (formerly Section)
// No new model needed - existing UserSection/UserDisease follow relationship handles interests
interface User {
  // ... existing fields
  followedDiseases: Disease[]; // Renamed from followedSections
}

interface Disease {
  // ... existing fields
  followers: User[]; // Users who follow/are interested in this disease
}
```

## User Interface Design

### Explore Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Navigation                            │
├─────────────────────────────────────────────────────────────┤
│                     Explore Header                          │
│                "Discover Community Content"                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Personal Stories│  │ Help & Support  │                  │
│  │ [Icon] [Color]  │  │ [Icon] [Color]  │                  │
│  │ 45 posts        │  │ 23 posts        │                  │
│  │ Recent preview  │  │ Recent preview  │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │     Events      │  │ Research & Info │                  │
│  │ [Icon] [Color]  │  │ [Icon] [Color]  │                  │
│  │ 12 posts        │  │ 67 posts        │                  │
│  │ Recent preview  │  │ Recent preview  │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Theme Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Navigation                            │
├─────────────────────────────────────────────────────────────┤
│  [Theme Icon] Personal Stories                              │
│  Share your journey and experiences                         │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ Create Post     │ │ Disease Filter  │                   │
│  └─────────────────┘ └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Theme Badge] Post Title                                │ │
│  │ [Disease Tag] Author • Date                             │ │
│  │ Post preview content...                                 │ │
│  │ [Votes] [Comments]                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Theme Badge] Another Post Title                        │ │
│  │ [Disease Tag] Author • Date                             │ │
│  │ Post preview content...                                 │ │
│  │ [Votes] [Comments]                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Rare Diseases Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Navigation                            │
├─────────────────────────────────────────────────────────────┤
│                    Rare Diseases                            │
│           Learn about and select your interests             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Search rare diseases...                                 │ │
│  │ [Always show: Other, General]                           │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Selected Disease: Huntington's Disease                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Description: A genetic disorder...                      │ │
│  │ Symptoms: • Movement problems • Cognitive decline       │ │
│  │ Resources: • Link 1 • Link 2                           │ │
│  │ ┌─────────────────┐                                     │ │
│  │ │ Add to Interests│                                     │ │
│  │ └─────────────────┘                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Your Disease Interests:                                   │
│  [Huntington's] [ALS] [Parkinson's] [+ Add More]          │
└─────────────────────────────────────────────────────────────┘
```

## Theme Visual Design

### Theme Color Scheme

- **Personal Stories**: Warm orange/amber (#F59E0B)
- **Help & Support**: Caring blue (#3B82F6)
- **Events**: Energetic purple (#8B5CF6)
- **Research & Information**: Professional green (#10B981)

### Theme Icons

- **Personal Stories**: User/person icon
- **Help & Support**: Heart/helping hands icon
- **Events**: Calendar/event icon
- **Research & Information**: Book/microscope icon

### Visual Indicators

- Theme badges on posts with consistent colors
- Disease tags as subtle secondary badges
- Clear visual hierarchy between theme and disease information

## Error Handling

### Post Creation Validation

- Theme selection required - show error if not selected
- Disease selection required - show error if not selected
- Always show "Other" and "General" in disease dropdown
- Provide clear error messages for missing required fields

### Navigation Error Handling

- Handle removed section detail pages gracefully
- Redirect old section URLs to appropriate theme pages
- Provide 404 pages for non-existent content

### Data Loading States

- Skeleton screens for theme cards while loading
- Loading states for post lists
- Error states for failed API calls
- Empty states for themes with no posts

## Testing Strategy

### Unit Testing

- Theme card component rendering
- Post card component with theme indicators
- Disease search and selection functionality
- Post creation form validation

### Integration Testing

- Explore page theme navigation
- Theme page post filtering
- Disease interest management
- Post creation with theme and disease selection

### User Experience Testing

- Theme navigation flow
- Post creation workflow
- Disease selection and interest management
- Visual theme indicator clarity

### Performance Testing

- Explore page load times
- Theme page post loading
- Disease search autocomplete performance
- Image and content lazy loading

## Migration Strategy

Since there are no active users, migration focuses on:

1. **Database Schema Updates**

   - Add theme table and relationships
   - Rename section references to disease
   - Reuse existing follow system for disease interests

2. **Component Updates**

   - Update all "section" terminology to "rare disease"
   - Add theme selection to post creation
   - Update post displays with theme indicators

3. **Route Changes**

   - Remove section detail routes
   - Add theme page routes
   - Update rare diseases page functionality

4. **Data Seeding**
   - Create initial theme data
   - Ensure "Other" and "General" disease options exist
   - Set up theme color and icon configurations
