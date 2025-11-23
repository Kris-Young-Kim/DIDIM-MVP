"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// 한국장애인고용공단 보조공학기기 카테고리 체계
const ASSISTIVE_TECH_CATEGORIES = {
  all: { name: "전체", domain: null },
  body: { name: "신체측정보조공학기기", domain: "body_support" },
  mobility: { name: "이동관련보조공학기기", domain: "mobility" },
  furniture: { name: "가구설비보조공학기기", domain: "furniture" },
  communication: { name: "의사소통보조공학기기", domain: "communication" },
  control: { name: "제어운반보조공학기기", domain: "control" },
  work: { name: "직무활동보조공학기기", domain: "work" },
} as const;

type CategoryKey = keyof typeof ASSISTIVE_TECH_CATEGORIES;

export function ProductCategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = (searchParams.get("category") || "all") as CategoryKey;

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {Object.entries(ASSISTIVE_TECH_CATEGORIES).map(([key, value]) => {
        const isActive = currentCategory === key;
        return (
          <Button
            key={key}
            asChild
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`rounded-full transition-all ${
              isActive
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            <Link href={`/products?category=${key}`} scroll={false}>
              {value.name}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

