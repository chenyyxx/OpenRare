import {
    Heading,
    Spacer,
    Box,
    Center,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
    HStack,
    Divider,
    Avatar,
  } from '@chakra-ui/react';
  
import {BiMessageAltDetail, BiUser, BiShare ,BiBookmark} from "react-icons/bi";

interface Section {
    id: number,
    name: string,
    followers: number,
    posts: number,
    description: string,
    picture: string
}

export default function SmallSection({section}: {section: Section}) {
    return (
        <Center>
            <Box
                w={'271px'}
                bg={useColorModeValue('white', 'gray.800')}
                rounded={'md'}
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
                <Box p={4}>
                    <Stack direction={"row"}spacing={6} justify={'start'} align="center" p={2}>
                        <Avatar
                            size={'md'}
                            name={
                                section.name
                            }
                            objectFit={'cover'}
                        />
                        <Heading fontSize={'sm'} fontWeight={500} fontFamily={'body'}>
                            {section.name}
                        </Heading>
                        {/* <Text color={'gray.500'}>Frontend Developer</Text> */}
                    </Stack>

                    <Box p={2}>  
                        <Stack direction={'row'} justify={'center'} spacing={6}>
                            <Stack direction={'row'} spacing={4} align={'center'}>
                                <BiMessageAltDetail/>
                                <Text fontWeight={600}>{section.posts}</Text>
                                <Divider orientation='vertical' borderColor='gray.200' />
                                <BiUser/>
                                <Text fontWeight={600}>{section.followers}</Text>
                            </Stack>
                            <Button
                                mt={8}
                                rounded={'md'}
                                colorScheme={'teal'}>
                                Enter
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Center>
    );
}