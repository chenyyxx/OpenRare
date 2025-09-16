import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Input,
  HStack,
  VStack,
  Button,
  Text,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useBreakpointValue,
  Flex,
  Badge,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { FiX } from "react-icons/fi";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from "@choc-ui/chakra-autocomplete";

export interface ThemeFilterState {
  search: string;
  selectedDiseases: number[];
}

export interface Disease {
  id: number;
  name: string;
}

interface ThemeSearchAndFilterProps {
  onFiltersChange: (filters: ThemeFilterState) => void;
  availableDiseases: Disease[];
  currentFilters: ThemeFilterState;
  isLoading?: boolean;
}

export default function ThemeSearchAndFilter({
  onFiltersChange,
  availableDiseases,
  currentFilters,
  isLoading = false,
}: ThemeSearchAndFilterProps) {
  const [localFilters, setLocalFilters] = useState<ThemeFilterState>(currentFilters);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [diseaseSearchValue, setDiseaseSearchValue] = useState("");

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Debounced search handler
  const debouncedSearch = useCallback((searchValue: string) => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      const newFilters = { ...localFilters, search: searchValue };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    }, 300); // 300ms debounce

    setSearchDebounceTimer(timer);
  }, [localFilters, onFiltersChange, searchDebounceTimer]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setLocalFilters(prev => ({ ...prev, search: searchValue }));
    debouncedSearch(searchValue);
  };

  // Handle disease selection from autocomplete
  const handleDiseaseSelect = (item: Item) => {
    const disease = availableDiseases.find(d => d.name === item.label);
    if (disease && !localFilters.selectedDiseases.includes(disease.id)) {
      const newSelectedDiseases = [...localFilters.selectedDiseases, disease.id];
      const newFilters = { ...localFilters, selectedDiseases: newSelectedDiseases };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
      setDiseaseSearchValue(""); // Clear search after selection
    }
  };

  // Handle disease removal
  const handleDiseaseRemove = (diseaseId: number) => {
    const newSelectedDiseases = localFilters.selectedDiseases.filter(id => id !== diseaseId);
    const newFilters = { ...localFilters, selectedDiseases: newSelectedDiseases };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: ThemeFilterState = {
      search: "",
      selectedDiseases: [],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setDiseaseSearchValue("");
  };

  // Check if any filters are active
  const hasActiveFilters = localFilters.search || localFilters.selectedDiseases.length > 0;

  // Count active filters for badge
  const activeFilterCount = [
    localFilters.search,
    localFilters.selectedDiseases.length > 0 ? "diseases" : null,
  ].filter(Boolean).length;

  // Get filtered diseases for autocomplete (exclude already selected)
  const getFilteredDiseases = () => {
    return availableDiseases.filter(disease => 
      !localFilters.selectedDiseases.includes(disease.id) &&
      disease.name.toLowerCase().includes(diseaseSearchValue.toLowerCase())
    );
  };

  // Sync with external filter changes
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchDebounceTimer]);

  return (
    <VStack spacing={4} align="stretch" mb={6}>
      {/* Header with clear button */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
        <HStack>
          <Text fontSize="sm" fontWeight="600" color={placeholderColor}>
            Search & Filter
          </Text>
          {activeFilterCount > 0 && (
            <Badge colorScheme="teal" variant="solid" borderRadius="full">
              {activeFilterCount}
            </Badge>
          )}
        </HStack>
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            leftIcon={<CloseIcon boxSize={3} />}
            onClick={handleClearFilters}
            isDisabled={isLoading}
          >
            Clear All
          </Button>
        )}
      </Flex>

      {/* Search input */}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color={placeholderColor} />
        </InputLeftElement>
        <Input
          placeholder="Search posts by title..."
          value={localFilters.search}
          onChange={handleSearchChange}
          isDisabled={isLoading}
          bg="gray.50"
          border="2px"
          borderColor="gray.300"
          rounded="2xl"
          _focus={{
            borderColor: "teal.500",
            bg: "white",
            boxShadow: "0 0 0 1px #319795",
          }}
          _hover={{
            borderColor: "gray.400",
          }}
        />
      </InputGroup>

      {/* Multi-select disease filter */}
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="500" color={placeholderColor}>
          Filter by Rare Diseases
        </FormLabel>
        
        {/* Selected diseases tags */}
        {localFilters.selectedDiseases.length > 0 && (
          <Box mb={3}>
            <Wrap spacing={2}>
              {localFilters.selectedDiseases.map((diseaseId) => {
                const disease = availableDiseases.find(d => d.id === diseaseId);
                if (!disease) return null;
                
                return (
                  <WrapItem key={diseaseId}>
                    <Tag
                      size="md"
                      variant="solid"
                      colorScheme="teal"
                      borderRadius="full"
                    >
                      <TagLabel>{disease.name}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleDiseaseRemove(diseaseId)}
                      />
                    </Tag>
                  </WrapItem>
                );
              })}
            </Wrap>
          </Box>
        )}

        {/* Autocomplete input */}
        <Box position="relative">
          <AutoComplete
            openOnFocus
            onSelectOption={(e) => {
              handleDiseaseSelect(e.item);
            }}
          >
            <AutoCompleteInput
              variant="filled"
              placeholder="Type to search and select rare diseases..."
              value={diseaseSearchValue}
              onChange={(e) => setDiseaseSearchValue(e.target.value)}
              isDisabled={isLoading}
              bg="gray.50"
              border="2px"
              borderColor="gray.300"
              rounded="2xl"
              _hover={{
                borderColor: "gray.400"
              }}
              _focus={{
                borderColor: "teal.500",
                bg: "white",
                boxShadow: "0 0 0 1px #319795"
              }}
            />
            <AutoCompleteList>
              {getFilteredDiseases().map((disease) => (
                <AutoCompleteItem
                  key={`option-${disease.id}`}
                  value={disease.name}
                  textTransform="capitalize"
                >
                  {disease.name}
                </AutoCompleteItem>
              ))}
            </AutoCompleteList>
          </AutoComplete>
          {diseaseSearchValue && (
            <IconButton
              aria-label="Clear search"
              icon={<FiX />}
              size="sm"
              variant="ghost"
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              onClick={() => setDiseaseSearchValue("")}
            />
          )}
        </Box>
      </FormControl>

      {/* Active filters display */}
      {hasActiveFilters && (
        <Box>
          <Text fontSize="xs" color={placeholderColor} mb={2}>
            Active filters:
          </Text>
          <HStack spacing={2} wrap="wrap">
            {localFilters.search && (
              <Badge 
                bg="teal.100" 
                color="teal.800" 
                px={3} 
                py={1} 
                rounded="full" 
                fontSize="xs" 
                fontWeight="500"
                border="1px"
                borderColor="teal.300"
              >
                Search: &quot;{localFilters.search}&quot;
              </Badge>
            )}
            {localFilters.selectedDiseases.length > 0 && (
              <Badge 
                bg="gray.200" 
                color="gray.800" 
                px={3} 
                py={1} 
                rounded="full" 
                fontSize="xs" 
                fontWeight="500"
                border="1px"
                borderColor="gray.400"
              >
                {localFilters.selectedDiseases.length} disease{localFilters.selectedDiseases.length > 1 ? 's' : ''} selected
              </Badge>
            )}
          </HStack>
        </Box>
      )}
    </VStack>
  );
}