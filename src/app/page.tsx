import ClientLocation from "@/components/ClientLocation";
import DownloadFile from "@/components/DownloadFile";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import Image from "next/image";

export default async function Home() {
  async function getImages(): Promise<{ name: string; url: string }[]> {
    const lambdaClient = new LambdaClient({
      region: process.env.AWS_DEFAULT_REGION!,
    });

    const response = await lambdaClient.send(
      new InvokeCommand({
        FunctionName: process.env.GET_ALL_SOFTWARE_FUNC!,
      })
    );

    const payload = new TextDecoder().decode(response.Payload);

    return JSON.parse(payload);
  }

  const images = await getImages();

  return (
    <main className="flex flex-col items-center justify-center pt-10">
      <h1 className="font-bold text-5xl flex items-center gap-2">
        <span>Request From:</span>
        <ClientLocation />
      </h1>

      <div className="mt-10 h-[80vh] w-[80vw]">
        <h1 className="text-3xl font-bold my-10">Software Gallery</h1>
        <div className="grid grid-cols-3 gap-5">
          {images.map((img) => (
            <div key={img.name}>
              <Image
                src={img.url}
                alt="some software"
                width={0}
                height={0}
                style={{ width: "100%", height: "auto" }}
                className="rounded-md object-fill"
                unoptimized
              />
              <DownloadFile {...img} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
