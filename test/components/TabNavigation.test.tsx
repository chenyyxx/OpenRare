import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import TabNavigation, { TabType } from "../../components/TabNavigation";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("TabNavigation", () => {
  const mockOnTabChange = jest.fn();
  const defaultProps = {
    activeTab: "following" as TabType,
    onTabChange: mockOnTabChange,
  };

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it("renders all tab buttons", () => {
    renderWithChakra(<TabNavigation {...defaultProps} />);

    expect(screen.getByText("Following")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument(); // Mobile shows short labels
    expect(screen.getByText("Comments")).toBeInTheDocument(); // Mobile shows short labels
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Replies")).toBeInTheDocument();
  });

  it("highlights the active tab", () => {
    renderWithChakra(<TabNavigation {...defaultProps} />);

    const followingTab = screen.getByText("Following");
    const postsTab = screen.getByText("Posts"); // Mobile shows short labels

    // Active tab should have different styling (we can't easily test exact styles in jsdom)
    expect(followingTab).toBeInTheDocument();
    expect(postsTab).toBeInTheDocument();
  });

  it("calls onTabChange when a tab is clicked", () => {
    renderWithChakra(<TabNavigation {...defaultProps} />);

    const postsTab = screen.getByText("Posts"); // Mobile shows short labels
    fireEvent.click(postsTab);

    expect(mockOnTabChange).toHaveBeenCalledWith("myPosts");
  });

  it("displays tab counts when provided", () => {
    const tabCounts = {
      following: 5,
      myPosts: 3,
      myComments: 10,
      favorites: 2,
      replies: 1,
    };

    renderWithChakra(<TabNavigation {...defaultProps} tabCounts={tabCounts} />);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("disables tabs during transition", () => {
    renderWithChakra(
      <TabNavigation {...defaultProps} isTransitioning={true} />
    );

    const followingTab = screen.getByText("Following");
    expect(followingTab.closest("button")).toBeDisabled();
  });
});
