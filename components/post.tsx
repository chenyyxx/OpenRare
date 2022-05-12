import Image from 'next/image';
import {
  Box,
  Center,
  Heading,
  Text,
  HStack,
  StackDivider,
  Stack,
  Avatar,
  useColorModeValue,
  VStack,
  Button,
  Flex,
} from '@chakra-ui/react';

import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
import {BiCommentDetail, BiShare ,BiBookmark} from "react-icons/bi";
import RichTextEditor from './RichText'

interface Post {
  id: number,
  title: string,
  body: string
}



function Post({post}: {post: Post}) {
  return (
    
    // <Center>
      <Box
        
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        {
          <HStack spacing='24px' justify={'space-around'} divider={<StackDivider borderColor='gray.200' />}>
            <VStack spacing={4} align={'center'}>
              <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
                <Avatar
                  src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
                />
                <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                  <Text fontWeight={600}>Achim Rolle</Text>
                  <Text color={'gray.500'}>Feb 08, 2021 · 6min read</Text> 
                </Stack>
                
              </Stack>
              <HStack spacing='24px' divider={<StackDivider borderColor='gray.200' />}>
                <HStack>
                  <TriangleUpIcon color='teal.500' />
                  <Text fontSize={'sm'} color={'gray.500'}>
                    688
                  </Text>
                </HStack>
                <HStack>
                  <TriangleDownIcon color='red.500' />
                  <Text fontSize={'sm'} color={'gray.500'}>
                      23
                    </Text>
                </HStack>
              </HStack>
            </VStack>
            <Stack w={'70%'}>
              <Stack as={'a'} href={""}>
                <Text
                  color={'green.500'}
                  textTransform={'uppercase'}
                  fontWeight={800}
                  fontSize={'sm'}
                  letterSpacing={1.1}>
                  Blog
                </Text>
                <Heading
                  color={useColorModeValue('gray.700', 'white')}
                  fontSize={'2xl'}
                  fontFamily={'body'}>
                  {post.title}
                </Heading>
                {/* <Text color={'gray.500'}> */}
                <RichTextEditor
                  readOnly
                  value={post.content}
                  onChange={()=>{}} 
                  styles={{root: { border: 'none'}}}
                  sx={()=> ({
                    '& .ql-editor': {
                      padding: '0px 0px'
                    },
                  })}

                />
                  
                {/* </Text> */}
              </Stack>
              <Flex justify='right'>
                <Button variant='ghost' leftIcon={<BiCommentDetail/>}>5.8k comments</Button>
                <Button variant='ghost' leftIcon={<BiShare/>}>Share</Button>
                <Button variant='ghost' leftIcon={<BiBookmark/>}>Save</Button>
              </Flex>
            </Stack>
            
          </HStack>
        }
      </Box>
  );
}



export default Post