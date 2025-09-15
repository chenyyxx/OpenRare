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
  Select,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchData } from "../../utils/utils";
import Sidebar from "../../components/sidebar";
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
  const [selectedDisease, setSelectedDisease] = useState<string>("all");

  // Move all hooks to the top level
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const selectBg = useColorModeValue("white", "gray.700");
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

  // Filter posts by selected disease
  const filteredPosts =
    selectedDisease === "all"
      ? data.posts
      : data.posts.filter(
          (post) => post.disease.id.toString() === selectedDisease
        );

  console.log("initialData", initialData);
  console.log("filteredPosts", filteredPosts);

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
                    colorScheme="blue"
                    size="md"
                    onClick={() =>
                      router.push(`/create_post?theme=${data.theme.id}`)
                    }
                  >
                    Create Post in {data.theme.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => router.push("/")}
                  >
                    Back to Explore
                  </Button>
                </HStack>

                {/* Disease Filter */}
                {data.diseases.length > 0 && (
                  <HStack spacing={2} minW="250px">
                    <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
                      Filter by rare disease:
                    </Text>
                    <Select
                      value={selectedDisease}
                      onChange={(e) => setSelectedDisease(e.target.value)}
                      size="sm"
                      bg={selectBg}
                    >
                      <option value="all">
                        All diseases ({data.posts.length})
                      </option>
                      {data.diseases.map((disease) => {
                        const count = data.posts.filter(
                          (post) => post.disease.id === disease.id
                        ).length;
                        return (
                          <option
                            key={disease.id}
                            value={disease.id.toString()}
                          >
                            {disease.name} ({count})
                          </option>
                        );
                      })}
                    </Select>
                  </HStack>
                )}
              </HStack>

              {/* Filter summary */}
              {selectedDisease !== "all" && (
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Showing {filteredPosts.length} posts for:
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="blue.600">
                    {
                      data.diseases.find(
                        (d) => d.id.toString() === selectedDisease
                      )?.name
                    }
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setSelectedDisease("all")}
                  >
                    Clear filter
                  </Button>
                </HStack>
              )}
            </VStack>

            {/* Posts */}
            {filteredPosts.length > 0 ? (
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="medium" color="gray.700">
                    {selectedDisease === "all"
                      ? `All Posts (${filteredPosts.length})`
                      : `Filtered Posts (${filteredPosts.length})`}
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
                borderRadius="lg"
                border="1px"
                borderColor={emptyStateBorderColor}
              >
                <VStack spacing={6}>
                  <VStack spacing={2}>
                    <Text fontSize="xl" fontWeight="medium" color="gray.600">
                      {selectedDisease === "all"
                        ? `No posts in ${data.theme.name} yet`
                        : `No posts for ${
                            data.diseases.find(
                              (d) => d.id.toString() === selectedDisease
                            )?.name
                          } in ${data.theme.name}`}
                    </Text>
                    <Text fontSize="md" color="gray.500">
                      {selectedDisease === "all"
                        ? `Be the first to share content in ${data.theme.name}!`
                        : "Try selecting a different rare disease or create a new post."}
                    </Text>
                  </VStack>
                  <HStack spacing={3}>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      onClick={() =>
                        router.push(`/create_post?theme=${data.theme.id}`)
                      }
                    >
                      Create Post
                    </Button>
                    {selectedDisease !== "all" && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setSelectedDisease("all")}
                      >
                        View All Posts
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Box>
            )}
          </Container>
        </Box>
      </Sidebar>
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
