import {
    Button,
    useDisclosure,
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    useColorModeValue,
    Flex,
    HStack,
    Stack,
    Link
} from '@chakra-ui/react'

import RichTextEditor from '../../../components/RichText';

import { useState } from 'react';

import Nav from '../../../components/nav';
import LeftSideBar from '../../../components/left_side_bar';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const initialValue = '';

export default function EditPost() {
    const [content, setCotent] = useState(initialValue);
    const [title, setTitle] = useState('')
    const router = useRouter()
    const { id } = router.query
    const { data: session, status } = useSession()
    const handleInputChange = (e) => setTitle(e.target.value)
    
    const handleNewPost = async(e) => {
        e.preventDefault();

        // create a new post locally
        const newPost = {
            title: title,
            content: content,
            sectionId: parseInt(id),
            user: session?.user,
        }

        // api request
        await fetch("/api/create_post", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ post: newPost }),
        });
        router.push(`/sections/${id}`);
    }
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <Nav/>
            <Flex justify="center" pl={"20%"} pr={"20%"} pt={"64px"}>
                <Box minH="full" p={"24px"} >
                    <LeftSideBar/>
                </Box>
                <Box w="full" p="24px" minH="full">
                    <Box bg="white" rounded={'md'} >
                        <form onSubmit={handleNewPost}>
                            <FormControl p="24px" isRequired>
                                <Stack spacing={"12px"}>
                                    <FormLabel htmlFor='title'>Create Your Post</FormLabel>
                                    <Input id='title' type='title' placeholder='Enter post title' isRequired value={title} onChange={handleInputChange}/>
                                    <Box rounded={'md'}>
                                        {/* <ReactQuill modules={modules} theme="snow" value={content} onChange={setCotent}/> */}
                                        <RichTextEditor 
                                            controls={[
                                                ['bold', 'italic', 'underline', 'link'],
                                                ['unorderedList', 'h1', 'h2', 'h3'],
                                                ['sup', 'sub'],
                                                ['alignLeft', 'alignCenter', 'alignRight'],
                                            ]}
                                            styles={{
                                                root: { 
                                                    borderColor: '#E2E8F0',
                                                    borderRadius: '0.375rem',
                                                    minHeight: '200px',
                                                },
                                                toolbar: { borderColor: '#E2E8F0' },
                                            }}
                                            value={content} 
                                            onChange={setCotent} 
                                        />
                                    </Box>
                                    <HStack justify={'end'}>
                                        <Box>
                                            <Button
                                                w={'full'}
                                                mt={2}
                                                color={'white'}
                                                rounded={'md'}
                                                colorScheme={'teal'}
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 'lg',
                                                }}
                                                style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.back();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                        <Box>
                                            <Button
                                                type="submit"
                                                w={'full'}
                                                mt={2}
                                                color={'white'}
                                                rounded={'md'}
                                                colorScheme={'teal'}
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 'lg',
                                                }}
                                                style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}
                                            >
                                                Create
                                            </Button>
                                        </Box>
                                    </HStack >
                                </Stack>
                                
                            </FormControl>
                        </form>
                        
                    </Box>
                    
                    
                </Box>
                
            </Flex>
            
            
        </Box>
        
    )
}