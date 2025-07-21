"use client";

import { useAssets } from "@/context/AssetContext";
import { AssetCard } from "@/components/AssetCard";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function LikedPage() {
  const { likedPosts } = useAssets();

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-6">
        Liked Assets
      </h1>
      {likedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedPosts.map((post) => (
            <AssetCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 gap-4 border-dashed">
            <Heart className="w-16 h-16 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">No liked assets yet.</p>
            <p className="text-sm text-center text-muted-foreground/80">Browse the home page and click the heart icon to save your favorites here.</p>
        </Card>
      )}
    </div>
  );
}
