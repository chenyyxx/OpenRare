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
import RichTextEditor from './RichText'
import SubComments from './sub_comments';
import {BiCommentDetail, BiLike ,BiBookmark} from "react-icons/bi";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Textarea
  } from '@chakra-ui/react'
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Comment(props){
    // console.log(props)
    const numSubComments = props.comment.subComments.length
    // need to get all comments recursively dfs
    const subComments = props.comment.subComments.slice(0, 5)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showEditor, setShowEditor] = useState(false)
    const [content, setContent] = useState('')
    const { data: session, status } = useSession()
    const handleContentChange = (e) => {
        const inputValue = e.target.value
        setContent(inputValue)
    }
    const handleNewSubComment = async (e) => {
        e.preventDefault();
        setShowEditor(false)
        // submit form here
        // checck if content = ""
        const newSubComment = {
            commentId: props.comment.id,
            content: content,
            user: session?.user
        }
        if(content==""){
            alert("comment content cannot be empty")
        } else {
            await fetch("/api/create_subcomment", {
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
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
            borderColor="teal.400"
            // borderLeftStyle="solid"
            borderLeftWidth="6px"
            // borderLeftColor="coral"
        >
            <Stack>
                <HStack>
                    <Avatar
                    src={props.comment.user.image}
                    />
                    <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                        <Text fontWeight={600}>{props.comment.user.name}</Text>
                        <Text color={'gray.500'}>{`Created At: ${props.comment.createdAt}`}</Text> 
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
                <Flex justify='right'>
                    <Button size="sm" variant='ghost' leftIcon={<BiCommentDetail/>} onClick={()=>{setShowEditor(true)}}>5.8k comments</Button>
                    <Button size="sm" variant='ghost' leftIcon={<BiLike/>}>Share</Button>
                    <Button size="sm" variant='ghost' leftIcon={<BiBookmark/>}>Save</Button>
                </Flex>
                {
                    showEditor ?
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
                                <Button  size='sm' colorScheme="teal" onClick={e=>handleNewSubComment(e)} >Comment</Button>
                            </HStack>
                        </Box>  
                    :
                    <></>
                }
                {
                    subComments.map((child) => (
                        <SubComments subComment={child} key={child.id}/>
                    ))
                }
                {
                    numSubComments > 5 ?
                    <Center>
                        <Button size='xs' variant='ghost' onClick={onOpen}>{`Expand all ${numSubComments} comments...`}</Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>{`All ${numSubComments} comments`}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody as={Stack}>
                            {
                                props.comment.subComments.map((child) => (
                                    <SubComments subComment={child} key={child.id}/>
                                ))
                            } 
                            </ModalBody>

                            <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button variant='ghost'>Secondary Action</Button>
                            </ModalFooter>
                        </ModalContent>
                        </Modal>
                    </Center>
                    :
                    <></>
                }
                
            </Stack>
        </Box>
    );
 }