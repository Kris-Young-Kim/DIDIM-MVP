"use client";

import { Button } from "@/components/ui/button";
import { trackClick } from "@/actions/track-click";

interface PurchaseButtonProps {
  recommendationId: string;
  purchaseLink: string;
}

export default function PurchaseButton({ recommendationId, purchaseLink }: PurchaseButtonProps) {
  const handleClick = () => {
    // Execute tracking in background without blocking navigation
    trackClick(recommendationId);
  };

  return (
    <Button 
        variant="outline" 
        size="sm" 
        asChild 
        className="hover:bg-[#6c47ff] hover:text-white transition-colors cursor-pointer" 
        onClick={handleClick}
    >
      <a href={purchaseLink} target="_blank" rel="noopener noreferrer">
        구매하러 가기
      </a>
    </Button>
  );
}

