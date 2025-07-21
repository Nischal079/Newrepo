export interface Post {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  owner: string;
  ownerAvatar: string;
  aiHint: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'owner';
  timestamp: number;
}
