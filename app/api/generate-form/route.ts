import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { auth } from "@clerk/nextjs/server";

/**
 * 신청서 PDF 생성 및 Supabase Storage 업로드
 * 
 * POST /api/generate-form
 * Body: { applicationId: string }
 */
export async function POST(request: NextRequest) {
  console.group("[API] generate-form Start");

  try {
    // 1. 인증 확인
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 요청 본문 파싱
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    console.log("Application ID:", applicationId);

    const supabase = getServiceRoleClient();

    // 3. Application 정보 조회
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select(`
        id,
        user_id,
        program_id,
        generated_content,
        users!inner(clerk_user_id),
        welfare_programs!inner(ministry, program_name)
      `)
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      console.error("Application fetch error:", appError);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // 4. 사용자 권한 확인 (본인의 신청서만 생성 가능)
    if (application.users.clerk_user_id !== clerkUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("Application data:", {
      id: application.id,
      program: application.welfare_programs.program_name,
    });

    // 5. PDF 생성
    const pdfBytes = await generatePDF({
      program: application.welfare_programs,
      generatedContent: application.generated_content,
      applicationId: application.id,
    });

    console.log("PDF generated, size:", pdfBytes.length, "bytes");

    // 6. Supabase Storage에 업로드
    const fileName = `application_${application.id}_${Date.now()}.pdf`;
    const filePath = `${clerkUserId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: false, // 기존 파일 덮어쓰기 방지
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `파일 업로드 실패: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log("File uploaded:", uploadData.path);

    // 7. 다운로드 URL 생성 (signed URL 사용 - private bucket이므로)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("uploads")
      .createSignedUrl(filePath, 3600); // 1시간 유효

    if (signedUrlError) {
      console.error("Signed URL creation error:", signedUrlError);
      // Fallback: public URL 시도
      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);
      var downloadUrl = urlData.publicUrl;
    } else {
      var downloadUrl = signedUrlData.signedUrl;
    }

    console.log("Download URL:", downloadUrl);

    // 8. applications 테이블의 file_url 업데이트
    const { error: updateError } = await supabase
      .from("applications")
      .update({ file_url: downloadUrl })
      .eq("id", applicationId);

    if (updateError) {
      console.error("Update file_url error:", updateError);
      // 업로드는 성공했으므로 경고만 하고 계속 진행
      console.warn("Failed to update file_url, but file is uploaded");
    }

    console.groupEnd();

    return NextResponse.json({
      success: true,
      fileUrl: downloadUrl,
      applicationId: application.id,
    });
  } catch (error) {
    console.groupEnd();
    console.error("[API] generate-form Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "PDF 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * PDF 문서 생성
 */
async function generatePDF(params: {
  program: { ministry: string; program_name: string };
  generatedContent: any;
  applicationId: string;
}): Promise<Uint8Array> {
  const { program, generatedContent, applicationId } = params;

  // PDF 문서 생성
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 크기 (포인트 단위)
  const { width, height } = page.getSize();

  // 폰트 로드
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // 여백 설정
  const margin = 50;
  let yPosition = height - margin;

  // 제목
  page.drawText(program.program_name, {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // 부처명
  page.drawText(`지원 부처: ${program.ministry}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 30;

  // 구분선
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  yPosition -= 30;

  // 본문 내용
  const content = generatedContent?.full_text || generatedContent?.necessity || "내용 없음";
  const lines = wrapText(content, width - margin * 2, font, 11);

  for (const line of lines) {
    if (yPosition < margin + 50) {
      // 새 페이지 추가
      const newPage = pdfDoc.addPage([595, 842]);
      yPosition = height - margin;
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
    } else {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
    }
    yPosition -= 15;
  }

  // 하단 정보
  yPosition = margin + 30;
  page.drawText(`생성일시: ${new Date().toLocaleString("ko-KR")}`, {
    x: margin,
    y: yPosition,
    size: 9,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText(`신청서 ID: ${applicationId}`, {
    x: margin,
    y: yPosition - 15,
    size: 9,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // PDF 바이트 반환
  return await pdfDoc.save();
}

/**
 * 텍스트를 PDF 페이지 너비에 맞게 줄바꿈
 */
function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

