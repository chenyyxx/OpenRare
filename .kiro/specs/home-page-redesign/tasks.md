# Implementation Plan

- [x] 1. Create new API endpoints for user content

  - Create API endpoint to fetch user's own posts
  - Create API endpoint to fetch user's comments with post context
  - Create API endpoint to fetch user's favorite/upvoted posts
  - Create API endpoint to fetch replies to user's posts and comments
  - _Requirements: 2.1, 3.1, 4.1, 5.1_

- [x] 1.1 Implement get_user_posts API endpoint

  - Create `/api/get_user_posts.ts` that fetches posts created by the user
  - Include user, disease, theme, votes, and comment count in the response
  - Add email parameter validation and error handling
  - _Requirements: 2.1_

- [x] 1.2 Implement get_user_comments API endpoint

  - Create `/api/get_user_comments.ts` that fetches user's comments with post context
  - Include comment content, creation date, and associated post information
  - Return post title and disease information for context
  - _Requirements: 3.1_

- [x] 1.3 Implement get_user_favorites API endpoint

  - Create `/api/get_user_favorites.ts` that fetches posts the user has upvoted
  - Query posts where user has voted positively
  - Include full post information with engagement metrics
  - _Requirements: 4.1_

- [x] 1.4 Implement get_user_replies API endpoint

  - Create `/api/get_user_replies.ts` that fetches replies to user's posts and comments
  - Distinguish between replies to posts vs replies to comments
  - Include reply content and parent context information
  - _Requirements: 5.1_

- [x] 2. Create core tab navigation components

  - Build TabNavigation component using button-like tabs with active state management
  - Style tabs as buttons with clear active/inactive visual states
  - Implement smooth transitions between tabs
  - Add responsive behavior for mobile devices
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 2.1 Create TabNavigation component

  - Build component with 5 button-like tabs: Following, My Posts, My Comments, Favorites, Replies
  - Use Chakra UI Button components styled as tabs with active/inactive states
  - Implement active tab state management using React state
  - Add click handlers for tab switching
  - _Requirements: 11.1, 11.3_

- [x] 2.2 Add responsive tab behavior

  - Implement horizontal scrolling for mobile when tabs don't fit
  - Ensure tabs are touch-friendly on mobile devices
  - Add proper spacing and sizing for different screen sizes
  - Test tab navigation on various mobile screen sizes
  - _Requirements: 11.4_

- [x] 2.3 Implement tab transition animations

  - Add smooth content transitions when switching between tabs
  - Implement loading states during tab content fetching
  - Ensure transitions don't interfere with user interactions
  - _Requirements: 11.2_

- [x] 3. Build content display components for each tab type

  - Create CommentList component for displaying user comments
  - Create ReplyList component for displaying replies to user content
  - Implement EmptyState component with contextual messages
  - Reuse existing PostList component for post-based tabs
  - _Requirements: 2.2, 3.2, 4.2, 5.2_

- [x] 3.1 Create CommentList component

  - Build component to display user's comments with post context
  - Show comment content, creation date, and link to original post
  - Include post title and rare disease information for context
  - Add truncation for long comments with expand functionality
  - _Requirements: 3.2, 3.3_

- [x] 3.2 Create ReplyList component

  - Build component to display replies to user's posts and comments
  - Visually distinguish between post replies and comment replies
  - Include links to view full context of original post/comment
  - Show reply content and creation date
  - _Requirements: 5.2, 5.3_

- [x] 3.3 Create EmptyState component

  - Build reusable component for when tabs have no content
  - Create different messages for each tab type
  - Include action buttons (e.g., link to rare diseases page, create post)
  - Style consistently with the overall design
  - _Requirements: 1.3, 2.3, 3.4, 4.3, 5.4_

- [x] 4. Implement search and filter functionality

  - Create SearchAndFilter component with real-time search
  - Add dropdown filters for rare disease and theme
  - Implement filter logic for post-based tabs
  - Add clear filters functionality
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 4.1 Create SearchAndFilter component

  - Build search input with real-time filtering by post title
  - Create dropdown selectors for rare disease and theme filters
  - Implement controlled component pattern for filter state
  - Add clear all filters button
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 4.2 Implement filter logic

  - Create filtering functions that work with search and dropdown filters
  - Ensure multiple filters work together (AND logic)
  - Implement efficient filtering that doesn't cause performance issues
  - Add debouncing for search input to avoid excessive filtering
  - _Requirements: 10.4, 10.5_

- [x] 4.3 Integrate filters with post tabs

  - Connect SearchAndFilter component to Following, My Posts, and Favorites tabs
  - Ensure filters reset when switching between tabs
  - Show filter state clearly to users
  - _Requirements: 10.6_

