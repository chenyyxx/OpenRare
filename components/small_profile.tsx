import {
    Heading,
    Avatar,
    Box,
    Center,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
    Divider,
    StackDivider,
    Link
  } from '@chakra-ui/react';
  
  export default function SmallProfile() {
    return (
      <Center>
        <Box
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          rounded={'md'}
          overflow={'hidden'}
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Image
            h={'180px'}
            w={'full'}
            src={
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
            }
            objectFit={'cover'}
            alt="small_profile"
          />
  
          <Box p={6}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                John Doe
              </Heading>
            </Stack>
            
            <Divider borderColor='gray.200' mb={5}/>
  
            <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack direction={'row'} spacing={4} align={'center'}>
                <Text fontWeight={600}>4</Text>
                <Divider orientation='vertical' borderColor='gray.200' />
                <Text fontSize={'sm'} color={'gray.500'}>
                  Followed Sections
                </Text>
              </Stack>
              <Button
                mt={8}
                rounded={'md'}
                colorScheme={'teal'}
                as={Link}
                href={"/profile"}
                style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}
              >
                Profile
              </Button>
            </Stack>
          </Box>
        </Box>
      </Center>
    );
  }