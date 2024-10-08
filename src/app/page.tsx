import Image from "next/image";
import ClientLocation from "@/components/ClientLocation";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export default async function Home() {
  async function getImages(): Promise<string[]> {
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
            <Image
              key={img}
              src={img}
              alt="some software"
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              className="rounded-md object-fill"
              unoptimized
            />
          ))}
        </div>
      </div>
    </main>
  );
}
