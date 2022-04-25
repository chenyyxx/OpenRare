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
    StackDivider,
  } from '@chakra-ui/react';
  
  interface Section {
    id: number,
    name: string,
    followers: number,
    posts: number,
    description: string,
    picture: string
  }

  export default function Section({section}: {section: Section}) {
    return (
      <Center>
        <Box
          maxW={'270px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
          <Image
            h={'90px'}
            w={'270px'}
            src={
              section.picture
            }
            objectFit={'cover'}
          />
          {/* <Flex justify={'center'} mt={-12}>
            <Avatar
              size={'xl'}
              src={
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
              }
              alt={'Author'}
              css={{
                border: '2px solid white',
              }}
            />
          </Flex> */}
  
          <Box p={3}>
            <Stack spacing={0} align={'center'} mb={1}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {section.name}
              </Heading>
              {/* <Text color={'gray.500'}>Frontend Developer</Text> */}
            </Stack>
  
            <Stack direction={'row'} justify={'center'} spacing={6} divider={<StackDivider borderColor='gray.200' />}>
              <HStack spacing={2} align={'center'}  >
                <Text fontSize={'sm'} color={'gray.500'}>
                  Posts
                </Text>
                <Text fontWeight={600}>{section.posts}</Text>
              </HStack>
              <HStack spacing={2} align={'center'} >
                <Text fontSize={'sm'} color={'gray.500'}>
                  Followers
                </Text>
                <Text fontWeight={600}>{section.followers}</Text>
              </HStack>
            </Stack>
            <HStack justify={'center'}>
                <Box>
                    <Button
                        w={'full'}
                        mt={2}
                        color={'white'}
                        rounded={'md'}
                        colorScheme={'teal'}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                    >
                        Enter
                    </Button>
                </Box>
                <Box>
                    <Button
                        w={'full'}
                        mt={2}
                        color={'white'}
                        rounded={'md'}
                        colorScheme={'teal'}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                    >
                        Follow
                    </Button>
                </Box>
                
                
            </HStack >
            
          </Box>
        </Box>
      </Center>
    );
  }