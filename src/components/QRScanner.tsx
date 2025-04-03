
import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { fetchProductByQRCode } from '@/utils/qr-generator';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const navigate = useNavigate();

  // Check for camera permissions on component mount
  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as any });
        setCameraPermission(permissionStatus.state === 'granted');
        
        // Listen for permission changes
        permissionStatus.addEventListener('change', () => {
          setCameraPermission(permissionStatus.state === 'granted');
        });
      } catch (error) {
        console.log('Permission API not supported, will check on camera access');
        setCameraPermission(null);
      }
    };
    
    checkCameraPermissions();
  }, []);

  const handleScan = async (result: any) => {
    if (result && !hasScanned) {
      try {
        // Set hasScanned to prevent multiple scans of the same QR code
        setHasScanned(true);
        
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
        
        // Allow scanning again after a short delay
        setTimeout(() => {
          setHasScanned(false);
        }, 2000);
        
        setScanning(false);
      } catch (error) {
        console.error("QR Scanning error:", error);
        toast({
          title: 'Scanning Error',
          description: 'Unable to process the QR code.',
          variant: 'destructive'
        });
        setScanning(false);
        setHasScanned(false);
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
      setCameraPermission(true);
      setHasScanned(false);
    } catch (error) {
      console.error("Camera permission error:", error);
      setCameraPermission(false);
      toast({
        title: 'Camera Access Denied',
        description: 'Please grant camera permission to use the QR scanner.',
        variant: 'destructive'
      });
    }
  };

  const resetScanner = () => {
    setScanning(false);
    setHasScanned(false);
    setTimeout(() => {
      requestCameraPermission();
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <Button 
          onClick={() => scanning ? setScanning(false) : requestCameraPermission()}
          className="flex items-center justify-center gap-2"
          variant={scanning ? "destructive" : "default"}
        >
          {scanning ? (
            <>
              <CameraOff className="h-4 w-4" />
              Stop Scanning
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Start QR Scanner
            </>
          )}
        </Button>
        
        {scanning && (
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden">
              <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={handleResult}
                scanDelay={500}
                containerStyle={{ width: '100%', height: '100%' }}
                videoStyle={{ width: '100%', height: '100%' }}
                videoId="qr-video-element"
              />
              <div className="absolute inset-0 border-4 border-primary pointer-events-none"></div>
              
              <Button
                onClick={resetScanner}
                className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white bg-opacity-50 hover:bg-opacity-70"
                size="icon"
                variant="outline"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              Position a QR code within the frame to scan
            </p>
          </div>
        )}
        
        {cameraPermission === false && (
          <div className="p-4 border border-destructive rounded-md bg-destructive/10 text-sm">
            <p>Camera permission denied. Please enable camera access in your browser settings and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
