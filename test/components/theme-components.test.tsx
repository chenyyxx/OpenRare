import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeIcon, ThemeBadge, ThemeCard, getThemeColor } from '../../components/theme';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  );
};

describe('Theme Components', () => {
  describe('ThemeIcon', () => {
    it('renders theme icon for Personal Stories', () => {
      renderWithChakra(<ThemeIcon themeName="Personal Stories" data-testid="theme-icon" />);
      expect(screen.getByTestId('theme-icon')).toBeTruthy();
    });

    it('renders theme icon for Help & Support', () => {
      renderWithChakra(<ThemeIcon themeName="Help & Support" data-testid="theme-icon" />);
      expect(screen.getByTestId('theme-icon')).toBeTruthy();
    });

    it('renders theme icon for Events', () => {
      renderWithChakra(<ThemeIcon themeName="Events" data-testid="theme-icon" />);
      expect(screen.getByTestId('theme-icon')).toBeTruthy();
    });

    it('renders theme icon for Research & Information', () => {
      renderWithChakra(<ThemeIcon themeName="Research & Information" data-testid="theme-icon" />);
      expect(screen.getByTestId('theme-icon')).toBeTruthy();
    });
  });

  describe('ThemeBadge', () => {
    it('renders theme badge with icon and text', () => {
      renderWithChakra(
        <ThemeBadge themeName="Personal Stories" showIcon={true} showText={true} />
      );
      expect(screen.getByText('Personal Stories')).toBeTruthy();
    });

    it('renders theme badge with only icon', () => {
      renderWithChakra(
        <ThemeBadge themeName="Help & Support" showIcon={true} showText={false} />
      );
      // Should not show text
      expect(screen.queryByText('Help & Support')).toBeNull();
    });

    it('renders theme badge with only text', () => {
      renderWithChakra(
        <ThemeBadge themeName="Events" showIcon={false} showText={true} />
      );
      expect(screen.getByText('Events')).toBeTruthy();
    });


  });

  describe('ThemeCard', () => {
    const mockTheme = {
      id: 'personal-stories',
      name: 'Personal Stories',
      description: 'Share your journey and experiences',
      guidelines: 'A place for sharing personal experiences',
      postCount: 5
    };

    const mockRecentPosts = [
      { id: '1', title: 'My journey with rare disease', author: 'John' },
      { id: '2', title: 'Living with hope', author: 'Jane' }
    ];

    it('renders theme card with theme information', () => {
      renderWithChakra(
        <ThemeCard theme={mockTheme} recentPosts={mockRecentPosts} />
      );
      
      expect(screen.getByText('Personal Stories')).toBeTruthy();
      expect(screen.getByText('Share your journey and experiences')).toBeTruthy();
      expect(screen.getByText('5 posts')).toBeTruthy();
      expect(screen.getByText('My journey with rare disease')).toBeTruthy();
      expect(screen.getByText('Living with hope')).toBeTruthy();
    });

    it('renders theme card with no posts message', () => {
      renderWithChakra(
        <ThemeCard theme={{ ...mockTheme, postCount: 0 }} recentPosts={[]} />
      );
      
      expect(screen.getByText('0 posts')).toBeTruthy();
      expect(screen.getByText('No posts yet - be the first to share!')).toBeTruthy();
    });


  });

  describe('Theme Constants', () => {
    it('returns correct colors for each theme', () => {
      expect(getThemeColor('Personal Stories')).toBe('#F59E0B');
      expect(getThemeColor('Help & Support')).toBe('#3B82F6');
      expect(getThemeColor('Events')).toBe('#8B5CF6');
      expect(getThemeColor('Research & Information')).toBe('#10B981');
    });

    it('returns default color for unknown theme', () => {
      expect(getThemeColor('Unknown Theme')).toBe('#718096');
    });
  });
});

export {};