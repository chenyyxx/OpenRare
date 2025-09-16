import React, { useState, useEffect, useMemo } from "react";
import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import SearchAndFilter, { FilterState, Disease, Theme } from "./SearchAndFilter";
import FollowedDiseasesTags, { FollowedDisease } from "./FollowedDiseasesTags";
import { FullPost } from "./post";
import { TabType } from "./TabNavigation";
import { usePostFilters } from "../hooks/usePostFilters";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetchData } from "../utils/utils";

interface FilterablePostTabsProps {
  activeTab: TabType;
  posts: FullPost[];
  isLoading: boolean;
  onFilteredPostsChange: (filteredPosts: FullPost[]) => void;
  children: React.ReactNode;
}

// Tabs that support filtering (post-based tabs only)
const FILTERABLE_TABS: TabType[] = ['following', 'myPosts', 'favorites'];

/**
 * Component that wraps post tabs with search and filter functionality
 * Only shows filters for post-based tabs (Following, My Posts, Favorites)
 * Automatically resets filters when switching between tabs
 */
export default function FilterablePostTabs({
  activeTab,
  posts,
  isLoading,
  onFilteredPostsChange,
  children,
}: FilterablePostTabsProps) {
  const { data: session } = useSession();
  
  // Track filters per tab to maintain separate filter states
  const [tabFilters, setTabFilters] = useState<Record<TabType, FilterState>>({
    following: { search: "", diseaseId: null, themeId: null },
    myPosts: { search: "", diseaseId: null, themeId: null },
    myComments: { search: "", diseaseId: null, themeId: null },
    favorites: { search: "", diseaseId: null, themeId: null },
    replies: { search: "", diseaseId: null, themeId: null },
  });

  // Track selected disease for Following tab disease tags
  const [selectedDisease, setSelectedDisease] = useState<number | null>(null);

  // Get current tab's filters
  const currentFilters = tabFilters[activeTab];

  // Check if current tab supports filtering
  const isFilterableTab = FILTERABLE_TABS.includes(activeTab);

  // Fetch all diseases and themes for filter dropdowns
  const { data: allDiseases } = useSWR<Disease[]>('/api/get_all_diseases', fetchData);
  const { data: allThemes } = useSWR<Theme[]>('/api/get_themes_with_posts', fetchData);
  
  // Fetch user's followed diseases for Following tab
  const { data: followedDiseases, isLoading: diseasesLoading } = useSWR<FollowedDisease[]>(
    session?.user?.email ? `/api/get_user_diseases?email=${session.user.email}` : null,
    fetchData
  );

  // Use the post filters hook
  const {
    filteredPosts,
    availableDiseases,
    availableThemes,
    hasActiveFilters,
    activeFilterCount,
    totalPosts,
    filteredCount,
  } = usePostFilters({
    posts: isFilterableTab ? posts : [],
    initialFilters: currentFilters,
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setTabFilters(prev => ({
      ...prev,
      [activeTab]: newFilters,
    }));
  };

  // Handle disease tag selection for Following tab
  const handleDiseaseTagClick = (diseaseId: number | null) => {
    setSelectedDisease(diseaseId);
    
    // Update the filter state to include the selected disease
    const newFilters = {
      ...currentFilters,
      diseaseId: diseaseId ? String(diseaseId) : null,
    };
    
    handleFiltersChange(newFilters);
  };

  // Update parent component with filtered posts
  useEffect(() => {
    if (isFilterableTab) {
      onFilteredPostsChange(filteredPosts);
    } else {
      // For non-filterable tabs, pass through original posts
      onFilteredPostsChange(posts);
    }
  }, [filteredPosts, posts, isFilterableTab, onFilteredPostsChange]);

  // Reset filters when switching to a non-filterable tab
  useEffect(() => {
    if (!isFilterableTab) {
      onFilteredPostsChange(posts);
    }
  }, [activeTab, isFilterableTab, posts, onFilteredPostsChange]);

  // Reset selected disease when switching away from Following tab
  useEffect(() => {
    if (activeTab !== 'following') {
      setSelectedDisease(null);
    }
  }, [activeTab]);

  // Prepare filter options - use all available options or extracted from current posts
  const filterDiseases = useMemo(() => {
    if (allDiseases) {
      return allDiseases.map(d => ({ id: d.id, name: d.name }));
    }
    return availableDiseases;
  }, [allDiseases, availableDiseases]);

  const filterThemes = useMemo(() => {
    if (allThemes) {
      return allThemes.map(t => ({ id: t.id, name: t.name }));
    }
    return availableThemes;
  }, [allThemes, availableThemes]);

  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <VStack spacing={6} align="stretch">
      {/* Show followed diseases tags for Following tab */}
      {activeTab === 'following' && (
        <FollowedDiseasesTags
          diseases={followedDiseases || []}
          onDiseaseClick={handleDiseaseTagClick}
          selectedDisease={selectedDisease}
          isLoading={diseasesLoading}
        />
      )}

      {/* Show search and filter only for filterable tabs */}
      {isFilterableTab && (
        <Box>
          <SearchAndFilter
            onFiltersChange={handleFiltersChange}
            availableDiseases={filterDiseases}
            availableThemes={filterThemes}
            currentFilters={currentFilters}
            isLoading={isLoading}
          />
          
          {/* Filter results summary */}
          {hasActiveFilters && !isLoading && (
            <Box mt={2} px={2}>
              <Text fontSize="sm" color={textColor}>
                Showing {filteredCount} of {totalPosts} posts
                {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Tab content */}
      <Box>
        {children}
      </Box>
    </VStack>
  );
}

/**
 * Hook for managing filterable post tabs
 * Provides state management and utilities for components using FilterablePostTabs
 */
export function useFilterablePostTabs(initialTab: TabType = 'following') {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [filteredPosts, setFilteredPosts] = useState<FullPost[]>([]);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    // Clear filtered posts when changing tabs - they'll be updated by FilterablePostTabs
    setFilteredPosts([]);
  };

  const handleFilteredPostsChange = (posts: FullPost[]) => {
    setFilteredPosts(posts);
  };

  const isFilterableTab = FILTERABLE_TABS.includes(activeTab);

  return {
    activeTab,
    filteredPosts,
    isFilterableTab,
    handleTabChange,
    handleFilteredPostsChange,
  };
}

/**
 * Utility function to check if a tab supports filtering
 */
export function isTabFilterable(tab: TabType): boolean {
  return FILTERABLE_TABS.includes(tab);
}

/**
 * Utility function to get the display name for filter results
 */
export function getFilterResultsText(
  filteredCount: number,
  totalCount: number,
  activeFilterCount: number
): string {
  if (activeFilterCount === 0) {
    return `Showing all ${totalCount} posts`;
  }
  
  const filterText = activeFilterCount === 1 ? 'filter' : 'filters';
  return `Showing ${filteredCount} of ${totalCount} posts (${activeFilterCount} ${filterText} active)`;
}