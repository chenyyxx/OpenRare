import { useState, useMemo, useCallback, useEffect } from "react";
import { FullPost } from "../components/post";
import { FilterState, Disease, Theme } from "../components/SearchAndFilter";
import {
  filterPosts,
  extractUniqueDiseases,
  extractUniqueThemes,
  createEmptyFilters,
  hasActiveFilters,
  countActiveFilters,
} from "../utils/filterUtils";

interface UsePostFiltersProps {
  posts: FullPost[];
  initialFilters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
}

interface UsePostFiltersReturn {
  // Filtered data
  filteredPosts: FullPost[];
  
  // Filter state
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  
  // Filter options
  availableDiseases: Disease[];
  availableThemes: Theme[];
  
  // Filter status
  hasActiveFilters: boolean;
  activeFilterCount: number;
  
  // Performance metrics
  totalPosts: number;
  filteredCount: number;
  
  // Utility functions
  updateSearch: (search: string) => void;
  updateDiseaseFilter: (diseaseId: string | null) => void;
  updateThemeFilter: (themeId: string | null) => void;
}

/**
 * Custom hook for managing post filtering functionality
 * Provides efficient filtering with memoization and debouncing
 */
export function usePostFilters({
  posts,
  initialFilters = createEmptyFilters(),
  onFiltersChange,
}: UsePostFiltersProps): UsePostFiltersReturn {
  const [filters, setFiltersState] = useState<FilterState>(initialFilters);

  // Memoized filtered posts - only recalculates when posts or filters change
  const filteredPosts = useMemo(() => {
    if (!posts || posts.length === 0) {
      return [];
    }
    
    return filterPosts(posts, filters);
  }, [posts, filters]);

  // Memoized available diseases - extracted from current posts
  const availableDiseases = useMemo(() => {
    return extractUniqueDiseases(posts);
  }, [posts]);

  // Memoized available themes - extracted from current posts
  const availableThemes = useMemo(() => {
    return extractUniqueThemes(posts);
  }, [posts]);

  // Filter status
  const hasActiveFiltersValue = useMemo(() => {
    return hasActiveFilters(filters);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);

  // Performance metrics
  const totalPosts = posts?.length || 0;
  const filteredCount = filteredPosts.length;

  // Update filters with callback
  const setFilters = useCallback((newFilters: FilterState) => {
    setFiltersState(newFilters);
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const emptyFilters = createEmptyFilters();
    setFilters(emptyFilters);
  }, [setFilters]);

  // Individual filter update functions
  const updateSearch = useCallback((search: string) => {
    setFilters({ ...filters, search });
  }, [filters, setFilters]);

  const updateDiseaseFilter = useCallback((diseaseId: string | null) => {
    setFilters({ ...filters, diseaseId });
  }, [filters, setFilters]);

  const updateThemeFilter = useCallback((themeId: string | null) => {
    setFilters({ ...filters, themeId });
  }, [filters, setFilters]);

  // Sync with external filter changes
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(initialFilters)) {
      setFiltersState(initialFilters);
    }
  }, [initialFilters]); // Only depend on initialFilters, not filters to avoid infinite loop

  return {
    // Filtered data
    filteredPosts,
    
    // Filter state
    filters,
    setFilters,
    clearFilters,
    
    // Filter options
    availableDiseases,
    availableThemes,
    
    // Filter status
    hasActiveFilters: hasActiveFiltersValue,
    activeFilterCount,
    
    // Performance metrics
    totalPosts,
    filteredCount,
    
    // Utility functions
    updateSearch,
    updateDiseaseFilter,
    updateThemeFilter,
  };
}

/**
 * Hook for managing search debouncing
 * Separate from main filter hook for better performance
 */
export function useSearchDebounce(
  callback: (searchTerm: string) => void,
  delay: number = 300
) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((searchTerm: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      callback(searchTerm);
    }, delay);

    setDebounceTimer(timer);
  }, [callback, delay, debounceTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

/**
 * Hook for managing filter persistence
 * Can be used to save/restore filters from localStorage or URL params
 */
export function useFilterPersistence(
  key: string,
  defaultFilters: FilterState = createEmptyFilters()
) {
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') {
      return defaultFilters;
    }

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate the parsed data
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          typeof parsed.search === 'string' &&
          (parsed.diseaseId === null || typeof parsed.diseaseId === 'string') &&
          (parsed.themeId === null || typeof parsed.themeId === 'string')
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load filters from localStorage:', error);
    }

    return defaultFilters;
  });

  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(newFilters));
      } catch (error) {
        console.warn('Failed to save filters to localStorage:', error);
      }
    }
  }, [key]);

  const clearPersistedFilters = useCallback(() => {
    const emptyFilters = createEmptyFilters();
    updateFilters(emptyFilters);
  }, [updateFilters]);

  return {
    filters,
    updateFilters,
    clearPersistedFilters,
  };
}