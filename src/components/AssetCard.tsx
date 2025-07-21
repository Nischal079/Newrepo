"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, XCircle } from "lucide-react";
import { useAssets } from "@/context/AssetContext";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AssetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export function AssetCard({ post, className }: AssetCardProps) {
  const { isLiked, toggleLike, isBooked, bookAsset, removeAsset } = useAssets();
  const liked = isLiked(post.id);
  const booked = isBooked(post.id);

  // Determine if the post has media (photo or video)
  const hasMedia = post.mediaUrl && (post.mediaUrl.endsWith('.jpg') || post.mediaUrl.endsWith('.jpeg') || post.mediaUrl.endsWith('.png') || post.mediaUrl.endsWith('.gif') || post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.mov')); // Add other video formats if needed

  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-accent/20 transition-shadow duration-300", className)}>
      {
        hasMedia ? (
          <div className="relative w-full h-48">
            {/* Render image or video based on media type */}
            {post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.mov') ? (
              <video src={post.mediaUrl} controls className="object-cover w-full h-full"></video>
            ) : (
              <Image
                src={post.mediaUrl}
                alt={post.title}
                data-ai-hint={post.aiHint} // Assuming aiHint is still relevant for posts with media
                fill
                className="object-cover"
              />
            )}
          </div>
        ) : (
          // Render the existing image if no mediaUrl is present
          <div className="relative w-full h-48">
             <Image
              src={post.imageUrl}
              alt={post.title}
              data-ai-hint={post.aiHint}
              fill
              className="object-cover"
            />
          </div>
        )
      }
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">{post.title}</CardTitle>
        {/* Display description for posts with media */}
        {hasMedia && <CardDescription>{post.description}</CardDescription>}
        {/* Display subtitle for existing assets without media */}
        {!hasMedia && <CardDescription>{post.subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Additional details can go here */}
      </CardContent>
      <CardFooter className="bg-primary/10 p-2 flex justify-around">
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
          onClick={() => removeAsset(post)}
          aria-label="Nope"
        >
          <XCircle />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-pink-500 hover:bg-pink-500/10 hover:text-pink-400",
            liked && "bg-pink-500/20 text-pink-400"
          )}
          onClick={() => toggleLike(post)}
          aria-label="Like"
        >
          <Heart fill={liked ? "currentColor" : "none"} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-accent hover:bg-accent/10 hover:text-accent/80 disabled:text-muted-foreground"
          onClick={() => bookAsset(post)}
          disabled={booked}
          aria-label="Book"
        >
          <Bookmark fill={booked ? "currentColor" : "none"} />
        </Button>
      </CardFooter>
    </Card>
  );
}