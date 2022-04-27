import React, { ReactNode } from 'react';
import {
  Box,
  useColorModeValue,
  VStack,
  Wrap, WrapItem,
} from '@chakra-ui/react';
import Nav from "../components/nav";
import Section from '../components/section';
import Post from '../components/post';



export default function SidebarWithHeader({
  posts,
}: {
  posts: Post[]
}) {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <VStack>
        <VStack>
          {posts.map((post) => (
            <Post post={post} key={post.id}/>
            )
          )}
        </VStack>
      </VStack>
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