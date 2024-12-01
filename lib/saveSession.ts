import { redirect } from "next/navigation";
import getSession from "./session";

export default async function saveSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
  return redirect("/profile");
}
