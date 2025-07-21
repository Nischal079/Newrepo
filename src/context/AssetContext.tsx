"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Post } from '@/lib/types';
import { samplePosts } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AssetContextType {
  posts: Post[];
  likedPosts: Post[];
  bookedPosts: Post[];
  getPostById: (id: string) => Post | undefined;
  isLiked: (postId: string) => boolean;
  isBooked: (postId: string) => boolean;
  toggleLike: (post: Post) => void;
  bookAsset: (post: Post) => void;
  removeAsset: (post: Post) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [bookedPosts, setBookedPosts] = useState<Post[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const getPostById = (id: string): Post | undefined => {
    return posts.find(p => p.id === id);
  };

  const isLiked = (postId: string): boolean => {
    return likedPosts.some(p => p.id === postId);
  };

  const isBooked = (postId: string): boolean => {
    return bookedPosts.some(p => p.id === postId);
  };

  const toggleLike = (post: Post) => {
    setLikedPosts(prev => {
      const isAlreadyLiked = prev.some(p => p.id === post.id);
      if (isAlreadyLiked) {
        return prev.filter(p => p.id !== post.id);
      } else {
        return [...prev, post];
      }
    });
  };

  const bookAsset = (post: Post) => {
    if (isBooked(post.id)) return;
    setBookedPosts(prev => [...prev, post]);
    toast({
      title: "Asset Booked!",
      description: `You can now chat with ${post.owner} about "${post.title}".`,
    });
    router.push(`/chat/${post.id}`);
  };

  const removeAsset = (postToRemove: Post) => {
    setPosts(prev => prev.filter(p => p.id !== postToRemove.id));
    setLikedPosts(prev => prev.filter(p => p.id !== postToRemove.id));
    // We don't remove from booked posts as that history should persist for chat
  };

  const value = {
    posts,
    likedPosts,
    bookedPosts,
    getPostById,
    isLiked,
    isBooked,
    toggleLike,
    bookAsset,
    removeAsset,
  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = (): AssetContextType => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};
