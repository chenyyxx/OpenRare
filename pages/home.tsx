import React, { useState } from "react";
import {
  Box,
  VStack,
  Spinner,
  Stack,
  Flex,
  Heading,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Sidebar from "../components/sidebar";
import TabNavigation, { TabType } from "../components/TabNavigation";
import ContentArea from "../components/ContentArea";
import Post, { FullPost } from "../components/post";
import CommentList, { UserComment } from "../components/CommentList";
import ReplyList, { UserReply } from "../components/ReplyList";
import EmptyState from "../components/EmptyState";
import FollowedDiseasesTags, {
  FollowedDisease,
} from "../components/FollowedDiseasesTags";
import SearchAndFilter, {
  FilterState,
  Disease,
  Theme,
} from "../components/SearchAndFilter";
import useSWR from "swr";
import { fetchData, fetchFlatUserSectionPost } from "../utils/utils";

export default function Home() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("following");
  const [error, setError] = useState<string | undefined>();
  const [selectedDisease, setSelectedDisease] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    diseaseId: null,
    themeId: null,
  });

  const email = session?.user?.email;

  // Data fetching for each tab
  const {
    data: followingPosts,
    error: followingError,
    mutate: mutateFollowing,
  } = useSWR<FullPost[]>(
    email ? `/api/get_user_diseases_posts?email=${email}` : null,
    fetchFlatUserSectionPost
  );

  const {
    data: userPostsResponse,
    error: userPostsError,
    mutate: mutateUserPosts,
  } = useSWR<{ posts: FullPost[]; count: number }>(
    email ? `/api/get_user_posts?email=${email}` : null,
    fetchData
  );

  // Extract data from API responses
  const userPosts = userPostsResponse?.posts;

  // Extract comments and replies directly from userPosts
  // ALL comments on my posts (including my own comments) with post context
  const userComments = !userPosts
    ? []
    : userPosts
        .flatMap((post: any) =>
          (post.comments || []).map((comment: any) => ({
            ...comment,
            post: {
              id: post.id,
              title: post.title,
              disease: post.disease,
              theme: post.theme,
              user: post.user,
            },
          }))
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

  // ALL subcomments on my comments (including my own replies) with comment and post context
  const userReplies = !userPosts
    ? []
    : userPosts
        .flatMap(
          (post: any) =>
            post.comments
              ?.filter((comment: any) => comment.user.email === email) // My comments only
              ?.flatMap((comment: any) =>
                (comment.subComments || []).map((subComment: any) => ({
                  ...subComment,
                  comment: {
                    ...comment,
                    post: {
                      id: post.id,
                      title: post.title,
                      disease: post.disease,
                      theme: post.theme,
                      user: post.user,
                    },
                  },
                }))
              ) || []
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

  // Get user data for followed diseases
  const { data: userData, error: userDataError, isLoading: userDataLoading } = useSWR(
    email ? `/api/get_full_user?email=${email}` : null,
    fetchData
  );

  // Handle loading state during authentication
  if (status === "loading") {
    return (
      <Box
        minH="100vh"
        bg={"gray.100"}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    signIn();
    return null;
  }

  // Determine current loading state
  const getCurrentLoadingState = () => {
    switch (activeTab) {
      case "following":
        return !followingPosts && !followingError;
      case "myPosts":
      case "myComments":
      case "replies":
        return !userPostsResponse && !userPostsError;
      default:
        return false;
    }
  };

  // Determine current error state
  const getCurrentError = () => {
    if (error) return error;
    switch (activeTab) {
      case "following":
        return followingError?.message;
      case "myPosts":
      case "myComments":
      case "replies":
        return userPostsError?.message;
      default:
        return undefined;
    }
  };

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setError(undefined);
    // Reset filters when changing tabs
    setFilters({
      search: "",
      diseaseId: null,
      themeId: null,
    });
    setSelectedDisease(null);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setError(undefined);
    try {
      switch (activeTab) {
        case "following":
          await mutateFollowing();
          break;
        case "myPosts":
        case "myComments":
        case "replies":
          await mutateUserPosts();
          break;
      }
    } catch (err) {
      setError("Failed to refresh content. Please try again.");
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    setError(undefined);
    handleRefresh();
  };

  // Filter posts based on current filters
  const filterPosts = (posts: FullPost[] | undefined): FullPost[] => {
    if (!posts) return [];

    let filtered = posts;

    // Apply disease filter (from tags or search filter)
    if (selectedDisease) {
      filtered = filtered.filter(
        (post) => post.disease?.id === selectedDisease
      );
    } else if (filters.diseaseId) {
      filtered = filtered.filter(
        (post) => post.disease?.id === parseInt(filters.diseaseId!)
      );
    }

    // Apply theme filter
    if (filters.themeId) {
      filtered = filtered.filter((post) => post.theme?.id === filters.themeId);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  // Get available diseases and themes for filters
  const getAvailableDiseases = (): Disease[] => {
    const posts =
      activeTab === "following"
        ? followingPosts
        : activeTab === "myPosts"
        ? userPosts
        : [];

    if (!posts) return [];

    const diseases = posts
      .filter((post) => post.disease)
      .map((post) => ({ id: post.disease!.id, name: post.disease!.name }));

    // Remove duplicates
    return diseases.filter(
      (disease, index, self) =>
        index === self.findIndex((d) => d.id === disease.id)
    );
  };

  const getAvailableThemes = (): Theme[] => {
    const posts =
      activeTab === "following"
        ? followingPosts
        : activeTab === "myPosts"
        ? userPosts
        : [];

    if (!posts) return [];

    const themes = posts
      .filter((post) => post.theme)
      .map((post) => ({ id: post.theme!.id, name: post.theme!.name }));

    // Remove duplicates
    return themes.filter(
      (theme, index, self) => index === self.findIndex((t) => t.id === theme.id)
    );
  };

  // Render tab content
  const renderTabContent = () => {
    const isLoading = getCurrentLoadingState();
    const currentError = getCurrentError();

    // Show loading or error states
    if (isLoading || currentError) {
      return null; // ContentArea handles these states
    }

    switch (activeTab) {
      case "following": {
        const posts = filterPosts(followingPosts);
        // Debug: Log userData to check structure
        console.log("userData:", userData);
        console.log("userData.diseases:", userData?.diseases);
        
        const followedDiseases: FollowedDisease[] =
          userData?.diseases?.map((disease: any) => ({
            id: disease.id,
            name: disease.name,
            _count: {
              posts: disease._count?.posts || 0,
              users: disease._count?.users || 0,
            },
          })) || [];

        return (
          <VStack spacing={6} align="stretch">
            {/* Followed diseases tags */}
            <FollowedDiseasesTags
              diseases={followedDiseases}
              onDiseaseClick={setSelectedDisease}
              selectedDisease={selectedDisease}
              isLoading={userDataLoading}
            />

            {/* Search and filter for posts */}
            <SearchAndFilter
              onFiltersChange={setFilters}
              availableDiseases={getAvailableDiseases()}
              availableThemes={getAvailableThemes()}
              currentFilters={filters}
            />

            {/* Posts or empty state */}
            {posts.length > 0 ? (
              <VStack spacing={6} align="stretch">
                <Text fontSize="lg" fontWeight="medium" color="gray.700">
                  Following Posts ({posts.length})
                </Text>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  {posts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </SimpleGrid>
              </VStack>
            ) : (
              <EmptyState tabType="following" />
            )}
          </VStack>
        );
      }

      case "myPosts": {
        const posts = filterPosts(userPosts);

        return (
          <VStack spacing={6} align="stretch">
            {/* Search and filter for posts */}
            <SearchAndFilter
              onFiltersChange={setFilters}
              availableDiseases={getAvailableDiseases()}
              availableThemes={getAvailableThemes()}
              currentFilters={filters}
            />

            {/* Posts or empty state */}
            {posts.length > 0 ? (
              <VStack spacing={6} align="stretch">
                <Text fontSize="lg" fontWeight="medium" color="gray.700">
                  My Posts ({posts.length})
                </Text>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  {posts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </SimpleGrid>
              </VStack>
            ) : (
              <EmptyState tabType="myPosts" />
            )}
          </VStack>
        );
      }

      case "myComments": {
        return userComments && userComments.length > 0 ? (
          <CommentList comments={userComments} isLoading={false} />
        ) : (
          <EmptyState tabType="myComments" />
        );
      }

      case "replies": {
        return userReplies && userReplies.length > 0 ? (
          <ReplyList replies={userReplies} isLoading={false} />
        ) : (
          <EmptyState tabType="replies" />
        );
      }

      default:
        return <EmptyState tabType={activeTab} />;
    }
  };

  return (
    <Box minH="100vh" bg={"gray.50"}>
      <Sidebar>
        {status === "authenticated" && (
          <Flex justify="center" pt={"78px"}>
            <Box
              w="full"
              p={{ base: "16px", md: "24px" }}
              minH="full"
              maxW="1200px"
            >
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
                    Your Personalized Feed
                  </Heading>
                  <Text color="gray.600">
                    Stay updated with content from your interests, posts,
                    comments, and more
                  </Text>
                </Box>

                {/* Tab Navigation */}
                <Box
                  bg="white"
                  rounded={"lg"}
                  p={{ base: 4, md: 6 }}
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <TabNavigation
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    isTransitioning={getCurrentLoadingState()}
                    tabCounts={{
                      following: followingPosts?.length || 0,
                      myPosts: userPostsResponse?.count || 0,
                      myComments: userComments?.length || 0,
                      replies: userReplies?.length || 0,
                    }}
                  />
                </Box>

                {/* Content Area */}
                <Box
                  bg="white"
                  rounded={"lg"}
                  p={{ base: 4, md: 6 }}
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <ContentArea
                    activeTab={activeTab}
                    isLoading={getCurrentLoadingState()}
                    error={getCurrentError()}
                    onRetry={handleRetry}
                  >
                    {renderTabContent()}
                  </ContentArea>
                </Box>
              </VStack>
            </Box>
          </Flex>
        )}
      </Sidebar>
    </Box>
  );
}
