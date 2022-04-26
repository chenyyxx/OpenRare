import React from 'react';
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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import Nav from "../components/nav";
import Post from '../components/post';
import LeftSideBar from '../components/left_side_bar';
import { Button } from '@chakra-ui/react';
import LargeProfile from '../components/large_profile';
import ProfileRightPanel from '../components/right_panel';
import LargeSection from '../components/large_section';
import test_section from '../test_sections.json'

export default function SectionDetail({
  posts,
}: {
  posts: Post[]
}) {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Nav/>
      <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
            <VStack minH="full" p={"24px"} spacing={"24px"}>
                <LeftSideBar/>
                {/* <ProfileRightPanel/> */}
            </VStack>
            <Box>
                <Box pt="24px" pl="24px" pr="24px" >
                    <LargeSection section={test_section[0]}/>
                </Box>
                {/* <Wrap justify="center" pt="24px" pl="24px" pr="24px"> */}
                <HStack justify="space-between" pt="24px" pl="24px" pr="24px">
                    <HStack>
                        <Button colorScheme='teal' variant='solid' rounded={20}>My Posts</Button>
                        <Button colorScheme='teal' variant='outline' rounded={20}>Favorites</Button>
                        <Button colorScheme='teal' variant='outline' rounded={20}>Upvoted</Button>
                    </HStack>
                  
                    <InputGroup w={"30%"} size='md' >
                        <Input 
                        pr='4.5rem'
                        focusBorderColor='teal.400' 
                        placeholder='Search Her' 
                        rounded={20}
                        borderColor='teal.400'
                        />
                        <InputRightElement width='4.5rem'>
                            <IconButton
                                variant='link'
                                aria-label='search'
                                colorScheme="teal"
                                icon={<SearchIcon />}
                            />
                        </InputRightElement>
                    </InputGroup>
                </HStack>
                {/* replace this render methods with section.posts */}
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