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

 export default function Comment(props){
    return (
        <Box
            w={'full'}
            bg='white'
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
            borderColor="teal"
            // borderLeftStyle="solid"
            borderLeftWidth="7px"
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
                {
                    props.comment.children.map((child) => (
                        <SubComments comment={child} key={child.id}/>
                    ))
                }
                
            </Stack>
        </Box>
    );
 }