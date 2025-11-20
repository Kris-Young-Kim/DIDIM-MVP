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

    const userName =
      clerkUser.fullName ||
      clerkUser.username ||
      clerkUser.emailAddresses[0]?.emailAddress ||
      "Unknown";

    // 스키마 캐시 문제를 피하기 위해 전체 컬럼 조회
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", clerkUser.id)
      .maybeSingle();

    // 조회 에러는 무시하고 계속 진행 (테이블이 없거나 스키마 문제일 수 있음)
    if (selectError) {
      console.warn("User select error (will try insert):", selectError);
    }

    let data;
    let error;

    if (existingUser && existingUser.id) {
      // 기존 사용자 업데이트
      console.log("Updating existing user:", existingUser.id);
      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update({ name: userName })
        .eq("id", existingUser.id)
        .select()
        .single();
      data = updatedData;
      error = updateError;
    } else {
      // 새로 생성 (또는 upsert 시도)
      console.log("Inserting new user with clerk_user_id:", clerkUser.id);
      
      // 먼저 insert 시도
      const { data: insertedData, error: insertError } = await supabase
        .from("users")
        .insert({
          clerk_user_id: clerkUser.id,
          name: userName,
        })
        .select()
        .single();
      
      // insert 실패 시 (중복 키 에러 등) update 시도
      if (insertError && insertError.code === "23505") {
        console.log("Duplicate key error, trying update instead");
        const { data: updatedData, error: updateError } = await supabase
          .from("users")
          .update({ name: userName })
          .eq("clerk_user_id", clerkUser.id)
          .select()
          .single();
        data = updatedData;
        error = updateError;
      } else {
        data = insertedData;
        error = insertError;
      }
    }

    if (error) {
      console.error("Supabase sync error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      console.error("Full error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          error: "Failed to sync user", 
          details: error.message || error.code || "Unknown error",
          code: error.code
        },
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
