import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  useColorModeValue,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { TabType } from "./TabNavigation";
import { useHomePageRefresh } from "../hooks/useHomePageRefresh";

interface HomePageHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  activeTab?: TabType;
  // Enhanced props for integrated refresh functionality
  enableIntegratedRefresh?: boolean;
}

export default function HomePageHeader({ 
  onRefresh, 
  isRefreshing: externalIsRefreshing, 
  activeTab = 'following',
  enableIntegratedRefresh = false 
}: HomePageHeaderProps) {
  const { data: session } = useSession();
  const toast = useToast();
  
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const buttonBg = useColorModeValue("gray.50", "gray.700");
  const buttonHoverBg = useColorModeValue("gray.100", "gray.600");

  // Integrated refresh functionality
  const { isRefreshing: integratedIsRefreshing, refreshCurrentTab, error } = useHomePageRefresh({
    email: session?.user?.email,
    activeTab,
    onRefreshComplete: () => {
      toast({
        title: "Content refreshed",
        description: "Your content has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onRefreshError: (error) => {
      toast({
        title: "Refresh failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Determine which refresh state and handler to use
  const isRefreshing = enableIntegratedRefresh ? integratedIsRefreshing : (externalIsRefreshing || false);
  const handleRefresh = enableIntegratedRefresh ? refreshCurrentTab : (onRefresh || (() => {}));

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={{ base: 4, md: 6 }}
      mb={6}
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        gap={{ base: 3, sm: 0 }}
      >
        <Box>
          <Heading
            as="h1"
            size={{ base: "md", md: "lg" }}
            color={headingColor}
            fontWeight="600"
            mb={2}
          >
            Your Personalized Feed
          </Heading>
          <Text
            color={textColor}
            fontSize={{ base: "sm", md: "md" }}
            maxW={{ base: "full", md: "500px" }}
          >
            Stay updated with content from your interests, posts, comments, and more
          </Text>
        </Box>
        
        <IconButton
          aria-label="Refresh content"
          icon={isRefreshing ? <Spinner size="sm" /> : <FiRefreshCw />}
          onClick={handleRefresh}
          isDisabled={isRefreshing}
          bg={buttonBg}
          _hover={{
            bg: buttonHoverBg,
            transform: isRefreshing ? "none" : "rotate(180deg)",
          }}
          _active={{
            transform: isRefreshing ? "none" : "rotate(180deg) scale(0.95)",
          }}
          transition="all 0.3s ease-in-out"
          size={{ base: "md", md: "lg" }}
          borderRadius="md"
          flexShrink={0}
        />
      </Flex>
    </Box>
  );
}