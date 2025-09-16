import React from "react";
import {
  Box,
  Button,
  HStack,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";

export type TabType = 'following' | 'myPosts' | 'myComments' | 'favorites' | 'replies';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabCounts?: Record<TabType, number>;
  isTransitioning?: boolean;
}

interface TabConfig {
  key: TabType;
  label: string;
  shortLabel?: string;
}

const tabs: TabConfig[] = [
  { key: 'following', label: 'Following', shortLabel: 'Following' },
  { key: 'myPosts', label: 'My Posts', shortLabel: 'Posts' },
  { key: 'myComments', label: 'My Comments', shortLabel: 'Comments' },
  { key: 'favorites', label: 'Favorites', shortLabel: 'Favorites' },
  { key: 'replies', label: 'Replies', shortLabel: 'Replies' },
];

export default function TabNavigation({ 
  activeTab, 
  onTabChange, 
  tabCounts,
  isTransitioning = false
}: TabNavigationProps) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const activeBg = useColorModeValue("teal.500", "teal.200");
  const activeColor = useColorModeValue("white", "gray.800");
  const inactiveBg = useColorModeValue("gray.50", "gray.700");
  const inactiveColor = useColorModeValue("gray.700", "gray.200");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  
  // Use shorter labels on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      overflowX="auto"
      overflowY="hidden"
      // Smooth scrolling behavior
      css={{
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          height: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#CBD5E0',
          borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#A0AEC0',
        },
      }}
    >
      <HStack 
        spacing={{ base: 1, md: 2 }} 
        minW="max-content"
        // Ensure proper spacing on mobile
        px={{ base: 1, md: 0 }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tabCounts?.[tab.key];
          const displayLabel = isMobile && tab.shortLabel ? tab.shortLabel : tab.label;
          
          return (
            <Button
              key={tab.key}
              size={{ base: "sm", md: "md" }}
              variant="solid"
              bg={isActive ? activeBg : inactiveBg}
              color={isActive ? activeColor : inactiveColor}
              _hover={{
                bg: isActive ? activeBg : hoverBg,
                transform: "translateY(-1px)",
              }}
              _active={{
                transform: "translateY(0px)",
              }}
              onClick={() => onTabChange(tab.key)}
              borderRadius="md"
              fontWeight={isActive ? "600" : "500"}
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 2, md: 4 }}
              py={{ base: 2, md: 2 }}
              // Ensure touch-friendly sizing on mobile (minimum 44px)
              minH={{ base: "44px", md: "auto" }}
              minW="max-content"
              transition="all 0.2s ease-in-out"
              boxShadow={isActive ? "sm" : "none"}
              // Better touch targets on mobile
              _focus={{
                boxShadow: "outline",
              }}
              // Disable interaction during transitions
              isDisabled={isTransitioning}
              opacity={isTransitioning ? 0.7 : 1}
            >
              {displayLabel}
              {count !== undefined && count > 0 && (
                <Box
                  as="span"
                  ml={{ base: 1, md: 2 }}
                  px={{ base: 1.5, md: 2 }}
                  py={0.5}
                  bg={isActive ? "whiteAlpha.300" : "gray.300"}
                  color={isActive ? "white" : "gray.600"}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                  minW="18px"
                  textAlign="center"
                >
                  {count}
                </Box>
              )}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}