import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CommentList, { UserComment } from '../../components/CommentList';

const mockComments: UserComment[] = [
  {
    id: '1',
    content: 'This is a test comment',
    createdAt: new Date('2023-01-01'),
    post: {
      id: '1',
      title: 'Test Post',
      disease: {
        name: 'Test Disease'
      }
    }
  }
];

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  );
};

describe('CommentList', () => {
  it('renders comments correctly', () => {
    renderWithChakra(<CommentList comments={mockComments} isLoading={false} />);
    
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test Disease')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithChakra(<CommentList comments={[]} isLoading={true} />);
    
    // Should render loading skeleton boxes
    const loadingBoxes = screen.getAllByRole('generic');
    expect(loadingBoxes.length).toBeGreaterThan(0);
  });

  it('returns null for empty comments', () => {
    renderWithChakra(<CommentList comments={[]} isLoading={false} />);
    
    // Should not render any comment items
    expect(screen.queryByText('Comment on:')).not.toBeInTheDocument();
  });
});