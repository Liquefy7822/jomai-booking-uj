"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Camera, X, Loader2 } from "lucide-react";

interface ProfilePictureUploadProps {
  currentPicture?: string;
  onPictureChange: (pictureUrl: string) => void;
  maxSize?: number; // in MB
}

export function ProfilePictureUpload({ 
  currentPicture, 
  onPictureChange, 
  maxSize = 5 
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // In a real app, you'd upload to Vercel Blob or another storage service
      // For demo, we'll create a data URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const imageUrl = URL.createObjectURL(file);
      onPictureChange(imageUrl);
      
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removePicture = () => {
    setPreview(null);
    onPictureChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Upload a profile picture (max {maxSize}MB)
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center space-y-4">
            {/* Preview/Current Picture */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                {preview || currentPicture ? (
                  <img
                    src={preview || currentPicture}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {(preview || currentPicture) && (
                <button
                  type="button"
                  onClick={removePicture}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileSelect}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Picture
                  </>
                )}
              </Button>

              {preview && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => onPictureChange(preview)}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    Save Picture
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreview(null)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Supported formats: JPG, PNG, GIF, WebP
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
