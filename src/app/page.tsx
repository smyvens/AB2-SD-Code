import Image from "next/image";
import { headers } from "next/headers";
import ClientLocation from "@/components/ClientLocation";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center pt-10">
      <h1 className="font-bold text-5xl flex items-center gap-2">
        <span>Request From:</span>
        <ClientLocation />
      </h1>

      <div className="mt-10">
        <header>Super large image (8204x4332) to simulate load</header>
        <div className="relative h-[80vh] w-[80vw]">
          <Image
            src="/large-file.svg"
            alt="large file"
            width={0}
            height={0}
            style={{ width: "100%", height: "auto" }}
            unoptimized
          />
        </div>
      </div>
    </main>
  );
}
