"use client";

import { useAssets } from "@/context/AssetContext";
import { AssetCard } from "@/components/AssetCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { posts } = useAssets();
  const recommendedPosts = posts.slice(0, 3);
  const allPosts = posts;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">Recommended Assets</h1>
        {recommendedPosts.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {recommendedPosts.map((post) => (
                <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <AssetCard post={post} className="h-full" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        ) : (
          <Card className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No recommended assets available.</p>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-4">All Assets</h2>
        {allPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allPosts.map((post) => (
              <AssetCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
           <Card className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">No assets found. Try again later.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
