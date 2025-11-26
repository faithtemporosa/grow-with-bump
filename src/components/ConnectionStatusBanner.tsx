import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useConnectionStatus } from "@/hooks/use-connection-status";

export const ConnectionStatusBanner = () => {
  const { isOnline, checkConnection } = useConnectionStatus();

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
