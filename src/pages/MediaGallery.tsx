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
      title: 'SleekStep Pro Running Shoes Review',
      description: 'Professional athlete reviewing our latest running shoe technology',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-professional-skier-descending-a-slope-7203-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      duration: '1:45'
    },
    {
      id: '2',
      title: 'Marathon Training with SleekStep',
      description: 'Training guide featuring our cushioned marathon running shoes',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-runner-at-sunset-5361-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
      duration: '2:30'
    },
    {
      id: '3',
      title: 'Shoe Care & Maintenance Guide',
      description: 'How to properly care for and extend the life of your athletic footwear',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-tying-shoes-on-a-trail-4823-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
      duration: '3:15'
    },
    {
      id: '4',
      title: 'Sneaker Customization Workshop',
      description: 'Learn how to customize your shoes with our design experts',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-in-a-shoe-store-5750-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c',
      duration: '4:20'
    },
    {
      id: '5',
      title: 'History of Sneaker Culture',
      description: 'The evolution of athletic footwear and street fashion',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-view-of-sport-shoes-and-grass-40128-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      duration: '5:00'
    },
    {
      id: '6',
      title: 'Kids Sports Shoes Selection Guide',
      description: 'How to choose the right athletic shoes for growing feet',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-a-girl-in-the-garden-at-sunset-4653-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2',
      duration: '2:15'
    },
    {
      id: '7',
      title: 'Eco-Friendly Footwear Manufacturing',
      description: 'Behind the scenes of our sustainable shoe production',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-walking-in-line-across-a-mountain-4809-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
      duration: '3:45'
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
            <TabsTrigger value="stores">
              Nearby Stores
            </TabsTrigger>
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Find Nearby Stores</h2>
              <p className="text-gray-500">These stores are currently closest to your location:</p>
            </div>
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
  // Updated to use Chembur, Mumbai coordinates
  const userLocation = {
    name: "Chembur, Mumbai",
    coordinates: { lat: 19.0522, lng: 72.9005 }
  };
  
  const stores = [
    {
      id: 1,
      name: "SleekStep Chembur Mall",
      address: "123 RC Marg, Chembur East, Mumbai 400071",
      coordinates: { lat: 19.0555, lng: 72.9035 },
      hours: "10:00 AM - 9:00 PM",
      phone: "(022) 5551-1234",
      distance: "0.5 km"
    },
    {
      id: 2,
      name: "SleekStep Sports Hub",
      address: "456 Sion-Trombay Road, Chembur West, Mumbai 400071",
      coordinates: { lat: 19.0480, lng: 72.8950 },
      hours: "9:30 AM - 8:30 PM",
      phone: "(022) 5552-5678",
      distance: "1.2 km"
    },
    {
      id: 3,
      name: "SleekStep Premium Store",
      address: "789 Diamond Garden, Chembur, Mumbai 400074",
      coordinates: { lat: 19.0610, lng: 72.9050 },
      hours: "11:00 AM - 10:00 PM",
      phone: "(022) 5553-9012",
      distance: "1.8 km"
    },
    {
      id: 4,
      name: "SleekStep Factory Outlet",
      address: "321 Ghatkopar West, Mumbai 400086",
      coordinates: { lat: 19.0790, lng: 72.9120 },
      hours: "10:00 AM - 7:00 PM",
      phone: "(022) 5554-3456",
      distance: "3.1 km"
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Your Location (Static Sample)
        </h3>
        <p className="text-sm text-green-700 dark:text-green-400">
          {userLocation.name} | Coordinates: {userLocation.coordinates.lat.toFixed(4)}° N, {userLocation.coordinates.lng.toFixed(4)}° E
        </p>
      </div>
      
      <div className="grid gap-4">
        {stores.map((store) => (
          <div key={store.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg mb-1">{store.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{store.address}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Hours: {store.hours}</span>
                  <span>Phone: {store.phone}</span>
                </div>
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {store.distance}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium mb-2">Store Locations in Chembur</h3>
          <p className="text-sm text-gray-500">Static map representation of store locations</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 rounded">
          <div className="aspect-[16/9] bg-blue-100 dark:bg-blue-900/20 rounded relative">
            {/* Static map representation with Chembur's marker position */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" title="Your location"></div>
            </div>
            {stores.map((store) => (
              <div 
                key={store.id}
                className="absolute w-3 h-3 bg-primary rounded-full"
                style={{ 
                  left: `${(((store.coordinates.lng - userLocation.coordinates.lng) / 0.05) * 10) + 50}%`, 
                  top: `${(((store.coordinates.lat - userLocation.coordinates.lat) / 0.05) * 10) + 50}%` 
                }}
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {store.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
