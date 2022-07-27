import React from "react";
import { GetServerSideProps } from "next";
import {
    Box,
    useColorModeValue,
    VStack,
    HStack,
    Flex,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import Nav from "../../../components/nav";
import Post from "../../../components/post";
import LeftSideBar from "../../../components/left_side_bar";
import { Button } from "@chakra-ui/react";
import LargeProfile from "../../../components/large_profile";
import ProfileRightPanel from "../../../components/right_panel";
import LargeSection from "../../../components/large_section";
import sectionsArray from "../../../test_sections";
import { useRouter } from "next/router";
import PostDetail from "../../../components/post_detail";
import SmallProfile from "../../../components/small_profile";
import Comment from "../../../components/comment";
import { Prisma } from "@prisma/client";

export type FullPostEx = Prisma.PostGetPayload<{
    include: {
        user: {
            include: {
                sections: {
                    include: {
                        users: true;
                        posts: {
                            include: {
                                user: true;
                                section: true;
                                votes: true;
                                _count: true;
                            };
                        };
                        _count: true;
                    };
                };
                posts: {
                    include: {
                        user: true;
                        section: true;
                        votes: true;
                        _count: true;
                    };
                };
            };
        };
        posts: {
            include: { user: true; section: true; votes: true; _count: true };
        };
        section: true;
        votes: true;
        comments: {
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
        };
        _count: true;
    };
}>;

export default function SectionDetail({ post }: { post: FullPostEx }) {
    // console.log(post)
    return (
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
            <Nav />
            <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
                <VStack
                    h="max"
                    p={"24px"}
                    spacing={"24px"}
                    pos="sticky"
                    top={"64px"}
                >
                    <LeftSideBar />
                    <SmallProfile user={post.user} />
                    {/* <ProfileRightPanel/> */}
                </VStack>
                <VStack w="full" p="24px">
                    <PostDetail post={post} />
                    {/* <Comment comment={post.comments[0]}/> */}
                    {post.comments.map((comment) => (
                        <Comment comment={comment} key={comment.id} />
                    ))}
                </VStack>
                {/* <VStack  minH="full" p={"24px"} spacing={"24px"}>
                <SmallProfile user={post.user}/>
            </VStack> */}
            </Flex>
        </Box>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // ...
    const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/get_post/${context.query.id}`
    );
    const post = await res.json();
    return { props: { post } };
};
