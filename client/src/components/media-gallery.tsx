
import React, { useState } from 'react';
import { Play, Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  src: string;
  thumbnail: string;
  description?: string;
  date: string;
}

export default function MediaGallery() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      title: 'Sunday Worship Service',
      src: '/attached_assets/image_1755699549465.png',
      thumbnail: '/attached_assets/image_1755699549465.png',
      description: 'Our beautiful sanctuary during Sunday worship',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'image',
      title: 'Youth Fellowship Activity',
      src: '/attached_assets/image_1755774215026.png',
      thumbnail: '/attached_assets/image_1755774215026.png',
      description: 'UMYF youth enjoying fellowship time',
      date: '2024-01-10'
    },
    {
      id: '3',
      type: 'image',
      title: 'Community Outreach',
      src: '/attached_assets/image_1755775748639.png',
      thumbnail: '/attached_assets/image_1755775748639.png',
      description: 'Serving our community with love',
      date: '2024-01-08'
    }
  ];

  const openModal = (media: MediaItem, index: number) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const nextMedia = () => {
    const nextIndex = (currentIndex + 1) % mediaItems.length;
    setCurrentIndex(nextIndex);
    setSelectedMedia(mediaItems[nextIndex]);
  };

  const prevMedia = () => {
    const prevIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    setCurrentIndex(prevIndex);
    setSelectedMedia(mediaItems[prevIndex]);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Media Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore moments of worship, fellowship, and community service through our photo and video collection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden"
              onClick={() => openModal(item, index)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
                  
                  {/* Media Type Icon */}
                  <div className="absolute top-4 right-4">
                    {item.type === 'video' ? (
                      <div className="bg-red-600 text-white p-2 rounded-full">
                        <Play size={16} />
                      </div>
                    ) : (
                      <div className="bg-methodist-blue text-white p-2 rounded-full">
                        <Image size={16} />
                      </div>
                    )}
                  </div>

                  {/* Play Button for Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Play className="text-white ml-1" size={32} />
                      </div>
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              {/* Close Button */}
              <Button
                onClick={closeModal}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <X size={24} />
              </Button>

              {/* Navigation Buttons */}
              <Button
                onClick={prevMedia}
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
              >
                <ChevronLeft size={24} />
              </Button>

              <Button
                onClick={nextMedia}
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
              >
                <ChevronRight size={24} />
              </Button>

              {/* Media Content */}
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedMedia.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedMedia.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedMedia.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
