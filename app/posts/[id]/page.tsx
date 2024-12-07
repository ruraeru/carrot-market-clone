import { notFound } from "next/navigation";

async function getPost(id: number) {

}

export default async function PostDetail({ params }: { params: { id: string } }) {
    const { id } = await params;
    const paramsId = Number(id);
    if (isNaN(paramsId)) {
        return notFound();
    }
    return (
        <div>
            asdas
        </div>
    )
}