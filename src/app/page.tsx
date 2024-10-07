import Image from "next/image";
import { headers } from "next/headers";

export default async function Home() {
  async function getClientLocation(): Promise<Record<string, string>> {
    const ipAddress =
      headers().get("x-forwarded-for")?.split(":").at(-1) || "127.0.0.1";

    const response = await fetch(`https://ipapi.co/${ipAddress}/json`);
    const data = await response.json();

    return {
      city: data.city,
      region: data.region,
      country: data.country,
    };
  }

  const location = await getClientLocation();

  return (
    <main className="flex flex-col items-center justify-center pt-10">
      <h1 className="font-bold text-5xl flex items-center gap-2">
        <span>Request From:</span>

        {Object.entries(location).map(([key, value]) => (
          <span key={key} className="text-blue-400">
            {value}
          </span>
        ))}
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
