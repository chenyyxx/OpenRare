import {
  Box,
  Text,
  HStack,
  Stack,
  Avatar,
  useColorModeValue,
  Link,
  Button,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import RichTextEditor from "./RichText";

export interface UserComment {
  id: string;
  content: string;
  createdAt: Date;
  post: {
    id: string;
    title: string;
    disease: {
      name: string;
    };
  };
}

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
      maxW="800px"
      bg={useColorModeValue("white", "gray.900")}
      borderColor="gray.200"
      borderWidth="1px"
      rounded="md"
      p={6}
      overflow="hidden"
    >
      <Stack spacing={4}>
        {/* Comment metadata */}
        <HStack justify="space-between" align="start" wrap="wrap">
          <Text
            fontSize="sm"
            color="gray.500"
          >
            {`${month + 1}/${date}/${year}`}
          </Text>
          <Badge
            colorScheme="green"
            variant="subtle"
            fontSize="xs"
          >
            {comment.post.disease.name}
          </Badge>
        </HStack>

        {/* Post context */}
        <Box>
          <Text fontSize="sm" color="gray.600" mb={2}>
            Comment on:
          </Text>
          <Text
            as={Link}
            href={`/post/${comment.post.id}`}
            fontSize="md"
            fontWeight="semibold"
            color={useColorModeValue("blue.600", "blue.300")}
            _hover={{ textDecoration: "underline" }}
          >
            {comment.post.title}
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
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </Flex>
        )}

        {/* Action buttons */}
        <Flex justify="end">
          <Button
            as={Link}
            href={`/post/${comment.post.id}`}
            size="sm"
            variant="outline"
            colorScheme="blue"
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
      <Stack spacing={4}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            w="full"
            maxW="800px"
            bg={loadingBg}
            rounded="md"
            p={6}
            h="200px"
          />
        ))}
      </Stack>
    );
  }

  if (comments.length === 0) {
    return null; // EmptyState will be handled by parent component
  }

  return (
    <Stack spacing={4}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Stack>
  );
}