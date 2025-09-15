import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetchData } from '../../utils/utils';
import Sidebar from '../../components/sidebar';
import { ThemeHeader } from '../../components/theme/ThemeVisuals';
import Post from '../../components/post';
import { FullPost } from '../../components/post';

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
  const [selectedDisease, setSelectedDisease] = useState<string>('all');

  const url = id ? `/api/get_theme_posts?id=${id}` : null;
  const { data, error } = useSWR<ThemePageData>(url, fetchData, {
    fallbackData: initialData,
  });

  const bgColor = useColorModeValue('gray.50', 'gray.900');

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
  const filteredPosts = selectedDisease === 'all' 
    ? data.posts 
    : data.posts.filter(post => post.disease.id.toString() === selectedDisease);

  console.log("initialData",initialData)
  console.log("filteredPosts", filteredPosts)

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
            <HStack spacing={4} mb={6} justify="space-between" wrap="wrap">
              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  onClick={() => router.push(`/create_post?theme=${data.theme.id}`)}
                >
                  Create Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Back to Explore
                </Button>
              </HStack>

              {/* Disease Filter */}
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Filter by rare disease:
                </Text>
                <Select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  size="sm"
                  maxW="200px"
                >
                  <option value="all">All diseases</option>
                  {data.diseases.map((disease) => (
                    <option key={disease.id} value={disease.id.toString()}>
                      {disease.name}
                    </option>
                  ))}
                </Select>
              </HStack>
            </HStack>

            {/* Posts */}
            {filteredPosts.length > 0 ? (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {filteredPosts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </SimpleGrid>
            ) : (
              <Box
                textAlign="center"
                py={12}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <VStack spacing={4}>
                  <Text fontSize="lg" color="gray.500">
                    {selectedDisease === 'all' 
                      ? `No posts in ${data.theme.name} yet`
                      : `No posts for the selected rare disease in ${data.theme.name}`
                    }
                  </Text>
                  <Button
                    colorScheme="blue"
                    onClick={() => router.push(`/create_post?theme=${data.theme.id}`)}
                  >
                    Be the first to post!
                  </Button>
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

  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const res = await fetch(new URL(`${process.env.NEXTAUTH_URL}/api/get_theme_posts?id=${id}`));
    
    if (!res.ok) {
      throw new Error('Failed to fetch theme data');
    }
    
    const initialData = await res.json();

    return { props: { initialData } };
  } catch (error) {
    console.error('Error fetching theme data:', error);
    
    return { 
      props: { 
        initialData: null 
      } 
    };
  }
};