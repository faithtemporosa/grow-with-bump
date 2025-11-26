import { AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { useEffect, useState } from "react";

export const ConnectionStatusBanner = () => {
  const { isOnline, checkConnection } = useConnectionStatus();
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && !justReconnected) {
      // Show reconnection message briefly
      const wasOffline = sessionStorage.getItem('was-offline');
      if (wasOffline === 'true') {
        setJustReconnected(true);
        sessionStorage.removeItem('was-offline');
        setTimeout(() => setJustReconnected(false), 3000);
      }
    } else if (!isOnline) {
      sessionStorage.setItem('was-offline', 'true');
    }
  }, [isOnline]);

  if (justReconnected) {
    return (
      <Alert className="rounded-none border-x-0 border-t-0 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          Connection restored! All error logs have been cleared.
        </AlertDescription>
      </Alert>
    );
  }

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>Unable to connect to backend. Please check your connection.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          className="shrink-0"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};
