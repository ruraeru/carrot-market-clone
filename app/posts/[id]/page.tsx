import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { revalidatePath, unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";

async function getPost(id: number) {
    try {
        const post = await db.post.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1,
                }
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });
        return post;
    }
    catch (e) {
        return null;
    }
}

async function getCachedPost(id: number) {
    const cachedOpertaion = nextCache(getPost, ["post-detail"], {
        tags: [`post-detail-${id}`],
        revalidate: 10
    });

    return cachedOpertaion(id)
}

async function getLikeStatus(postId: number, userId: number) {
    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId,
            }

        }
    })
    const likeCount = await db.like.count({
        where: {
            postId
        }
    })
    return {
        likeCount,
        isLiked: Boolean(isLiked)
    }
}

async function getCachedLikeStatus(postId: number) {
    const session = await getSession();
    const userId = session.id;
    const cachedOpertaion = nextCache(getLikeStatus, ["product-like-status"], {
        tags: [`like-status-${postId}`]
    })
    return cachedOpertaion(postId, userId!);
}



export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const paramsId = Number(id);
    if (isNaN(paramsId)) {
        return notFound();
    }
    const post = await getCachedPost(paramsId);
    if (!post) {
        return notFound();
    }
    const { likeCount, isLiked } = await getCachedLikeStatus(paramsId);
    return (
        <div className="p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar!}
                    alt={post.user.username}
                />
                <div>
                    <span className="text-sm font-semibold">{post.user.username}</span>
                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.created_at.toString())}</span>
                    </div>
                </div>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <span>조회 {post.views}</span>
                </div>
                <LikeButton isLiked={isLiked} likeCount={likeCount} postId={paramsId} />
            </div>
        </div>
    )
}