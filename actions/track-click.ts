"use server";

import { getServiceRoleClient } from "@/lib/supabase/service-role";

export async function trackClick(recommendationId: string) {
  const supabase = getServiceRoleClient();
  
  try {
    const { error } = await supabase
      .from("recommendations")
      .update({ is_clicked: true })
      .eq("id", recommendationId);

    if (error) {
        console.error("Supabase Track Click Error:", error);
    }
  } catch (error) {
    console.error("Failed to track click:", error);
  }
}

