import React from "react";
import { Prisma } from "@prisma/client";
import {
  Box,
  useColorModeValue,
  VStack,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Nav from "../components/nav";
import Post from "../components/post";
import { FullPost } from "../components/post";
import LeftSideBar from "../components/left_side_bar";
import { Button } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { fetchData } from "../utils/utils";

export default function Explore({
  initialPosts,
}: {
  initialPosts: FullPost[];
}) {
  const url = `/api/get_all_posts`;
  const { data: posts, error } = useSWR<FullPost[]>(url, fetchData, {
    fallbackData: initialPosts,
  });

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Nav />
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
        <Box h="max" p={"24px"} pos="sticky" top={"64px"}>
          <LeftSideBar />
        </Box>
        <Box>
          <VStack p="24px" minH="full" spacing={"12px"}>
            {posts && posts.map((post) => <Post post={post} key={post.id} />)}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/get_all_posts`);
  const initialPosts = await res.json();

  // Pass data to the page via props
  return { props: { initialPosts } };
};
