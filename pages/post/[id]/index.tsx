import React from "react";
import { GetServerSideProps } from "next";
import {
  Box,
  VStack,
  Flex,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import PostDetail from "../../../components/post_detail";
import Comment from "../../../components/comment";
import { Prisma } from "@prisma/client";
import useSWR from "swr";
import { fetchData } from "../../../utils/utils";
import Sidebar from "../../../components/sidebar";

export type FullPostEx = Prisma.PostGetPayload<{
  include: {
    user: {
      include: {
        diseases: true;
        followedBy: true;
        following: true;
      };
    };
    disease: true;
    theme: true;
    votes: true;
    comments: {
      include: {
        user: true;
        subComments: {
          include: {
            user: true;
            parent: { include: { user: true } };
            children: true;
            votes: true;
            comment: true;
          };
        };
        votes: true;
        post: true;
      };
    };
    _count: true;
  };
}>;

export function usePostDetail(url: string, fallbackData: FullPostEx | null) {
  const { data, error } = useSWR<FullPostEx, Error>(
    url,
    fetchData
  );
  return {
    postDetail: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function SectionDetail({
  initialPost,
  id,
}: {
  initialPost: FullPostEx;
  id: string;
}) {
  const url = `/api/get_post/${id}`;
  const {postDetail, isLoading, isError} = usePostDetail(url, initialPost);
  
  if (isLoading) {
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

  if (isError || !postDetail) {
    return (
      <Box minH="100vh" bg={"gray.50"}>
        <Sidebar>
          <Flex justify="center" pt="78px" p={6}>
            <Alert status="error" maxW="md">
              <AlertIcon />
              Failed to load post. Please try again later.
            </Alert>
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
              {/* Post Detail */}
              <Box 
                bg="white" 
                rounded={"lg"} 
                p={{ base: 4, md: 6 }} 
                shadow="md"
                border="1px"
                borderColor="gray.200"
              >
                <PostDetail post={postDetail} url={url} />
              </Box>

              {/* Comments Section */}
              {postDetail.comments.length > 0 && (
                <Box 
                  bg="white" 
                  rounded={"lg"} 
                  p={{ base: 4, md: 6 }} 
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="lg" fontWeight="600" color="gray.700" mb={2}>
                      Comments ({postDetail.comments.length})
                    </Text>
                    {postDetail.comments.map((comment, index) => (
                      <Box key={comment.id}>
                        <Comment comment={comment} url={url} isCompact={false} />
                        {index < postDetail.comments.length - 1 && (
                          <Box h="1px" bg="gray.200" my={4} />
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>
        </Flex>
      </Sidebar>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
  const id = context.query.id;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/get_post/${id}`);
  const initialPost = await res.json();

  return { props: { initialPost, id } };
};
