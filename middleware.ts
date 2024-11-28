import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

//middleware === edge funtion
//빠르게 실행되야하고 경량화 NodeJS API라 지원하지 않는 패키지들이 많음
//https://nextjs.org/docs/pages/api-reference/edge
export async function middleware(req: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[req.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL("/products", req.url));
    }
  }
  const cookie = await cookies();
  session.id === cookie.get("delicious-karrot");
}

//middleware가 실행 될 곳을 지정 가능
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
