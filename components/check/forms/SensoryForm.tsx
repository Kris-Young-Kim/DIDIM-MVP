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

export default function SensoryForm() {
  const { control } = useFormContext();

  return (
    <FormWrapper title="감각 (시각/청각) 상세 질문">
      <FormField
        control={control}
        name="sensory.visual_impairment"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>시각 장애 정도가 어떻게 되시나요?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="none" id="vis-none" />
                  <Label htmlFor="vis-none" className="font-normal">
                    해당 없음 (불편함 없음)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="low_vision" id="vis-low" />
                  <Label htmlFor="vis-low" className="font-normal">
                    저시력 (확대기 등이 필요함)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="blind" id="vis-blind" />
                  <Label htmlFor="vis-blind" className="font-normal">
                    전맹 (점자 또는 음성 지원 필요)
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="my-4" />

      <FormField
        control={control}
        name="sensory.hearing_impairment"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>청각 장애 정도가 어떻게 되시나요?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="none" id="hear-none" />
                  <Label htmlFor="hear-none" className="font-normal">
                    해당 없음
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="mild" id="hear-mild" />
                  <Label htmlFor="hear-mild" className="font-normal">
                    경증/난청 (증폭기 필요)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="severe" id="hear-severe" />
                  <Label htmlFor="hear-severe" className="font-normal">
                    중증 (수어 또는 필담 필요)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="deaf" id="hear-deaf" />
                  <Label htmlFor="hear-deaf" className="font-normal">
                    전농 (소리를 전혀 듣지 못함)
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

