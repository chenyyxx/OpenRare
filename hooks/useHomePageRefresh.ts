import { useState, useCallback } from "react";
import { mutate } from "swr";
import { TabType } from "../components/TabNavigation";

interface UseHomePageRefreshProps {
  email?: string;
  activeTab: TabType;
  onRefreshStart?: () => void;
  onRefreshComplete?: () => void;
  onRefreshError?: (error: Error) => void;
}

interface UseHomePageRefreshReturn {
  isRefreshing: boolean;
  refreshCurrentTab: () => Promise<void>;
  refreshAllTabs: () => Promise<void>;
  error: string | null;
}

/**
 * Custom hook for handling refresh functionality on the home page
 * Integrates with SWR to revalidate data for the current tab or all tabs
 */
export function useHomePageRefresh({
  email,
  activeTab,
  onRefreshStart,
  onRefreshComplete,
  onRefreshError,
}: UseHomePageRefreshProps): UseHomePageRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map tabs to their corresponding API endpoints
  const getTabEndpoint = useCallback((tab: TabType): string | null => {
    if (!email) return null;
    
    switch (tab) {
      case 'following':
        return `/api/get_user_diseases_posts?email=${email}`;
      case 'myPosts':
        return `/api/get_user_posts?email=${email}`;
      case 'myComments':
        return `/api/get_user_comments?email=${email}`;
      case 'replies':
        return `/api/get_user_replies?email=${email}`;
      default:
        return null;
    }
  }, [email]);

  // Get all tab endpoints
  const getAllEndpoints = useCallback((): string[] => {
    if (!email) return [];
    
    return [
      `/api/get_user_diseases_posts?email=${email}`,
      `/api/get_user_posts?email=${email}`,
      `/api/get_user_comments?email=${email}`,
      `/api/get_user_favorites?email=${email}`,
      `/api/get_user_replies?email=${email}`,
    ];
  }, [email]);

  // Refresh current active tab
  const refreshCurrentTab = useCallback(async (): Promise<void> => {
    if (isRefreshing) return;

    const endpoint = getTabEndpoint(activeTab);
    if (!endpoint) {
      setError("Unable to refresh: user not authenticated");
      return;
    }

    setIsRefreshing(true);
    setError(null);
    onRefreshStart?.();

    try {
      // Use SWR's mutate to revalidate the current tab's data
      await mutate(endpoint);
      onRefreshComplete?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh content";
      setError(errorMessage);
      onRefreshError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsRefreshing(false);
    }
  }, [activeTab, isRefreshing, getTabEndpoint, onRefreshStart, onRefreshComplete, onRefreshError]);

  // Refresh all tabs
  const refreshAllTabs = useCallback(async (): Promise<void> => {
    if (isRefreshing) return;

    const endpoints = getAllEndpoints();
    if (endpoints.length === 0) {
      setError("Unable to refresh: user not authenticated");
      return;
    }

    setIsRefreshing(true);
    setError(null);
    onRefreshStart?.();

    try {
      // Refresh all endpoints in parallel
      await Promise.all(endpoints.map(endpoint => mutate(endpoint)));
      onRefreshComplete?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh content";
      setError(errorMessage);
      onRefreshError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, getAllEndpoints, onRefreshStart, onRefreshComplete, onRefreshError]);

  return {
    isRefreshing,
    refreshCurrentTab,
    refreshAllTabs,
    error,
  };
}

/**
 * Simplified version for basic refresh functionality
 */
export function useSimpleRefresh(email?: string, activeTab?: TabType) {
  return useHomePageRefresh({
    email,
    activeTab: activeTab || 'following',
  });
}

/**
 * Enhanced version with toast notifications
 */
export function useHomePageRefreshWithToast({
  email,
  activeTab,
  showToast,
}: UseHomePageRefreshProps & {
  showToast?: (message: string, status: 'success' | 'error' | 'info') => void;
}) {
  return useHomePageRefresh({
    email,
    activeTab,
    onRefreshStart: () => {
      showToast?.("Refreshing content...", 'info');
    },
    onRefreshComplete: () => {
      showToast?.("Content refreshed successfully", 'success');
    },
    onRefreshError: (error) => {
      showToast?.(`Failed to refresh: ${error.message}`, 'error');
    },
  });
}