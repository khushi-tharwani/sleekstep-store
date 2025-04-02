
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
        const product = await fetchProductByQRCode(result.text);
        
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

  const handleError = (err: any) => {
    console.error(err);
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
            onError={handleError}
            containerStyle={{ width: '100%', height: '100%' }}
          />
          <div className="absolute inset-0 border-4 border-primary pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
