import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import getSession from "./lib/session";

export async function middleware(req: NextRequest) {
  const session = await getSession();
  console.log(session);
  if (req.nextUrl.pathname === "/profile") {
    return Response.redirect(new URL("/", req.url));
  }
}
