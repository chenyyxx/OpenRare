import React, { useState } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import TabNavigation, { TabType } from "./TabNavigation";
import FilteredContentArea from "./FilteredContentArea";
import { FullPost } from "./post";
import { fetchData, fetchFlatUserSectionPost } from "../utils/utils";

/**
 * Complete home page implementation with integrated filtering
 * This component demonstrates how to use all the filter components together
 */
export default function HomePageWithFilters() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('following');
  
  const email = session?.user?.email;

  // Fetch data for different tabs
  const { data: followingPosts, error: followingError, isLoading: followingLoading } = useSWR<FullPost[]>(
    email ? `/api/get_user_diseases_posts?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  const { data: myPosts, error: myPostsError, isLoading: myPostsLoading } = useSWR<FullPost[]>(
    email ? `/api/get_user_posts?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  const { data: myComments, error: commentsError, isLoading: commentsLoading } = useSWR(
    email ? `/api/get_user_comments?email=${email}` : null,
    fetchData
  );

  const { data: favoritesPosts, error: favoritesError, isLoading: favoritesLoading } = useSWR<FullPost[]>(
    email ? `/api/get_user_favorites?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  const { data: replies, error: repliesError, isLoading: repliesLoading } = useSWR(
    email ? `/api/get_user_replies?email=${email}` : null,
    fetchData
  );

  // Determine loading state for current tab
  const getCurrentTabLoading = () => {
    switch (activeTab) {
      case 'following':
        return followingLoading;
      case 'myPosts':
        return myPostsLoading;
      case 'myComments':
        return commentsLoading;
      case 'favorites':
        return favoritesLoading;
      case 'replies':
        return repliesLoading;
      default:
        return false;
    }
  };

  // Determine error state for current tab
  const getCurrentTabError = () => {
    switch (activeTab) {
      case 'following':
        return followingError?.message;
      case 'myPosts':
        return myPostsError?.message;
      case 'myComments':
        return commentsError?.message;
      case 'favorites':
        return favoritesError?.message;
      case 'replies':
        return repliesError?.message;
      default:
        return undefined;
    }
  };

  // Calculate tab counts for display
  const tabCounts = {
    following: followingPosts?.length || 0,
    myPosts: myPosts?.length || 0,
    myComments: myComments?.length || 0,
    favorites: favoritesPosts?.length || 0,
    replies: replies?.length || 0,
  };

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
  };

  const handleRetry = () => {
    // Trigger data refetch based on current tab
    // This would typically involve mutating the SWR cache or triggering a refetch
    console.log(`Retrying data fetch for tab: ${activeTab}`);
  };

  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bg}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabCounts={tabCounts}
          />

          {/* Filtered Content Area */}
          <FilteredContentArea
            activeTab={activeTab}
            isLoading={getCurrentTabLoading()}
            error={getCurrentTabError()}
            onRetry={handleRetry}
            followingPosts={followingPosts}
            myPosts={myPosts}
            myComments={myComments}
            favoritesPosts={favoritesPosts}
            replies={replies}
          />
        </VStack>
      </Container>
    </Box>
  );
}

/**
 * Simplified version for integration into existing home page
 * This can be used to replace the existing content area in home.tsx
 */
export function HomePageContentWithFilters() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('following');
  
  const email = session?.user?.email;

  // Use existing data fetching patterns from home.tsx
  const { data: followingPosts } = useSWR<FullPost[]>(
    email ? `/api/get_user_diseases_posts?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  return (
    <VStack spacing={6} align="stretch">
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <FilteredContentArea
        activeTab={activeTab}
        isLoading={false}
        followingPosts={followingPosts}
        myPosts={[]} // Add other data sources as needed
        myComments={[]}
        favoritesPosts={[]}
        replies={[]}
      />
    </VStack>
  );
}

/**
 * Props interface for custom implementations
 */
export interface HomePageWithFiltersProps {
  initialTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  customDataFetching?: boolean;
}

/**
 * Customizable version that accepts external data and configuration
 */
export function CustomHomePageWithFilters({
  initialTab = 'following',
  onTabChange,
  customDataFetching = false,
}: HomePageWithFiltersProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    onTabChange?.(newTab);
  };

  // This version allows for custom data fetching logic
  // Useful when integrating with existing data management patterns

  return (
    <VStack spacing={6} align="stretch">
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Content area would be provided by parent component */}
      <Box>
        {/* Custom content based on activeTab */}
        <FilteredContentArea
          activeTab={activeTab}
          isLoading={false}
          followingPosts={[]}
          myPosts={[]}
          myComments={[]}
          favoritesPosts={[]}
          replies={[]}
        />
      </Box>
    </VStack>
  );
}