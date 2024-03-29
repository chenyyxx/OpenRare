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
    <Box
      w={"full"}
      bg="white"
      // boxShadow={"2xl"}
      borderColor="gray.200"
      borderWidth="1px"
      rounded={"md"}
      p={6}
      overflow={"hidden"}
    >
      <Stack>
        <HStack>
          <Avatar src={post.user.image as string | undefined} />
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>{post.user.name}</Text>
            <Text
              color={"gray.500"}
            >{`Last Updated: ${month}-${date}-${year}`}</Text>
          </Stack>
        </HStack>
        <Heading
          color={useColorModeValue("gray.700", "white")}
          fontSize={"2xl"}
          fontFamily={"body"}
        >
          {post.title}
        </Heading>
        <RichTextEditor
          readOnly
          value={post.content}
          onChange={() => {}}
          styles={{ root: { border: "none" } }}
          sx={() => ({
            "& .ql-editor": {
              padding: "0px 0px",
            },
          })}
        />
        <Flex justify="right">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowEditor(true);
            }}
            leftIcon={<BiCommentDetail />}
          >
            {post.comments.length + ' comments'}
          </Button>
          {/* <Button size="sm" variant="ghost" leftIcon={<BiShare />}>
            Share
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<BiBookmark />}>
            Save
          </Button> */}
        </Flex>
        {showEditor ? (
          <Box mt="12px">
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
                  minHeight: "200px",
                },
                toolbar: { borderColor: "#E2E8F0" },
              }}
              value={content}
              onChange={setContent}
            />
            <HStack pt="12px" justify="right" w="full">
              <Button size="sm" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="teal"
                onClick={(e) => handleNewComment(e)}
              >
                Comment
              </Button>
            </HStack>
          </Box>
        ) : (
          <></>
        )}
      </Stack>
    </Box>
  );
}
