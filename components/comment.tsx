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
import { BiCommentDetail } from "react-icons/bi";
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
import AuthRequiredAlert from "./AuthRequiredAlert";

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
  const [showAuthAlert, setShowAuthAlert] = useState(false);
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
      w="full" 
      bg="white" 
      border="1px" 
      borderColor="gray.200" 
      rounded="2xl" 
      p={{ base: 4, md: 6 }}
      shadow="sm"
      _hover={{
        shadow: "md",
        transform: "translateY(-1px)"
      }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
        {/* Comment Header */}
        <HStack spacing={{ base: 2, md: 3 }}>
          <Avatar 
            src={comment.user.image as string | undefined} 
            size={{ base: "sm", md: "md" }}
            ring={2}
            ringColor="#14B8A6"
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text 
              fontWeight={700} 
              fontSize="sm" 
              color="#14B8A6"
              _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              {comment.user.name}
            </Text>
            <HStack spacing={2}>
              <Text fontSize="xs" color="gray.500">
                {month}/{date}/{year}
              </Text>
              <Box w={1} h={1} bg="gray.400" rounded="full" />
              <Text fontSize="xs" color="#14B8A6" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                Comment
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Comment Content */}
        <Box pl={{ base: 2, md: 4 }}>
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
                colorScheme="teal"
                variant="outline"
                leftIcon={<BiCommentDetail />}
                onClick={() => {
                  if (!session) {
                    setShowAuthAlert(true);
                  } else {
                    setShowEditor(true);
                  }
                }}
                rounded="full"
                fontWeight="500"
                _hover={{
                  transform: "translateY(-1px)",
                  shadow: "md"
                }}
              >
                {comment.subComments.length === 1 ? '1 reply' : `${comment.subComments.length} replies`}
              </Button>
            </Flex>
          )}

          {/* Authentication Alert */}
          {showAuthAlert && (
            <AuthRequiredAlert 
              action="reply to comments" 
              isOpen={showAuthAlert}
              onClose={() => setShowAuthAlert(false)}
            />
          )}

          {/* Reply Editor */}
          {showEditor && (
            <Box 
              mt={{ base: 3, md: 4 }} 
              p={{ base: 2, md: 3 }} 
              bg="gray.50" 
              rounded="2xl" 
              border="1px" 
              borderColor="gray.300"
            >
              <VStack spacing={{ base: 2, md: 3 }} align="stretch">
                <Text fontSize="xs" fontWeight="500" color="gray.600">
                  Reply to @{comment.user.name}
                </Text>
                <Textarea
                  rounded="2xl"
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                  placeholder={`Reply to @${comment.user.name}`}
                  size="sm"
                  minH={{ base: "60px", md: "80px" }}
                  bg="white"
                />
                <Flex 
                  direction={{ base: "column", sm: "row" }}
                  justify="flex-end" 
                  gap={{ base: 2, md: 3 }}
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
            <Box mt={{ base: 3, md: 4 }}>
              <Box
                bg="gray.50"
                p={{ base: 4, md: 6 }}
                rounded="2xl"
                border="1px"
                borderColor="gray.300"
              >
                {subComments.map((child) => (
                    <SubComments
                      subComment={child}
                      url={url}
                      key={child.id}
                    />
                ))}
              </Box>
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
                fontWeight="500"
                rounded="full"
                _hover={{
                  transform: "translateY(-1px)",
                  shadow: "sm"
                }}
              >
                View all {numSubComments} replies...
              </Button>
              <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent rounded="2xl">
                  <ModalHeader>All {numSubComments} replies</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Box>
                      {comment.subComments.map((child) => (
                          <SubComments
                            subComment={child}
                            url={url}
                            key={child.id}
                          />
                      ))}
                    </Box>
                  </ModalBody>
                  <ModalFooter>
                    <Button 
                      colorScheme="teal" 
                      onClick={onClose}
                      rounded="full"
                      fontWeight="500"
                    >
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
