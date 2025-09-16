import React, { ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  Button,
} from "@chakra-ui/react";
import {
  FiHome,
  FiList,
  FiCompass,
  FiUser,
  FiMenu,
  FiChevronDown,
  FiPlusSquare,
  FiSettings,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import { TbDna2 } from "react-icons/tb";
import { IoCreateOutline } from "react-icons/io5";
import { IconType } from "react-icons";
import { ReactText } from "react";

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, link: "/home" },
  { name: "Explore", icon: FiCompass, link: "/" },
  { name: "Rare Diseases", icon: TbDna2, link: "/rare-diseases" },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        zIndex={201}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 64 }} p="0px">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="0.3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 64 }}
      pos="fixed"
      h="full"
      boxShadow={useColorModeValue("lg", "dark-lg")}
      display="flex"
      flexDirection="column"
      {...rest}
    >
      {/* Logo Section */}
      <Flex 
        h="20" 
        alignItems="center" 
        mx="6" 
        justifyContent="space-between"
        borderBottom="1px"
        borderBottomColor={useColorModeValue("gray.100", "gray.700")}
        mb="4"
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/OpenRare-logos_transparent.png?alt=media&token=5364c0e6-1493-440a-a082-f2ff1e302484"
          width="256px"
          height="64px"
          objectFit="cover"
          alt="OpenRare Logo"
        />
        <CloseButton 
          display={{ base: "flex", md: "none" }} 
          onClick={onClose}
          size="sm"
          rounded="md"
        />
      </Flex>

      {/* Navigation Items */}
      <VStack spacing="2" align="stretch" px="4" flex="1">
        {LinkItems.map((link) => (
          <NavItem key={link.name} link={link.link} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
        
        {/* Spacer to push settings to bottom */}
        <Box flex="1" />
        
        {/* Settings at bottom */}
        <Box 
          borderTop="1px" 
          borderTopColor={useColorModeValue("gray.200", "gray.700")}
          pt="4"
          mt="4"
        >
          <NavItem link="/edit_profile" icon={FiSettings}>
            Settings
          </NavItem>
        </Box>
      </VStack>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  link: string;
  children: ReactText;
}
const NavItem = ({ icon, link, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href={link}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="3"
        borderRadius="xl"
        role="group"
        cursor="pointer"
        transition="all 0.2s"
        color={useColorModeValue("gray.700", "gray.200")}
        _hover={{
          bg: useColorModeValue("teal.50", "teal.900"),
          color: useColorModeValue("teal.700", "teal.200"),
          transform: "translateX(2px)",
          shadow: "sm",
        }}
        _active={{
          transform: "translateX(0px)",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="18"
            _groupHover={{
              color: useColorModeValue("teal.600", "teal.300"),
            }}
            as={icon}
          />
        )}
        <Text fontSize="sm" fontWeight="500">
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { data: session } = useSession();
  return (
    <Flex
      ml={{ base: 0, md: 64 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      as="header"
      pos="fixed"
      w="100%"
      right="0"
      zIndex={200}
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      boxShadow={useColorModeValue("sm", "dark-lg")}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Image
        display={{ base: "flex", md: "none" }}
        src="https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/OpenRare-logos_transparent.png?alt=media&token=5364c0e6-1493-440a-a082-f2ff1e302484"
        width="256px"
        height="64px"
        objectFit="cover"
        alt="OpenRare Logo"
      />

      <HStack spacing={{ base: "3", md: "6" }}>
        {/* TODO: Move the create post button sticky on top below the nav bar */}
        <Button
          leftIcon={<IoCreateOutline />}
          display={{ base: "none", md: "flex" }}
          colorScheme="teal"
          variant="solid"
          as={"a"}
          href={`/create_post`}
        >
          New
        </Button>
        <IconButton
          icon={<IoCreateOutline />}
          display={{ base: "flex", md: "none" }}
          colorScheme="teal"
          variant="solid"
          rounded={"3xl"}
          aria-label="create new post"
          as={"a"}
          size="sm"
          href={`/create_post`}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                {session ? (
                  <Avatar
                    size={"sm"}
                    name={session.user.email}
                    // src={
                    // 'https://images.user.profile'
                    // } // user upload photo
                  />
                ) : (
                  <Avatar size={"sm"} />
                )}
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  {session ? (
                    <Text fontSize="sm">{session.user.email}</Text>
                  ) : (
                    <Text fontSize="sm">Not Signed In</Text>
                  )}
                  {/* <Text fontSize="xs" color="gray.600">
                                    Admin
                                    </Text> */}
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              boxShadow="lg"
              rounded="xl"
              py="2"
            >
              <MenuItem 
                as="a" 
                href="/edit_profile"
                rounded="lg"
                mx="2"
                _hover={{
                  bg: useColorModeValue("gray.50", "gray.700"),
                }}
              >
                <HStack spacing="3">
                  <Icon as={FiSettings} />
                  <Text>Settings</Text>
                </HStack>
              </MenuItem>
              <MenuDivider />
              {session ? (
                <MenuItem 
                  onClick={() => signOut()}
                  rounded="lg"
                  mx="2"
                  _hover={{
                    bg: useColorModeValue("red.50", "red.900"),
                    color: useColorModeValue("red.600", "red.200"),
                  }}
                >
                  <HStack spacing="3">
                    <Icon as={FiLogOut} />
                    <Text>Sign Out</Text>
                  </HStack>
                </MenuItem>
              ) : (
                <MenuItem 
                  onClick={() => signIn()}
                  rounded="lg"
                  mx="2"
                  _hover={{
                    bg: useColorModeValue("teal.50", "teal.900"),
                    color: useColorModeValue("teal.600", "teal.200"),
                  }}
                >
                  <HStack spacing="3">
                    <Icon as={FiLogIn} />
                    <Text>Sign In / Sign Up</Text>
                  </HStack>
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
