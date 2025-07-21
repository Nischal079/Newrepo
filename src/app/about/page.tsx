import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] p-4 md:p-8">
      <Card className="max-w-lg w-full p-8 text-center shadow-lg border-accent/20">
        <div className="flex justify-center mb-4">
          <Bot className="w-16 h-16 text-accent" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tighter mb-2">
          NightHub Assets
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          The future of asset acquisition.
        </p>
        <div className="text-lg text-foreground/80 space-y-2">
           <p>
            This application was developed to showcase a modern, AI-enhanced user experience for asset browsing and negotiation.
           </p>
           <p className="pt-4 font-semibold">
            Application Developed by Nischal Poudel
           </p>
        </div>
      </Card>
    </div>
  );
}
