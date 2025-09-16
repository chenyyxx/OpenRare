import {
    Box,
    Text,
    HStack,
    Stack,
    Button,
    Flex,
    IconButton,
    Textarea,
    Divider
  } from '@chakra-ui/react';
import RichTextEditor from './RichText'
import {BiCommentDetail} from "react-icons/bi";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Prisma } from "@prisma/client";
import { useSWRConfig } from "swr";
import AuthRequiredAlert from "./AuthRequiredAlert";

export type SubComment = Prisma.SubCommentGetPayload<{
    include: { user: true; parent: {include: {user:true;}}; children: true ;votes: true; comment: true; };
}>;

type AppProps = {
    subComment: SubComment,
    url: string
}
// TODO:
// this has two types:
// 1. reply to comment
// 2. reply to other sub comments: need to add xxx reply to @ xxx in the use box
export default function SubComments({subComment, url}:AppProps){
    // console.log(props)
    const parent = subComment.parent?.user.name
    // console.log(parent)
    const { data: session } = useSession()
    const [showEditor, setShowEditor] = useState(false)
    const [showAuthAlert, setShowAuthAlert] = useState(false)
    const [content, setContent] = useState('')
    const createdAt = new Date(subComment.createdAt)
    const date = createdAt.getDate()
    const year = createdAt.getFullYear()
    const month = createdAt.getMonth()
    const { mutate } = useSWRConfig();

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

        if(content==""){
            alert("comment content cannot be empty")
        } else {
            await fetch(`/api/reply_subcomment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSubComment),
            })
            setContent("");
            mutate(url);
        }
        
    }
    return (
        <>
            {/* Simple line divider */}
            <Divider borderColor="gray.300" my={2} />
            
            {/* Clean, minimal subcomment layout */}
            <Box>
                <Stack spacing={2}>
                    {/* Author and reply info */}
                    <HStack spacing={2} align="center" flexWrap="wrap">
                        <Text 
                            fontWeight={600} 
                            color={parent ? '#3498DB' : '#14B8A6'} 
                            fontSize="sm"
                            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            {subComment.user.name}
                        </Text>
                        {parent && (
                            <>
                                <Text fontSize="xs" color="gray.500">replying to</Text>
                                <Text 
                                    fontSize="xs" 
                                    fontWeight={600} 
                                    color="#3498DB"
                                    _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                    @{parent}
                                </Text>
                            </>
                        )}
                    </HStack>

                    {/* Comment content */}
                    <Box>
                        <RichTextEditor
                            readOnly
                            value={subComment.content}
                            onChange={()=>{}} 
                            styles={{root: { border: 'none'}}}
                            sx={()=> ({
                                '& .ql-editor': {
                                    padding: '0px 0px',
                                    fontSize: '14px'
                                },
                            })}
                        />
                    </Box>

                    {/* Footer with date and reply button */}
                    <Flex align="center" justify="space-between" pt={1}>
                        <HStack spacing={2} align="center">
                            <Text fontSize="xs" color="gray.500">
                                {`${month}-${date}-${year}`}
                            </Text>
                            <Text 
                                fontSize="xs" 
                                color={parent ? '#3498DB' : '#14B8A6'} 
                                fontWeight="500"
                                textTransform="uppercase"
                                letterSpacing="0.5px"
                            >
                                {parent ? 'Reply' : 'Comment'}
                            </Text>
                        </HStack>
                        
                        <IconButton 
                            aria-label="reply" 
                            variant="outline" 
                            colorScheme="teal"
                            size="xs" 
                            rounded="full"
                            fontWeight="500"
                            onClick={() => {
                                if (!session) {
                                    setShowAuthAlert(true);
                                } else {
                                    setShowEditor(true);
                                }
                            }} 
                            icon={<BiCommentDetail/>}
                            _hover={{
                                transform: "translateY(-1px)",
                                shadow: "md"
                            }}
                        />
                    </Flex>
                </Stack>

                {/* Reply editor */}
                {showEditor && (
                    <Box mt={3} pt={3} borderTop="1px" borderColor="gray.200">
                        <Textarea
                            bg="gray.50"
                            border="2px"
                            borderColor="gray.300"
                            rounded="2xl"
                            isRequired
                            value={content}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                            placeholder={`Reply to @${subComment.user.name}`}
                            size="sm"
                            _focus={{
                                borderColor: "teal.400",
                                boxShadow: "0 0 0 1px teal.400"
                            }}
                        />
                        <HStack pt={3} justify="flex-end" spacing={2}>
                            <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setShowEditor(false)}
                            >
                                Cancel
                            </Button>
                            <Button  
                                size="sm" 
                                colorScheme="teal"
                                rounded="full"
                                fontWeight="500"
                                onClick={(e: React.MouseEvent<HTMLElement>) => handleReplySubComment(e)}
                                _hover={{
                                    transform: "translateY(-1px)",
                                    shadow: "md"
                                }}
                            >
                                Reply
                            </Button>
                        </HStack>
                    </Box>
                )}
            </Box>

            {/* Authentication Alert */}
            {showAuthAlert && (
                <AuthRequiredAlert 
                    action="reply to comments" 
                    isOpen={showAuthAlert}
                    onClose={() => setShowAuthAlert(false)}
                />
            )}
        </>
    );
 }