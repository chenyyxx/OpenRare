import React from "react";
import {
  Box,
  VStack,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { fetchData } from "../utils/utils";
import Sidebar from "../components/sidebar";
import { ThemeCard } from "../components/theme/ThemeCard";

interface ThemeWithPosts {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  guidelines: string;
  postCount: number;
  recentPosts: Array<{
    id: string;
    title: string;
    author: string;
    disease: string;
  }>;
}

export default function Explore({
  initialThemes,
}: {
  initialThemes: ThemeWithPosts[];
}) {
  const url = `/api/get_themes_with_posts`;
  const { data: themes, error } = useSWR<ThemeWithPosts[]>(url, fetchData, {
    fallbackData: initialThemes,
  });



  if (error) {
    return (
      <Box minH="100vh" bg={"gray.50"}>
        <Sidebar>
          <Flex justify="center" pt="78px" p={6}>
            <Alert status="error" maxW="md">
              <AlertIcon />
              Failed to load themes. Please try again later.
            </Alert>
          </Flex>
        </Sidebar>
      </Box>
    );
  }

  if (!themes) {
    return (
      <Box minH="100vh" bg={"gray.50"}>
        <Sidebar>
          <Flex justify="center" align="center" pt="78px" minH="50vh">
            <Spinner size="xl" />
          </Flex>
        </Sidebar>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={"gray.50"}>
      <Sidebar>
        <Flex justify="center" pt={"78px"}>
          <Box w="full" p={{ base: "16px", md: "24px" }} minH="full" maxW="1200px">
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Box 
                bg="white" 
                rounded={"lg"} 
                p={{ base: 4, md: 6 }} 
                shadow="md"
                border="1px"
                borderColor="gray.200"
              >
                <Heading size="lg" color="gray.700" mb={2}>
                  Discover Community Content
                </Heading>
                <Text color="gray.600">
                  Explore different types of content organized by themes. Find personal stories, 
                  get help and support, discover events, or learn from research and information.
                </Text>
              </Box>

              {/* Theme Cards Section */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={8}>
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={{
                      id: theme.id,
                      name: theme.name,
                      description: theme.description,
                      guidelines: theme.guidelines,
                      postCount: theme.postCount,
                    }}
                    recentPosts={theme.recentPosts}
                  />
                ))}
              </SimpleGrid>

              {/* Additional Information */}
              <Box 
                bg="white" 
                rounded={"lg"} 
                p={{ base: 4, md: 6 }} 
                shadow="md"
                border="1px"
                borderColor="gray.200"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Heading size="md" color="gray.600">
                    New to the community?
                  </Heading>
                  <Text color="gray.500" maxW="2xl">
                    Each theme serves a different purpose in our community. Click on any theme above 
                    to explore posts and learn more about what content belongs in each area.
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Sidebar>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Fetch themes with recent posts from the API
    const res = await fetch(new URL(`${process.env.NEXTAUTH_URL}/api/get_themes_with_posts`));
    
    if (!res.ok) {
      throw new Error('Failed to fetch themes');
    }
    
    const initialThemes = await res.json();

    return { props: { initialThemes } };
  } catch (error) {
    console.error('Error fetching themes:', error);
    
    // Return empty themes array as fallback
    return { 
      props: { 
        initialThemes: [] 
      } 
    };
  }
};
