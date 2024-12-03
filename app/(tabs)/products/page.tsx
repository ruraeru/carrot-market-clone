import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db"
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            created_at: true,
            photo: true
        },
        take: 1,
        orderBy: {
            created_at: "desc"
        }
    });
    return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
    const initialProducts = await getInitialProducts()
    return (
        <div>
            <ProductList initialProducts={initialProducts} />
        </div>
    )
}