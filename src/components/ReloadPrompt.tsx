import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, Wifi } from "lucide-react";

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      // Check for updates every hour
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
    immediate: true,
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const isOpen = offlineReady || needRefresh;

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      size="md"
      isDismissable={false}
      hideCloseButton={true}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {offlineReady ? (
                <div className="flex items-center gap-2">
                  <Wifi className="text-success" />
                  Aplikasi Siap Offline
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="text-primary" />
                  Pembaruan Tersedia
                </div>
              )}
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="flex flex-col items-center justify-center py-4 px-2">
                {offlineReady ? (
                  <p className="text-center text-foreground-600">
                    Aplikasi siap digunakan secara offline. Anda dapat menutup pesan ini.
                  </p>
                ) : (
                  <p className="text-center text-foreground-600">
                    Versi baru aplikasi tersedia! Silakan perbarui untuk mendapatkan fitur terbaru.
                  </p>
                )}
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              {offlineReady && (
                <Button
                  color="default"
                  variant="faded"
                  onPress={close}
                >
                  Tutup
                </Button>
              )}
              {needRefresh && (
                <Button
                  color="primary"
                  variant="shadow"
                  onPress={handleUpdate}
                  startContent={<RefreshCw size={18} />}
                >
                  Perbarui Sekarang
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
