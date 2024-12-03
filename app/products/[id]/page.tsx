import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
}

async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    });
    return product;
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productId = Number(id);
    if (isNaN(productId)) {
        return notFound();
    }
    const product = await getProduct(productId);
    if (!product) {
        return notFound(); //db에 존재하지 않는 프로덕트를 조회할 경우
    }
    const isOwner = await getIsOwner(product.userId);
    async function deleteProduct() {
        "use server"
        const delete_product = await db.product.delete({
            where: {
                id: productId
            }
        })
        console.log(delete_product)
        return redirect("/products")
    }
    return (
        <div>
            <div className="relative aspect-square">
                <Image fill className="object-cover" src={product.photo} alt={product.title} />
            </div>
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 rounded-full overflow-hidden">
                    {product.user.avatar !== null ? <Image width={40} height={40} src={product.user.avatar} alt={product.user.username} /> : <UserIcon />}
                </div>
                <div>
                    <h3>{product.user.username}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
                <span className="font-semibold text-xl">{formatToWon(product.price)}원</span>
                {isOwner ? (
                    <form action={deleteProduct}>
                        <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">Delete product</button>
                    </form>
                ) : null}
                <Link className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold" href={``}>채팅하기</Link>
            </div>
        </div>
    )
}