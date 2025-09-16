import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import SearchAndFilter, { FilterState } from '../../components/SearchAndFilter';

// Mock matchMedia for Chakra UI responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

const mockDiseases = [
  { id: 1, name: 'Disease A' },
  { id: 2, name: 'Disease B' },
];

const mockThemes = [
  { id: '1', name: 'Theme A' },
  { id: '2', name: 'Theme B' },
];

const defaultFilters: FilterState = {
  search: '',
  diseaseId: null,
  themeId: null,
};

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  );
};

describe('SearchAndFilter', () => {
  it('renders search input and filter dropdowns', () => {
    const mockOnFiltersChange = jest.fn();
    
    renderWithChakra(
      <SearchAndFilter
        onFiltersChange={mockOnFiltersChange}
        availableDiseases={mockDiseases}
        availableThemes={mockThemes}
        currentFilters={defaultFilters}
      />
    );

    expect(screen.getByPlaceholderText('Search posts by title...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All diseases')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All themes')).toBeInTheDocument();
  });

  it('calls onFiltersChange when search input changes', async () => {
    const mockOnFiltersChange = jest.fn();
    
    renderWithChakra(
      <SearchAndFilter
        onFiltersChange={mockOnFiltersChange}
        availableDiseases={mockDiseases}
        availableThemes={mockThemes}
        currentFilters={defaultFilters}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search posts by title...');
    
    // Wrap the state-changing event in act()
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'test search' } });
    });

    // Wait for debounce to complete with act()
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350));
    });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      search: 'test search',
      diseaseId: null,
      themeId: null,
    });
  });

  it('calls onFiltersChange when disease filter changes', () => {
    const mockOnFiltersChange = jest.fn();
    
    renderWithChakra(
      <SearchAndFilter
        onFiltersChange={mockOnFiltersChange}
        availableDiseases={mockDiseases}
        availableThemes={mockThemes}
        currentFilters={defaultFilters}
      />
    );

    const diseaseSelect = screen.getByDisplayValue('All diseases');
    
    act(() => {
      fireEvent.change(diseaseSelect, { target: { value: '1' } });
    });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      search: '',
      diseaseId: '1',
      themeId: null,
    });
  });

  it('calls onFiltersChange when theme filter changes', () => {
    const mockOnFiltersChange = jest.fn();
    
    renderWithChakra(
      <SearchAndFilter
        onFiltersChange={mockOnFiltersChange}
        availableDiseases={mockDiseases}
        availableThemes={mockThemes}
        currentFilters={defaultFilters}
      />
    );

    const themeSelect = screen.getByDisplayValue('All themes');
    
    act(() => {
      fireEvent.change(themeSelect, { target: { value: '1' } });
    });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      search: '',
      diseaseId: null,
      themeId: '1',
    });
  });
});