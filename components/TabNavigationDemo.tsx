import React, { useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import TabNavigation, { TabType } from "./TabNavigation";
import ContentArea from "./ContentArea";
import { useTabTransition } from "./useTabTransition";

// Demo content for each tab
const tabContent: Record<TabType, React.ReactNode> = {
  following: (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Following Tab</Text>
      <Text>This shows posts from rare diseases you follow.</Text>
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text>Sample post from followed disease...</Text>
      </Box>
    </VStack>
  ),
  myPosts: (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">My Posts Tab</Text>
      <Text>This shows all posts you&apos;ve created.</Text>
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text>Your post content...</Text>
      </Box>
    </VStack>
  ),
  myComments: (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">My Comments Tab</Text>
      <Text>This shows all comments you&apos;ve made.</Text>
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text>Your comment on a post...</Text>
      </Box>
    </VStack>
  ),
  favorites: (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Favorites Tab</Text>
      <Text>This shows posts you&apos;ve upvoted.</Text>
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text>Favorited post...</Text>
      </Box>
    </VStack>
  ),
  replies: (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Replies Tab</Text>
      <Text>This shows replies to your posts and comments.</Text>
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text>Reply to your content...</Text>
      </Box>
    </VStack>
  ),
};

export default function TabNavigationDemo() {
  const { activeTab, isTransitioning, changeTab } = useTabTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Mock tab counts
  const tabCounts = {
    following: 12,
    myPosts: 5,
    myComments: 23,
    favorites: 8,
    replies: 3,
  };

  const handleTabChange = (newTab: TabType) => {
    setIsLoading(true);
    changeTab(newTab);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabCounts={tabCounts}
        isTransitioning={isTransitioning}
      />
      
      <ContentArea
        activeTab={activeTab}
        isLoading={isLoading}
      >
        {tabContent[activeTab]}
      </ContentArea>
    </Box>
  );
}