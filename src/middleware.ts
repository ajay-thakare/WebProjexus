import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/site", "/api/uploadthing"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // rewrite for domains
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();

  //  extract headers
  const headers = req.headers;
  const headersObj: Record<string, string> = {};

  // Convert headers to a plain object for logging
  headers.forEach((value: string, key: string) => {
    headersObj[key] = value;
  });

  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // middleware logic here...
  //if subdomain exists
  const customSubDomain = headers
    .get("host")
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    );
  }

  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }

  if (
    url.pathname === "/" ||
    (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  // Return the unmodified request if no other response is sent
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
