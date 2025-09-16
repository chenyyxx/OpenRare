import { Prisma } from "@prisma/client";
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  StackDivider,
  Stack,
  Avatar,
  useColorModeValue,
  Flex,
  Link,
  Button,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { BiCommentDetail } from "react-icons/bi";
import RichTextEditor from "./RichText";
import { useState, useRef, useEffect } from "react";
import { usePostDetail } from "../pages/post/[id]";
import Comment from "./comment";
import { useRouter } from "next/navigation";

export type FullPost = Prisma.PostGetPayload<{
  include: {
    user: true;
    disease: true;
    theme: true;
    votes: { include: { user: true } };
    comments?: {
      include: {
        user: true;
        subComments: {
          include: {
            user: true;
            parent: {
              include: {
                user: true;
              };
            };
          };
        };
      };
    };
  };
}> & {
  _count?: {
    comments: number;
  };
};

function Post({ post }: { post: FullPost }) {
  const createdAt = new Date(post.updatedAt);
  const date = createdAt.getDate();
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth();
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [textOpen, setTextOpen] = useState(false);
  const [overflowActive, setOverflowActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const postContent = post.content.replace(/<[^>]+>/g, "");
  const url = `/api/get_post/${post.id}`;
  const { postDetail, isLoading, isError } = usePostDetail(url, null);
  const router = useRouter();

  useEffect(() => {
    const isOverflowActive = (
      textContainer: HTMLParagraphElement | null
    ): boolean => {
      if (textContainer) {
        return (
          textContainer.offsetHeight < textContainer.scrollHeight ||
          textContainer.offsetWidth < textContainer.scrollWidth
        );
      }
      return false;
    };
    if (isOverflowActive(textRef.current)) {
      setOverflowActive(true);
      return;
    }

    setOverflowActive(false);
  }, []);

  return (
    <Box
      w={"full"}
      maxW="800px"
      bg={useColorModeValue("white", "gray.900")}
      borderColor="gray.200"
      borderWidth="1px"
      rounded={"md"}
      p={6}
      overflow={"hidden"}
    >
      {
        <Stack>
          <Heading
            as={Link}
            href={`/post/${post.id}`}
            color={useColorModeValue("gray.700", "white")}
            fontSize={["xl", "2xl"]}
            fontFamily={"body"}
            mb={3}
          >
            {post.title}
          </Heading>

          {/* Theme and Disease Badges */}
          <HStack spacing={2} mb={3} wrap="wrap">
            {post.theme && (
              <HStack
                as={Link}
                href={`/themes/${post.theme.id}`}
                spacing={1}
                fontSize="xs"
                fontWeight="600"
                color="purple.700"
                bg="purple.50"
                px={3}
                py={1}
                rounded="full"
                border="1px"
                borderColor="purple.200"
                display="inline-flex"
                _hover={{
                  bg: "purple.100",
                  borderColor: "purple.300",
                  textDecoration: "none",
                }}
                transition="all 0.2s"
              >
                <Box as="span" fontSize="10px">
                  🏷️
                </Box>
                <Text as="span">{post.theme.name}</Text>
              </HStack>
            )}
            {post.disease && (
              <HStack
                as={Link}
                href={`/rare-diseases?disease=${post.disease.id}`}
                spacing={1}
                fontSize="xs"
                fontWeight="600"
                color="green.700"
                bg="green.50"
                px={3}
                py={1}
                rounded="full"
                border="1px"
                borderColor="green.200"
                textTransform="uppercase"
                letterSpacing="wide"
                display="inline-flex"
                _hover={{
                  bg: "green.100",
                  borderColor: "green.300",
                  textDecoration: "none",
                }}
                transition="all 0.2s"
              >
                <Box as="span" fontSize="10px">
                  🧬
                </Box>
                <Text as="span">{post.disease.name}</Text>
              </HStack>
            )}
          </HStack>

          <HStack justify={"space-between"} align="center">
            <HStack>
              <Avatar size="sm" src={post.user.image as string | undefined} />
              <Text fontSize={["xs", "sm"]} fontWeight={600}>
                {post.user.name}
              </Text>
              <Text
                fontSize={"xs"}
                color={"gray.500"}
              >{`${month}-${date}-${year}`}</Text>
            </HStack>
          </HStack>

          <Box as={"a"} href={`/post/${post.id}`}>
            {textOpen ? (
              <Box ref={textRef}>
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
              </Box>
            ) : (
              <Text fontSize={"sm"} noOfLines={5} ref={textRef}>
                {postContent}
              </Text>
            )}
          </Box>
          {!textOpen && !overflowActive ? null : (
            <Flex w="full" justify="end">
              <Text
                fontSize={"sm"}
                as={Link}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  setTextOpen(!textOpen)
                }
              >
                {textOpen ? "show less" : "... show more"}
              </Text>
            </Flex>
          )}

          <HStack justify={"space-between"}>
            <HStack divider={<StackDivider borderColor="gray.200" />}></HStack>
            <HStack spacing={2}>
              {/* <BiCommentDetail /> */}
              <Button
                display={["none", "flex"]}
                fontSize={"md"}
                variant="ghost"
                leftIcon={<BiCommentDetail />}
                onClick={onOpen}
              >{`${post._count?.comments || 0} Comments`}</Button>
              <Button
                display={["flex", "none"]}
                fontSize={"sm"}
                variant="ghost"
                leftIcon={<BiCommentDetail />}
                onClick={onOpen}
              >{`${post._count?.comments || 0}`}</Button>
              <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={"2xl"}
                scrollBehavior="inside"
              >
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent
                  mx={4}
                  my={8}
                  maxH="80vh"
                  bg="white"
                  borderRadius="xl"
                  boxShadow="2xl"
                >
                  <ModalHeader
                    pb={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    bg="gray.50"
                    borderTopRadius="xl"
                  >
                    <VStack align="start" spacing={2}>
                      <Text fontSize="lg" fontWeight="600" color="gray.800">
                        Comments ({post._count?.comments || 0})
                      </Text>
                      <Text fontSize="sm" color="gray.600" noOfLines={1}>
                        {post.title}
                      </Text>
                    </VStack>
                  </ModalHeader>
                  <ModalCloseButton
                    top={4}
                    right={4}
                    bg="white"
                    rounded="full"
                    boxShadow="md"
                    _hover={{ bg: "gray.100" }}
                  />
                  <ModalBody p={0}>
                    {postDetail?.comments && postDetail.comments.length > 0 ? (
                      <VStack spacing={0} align="stretch">
                        {postDetail.comments.map((comment, index) => (
                          <Box key={comment.id}>
                            <Box p={6}>
                              <Comment
                                comment={comment}
                                url={url}
                                isCompact={true}
                              />
                            </Box>
                            {index < postDetail.comments.length - 1 && (
                              <Box h="1px" bg="gray.200" />
                            )}
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Box p={12} textAlign="center">
                        <VStack spacing={4}>
                          <Box p={4} rounded="full" bg="gray.100">
                            <BiCommentDetail size={24} color="gray.400" />
                          </Box>
                          <VStack spacing={2}>
                            <Text
                              fontSize="lg"
                              fontWeight="600"
                              color="gray.600"
                            >
                              No comments yet
                            </Text>
                            <Text fontSize="sm" color="gray.500" maxW="300px">
                              Be the first to share your thoughts on this post
                            </Text>
                          </VStack>
                        </VStack>
                      </Box>
                    )}
                  </ModalBody>

                  <ModalFooter
                    borderTop="1px"
                    borderColor="gray.200"
                    bg="gray.50"
                    borderBottomRadius="xl"
                    gap={3}
                  >
                    <Button variant="ghost" onClick={onClose} size="md">
                      Close
                    </Button>
                    <Button
                      colorScheme="teal"
                      as={"a"}
                      href={`/post/${post.id}`}
                      size="md"
                      rightIcon={
                        <Box as="span" fontSize="sm">
                          →
                        </Box>
                      }
                    >
                      View Full Post
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </HStack>
          </HStack>
        </Stack>
      }
    </Box>
  );
}

const MobilePost = () => {
  return <></>;
};

export default Post;
