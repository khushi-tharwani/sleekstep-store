
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { fetchProductByQRCode } from '@/utils/qr-generator';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// We're removing our custom Result interface since it doesn't match the library's type

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  // Update the handler to work with the library's result type
  const handleScan = async (result: any) => {
    if (result) {
      try {
        // Extract the text from the result based on the library's structure
        const scannedText = typeof result === 'string' ? result : result?.text;
        
        if (scannedText) {
          const product = await fetchProductByQRCode(scannedText);
          
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
        toast({
          title: 'Scanning Error',
          description: 'Unable to process the QR code.',
          variant: 'destructive'
        });
        setScanning(false);
      }
    }
  };

  const handleError = (error: Error) => {
    console.error(error);
    toast({
      title: 'Camera Error',
      description: 'Unable to access camera. Please check permissions.',
      variant: 'destructive'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Button 
        onClick={() => setScanning(!scanning)}
        className="mb-4 w-full"
      >
        {scanning ? 'Stop Scanning' : 'Start QR Scanner'}
      </Button>
      
      {scanning && (
        <div className="relative w-full aspect-square">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            scanDelay={500}
            containerStyle={{ width: '100%', height: '100%' }}
          />
          <div className="absolute inset-0 border-4 border-primary pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
