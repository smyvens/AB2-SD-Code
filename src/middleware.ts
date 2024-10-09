import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  if (process.env.NODE_ENV === "development") {
    requestHeaders.set("CloudFront-Viewer-City", "Localhost");
    requestHeaders.set("CloudFront-Viewer-Country-Region-Name", "Virginia");
    requestHeaders.set("CloudFront-Viewer-Country-Name", "United States");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
