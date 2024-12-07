"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    photo: formData.get("photo"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }
  const results = productSchema.safeParse(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const { title, description, photo, price } = results.data;
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title,
          photo,
          price,
          description,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidatePath("/home");
      redirect(`/products/${product.id}`);
    }
  }
}
