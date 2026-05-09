"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bluetooth, BluetoothConnected, BluetoothOff, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface BluetoothCheckInProps {
  courtName: string;
  bookingId: string;
  onCheckInComplete?: (success: boolean) => void;
}

export function BluetoothCheckIn({ courtName, bookingId, onCheckInComplete }: BluetoothCheckInProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");

  const simulateBluetoothConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage("");

    // Simulate Bluetooth discovery and connection process
    try {
      // Step 1: Scanning for nearby devices (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Found court device, attempting connection (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: Verifying court location (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Random success/failure for demo (80% success rate)
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setConnectionStatus('connected');
        onCheckInComplete?.(true);
      } else {
        setConnectionStatus('failed');
        setErrorMessage("Unable to verify court location. Please ensure you're at the court and try again.");
        onCheckInComplete?.(false);
      }
    } catch (error) {
      setConnectionStatus('failed');
      setErrorMessage("Bluetooth connection failed. Please ensure Bluetooth is enabled.");
      onCheckInComplete?.(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const resetConnection = () => {
    setConnectionStatus('idle');
    setErrorMessage("");
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bluetooth className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return "Connecting to court...";
      case 'connected':
        return "Successfully checked in!";
      case 'failed':
        return "Check-in failed";
      default:
        return "Ready to check in";
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bluetooth className="h-5 w-5" />
          Court Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{courtName}</p>
            <p className="text-sm text-muted-foreground">Booking ID: {bookingId}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        {connectionStatus === 'idle' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Verify your presence at the court using Bluetooth for secure check-in.
            </p>
            <Button 
              onClick={simulateBluetoothConnection}
              className="w-full"
              disabled={isConnecting}
            >
              <Bluetooth className="mr-2 h-4 w-4" />
              Check In with Bluetooth
            </Button>
          </div>
        )}

        {connectionStatus === 'connecting' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Scanning for nearby court devices...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Make sure you're within 10 meters of the court and Bluetooth is enabled.
            </p>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <Alert className="border-green-200 bg-green-50">
            <BluetoothConnected className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Check-in successful!</strong> You have been verified at {courtName}. 
              Your booking is now active. Enjoy your game!
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === 'failed' && (
          <div className="space-y-3">
            <Alert className="border-red-200 bg-red-50">
              <BluetoothOff className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={resetConnection}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-3">
          <p className="font-medium">How it works:</p>
          <ul className="mt-1 space-y-1">
            <li>• Ensure Bluetooth is enabled on your device</li>
            <li>• Be within 10 meters of the booked court</li>
            <li>• Tap "Check In" to verify your location</li>
            <li>• System confirms your presence automatically</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
