"use client";

import { saveAs } from "file-saver";
import { useMemo } from "react";
import { IoMdDownload } from "react-icons/io";
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

  async function handleDownload() {
    try {
      console.log(domainName);
      const response = await fetch(`${domainName}/${name}`, {
        cache: "force-cache",
      });
      const blob = await response.blob();

      saveAs(blob, name);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="bg-white p-2 rounded-md"
    >
      <IoMdDownload className="text-black" />
    </button>
  );
}
