import React from "react";
import { Spinner } from "@chakra-ui/react";
import Section, { FullSection } from "./section";
import useSWR from "swr";
import { fetchData } from "../utils/utils";

export const useSectionDetail = (name: string) => {
  const url = `/api/get_section_by_name/${name}`;
  const { data, error } = useSWR<FullSection, Error>(url, fetchData);
  return {
    section: data,
    isSectionLoading: !error && !data,
    isSectionLoadingError: error,
  };
};

export default function SelectedSection({
  selectedSection,
}: {
  selectedSection: string;
}) {
  const { section, isSectionLoading, isSectionLoadingError } =
    useSectionDetail(selectedSection);

  return (
    <>
      {selectedSection === "" ? (
        <></>
      ) : !isSectionLoading && section ? (
        <Section section={section} />
      ) : isSectionLoadingError ? (
        <div>Failed to load</div>
      ) : (
        <div>
          <Spinner />
          <span>Loading...</span>
        </div>
      )}
    </>
  );
}
