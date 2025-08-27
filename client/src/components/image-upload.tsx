
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // Here you would upload to Object Storage
      // For now, we'll just show the preview
      console.log('Uploading:', selectedFile.name);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="cursor-pointer"
        />
        
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </CardContent>
    </Card>
  );
}
