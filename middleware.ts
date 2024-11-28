import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

export async function middleware(req: NextRequest) {
  console.log("Hello");
}

//middleware가 실행 될 곳을 지정 가능
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
