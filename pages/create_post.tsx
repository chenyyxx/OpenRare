import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import RichTextEditor from "../components/RichText";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LeftSideBar from "../components/left_side_bar";
import Nav from "../components/nav";
import useSWR from "swr";
import Select from "react-select";
import { FullSection } from "../components/section";
import { fetchData } from "../utils/utils";
import { useSession } from "next-auth/react";
import Sidebar from "../components/sidebar";

// Define the option type
interface Option {
  value: string;
  label: string;
}

// TODO: put this in util function
export function useSections() {
  const { data, error } = useSWR<FullSection[], Error>(
    `/api/get_all_sections`,
    fetchData
  );
  return {
    sections: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export type SelectOption = {
  value: string;
  label: string;
};

export function buildSelectOptions(sections: FullSection[]): SelectOption[] {
  return sections.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));
}

export default function CreatePost() {
  const [content, setCotent] = useState("");
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([] as SelectOption[]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const toast = useToast();

  const { sections, isLoading, isError } = useSections();
  useEffect(() => {
    if (!isLoading) {
      setOptions(buildSelectOptions(sections as FullSection[]));
    }
  }, [sections, isLoading]);

  const handleNewPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (title.trim() === "") {
      toast({
        title: "Title Cannot be Empty",
        status: "warning",
        isClosable: true,
      });
    } else if (selectedSectionId.trim() === "") {
      toast({
        title: "Section Cannot be Empty",
        status: "warning",
        isClosable: true,
      });
    } else {
      // create a new post locally
      const newPost = {
        title: title,
        content: content,
        sectionId: Number(selectedSectionId),
        user: session?.user,
      };
      // api request
      await fetch("/api/create_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post: newPost }),
      });
      router.push("/");
    }
  };

  if (isError) return <div>Failed to load</div>;

  return (
    <Box minH="100vh" bg={"gray.100"}>
      <Sidebar>
        <Flex justify="center" pt={"78px"}>
          <Box w="full" p="24px" minH="full" maxW='1200px'>
            <Box bg="white" rounded={"md"}>
              <FormControl p="24px">
                <Stack spacing={"12px"}>
                  <FormLabel htmlFor="title">Create Your Post</FormLabel>
                  <Select
                    placeholder="Select a Section..."
                    isSearchable
                    isClearable
                    onChange={(e: Option | null) => {
                      setSelectedSectionId(e == null ? "" : e.value);
                    }}
                    options={options}
                  />
                  <Input
                    id="title"
                    type="title"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  />
                  <Box rounded={"md"}>
                    <RichTextEditor
                      controls={[
                        ["bold", "italic", "underline", "link"],
                        ["unorderedList", "h1", "h2", "h3"],
                        ["sup", "sub"],
                        ["alignLeft", "alignCenter", "alignRight"],
                      ]}
                      styles={{
                        root: {
                          borderColor: "#E2E8F0",
                          borderRadius: "0.375rem",
                          minHeight: "300px",
                        },
                        toolbar: { borderColor: "#E2E8F0", zIndex: 0 },
                      }}
                      value={content}
                      onChange={setCotent}
                    />
                  </Box>
                  <HStack justify={"end"}>
                    <Box>
                      <Button
                        w={"full"}
                        mt={2}
                        color={"white"}
                        rounded={"md"}
                        colorScheme={"teal"}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        style={{ textDecoration: "none" }}
                        _focus={{ boxShadow: "none" }}
                        onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.preventDefault();
                          router.back();
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        onClick={handleNewPost}
                        w={"full"}
                        mt={2}
                        color={"white"}
                        rounded={"md"}
                        colorScheme={"teal"}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        style={{ textDecoration: "none" }}
                        _focus={{ boxShadow: "none" }}
                      >
                        Create
                      </Button>
                    </Box>
                  </HStack>
                </Stack>
              </FormControl>
            </Box>
          </Box>
        </Flex>
      </Sidebar>
    </Box>
  );
}
