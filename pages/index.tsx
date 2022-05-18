import React from 'react';
import { Prisma } from "@prisma/client";
import {
  Box,
  useColorModeValue,
  VStack,
  Flex,
  Wrap, WrapItem,
} from '@chakra-ui/react';
import Nav from "../components/nav";
import Post from '../components/post';
import {FullPost} from '../components/post';
import LeftSideBar from '../components/left_side_bar';
import { Button } from '@chakra-ui/react';
import { GetServerSideProps } from 'next'
// import useSWR from "swr";
// import { fetchData } from "../utils/utils";

export default function Explore({
  posts,
}: {
  posts: FullPost[]
}) {
  // const subUrl = `/api/get_all_posts`;

  // const { data, error } = useSWR(subUrl, fetchData, {
  //   fallbackData: posts,
  // });
  // console.log("the new votes state", data);

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
            <Box 
              h="max"
              p={"24px"}   
              pos="sticky"
              top={"64px"}
            >
                <LeftSideBar/>
            </Box>
            <Box>
                <Wrap pt="24px" pl="24px" pr="24px">
                    <WrapItem><Button colorScheme='teal' variant='solid' rounded={20}>New</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Top</Button></WrapItem>
                    <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Hot</Button></WrapItem>
                </Wrap>
                <VStack p="24px" minH="full" spacing={"24px"}>
                    {posts.map((post) => (
                        <Post post={post} key={post.id}/>
                        )
                    )}
                </VStack>

            </Box>
        </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  // const posts = await fetchData(`http://localhost:3000/api/get_all_posts`)
  const res = await fetch(`http://localhost:3000/api/get_all_posts`)
  const posts = await res.json()

  // Pass data to the page via props
  return { props: { posts } }
}