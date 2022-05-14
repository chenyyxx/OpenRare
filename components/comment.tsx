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
  } from '@chakra-ui/react'

export default function Comment(props){
    const numChildren = props.comment.children.length
    const children = props.comment.children.slice(0, 5)
    const { isOpen, onOpen, onClose } = useDisclosure()
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
                    <Button variant='ghost' leftIcon={<BiCommentDetail/>}>5.8k comments</Button>
                    <Button variant='ghost' leftIcon={<BiLike/>}>Share</Button>
                    <Button variant='ghost' leftIcon={<BiBookmark/>}>Save</Button>
                </Flex>
                {
                    children.map((child) => (
                        <SubComments comment={child} key={child.id}/>
                    ))
                }
                {
                    numChildren > 5 ?
                    <Center>
                        <Button size='xs' variant='ghost' onClick={onOpen}>{`Expand all ${numChildren} comments...`}</Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>{`All ${numChildren} comments`}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody as={Stack}>
                            {
                                props.comment.children.map((child) => (
                                    <SubComments comment={child} key={child.id}/>
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