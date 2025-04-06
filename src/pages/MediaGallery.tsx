import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import VideoPlayer from '@/components/multimedia/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const MediaGallery = () => {
  const [activeTab, setActiveTab] = useState<string>('videos');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Media Gallery</h1>
        
        <Tabs defaultValue="videos" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="stores">Nearby Stores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className="bg-dark-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                      <Play className="h-12 w-12 text-white opacity-80" />
                    </div>
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
          
          <TabsContent value="stores">
            <NearbyStoresMap />
          </TabsContent>
        </Tabs>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-dark-100">
            {selectedVideo && (
              <div className="w-full">
                <VideoPlayer 
                  src={selectedVideo.url}
                  title={selectedVideo.title}
                  autoplay={true}
                  poster={selectedVideo.thumbnail}
                  className="w-full"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{selectedVideo.title}</h2>
                  <p className="text-gray-400">{selectedVideo.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

const NearbyStoresMap = () => {
  const stores = [
    {
      id: 1,
      name: "SleekStep Flagship Store",
      address: "123 Fashion Ave, New York, NY 10001",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      hours: "9:00 AM - 9:00 PM",
      phone: "(212) 555-1234",
    },
    {
      id: 2,
      name: "SleekStep Outlet",
      address: "456 Discount Blvd, Brooklyn, NY 11201",
      coordinates: { lat: 40.6782, lng: -73.9442 },
      hours: "10:00 AM - 8:00 PM",
      phone: "(718) 555-5678",
    },
    {
      id: 3,
      name: "SleekStep Sport Center",
      address: "789 Athletic St, Queens, NY 11101",
      coordinates: { lat: 40.7442, lng: -73.9489 },
      hours: "8:00 AM - 10:00 PM",
      phone: "(347) 555-9012",
    },
    {
      id: 4,
      name: "SleekStep Premium Collection",
      address: "321 Luxury Lane, Manhattan, NY 10022",
      coordinates: { lat: 40.7580, lng: -73.9855 },
      hours: "11:00 AM - 7:00 PM",
      phone: "(212) 555-3456",
    },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Find Nearby Stores</h2>
      <p className="text-gray-500 mb-6">
        Visit one of our physical stores to try on our shoes and get expert advice from our staff.
        These locations are based on our most popular stores.
      </p>
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8">
        <h3 className="font-medium mb-2">Your Location (Example)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          New York City, NY
        </p>
      </div>
      
      <div className="grid gap-4">
        {stores.map((store) => (
          <div key={store.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h3 className="font-bold text-lg mb-1">{store.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{store.address}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Hours: {store.hours}</span>
              <span>Phone: {store.phone}</span>
              <span>Coordinates: {store.coordinates.lat.toFixed(4)}, {store.coordinates.lng.toFixed(4)}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-center">
        <p className="text-gray-500">
          Static map view - Using predetermined coordinates
        </p>
        <p className="text-sm text-gray-400 mt-2">
          (To view an interactive map, please visit our website)
        </p>
      </div>
    </div>
  );
};

export default MediaGallery;
