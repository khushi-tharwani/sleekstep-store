
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { fetchProductByQRCode } from '@/utils/qr-generator';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (result: any) => {
    if (result) {
      try {
        // Extract the text from the result based on the library's structure
        const scannedText = typeof result === 'string' ? result : result?.text;
        
        if (scannedText) {
          console.log("Scanned QR code:", scannedText);
          
          // Extract product ID if it's a URL
          const productId = scannedText.includes('/product/') 
            ? scannedText.split('/product/').pop() 
            : scannedText;
            
          const product = await fetchProductByQRCode(productId);
          
          if (product) {
            toast({
              title: 'Product Found!',
              description: `Redirecting to ${product.name}`,
            });
            navigate(`/product/${product.id}`);
          } else {
            toast({
              title: 'Product Not Found',
              description: 'The scanned QR code does not match any product.',
              variant: 'destructive'
            });
          }
        }
        
        setScanning(false);
      } catch (error) {
        console.error("QR Scanning error:", error);
        toast({
          title: 'Scanning Error',
          description: 'Unable to process the QR code.',
          variant: 'destructive'
        });
        setScanning(false);
      }
    }
  };

  // This function will be passed to the onResult property
  // but will also handle errors internally
  const handleResult = async (result: any, error: any) => {
    if (error) {
      console.error("Camera error:", error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive'
      });
      setScanning(false);
      return;
    }
    
    // If no error, process the scan result
    await handleScan(result);
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setScanning(true);
    } catch (error) {
      console.error("Camera permission error:", error);
      toast({
        title: 'Camera Access Denied',
        description: 'Please grant camera permission to use the QR scanner.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Button 
        onClick={() => scanning ? setScanning(false) : requestCameraPermission()}
        className="mb-4 w-full"
      >
        {scanning ? 'Stop Scanning' : 'Start QR Scanner'}
      </Button>
      
      {scanning && (
        <div className="relative w-full aspect-square">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleResult}
            scanDelay={500}
            containerStyle={{ width: '100%', height: '100%' }}
            videoStyle={{ width: '100%', height: '100%' }}
            videoId="qr-video-element"
          />
          <div className="absolute inset-0 border-4 border-primary pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
