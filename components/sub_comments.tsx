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

 export default function SubComments(props){
    return (
        <Box
            w={'full'}
            bg='white'
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
            borderColor="coral"
            // borderLeftStyle="solid"
            borderLeftWidth="5px"
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
            </Stack>
        </Box>
    );
 }