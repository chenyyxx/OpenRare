import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'All Posts', icon: FiHome, link: '#' },
  { name: 'My Sections', icon: FiCompass, link: '#' },
  { name: 'Favorite', icon: FiTrendingUp, link: '#' },
  { name: 'Upvoted', icon: FiTrendingUp, link: '#' },
  { name: 'Comments', icon: FiSettings, link: '#' },
  { name: 'Messages', icon: FiSettings, link: '#' },
  { name: 'Notifications', icon: FiSettings, link: '#' },
];

// export default function LeftSideBar() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   return (
//     <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
//       <SidebarContent
//         onClose={() => onClose}
//         display={{ base: 'none', md: 'block' }}
//       />
//     </Box>
//   );
// }


export default function ProfileRightPanel() {
  return (
    <Box
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'none', md: 60 }}
        rounded={'md'}
        h="max"
        py={4}
        pos="sticky"
        top={"424px"}
    >
        {LinkItems.map((link) => (
            <NavItem key={link.name} link={link.link} icon={link.icon}>
                {link.name}
            </NavItem>
        ))}
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
    <Link href={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'teal',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

