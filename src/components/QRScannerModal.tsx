import { useQRScanner } from "@/features/shared/hooks/use-qr-scanner";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export default function QRScannerModal({
  visible,
  onClose,
  onScanSuccess,
}: QRScannerModalProps) {
  const {
    isScanning,
    scannedData,
    error,
    hasPermission,
    startScanning,
    stopScanning,
    resetScan,
    handleBarCodeScanned,
  } = useQRScanner();

  const [hasCalledSuccess, setHasCalledSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      startScanning();
      setHasCalledSuccess(false);
    } else {
      stopScanning();
      resetScan();
      setHasCalledSuccess(false);
    }
  }, [visible, startScanning, stopScanning, resetScan]);

  useEffect(() => {
    if (scannedData && !hasCalledSuccess) {
      setHasCalledSuccess(true);
      onScanSuccess(scannedData.data);
      // Reset after a short delay
      setTimeout(() => {
        resetScan();
        setHasCalledSuccess(false);
      }, 2000);
    }
  }, [scannedData, hasCalledSuccess, onScanSuccess, resetScan]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {!hasPermission ? (
          <View style={styles.permissionContainer}>
            <Ionicons name="camera-outline" size={64} color="#657c69" />
            <Text style={styles.permissionText}>
              Camera permission is required to scan QR codes
            </Text>
            <TouchableOpacity style={styles.button} onPress={startScanning}>
              <Text style={styles.buttonText}>Request Permission</Text>
            </TouchableOpacity>
          </View>
        ) : error ? (
          <View style={styles.permissionContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={startScanning}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={
                isScanning && !scannedData && !hasCalledSuccess
                  ? handleBarCodeScanned
                  : undefined
              }
            >
              <View style={styles.overlay}>
                {/* Top bar with close button */}
                <View style={styles.topBar}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                  >
                    <Ionicons name="close" size={28} color="#ffffff" />
                  </TouchableOpacity>
                </View>

                {/* Scanning frame */}
                <View style={styles.scanFrame}>
                  <View style={styles.frameContainer}>
                    {/* Top left corner */}
                    <View style={[styles.corner, styles.topLeft]} />
                    {/* Top right corner */}
                    <View style={[styles.corner, styles.topRight]} />
                    {/* Bottom left corner */}
                    <View style={[styles.corner, styles.bottomLeft]} />
                    {/* Bottom right corner */}
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsText}>
                    Position the QR code within the frame
                  </Text>
                </View>

                {/* Success indicator */}
                {scannedData && (
                  <View style={styles.successContainer}>
                    <View style={styles.successBox}>
                      <Ionicons
                        name="checkmark-circle"
                        size={48}
                        color="#16a34a"
                      />
                      <Text style={styles.successText}>QR Code Scanned!</Text>
                    </View>
                  </View>
                )}
              </View>
            </CameraView>
          </>
        )}

        {/* Loading indicator */}
        {isScanning && !scannedData && !error && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#16a34a" />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
  },
  frameContainer: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#16a34a",
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  successContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  successBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    minWidth: 200,
  },
  successText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#1a2e1f",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  permissionText: {
    marginTop: 20,
    fontSize: 16,
    color: "#657c69",
    textAlign: "center",
    marginBottom: 30,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
