import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Fade,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
import { TabType } from "./TabNavigation";
import { FullPost } from "./post";
import FilterablePostTabs, { isTabFilterable } from "./FilterablePostTabs";
import Post from "./post";
import CommentList from "./CommentList";
import ReplyList from "./ReplyList";
import EmptyState from "./EmptyState";

interface FilteredContentAreaProps {
  activeTab: TabType;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  
  // Data for different tab types
  followingPosts?: FullPost[];
  myPosts?: FullPost[];
  myComments?: any[]; // UserComment type from CommentList
  favoritesPosts?: FullPost[];
  replies?: any[]; // UserReply type from ReplyList
}

/**
 * Enhanced ContentArea that integrates with FilterablePostTabs
 * Handles different content types and applies filtering to post-based tabs
 */
export default function FilteredContentArea({
  activeTab,
  isLoading,
  error,
  onRetry,
  followingPosts = [],
  myPosts = [],
  myComments = [],
  favoritesPosts = [],
  replies = [],
}: FilteredContentAreaProps) {
  const [filteredPosts, setFilteredPosts] = useState<FullPost[]>([]);
  
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Get current tab's data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'following':
        return followingPosts;
      case 'myPosts':
        return myPosts;
      case 'myComments':
        return myComments;
      case 'favorites':
        return favoritesPosts;
      case 'replies':
        return replies;
      default:
        return [];
    }
  };

  const currentData = getCurrentTabData();

  // Handle filtered posts change from FilterablePostTabs
  const handleFilteredPostsChange = (posts: FullPost[]) => {
    setFilteredPosts(posts);
  };

  // Reset filtered posts when tab changes
  useEffect(() => {
    if (isTabFilterable(activeTab)) {
      setFilteredPosts(currentData as FullPost[]);
    }
  }, [activeTab, currentData]);

  // Loading state
  if (isLoading) {
    return (
      <Box
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={8}
        minH="400px"
      >
        <Center h="300px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
        </Center>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={8}
        minH="400px"
      >
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="300px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Something went wrong!
          </AlertTitle>
          <AlertDescription maxWidth="sm" mb={4}>
            {error}
          </AlertDescription>
          {onRetry && (
            <Button colorScheme="teal" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </Alert>
      </Box>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'following':
      case 'myPosts':
      case 'favorites':
        // Post-based tabs - use filtered posts
        const postsToShow = isTabFilterable(activeTab) ? filteredPosts : (currentData as FullPost[]);
        
        if (postsToShow.length === 0) {
          return <EmptyState tabType={activeTab} />;
        }
        
        return (
          <VStack spacing={6} align="stretch">
            {postsToShow.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </VStack>
        );

      case 'myComments':
        if (myComments.length === 0) {
          return <EmptyState tabType={activeTab} />;
        }
        return <CommentList comments={myComments} isLoading={false} />;

      case 'replies':
        if (replies.length === 0) {
          return <EmptyState tabType={activeTab} />;
        }
        return <ReplyList replies={replies} isLoading={false} />;

      default:
        return <EmptyState tabType={activeTab} />;
    }
  };

  return (
    <FilterablePostTabs
      activeTab={activeTab}
      posts={currentData as FullPost[]}
      isLoading={isLoading}
      onFilteredPostsChange={handleFilteredPostsChange}
    >
      <Box
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={6}
        minH="400px"
        position="relative"
        overflow="hidden"
      >
        <Fade 
          in={!isLoading} 
          transition={{ 
            enter: { duration: 0.3, delay: 0.1 },
            exit: { duration: 0.2 }
          }}
        >
          <Box
            key={activeTab} // Force re-render on tab change for smooth transitions
            transition="opacity 0.3s ease-in-out"
          >
            {renderTabContent()}
          </Box>
        </Fade>
      </Box>
    </FilterablePostTabs>
  );
}

/**
 * Hook for managing filtered content area state
 */
export function useFilteredContentArea() {
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    setError(undefined); // Clear errors when switching tabs
  };

  const handleRetry = () => {
    setError(undefined);
    // Trigger data refetch logic here
  };

  return {
    activeTab,
    isLoading,
    error,
    setIsLoading,
    setError,
    handleTabChange,
    handleRetry,
  };
}