
import React from 'react';
import Layout from '@/components/layout/Layout';
import VideoPlayer from '@/components/multimedia/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MediaGallery: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Footwear Media Gallery</h1>
        
        <div className="grid gap-8">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="videos">Product Videos</TabsTrigger>
              <TabsTrigger value="presentations">Brand Story</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <VideoPlayer 
                  src="https://www.shutterstock.com/shutterstock/videos/1094966206/preview/stock-footage-sport-running-shoes-close-up-banner-athlete-standing-on-road-at-sunset-mountain-active-life-sport.mp4"
                  title="SleekStep Summer Collection"
                  poster="https://images.unsplash.com/photo-1549298916-b41d501d3772"
                />
                
                <VideoPlayer 
                  src="https://www.shutterstock.com/shutterstock/videos/1061087567/preview/stock-footage-women-tying-shoes-and-starting-to-run-during-sunset-time-female-athlete-preparing-for-running.mp4"
                  title="Running Shoes Technology"
                  poster="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
                />
                
                <VideoPlayer 
                  src="https://www.shutterstock.com/shutterstock/videos/1068903895/preview/stock-footage-closeup-of-man-tying-sport-shoes-and-starting-running-on-road-at-sunset-male-runner-jogger.mp4"
                  title="Lifestyle Footwear Showcase"
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
                      src="https://www.shutterstock.com/shutterstock/videos/1046689489/preview/stock-footage-production-of-mens-shoes-on-a-shoe-factory-sewing-a-leather-shoe-on-a-sewing-machine-inside-shoe.mp4"
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
                      src="https://www.shutterstock.com/shutterstock/videos/1069980336/preview/stock-footage-worker-footwear-factory-puts-shoes-in-box-man-hands-packing-new-stylish-brown-leather-boots-in.mp4"
                      poster="https://images.unsplash.com/photo-1606045604216-2ce9db8a3420"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Master Craftsmanship</h2>
            <div className="max-w-4xl mx-auto">
              <VideoPlayer 
                src="https://www.shutterstock.com/shutterstock/videos/1042866255/preview/stock-footage-closeup-of-shoemaker-hands-sewing-leather-shoe-by-hand-cobbler-in-workshop-making-exclusive-footwear.mp4"
                title="The Art of Shoemaking: From Design to Product"
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
