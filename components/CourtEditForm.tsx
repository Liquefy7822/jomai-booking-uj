"use client";

import { useState, useEffect } from "react";
import { getAllCourts, updateCourt, addCourt } from "@/lib/data/courts";
import type { Court } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Plus, X } from "lucide-react";

interface CourtEditFormProps {
  courtId?: string; // If provided, edit existing court; if not, create new
  onSave: () => void;
  onCancel: () => void;
}

export function CourtEditForm({ courtId, onSave, onCancel }: CourtEditFormProps) {
  const [court, setCourt] = useState<Partial<Court>>({
    name: "",
    type: "badminton",
    location: "",
    description: "",
    imageUrl: "",
    amenities: [],
    pricePerHour: 0,
  });
  const [amenityInput, setAmenityInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (courtId) {
      const courts = getAllCourts();
      const existingCourt = courts.find(c => c.id === courtId);
      if (existingCourt) {
        setCourt(existingCourt);
      }
    }
  }, [courtId]);

  const handleInputChange = (field: keyof Court) => (value: any) => {
    setCourt(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !court.amenities?.includes(amenityInput.trim())) {
      setCourt(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()]
      }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setCourt(prev => ({
      ...prev,
      amenities: prev.amenities?.filter(a => a !== amenity) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!court.name || !court.location) {
        throw new Error("Name and location are required");
      }

      const courtData = {
        ...court,
        id: courtId || `court-${Date.now()}`,
        pricePerHour: Number(court.pricePerHour) || 0,
      } as Court;

      if (courtId) {
        await updateCourt(courtData);
        console.log("Court updated successfully");
      } else {
        await addCourt(courtData);
        console.log("Court added successfully");
      }

      setSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save court");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Save className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {courtId ? "Court Updated!" : "Court Created!"}
          </h2>
          <p className="text-muted-foreground">
            The court has been successfully saved to blob storage.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {courtId ? "Edit Court" : "Add New Court"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Court Name *</Label>
              <Input
                id="name"
                value={court.name || ""}
                onChange={(e) => handleInputChange("name")(e.target.value)}
                placeholder="e.g., Badminton Court 1"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Court Type</Label>
              <select
                id="type"
                value={court.type || "badminton"}
                onChange={(e) => handleInputChange("type")(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={isLoading}
              >
                <option value="badminton">Badminton</option>
                <option value="tennis">Tennis</option>
                <option value="basketball">Basketball</option>
                <option value="swimming">Swimming</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={court.location || ""}
              onChange={(e) => handleInputChange("location")(e.target.value)}
              placeholder="e.g., Tampines Hub, Level 2"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={court.description || ""}
              onChange={(e) => handleInputChange("description")(e.target.value)}
              placeholder="Describe the court facilities and features..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={court.imageUrl || ""}
              onChange={(e) => handleInputChange("imageUrl")(e.target.value)}
              placeholder="/courts/badminton-1.jpg"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerHour">Price per Hour (SGD)</Label>
            <Input
              id="pricePerHour"
              type="number"
              min="0"
              step="0.50"
              value={court.pricePerHour || ""}
              onChange={(e) => handleInputChange("pricePerHour")(e.target.value)}
              placeholder="8.00"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex gap-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g., Air-conditioned"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addAmenity}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {court.amenities && court.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {court.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {courtId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {courtId ? "Update Court" : "Create Court"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
