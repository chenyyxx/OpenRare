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
    Input,
  } from '@chakra-ui/react';
import RichTextEditor from './RichText'
import {BiCommentDetail, BiShare ,BiBookmark} from "react-icons/bi";
import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'


 export default function PostDetail(props){
    const [showEditor, setShowEditor] = useState(false)
    const handleNewComment = (e) => {
        e.preventDefault();
        setShowEditor(false)
        alert("comment submmited")
        console.log("comment submmited")
    }
    return (
        <Box
            w={'full'}
            bg='white'
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
        >
            <Stack>
                <HStack>
                    <Avatar
                    src={props.post.user.image}
                    />
                    <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                        <Text fontWeight={600}>{props.post.user.name}</Text>
                        <Text color={'gray.500'}>{`Last Updated: ${props.post.updatedAt}`}</Text> 
                    </Stack>
                </HStack>
                <Heading
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={'2xl'}
                    fontFamily={'body'}>
                    {props.post.title}
                </Heading>
                <RichTextEditor
                    readOnly
                    value={props.post.content}
                    onChange={()=>{}} 
                    styles={{root: { border: 'none'}}}
                    sx={()=> ({
                        '& .ql-editor': {
                        padding: '0px 0px'
                        },
                    })}
                />
                <Flex justify='right'>
                    <Button variant='ghost' onClick={()=>{setShowEditor(true)}} leftIcon={<BiCommentDetail/>}>5.8k comments</Button>
                    <Button variant='ghost' leftIcon={<BiShare/>}>Share</Button>
                    <Button variant='ghost' leftIcon={<BiBookmark/>}>Save</Button>
                </Flex>
                {
                    showEditor ?
                    <form onSubmit={handleNewComment}>
                        <FormControl  >
                            <FormLabel htmlFor='replt-to'>{"Reply to @" + props.post.user.name}</FormLabel>
                            <Input isRequired id='enter-comment' placeholder='Enter your comment' />
                            <HStack pt='12px' justify="right" w="full">
                                <Button  onClick={()=>setShowEditor(false)}>Cancel</Button>
                                <Button  type='submit' >Comment</Button>
                            </HStack>
                            
                        </FormControl>
                    </form>
                    :
                    <></>
                }
            </Stack>
        </Box>
    );
 }