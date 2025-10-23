"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, GraduationCap, FileText, Building, Heart, Linkedin, Instagram, Camera, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useLocation } from "@/hooks/useLocation";

interface UserProfile {
  name: string;
  profession: string;
  education: string;
  bio: string;
  company: string;
  hobbies: string;
  linkedin: string;
  instagram: string;
  profilePhoto: string;
  lat?: number;
  lng?: number;
  radius_m: number;
  locationUpdatedAt?: Date;
}

interface ProfileContentProps {
  user?: { name: string; email: string; picture: string } | null;
  onLocationUpdate?: (location: { lat: number; lng: number; radius_m: number }) => void;
}

export function ProfileContent({ user, onLocationUpdate }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    profession: "",
    education: "",
    bio: "",
    company: "",
    hobbies: "",
    linkedin: "",
    instagram: "",
    profilePhoto: "",
    radius_m: 1000,
  });
  const { getLocation, loading: locationLoading, error: locationError } = useLocation();
  const [locationStatus, setLocationStatus] = useState<string>("");

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || "",
        profilePhoto: user.picture || "",
      }));
    }
  }, [user]);

  const handleSave = () => {
    // In a real app, you would save to your database
    console.log("Saving profile:", profile);
    setIsEditing(false);
    alert("Profile saved successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleShareLocation = async () => {
    try {
      const { lat, lng } = await getLocation();
      const res = await fetch("/api/user/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          lat, 
          lng, 
          radius_m: profile.radius_m,
          userId: user?.email || "demo-user"
        }),
      });
      
      if (!res.ok) throw new Error("Failed to save location");
      
      const data = await res.json();
      setProfile(prev => ({
        ...prev,
        lat: data.lat,
        lng: data.lng,
        locationUpdatedAt: new Date(),
      }));
      
      // Notify parent component about location update
      onLocationUpdate?.({
        lat: data.lat,
        lng: data.lng,
        radius_m: profile.radius_m,
      });
      
      setLocationStatus("Location saved successfully!");
    } catch (e) {
      setLocationStatus("Could not get location. Please try again.");
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Setup
          </CardTitle>
          <CardDescription>
            Complete your profile information to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile.profilePhoto ? (
                <Image
                  src={profile.profilePhoto}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profile.name || "Your Name"}</h3>
              <p className="text-sm text-muted-foreground">Profile Photo</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <Label htmlFor="profession" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Profession
              </Label>
              <Input
                id="profession"
                value={profile.profession}
                onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., Software Engineer"
              />
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </Label>
              <Input
                id="education"
                value={profile.education}
                onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., Computer Science, MIT"
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company
              </Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., Google, Microsoft"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {/* Hobbies/Interests */}
            <div className="space-y-2">
              <Label htmlFor="hobbies" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Hobbies/Interests
              </Label>
              <Input
                id="hobbies"
                value={profile.hobbies}
                onChange={(e) => setProfile(prev => ({ ...prev, hobbies: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., Photography, Hiking, Reading"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={profile.linkedin}
                onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={profile.instagram}
                onChange={(e) => setProfile(prev => ({ ...prev, instagram: e.target.value }))}
                disabled={!isEditing}
                placeholder="https://instagram.com/yourname"
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Discovery
            </h3>
            
            <div className="space-y-4">
              {/* Radius Selector */}
              <div className="space-y-2">
                <Label htmlFor="radius" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Discovery Radius
                </Label>
                <select
                  id="radius"
                  value={profile.radius_m}
                  onChange={(e) => setProfile(prev => ({ ...prev, radius_m: Number(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={500}>500 m</option>
                  <option value={1000}>1 km</option>
                  <option value={1500}>1.5 km</option>
                  <option value={2000}>2 km</option>
                </select>
              </div>

              {/* Location Status */}
              {profile.lat && profile.lng && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  ✓ Location shared (last updated: {profile.locationUpdatedAt?.toLocaleString()})
                </div>
              )}

              {/* Share Location Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShareLocation}
                  disabled={locationLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {locationLoading ? "Getting location..." : "Share Location"}
                </button>
                
                {locationStatus && (
                  <span className={`text-sm ${locationStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {locationStatus}
                  </span>
                )}
              </div>

              {locationError && (
                <div className="text-sm text-red-600">
                  Error: {locationError}
                </div>
              )}

              <p className="text-xs text-gray-500">
                Share your location to discover people nearby. Your location is rounded for privacy.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
