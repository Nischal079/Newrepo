"use client";

import { useAssets } from "@/context/AssetContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Lock } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ChatListPage() {
  const { bookedPosts } = useAssets();

  if (bookedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] p-4 md:p-8">
        <Card className="max-w-md w-full flex flex-col items-center justify-center p-8 sm:p-12 gap-4 border-dashed text-center">
            <Lock className="w-16 h-16 text-muted-foreground/50" />
            <h2 className="font-headline text-2xl font-bold">Chat is Locked</h2>
            <p className="text-muted-foreground">Book an asset to start chatting with the owner.</p>
            <Button asChild>
                <Link href="/">Browse Assets</Link>
            </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter">
          Chats
        </h1>
        <MessageSquare className="w-8 h-8 text-accent"/>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Owner</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookedPosts.map((post) => (
              <TableRow key={post.id} className="hover:bg-primary/10 cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://placehold.co/40x40?text=${post.ownerAvatar}`} alt={post.owner} />
                      <AvatarFallback>{post.ownerAvatar}</AvatarFallback>
                    </Avatar>
                     <span className="font-medium">{post.owner}</span>
                  </div>
                </TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/chat/${post.id}`}>Open Chat</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
