import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import FollowedDiseasesTags, { FollowedDisease } from '../../components/FollowedDiseasesTags';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockDiseases: FollowedDisease[] = [
  {
    id: 1,
    name: 'Rare Disease A',
    _count: { posts: 5, users: 10 }
  },
  {
    id: 2,
    name: 'Rare Disease B',
    _count: { posts: 3, users: 7 }
  }
];

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  );
};

describe('FollowedDiseasesTags', () => {
  const mockOnDiseaseClick = jest.fn();

  beforeEach(() => {
    mockOnDiseaseClick.mockClear();
  });

  it('renders loading state correctly', () => {
    renderWithChakra(
      <FollowedDiseasesTags
        diseases={[]}
        onDiseaseClick={mockOnDiseaseClick}
        selectedDisease={null}
        isLoading={true}
      />
    );

    // Should show skeleton loading elements
    expect(document.querySelectorAll('.chakra-skeleton')).toHaveLength(5); // 2 text skeletons + 3 tag skeletons
  });

  it('renders empty state when no diseases are followed', () => {
    renderWithChakra(
      <FollowedDiseasesTags
        diseases={[]}
        onDiseaseClick={mockOnDiseaseClick}
        selectedDisease={null}
        isLoading={false}
      />
    );

    expect(screen.getByText("You're not following any rare diseases yet.")).toBeInTheDocument();
    expect(screen.getByText('Explore Rare Diseases')).toBeInTheDocument();
  });

  it('renders diseases as clickable tags', () => {
    renderWithChakra(
      <FollowedDiseasesTags
        diseases={mockDiseases}
        onDiseaseClick={mockOnDiseaseClick}
        selectedDisease={null}
        isLoading={false}
      />
    );

    expect(screen.getByText('Your followed diseases:')).toBeInTheDocument();
    expect(screen.getByText('Manage interests')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Rare Disease A')).toBeInTheDocument();
    expect(screen.getByText('Rare Disease B')).toBeInTheDocument();
  });

  it('handles disease tag clicks', () => {
    renderWithChakra(
      <FollowedDiseasesTags
        diseases={mockDiseases}
        onDiseaseClick={mockOnDiseaseClick}
        selectedDisease={null}
        isLoading={false}
      />
    );

    const diseaseTag = screen.getByText('Rare Disease A');
    fireEvent.click(diseaseTag);

    expect(mockOnDiseaseClick).toHaveBeenCalledWith(1);
  });

  it('handles "All" tag click', () => {
    renderWithChakra(
      <FollowedDiseasesTags
        diseases={mockDiseases}
        onDiseaseClick={mockOnDiseaseClick}
        selectedDisease={1}
        isLoading={false}
      />
    );

    const allTag = screen.getByText('All');
    fireEvent.click(allTag);

    expect(mockOnDiseaseClick).toHaveBeenCalledWith(null);
  });

  it('shows selected state correctly', () => {
    renderWithChakra(
      <FollowedDiseasesTags
        diseases={mockDiseases}
        onDiseaseClick={mockOnDiseaseClick}
        selectedDisease={1}
        isLoading={false}
      />
    );

    // The selected tag should be present and clickable
    const selectedTag = screen.getByText('Rare Disease A');
    expect(selectedTag).toBeInTheDocument();
    
    // Should also have the "All" tag
    const allTag = screen.getByText('All');
    expect(allTag).toBeInTheDocument();
  });
});