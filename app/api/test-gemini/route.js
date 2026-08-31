// app/api/test-gemini/route.js

import { NextResponse } from "next/server";
import { getBoxOfficeData } from "@/lib/gemini";

export async function GET() {
  try {
    const data = await getBoxOfficeData("Pathaan", "2023");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Gemini test error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}