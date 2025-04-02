
import React from "react";
import { Button } from "@/components/ui/button";
import QRScanner from "@/components/QRScanner";

interface QRScannerSectionProps {
  onClose: () => void;
}

const QRScannerSection: React.FC<QRScannerSectionProps> = ({ onClose }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Scan Product QR Code</h2>
      <QRScanner />
      <Button 
        onClick={onClose}
        className="mt-4"
        variant="outline"
      >
        Close Scanner
      </Button>
    </div>
  );
};

export default QRScannerSection;
