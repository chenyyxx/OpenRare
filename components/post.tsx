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
} from "@chakra-ui/react";

import { BiCommentDetail } from "react-icons/bi";
import RichTextEditor from "./RichText";
import { useState, useRef, useEffect } from "react";

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
    const postContent = post.content.replace(/<[^>]+>/g, "");

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
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"md"}
            p={6}
            overflow={"hidden"}
        >
            {
                <Stack>
                    <Heading
                        as={"a"}
                        href={`/post/${post.id}`}
                        color={useColorModeValue("gray.700", "white")}
                        fontSize={"2xl"}
                        fontFamily={"body"}
                    >
                        {post.title}
                    </Heading>
                    <HStack justify={"space-between"} align="center">
                        <HStack>
                            <Avatar
                                size="sm"
                                src={post.user.image as string | undefined}
                            />
                            <Text fontSize={"sm"} fontWeight={600}>
                                {post.user.name}
                            </Text>
                            <Text
                                fontSize={"xs"}
                                color={"gray.500"}
                            >{`${month}-${date}-${year}`}</Text>
                        </HStack>
                        <Text
                            as={Link}
                            href={`/sections/${post.section?.id}`}
                            color={"green.500"}
                            textTransform={"uppercase"}
                            fontWeight={800}
                            fontSize={"sm"}
                            letterSpacing={1.1}
                        >
                            {post.section?.name}
                        </Text>
                    </HStack>

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
                            <Text fontSize={"sm"} noOfLines={3} ref={textRef}>
                                {postContent}
                            </Text>
                        )}
                    </Box>
                    {!textOpen && !overflowActive ? null : (
                        <Flex w="full" justify="end">
                            <Text
                                fontSize={"sm"}
                                as={Link}
                                onClick={(e) => setTextOpen(!textOpen)}
                            >
                                {textOpen ? "show less" : "... show more"}
                            </Text>
                        </Flex>
                    )}

                    <HStack justify={"space-between"}>
                        <HStack
                            divider={<StackDivider borderColor="gray.200" />}
                        ></HStack>
                        <HStack spacing={2}>
                            <BiCommentDetail />
                            <Text fontSize="md">{`${post._count.comments} Comments`}</Text>
                            {/* <Button size='sm' variant='ghost' leftIcon={<BiShare/>}>Share</Button>
                <Button size='sm' variant='ghost' leftIcon={<BiBookmark/>}>Save</Button> */}
                        </HStack>
                    </HStack>
                </Stack>
            }
        </Box>
    );
}

export default Post;
