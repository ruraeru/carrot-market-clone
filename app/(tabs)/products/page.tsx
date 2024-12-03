async function getProducts() {
    await new Promise(resolve => setTimeout(resolve, 10000))
}

export default async function Product() {
    const products = await getProducts()
    return (
        <div>
            <h1 className="text-white text-4xl">Product!</h1>
        </div>
    )
}