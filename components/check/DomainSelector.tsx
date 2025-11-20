"use client";

import {
  Eye,
  Accessibility,
  Utensils,
  MessageSquare,
  Armchair,
  Car,
  Monitor,
  Gamepad2,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const DOMAINS = [
  {
    id: "sensory",
    label: "감각 (시각/청각)",
    icon: Eye,
    description: "독서 확대기, 점자, 음성 증폭기 등",
  },
  {
    id: "mobility",
    label: "이동 및 보행",
    icon: Accessibility,
    description: "휠체어, 지팡이, 리프트 등",
  },
  {
    id: "adl",
    label: "일상생활",
    icon: Utensils,
    description: "식사, 목욕, 착탈의 보조도구",
  },
  {
    id: "communication",
    label: "의사소통",
    icon: MessageSquare,
    description: "AAC, 소통판, 인공후두 등",
  },
  {
    id: "positioning",
    label: "자세유지",
    icon: Armchair,
    description: "자세유지 의자, 쿠션, 방석",
  },
  {
    id: "vehicle",
    label: "차량 개조",
    icon: Car,
    description: "핸드 컨트롤러, 리프트, 회전시트",
  },
  {
    id: "computer",
    label: "컴퓨터 접근",
    icon: Monitor,
    description: "특수 마우스/키보드, 안구 마우스",
  },
  {
    id: "leisure",
    label: "스포츠 및 여가",
    icon: Gamepad2,
    description: "게임 보조기기, 레저 용품",
  },
  {
    id: "environment",
    label: "환경개조",
    icon: Home,
    description: "안전 손잡이, 경사로, 도어락",
  },
] as const;

export type DomainId = (typeof DOMAINS)[number]["id"];

interface DomainSelectorProps {
  selectedDomains: DomainId[];
  onToggle: (domainId: DomainId) => void;
}

export default function DomainSelector({
  selectedDomains,
  onToggle,
}: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {DOMAINS.map((domain) => {
        const isSelected = selectedDomains.includes(domain.id);
        const Icon = domain.icon;

        return (
          <button
            type="button"
            key={domain.id}
            onClick={() => onToggle(domain.id)}
            className={cn(
              "flex flex-col items-start p-5 rounded-xl border transition-all duration-200 text-left h-full group relative overflow-hidden glass",
              isSelected
                ? "border-primary/60 bg-primary/10 shadow-primary/30"
                : "border-white/10 hover:border-white/20 hover:bg-white/5"
            )}
          >
            <div
              className={cn(
                "p-3 rounded-lg mb-4 transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                  : "bg-white/5 text-foreground/70 group-hover:bg-white/10"
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3
                className={cn(
                  "font-bold text-lg mb-1",
                  isSelected ? "text-primary" : "text-white"
                )}
              >
                {domain.label}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {domain.description}
              </p>
            </div>
            {isSelected && (
              <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

