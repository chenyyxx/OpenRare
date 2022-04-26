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
  Heading,
  Text,
  Stack,
  StackDivider,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import SmallProfile from '../components/small_profile';
import Nav from "../components/nav";
import Post from '../components/post';
import LeftSideBar from '../components/left_side_bar';
import { Button } from '@chakra-ui/react';
import LargeProfile from '../components/large_profile';
import ProfileRightPanel from '../components/right_panel';
import test_sections from '../test_sections.json'
import SmallSection from '../components/small_section';

export default function Home({
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
                <Wrap justify="center" pt="24px" pl="24px" pr="24px">
                  {/* <HStack> */}
                  <WrapItem><Button colorScheme='teal' variant='solid' rounded={20}>My Posts</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Favorites</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Upvoted</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Comments</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Messages</Button></WrapItem>
                  <WrapItem><Button colorScheme='teal' variant='outline' rounded={20}>Notifications</Button></WrapItem>
                    {/* <Button colorScheme='teal' variant='solid' rounded={20}>My Posts</Button>
                    <Button colorScheme='teal' variant='outline' rounded={20}>Favorites</Button>
                    <Button colorScheme='teal' variant='outline' rounded={20}>Upvoted</Button>
                    <Button colorScheme='teal' variant='outline' rounded={20}>Comments</Button>
                    <Button colorScheme='teal' variant='outline' rounded={20}>Messages</Button>
                    <Button colorScheme='teal' variant='outline' rounded={20}>Notifications</Button> */}
                  {/* </HStack> */}
                  {/* <InputGroup w={"30%"} size='md' >
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
                    </InputGroup> */}
                </Wrap>
                <VStack p="24px" minH="full" spacing={"24px"}>
                    {posts.map((post) => (
                        <Post post={post} key={post.id}/>
                        )
                    )}
                </VStack>
              
            </Box>
            <VStack minH="full" p={"24px"} spacing={"24px"}>
                {/* <LeftSideBar/> */}
                <Stack divider={<StackDivider borderColor='gray.200' />}
                  bg={useColorModeValue('white', 'gray.900')}
                  borderRight="1px"
                  borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                  w={{ base: 'none', md: '320px' }}
                  rounded={'md'}
                  h="max"
                  p={6}
                  spacing={"24px"}
                >
                  <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>My Profile</Heading>
                  <SmallProfile/>
                </Stack>
                <Stack divider={<StackDivider borderColor='gray.200' />}
                  bg={useColorModeValue('white', 'gray.900')}
                  borderRight="1px"
                  borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                  w={{ base: 'none', md: '320px' }}
                  rounded={'md'}
                  h="max"
                  p={6}
                  spacing={"24px"}
                >
                  <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>My Sections</Heading>
                  <VStack minH="full" spacing={"12px"}>
                    {test_sections.map((section) => (
                        <SmallSection section={section} key={section.id} />
                        )
                    )}
                  </VStack>
                </Stack>
            </VStack>
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