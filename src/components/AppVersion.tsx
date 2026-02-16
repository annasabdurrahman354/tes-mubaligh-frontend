import { RefreshCw } from "lucide-react";
import { Button } from "@heroui/react";

export function AppVersion() {
  const handleUpdate = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update().then(() => {
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-4 translate-x-3">
      <span className="text-xs text-default-400">v1.0.0</span>
      <Button
        isIconOnly
        className="min-w-6 w-6 h-6 p-1 text-default-400 hover:text-success transition-colors"
        size="sm"
        variant="light"
        onPress={handleUpdate}
      >
        <RefreshCw size={12} />
      </Button>
    </div>
  );
}
