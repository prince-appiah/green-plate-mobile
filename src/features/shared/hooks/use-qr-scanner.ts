import { useCallback, useRef, useState } from "react";
import { useCameraPermissions } from "./use-camera-permissions";

export interface QRScanResult {
  data: string;
  type: string;
}

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasScannedRef = useRef(false);
  const { hasPermission, requestPermission } = useCameraPermissions();

  const startScanning = useCallback(async () => {
    try {
      setError(null);
      setScannedData(null);
      hasScannedRef.current = false;

      // Check and request permission if needed
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          setError("Camera permission is required to scan QR codes");
          return false;
        }
      }

      setIsScanning(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start scanning";
      setError(errorMessage);
      setIsScanning(false);
      return false;
    }
  }, [hasPermission, requestPermission]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    hasScannedRef.current = false;
  }, []);

  const resetScan = useCallback(() => {
    setScannedData(null);
    setError(null);
    hasScannedRef.current = false;
  }, []);

  const handleBarCodeScanned = useCallback(({ data, type }: { data: string; type: string }) => {
    // Prevent multiple scans of the same code
    if (hasScannedRef.current) {
      return;
    }

    hasScannedRef.current = true;
    setScannedData({ data, type });
    setIsScanning(false);
  }, []);

  return {
    isScanning,
    scannedData,
    error,
    hasPermission,
    startScanning,
    stopScanning,
    resetScan,
    handleBarCodeScanned,
  };
}
