import Image from 'next/image';
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
  Divider,
} from '@chakra-ui/react';

import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'

export default function Post() {
  return (
    <Center py={6}>
      <Box
        maxW={'1000px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        <HStack spacing='24px' divider={<StackDivider borderColor='gray.200' />}>
          <VStack w={'500px'} spacing={4} align={'center'}>
            <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
              <Avatar
                src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
              />
              <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                <Text fontWeight={600}>Achim Rolle</Text>
                <Text color={'gray.500'}>Feb 08, 2021 · 6min read</Text>
              </Stack>
              
            </Stack>
            <HStack spacing='24px' divider={<StackDivider borderColor='gray.200' />}>
              <HStack>
                <TriangleUpIcon color='teal.500' />
                <Text fontSize={'sm'} color={'gray.500'}>
                  688
                </Text>
              </HStack>
              <HStack>
                <TriangleDownIcon color='red.500' />
                <Text fontSize={'sm'} color={'gray.500'}>
                    23
                  </Text>
              </HStack>
            </HStack>
          </VStack>
          <Stack>
            <Text
              color={'green.500'}
              textTransform={'uppercase'}
              fontWeight={800}
              fontSize={'sm'}
              letterSpacing={1.1}>
              Blog
            </Text>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'2xl'}
              fontFamily={'body'}>
              Boost your conversion rate
            </Heading>
            <Text color={'gray.500'}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
              et ea rebum.
            </Text>
          </Stack>
          
        </HStack>
      </Box>
    </Center>
  );
}