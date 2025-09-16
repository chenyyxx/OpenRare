import {
    Heading,
    Box,
    Center,
    Text,
    Stack,
    useColorModeValue,
    Divider,
    Avatar,
  } from '@chakra-ui/react';
  
import {BiMessageAltDetail, BiUser} from "react-icons/bi";

import {FullRareDisease} from './rare_disease';

export default function SmallRareDisease({disease}: {disease: FullRareDisease}) {
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
                    <Stack direction={"row"} spacing={6} justify={'start'} align="center" p={2}>
                        <Avatar
                            size={'md'}
                            name={disease.name}
                            objectFit={'cover'}
                        />
                        <Heading fontSize={'sm'} fontWeight={500} fontFamily={'body'}>
                            {disease.name}
                        </Heading>
                    </Stack>

                    <Box p={2}>  
                        <Stack direction={'row'} justify={'center'} spacing={6}>
                            <Stack direction={'row'} spacing={4} align={'center'}>
                                <BiMessageAltDetail/>
                                <Text fontWeight={600}>{disease._count.posts}</Text>
                                <Divider orientation='vertical' borderColor='gray.200' />
                                <BiUser/>
                                <Text fontWeight={600}>{disease._count.users}</Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Center>
    );
}