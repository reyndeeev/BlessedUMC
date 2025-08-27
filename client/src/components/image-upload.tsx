
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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
      console.log('Uploading:', selectedFile.name);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Try to upload to our server endpoint (you'll need to add this route)
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        // Extract just the filename from the stored path
        const filename = result.filename.replace('images/', '');
        setUploadedFiles(prev => [...prev, filename]);
        alert(`Image uploaded successfully! URL: ${result.url}`);
      } else {
        throw new Error('Upload failed');
      }
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

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
            <div className="space-y-2">
              {uploadedFiles.map((fileName, index) => (
                <div key={index} className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <span>✓ {fileName}</span>
                  </div>
                  <img 
                    src={`/api/image/images/${fileName}`} 
                    alt={fileName}
                    className="mt-2 max-w-full h-20 object-cover rounded border"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
