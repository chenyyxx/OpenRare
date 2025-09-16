import {
  Box,
  Text,
  HStack,
  VStack,
  Stack,
  Avatar,
  useColorModeValue,
  Link,
  Button,
  Flex,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import RichTextEditor from "./RichText";
import { Prisma } from "@prisma/client";
import EmptyState from "./EmptyState";

// Type for comments extracted from user's posts
export type UserComment = Prisma.CommentGetPayload<{
  include: {
    user: true;
    subComments: {
      include: {
        user: true;
        parent: { include: { user: true } };
      };
    };
  };
}> & {
  post: {
    id: number;
    title: string;
    disease: {
      id: number;
      name: string;
    };
    theme: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
};

interface CommentListProps {
  comments: UserComment[];
  isLoading: boolean;
}

function CommentItem({ comment }: { comment: UserComment }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const createdAt = new Date(comment.createdAt);
  const date = createdAt.getDate();
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth();

  // Strip HTML tags for preview
  const commentText = comment.content.replace(/<[^>]+>/g, "");
  const isLongComment = commentText.length > 200;

  return (
    <Box
      w="full"
      bg={useColorModeValue("white", "gray.900")}
      borderColor="gray.300"
      borderWidth="1px"
      rounded="2xl"
      p={6}
      overflow="hidden"
    >
      <Stack spacing={4}>
        {/* Comment metadata with commenter info */}
        <HStack justify="space-between" align="start" wrap="wrap">
          <HStack spacing={3}>
            <Avatar size="sm" src={comment.user.image || undefined} />
            <VStack align="start" spacing={0}>
              <Text
                fontSize="sm"
                fontWeight="500"
                color={useColorModeValue("gray.700", "gray.200")}
              >
                {comment.user.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {`${month + 1}/${date}/${year}`}
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme="green" variant="subtle" fontSize="xs">
            🧬 {comment.post?.disease?.name || "Unknown"}
          </Badge>
        </HStack>

        {/* Post context */}
        <Box
          bg={useColorModeValue("gray.50", "gray.800")}
          p={4}
          rounded="2xl"
          borderLeft="4px"
          borderLeftColor="teal.400"
          border="1px"
          borderColor={useColorModeValue("gray.300", "gray.600")}
        >
          <HStack spacing={2} mb={2}>
            <Text
              fontSize="xs"
              color="gray.600"
              fontWeight="500"
              textTransform="uppercase"
            >
              Comment on your post:
            </Text>
            <Badge size="sm" colorScheme="teal" variant="subtle">
              YOUR POST
            </Badge>
          </HStack>
          <Text
            as={Link}
            href={`/post/${comment.post?.id}`}
            fontSize="md"
            fontWeight="500"
            color={useColorModeValue("teal.600", "teal.300")}
            _hover={{ textDecoration: "underline" }}
            lineHeight="1.5"
          >
            {comment.post?.title || "Unknown Post"}
          </Text>
        </Box>

        {/* Comment content */}
        <Box>
          {isExpanded ? (
            <RichTextEditor
              readOnly
              value={comment.content}
              onChange={() => {}}
              styles={{ root: { border: "none" } }}
              sx={() => ({
                "& .ql-editor": {
                  padding: "0px 0px",
                },
              })}
            />
          ) : (
            <Text fontSize="sm" noOfLines={isLongComment ? 4 : undefined}>
              {commentText}
            </Text>
          )}
        </Box>

        {/* Expand/collapse button for long comments */}
        {isLongComment && (
          <Flex justify="end">
            <Button
              size="sm"
              variant="ghost"
              colorScheme="teal"
              rounded="full"
              fontWeight="500"
              onClick={() => setIsExpanded(!isExpanded)}
              _hover={{
                transform: "translateY(-1px)",
                shadow: "sm"
              }}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </Flex>
        )}

        {/* Action buttons */}
        <Flex justify="end">
          <Button
            as={Link}
            href={`/post/${comment.post?.id}`}
            size="sm"
            variant="outline"
            colorScheme="teal"
            fontWeight="500"
            rounded="full"
            _hover={{
              transform: "translateY(-1px)",
              shadow: "sm"
            }}
          >
            View Post
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}

export default function CommentList({ comments, isLoading }: CommentListProps) {
  const loadingBg = useColorModeValue("gray.100", "gray.700");

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            w="full"
            bg={loadingBg}
            rounded="2xl"
            p={6}
            h="200px"
          />
        ))}
      </SimpleGrid>
    );
  }

  if (comments.length === 0) {
    return <EmptyState tabType="myComments" />;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="lg" fontWeight="medium" color="gray.700">
        Comments on My Posts ({comments.length})
      </Text>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
