import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import SearchAndFilter, { FilterState } from '../../components/SearchAndFilter';

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

  it('calls onFiltersChange when search input changes', () => {
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
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    // Should be called after debounce
    setTimeout(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'test search',
        diseaseId: null,
        themeId: null,
      });
    }, 350);
  });
});