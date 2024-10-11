import DownloadFile from "@/components/DownloadFile";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { headers } from "next/headers";
import Image from "next/image";
import { Fragment } from "react";
import { CiLocationOn } from "react-icons/ci";

export default async function Home() {
  async function getImages(): Promise<{ name: string; url: string }[]> {
    const lambdaClient = new LambdaClient({
      region: process.env.AWS_DEFAULT_REGION || "us-east-1",
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

    if (!headersList.get("CloudFront-Viewer-Country-Name")) {
      return null;
    }

    return {
      city: headersList.get("CloudFront-Viewer-City"),
      state: headersList.get("CloudFront-Viewer-Country-Region-Name"),
      country: headersList.get("CloudFront-Viewer-Country-Name"),
    };
  }

  const images = await getImages();
  const clientLocation = getClientLocation();

  return (
    <main className="flex flex-col items-center justify-center py-10 px-10">
      <div className="flex items-center justify-center gap-2 w-full font-bold text-5xl">
        {clientLocation ? (
          <Fragment>
            <h1>
              <CiLocationOn />
            </h1>
            <div className="text-blue-400">
              <p className="flex gap-2">
                <span>{clientLocation.city},</span>
                <span>{clientLocation.state},</span>
                <span>{clientLocation.country}</span>
              </p>
            </div>
          </Fragment>
        ) : (
          <h1 className="text-red-200 mx-auto">
            Please use CloudFront Link to get location data!
          </h1>
        )}
      </div>

      <div className="mt-5">
        <h1 className="text-3xl font-bold my-10">Software Gallery</h1>
        <div className="grid grid-cols-3 gap-5">
          {images.map((img) => (
            <div key={img.name} className="relative w-80 h-80 group">
              <Image
                src={img.url}
                alt={img.name}
                fill
                loading="lazy"
                className="rounded-md object-cover w-full h-full"
                unoptimized
              />
              <div className="absolute h-full w-full z-10 bg-transparent group-hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all">
                <h3 className="font-bold text-xl p-5 capitalize">
                  {img.name.split(".")[0]}
                </h3>
                <div className="absolute bottom-5 right-5">
                  <DownloadFile {...img} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
