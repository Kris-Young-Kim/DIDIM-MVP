"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FormWrapper from "./FormWrapper";

export default function MobilityForm() {
  const { control } = useFormContext();

  return (
    <FormWrapper title="이동 및 보행 상세 질문">
      <FormField
        control={control}
        name="mobility.walking_ability"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-foreground font-semibold">
              현재 보행 능력은 어떠신가요?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="independent" id="mob-indep" />
                  <Label htmlFor="mob-indep" className="font-normal text-foreground/80">
                    독립 보행 가능
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="cane" id="mob-cane" />
                  <Label htmlFor="mob-cane" className="font-normal text-foreground/80">
                    지팡이/목발 사용
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="walker" id="mob-walker" />
                  <Label htmlFor="mob-walker" className="font-normal text-foreground/80">
                    워커(보행기) 사용
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="manual_wheelchair" id="mob-manual" />
                  <Label htmlFor="mob-manual" className="font-normal text-foreground/80">
                    수동 휠체어 사용
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="power_wheelchair" id="mob-power" />
                  <Label htmlFor="mob-power" className="font-normal text-foreground/80">
                    전동 휠체어 사용
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="bedridden" id="mob-bed" />
                  <Label htmlFor="mob-bed" className="font-normal text-foreground/80">
                    침상 생활 (거동 불가)
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="my-4 border-t border-dashed border-white/10" />

      <FormField
        control={control}
        name="mobility.upper_limb_strength"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-foreground font-semibold">
              상지(팔/손) 근력 상태는 어떠신가요?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="normal" id="arm-normal" />
                  <Label htmlFor="arm-normal" className="font-normal text-foreground/80">
                    정상 (양손 사용 자유로움)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="weak" id="arm-weak" />
                  <Label htmlFor="arm-weak" className="font-normal text-foreground/80">
                    근력 약화 (무거운 것 들기 힘듦)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="paralysis" id="arm-paralysis" />
                  <Label htmlFor="arm-paralysis" className="font-normal text-foreground/80">
                    마비/절단 (한 손 또는 양손 사용 어려움)
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormWrapper>
  );
}

