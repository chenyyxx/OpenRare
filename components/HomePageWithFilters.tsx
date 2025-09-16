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

  const { data: myPostsResponse, error: myPostsError, isLoading: myPostsLoading } = useSWR(
    email ? `/api/get_user_posts?email=${email}` : null,
    fetchData
  );

  const myPosts = myPostsResponse?.posts || [];

  // Extract comments and replies directly from myPosts
  // ALL comments on my posts (including my own comments) with post context
  const myComments = myPosts
    .flatMap(post => 
      (post.comments || []).map(comment => ({
        ...comment,
        post: {
          id: post.id,
          title: post.title,
          disease: post.disease,
          theme: post.theme,
          user: post.user
        }
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ALL subcomments on my comments (including my own replies) with comment and post context
  const replies = myPosts
    .flatMap(post => 
      post.comments
        ?.filter(comment => comment.user.email === email) // My comments only
        ?.flatMap(comment => 
          (comment.subComments || []).map(subComment => ({
            ...subComment,
            comment: {
              ...comment,
              post: {
                id: post.id,
                title: post.title,
                disease: post.disease,
                theme: post.theme,
                user: post.user
              }
            }
          }))
        ) || []
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Determine loading state for current tab
  const getCurrentTabLoading = () => {
    switch (activeTab) {
      case 'following':
        return followingLoading;
      case 'myPosts':
      case 'myComments':
      case 'replies':
        return myPostsLoading;
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
      case 'myComments':
      case 'replies':
        return myPostsError?.message;
      default:
        return undefined;
    }
  };

  // Calculate tab counts for display
  const tabCounts = {
    following: followingPosts?.length || 0,
    myPosts: myPosts?.length || 0,
    myComments: myComments?.length || 0,
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
          replies={[]}
        />
      </Box>
    </VStack>
  );
}