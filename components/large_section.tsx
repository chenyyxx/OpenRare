import { Divider } from '@chakra-ui/react';
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
  } from '@chakra-ui/react';
  
  interface Section {
    id: number,
    name: string,
    followers: number,
    posts: number,
    description: string,
    picture: string
  }

  export default function LargeSection({section}: {section: Section}) {
    return (
      <Center>
        <Box
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
          <Image
            h={'240px'}
            w={'full'}
            src={
              section.picture
            }
            objectFit={'cover'}
            alt="section_picture"
          />
  
          <Stack px={48} py={6} spacing={4}>
            <Stack spacing={0} align={'center'} mb={1}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {section.name}
              </Heading>
              {/* <Text color={'gray.500'}>Frontend Developer</Text> */}
            </Stack>
  
            <Stack direction={'row'} justify={'center'} spacing={6} >
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
            <Divider/>
            <Text >
                rem eveniet architecto quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto
            </Text>
            <HStack justify={'space-around'}>
                <Box>
                    <Button
                        w={'full'}
                        mt={2}
                        color={'white'}
                        rounded={'md'}
                        colorScheme={'teal'}
                    >
                        Create Post
                    </Button>
                </Box>
                <Box>
                    <Button
                        w={'full'}
                        mt={2}
                        color={'white'}
                        rounded={'md'}
                        colorScheme={'teal'}
                    >
                        View Posts
                    </Button>
                </Box>
                <Box>
                    <Button
                        w={'full'}
                        mt={2}
                        color={'white'}
                        rounded={'md'}
                        colorScheme={'teal'}
                    >
                        View Definition
                    </Button>
                </Box>
                
                
            </HStack >
            
          </Stack>
        </Box>
      </Center>
    );
  }