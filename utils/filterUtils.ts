import { FullPost } from "../components/post";
import { FilterState } from "../components/SearchAndFilter";

/**
 * Filters posts based on search and filter criteria
 * Uses AND logic - posts must match all active filters
 */
export function filterPosts(posts: FullPost[], filters: FilterState): FullPost[] {
  if (!posts || posts.length === 0) {
    return [];
  }

  return posts.filter((post) => {
    // Search filter - case insensitive search in post title
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      if (!titleMatch) {
        return false;
      }
    }

    // Disease filter
    if (filters.diseaseId) {
      const diseaseIdMatch = post.disease?.id.toString() === filters.diseaseId;
      if (!diseaseIdMatch) {
        return false;
      }
    }

    // Theme filter
    if (filters.themeId) {
      const themeIdMatch = post.theme?.id === filters.themeId;
      if (!themeIdMatch) {
        return false;
      }
    }

    // If we get here, the post matches all active filters
    return true;
  });
}

/**
 * Extracts unique diseases from a list of posts
 * Useful for populating filter dropdowns
 */
export function extractUniqueDiseases(posts: FullPost[]): Array<{ id: number; name: string }> {
  if (!posts || posts.length === 0) {
    return [];
  }

  const diseaseMap = new Map<number, string>();
  
  posts.forEach((post) => {
    if (post.disease) {
      diseaseMap.set(post.disease.id, post.disease.name);
    }
  });

  return Array.from(diseaseMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extracts unique themes from a list of posts
 * Useful for populating filter dropdowns
 */
export function extractUniqueThemes(posts: FullPost[]): Array<{ id: string; name: string }> {
  if (!posts || posts.length === 0) {
    return [];
  }

  const themeMap = new Map<string, string>();
  
  posts.forEach((post) => {
    if (post.theme) {
      themeMap.set(post.theme.id, post.theme.name);
    }
  });

  return Array.from(themeMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Checks if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return !!(filters.search || filters.diseaseId || filters.themeId);
}

/**
 * Counts the number of active filters
 */
export function countActiveFilters(filters: FilterState): number {
  return [filters.search, filters.diseaseId, filters.themeId].filter(Boolean).length;
}

/**
 * Creates an empty filter state
 */
export function createEmptyFilters(): FilterState {
  return {
    search: "",
    diseaseId: null,
    themeId: null,
  };
}

/**
 * Debounced search function factory
 * Returns a function that will debounce search calls
 */
export function createDebouncedSearch(
  callback: (searchTerm: string) => void,
  delay: number = 300
): (searchTerm: string) => void {
  let timeoutId: NodeJS.Timeout;

  return (searchTerm: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(searchTerm);
    }, delay);
  };
}

/**
 * Validates filter state
 */
export function validateFilters(filters: FilterState): boolean {
  // Basic validation - ensure filters object has required properties
  return (
    typeof filters === 'object' &&
    filters !== null &&
    typeof filters.search === 'string' &&
    (filters.diseaseId === null || typeof filters.diseaseId === 'string') &&
    (filters.themeId === null || typeof filters.themeId === 'string')
  );
}