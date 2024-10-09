"use client";

import { saveAs } from "file-saver";
import { useMemo } from "react";
interface DownloadFileProps {
  name: string;
}

export default function DownloadFile({ name }: DownloadFileProps) {
  const domainName = useMemo(
    () =>
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DOMAIN_NAME
        : "",
    []
  );

  async function handleDownload(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      console.log(domainName);
      const response = await fetch(`${domainName}/${name}`);
      const blob = await response.blob();

      saveAs(blob, name);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  return (
    <a href={"#"} onClick={handleDownload}>
      download
    </a>
  );
}
