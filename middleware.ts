import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

//middleware === edge funtion
//빠르게 실행되야하고 경량화 NodeJS API라 지원하지 않는 패키지들이 많음
//https://nextjs.org/docs/pages/api-reference/edge
export async function middleware(req: NextRequest) {}

//middleware가 실행 될 곳을 지정 가능
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
