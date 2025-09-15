import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import Explore from '../../pages/index';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: mockThemes,
    error: null,
  })),
}));

// Mock Sidebar component
jest.mock('../../components/sidebar', () => {
  return function MockSidebar({ children }: { children: React.ReactNode }) {
    return <div data-testid="sidebar">{children}</div>;
  };
});

const mockThemes = [
  {
    id: 'personal-stories',
    name: 'Personal Stories',
    description: 'Share your journey and experiences',
    icon: 'user',
    color: '#F59E0B',
    guidelines: 'A place for sharing personal experiences, journeys, milestones, and life with rare diseases',
    postCount: 5,
    recentPosts: [
      { id: '1', title: 'My journey with rare disease', author: 'John', disease: 'Huntington\'s' },
      { id: '2', title: 'Living with hope', author: 'Jane', disease: 'ALS' }
    ],
  },
  {
    id: 'help-support',
    name: 'Help & Support',
    description: 'Ask questions and offer support',
    icon: 'heart',
    color: '#3B82F6',
    guidelines: 'A place for asking questions, seeking advice, and offering help to community members',
    postCount: 3,
    recentPosts: [
      { id: '3', title: 'Need advice on treatment', author: 'Bob', disease: 'Parkinson\'s' }
    ],
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Community gatherings and events',
    icon: 'calendar',
    color: '#8B5CF6',
    guidelines: 'A place for sharing upcoming events, conferences, support group meetings, and community gatherings',
    postCount: 2,
    recentPosts: [],
  },
  {
    id: 'research-info',
    name: 'Research & Information',
    description: 'Medical information and research',
    icon: 'book',
    color: '#10B981',
    guidelines: 'A place for sharing research findings, medical information, treatment updates, and educational content',
    postCount: 8,
    recentPosts: [
      { id: '4', title: 'New treatment breakthrough', author: 'Dr. Smith', disease: 'Multiple Sclerosis' }
    ],
  },
];

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  );
};

describe('Explore Page', () => {
  it('renders the explore page header', () => {
    renderWithChakra(<Explore initialThemes={mockThemes} />);
    
    expect(screen.getByText('Discover Community Content')).toBeTruthy();
    expect(screen.getByText(/Explore different types of content organized by themes/)).toBeTruthy();
  });

  it('renders all theme cards', () => {
    renderWithChakra(<Explore initialThemes={mockThemes} />);
    
    expect(screen.getByText('Personal Stories')).toBeTruthy();
    expect(screen.getByText('Help & Support')).toBeTruthy();
    expect(screen.getByText('Events')).toBeTruthy();
    expect(screen.getByText('Research & Information')).toBeTruthy();
  });

  it('displays theme descriptions and guidelines', () => {
    renderWithChakra(<Explore initialThemes={mockThemes} />);
    
    expect(screen.getByText('Share your journey and experiences')).toBeTruthy();
    expect(screen.getByText('Ask questions and offer support')).toBeTruthy();
    expect(screen.getByText('Community gatherings and events')).toBeTruthy();
    expect(screen.getByText('Medical information and research')).toBeTruthy();
  });

  it('displays post counts for each theme', () => {
    renderWithChakra(<Explore initialThemes={mockThemes} />);
    
    expect(screen.getByText('5 posts')).toBeTruthy();
    expect(screen.getByText('3 posts')).toBeTruthy();
    expect(screen.getByText('2 posts')).toBeTruthy();
    expect(screen.getByText('8 posts')).toBeTruthy();
  });

  it('displays recent posts when available', () => {
    renderWithChakra(<Explore initialThemes={mockThemes} />);
    
    expect(screen.getByText('My journey with rare disease')).toBeTruthy();
    expect(screen.getByText('Living with hope')).toBeTruthy();
    expect(screen.getByText('Need advice on treatment')).toBeTruthy();
    expect(screen.getByText('New treatment breakthrough')).toBeTruthy();
  });

  it('shows empty state for themes with no posts', () => {
    renderWithChakra(<Explore initialThemes={mockThemes} />);
    
    // Events theme has no recent posts
    expect(screen.getByText('No posts yet - be the first to share!')).toBeTruthy();
  });

  it('renders new user guidance section', () => {
    renderWithChakra(<Explore initialThemes={mockThemes} />);
    
    expect(screen.getByText('New to the community?')).toBeTruthy();
    expect(screen.getByText(/Each theme serves a different purpose/)).toBeTruthy();
  });

  it('handles empty themes array', () => {
    renderWithChakra(<Explore initialThemes={[]} />);
    
    expect(screen.getByText('Discover Community Content')).toBeTruthy();
    // Should still render the header even with no themes
  });
});

export {};