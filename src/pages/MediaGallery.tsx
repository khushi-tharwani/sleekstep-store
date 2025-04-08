import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import VideoPlayer from '@/components/multimedia/VideoPlayer';
import ShakeDetector from '@/components/multimedia/ShakeDetector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, FileText, Calendar, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { videoApiService, VideoData } from '@/utils/mediaApis';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MediaGallery = () => {
  const [activeTab, setActiveTab] = useState<string>('videos');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newsTopic, setNewsTopic] = useState('sports');

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: () => videoApiService.getVideos(),
  });

  const { data: newsData = { articles: [] }, isLoading: isNewsLoading } = useQuery({
    queryKey: ['news', newsTopic],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-news-data', {
          body: { topic: newsTopic }
        });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to load news data');
        return { articles: [] };
      }
    },
    enabled: activeTab === 'news'
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load videos, please try again later');
      console.error('Video loading error:', error);
    }
  }, [error]);

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  const handleShake = () => {
    toast.success("Shake detected! Switching to a random video.");
    
    if (videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      setSelectedVideo(videos[randomIndex]);
      setOpenDialog(true);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Media Gallery</h1>
        
        <Tabs defaultValue="videos" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="stores">
              Nearby Stores
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            <ShakeDetector onShake={handleShake}>
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : videos.length > 0 ? (
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
              ) : (
                <div className="text-center py-12">
                  <p>No videos found</p>
                </div>
              )}
            </ShakeDetector>
          </TabsContent>
          
          <TabsContent value="photos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Photo gallery content here */}
              <div className="text-center py-12">
                <p>Photo gallery coming soon!</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="news">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Latest News</h2>
              <div className="flex gap-2 mb-6">
                <Button 
                  variant={newsTopic === 'sports' ? 'default' : 'outline'} 
                  onClick={() => setNewsTopic('sports')}
                >
                  Sports
                </Button>
                <Button 
                  variant={newsTopic === 'technology' ? 'default' : 'outline'} 
                  onClick={() => setNewsTopic('technology')}
                >
                  Technology
                </Button>
                <Button 
                  variant={newsTopic === 'default' ? 'default' : 'outline'} 
                  onClick={() => setNewsTopic('default')}
                >
                  General
                </Button>
              </div>
            </div>
            
            {isNewsLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : newsData.articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.articles.map((article: any) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{article.summary}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{article.source}</span>
                      <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          Read more
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p>No news articles found</p>
              </div>
            )}
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
  // Chembur, Mumbai coordinates
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
          Your Location
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
      
      <div className="mt-8 p-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium mb-2">Store Locations in Mumbai</h3>
          <p className="text-sm text-gray-500">Map of Mumbai store locations</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 rounded">
          <div className="aspect-[16/9] rounded relative overflow-hidden">
            <img 
              src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+3498db(72.9005,19.0522),pin-s+e74c3c(72.9035,19.0555),pin-s+e74c3c(72.8950,19.0480),pin-s+e74c3c(72.9050,19.0610),pin-s+e74c3c(72.9120,19.0790)/72.9005,19.0522,12,0/800x450?access_token=pk.eyJ1IjoibG92YWJsZXByb2plY3QiLCJhIjoiY2x3bzlpZHg2MDBpcjJrcXNjb25iaWpxcCJ9.A8W9pTSuWIJjMbN-K9XT9w" 
              alt="Map of Mumbai showing store locations"
              className="w-full h-full object-cover"
            />
            {/* Store markers are shown in the map image itself with pins */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
