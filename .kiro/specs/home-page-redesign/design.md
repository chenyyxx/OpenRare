# Design Document

## Overview

The Home Page redesign transforms the current single-view layout into a modern, tab-based interface that organizes user content into five distinct categories. The design prioritizes mobile responsiveness, clean visual hierarchy, and intuitive navigation while removing unnecessary UI elements that clutter the current interface.

The redesign addresses critical layout issues on mobile devices and provides better content organization through dedicated tabs for different content types. The interface will be built using Chakra UI components to maintain consistency with the existing design system.

## Architecture

### Page Layout Design

**Desktop Layout (1200px+):**
```
┌─────────────────────────────────────────────────────────────────┐
│                        Nav (Fixed Header)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌─────────────────────────────┐               │
│                    │     Main Content Area       │               │
│                    │                             │               │
│                    │  ┌─────────────────────────┐ │               │
│                    │  │     Page Header         │ │               │
│                    │  │ "Your personalized feed"│ │               │
│                    │  │            [Refresh] ── │ │               │
│                    │  └─────────────────────────┘ │               │
│                    │                             │               │
│                    │  ┌─────────────────────────┐ │               │
│                    │  │    Tab Navigation       │ │               │
│                    │  │[Following][Posts][...]  │ │               │
│                    │  └─────────────────────────┘ │               │
│                    │                             │               │
│                    │  ┌─────────────────────────┐ │               │
│                    │  │                         │ │               │
│                    │  │    Tab Content Area     │ │               │
│                    │  │                         │ │               │
│                    │  │  ┌─────────────────┐    │ │               │
│                    │  │  │   Post Card     │    │ │               │
│                    │  │  └─────────────────┘    │ │               │
│                    │  │  ┌─────────────────┐    │ │               │
│                    │  │  │   Post Card     │    │ │               │
│                    │  │  └─────────────────┘    │ │               │
│                    │  │                         │ │               │
│                    │  └─────────────────────────┘ │               │
│                    └─────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile Layout (0-768px):**
```
┌─────────────────────────────────┐
│        Nav (Fixed Header)       │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐ │
│  │       Page Header           │ │
│  │ "Your personalized feed"    │ │
│  │                [Refresh] ── │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─────────────────────────────┐ │
│  │     Tab Navigation          │ │
│  │ [Following][Posts][...]     │ │
│  │ (Horizontally Scrollable)   │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─────────────────────────────┐ │
│  │                             │ │
│  │     Tab Content Area        │ │
│  │     (Full Width)            │ │
│  │                             │ │
│  │   ┌─────────────────────┐   │ │
│  │   │     Post Card       │   │ │
│  │   └─────────────────────┘   │ │
│  │   ┌─────────────────────┐   │ │
│  │   │     Post Card       │   │ │
│  │   └─────────────────────┘   │ │
│  │                             │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Component Structure & Responsibilities

```
HomePage (Main Container)
├── Nav (existing) - Global navigation bar
├── Sidebar (existing wrapper) - Layout wrapper for responsive design
├── HomePageHeader (new) - Page introduction and controls
│   ├── PageDescription - Explains what the home page shows
│   └── RefreshButton - Allows users to refresh current tab content
├── TabNavigation (new) - Tab switching interface
│   ├── TabButton (Following, My Posts, My Comments, Favorites, Replies)
│   └── TabIndicator - Visual indicator for active tab
└── ContentArea (new) - Main content display area
    ├── FollowedDiseasesTags (new) - Shows followed diseases as tags (Following tab only)
    ├── SearchAndFilter (new) - Search and filter controls (post tabs only)
    ├── TabContent (new) - Container for active tab's content
    │   ├── PostList (reused) - Displays posts in Following, My Posts, Favorites tabs
    │   ├── CommentList (new) - Displays user comments with post context
    │   ├── ReplyList (new) - Displays replies to user's content
    │   └── EmptyState (new) - Encouraging messages when no content exists
    └── LoadingSpinner - Shows during data fetching
```

### Component Detailed Explanations

**HomePageHeader Component:**
- **Purpose**: Provides context about what the home page shows and offers refresh functionality
- **What it does**: Displays a welcoming description like "Your personalized feed - stay updated with content from your interests" and includes a refresh button to reload the current tab's data
- **Behavior**: The refresh button shows a loading spinner when active and updates the current tab's content

**TabNavigation Component:**
- **Purpose**: Allows users to switch between different content views
- **What it does**: Renders 5 tabs (Following, My Posts, My Comments, Favorites, Replies) with clear visual indication of which is active
- **Behavior**: On mobile, tabs scroll horizontally if they don't fit. On desktop, they span the full width. Clicking a tab loads that content type

**ContentArea Component:**
- **Purpose**: Main display area that shows content based on the selected tab
- **What it does**: Renders different content types (posts, comments, replies) based on active tab, handles loading states, and shows appropriate empty states
- **Behavior**: Smoothly transitions between different content types, maintains scroll position when possible

