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
import { Prisma } from "@prisma/client";


export type SubComment = Prisma.SubCommentGetPayload<{
    include: { user: true; parent: {include: {user:true;}}; children: true ;votes: true; comment: true; };
}>;

type AppProps = {
    subComment: SubComment,
    labelColor: string
}
// TODO:
// this has two types:
// 1. reply to comment
// 2. reply to other sub comments: need to add xxx reply to @ xxx in the use box
export default function SubComments({subComment, labelColor}:AppProps){
    // console.log(props)
    const parent = subComment.parent?.user.name
    // console.log(parent)
    const { data: session, status } = useSession()
    const [showEditor, setShowEditor] = useState(false)
    const [content, setContent] = useState('')
    const createdAt = new Date(subComment.createdAt)
    const date = createdAt.getDate()
    const year = createdAt.getFullYear()
    const month = createdAt.getMonth()

    const handleReplySubComment = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setShowEditor(false)
        // submit form here
        // checck if content = ""
        const newSubComment = {
            commentId: subComment.commentId,
            content: content,
            user: session?.user,
            parentId: subComment.id
        }
        // console.log(newSubComment)
        if(content==""){
            alert("comment content cannot be empty")
        } else {
            await fetch(`${process.env.NEXTAUTH_URL}/api/reply_subcomment`, {
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
            borderLeftColor={labelColor}
        >
            <HStack align='top'>
                <Avatar
                    src={subComment.user.image as string | undefined}
                    size='xs'
                />
                 
                <Stack w='full' spacing={0}>
                    <HStack>
                        
                        <Stack direction={'row'} spacing={1} fontSize={'sm'} align="center">
                            <Text fontWeight={600}>{subComment.user.name}</Text>
                            {
                                parent ?
                                
                                <Stack direction={'row'} spacing={1} fontSize={'sm'} align="center">
                                    <Text fontSize={'xs'} fontWeight={300}>{"replying to:"}</Text>
                                    <Text fontWeight={600}>{"@" + parent}</Text>
                                </Stack> :
                                <></>
                            }
                            
                        </Stack>
                    </HStack>
                    <RichTextEditor
                        readOnly
                        value={subComment.content}
                        onChange={()=>{}} 
                        styles={{root: { border: 'none'}}}
                        sx={()=> ({
                            '& .ql-editor': {
                            padding: '0px 0px'
                            },
                        })}
                    />
                    <Flex align='center' justify='space-between'>
                        <Text  fontSize='xs' color={'gray.500'}>{`${month}-${date}-${year}`}</Text> 
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
                    <Box mt="12px">
                        <Textarea
                            
                            rounded={6}
                            isRequired
                            value={content}
                            onChange={e=>setContent(e.target.value)}
                            placeholder={"Reply to @" + [subComment.user.name]}
                            size='sm'
                        />
                        <HStack pt='12px' justify="right" w="full">
                            <Button size='sm'  onClick={()=>setShowEditor(false)}>Cancel</Button>
                            <Button  size='sm' colorScheme="teal" onClick={e=>handleReplySubComment(e)} >Comment</Button>
                        </HStack>
                    </Box>  
                :
                <></>
            }
        </Box>
    );
 }