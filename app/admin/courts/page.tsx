"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllCourts, deleteCourt } from "@/lib/data/courts";
import { CourtEditForm } from "@/components/CourtEditForm";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Edit, 
  Trash2, 
  Plus, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon,
  Loader2 
} from "lucide-react";

export default function CourtManagementPage() {
  const [courts, setCourts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCourt, setEditingCourt] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      setIsLoading(true);
      const courtData = getAllCourts();
      setCourts(courtData);
    } catch (err) {
      setError("Failed to load courts from blob storage");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourt = async (courtId: string, courtName: string) => {
    if (!confirm(`Are you sure you want to delete "${courtName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCourt(courtId);
      await loadCourts(); // Refresh the list
    } catch (err) {
      setError("Failed to delete court");
      console.error(err);
    }
  };

  const handleSaveComplete = () => {
    setEditingCourt(null);
    setIsCreating(false);
    loadCourts(); // Refresh the list
  };

  if (editingCourt || isCreating) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
          <CourtEditForm
            courtId={editingCourt || undefined}
            onSave={handleSaveComplete}
            onCancel={() => {
              setEditingCourt(null);
              setIsCreating(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Court Management</h1>
            <p className="mt-1 text-muted-foreground">
              Manage badminton courts and facilities
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Court
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : courts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Courts Found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first court to the system.
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Court
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courts.map((court) => (
                <Card key={court.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{court.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {court.type}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCourt(court.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourt(court.id, court.name)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{court.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">${court.pricePerHour}/hour</span>
                      </div>

                      {court.imageUrl && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ImageIcon className="h-4 w-4" />
                          <span className="truncate">{court.imageUrl}</span>
                        </div>
                      )}

                      {court.amenities && court.amenities.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Amenities:</p>
                          <div className="flex flex-wrap gap-1">
                            {court.amenities.slice(0, 3).map((amenity: string) => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {court.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{court.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {court.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {court.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
