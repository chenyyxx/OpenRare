import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import EmptyState from '../../components/EmptyState';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  );
};

describe('EmptyState', () => {
  it('renders following tab empty state', () => {
    renderWithChakra(<EmptyState tabType="following" />);
    
    expect(screen.getByText('No posts from followed diseases')).toBeInTheDocument();
    expect(screen.getByText('Explore Rare Diseases')).toBeInTheDocument();
  });

  it('renders myPosts tab empty state', () => {
    renderWithChakra(<EmptyState tabType="myPosts" />);
    
    expect(screen.getByText('No posts yet')).toBeInTheDocument();
    expect(screen.getByText('Create Your First Post')).toBeInTheDocument();
  });

  it('renders myComments tab empty state', () => {
    renderWithChakra(<EmptyState tabType="myComments" />);
    
    expect(screen.getByText('No comments yet')).toBeInTheDocument();
    expect(screen.getByText('Explore Posts')).toBeInTheDocument();
  });

  it('renders favorites tab empty state', () => {
    renderWithChakra(<EmptyState tabType="favorites" />);
    
    expect(screen.getByText('No favorite posts')).toBeInTheDocument();
    expect(screen.getByText('Discover Posts')).toBeInTheDocument();
  });

  it('renders replies tab empty state', () => {
    renderWithChakra(<EmptyState tabType="replies" />);
    
    expect(screen.getByText('No replies yet')).toBeInTheDocument();
    expect(screen.getByText('Create a Post')).toBeInTheDocument();
  });
});