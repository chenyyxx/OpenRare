import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ReplyList, { UserReply } from '../../components/ReplyList';

const mockReplies: UserReply[] = [
  {
    id: '1',
    content: 'This is a test reply',
    createdAt: new Date('2023-01-01'),
    parentType: 'post',
    parent: {
      id: '1',
      title: 'Test Post'
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

describe('ReplyList', () => {
  it('renders replies correctly', () => {
    renderWithChakra(<ReplyList replies={mockReplies} isLoading={false} />);
    
    expect(screen.getByText('This is a test reply')).toBeInTheDocument();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Reply to post')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithChakra(<ReplyList replies={[]} isLoading={true} />);
    
    // Should render loading skeleton boxes
    const loadingBoxes = screen.getAllByRole('generic');
    expect(loadingBoxes.length).toBeGreaterThan(0);
  });

  it('returns null for empty replies', () => {
    renderWithChakra(<ReplyList replies={[]} isLoading={false} />);
    
    // Should not render any reply items
    expect(screen.queryByText('Reply to')).not.toBeInTheDocument();
  });
});