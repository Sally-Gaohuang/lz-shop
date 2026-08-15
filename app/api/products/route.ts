import { NextResponse } from "next/server";
import { listProducts } from "../../../db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await listProducts();

    return NextResponse.json({
      products: result.results ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "Catalog unavailable." },
      { status: 503 },
    );
  }
}