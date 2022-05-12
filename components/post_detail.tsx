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

 export default function PostDetail(props){
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
            </Stack>
        </Box>
    );
 }