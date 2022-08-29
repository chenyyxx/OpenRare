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
import PostDetail from "../../../components/post_detail";
import SmallProfile from "../../../components/small_profile";
import Comment from "../../../components/comment";
import { Prisma } from "@prisma/client";
import useSWR from "swr";
import { fetchData } from "../../../utils/utils";

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
                votes: { include: { user: true } };
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
            votes: { include: { user: true } };
            _count: true;
          };
        };
        followedBy: true;
        following: true;
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

export function usePostDetail(url: string, fallbackData: FullPostEx | null) {
  const { data, error } = useSWR<FullPostEx, Error>(
    url,
    fetchData
  );
  return {
    postDetail: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function SectionDetail({
  initialPost,
  id,
}: {
  initialPost: FullPostEx;
  id: string;
}) {
  const url = `/api/get_post/${id}`;
  // const { data: post, error } = useSWR<FullPostEx, Error>(url, fetchData, {
  //   fallbackData: initialPost,
  // });
  const {postDetail, isLoading, isError} = usePostDetail(url, initialPost);
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Nav />
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
        <VStack h="max" p={"24px"} spacing={"24px"} pos="sticky" top={"64px"}>
          <LeftSideBar />
          {postDetail && <SmallProfile user={postDetail.user} />}
        </VStack>
        {postDetail && (
          <VStack w="full" p="24px">
            <PostDetail post={postDetail} url={url} />
            {postDetail.comments.map((comment) => (
              <Comment comment={comment} url={url} isCompact={false} key={comment.id} />
            ))}
          </VStack>
        )}
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
  const id = context.query.id;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/get_post/${id}`);
  const initialPost = await res.json();

  return { props: { initialPost, id } };
};