**PostList Component (reused):**
- **Purpose**: Displays a list of posts in a consistent format
- **What it does**: Shows posts with title, author, date, disease tag, content preview, and engagement metrics
- **Behavior**: Used in Following, My Posts, and Favorites tabs. Handles post interaction like viewing details

**CommentList Component (new):**
- **Purpose**: Shows user's comments with context about where they were made
- **What it does**: Displays comment content, the post it was made on, and provides a link to view the full post
- **Behavior**: Truncates long comments with expand option, shows post title and disease for context

**ReplyList Component (new):**
- **Purpose**: Shows replies to the user's posts and comments
- **What it does**: Displays reply content and indicates whether it's a reply to a post or comment, with links to view full context
- **Behavior**: Distinguishes visually between post replies and comment replies, provides navigation to original content



**EmptyState Component (new):**
- **Purpose**: Provides encouraging messages when users have no content in a particular tab
- **What it does**: Shows contextual messages and action buttons to help users get started (e.g., "Follow some rare diseases to see posts here" with link to rare diseases page)
- **Behavior**: Different messages for each tab type, includes relevant action buttons

**FollowedDiseasesTags Component (new):**
- **Purpose**: Shows user's followed rare diseases as minimal tags in the Following tab
- **What it does**: Displays disease names as clickable tags/badges, with a link to manage interests
- **Behavior**: Appears only in Following tab, tags are clickable to filter posts by that disease

**SearchAndFilter Component (new):**
- **Purpose**: Provides search and filtering capabilities for post-based tabs
- **What it does**: Allows users to search by post title and filter by rare disease and theme
- **Behavior**: Real-time search as user types, dropdown filters for disease and theme, appears in Following, My Posts, and Favorites tabs

### Data Flow

1. **Tab Selection**: User clicks tab → Update active tab state → Fetch relevant data → Update content area
2. **Content Loading**: Tab change → Show loading spinner → API call → Update content → Hide loading
3. **Refresh**: User clicks refresh → Show loading on refresh button → Re-fetch current tab data → Update content
4. **Responsive Behavior**: Screen size change → Adjust layout → Hide/show sidebar elements → Reorganize tab layout

## Components and Interfaces

### HomePageHeader Component

```typescript
interface HomePageHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}
```

**Purpose**: Displays page description and refresh functionality
**Styling**: Clean header with description text and refresh button aligned right

### TabNavigation Component

```typescript
interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabCounts?: Record<TabType, number>;
}

type TabType = 'following' | 'myPosts' | 'myComments' | 'favorites' | 'replies';
```

**Purpose**: Horizontal tab bar with active state indication
**Responsive**: Scrollable on mobile, full width on desktop
**Styling**: Chakra UI tabs with custom styling for active states

### ContentArea Component

```typescript
interface ContentAreaProps {
  activeTab: TabType;
  isLoading: boolean;
  error?: string;
}
```

**Purpose**: Container for tab-specific content with loading and error states
**Features**: Smooth transitions between tabs, consistent empty states

### CommentList Component

```typescript
interface CommentListProps {
  comments: UserComment[];
  isLoading: boolean;
}

interface UserComment {
  id: string;
  content: string;
  createdAt: Date;
  post: {
    id: string;
    title: string;
    disease: {
      name: string;
    };
  };
}
```

**Purpose**: Displays user's comments with post context
**Features**: Link to original post, truncated content with expand option

### ReplyList Component

```typescript
interface ReplyListProps {
  replies: UserReply[];
  isLoading: boolean;
}

interface UserReply {
  id: string;
  content: string;
  createdAt: Date;
  parentType: 'post' | 'comment';
  parent: {
    id: string;
    title?: string; // for posts
    content?: string; // for comments
  };
}
```

**Purpose**: Shows replies to user's posts and comments
**Features**: Distinguishes between post and comment replies, context links

### SearchAndFilter Component

```typescript
interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterDisease: (diseaseId: string | null) => void;
  onFilterTheme: (themeId: string | null) => void;
  availableDiseases: RareDisease[];
  availableThemes: Theme[];
  currentFilters: {
    search: string;
    disease: string | null;
    theme: string | null;
  };
}
```

**Purpose**: Provides search and filtering capabilities for post-based tabs
**Features**: Real-time search, dropdown filters, clear all filters option

### FollowedDiseasesTags Component

```typescript
interface FollowedDiseasesTagsProps {
  diseases: RareDisease[];
  onDiseaseClick: (diseaseId: string) => void;
  selectedDisease: string | null;
}
```

**Purpose**: Shows user's followed diseases as clickable filter tags
**Features**: Tag-style display, click to filter, link to manage diseases

### CompactRareDisease Component

```typescript
interface CompactRareDiseaseProps {
  diseases: RareDisease[];
  showManageLink: boolean;
}
```

**Purpose**: Simplified rare diseases display
**Features**: Compact cards, link to rare diseases page, minimal information

## Data Models

### Tab Content Data Structure

