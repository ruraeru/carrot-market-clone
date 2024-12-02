"use server";

import twilio from "twilio";
import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import db from "@/lib/db";
import saveSession from "@/lib/saveSession";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

async function checkTokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token + "",
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

//coerce === 강제 형변환
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(checkTokenExists, "This token does not exist.");

interface ActionState {
  token: boolean;
  phone?: string;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken(); //같은 토근을 가지고 있다면 다시 한번 getToken 함수를 실행함
  } else {
    return token;
  }
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  //false
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      //twilio 21608 err
      // const client = twilio(
      //   process.env.TWILIO_ACCOUNT_SID,
      //   process.env.TWILIO_AUTH_TOKEN
      // );
      // await client.messages.create({
      //   body: `Your Karrot verification code is: ${token}`,
      //   from: process.env.TWILIO_PHONE_NUMBER!,
      //   to: process.env.MY_PHONE_NUMBER!, //원래는 result.data로 입력받은 유저의 전화번호를 입력해야함 하지만 무료 계정이라 내 폰으로...
      // });
      return {
        token: true,
        phone: result.data,
      };
    }
  } else {
    const tokenResult = await tokenSchema.spa(token);
    const phoneResult = await phoneSchema.spa(prevState.phone);
    if (!tokenResult.success) {
      return {
        ...prevState,
        error: tokenResult.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: tokenResult.data + "",
          user: {
            phone: phoneResult.data,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (!token) {
        return {
          ...prevState,
          error: {
            formErrors: ["This token is not exists"],
          },
        };
      }
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      return saveSession(token!.userId);
    }
  }
}
