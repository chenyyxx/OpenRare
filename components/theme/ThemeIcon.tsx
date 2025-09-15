import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';
import { FiUser, FiHeart, FiCalendar, FiBook } from 'react-icons/fi';

interface ThemeIconProps extends Omit<IconProps, 'as'> {
  themeName: string;
}

// This matches the exact same logic used in create_post.tsx
const getThemeIcon = (themeName: string) => {
  switch (themeName.toLowerCase()) {
    case "personal stories":
      return FiUser;
    case "help & support":
      return FiHeart;
    case "events":
      return FiCalendar;
    case "research & information":
      return FiBook;
    default:
      return FiUser;
  }
};

export const ThemeIcon: React.FC<ThemeIconProps> = ({ themeName, ...props }) => {
  const IconComponent = getThemeIcon(themeName);
  
  return <Icon as={IconComponent} {...props} />;
};

export default ThemeIcon;