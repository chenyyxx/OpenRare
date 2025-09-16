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
  FiCompass,
  FiMenu,
  FiChevronDown,
  FiSettings,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import { TbDna2 } from "react-icons/tb";
import { IoCreateOutline } from "react-icons/io5";
import { IconType } from "react-icons";
import { ReactText } from "react";
import AuthRequiredAlert from "./AuthRequiredAlert";
import { MODERN_PALETTE, TYPOGRAPHY } from "../utils/theme-constants";

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
    <Box minH="100vh" bg="transparent">
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
      <Box ml={{ base: 0, md: 72 }} p={{ base: "2px", md: "0px" }}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { data: session } = useSession();
  const settingsBorderColor = useColorModeValue("gray.200", "gray.700");
  
  return (
    <Box
      transition="0.3s ease"
      bg="white"
      border="1px"
      borderColor={MODERN_PALETTE.neutral[200]}
      w={{ base: "full", md: 64 }}
      pos="fixed"
      h={{ base: "calc(100vh - 16px)", md: "calc(100vh - 32px)" }}
      top={{ base: 2, md: 4 }}
      left={{ base: 2, md: 4 }}
      right={{ base: 2, md: "auto" }}
      rounded={{ base: "lg", md: "2xl" }}
      boxShadow="xl"
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
        borderBottomColor={MODERN_PALETTE.neutral[200]}
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
          rounded="full"
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
        
        {/* Settings at bottom - only show when logged in */}
        {session?.user?.email && (
          <Box 
            borderTop="1px" 
            borderTopColor={settingsBorderColor}
            pt="4"
            mt="4"
          >
            <NavItem link="/edit_profile" icon={FiSettings}>
              Settings
            </NavItem>
          </Box>
        )}
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
  const { data: session } = useSession();
  const [showAuthAlert, setShowAuthAlert] = React.useState(false);
  const textColor = useColorModeValue(MODERN_PALETTE.neutral[700], "gray.200");
  const hoverBg = useColorModeValue(MODERN_PALETTE.primary[50], "teal.900");
  const hoverColor = useColorModeValue(MODERN_PALETTE.primary[700], "teal.200");
  const iconHoverColor = useColorModeValue(MODERN_PALETTE.primary[600], "teal.300");

  const handleClick = (e: React.MouseEvent) => {
    // Check if this is the Home link and user is not authenticated
    if (link === "/home" && !session?.user?.email) {
      e.preventDefault();
      setShowAuthAlert(true);
      return;
    }
    // For other links, allow normal navigation
  };

  return (
    <>
      <Link
        href={link}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
        onClick={handleClick}
      >
        <Flex
          align="center"
          p="3"
          borderRadius="xl"
          role="group"
          cursor="pointer"
          transition="all 0.2s"
          color={textColor}
          _hover={{
            bg: hoverBg,
            color: hoverColor,
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
                color: iconHoverColor,
              }}
              as={icon}
            />
          )}
          <Text fontSize={TYPOGRAPHY.fontSize.md} fontWeight="600">
            {children}
          </Text>
        </Flex>
      </Link>
      
      {/* Authentication Alert for Home link */}
      {showAuthAlert && (
        <AuthRequiredAlert 
          action="access your personalized home page" 
          isOpen={showAuthAlert}
          onClose={() => setShowAuthAlert(false)}
        />
      )}
    </>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { data: session } = useSession();
  const [showAuthAlert, setShowAuthAlert] = React.useState(false);
  
  // Move all useColorModeValue calls to top level
  const navBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const boxShadow = useColorModeValue("sm", "dark-lg");
  const menuBg = useColorModeValue("white", "gray.900");
  const menuBorderColor = useColorModeValue("gray.200", "gray.700");
  const settingsHoverBg = useColorModeValue("gray.50", "gray.700");
  const signOutHoverBg = useColorModeValue("red.50", "red.900");
  const signOutHoverColor = useColorModeValue("red.600", "red.200");
  const signInHoverBg = useColorModeValue("teal.50", "teal.900");
  const signInHoverColor = useColorModeValue("teal.600", "teal.200");

  return (
    <Flex
      ml={{ base: 2, md: 72 }}
      mr={{ base: 2, md: 4 }}
      px={{ base: 4, md: 6 }}
      height="20"
      alignItems="center"
      as="header"
      pos="fixed"
      w={{ base: "calc(100% - 16px)", md: "calc(100% - 288px)" }}
      top={{ base: 2, md: 4 }}
      zIndex={200}
      bg={navBg}
      border="1px"
      borderColor={borderColor}
      rounded={{ base: "lg", md: "2xl" }}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      boxShadow={boxShadow}
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
          rounded="full"
          fontSize="sm"
          fontWeight="500"
          _hover={{
            transform: "translateY(-1px)",
            shadow: "md"
          }}
          onClick={() => {
            if (!session) {
              setShowAuthAlert(true);
            } else {
              window.location.href = '/create_post';
            }
          }}
        >
          New Post
        </Button>
        <IconButton
          icon={<IoCreateOutline />}
          display={{ base: "flex", md: "none" }}
          colorScheme="teal"
          variant="solid"
          rounded="full"
          aria-label="create new post"
          size="md"
          _hover={{
            transform: "translateY(-1px)",
            shadow: "lg"
          }}
          onClick={() => {
            if (!session) {
              setShowAuthAlert(true);
            } else {
              window.location.href = '/create_post';
            }
          }}
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
                    <Text fontSize={TYPOGRAPHY.fontSize.sm} fontWeight="medium" color={MODERN_PALETTE.neutral[700]}>
                      {session.user.email}
                    </Text>
                  ) : (
                    <Text fontSize={TYPOGRAPHY.fontSize.sm} color={MODERN_PALETTE.neutral[500]}>
                      Not Signed In
                    </Text>
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
              bg={menuBg}
              borderColor={menuBorderColor}
              boxShadow="lg"
              rounded="xl"
              py="2"
            >
              {/* Only show Settings when logged in */}
              {session?.user?.email && (
                <>
                  <MenuItem 
                    as="a" 
                    href="/edit_profile"
                    rounded="lg"
                    mx="2"
                    _hover={{
                      bg: settingsHoverBg,
                    }}
                  >
                    <HStack spacing="3">
                      <Icon as={FiSettings} />
                      <Text>Settings</Text>
                    </HStack>
                  </MenuItem>
                  <MenuDivider />
                </>
              )}
              {session ? (
                <MenuItem 
                  onClick={() => signOut()}
                  rounded="lg"
                  mx="2"
                  _hover={{
                    bg: signOutHoverBg,
                    color: signOutHoverColor,
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
                    bg: signInHoverBg,
                    color: signInHoverColor,
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
      
      {/* Authentication Alert */}
      {showAuthAlert && (
        <AuthRequiredAlert 
          action="create a post" 
          isOpen={showAuthAlert}
          onClose={() => setShowAuthAlert(false)}
        />
      )}
    </Flex>
  );
};
