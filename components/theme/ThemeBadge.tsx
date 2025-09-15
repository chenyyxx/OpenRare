import React from "react";
import { Badge, HStack, Text, BadgeProps } from "@chakra-ui/react";
import { ThemeIcon } from "./ThemeIcon";
import { getThemeColor } from "../../utils/theme-constants";

interface ThemeBadgeProps extends Omit<BadgeProps, "children"> {
  themeName: string;
  showIcon?: boolean;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ThemeBadge: React.FC<ThemeBadgeProps> = ({
  themeName,
  showIcon = true,
  showText = true,
  size = "md",
  ...props
}) => {
  // Use local theme color constants
  const themeColor = getThemeColor(themeName);

  const sizeProps = {
    sm: { fontSize: "xs", px: 2, py: 1, iconSize: 3 },
    md: { fontSize: "sm", px: 3, py: 1, iconSize: 4 },
    lg: { fontSize: "md", px: 4, py: 2, iconSize: 5 },
  };

  const currentSize = sizeProps[size];

  return (
    <Badge
      bg={themeColor}
      color="white"
      borderRadius="full"
      fontSize={currentSize.fontSize}
      px={currentSize.px}
      py={currentSize.py}
      fontWeight="medium"
      {...props}
    >
      <HStack spacing={1} align="center">
        {showIcon && (
          <ThemeIcon themeName={themeName} boxSize={currentSize.iconSize} />
        )}
        {showText && <Text>{themeName}</Text>}
      </HStack>
    </Badge>
  );
};

export default ThemeBadge;
