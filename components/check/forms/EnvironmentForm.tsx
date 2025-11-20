"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormWrapper from "./FormWrapper";

export default function EnvironmentForm() {
  const { control } = useFormContext();

  return (
    <FormWrapper title="환경 및 목표 설정">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="common.age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자 연령 (만 나이)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="예: 65"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="common.residence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>거주 지역 (시/군/구)</FormLabel>
              <FormControl>
                <Input placeholder="예: 서울시 강남구" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="my-4" />

      <FormField
        control={control}
        name="common.goal_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>보조기기를 통해 해결하고 싶은 어려움이나 목표</FormLabel>
            <FormControl>
              <Textarea
                placeholder="예: 혼자서 식사를 하고 싶어요. / 휠체어에서 침대로 이동하는 것이 너무 힘들어요."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormWrapper>
  );
}

