import db from "@/lib/db";
import { accessToken, userEmail, userProfile } from "@/lib/github";
import saveSession from "@/lib/saveSession";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const access_token = await accessToken(code);

  const { id, avatar_url, login: username } = await userProfile(access_token);
  const email = await userEmail(access_token);

  //깃허브 아이디로 사용자가 존재하는지 확인
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  //사용자가 존재하면 바로 로그인 후 "/profile"로 리다이렉트
  if (user) {
    return saveSession(user.id);
  }

  //깃허브와 유저 아이디가 겹치는지 조회
  const existsUsername = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  //이메일이 존재하지는 확인
  const existsEmail = await db.user.findUnique({
    where: {
      email: email[0].email,
    },
    select: {
      id: true,
    },
  });

  //새로운 유저 생성
  const newUser = await db.user.create({
    data: {
      username: existsUsername ? username + "-gh" : username, //만약 기존 유저와 깃허브 유저가 겹치면 -gh 추가
      github_id: id + "",
      avatar: avatar_url,
      //이미 존재하는 이메일이면 null
      email: existsEmail ? null : email[0].email, //사용자가 깃허브 이메일을 여러 개 가지고 있을 경우를 위해
    },
    select: {
      id: true,
    },
  });

  return saveSession(newUser.id);
}
