import React, { useState } from "react";
import {
  Box,
  useColorModeValue,
  VStack,
  HStack,
  Flex,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetchData } from "../../utils/utils";
import Sidebar from "../../components/sidebar";
import AuthRequiredAlert from "../../components/AuthRequiredAlert";
import ThemeSearchAndFilter, { ThemeFilterState, Disease } from "../../components/ThemeSearchAndFilter";
import { ThemeHeader } from "../../components/theme/ThemeVisuals";
import Post from "../../components/post";
import { FullPost } from "../../components/post";

interface ThemePageData {
  theme: {
    id: string;
    name: string;
    description: string;
    guidelines: string;
    color: string;
    postCount: number;
  };
  posts: FullPost[];
  diseases: Array<{
    id: number;
    name: string;
  }>;
}

export default function ThemePage({
  initialData,
}: {
  initialData: ThemePageData | null;
}) {
  const router = useRouter();
  const { id } = router.query;
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [filters, setFilters] = useState<ThemeFilterState>({
    search: "",
    selectedDiseases: [],
  });
  const { data: session } = useSession();

  // Handle create post with authentication check
  const handleCreatePost = () => {
    if (!session?.user?.email) {
      setShowAuthAlert(true);
      return;
    }
    router.push(`/create_post?theme=${data?.theme.id}`);
  };

  // Move all hooks to the top level
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const emptyStateBg = useColorModeValue("white", "gray.800");
  const emptyStateBorderColor = useColorModeValue("gray.200", "gray.600");

  const url =
    id && typeof id === "string" ? `/api/get_theme_posts?id=${id}` : null;
  const { data, error } = useSWR<ThemePageData>(url, url ? fetchData : null, {
    fallbackData: initialData || undefined,
  });

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Sidebar>
          <Flex justify="center" pt="78px" p={6}>
            <Alert status="error" maxW="md">
              <AlertIcon />
              Failed to load theme. Please try again later.
            </Alert>
          </Flex>
        </Sidebar>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Sidebar>
          <Flex justify="center" align="center" pt="78px" minH="50vh">
            <Spinner size="xl" />
          </Flex>
        </Sidebar>
      </Box>
    );
  }

  // Filter posts based on search and selected diseases
  const filteredPosts = data ? data.posts.filter((post) => {
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!post.title.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Apply disease filter
    if (filters.selectedDiseases.length > 0) {
      if (!filters.selectedDiseases.includes(post.disease.id)) {
        return false;
      }
    }

    return true;
  }) : [];

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar>
        <Box pt="78px">
          <Container maxW="6xl" py={8}>
            {/* Theme Header */}
            <ThemeHeader
              themeName={data.theme.name}
              description={data.theme.description}
              guidelines={data.theme.guidelines}
              postCount={data.theme.postCount}
            />

            {/* Controls */}
            <VStack spacing={4} mb={6} align="stretch">
              <HStack spacing={4} justify="space-between" wrap="wrap">
                <HStack spacing={4}>
                  <Button
                    colorScheme="teal"
                    size="md"
                    fontWeight="500"
                    rounded="full"
                    onClick={handleCreatePost}
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "md"
                    }}
                  >
                    Create Post
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    size="md"
                    fontWeight="500"
                    rounded="full"
                    onClick={() => router.push("/")}
                    _hover={{
                      transform: "translateY(-1px)",
                      shadow: "md"
                    }}
                  >
                    Back to Explore
                  </Button>
                </HStack>
              </HStack>

              {/* Search and Filter */}
              <Box
                bg="white"
                rounded="2xl"
                p={{ base: 6, md: 8 }}
                shadow="lg"
                border="1px"
                borderColor="gray.200"
              >
                <ThemeSearchAndFilter
                  onFiltersChange={setFilters}
                  availableDiseases={data.diseases}
                  currentFilters={filters}
                />
              </Box>
            </VStack>

            {/* Posts */}
            {filteredPosts.length > 0 ? (
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="medium" color="gray.700">
                    {filters.search || filters.selectedDiseases.length > 0
                      ? `Filtered Posts (${filteredPosts.length})`
                      : `All Posts (${filteredPosts.length})`}
                  </Text>
                </HStack>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  {filteredPosts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </SimpleGrid>
              </VStack>
            ) : (
              <Box
                textAlign="center"
                py={16}
                bg={emptyStateBg}
                borderRadius="2xl"
                border="1px"
                borderColor={emptyStateBorderColor}
              >
                <VStack spacing={6}>
                  <VStack spacing={2}>
                    <Text fontSize="xl" fontWeight="medium" color="gray.600">
                      {filters.search || filters.selectedDiseases.length > 0
                        ? `No posts match your current filters`
                        : `No posts in ${data.theme.name} yet`}
                    </Text>
                    <Text fontSize="md" color="gray.500">
                      {filters.search || filters.selectedDiseases.length > 0
                        ? "Try adjusting your search terms or selected diseases, or create a new post."
                        : `Be the first to share content in ${data.theme.name}!`}
                    </Text>
                  </VStack>
                  <HStack spacing={3}>
                    <Button
                      colorScheme="teal"
                      size="lg"
                      fontWeight="500"
                      rounded="full"
                      onClick={handleCreatePost}
                      _hover={{
                        transform: "translateY(-1px)",
                        shadow: "md"
                      }}
                    >
                      Create Post
                    </Button>
                    {(filters.search || filters.selectedDiseases.length > 0) && (
                      <Button
                        variant="outline"
                        colorScheme="gray"
                        size="lg"
                        fontWeight="500"
                        rounded="full"
                        onClick={() => setFilters({ search: "", selectedDiseases: [] })}
                        _hover={{
                          transform: "translateY(-1px)",
                          shadow: "md"
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Box>
            )}
          </Container>
        </Box>
      </Sidebar>
      
      {/* Authentication Alert */}
      {showAuthAlert && (
        <AuthRequiredAlert 
          action="create a post" 
          isOpen={showAuthAlert}
          onClose={() => setShowAuthAlert(false)}
        />
      )}
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (!id || typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  try {
    const res = await fetch(
      new URL(`${process.env.NEXTAUTH_URL}/api/get_theme_posts?id=${id}`)
    );

    if (!res.ok) {
      throw new Error("Failed to fetch theme data");
    }

    const initialData = await res.json();

    return { props: { initialData } };
  } catch (error) {
    console.error("Error fetching theme data:", error);

    return {
      props: {
        initialData: null,
      },
    };
  }
};
