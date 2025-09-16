import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import HomePageHeader from '../../components/HomePageHeader';
import { TabType } from '../../components/TabNavigation';

// Mock SWR
jest.mock('swr', () => ({
  mutate: jest.fn(() => Promise.resolve()),
}));

// Mock next-auth
const mockSession = {
  user: {
    email: 'test@example.com',
  },
  expires: '2024-01-01',
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <ChakraProvider>
        {component}
      </ChakraProvider>
    </SessionProvider>
  );
};

describe('HomePageHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with title and description', () => {
    renderWithProviders(
      <HomePageHeader />
    );

    expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
    expect(screen.getByText(/Stay updated with content from your interests/)).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    renderWithProviders(
      <HomePageHeader />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh content/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const mockOnRefresh = jest.fn();
    
    renderWithProviders(
      <HomePageHeader onRefresh={mockOnRefresh} />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh content/i });
    fireEvent.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isRefreshing is true', () => {
    renderWithProviders(
      <HomePageHeader isRefreshing={true} />
    );

    // Should show spinner instead of refresh icon
    expect(screen.getByRole('button', { name: /refresh content/i })).toBeDisabled();
  });

  it('disables refresh button when refreshing', () => {
    renderWithProviders(
      <HomePageHeader isRefreshing={true} />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh content/i });
    expect(refreshButton).toBeDisabled();
  });

  it('works with different active tabs', () => {
    const activeTab: TabType = 'myPosts';
    
    renderWithProviders(
      <HomePageHeader activeTab={activeTab} />
    );

    expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
  });

  it('handles integrated refresh functionality', async () => {
    renderWithProviders(
      <HomePageHeader 
        activeTab="following" 
        enableIntegratedRefresh={true}
      />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh content/i });
    fireEvent.click(refreshButton);

    // Should not throw any errors
    await waitFor(() => {
      expect(refreshButton).not.toBeDisabled();
    });
  });

  it('renders responsively on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderWithProviders(
      <HomePageHeader />
    );

    expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh content/i })).toBeInTheDocument();
  });

  it('maintains accessibility standards', () => {
    renderWithProviders(
      <HomePageHeader />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh content/i });
    expect(refreshButton).toHaveAttribute('aria-label', 'Refresh content');
  });
});

describe('HomePageHeader Integration', () => {
  it('integrates with external refresh handlers', () => {
    const mockRefresh = jest.fn();
    
    renderWithProviders(
      <HomePageHeader 
        onRefresh={mockRefresh}
        isRefreshing={false}
        enableIntegratedRefresh={false}
      />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh content/i });
    fireEvent.click(refreshButton);

    expect(mockRefresh).toHaveBeenCalled();
  });

  it('handles missing session gracefully', () => {
    render(
      <SessionProvider session={null}>
        <ChakraProvider>
          <HomePageHeader enableIntegratedRefresh={true} />
        </ChakraProvider>
      </SessionProvider>
    );

    expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
  });
});