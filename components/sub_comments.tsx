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
    IconButton,
    Textarea
  } from '@chakra-ui/react';
import RichTextEditor from './RichText'
import {BiCommentDetail, BiLike, BiDislike} from "react-icons/bi";
import { useState } from 'react';
import { useSession } from 'next-auth/react';

// TODO:
// this has two types:
// 1. reply to comment
// 2. reply to other sub comments: need to add xxx reply to @ xxx in the use box
export default function SubComments(props){
    const { data: session, status } = useSession()
    const [showEditor, setShowEditor] = useState(false)
    const [content, setContent] = useState('')
    const createdAt = new Date(props.comment.createdAt)
    const date = createdAt.getDate()
    const year = createdAt.getFullYear()
    const hour = createdAt.getHours()
    const month = createdAt.getMonth()
    const handleContentChange = (e) => {
        const inputValue = e.target.value
        setContent(inputValue)
    }
    const handleNewComment = async (e) => {
        e.preventDefault();
        setShowEditor(false)
        // submit form here
        // checck if content = ""
        const newSubComment = {
            parentId: props.comment.parentId,
            content: content,
            user: session?.user
        }
        if(content==""){
            alert("comment content cannot be empty")
        } else {
            await fetch("/api/create_comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSubComment),
            })
            setContent("")
        }
        
    }
    return (
        <Box
            w={'full'}
            bg='white'
            rounded={'md'}
            p='12px'
            overflow={'hidden'}
            borderColor="gray.500"
            borderTopWidth='1px'
            borderRightWidth='1px'
            borderBottomWidth='1px'
            // borderLeftStyle="solid"
            borderLeftWidth="4px"
            borderLeftColor="purple.300"
        >
            <HStack align='top'>
                <Avatar
                    src={props.comment.user.image}
                    size='xs'
                />
                 
                <Stack w='full' spacing={0}>
                    <HStack>
                        
                        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                            <Text fontWeight={600}>{props.comment.user.name}</Text>
                        </Stack>
                    </HStack>
                    <RichTextEditor
                        readOnly
                        value={props.comment.content}
                        onChange={()=>{}} 
                        styles={{root: { border: 'none'}}}
                        sx={()=> ({
                            '& .ql-editor': {
                            padding: '0px 0px'
                            },
                        })}
                    />
                    <Flex align='center' justify='space-between'>
                        <Text  fontSize='xs' color={'gray.500'}>{`${year}-${month}-${date}`}</Text> 
                        <HStack>
                            <IconButton aria-label='reply' variant='ghost' size='sm' onClick={()=>{setShowEditor(true)}} icon={<BiCommentDetail/>}/>
                            <IconButton aria-label='like' variant='ghost' size='sm' icon={<BiLike/>}/>
                            <IconButton aria-label='dislike' variant='ghost' size='sm' icon={<BiDislike/>}/>
                        </HStack>
                    </Flex>
                </Stack>
                
            </HStack>
            
            {
                    showEditor ?
                    <form onSubmit={e=>handleNewComment(e)}>
                        <Box mt="12px">
                            <Textarea
                                
                                rounded={6}
                                isRequired
                                value={content}
                                onChange={handleContentChange}
                                placeholder={"Reply to @" + [props.comment.user.name]}
                                size='sm'
                            />
                            <HStack pt='12px' justify="right" w="full">
                                <Button size='sm'  onClick={()=>setShowEditor(false)}>Cancel</Button>
                                <Button type="submit" size='sm' colorScheme="teal" >Comment</Button>
                            </HStack>
                        </Box>
                    </form>
                    
                            
                    :
                    <></>
                }
        </Box>
    );
 }