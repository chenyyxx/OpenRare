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
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiCommentDetail, BiMessageDetail } from "react-icons/bi";
import RichTextEditor from "./RichText";

export interface UserReply {
  id: string;
  content: string;
  createdAt: Date;
  parentType: 'post' | 'comment';
  parent: {
    id: string;
    title?: string; // for posts
    content?: string; // for comments
    post?: {
      id: string;
      title: string;
      disease: {
        name: string;
      };
    };
  };
}

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

  // Get parent content preview
  const getParentPreview = () => {
    if (reply.parentType === 'post') {
      return reply.parent.title || 'Untitled Post';
    } else {
      const parentContent = reply.parent.content?.replace(/<[^>]+>/g, "") || '';
      return parentContent.length > 100 
        ? parentContent.substring(0, 100) + '...' 
        : parentContent;
    }
  };

  // Get the post ID for navigation
  const getPostId = () => {
    if (reply.parentType === 'post') {
      return reply.parent.id;
    } else {
      return reply.parent.post?.id;
    }
  };

  // Get disease name for context
  const getDiseaseName = () => {
    if (reply.parentType === 'post') {
      // For post replies, we'd need the disease info in the parent object
      // This would need to be included in the API response
      return null;
    } else {
      return reply.parent.post?.disease?.name;
    }
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
        {/* Reply metadata */}
        <HStack justify="space-between" align="start" wrap="wrap">
          <HStack spacing={2}>
            <Icon 
              as={reply.parentType === 'post' ? BiMessageDetail : BiCommentDetail} 
              color={reply.parentType === 'post' ? 'blue.500' : 'purple.500'}
            />
            <Text
              fontSize="sm"
              color={reply.parentType === 'post' ? 'blue.600' : 'purple.600'}
              fontWeight="medium"
            >
              Reply to {reply.parentType}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {`${month + 1}/${date}/${year}`}
            </Text>
          </HStack>
          {getDiseaseName() && (
            <Badge
              colorScheme="green"
              variant="subtle"
              fontSize="xs"
            >
              {getDiseaseName()}
            </Badge>
          )}
        </HStack>

        {/* Parent context */}
        <Box
          bg={useColorModeValue("gray.50", "gray.800")}
          p={4}
          rounded="md"
          borderLeft="4px"
          borderLeftColor={reply.parentType === 'post' ? 'blue.400' : 'purple.400'}
        >
          <Text fontSize="xs" color="gray.600" mb={2} textTransform="uppercase">
            Original {reply.parentType}:
          </Text>
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.700", "gray.300")}
            fontStyle={reply.parentType === 'comment' ? 'italic' : 'normal'}
            fontWeight={reply.parentType === 'post' ? 'semibold' : 'normal'}
          >
            {getParentPreview()}
          </Text>
        </Box>

        {/* Reply content */}
        <Box>
          <Text fontSize="xs" color="gray.600" mb={2} textTransform="uppercase">
            Your reply:
          </Text>
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