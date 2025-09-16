import React, { useState } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  Container,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import TabNavigation, { TabType } from "./TabNavigation";
import FilteredContentArea from "./FilteredContentArea";
import HomePageHeader from "./HomePageHeader";
import { FullPost } from "./post";
import { fetchData, fetchFlatUserSectionPost } from "../utils/utils";
import { useHomePageRefresh } from "../hooks/useHomePageRefresh";

/**
 * Complete home page implementation with integrated refresh functionality
 * Demonstrates how to use HomePageHeader with FilteredContentArea
 */
export default function HomePageWithRefresh() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const toast = useToast();
  
  const email = session?.user?.email;

  // Fetch data for different tabs
  const { data: followingPosts, error: followingError, isLoading: followingLoading, mutate: mutateFollowing } = useSWR<FullPost[]>(
    email ? `/api/get_user_diseases_posts?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  const { data: myPosts, error: myPostsError, isLoading: myPostsLoading, mutate: mutateMyPosts } = useSWR<FullPost[]>(
    email ? `/api/get_user_posts?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  const { data: myComments, error: commentsError, isLoading: commentsLoading, mutate: mutateComments } = useSWR(
    email ? `/api/get_user_comments?email=${email}` : null,
    fetchData
  );

  const { data: favoritesPosts, error: favoritesError, isLoading: favoritesLoading, mutate: mutateFavorites } = useSWR<FullPost[]>(
    email ? `/api/get_user_favorites?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  const { data: replies, error: repliesError, isLoading: repliesLoading, mutate: mutateReplies } = useSWR(
    email ? `/api/get_user_replies?email=${email}` : null,
    fetchData
  );

  // Custom refresh functionality that preserves filters and search state
  const handleCustomRefresh = async () => {
    try {
      switch (activeTab) {
        case 'following':
          await mutateFollowing();
          break;
        case 'myPosts':
          await mutateMyPosts();
          break;
        case 'myComments':
          await mutateComments();
          break;
        case 'favorites':
          await mutateFavorites();
          break;
        case 'replies':
          await mutateReplies();
          break;
      }
      
      toast({
        title: "Content refreshed",
        description: "Your content has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh content. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
    handleCustomRefresh();
  };

  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bg}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Page Header with Refresh */}
          <HomePageHeader
            activeTab={activeTab}
            enableIntegratedRefresh={true}
          />

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
 * Simplified version that can be integrated into existing home.tsx
 * Uses external refresh handling for backward compatibility
 */
export function HomePageContentWithRefresh({
  activeTab,
  onTabChange,
  onRefresh,
  isRefreshing,
  children,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  children: React.ReactNode;
}) {
  return (
    <VStack spacing={6} align="stretch">
      <HomePageHeader
        activeTab={activeTab}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        enableIntegratedRefresh={false}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {children}
    </VStack>
  );
}