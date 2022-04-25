import {
    Heading,
    Avatar,
    Box,
    Center,
    HStack,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react';
  
  export default function LargeProfile() {
    return (
        <Center >
            <Box
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'md'}
                pos="relative"
                overflow={'hidden'}
            >
                <Image
                    h={'240px'}
                    w={'full'}
                    src={
                        'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                    }
                    objectFit={'cover'}
                    alt="profile_image"
                />
                <HStack>
                    <Box  w={"40%"}>
                        <Flex justify={'center'} mt={-32}>
                            <Avatar
                                size={'6xl'}
                                src={
                                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                                }
                                css={{
                                    border: '2px solid white',
                                }}
                            />
                        </Flex>

                        <Box p={6}>
                            

                            <Stack direction={'row'} justify={'center'} spacing={6}>
                                <Stack w={"15%"} spacing={0} align={'center'}>
                                    <Text fontWeight={600}>21</Text>
                                    <Text fontSize={'sm'} color={'gray.500'}>
                                        Posts
                                    </Text>
                                </Stack>
                                <Stack w={"15%"} spacing={0} align={'center'}>
                                    <Text fontWeight={600}>238</Text>
                                    <Text fontSize={'sm'} color={'gray.500'}>
                                        Followers
                                    </Text>
                                </Stack>
                                <Stack w={"15%"} spacing={0} align={'center'}>
                                    <Text fontWeight={600}>101</Text>
                                    <Text fontSize={'sm'} color={'gray.500'}>
                                        Following
                                    </Text>
                                </Stack>
                            </Stack>

                            <Button
                                colorScheme='teal' variant='solid'
                                rounded={'md'}
                                pos="absolute"
                                top="24px"
                                right="24px"
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Box>
                    <Box w= {"60%"}>
                        <Stack spacing={4} align={'start'} h="240px" pr="64px" py="36px">
                            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                                John Doe
                            </Heading>
                            <Text >
                                et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto
                            </Text>
                        </Stack>
                    </Box>
                </HStack>
                
            </Box>
        </Center>
    );
}