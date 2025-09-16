import React from "react";
import { VStack } from "@chakra-ui/react";
import HomePageHeader from "./HomePageHeader";
import { TabType } from "./TabNavigation";

interface HomePageHeaderWrapperProps {
  activeTab: TabType;
  children: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  enableIntegratedRefresh?: boolean;
}

/**
 * Wrapper component that combines HomePageHeader with content
 * Provides a clean integration point for existing pages
 */
export default function HomePageHeaderWrapper({
  activeTab,
  children,
  onRefresh,
  isRefreshing,
  enableIntegratedRefresh = true,
}: HomePageHeaderWrapperProps) {
  return (
    <VStack spacing={6} align="stretch" w="full">
      <HomePageHeader
        activeTab={activeTab}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        enableIntegratedRefresh={enableIntegratedRefresh}
      />
      {children}
    </VStack>
  );
}

/**
 * Simple version for basic usage
 */
export function SimpleHomePageHeaderWrapper({
  children,
  activeTab = 'following',
}: {
  children: React.ReactNode;
  activeTab?: TabType;
}) {
  return (
    <HomePageHeaderWrapper
      activeTab={activeTab}
      enableIntegratedRefresh={true}
    >
      {children}
    </HomePageHeaderWrapper>
  );
}