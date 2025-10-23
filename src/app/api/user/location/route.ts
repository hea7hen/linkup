import { NextRequest, NextResponse } from "next/server";

// For now, we'll use a simple in-memory store
// In production, you'd use Prisma with the database
const userLocations = new Map<string, { lat: number; lng: number; radius_m: number; updatedAt: Date }>();

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, radius_m, userId } = await req.json();
    
    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // Clamp & round for privacy
    const rlat = Math.round(lat * 1e5) / 1e5;
    const rlng = Math.round(lng * 1e5) / 1e5;
    const rradius = typeof radius_m === "number" ? Math.max(500, Math.min(2000, radius_m)) : 1000;

    // Store location (in production, use Prisma)
    userLocations.set(userId, {
      lat: rlat,
      lng: rlng,
      radius_m: rradius,
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      ok: true, 
      lat: rlat, 
      lng: rlng, 
      radius_m: rradius 
    });
  } catch (error) {
    console.error("Location save error:", error);
    return NextResponse.json({ error: "Failed to save location" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const location = userLocations.get(userId);
  if (!location) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  return NextResponse.json(location);
}

