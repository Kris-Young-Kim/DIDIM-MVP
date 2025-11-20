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

export default function ADLForm() {
  const { control } = useFormContext();

  const options = [
    { value: "independent", label: "혼자서 가능함" },
    { value: "partial_help", label: "도구/도움이 있으면 가능함" },
    { value: "dependent", label: "전적인 도움이 필요함" },
  ];

  return (
    <FormWrapper title="일상생활 동작 (식사/목욕/옷입기)">
      {/* Eating */}
      <FormField
        control={control}
        name="adl.eating"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>식사하기</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {options.map((opt) => (
                  <div key={`eat-${opt.value}`} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={opt.value} id={`eat-${opt.value}`} />
                    <Label htmlFor={`eat-${opt.value}`} className="font-normal">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="my-4 border-t border-dashed border-gray-100" />

      {/* Dressing */}
      <FormField
        control={control}
        name="adl.dressing"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>옷 입고 벗기</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {options.map((opt) => (
                  <div key={`dress-${opt.value}`} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={opt.value} id={`dress-${opt.value}`} />
                    <Label htmlFor={`dress-${opt.value}`} className="font-normal">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="my-4 border-t border-dashed border-gray-100" />

      {/* Bathing */}
      <FormField
        control={control}
        name="adl.bathing"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>목욕/샤워하기</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {options.map((opt) => (
                  <div key={`bath-${opt.value}`} className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={opt.value} id={`bath-${opt.value}`} />
                    <Label htmlFor={`bath-${opt.value}`} className="font-normal">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormWrapper>
  );
}

