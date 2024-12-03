"use server";

import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An Account with this email does not exists."),
  password: z.string({
    required_error: "Password is require",
  }),
  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data); //safeParseAsync === spa
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    //타입스크립트에게 확실하다고 알려줄때는 ! 느낌표를 사용한다!
    //null일 가능성의 이유는 우리가 스키마에서 password를 필수값으로 지정하지 않았기 때문이다. 깃허브 로그인을 위하여..
    const ok = await bcrypt.compare(
      result.data.password,
      user?.password ?? "xx"
    );
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password"],
          email: [],
        },
      };
    }
    //if the user is found, check password hash
    //log the user in
    //redirect "/profile"
  }
}