- [x] 5. Create followed diseases tags component

  - Build FollowedDiseasesTags component for the Following tab
  - Display user's followed diseases as clickable tags
  - Implement tag-based filtering for posts
  - Add link to rare diseases page for managing interests
  - _Requirements: 1.3, 1.4, 1.6_

- [x] 5.1 Create FollowedDiseasesTags component

  - Build component that displays diseases as clickable tag/badge elements
  - Style tags with Chakra UI Badge or Tag components
  - Implement click handlers for disease-based filtering
  - Show selected state when a disease tag is active
  - _Requirements: 1.3, 1.4_

- [x] 5.2 Add disease management link

  - Include prominent link/button to rare diseases page
  - Position link appropriately within the Following tab
  - Style consistently with the overall design
  - _Requirements: 1.6_

- [x] 6. Build main page header and refresh functionality

  - Create HomePageHeader component with page description
  - Implement refresh button that reloads current tab content
  - Add loading states during refresh operations
  - Style header consistently with existing design
  - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4_

- [x] 6.1 Create HomePageHeader component

  - Build header with clear page description explaining the home page purpose
  - Add refresh button with appropriate icon and styling
  - Implement loading state for refresh button during operations
  - Position elements appropriately within the header layout
  - _Requirements: 7.1, 7.3, 8.1_

- [x] 6.2 Implement refresh functionality

  - Add refresh logic that reloads current active tab's content
  - Show loading spinner during refresh operations
  - Handle refresh errors gracefully with user feedback
  - Ensure refresh doesn't lose user's current filters or search
  - _Requirements: 8.2, 8.3, 8.4_

- [x] 7. Integrate all components into redesigned home page


  - Modify existing home.tsx to use new tab-based layout
  - Remove old sidebar components (My Profile, My Rare Diseases)
  - Implement responsive layout without right sidebar
  - Connect all components with proper data flow
  - _Requirements: 6.1, 6.2, 9.1, 9.2, 9.3, 9.4_

- [x] 7.1 Update home.tsx layout structure

  - Remove existing sidebar components and layout
  - Implement new single-column centered layout
  - Add HomePageHeader, TabNavigation, and ContentArea components
  - Ensure responsive behavior matches design specifications
  - _Requirements: 6.1, 6.2, 9.1, 9.4_

- [x] 7.2 Implement tab content switching logic

  - Create state management for active tab and content
  - Connect tab navigation to content area updates
  - Implement data fetching logic for each tab type
  - Add error handling for failed API calls
  - _Requirements: 9.2, 9.3_

- [x] 7.3 Connect API endpoints to tab content

  - Integrate all new API endpoints with their respective tab components
  - Implement proper loading states for each content type
  - Add error handling and retry mechanisms
  - Ensure data is properly formatted for component consumption
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 8. Add mobile responsiveness and layout fixes

  - Fix mobile layout issues from current implementation
  - Ensure proper display when no posts exist
  - Test responsive behavior across different screen sizes
  - Optimize touch interactions for mobile devices
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 8.1 Fix mobile layout issues

  - Ensure content stacks properly on mobile devices
  - Fix any overflow or spacing issues on small screens
  - Test tab navigation usability on mobile
  - Verify all interactive elements are touch-friendly
  - _Requirements: 6.1, 6.3_

- [ ] 8.2 Fix empty state display issues

  - Ensure empty states display properly on all screen sizes
  - Fix layout when no posts exist in any tab
  - Test empty states on both mobile and desktop
  - _Requirements: 6.2, 6.4_

- [ ] 9. Testing and polish

  - Write unit tests for new components
  - Test all tab switching and content loading scenarios
  - Verify search and filter functionality works correctly
  - Test responsive behavior and mobile interactions
  - _Requirements: All requirements verification_

- [ ] 9.1 Create unit tests for new components

  - Write tests for TabNavigation, CommentList, ReplyList components
  - Test SearchAndFilter component functionality
  - Create tests for FollowedDiseasesTags component
  - Test HomePageHeader and refresh functionality
  - _Requirements: Component functionality verification_

- [ ] 9.2 Test tab switching and data loading

  - Test switching between all 5 tabs
  - Verify correct data loads for each tab
  - Test loading states and error handling
  - Ensure smooth transitions between tabs
  - _Requirements: 11.1, 11.2_

- [ ] 9.3 Test search and filter functionality
  - Test real-time search across post titles
  - Verify disease and theme filters work correctly
  - Test combination of multiple filters
  - Test filter clearing functionality
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
