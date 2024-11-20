"use server";

import { redirect } from "next/navigation";

export const handleForm = async (prevState: any) => {
  console.log(prevState);
  await new Promise((res) => setTimeout(res, 5000));
  redirect("/");
  return {
    errors: ["wrong password", "password too short"],
  };
};
