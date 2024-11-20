"use server";

export const handleForm = async (prevState: any, formData: FormData) => {
  return {
    errors: ["wrong password", "password too short"],
  };
};
