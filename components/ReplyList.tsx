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
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import RichTextEditor from "./RichText";
import { Prisma } from "@prisma/client";

// Type for subcomments extracted from user's posts
export type UserReply = Prisma.SubCommentGetPayload<{
  include: {
    user: true;
    parent: { include: { user: true } };
  };
}> & {
  comment: {
    id: number;
    content: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
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
};

interface ReplyListProps {
  replies: UserReply[];
  isLoading: boolean;
}

function ReplyItem({ reply }: { reply: UserReply }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const createdAt = new Date(reply.createdAt);
  const date = createdAt.getDate();
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth();
  
  // Strip HTML tags for preview
  const replyText = reply.content.replace(/<[^>]+>/g, "");
  const isLongReply = replyText.length > 200;

  // Get parent comment content preview
  const getParentPreview = () => {
    const parentContent = reply.comment.content?.replace(/<[^>]+>/g, "") || '';
    return parentContent.length > 100 
      ? parentContent.substring(0, 100) + '...' 
      : parentContent;
  };

  // Get the post ID for navigation
  const getPostId = () => {
    return reply.comment.post?.id;
  };

  // Get disease name for context
  const getDiseaseName = () => {
    return reply.comment.post?.disease?.name;
  };

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
        {/* Reply metadata with enhanced visual language */}
        <HStack justify="space-between" align="start" wrap="wrap">
          <HStack spacing={3}>
            <Avatar size="sm" src={reply.user.image || undefined} />
            <Box
              p={2}
              rounded="full"
              bg="purple.50"
              border="1px"
              borderColor="purple.200"
            >
              <Icon 
                as={BiCommentDetail} 
                color="purple.500"
                boxSize={4}
              />
            </Box>
            <VStack align="start" spacing={0}>
              <Text
                fontSize="sm"
                color="purple.600"
                fontWeight="600"
              >
                {reply.user.name} replied to your comment
              </Text>
              <Text fontSize="xs" color="gray.500">
                {`${month + 1}/${date}/${year}`}
              </Text>
            </VStack>
          </HStack>
          {getDiseaseName() && (
            <Badge
              colorScheme="green"
              variant="subtle"
              fontSize="xs"
            >
              🧬 {getDiseaseName()}
            </Badge>
          )}
        </HStack>

        {/* Your original content context */}
        <Box
          bg={useColorModeValue("blue.25", "gray.800")}
          p={4}
          rounded="md"
          borderLeft="4px"
          borderLeftColor="purple.400"
          border="1px"
          borderColor={useColorModeValue("blue.100", "gray.600")}
        >
          <HStack spacing={2} mb={2}>
            <Text fontSize="xs" color="gray.600" fontWeight="600" textTransform="uppercase">
              Your original comment:
            </Text>
            <Badge
              size="sm"
              colorScheme="purple"
              variant="subtle"
            >
              YOU
            </Badge>
          </HStack>
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.700", "gray.300")}
            fontStyle="italic"
            lineHeight="1.5"
          >
            {getParentPreview()}
          </Text>
        </Box>

        {/* Their reply to your content */}
        <Box
          bg={useColorModeValue("green.25", "gray.700")}
          p={4}
          rounded="md"
          border="1px"
          borderColor={useColorModeValue("green.100", "gray.600")}
        >
          <HStack spacing={2} mb={3}>
            <Text fontSize="xs" color="green.600" fontWeight="600" textTransform="uppercase">
              Their reply:
            </Text>
            <Badge
              size="sm"
              colorScheme="green"
              variant="subtle"
            >
              NEW
            </Badge>
          </HStack>
          {isExpanded ? (
            <RichTextEditor
              readOnly
              value={reply.content}
              onChange={() => {}}
              styles={{ root: { border: "none" } }}
              sx={() => ({
                "& .ql-editor": {
                  padding: "0px 0px",
                },
              })}
            />
          ) : (
            <Text fontSize="sm" noOfLines={isLongReply ? 4 : undefined}>
              {replyText}
            </Text>
          )}
        </Box>

        {/* Expand/collapse button for long replies */}
        {isLongReply && (
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
            href={`/post/${getPostId()}`}
            size="sm"
            variant="outline"
            colorScheme="blue"
            isDisabled={!getPostId()}
          >
            View Full Context
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}

export default function ReplyList({ replies, isLoading }: ReplyListProps) {
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
            h="250px"
          />
        ))}
      </Stack>
    );
  }

  if (replies.length === 0) {
    return null; // EmptyState will be handled by parent component
  }

  return (
    <Stack spacing={4}>
      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </Stack>
  );
}