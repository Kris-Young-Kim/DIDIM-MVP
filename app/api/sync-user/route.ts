import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Clerk 사용자를 Supabase users 테이블에 동기화하는 API
 *
 * 클라이언트에서 로그인 후 이 API를 호출하여 사용자 정보를 Supabase에 저장합니다.
 * 이미 존재하는 경우 업데이트하고, 없으면 새로 생성합니다.
 */
export async function POST() {
  try {
    // Clerk 인증 확인
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clerk에서 사용자 정보 가져오기
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Supabase에 사용자 정보 동기화
    const supabase = getServiceRoleClient();

    // 먼저 기존 사용자 확인
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, clerk_id, name")
      .eq("clerk_id", clerkUser.id)
      .single();

    const userName =
      clerkUser.fullName ||
      clerkUser.username ||
      clerkUser.emailAddresses[0]?.emailAddress ||
      "Unknown";

    let data;
    let error;

    if (existingUser) {
      // 업데이트
      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update({ name: userName })
        .eq("clerk_id", clerkUser.id)
        .select()
        .single();
      data = updatedData;
      error = updateError;
    } else {
      // 새로 생성
      const { data: insertedData, error: insertError } = await supabase
        .from("users")
        .insert({
          clerk_id: clerkUser.id,
          name: userName,
        })
        .select()
        .single();
      data = insertedData;
      error = insertError;
    }

    if (error) {
      console.error("Supabase sync error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to sync user", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error("Sync user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
