"use server";
import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

const checkUsername = (username: string) => !username.includes("admin");
const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string",
        required_error: "Where is my username???",
      })
      .min(3, "Way too short!!!")
      .max(10, "That is too looooong!")
      .toLowerCase()
      .trim()
      .transform((username) => `🔥${username}`)
      .refine(checkUsername, "No Admin allowed!"),
    email: z.string().email().toLowerCase(), //email default trim
    password: z
      .string()
      .min(4)
      .regex(
        passwordRegex,
        "A password must have lowercase, UPPERCASE, a number and special characters."
      ),
    confirmPassword: z.string().min(4),
  })
  .refine(checkPassword, {
    message: "Both passowrds should be the same!",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else [console.log(result.data)];
}
