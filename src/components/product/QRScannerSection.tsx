
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import QRScanner from "@/components/QRScanner";

interface QRScannerSectionProps {
  onClose: () => void;
}

const QRScannerSection: React.FC<QRScannerSectionProps> = ({ onClose }) => {
  const [scanningActive, setScanningActive] = useState(false);

  return (
    <div className="mb-6 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Scan Product QR Code</h2>
        <Button 
          onClick={onClose}
          variant="outline"
          size="sm"
        >
          Close Scanner
        </Button>
      </div>
      
      <QRScanner />
      
      <p className="text-sm text-muted-foreground mt-4">
        Position the QR code within the frame to scan. Make sure you've granted camera permissions.
      </p>
    </div>
  );
};

export default QRScannerSection;
