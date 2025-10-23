"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, User } from "lucide-react";
import Image from "next/image";

interface NearbyUser {
  id: string;
  name: string;
  image: string;
  profession: string;
  distance_m: number;
}

interface DiscoverContentProps {
  user?: { name: string; email: string; picture: string } | null;
  userLocation?: { lat: number; lng: number; radius_m: number } | null;
}

function formatDistance(m: number) {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export function DiscoverContent({ user, userLocation }: DiscoverContentProps) {
  const [users, setUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lng) {
      setUsers([]);
      return;
    }

    const fetchNearbyUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/discover?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${userLocation.radius_m}&me=${user?.email || "demo-user"}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch nearby users");
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load nearby users");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyUsers();
  }, [userLocation, user?.email]);

  if (!userLocation) {
    return (
      <div className="p-6 h-full overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Discover People
            </CardTitle>
            <CardDescription>
              Share your location in your profile to discover people nearby
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Go to your profile and share your location to start discovering people nearby.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Discover People
          </CardTitle>
          <CardDescription>
            People within {formatDistance(userLocation.radius_m)} of your location
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Finding people nearby...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No people found within your radius. Try expanding your search area in your profile.
              </p>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.profession}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {formatDistance(user.distance_m)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

