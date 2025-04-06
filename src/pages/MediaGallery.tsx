
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
                  src="https://video.fyvr3-4.fna.fbcdn.net/o1/v/t2/f1/m69/GESCMDVuWvWAJEEMAADFbQFRHSQwbSEZAAAF.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ht=video.fyvr3-4.fna.fbcdn.net&_nc_cat=109&vs=461990676213170_505770050&_nc_vs=HBksFQIYT2lnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyLzJGLzdFUUNNRFZ1V3ZXQUpFRU1BQURGYlFGUkhTUXdiU0VaQUFBRgUAAsgBABUAGCRHSmZkZ1FzTDNwR0VUX3dCQUNZb3d5RXNRY0FmYnBSMUFBQUYVAgLIAQBLBogScHJvZ3Jlc3NpdmVfcmVjaXBlATENc3Vic2FtcGxlX2ZwcwAQdm1hZl9lbmFibGVfbnN1YgAgbWVhc3VyZV9vcmlnaW5hbF9yZXNvbHV0aW9uX3NzaW0AKGNvbXB1dGVfc3NpbV9vbmx5X2F0X29yaWdpbmFsX3Jlc29sdXRpb24AEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcAAAmlrCr1Y6S4hAVAigCQzMYC3Z0c19wcmV2aWV3HBdAJfgAAAAAGBpkYXNoX2k0bGl0ZWJhc2ljXzVzZWNnb3BfaHEyX2ZyYWdfMl92aWRlbxIAGBh2aWRlb3MudnRzLmNhbGxiYWNrLnByb2Q4ElZJREVPX1ZJRVdfUkVRVUVTVBsKiBVvZW1fdGFyZ2V0X2VuY29kZV90YWcGb2VwX2hkE29lbV9yZXF1ZXN0X3RpbWVfbXMBMAxvZW1fY2ZnX3J1bGUHdW5tdXRlZBNvZW1fcm9pX3JlYWNoX2NvdW50ATARb2VtX2lzX2V4cGVyaW1lbnQADG9lbV92aWRlb19pZA80NzMzOTYwMDgyNTA5MzESb2VtX3ZpZGVvX2Fzc2V0X2lkDzQ2MTk5MDY3MjIxMzE3MBVvZW1fdmlkZW9fcmVzb3VyY2VfaWQPNDYxOTkwNjcyMjEzMTcwHG9lbV9zb3VyY2VfdmlkZW9fZW5jb2RpbmdfaWQPODA0MjQxODQwNzgxMjI1JQIcHBwXcQAVACUCKAJDMxgLdnRzX3ByZXZpZXccF0Al-AAAAAAYGmRhc2hfaTRsaXRlYmFzaWNfNXNlY2dvcF9ocTJfZnJhZ18yX3ZpZGVvEgAYGHZpZGVvcy52dHMuY2FsbGJhY2sucHJvZA%3D%3D&ccb=9-4&oh=00_AfBybC8t3DvfJdSCkP84Qv4yP9qrHAyzdju_ImN4m4QLSQ&oe=66D2E674&_nc_sid=b79e4f"
                  title="SleekStep Summer Collection"
                  poster="https://images.unsplash.com/photo-1549298916-b41d501d3772"
                />
                
                <VideoPlayer 
                  src="https://video.xx.fbcdn.net/v/t42.1790-2/254318353_881521589404483_8747734852836482180_n.mp4?_nc_cat=102&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=QULqBGDLz30AX-cvAmw&rl=300&vabr=131&_nc_ht=video.fevn1-4.fna&edm=AGo2L-IEAAAA&oh=00_AfC8BfbxZIg_uFnSLwT3o6PFDHhPVYp5z5ZB7mEDPgigRQ&oe=66D2ED63"
                  title="Running Shoes Technology"
                  poster="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
                />
                
                <VideoPlayer 
                  src="https://video.xx.fbcdn.net/v/t42.1790-2/10000000_1181013243030445_4235876566865613620_n.mp4?_nc_cat=101&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=9ry9zMvYgRAAX_ziyuD&rl=300&vabr=145&_nc_ht=video.fevn1-1.fna&edm=AGo2L-IEAAAA&oh=00_AfCSeAKmzI1c_7Zpy-TTPqoTcPK7Of95_KHq7qlY_nxx5Q&oe=66D2ED83"
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
                      src="https://video.xx.fbcdn.net/v/t42.1790-2/10000000_1050349679628013_3485877561140488007_n.mp4?_nc_cat=103&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=VFf6TqV4bQAAX-0JSGv&rl=300&vabr=123&_nc_ht=video.fevn1-2.fna&edm=AGo2L-IEAAAA&oh=00_AfC2bACT2CwcW-Dx1ZTuzTZnJ2c3Sg7RmVLjY_DDniRfHw&oe=66D2ED85"
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
                      src="https://video.xx.fbcdn.net/v/t42.1790-2/10000000_792358675404560_1110976673199289877_n.mp4?_nc_cat=109&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=QS34VGgprgMAX8Gui6d&rl=300&vabr=117&_nc_ht=video.fevn1-1.fna&edm=AGo2L-IEAAAA&oh=00_AfCz0WnPRxMEw38Tcqw0O_u5EQPDxheKt4l9ydq9yVULlA&oe=66D2ED4D"
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
                src="https://video.xx.fbcdn.net/v/t42.1790-2/10000000_1158664188343880_7394797518433701940_n.mp4?_nc_cat=104&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=QNqeZcW6UxsAX8itaSJ&rl=300&vabr=173&_nc_ht=video.fevn1-4.fna&edm=AGo2L-IEAAAA&oh=00_AfBEddxcLA2QY4Pfct543vG9eseenX40Xr3gRygYTAZqpQ&oe=66D2ED25"
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
