import React from "react";
import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  StackDivider,
  Spinner,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import Nav from "../../components/nav";
import Section from "../../components/section";
import { useSections } from "../create_post";
import Sidebar from "../../components/sidebar";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from "@choc-ui/chakra-autocomplete";
import SelectedSection from "../../components/selected_section";

export default function SectionHome() {
  const { sections, isLoading, isError } = useSections();
  const [selectedSection, setSelectedSection] = useState("");
  const handleSelect = (item: Item) => {
    setSelectedSection(item.label);
  };

  if (isError) return <div>Failed to load</div>;
  return (
    <Box minH="100vh" bg={"gray.100"}>
      <Sidebar>
        <Flex justify="center" pt={"78px"}>
          {!isLoading && sections ? (
            <VStack p="12px" m="12px" w="full" maxW="1200px" spacing={4}>
              <VStack
                    p="12px"
                    m="12px"
                    w="full"
                    maxW="1200px"
                    divider={<StackDivider borderColor="gray.200" />}
                    spacing={4}
                    // align="stretch"
                    bg={"white"}
                    rounded={"md"}
                  >
                    <FormControl w="full">
                      <FormLabel>Sections</FormLabel>
                      <AutoComplete
                        openOnFocus
                        onSelectOption={(e) => {
                          handleSelect(e.item);
                        }}
                      >
                        <AutoCompleteInput
                          variant="filled"
                          placeholder="Enter characters to start searching"
                        />
                        <AutoCompleteList>
                          {sections.map((section) => (
                            <AutoCompleteItem
                              key={`option-${section.id}`}
                              value={section.name}
                              textTransform="capitalize"
                            >
                              {section.name}
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteList>
                      </AutoComplete>
                      <FormHelperText>
                        Find the rare diseases you are interested in.
                      </FormHelperText>
                    </FormControl>
                    <SelectedSection selectedSection={selectedSection} />
                  </VStack>
              <VStack
                p="12px"
                m="12px"
                w="full"
                maxW="1200px"
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
                // align="stretch"
                bg={"white"}
                rounded={"md"}
              >
                {sections.map((section) => (
                  <Section section={section} key={section.id} />
                ))}
              </VStack>
            </VStack>
          ) : (
            <div>
              <Spinner />
              <span>Loading...</span>
            </div>
          )}
        </Flex>
      </Sidebar>
    </Box>
  );
}
