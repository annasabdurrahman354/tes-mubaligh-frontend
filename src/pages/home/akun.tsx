import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { IdCard, LogOut, Mail, Moon, Pencil, School2, Sun, Upload } from "lucide-react";
import { useState, useRef } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Import the Image Crop plugin
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageCrop);

export default function AkunPage() {
  const { theme, setDarkTheme, setLightTheme } = useTheme();
  const { user, logout, updateUsername, updateRfid, updatePassword, updatePhoto } = useAuth();

  // State dan fungsi untuk modal update username
  const { isOpen: isUsernameModalOpen, onOpen: onOpenUsernameModal, onClose: onCloseUsernameModal } = useDisclosure();
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [usernameUpdateError, setUsernameUpdateError] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  const handleOpenUsernameModal = () => {
    setCurrentUsername("");
    setNewUsername("");
    setUsernameUpdateError("");
    setIsUpdatingUsername(false);
    onOpenUsernameModal();
  };

  const handleUpdateUsername = async () => {
    setIsUpdatingUsername(true);
    setUsernameUpdateError("");

    try {
      const result = await updateUsername(currentUsername, newUsername);
      if (result?.message) {
        onCloseUsernameModal();
        addToast({
          title: "Berhasil!",
          description: result.message,
          timeout: 2000,
          variant: "flat",
          color: "success",
          shouldShowTimeoutProgess: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setUsernameUpdateError(error.message);
      }
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  // State dan fungsi untuk modal update RFID
  const { isOpen: isRfidModalOpen, onOpen: onOpenRfidModal, onClose: onCloseRfidModal } = useDisclosure();
  const [newRfid, setNewRfid] = useState("");
  const [rfidUpdateError, setRfidUpdateError] = useState("");
  const [isUpdatingRfid, setIsUpdatingRfid] = useState(false);

  const handleOpenRfidModal = () => {
    setNewRfid("");
    setRfidUpdateError("");
    setIsUpdatingRfid(false);
    onOpenRfidModal();
  };

  const handleUpdateRfid = async () => {
    setIsUpdatingRfid(true);
    setRfidUpdateError("");

    try {
      const result = await updateRfid(newRfid);
      if (result?.message) {
        onCloseRfidModal();
        addToast({
          title: "Berhasil!",
          description: result.message,
          timeout: 2000,
          variant: "flat",
          color: "success",
          shouldShowTimeoutProgess: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setRfidUpdateError(error.message);
      }
    } finally {
      setIsUpdatingRfid(false);
    }
  };

  // State dan fungsi untuk modal ganti password
  const { isOpen: isPasswordModalOpen, onOpen: onOpenPasswordModal, onClose: onClosePasswordModal } = useDisclosure();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordUpdateError, setPasswordUpdateError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleOpenPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordUpdateError("");
    setIsUpdatingPassword(false);
    onOpenPasswordModal();
  };

  const handleUpdatePassword = async () => {
    setIsUpdatingPassword(true);
    setPasswordUpdateError("");

    try {
      const result = await updatePassword(currentPassword, newPassword, confirmNewPassword);
      if (result?.message) {
        onClosePasswordModal();
        addToast({
          title: "Berhasil!",
          description: result.message,
          timeout: 2000,
          variant: "flat",
          color: "success",
          shouldShowTimeoutProgess: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setPasswordUpdateError(error.message);
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // State dan fungsi untuk modal update foto profil
  const { isOpen: isPhotoModalOpen, onOpen: onOpenPhotoModal, onClose: onClosePhotoModal } = useDisclosure();
  const [profilePhotoError, setProfilePhotoError] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [files, setFiles] = useState([]);
  const filePondRef = useRef(null);

  const handleOpenPhotoModal = () => {
    setProfilePhotoError("");
    setIsUploadingPhoto(false);
    setFiles([]);
    onOpenPhotoModal();
  };

  const handleUpdateProfilePhoto = async () => {
    setIsUploadingPhoto(true);
    setProfilePhotoError("");

    if (files && files.length > 0) {
      const file = files[0].file;
      try {
        const result = await updatePhoto(file);
        if (result?.message) {
          onClosePhotoModal();
          addToast({
            title: "Berhasil!",
            description: result.message,
            timeout: 2000,
            variant: "flat",
            color: "success",
            shouldShowTimeoutProgess: true,
          });
        } else if (result?.errors?.photo) {
          setProfilePhotoError(result.errors.photo[0]);
          addToast({
            title: "Gagal!",
            description: result.errors.photo[0],
            timeout: 3000,
            variant: "flat",
            color: "danger",
            shouldShowTimeoutProgess: true,
          });
        } else {
          setProfilePhotoError("Gagal memperbarui foto profil. Silakan coba lagi.");
          addToast({
            title: "Gagal!",
            description: "Gagal memperbarui foto profil. Silakan coba lagi.",
            timeout: 3000,
            variant: "flat",
            color: "danger",
            shouldShowTimeoutProgess: true,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setProfilePhotoError(error.message);
          addToast({
            title: "Terjadi Kesalahan!",
            description: error.message,
            timeout: 3000,
            variant: "flat",
            color: "danger",
            shouldShowTimeoutProgess: true,
          });
        }
      } finally {
        setIsUploadingPhoto(false);
      }
    } else {
      setProfilePhotoError("Silakan pilih foto profil.");
      setIsUploadingPhoto(false);
      addToast({
        title: "Peringatan!",
        description: "Silakan pilih foto profil.",
        timeout: 3000,
        variant: "flat",
        color: "warning",
        shouldShowTimeoutProgess: true,
      });
    }
  };

  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4">
        <Card
          className="border-small border-default-200 dark:border-default-100 w-full"
          shadow="none"
        >
          <CardBody className="flex-row items-center gap-3 p-4">
            <div className="relative">
              <Avatar
                alt={user?.nama}
                className="w-16 h-16 text-medium"
                src={user?.foto}
              />
              <Button
                isIconOnly
                size="sm"
                className="absolute bottom-0 right-0 shadow-md"
                onPress={handleOpenPhotoModal}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex flex-col items-start">
                <h1 className="text-lg text-gray-800 dark:text-white">{user?.nama}</h1>
                {user?.nama_panggilan && (
                  <p className="text-sm text-default-500">({user.nama_panggilan})</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user?.roles.map((role) => (
                  <Chip key={role} color="primary" variant="flat" size="sm">
                    {role}
                  </Chip>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
        <Card
          className="border-small border-default-200 dark:border-default-100 w-full"
          shadow="none"
        >
          <CardHeader className="text-md text-gray-800 dark:text-white">Informasi Akun</CardHeader>
          <Divider />
          <CardBody className="gap-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary-50">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-small text-default-500">Username</p>
                  <p className="text-md text-gray-800 dark:text-white">{user?.username}</p>
                </div>
              </div>
              <Button isIconOnly size="sm" onPress={handleOpenUsernameModal}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary-50">
                  <IdCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-small text-default-500">RFID</p>
                  <p className="text-md text-gray-800 dark:text-white">{user?.rfid ?? "Belum terkoneksi RFID"}</p>
                </div>
              </div>
              <Button isIconOnly size="sm" onPress={handleOpenRfidModal}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary-50">
                <School2 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-small text-default-500">Pondok Pesantren</p>
                <p className="text-md text-gray-800 dark:text-white">{user?.pondok ?? "Tidak ada data"}</p>
              </div>
            </div>
            <Divider className="mt-2" />
            <div className="w-full flex justify-center items-center gap-4">
              <Button color="warning" variant="flat" onPress={handleOpenPasswordModal}>
                Ganti Password
              </Button>
            </div>
          </CardBody>
        </Card>
        <div className="flex flex-row gap-2 items-center justify-center align-middle flex-wrap md:flex-nowrap">
          <Button
            color={theme === "light" ? "primary" : "default"}
            startContent={
              theme === "light" ? <Sun size={16} /> : <Moon size={16} />
            }
            variant={theme === "light" ? "solid" : "bordered"}
            onPress={() =>
              theme === "light" ? setDarkTheme() : setLightTheme()
            }
          >
            {theme === "light" ? "Terang" : "Gelap"}
          </Button>

          <Button
            color="danger"
            startContent={<LogOut size={16} />}
            variant="flat"
            onPress={logout}
          >
            Keluar
          </Button>
        </div>
      </section>

      {/* Modal untuk update username */}
      <Modal isOpen={isUsernameModalOpen} onOpenChange={onCloseUsernameModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Perbarui Username</ModalHeader>
              <ModalBody>
                {usernameUpdateError && <p className="text-red-500 text-sm mb-2">{usernameUpdateError}</p>}
                <Input
                  label="Username Saat Ini"
                  placeholder="Masukkan username saat ini"
                  value={currentUsername}
                  onChange={(e) => setCurrentUsername(e.target.value)}
                />
                <Input
                  label="Username Baru"
                  placeholder="Masukkan username baru Anda"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} isDisabled={isUpdatingUsername}>
                  Batal
                </Button>
                <Button color="primary" onPress={handleUpdateUsername} isLoading={isUpdatingUsername} isDisabled={isUpdatingUsername}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal untuk update RFID */}
      <Modal isOpen={isRfidModalOpen} onOpenChange={onCloseRfidModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Perbarui RFID</ModalHeader>
              <ModalBody>
                {rfidUpdateError && <p className="text-red-500 text-sm mb-2">{rfidUpdateError}</p>}
                <Input
                  type="number"
                  label="RFID Baru"
                  placeholder="Masukkan nomor RFID baru"
                  value={newRfid}
                  onChange={(e) => setNewRfid(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} isDisabled={isUpdatingRfid}>
                  Batal
                </Button>
                <Button color="primary" onPress={handleUpdateRfid} isLoading={isUpdatingRfid} isDisabled={isUpdatingRfid}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal untuk ganti password */}
      <Modal isOpen={isPasswordModalOpen} onOpenChange={onClosePasswordModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ganti Password</ModalHeader>
              <ModalBody>
                {passwordUpdateError && <p className="text-red-500 text-sm mb-2">{passwordUpdateError}</p>}
                <Input
                  label="Password Saat Ini"
                  placeholder="Masukkan password Anda saat ini"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  className="mt-4"
                  label="Password Baru"
                  placeholder="Masukkan password baru Anda"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  className="mt-4"
                  label="Konfirmasi Password Baru"
                  placeholder="Konfirmasi password baru Anda"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} isDisabled={isUpdatingPassword}>
                  Batal
                </Button>
                <Button color="primary" onPress={handleUpdatePassword} isLoading={isUpdatingPassword} isDisabled={isUpdatingPassword}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal untuk update foto profil */}
      <Modal isOpen={isPhotoModalOpen} onOpenChange={onClosePhotoModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Perbarui Foto Profil</ModalHeader>
              <ModalBody>
                {profilePhotoError && <p className="text-red-500 text-sm mb-2">{profilePhotoError}</p>}
                <FilePond
                  ref={filePondRef}
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={false}
                  imageCropAspectRatio="1:1"
                  allowImagePreview
                  labelIdle='Seret &amp; Jatuhkan gambar Anda atau <span class="filepond--label-action">Pilih</span>'
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} isDisabled={isUploadingPhoto}>
                  Batal
                </Button>
                <Button color="primary" onPress={handleUpdateProfilePhoto} isLoading={isUploadingPhoto} isDisabled={isUploadingPhoto}>
                  Unggah
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}