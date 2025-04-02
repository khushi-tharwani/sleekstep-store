
import React from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { generateProductQRCode } from "@/utils/qr-generator";

interface QRCodeSectionProps {
  productId: string;
  qrCodeUrl: string | null;
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  setQrCodeUrl: (url: string) => void;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  productId,
  qrCodeUrl,
  showQRCode,
  setShowQRCode,
  setQrCodeUrl
}) => {
  const handleGenerateQRCode = async () => {
    try {
      const qrCode = await generateProductQRCode(productId);
      if (qrCode) {
        setQrCodeUrl(qrCode);
        toast({
          title: "QR Code Generated",
          description: "QR Code has been generated for this product",
        });
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* QR Code Display */}
      {showQRCode && qrCodeUrl && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">Product QR Code</h3>
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="Product QR Code" className="w-40 h-40" />
          </div>
        </div>
      )}
      
      {!qrCodeUrl && (
        <Button onClick={handleGenerateQRCode} variant="outline">
          Generate QR Code
        </Button>
      )}
      
      {qrCodeUrl && !showQRCode && (
        <Button onClick={() => setShowQRCode(true)} variant="outline">
          Show QR Code
        </Button>
      )}
    </div>
  );
};

export default QRCodeSection;
