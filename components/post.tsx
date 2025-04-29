import { Prisma } from "@prisma/client";
import {
  Box,
  Heading,
  Text,
  HStack,
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
import { useRouter } from 'next/navigation'

export type FullPost = Prisma.PostGetPayload<{
  include: {
    user: true;
    section: true;
    votes: { include: { user: true } };
    _count: true;
  };
}>;

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
  const {postDetail, isLoading, isError} = usePostDetail(url, null);
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
      maxW='800px'
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
            fontSize={["xl","2xl"]}
            fontFamily={"body"}
          >
            {post.title}
          </Heading>
          <HStack justify={"space-between"} align="center">
            <HStack>
              <Avatar size="sm" src={post.user.image as string | undefined} />
              <Text fontSize={["xs","sm"]} fontWeight={600}>
                {post.user.name}
              </Text>
              <Text
                fontSize={"xs"}
                color={"gray.500"}
              >{`${month}-${date}-${year}`}</Text>
            </HStack>
            <Text
              as={Link}
              display={["none","flex"]}
              href={`/sections/${post.section?.id}`}
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={["xs","sm"]}
              letterSpacing={1.1}
            >
              {post.section?.name}
            </Text>
          </HStack>
          <Text
              as={Link}
              display={["flex","none"]}
              href={`/sections/${post.section?.id}`}
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={["xs","sm"]}
              letterSpacing={1.1}
            >
              {post.section?.name}
            </Text>

          <Box as={"a"} href={`post/${post.id}`}>
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
                onClick={(e: React.MouseEvent<HTMLElement>) => setTextOpen(!textOpen)}
              >
                {textOpen ? "show less" : "... show more"}
              </Text>
            </Flex>
          )}

          <HStack justify={"space-between"}>
            <HStack divider={<StackDivider borderColor="gray.200" />}></HStack>
            <HStack spacing={2}>
              {/* <BiCommentDetail /> */}
              <Button display={['none', 'flex']} fontSize={"md"} variant='ghost' leftIcon={<BiCommentDetail/>} onClick={onOpen}>{`${post._count.comments} Comments`}</Button>
              <Button display={['flex', 'none']} fontSize={"sm"} variant='ghost' leftIcon={<BiCommentDetail/>} onClick={onOpen}>{`${post._count.comments}`}</Button>
              <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{`All ${post._count.comments} comments`}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody as={Stack}>
                    {postDetail?.comments.map((comment) => (
                      <Comment comment={comment} url={url} isCompact={true} key={comment.id} />
                    ))}
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button colorScheme="blue" mr={3} as={"a"} href={`post/${post.id}`}>
                      View Detail
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
  return (
    <></>
  )
}

export default Post;
