"use client";

import { useAssets } from "@/context/AssetContext";
import { ChatView } from "@/components/ChatView";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
  const { id } = useParams();
  const { getPostById } = useAssets();
  const [post, setPost] = useState<Post | undefined | null>(undefined); // undefined for loading, null for not found

  useEffect(() => {
    if (typeof id === 'string') {
      const foundPost = getPostById(id);
      setPost(foundPost || null);
    }
  }, [id, getPostById]);

  if (post === undefined) {
    return (
       <div className="p-4 md:p-8 space-y-4">
        <Skeleton className="h-12 w-1/2" />
        <Card className="h-[calc(100vh-20rem)] p-4">
            <div className="space-y-4">
                <Skeleton className="h-16 w-3/4 ml-auto" />
                <Skeleton className="h-24 w-2/3" />
                <Skeleton className="h-16 w-3/4 ml-auto" />
            </div>
        </Card>
        <Skeleton className="h-24 w-full" />
       </div>
    );
  }

  if (post === null) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)] p-4 md:p-8">
        <Card className="p-8 text-center">
            <h2 className="font-headline text-2xl font-bold">Chat not found</h2>
            <p className="text-muted-foreground">The asset you're trying to chat about could not be found.</p>
        </Card>
      </div>
    );
  }

  return <ChatView post={post} />;
}
