import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id
            }
        });
        if (user) {
            return user;
        }
    }
    notFound();
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    }
    return (
        <div>
            <h1>Welcome! {user?.username}</h1>
            {user?.avatar ? (
                <Image width={200} height={200} unoptimized src={user?.avatar && user?.avatar} alt={`${user.username}의 프로필`} placeholder="empty" priority={true} />
            )
                : ""
            }
            <form action={logOut}>
                <button>Log out</button>
            </form>
        </div>
    )
}