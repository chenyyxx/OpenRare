import { useState, useCallback, useRef } from "react";
import { TabType } from "./TabNavigation";

interface UseTabTransitionProps {
  initialTab?: TabType;
  transitionDelay?: number;
}

interface TabState {
  activeTab: TabType;
  isTransitioning: boolean;
  previousTab: TabType | null;
}

export function useTabTransition({
  initialTab = 'following',
  transitionDelay = 150,
}: UseTabTransitionProps = {}) {
  const [tabState, setTabState] = useState<TabState>({
    activeTab: initialTab,
    isTransitioning: false,
    previousTab: null,
  });

  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  const changeTab = useCallback((newTab: TabType) => {
    if (newTab === tabState.activeTab) return;

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Start transition
    setTabState(prev => ({
      ...prev,
      isTransitioning: true,
      previousTab: prev.activeTab,
    }));

    // Complete transition after delay
    transitionTimeoutRef.current = setTimeout(() => {
      setTabState(prev => ({
        activeTab: newTab,
        isTransitioning: false,
        previousTab: prev.activeTab,
      }));
    }, transitionDelay);
  }, [tabState.activeTab, transitionDelay]);

  const resetTransition = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    setTabState(prev => ({
      ...prev,
      isTransitioning: false,
    }));
  }, []);

  return {
    activeTab: tabState.activeTab,
    isTransitioning: tabState.isTransitioning,
    previousTab: tabState.previousTab,
    changeTab,
    resetTransition,
  };
}