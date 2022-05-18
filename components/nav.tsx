import { useSession, signIn, signOut } from "next-auth/react"
import { ReactNode } from 'react';
import {
    Text,
    Box,
    VStack,
    Avatar,
    HStack,
    Link,
    Grid, 
    GridItem,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack, 
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Flex
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { IoNotificationsOutline } from "react-icons/io5";
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi';


const Links = ['Dashboard', 'Projects', 'Team'];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('white', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);

export default function Nav() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: session } = useSession();
    return (
        <Box bg='white' px={4} pos="fixed" w="100%" zIndex={200}>
                    
            <Grid h={16} templateColumns='repeat(3, 1fr)' gap={6}>
                <GridItem display='flex' alignItems='center' justifyContent='start'>
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>OpenRare</Box>
                    </HStack>
                </GridItem >
                <GridItem display='flex' alignItems='center' justifyContent='center'>
                    <InputGroup w={600} size='md'>
                        <Input
                            pr='4.5rem'
                            placeholder='Search Forum'
                        />
                        <InputRightElement width='4.5rem'>
                            <IconButton
                                variant='link'
                                aria-label='search'
                                colorScheme={'gray.100'}
                                icon={<SearchIcon />}
                            />
                        </InputRightElement>
                    </InputGroup>
                </GridItem >
                <GridItem display='flex' alignItems='center' justifyContent='end'>
                    <HStack  spacing={7}>
                        <IconButton
                            variant='link'
                            aria-label='notification button'
                            colorScheme={'gray.100'}
                            icon={<IoNotificationsOutline />}
                        />
                        
                        <Menu>
                            <MenuButton
                                py={2}
                                transition="all 0.3s"
                                _focus={{ boxShadow: 'none' }}>
                                <HStack>
                                {
                                    session ?
                                    <Avatar
                                    size={'sm'}
                                    name={session.user.email}
                                    // src={
                                        // 'https://images.user.profile'
                                    // } // user upload photo
                                    /> :
                                    <Avatar
                                    size={'sm'}
                                />
                
                                }
                                
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    {session ? 
                                    <Text fontSize="sm">{session.user.email}</Text> :
                                    <Text fontSize="sm">Not Signed In</Text>
                                    }
                                    {/* <Text fontSize="xs" color="gray.600">
                                    Admin
                                    </Text> */}
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                                </HStack>
                            </MenuButton>
                            <MenuList
                                bg={useColorModeValue('white', 'gray.900')}
                                borderColor={useColorModeValue('gray.200', 'gray.700')}
                            >
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>Settings</MenuItem>
                                <MenuItem>Billing</MenuItem>
                                <MenuDivider />
                                {
                                    session ?
                                    <MenuItem onClick={() => signOut()}>Sign Out</MenuItem> :
                                    <MenuItem onClick={() => signIn()}>Sign In / Sign Up</MenuItem>
                                }
                            </MenuList>
                        </Menu>
                    </HStack>
                </GridItem >
            </Grid>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                <Stack as={'nav'} spacing={4}>
                    {Links.map((link) => (
                    <NavLink key={link}>{link}</NavLink>
                    ))}
                </Stack>
                </Box>
            ) : null}
        </Box>
    );
}