```typescript
interface TabContentData {
  following: FullPost[];
  myPosts: FullPost[];
  myComments: UserComment[];
  favorites: FullPost[];
  replies: UserReply[];
}

interface TabMetadata {
  counts: Record<TabType, number>;
  lastUpdated: Record<TabType, Date>;
}
```

### API Endpoints Required

**Existing Endpoints to Modify:**
- `GET /api/get_user_diseases_posts` - Already exists for following tab

**New Endpoints Needed:**
- `GET /api/get_user_posts?email={email}` - User's own posts
- `GET /api/get_user_comments?email={email}` - User's comments with post context
- `GET /api/get_user_favorites?email={email}` - User's upvoted posts
- `GET /api/get_user_replies?email={email}` - Replies to user's content

### Response Formats

```typescript
// User Posts Response
interface UserPostsResponse {
  posts: FullPost[];
  count: number;
}

// User Comments Response
interface UserCommentsResponse {
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    post: {
      id: string;
      title: string;
      disease: { name: string };
    };
  }>;
  count: number;
}

// User Favorites Response
interface UserFavoritesResponse {
  posts: FullPost[];
  count: number;
}

// User Replies Response
interface UserRepliesResponse {
  replies: Array<{
    id: string;
    content: string;
    createdAt: string;
    parentType: 'post' | 'comment';
    parent: {
      id: string;
      title?: string;
      content?: string;
    };
  }>;
  count: number;
}
```

## Error Handling

### Error States

1. **Network Errors**: Display retry button with error message
2. **Empty States**: Encouraging messages with action buttons
3. **Loading Failures**: Graceful degradation with cached data if available
4. **Authentication Errors**: Redirect to sign-in page

### Error Recovery

```typescript
interface ErrorState {
  type: 'network' | 'empty' | 'auth' | 'unknown';
  message: string;
  retryable: boolean;
}
```

**Strategy**: 
- Show user-friendly error messages
- Provide retry mechanisms for network errors
- Cache successful responses for offline viewing
- Fallback to previous tab if current tab fails

## Testing Strategy

### Unit Tests

1. **Component Rendering**: Test all components render correctly with props
2. **Tab Navigation**: Verify tab switching updates state and content
3. **Data Fetching**: Mock API calls and test loading/error states
4. **Responsive Behavior**: Test layout changes at different breakpoints

### Integration Tests

1. **Tab Content Loading**: Test full flow from tab click to content display
2. **Refresh Functionality**: Verify refresh updates current tab content
3. **Empty States**: Test behavior when user has no content in each tab
4. **Error Handling**: Test network failures and recovery

### E2E Tests

1. **Complete User Journey**: Navigate through all tabs and verify content
2. **Mobile Responsiveness**: Test on various mobile screen sizes
3. **Performance**: Verify smooth transitions and loading times
4. **Cross-browser Compatibility**: Test on major browsers

### Test Data Requirements

```typescript
// Mock data for testing
const mockUserData = {
  followingPosts: FullPost[],
  userPosts: FullPost[],
  userComments: UserComment[],
  favoritePosts: FullPost[],
  userReplies: UserReply[]
};
```

## Responsive Design

### Breakpoints (Chakra UI)

- **Mobile**: `base` (0px+) - Single column, stacked layout
- **Tablet**: `md` (768px+) - Maintain single column, larger spacing
- **Desktop**: `lg` (992px+) - Two column with sidebar
- **Large Desktop**: `xl` (1200px+) - Wider content area

### Mobile Optimizations

1. **Tab Navigation**: Horizontal scroll for tabs if needed
2. **Content Area**: Full width, no sidebar
3. **Cards**: Adjusted padding and font sizes
4. **Buttons**: Touch-friendly sizing (44px minimum)

### Desktop Layout

1. **Single Column**: Clean, centered layout without sidebar distractions
2. **Main Content**: Optimal width for content readability (max 800px)
3. **Tabs**: Full width with hover states
4. **Cards**: Consistent spacing and typography

## Performance Considerations

### Data Loading Strategy

1. **Lazy Loading**: Load tab content only when tab is selected
2. **Caching**: Cache API responses to avoid repeated requests
3. **Pagination**: Implement pagination for large content lists
4. **Prefetching**: Preload likely next tab content

### Optimization Techniques

1. **Memoization**: Use React.memo for expensive components
2. **Virtual Scrolling**: For large lists of posts/comments
3. **Image Optimization**: Lazy load and optimize user avatars
4. **Bundle Splitting**: Code split by tab content if needed



## Migration Strategy

### Phase 1: Core Structure
- Implement tab navigation component
- Create new API endpoints
- Set up basic responsive layout

### Phase 2: Content Implementation
- Implement each tab's content display
- Add loading and error states
- Integrate refresh functionality

### Phase 3: Polish and Optimization
- Add smooth transitions
- Implement caching
- Performance optimization
- Accessibility improvements

### Rollback Plan
- Feature flag for new vs old home page
- Gradual rollout to user segments
- Quick rollback capability if issues arise