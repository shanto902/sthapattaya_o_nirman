import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  // If there is no token, return a 401
  if (!token || token !== process.env.ADMIN_TOKEN)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  // Revalidate All Posts
  revalidatePath(`/[lang]/[category]/[slug]`, "page");
  revalidatePath(`/[lang]/book-review/[slug]`, "page");
  // Revalidate All Categories
  revalidatePath(`/[lang]/[category]`, "page");
  // Revalidate All Languages
  revalidatePath(`/[lang]`, "page");
  revalidatePath(`/[lang]`, "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
