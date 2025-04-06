
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import VideoPlayer from '@/components/multimedia/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MediaGallery = () => {
  const [activeTab, setActiveTab] = useState<string>('videos');

  const videos = [
    {
      id: '1',
      title: 'Shoe Product Showcase',
      description: 'Check out our newest collection of athletic shoes with premium features',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      duration: '1:45'
    },
    {
      id: '2',
      title: 'Running Techniques',
      description: 'Learn proper running techniques with our professional trainers',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
      duration: '2:30'
    },
    {
      id: '3',
      title: 'Shoe Maintenance Guide',
      description: 'How to properly care for and maintain your athletic footwear',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
      duration: '3:15'
    },
    {
      id: '4',
      title: 'Trending Sports Fashion',
      description: 'Explore the latest trends in sports fashion and athletic wear',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c',
      duration: '4:20'
    },
    {
      id: '5',
      title: 'Athlete Interviews',
      description: 'Exclusive interviews with professional athletes about their favorite gear',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      duration: '5:00'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Media Gallery</h1>
        
        <Tabs defaultValue="videos" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="bg-dark-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <VideoPlayer 
                      src={video.url} 
                      poster={video.thumbnail}
                      className="w-full aspect-video"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                    <p className="text-gray-400 text-sm">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="photos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Photo gallery content here */}
              <div className="text-center py-12">
                <p>Photo gallery coming soon!</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MediaGallery;
