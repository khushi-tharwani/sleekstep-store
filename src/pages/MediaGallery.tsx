
import React from 'react';
import Layout from '@/components/layout/Layout';
import VideoPlayer from '@/components/multimedia/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MediaGallery: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Media Gallery</h1>
        
        <div className="grid gap-8">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="videos">Product Videos</TabsTrigger>
              <TabsTrigger value="presentations">Presentations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <VideoPlayer 
                  src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
                  title="Latest Sneaker Collection"
                  poster="https://images.unsplash.com/photo-1549298916-b41d501d3772"
                />
                
                <VideoPlayer 
                  src="https://samplelib.com/lib/preview/mp4/sample-10s.mp4"
                  title="Fashion Footwear 2025"
                  poster="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
                />
                
                <VideoPlayer 
                  src="https://samplelib.com/lib/preview/mp4/sample-15s.mp4"
                  title="Athletic Performance Shoes"
                  poster="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="presentations">
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>SleekStep Origins</CardTitle>
                    <CardDescription>The story behind our premium footwear brand</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer 
                      src="https://samplelib.com/lib/preview/mp4/sample-20s.mp4"
                      poster="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Eco-Friendly Manufacturing</CardTitle>
                    <CardDescription>Our commitment to sustainable footwear production</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer 
                      src="https://samplelib.com/lib/preview/mp4/sample-30s.mp4"
                      poster="https://images.unsplash.com/photo-1606045604216-2ce9db8a3420"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">The Art of Shoemaking</h2>
            <div className="max-w-4xl mx-auto">
              <VideoPlayer 
                src="https://samplelib.com/lib/preview/mp4/sample-30s.mp4"
                title="Master Craftsmanship: From Design to Product"
                poster="https://images.unsplash.com/photo-1591047139829-d91aecb6caea"
                className="w-full"
              />
              
              <div className="mt-4 prose dark:prose-invert max-w-none">
                <h3>Premium Footwear Craftsmanship</h3>
                <p>This documentary takes you behind the scenes of our manufacturing process, showing the careful craftsmanship that goes into every pair of SleekStep shoes we make. From the selection of premium materials to the skilled artisans who bring our designs to life, discover why our footwear stands the test of time.</p>
                <p>Our commitment to quality begins with the materials we source globally, continues through our innovative design process, and culminates in the meticulous assembly by master craftspeople. Watch to learn more about the 200+ steps involved in creating a single pair of our signature shoes.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default MediaGallery;
