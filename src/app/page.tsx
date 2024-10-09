import DownloadFile from "@/components/DownloadFile";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { headers } from "next/headers";
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

  function getClientLocation() {
    const headersList = headers();

    return {
      city: headersList.get("CloudFront-Viewer-City"),
      state: headersList.get("CloudFront-Viewer-Country-Region-Name"),
      country: headersList.get("CloudFront-Viewer-Country-Name"),
    };
  }

  const images = await getImages();
  const clientLocation = getClientLocation();

  return (
    <main className="flex flex-col items-center justify-center pt-10 px-10">
      <div className="flex gap-2 w-full font-bold text-5xl">
        <h1>Request From:</h1>
        <div className="text-blue-400">
          <p>
            <span className="mr-2">{clientLocation.city},</span>
            <span>{clientLocation.state}</span>
          </p>
          <p>
            <span>{clientLocation.country}</span>
          </p>
        </div>
      </div>

      <div className="mt-5">
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
