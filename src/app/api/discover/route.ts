import { NextRequest, NextResponse } from "next/server";

// For now, we'll use a simple in-memory store with mock data
// In production, you'd use Prisma with Haversine distance calculation
const mockUsers = [
  { id: "1", name: "Alice Johnson", image: "https://randomuser.me/api/portraits/women/1.jpg", profession: "Software Engineer", lat: 37.7749, lng: -122.4194 },
  { id: "2", name: "Bob Smith", image: "https://randomuser.me/api/portraits/men/2.jpg", profession: "Designer", lat: 37.7849, lng: -122.4094 },
  { id: "3", name: "Carol Davis", image: "https://randomuser.me/api/portraits/women/3.jpg", profession: "Product Manager", lat: 37.7649, lng: -122.4294 },
  { id: "4", name: "David Wilson", image: "https://randomuser.me/api/portraits/men/4.jpg", profession: "Data Scientist", lat: 37.7849, lng: -122.4194 },
  { id: "5", name: "Eva Brown", image: "https://randomuser.me/api/portraits/women/5.jpg", profession: "Marketing", lat: 37.7749, lng: -122.4094 },
];

// Haversine distance calculation
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const radius = Number(searchParams.get("radius") ?? 1000); // meters
    const limit = Number(searchParams.get("limit") ?? 50);
    const me = searchParams.get("me"); // current user id to exclude

    if (!lat || !lng) {
      return NextResponse.json({ error: "lat,lng required" }, { status: 400 });
    }

    // Calculate distances and filter by radius
    const usersWithDistance = mockUsers
      .filter(user => user.id !== me) // Exclude current user
      .map(user => ({
        ...user,
        distance_m: calculateDistance(lat, lng, user.lat, user.lng)
      }))
      .filter(user => user.distance_m <= radius)
      .sort((a, b) => a.distance_m - b.distance_m)
      .slice(0, limit);

    return NextResponse.json(usersWithDistance);
  } catch (error) {
    console.error("Discover error:", error);
    return NextResponse.json({ error: "Failed to discover users" }, { status: 500 });
  }
}

