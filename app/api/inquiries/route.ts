import { NextResponse } from "next/server";
import { saveInquiry } from "../../../db/store";
import { validateInquiry } from "../../../lib/inquiry-validation.mjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }

  const checked = validateInquiry(body);

  if (!checked.ok || !checked.data) {
    return NextResponse.json(
      { error: checked.error },
      { status: 400 },
    );
  }

  try {
    const reference = await saveInquiry(checked.data);

    return NextResponse.json(
      { reference },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to save your enquiry." },
      { status: 503 },
    );
  }
}