import {
  Box,
  Center,
  Heading,
  Text,
  HStack,
  StackDivider,
  Stack,
  Avatar,
  useColorModeValue,
  VStack,
  Button,
  Flex,
  Input,
} from "@chakra-ui/react";
import RichTextEditor from "./RichText";
import { BiCommentDetail, BiShare, BiBookmark } from "react-icons/bi";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import AuthRequiredAlert from "./AuthRequiredAlert";
// import { FullPost } from "./post";
import { FullPostEx } from "../pages/post/[id]";
import { useSWRConfig } from "swr";

type AppProps = {
  post: FullPostEx;
  url: string;
};

export default function PostDetail({ post, url }: AppProps) {
  // console.log(post)
  const [showEditor, setShowEditor] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [content, setContent] = useState("");
  const { data: session, status } = useSession();
  const createdAt = new Date(post.updatedAt);
  const date = createdAt.getDate();
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth();
  const { mutate } = useSWRConfig();
  const handleNewComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setShowEditor(false);
    const newComment = {
      postId: post.id,
      content: content,
      user: session?.user,
    };
    if (content == "") {
      alert("comment content cannot be empty");
    } else {
      await fetch(`/api/create_comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
      setContent("");
      mutate(url);
    }
  };
  return (
    <Stack spacing={6}>
      {/* Post Header */}
      <VStack align="stretch" spacing={4}>
        <HStack spacing={3} p={3} bg="gray.50" rounded="lg" border="1px" borderColor="gray.200">
          <Avatar 
            src={post.user.image as string | undefined} 
            size="sm"
            ring={2}
            ringColor="teal.500"
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text 
              fontWeight={600} 
              fontSize="sm" 
              color="white"
              bg="teal.500"
              px={3}
              py={1}
              rounded="full"
              display="inline-block"
              shadow="sm"
              _hover={{ 
                bg: "teal.600",
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }}
              transition="all 0.2s"
            >
              {post.user.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Last Updated: {month}/{date}/{year}
            </Text>
          </VStack>
          <Text
            px={3}
            py={1}
            bg="teal.500"
            color="white"
            rounded="full"
            fontSize="sm"
            fontWeight="600"
            shadow="sm"
          >
            Author
          </Text>
        </HStack>

        {/* Post Title */}
        <Heading
          color="gray.800"
          fontSize={{ base: "lg", md: "2xl" }}
          fontFamily="body"
          lineHeight="shorter"
        >
          {post.title}
        </Heading>

        {/* Theme and Disease Badges */}
        <HStack spacing={3} wrap="wrap">
          {post.theme && (
            <HStack
              as="a"
              href={`/themes/${post.theme.id}`}
              spacing={1}
              fontSize="xs"
              fontWeight="600"
              color="white"
              bg="purple.500"
              px={3}
              py={1}
              rounded="full"
              shadow="sm"
              display="inline-flex"
              _hover={{
                bg: "purple.600",
                transform: "translateY(-1px)",
                shadow: "md",
                textDecoration: "none",
              }}
              transition="all 0.2s"
            >
              <Box as="span" fontSize="sm">
                🏷️
              </Box>
              <Text as="span">
                {post.theme.name}
              </Text>
            </HStack>
          )}
          {post.disease && (
            <HStack
              as="a"
              href={`/rare-diseases?disease=${post.disease.id}`}
              spacing={1}
              fontSize="xs"
              fontWeight="600"
              color="white"
              bg="green.500"
              px={3}
              py={1}
              rounded="full"
              shadow="sm"
              display="inline-flex"
              _hover={{
                bg: "green.600",
                transform: "translateY(-1px)",
                shadow: "md",
                textDecoration: "none",
              }}
              transition="all 0.2s"
            >
              <Box as="span" fontSize="sm">
                🧬
              </Box>
              <Text as="span">
                {post.disease.name}
              </Text>
            </HStack>
          )}
        </HStack>

        {/* Post Content */}
        <Box>
          <RichTextEditor
            readOnly
            value={post.content}
            onChange={() => {}}
            styles={{ root: { border: "none" } }}
            sx={() => ({
              "& .ql-editor": {
                padding: "0px 0px",
                fontSize: "16px",
                lineHeight: "1.6",
              },
            })}
          />
        </Box>

        {/* Post Actions */}
        <Flex justify="space-between" align="center" pt={4} borderTop="1px" borderColor="gray.300">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (!session) {
                setShowAuthAlert(true);
              } else {
                setShowEditor(true);
              }
            }}
            leftIcon={<BiCommentDetail />}
            colorScheme="teal"
            rounded="full"
            fontWeight="500"
            _hover={{
              transform: "translateY(-1px)",
              shadow: "md"
            }}
          >
            {post.comments.length === 1 ? '1 comment' : `${post.comments.length} comments`}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            leftIcon={<BiShare />}
            rounded="full"
            fontWeight="500"
            _hover={{
              transform: "translateY(-1px)",
              shadow: "md"
            }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            Share
          </Button>
        </Flex>
      </VStack>

      {/* Authentication Alert */}
      {showAuthAlert && (
        <AuthRequiredAlert 
          action="comment on posts" 
          isOpen={showAuthAlert}
          onClose={() => setShowAuthAlert(false)}
        />
      )}

      {/* Comment Editor */}
      {showEditor && (
        <Box 
          p={4} 
          bg="gray.50" 
          rounded="md" 
          border="1px" 
          borderColor="gray.200"
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              Add a comment
            </Text>
            <RichTextEditor
              controls={[
                ["bold", "italic", "underline", "link"],
                ["unorderedList", "h1", "h2", "h3"],
                ["sup", "sub"],
                ["alignLeft", "alignCenter", "alignRight"],
              ]}
              styles={{
                root: {
                  borderColor: "#E2E8F0",
                  borderRadius: "0.375rem",
                  minHeight: "150px",
                  backgroundColor: "white",
                },
                toolbar: { 
                  borderColor: "#E2E8F0",
                  backgroundColor: "white",
                },
              }}
              value={content}
              onChange={setContent}
            />
            <Flex 
              direction={{ base: "column", sm: "row" }}
              justify="flex-end" 
              gap={3}
            >
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowEditor(false)}
                w={{ base: "full", sm: "auto" }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="teal"
                onClick={(e: React.MouseEvent<HTMLElement>) => handleNewComment(e)}
                isDisabled={!content.trim()}
                w={{ base: "full", sm: "auto" }}
              >
                Post Comment
              </Button>
            </Flex>
          </VStack>
        </Box>
      )}
    </Stack>
  );
}
