"use server";

import { z } from "zod";

const formSchema = z.object({
  phone: z.number(),
  token: z.number(),
});

export async function smsVerification(prevState: any, formData: FormData) {
  const data = {
    phone: formData.get("phone"),
    token: formData.get("token"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
