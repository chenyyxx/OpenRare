import React from 'react';
import {
  Box,
  useColorModeValue,
  VStack,
  Flex,
  Wrap, WrapItem,
} from '@chakra-ui/react';
import Nav from "../components/nav";
import Post from '../components/post';
import LeftSideBar from '../components/left_side_bar';



export default function Explore({
  posts,
}: {
  posts: Post[]
}) {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
            <Box minH="full" p={"24px"} >
                <LeftSideBar/>
            </Box>
            <Box>
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

export async function getStaticProps() {
  // Fetch data from external API
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {mode: "cors"})
  const posts = await res.json()

  // Pass data to the page via props
  return { props: { posts } }
}