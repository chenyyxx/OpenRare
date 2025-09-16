import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Input,
  Select,
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
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

export interface FilterState {
  search: string;
  diseaseId: string | null;
  themeId: string | null;
}

export interface Disease {
  id: number;
  name: string;
}

export interface Theme {
  id: string;
  name: string;
}

interface SearchAndFilterProps {
  onFiltersChange: (filters: FilterState) => void;
  availableDiseases: Disease[];
  availableThemes: Theme[];
  currentFilters: FilterState;
  isLoading?: boolean;
}

export default function SearchAndFilter({
  onFiltersChange,
  availableDiseases,
  availableThemes,
  currentFilters,
  isLoading = false,
}: SearchAndFilterProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

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

  // Handle disease filter change
  const handleDiseaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const diseaseId = event.target.value || null;
    const newFilters = { ...localFilters, diseaseId };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Handle theme filter change
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const themeId = event.target.value || null;
    const newFilters = { ...localFilters, themeId };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      diseaseId: null,
      themeId: null,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = localFilters.search || localFilters.diseaseId || localFilters.themeId;

  // Count active filters for badge
  const activeFilterCount = [
    localFilters.search,
    localFilters.diseaseId,
    localFilters.themeId,
  ].filter(Boolean).length;

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

      {/* Filter dropdowns */}
      <HStack 
        spacing={4} 
        align="stretch"
        direction={isMobile ? "column" : "row"}
        w="full"
      >
        {/* Disease filter */}
        <Box flex={1}>
          <Text fontSize="xs" fontWeight="500" color={placeholderColor} mb={2}>
            Rare Disease
          </Text>
          <Select
            placeholder="All diseases"
            value={localFilters.diseaseId || ""}
            onChange={handleDiseaseChange}
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
          >
            {availableDiseases.map((disease) => (
              <option key={disease.id} value={disease.id.toString()}>
                {disease.name}
              </option>
            ))}
          </Select>
        </Box>

        {/* Theme filter */}
        <Box flex={1}>
          <Text fontSize="xs" fontWeight="500" color={placeholderColor} mb={2}>
            Theme
          </Text>
          <Select
            placeholder="All themes"
            value={localFilters.themeId || ""}
            onChange={handleThemeChange}
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
          >
            {availableThemes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </Select>
        </Box>
      </HStack>

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
            {localFilters.diseaseId && (
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
                Disease: {availableDiseases.find(d => d.id.toString() === localFilters.diseaseId)?.name}
              </Badge>
            )}
            {localFilters.themeId && (
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
                Theme: {availableThemes.find(t => t.id === localFilters.themeId)?.name}
              </Badge>
            )}
          </HStack>
        </Box>
      )}
    </VStack>
  );
}