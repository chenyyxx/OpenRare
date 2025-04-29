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
} from "@chakra-ui/react";
import RichTextEditor from "./RichText";
import SubComments from "./sub_comments";
import { BiCommentDetail, BiLike, BiBookmark } from "react-icons/bi";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { useSWRConfig } from "swr";

type Comment = Prisma.CommentGetPayload<{
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
}>;

export default function Comment({
  comment,
  url,
  isCompact,
}: {
  comment: Comment;
  url: string;
  isCompact: boolean;
}) {
  // console.log(props)
  const numSubComments = comment.subComments.length;
  // need to get all comments recursively dfs
  const subComments = comment.subComments.slice(0, 5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showEditor, setShowEditor] = useState(false);
  const [content, setContent] = useState("");
  const { data: session, status } = useSession();
  const createdAt = new Date(comment.createdAt);
  const date = createdAt.getDate();
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth();
  const { mutate } = useSWRConfig();

  const handleNewSubComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setShowEditor(false);
    // submit form here
    // checck if content = ""
    const newSubComment = {
      commentId: comment.id,
      content: content,
      user: session?.user,
    };
    if (content == "") {
      alert("comment content cannot be empty");
    } else {
      await fetch(`/api/create_subcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubComment),
      });
      setContent("");
      mutate(url);
    }
  };

  return (
    <Box
      w={"full"}
      bg="white"
      rounded={"md"}
      p={6}
      overflow={"hidden"}
      borderColor="teal.400"
      // borderLeftStyle="solid"
      borderRightColor="gray.200"
      borderRightWidth="1px"
      borderTopColor="gray.200"
      borderTopWidth="1px"
      borderBottomColor="gray.200"
      borderBottomWidth="1px"
      borderLeftWidth="4px"
    >
      <Stack>
        <HStack>
          <Avatar src={comment.user.image as string | undefined} />
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>{comment.user.name}</Text>
            <Text
              color={"gray.500"}
            >{`Created At: ${month}-${date}-${year}`}</Text>
          </Stack>
        </HStack>
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
        {!isCompact && (
          <Flex justify="right">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<BiCommentDetail />}
              onClick={() => {
                setShowEditor(true);
              }}
            >
              {comment.subComments.length + " comments"}
            </Button>
            {/* <Button size="sm" variant="ghost" leftIcon={<BiLike />}>
            Share
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<BiBookmark />}>
            Save
          </Button> */}
          </Flex>
        )}
        {showEditor ? (
          <Box mt="12px">
            <Textarea
              rounded={6}
              isRequired
              value={content}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
              placeholder={"Reply to @" + [comment.user.name]}
              size="sm"
            />
            <HStack pt="12px" justify="right" w="full">
              <Button size="sm" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="teal"
                onClick={(e: React.MouseEvent<HTMLElement>) => handleNewSubComment(e)}
              >
                Comment
              </Button>
            </HStack>
          </Box>
        ) : (
          <></>
        )}
        {!isCompact && subComments.length > 0 && (
          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={0}
            align="stretch"
            borderColor="gray.200"
            borderWidth="1px"
            rounded={"md"}
          >
            {subComments.map((child) =>
              child.parent ? (
                <SubComments
                  subComment={child}
                  url={url}
                  labelColor={"cyan.300"}
                  key={child.id}
                />
              ) : (
                <SubComments
                  subComment={child}
                  url={url}
                  labelColor={"purple.300"}
                  key={child.id}
                />
              )
            )}
          </VStack>
        )}
        {!isCompact && numSubComments > 5 ? (
          <Center>
            <Button
              size="xs"
              variant="ghost"
              onClick={onOpen}
            >{`Expand all ${numSubComments} comments...`}</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{`All ${numSubComments} comments`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody as={Stack}>
                  {comment.subComments.map(
                    (child) =>
                      child.parent ? (
                        <SubComments
                          subComment={child}
                          url={url}
                          labelColor="cyan.300"
                          key={child.id}
                        />
                      ) : (
                        <SubComments
                          subComment={child}
                          url={url}
                          labelColor="purple.300"
                          key={child.id}
                        />
                      )

                    // <SubComments subComment={child} color={} key={child.id}/>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Center>
        ) : (
          <></>
        )}
      </Stack>
    </Box>
  );
}
