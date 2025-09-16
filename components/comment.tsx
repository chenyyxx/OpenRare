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
  Textarea,
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
    <Box w="full">
      <VStack align="stretch" spacing={4}>
        {/* Comment Header */}
        <HStack spacing={3}>
          <Avatar 
            src={comment.user.image as string | undefined} 
            size="sm"
          />
          <VStack align="start" spacing={0}>
            <Text fontWeight={600} fontSize="sm" color="gray.700">
              {comment.user.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {month}/{date}/{year}
            </Text>
          </VStack>
        </HStack>

        {/* Comment Content */}
        <Box pl={{ base: 6, md: 10 }}>
          <RichTextEditor
            readOnly
            value={comment.content}
            onChange={() => {}}
            styles={{ root: { border: "none" } }}
            sx={() => ({
              "& .ql-editor": {
                padding: "0px 0px",
                fontSize: "14px",
                lineHeight: "1.5",
              },
            })}
          />

          {/* Comment Actions */}
          {!isCompact && (
            <Flex justify="flex-start" mt={3}>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<BiCommentDetail />}
                onClick={() => setShowEditor(true)}
                colorScheme="gray"
              >
                {comment.subComments.length === 1 ? '1 reply' : `${comment.subComments.length} replies`}
              </Button>
            </Flex>
          )}

          {/* Reply Editor */}
          {showEditor && (
            <Box 
              mt={4} 
              p={3} 
              bg="gray.50" 
              rounded="md" 
              border="1px" 
              borderColor="gray.200"
            >
              <VStack spacing={3} align="stretch">
                <Text fontSize="xs" fontWeight="600" color="gray.600">
                  Reply to @{comment.user.name}
                </Text>
                <Textarea
                  rounded="md"
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                  placeholder={`Reply to @${comment.user.name}`}
                  size="sm"
                  minH="80px"
                  bg="white"
                />
                <Flex 
                  direction={{ base: "column", sm: "row" }}
                  justify="flex-end" 
                  gap={2}
                >
                  <Button 
                    size="xs" 
                    variant="ghost"
                    onClick={() => setShowEditor(false)}
                    w={{ base: "full", sm: "auto" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="teal"
                    onClick={(e: React.MouseEvent<HTMLElement>) => handleNewSubComment(e)}
                    isDisabled={!content.trim()}
                    w={{ base: "full", sm: "auto" }}
                  >
                    Reply
                  </Button>
                </Flex>
              </VStack>
            </Box>
          )}

          {/* Sub Comments */}
          {!isCompact && subComments.length > 0 && (
            <Box mt={4}>
              <VStack
                spacing={3}
                align="stretch"
                bg="gray.50"
                p={4}
                rounded="md"
                border="1px"
                borderColor="gray.200"
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
            </Box>
          )}

          {/* Expand All Comments */}
          {!isCompact && numSubComments > 5 && (
            <Center mt={3}>
              <Button
                size="xs"
                variant="ghost"
                onClick={onOpen}
                colorScheme="teal"
              >
                View all {numSubComments} replies...
              </Button>
              <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>All {numSubComments} replies</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack spacing={4} align="stretch">
                      {comment.subComments.map((child) =>
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
                      )}
                    </VStack>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="teal" onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Center>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
