import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  Button,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { 
  BiBookmark, 
  BiCommentDetail, 
  BiHeart, 
  BiMessageDetail, 
  BiPlus 
} from "react-icons/bi";

export type TabType = 'following' | 'myPosts' | 'myComments' | 'favorites' | 'replies';

interface EmptyStateProps {
  tabType: TabType;
}

const emptyStateConfig = {
  following: {
    icon: BiHeart,
    title: "No posts from followed diseases",
    message: "You haven't followed any rare diseases yet, or there are no recent posts from the diseases you follow.",
    actionText: "Explore Rare Diseases",
    actionHref: "/rare-diseases",
    secondaryActionText: "Create a Post",
    secondaryActionHref: "/create_post",
  },
  myPosts: {
    icon: BiMessageDetail,
    title: "No posts yet",
    message: "You haven't created any posts yet. Share your experiences, questions, or insights with the community.",
    actionText: "Create Your First Post",
    actionHref: "/create_post",
    secondaryActionText: "Explore Rare Diseases",
    secondaryActionHref: "/rare-diseases",
  },
  myComments: {
    icon: BiCommentDetail,
    title: "No comments yet",
    message: "You haven't commented on any posts yet. Join the conversation by sharing your thoughts and experiences.",
    actionText: "Explore Posts",
    actionHref: "/home",
    secondaryActionText: "Browse Rare Diseases",
    secondaryActionHref: "/rare-diseases",
  },
  favorites: {
    icon: BiBookmark,
    title: "No favorite posts",
    message: "You haven't upvoted any posts yet. When you find helpful or interesting posts, upvote them to save them here.",
    actionText: "Discover Posts",
    actionHref: "/home",
    secondaryActionText: "Explore Rare Diseases",
    secondaryActionHref: "/rare-diseases",
  },
  replies: {
    icon: BiMessageDetail,
    title: "No replies yet",
    message: "No one has replied to your posts or comments yet. Keep engaging with the community to start conversations.",
    actionText: "Create a Post",
    actionHref: "/create_post",
    secondaryActionText: "Browse Posts",
    secondaryActionHref: "/home",
  },
};

export default function EmptyState({ tabType }: EmptyStateProps) {
  const config = emptyStateConfig[tabType];
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const titleColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box
      w="full"
      maxW="600px"
      mx="auto"
      bg={bgColor}
      rounded="lg"
      p={12}
      textAlign="center"
    >
      <VStack spacing={6}>
        {/* Icon */}
        <Box
          p={4}
          rounded="full"
          bg={useColorModeValue("white", "gray.700")}
          shadow="sm"
        >
          <Icon
            as={config.icon}
            w={8}
            h={8}
            color={useColorModeValue("gray.400", "gray.500")}
          />
        </Box>

        {/* Title */}
        <Heading
          size="md"
          color={titleColor}
          fontWeight="semibold"
        >
          {config.title}
        </Heading>

        {/* Message */}
        <Text
          fontSize="md"
          color={textColor}
          maxW="400px"
          lineHeight="1.6"
        >
          {config.message}
        </Text>

        {/* Action buttons */}
        <VStack spacing={3} pt={2}>
          <Button
            as="a"
            href={config.actionHref}
            colorScheme="blue"
            size="md"
            leftIcon={<Icon as={BiPlus} />}
          >
            {config.actionText}
          </Button>
          
          {config.secondaryActionText && (
            <Button
              as="a"
              href={config.secondaryActionHref}
              variant="ghost"
              size="sm"
              color={textColor}
            >
              {config.secondaryActionText}
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}