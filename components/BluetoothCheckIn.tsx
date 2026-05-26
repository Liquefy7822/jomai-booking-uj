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

    // Simulate Bluetooth discovery and connection process (faster)
    try {
      // Step 1: Scanning for nearby devices (0.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Found court device, attempting connection (0.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Verifying court location (0.3 seconds)
      await new Promise(resolve => setTimeout(resolve, 300));

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
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Bluetooth className="h-5 w-5 text-primary" />;
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
    <Card className="border-primary/25 bg-accent/40 text-card-foreground dark:border-primary/30 dark:bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Bluetooth className="h-5 w-5 text-primary" />
          Court Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-card-foreground">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">{courtName}</p>
            <p className="text-sm text-foreground/75 dark:text-card-foreground/90">
              Booking ID: {bookingId}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-foreground dark:text-card-foreground">
              {getStatusText()}
            </span>
          </div>
        </div>

        {connectionStatus === 'idle' && (
          <div className="space-y-3">
            <p className="text-sm text-foreground/80 dark:text-card-foreground/90">
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
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-foreground dark:text-card-foreground">
                  Scanning for nearby court devices...
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 animate-pulse rounded-full bg-primary"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
            <p className="text-xs text-foreground/75 dark:text-card-foreground/90">
              Make sure you&apos;re within 10 meters of the court and Bluetooth is enabled.
            </p>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
            <BluetoothConnected className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              <strong>Check-in successful!</strong> You have been verified at {courtName}.
              Your booking is now active. Enjoy your game!
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === 'failed' && (
          <div className="space-y-3">
            <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50">
              <BluetoothOff className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-red-900 dark:text-red-100">
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

        <div className="border-t border-border pt-3 text-xs text-foreground/80 dark:text-card-foreground/90">
          <p className="font-medium text-foreground dark:text-card-foreground">
            How it works:
          </p>
          <ul className="mt-1 space-y-1">
            <li>• Ensure Bluetooth is enabled on your device</li>
            <li>• Be within 10 meters of the booked court</li>
            <li>• Tap &quot;Check In&quot; to verify your location</li>
            <li>• System confirms your presence automatically</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
