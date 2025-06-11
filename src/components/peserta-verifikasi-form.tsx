import React, { useEffect, useState, useCallback, useRef } from "react";
import { PesertaKertosonoVerifikasi } from "@/types/kertosono";
import {
    addToast, Button, Card, CardBody, cn, Divider, Input, Select, SelectItem, Spinner,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, // Modal components
    Avatar, // For image preview
    Switch, // For mode toggle
    Tooltip, // For switch camera button
} from "@heroui/react";
import api, { handleApiError } from "@/libs/axios";
import imageCompression from 'browser-image-compression'; // Import compression library
import { Camera } from "react-camera-pro";         // Import camera library
import { base64ToFile } from "@/libs/helper";     // Import helper function

// Icons
import {
  Camera as CameraIcon,
  Upload,
  RefreshCcw,
  X,
  Check,
  Image as ImageIcon,
  User, // Fallback icon
  CheckCircle, // Icon for submit button
} from "lucide-react";


// Interface for the standardized return format (keep this)
interface SelectOption {
  value: number | string;
  label: string;
}

interface PesertaVerifikasiFormProps {
  santri: PesertaKertosonoVerifikasi;
  // Update onSubmit to expect FormData
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const PesertaVerifikasiForm: React.FC<PesertaVerifikasiFormProps> = ({
  santri,
  onSubmit,
  onCancel,
  isSubmitting // This is the network submitting state from parent
}) => {
  // --- State ---
  const [formData, setFormData] = useState<Partial<PesertaKertosonoVerifikasi>>({});
  // Loading states for dependent dropdowns
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isKotaLoading, setIsKotaLoading] = useState(false);
  const [isKecamatanLoading, setIsKecamatanLoading] = useState(false);
  const [isKelurahanLoading, setIsKelurahanLoading] = useState(false);
  // Dropdown options state
  const [provinsiOptions, setProvinsiOptions] = useState<SelectOption[]>([]);
  const [kotaOptions, setKotaOptions] = useState<SelectOption[]>([]);
  const [kecamatanOptions, setKecamatanOptions] = useState<SelectOption[]>([]);
  const [kelurahanOptions, setKelurahanOptions] = useState<SelectOption[]>([]);
  const [daerahSambungOptions, setDaerahSambungOptions] = useState<SelectOption[]>([]);
  const [ponpesOptions, setPonpesOptions] = useState<SelectOption[]>([]);

  // --- Image Upload/Camera State ---
  const { isOpen: isCameraModalOpen, onOpen: openCameraModal, onClose: closeCameraModal, onOpenChange: onCameraModalOpenChange } = useDisclosure();
  const cameraRef = useRef<any>(null); // Ref for react-camera-pro
  const [uploadMode, setUploadMode] = useState<'file' | 'camera'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null); // Base64 from camera
  const [previewUrl, setPreviewUrl] = useState<string | null>(santri.foto_smartcard || null); // Initial preview is existing photo
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [isCompressing, setIsCompressing] = useState(false); // State for compression process

  // --- Data Fetching Functions (Memoized) ---
  const getProvinsiOptions = useCallback(async (): Promise<SelectOption[]> => { /* ...fetch logic... */
        console.log("Fetching Provinsi options (local)...");
        try {
            const response = await api.get("options/provinsi");
            const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
                value: item.id_provinsi,
                label: item.nama,
            }));
            return formattedData;
        } catch (err) {
            handleApiError(err);
            addToast({ title: "Error", description: "Gagal memuat opsi provinsi.", color: 'danger' });
            return [];
        }
   }, []);
   const getKotaOptions = useCallback(async (provinsiId: string | number): Promise<SelectOption[]> => { /* ...fetch logic... */
        console.log(`Workspaceing Kota options for ${provinsiId} (local)...`);
        if (!provinsiId) return [];
        setIsKotaLoading(true);
        try {
            const response = await api.get(`options/kota/${provinsiId}`);
            const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
                value: item.id_kota_kab,
                label: item.nama,
            }));
            return formattedData;
        } catch (err) {
            handleApiError(err);
            addToast({ title: "Error", description: "Gagal memuat data kota.", color: 'danger' });
            return [];
        } finally {
             setIsKotaLoading(false);
        }
    }, []);
    const getKecamatanOptions = useCallback(async (kotaId: string | number): Promise<SelectOption[]> => { /* ...fetch logic... */
        console.log(`Workspaceing Kecamatan options for ${kotaId} (local)...`);
        if (!kotaId) return [];
         setIsKecamatanLoading(true);
        try {
            const response = await api.get(`options/kecamatan/${kotaId}`);
            const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
                value: item.id_kecamatan,
                label: item.nama,
            }));
            return formattedData;
        } catch (err) {
            handleApiError(err);
            addToast({ title: "Error", description: "Gagal memuat data kecamatan.", color: 'danger' });
            return [];
        } finally {
            setIsKecamatanLoading(false);
        }
     }, []);
    const getKelurahanOptions = useCallback(async (kecamatanId: string | number): Promise<SelectOption[]> => { /* ...fetch logic... */
        console.log(`Workspaceing Kelurahan options for ${kecamatanId} (local)...`);
        if (!kecamatanId) return [];
         setIsKelurahanLoading(true);
        try {
            const response = await api.get(`options/kelurahan/${kecamatanId}`);
            const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
                value: item.id_desa_kel,
                label: item.nama,
            }));
            return formattedData;
        } catch (err) {
            handleApiError(err);
            addToast({ title: "Error", description: "Gagal memuat data kelurahan.", color: 'danger' });
            return [];
        } finally {
             setIsKelurahanLoading(false);
        }
    }, []);
    const getDaerahSambungOptions = useCallback(async (): Promise<SelectOption[]> => { /* ...fetch logic... */
        console.log("Fetching Daerah Sambung options (local)...");
        try {
            const response = await api.get("options/daerah-sambung");
            const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
                value: item.id_daerah,
                label: item.n_daerah,
            }));
            return formattedData;
        } catch (err) {
            handleApiError(err);
            addToast({ title: "Error", description: "Gagal memuat data daerah sambung.", color: 'danger' });
            return [];
        }
     }, []);
    const getPonpesOptions = useCallback(async (): Promise<SelectOption[]> => { /* ...fetch logic... */
        console.log("Fetching Ponpes options (local)...");
        try {
            const response = await api.get("options/ponpes");
            // Assuming the API returns an object like { "Ponpes A (Daerah X)": 1, ... }
            const formattedData: SelectOption[] = Object.entries(response.data ?? {}).map(
                ([label, value]) => ({
                    value: value as (string | number), // Keep original value type
                    label: label,
                })
            );
            formattedData.sort((a, b) => a.label.localeCompare(b.label)); // Sort by label
            return formattedData;
        } catch (err) {
            handleApiError(err);
            addToast({ title: "Error", description: "Gagal memuat data pondok pesantren.", color: 'danger' });
            return [];
        }
     }, []);


  // --- Effects for Data Loading ---
  // 1. Initialize form data from santri prop
  useEffect(() => {
    console.log("Effect: Initializing formData from santri", santri);
    // Ensure IDs are numbers or null for Select components that expect numbers
    const initialFormData: Partial<PesertaKertosonoVerifikasi> = {
        id_ponpes: Number(santri.id_ponpes) || null,
        jenis_kelamin: santri.jenis_kelamin,
        nama_lengkap: santri.nama_lengkap,
        nama_panggilan: santri.nama_panggilan,
        nama_ayah: santri.nama_ayah,
        nama_ibu: santri.nama_ibu,
        tempat_lahir: santri.tempat_lahir,
        tanggal_lahir: santri.tanggal_lahir ? santri.tanggal_lahir.toString().slice(0, 10) : null, // Format YYYY-MM-DD
        alamat: santri.alamat,
        rt: santri.rt,
        rw: santri.rw,
        provinsi_id: Number(santri.provinsi_id) || null,
        kota_kab_id: Number(santri.kota_kab_id) || null,
        kecamatan_id: Number(santri.kecamatan_id) || null,
        desa_kel_id: Number(santri.desa_kel_id) || null,
        kode_pos: santri.kode_pos,
        hp: santri.hp,
        id_daerah_sambung: Number(santri.id_daerah_sambung) || null,
        kelompok_sambung: santri.kelompok_sambung,
        pendidikan: santri.pendidikan,
        jurusan: santri.jurusan,
        status_mondok: santri.status_mondok,
        id_daerah_kiriman: Number(santri.id_daerah_kiriman) || null,
      };
    setFormData(initialFormData);
    setPreviewUrl(santri.foto_smartcard || null); // Initialize preview
    setIsInitialLoading(true); // Start initial loading sequence
    setSelectedFile(null); // Reset file/photo state when santri changes
    setCapturedPhoto(null);
  }, [santri]);

  // 2. Fetch static options
  useEffect(() => {
    console.log("Effect: Loading static options");
    const loadStaticOptions = async () => {
      try {
        const [provinsi, ponpes, daerahSambung] = await Promise.all([
          getProvinsiOptions(),
          getPonpesOptions(),
          getDaerahSambungOptions(),
        ]);
        setProvinsiOptions(provinsi);
        setPonpesOptions(ponpes);
        setDaerahSambungOptions(daerahSambung);
        console.log("Effect: Static options loaded");
      } catch (error) {
        console.error("Error in loadStaticOptions Promise.all:", error);
      }
      // Don't stop initial loading here
    };
    loadStaticOptions();
  }, [getProvinsiOptions, getPonpesOptions, getDaerahSambungOptions]);

  // 3. Fetch initial dependent options
  useEffect(() => {
    // Ensure formData is initialized before fetching dependents
    if (!formData || formData.provinsi_id === undefined) {
        // If formData isn't set yet, or has no province_id, we might be waiting for initialization
        // If we are *not* in the initial loading phase anymore, it means user cleared province, so return.
        if (!isInitialLoading) {
            console.log("Effect: Dependent options - formData not ready or province cleared, skipping.");
            return;
        }
         // If still in initial loading and formData isn't ready, wait for the first effect
         if(formData.provinsi_id === undefined && isInitialLoading) {
             console.log("Effect: Dependent options - waiting for formData initialization...");
             return;
         }
         // If formData is initialized but no province_id, initial dependent load is done
         if(formData.provinsi_id === null && isInitialLoading) {
             console.log("Effect: Initial dependent options - No provinsi_id, stopping initial load.");
              setIsInitialLoading(false);
              return;
         }
    }


    console.log("Effect: Loading initial dependent options for:", formData.provinsi_id);
    const loadInitialDependentOptions = async () => {
      try {
        setKotaOptions([]); setKecamatanOptions([]); setKelurahanOptions([]); // Reset

        if (formData.provinsi_id) {
          const initialKota = await getKotaOptions(formData.provinsi_id);
          setKotaOptions(initialKota);
          console.log("Effect: Initial Kota loaded", initialKota.length);

          if (formData.kota_kab_id) {
            const initialKecamatan = await getKecamatanOptions(formData.kota_kab_id);
            setKecamatanOptions(initialKecamatan);
            console.log("Effect: Initial Kecamatan loaded", initialKecamatan.length);

            if (formData.kecamatan_id) {
              const initialKelurahan = await getKelurahanOptions(formData.kecamatan_id);
              setKelurahanOptions(initialKelurahan);
               console.log("Effect: Initial Kelurahan loaded", initialKelurahan.length);
            }
          }
        }
      } catch (error) {
        console.error("Error loading initial dependent options:", error);
      } finally {
        console.log("Effect: Finished loading initial dependent options.");
        setIsInitialLoading(false); // Stop the overall initial loading indicator
      }
    };
    loadInitialDependentOptions();
  }, [ // Re-run ONLY when the *initial* relevant IDs change in formData
    formData.provinsi_id, formData.kota_kab_id, formData.kecamatan_id,
    getKotaOptions, getKecamatanOptions, getKelurahanOptions
  ]);


   // --- Image Preview Effect ---
   useEffect(() => {
    let objectUrl: string | null = null;
    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      // No need to clear capturedPhoto here, processSubmit prioritizes
    } else if (capturedPhoto) {
        setPreviewUrl(capturedPhoto); // Show base64 directly
    }
     else {
      // If no new selection/capture, show original photo or null
      setPreviewUrl(santri.foto_smartcard || null);
    }
    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        // Don't necessarily reset previewUrl here on cleanup,
        // only when a new selection/capture happens or component unmounts/santri changes.
      }
    };
  }, [selectedFile, capturedPhoto, santri.foto_smartcard]); // Rerun when file, capture, or original changes


  // --- Event Handlers ---
  // Handle regular input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Specific handlers for dependent selects
  const handleProvinsiChange = useCallback(async (provinsiId: number | null) => {
    console.log("Handler: Provinsi changed to", provinsiId);
    setFormData((prev) => ({
      ...prev,
      provinsi_id: provinsiId, kota_kab_id: null, kecamatan_id: null, desa_kel_id: null
    }));
    setKotaOptions([]); setKecamatanOptions([]); setKelurahanOptions([]);
    if (provinsiId) await getKotaOptions(provinsiId); // Fetch new options
  }, [getKotaOptions]);

  const handleKotaChange = useCallback(async (kotaId: number | null) => {
    console.log("Handler: Kota changed to", kotaId);
    setFormData((prev) => ({
      ...prev,
      kota_kab_id: kotaId, kecamatan_id: null, desa_kel_id: null
    }));
    setKecamatanOptions([]); setKelurahanOptions([]);
    if (kotaId) await getKecamatanOptions(kotaId); // Fetch new options
  }, [getKecamatanOptions]);

  const handleKecamatanChange = useCallback(async (kecamatanId: number | null) => {
    console.log("Handler: Kecamatan changed to", kecamatanId);
    setFormData((prev) => ({
      ...prev,
      kecamatan_id: kecamatanId, desa_kel_id: null
    }));
    setKelurahanOptions([]);
    if (kecamatanId) await getKelurahanOptions(kecamatanId); // Fetch new options
  }, [getKelurahanOptions]);

  // Specific handler for status_mondok to manage conditional fields
  const handleStatusMondokChange = useCallback((status: string | null) => {
    setFormData((prev) => ({
      ...prev,
      status_mondok: status,
      // If status is not 'kiriman', reset id_daerah_kiriman
      id_daerah_kiriman: status === 'kiriman' ? prev.id_daerah_kiriman : null
    }));
  }, []);

  // Generic handler for Select changes
  const handleSelectChange = useCallback((name: keyof PesertaKertosonoVerifikasi) => (value: string | number | null) => {
    // Ensure numeric values are stored as numbers if needed by the state/backend
    const processedValue = (typeof value === 'string' && !isNaN(Number(value))) ? Number(value) : value;

    if (name === "provinsi_id")       handleProvinsiChange(processedValue as number | null);
    else if (name === "kota_kab_id")  handleKotaChange(processedValue as number | null);
    else if (name === "kecamatan_id") handleKecamatanChange(processedValue as number | null);
    else if (name === "status_mondok") handleStatusMondokChange(processedValue as string | null);
    else setFormData((prev) => ({ ...prev, [name]: processedValue })); // Update other selects

  }, [handleProvinsiChange, handleKotaChange, handleKecamatanChange, handleStatusMondokChange]);

   // --- Image/Camera Handlers ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                addToast({ title: "Error", description: "Ukuran file terlalu besar (maks 5MB)", color: 'danger' });
                event.target.value = ''; return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                 addToast({ title: "Error", description: "Tipe file tidak valid (hanya JPG, PNG, GIF, WebP)", color: 'danger' });
                event.target.value = ''; return;
            }
            setSelectedFile(file);
            setCapturedPhoto(null); // Clear camera capture
        } else {
             setSelectedFile(null);
             // Preview effect will handle reverting
        }
    };

    const handleTakePhoto = useCallback(() => {
        if (cameraRef.current) {
            try {
                const photoBase64 = cameraRef.current.takePhoto();
                setCapturedPhoto(photoBase64);
                setSelectedFile(null); // Clear file selection
                closeCameraModal(); // Close modal after taking photo
            } catch (error) {
                console.error("Error taking photo:", error);
                setCameraError("Gagal mengambil foto.");
                 addToast({ title: "Error Kamera", description: "Gagal mengambil foto.", color: 'danger' });
            }
        }
    }, [closeCameraModal]); // Depend on closeCameraModal from useDisclosure

    const handleSwitchCamera = useCallback(() => {
        if (cameraRef.current) {
            try {
                const newFacingMode = cameraRef.current.switchCamera();
                setCameraFacingMode(newFacingMode);
            } catch (error) {
                console.error("Error switching camera:", error);
                setCameraError("Gagal mengganti kamera.");
                 addToast({ title: "Error Kamera", description: "Gagal mengganti kamera.", color: 'danger' });
            }
        }
    }, []);

    const openCamera = () => {
        setCameraError(null); // Reset error on open
        openCameraModal();
    };

    const clearImageSelection = () => {
         setSelectedFile(null);
         setCapturedPhoto(null);
         const fileInput = document.getElementById('file-upload') as HTMLInputElement;
         if(fileInput) fileInput.value = ''; // Reset file input visually
         setPreviewUrl(santri.foto_smartcard || null); // Revert to original preview
    }


  // --- Form Submission ---
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    setIsCompressing(false); // Reset compression state

    // --- START: NEW CODE (Conditional Validation) ---
    // Basic frontend validation
    let requiredFields: (keyof PesertaKertosonoVerifikasi)[] = [
      "nama_lengkap", "jenis_kelamin", "tempat_lahir", "tanggal_lahir",
      "alamat", "rt", "rw", "id_ponpes", "provinsi_id", "kota_kab_id",
      "kecamatan_id", "desa_kel_id", "id_daerah_sambung", "kelompok_sambung",
      "pendidikan", "status_mondok",
    ];

    // Conditionally add id_daerah_kiriman to required fields
    if (formData.status_mondok === 'kiriman') {
        requiredFields.push('id_daerah_kiriman');
    }
    // --- END: NEW CODE ---

    const missingFields = requiredFields.filter(field => {
        const value = formData[field];
        return value === null || value === undefined || value === '';
    });

    if (missingFields.length > 0) {
      addToast({
        title: "Error Validasi",
        description: `Mohon lengkapi field berikut: ${missingFields.join(", ")}`,
        color: 'danger',
      });
      return;
    }

    // --- Image Processing and Compression ---
    let initialImageFile: File | null = null;
    if (capturedPhoto) {
      const timestamp = new Date().getTime();
      const filename = `cam_${santri.nispn}_${timestamp}.jpg`;
      initialImageFile = await base64ToFile(capturedPhoto, filename);
      if (!initialImageFile) {
          addToast({ title: "Error", description: "Gagal memproses gambar dari kamera.", color: 'danger' });
          return;
      }
    } else if (selectedFile) {
      initialImageFile = selectedFile;
    }

    let imageFileToSend: File | null = null;
    if (initialImageFile) {
      console.log(`Original file size: ${(initialImageFile.size / 1024 / 1024).toFixed(2)} MB`);
      setIsCompressing(true);

      const compressionOptions = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };

      try {
        const compressedFile = await imageCompression(initialImageFile, compressionOptions);
        console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
        // Ensure the compressed file still has a name
        imageFileToSend = new File([compressedFile], initialImageFile.name, { // Use original name (or generate one)
            type: compressedFile.type,
            lastModified: compressedFile.lastModified,
        });

      } catch (error) {
        console.error('Image compression failed:', error);
        addToast({ title: "Error Kompresi", description: 'Gagal mengompres gambar. Mengirim gambar asli.', color: 'warning' });
         // Optionally send the original file if compression fails
         // imageFileToSend = initialImageFile;
         // Or stop submission:
          setIsCompressing(false);
          return;
      } finally {
        setIsCompressing(false);
      }
    }
    // --- End Image Processing ---

    // Create FormData
    const finalFormData = new FormData();

    // Append all fields from the formData state
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
          // Ensure dates are sent in YYYY-MM-DD format if they are strings
          if ((key === 'tanggal_lahir') && typeof value === 'string') {
               finalFormData.append(key, value.slice(0, 10));
          } else {
             finalFormData.append(key, String(value));
          }
      }
    });

    // Append the processed image file (compressed or original if compression failed and decided to send)
    if (imageFileToSend) {
      finalFormData.append('new_person_photo', imageFileToSend, imageFileToSend.name);
    }

    // Call the parent onSubmit prop with the FormData
    await onSubmit(finalFormData);
  }, [formData, onSubmit, santri.nispn, selectedFile, capturedPhoto]); // Dependencies


  // Loading indicator for initial data fetch
  if (isInitialLoading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="lg" color="primary" />
        <span className="ml-3">Memuat data awal...</span>
      </div>
    );
  }

  // --- Render Form ---
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card fullWidth className={cn(`border-small dark:border-small border-default-100`)}>
          <CardBody className="p-6 space-y-6">

            {/* --- Image Upload Section --- */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Foto Santri</h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Preview */}
                <Avatar
                  src={previewUrl || undefined}
                  fallback={<User className="w-10 h-10 text-default-400"/>}
                  color="primary"
                  className="w-32 h-40 text-large flex-shrink-0 bg-white"
                  imgProps={{ className:"object-cover w-full h-full"}}
                />

                {/* Controls */}
                <div className="flex flex-col gap-3 items-start flex-grow">
                  <Switch
                     isSelected={uploadMode === 'camera'}
                     onValueChange={(isSelected) => setUploadMode(isSelected ? 'camera' : 'file')}
                     thumbIcon={({ isSelected, className }) => isSelected ? <CameraIcon className={className} size={14}/> : <Upload className={className} size={14}/> }
                     isDisabled={isSubmitting || isCompressing}
                  >
                     {uploadMode === 'camera' ? 'Gunakan Kamera' : 'Upload File'}
                  </Switch>

                  {uploadMode === 'file' && (
                     <div className="relative w-full sm:w-auto">
                        <Input
                            id="file-upload"
                            type="file"
                            accept="image/jpeg, image/png, image/gif, image/webp" // Added webp
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Button
                            as="label"
                            htmlFor="file-upload"
                            color="primary"
                            variant="flat"
                            startContent={<ImageIcon size={16} />}
                            className="cursor-pointer"
                            isDisabled={isSubmitting || isCompressing}
                        >
                             Pilih File Gambar...
                         </Button>
                         {selectedFile && <p className="text-sm text-default-600 mt-1 truncate" title={selectedFile.name}>{selectedFile.name}</p>}
                     </div>
                  )}

                  {uploadMode === 'camera' && (
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<CameraIcon size={16} />}
                      onPress={openCamera}
                      isDisabled={isSubmitting || isCompressing}

                    >
                      Buka Kamera
                    </Button>
                  )}

                  {(selectedFile || capturedPhoto) && (
                        <Button
                             isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            aria-label="Hapus Gambar"
                            onPress={clearImageSelection} // Use the new clear function
                            isDisabled={isSubmitting || isCompressing}
                        >
                           <X size={16}/>
                        </Button>
                    )}
                </div>
              </div>
            </div>

            <Divider />

            {/* --- Informasi Pribadi --- */}
             <div>
                 <h2 className="text-xl font-semibold mb-4">Informasi Pribadi</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input isReadOnly label="NISPN" value={santri.nispn ?? ''} variant="bordered"/>
                      <Input isReadOnly label="NIK" value={santri.nik ?? ''} variant="bordered"/>
                      <Input label="Nama Lengkap" name="nama_lengkap" value={formData.nama_lengkap || ""} onChange={handleInputChange} isRequired />
                      <Input label="Nama Panggilan" name="nama_panggilan" value={formData.nama_panggilan || ""} onChange={handleInputChange} />
                      <Select
                          label="Jenis Kelamin"
                          placeholder="Pilih Jenis Kelamin"
                          selectedKeys={formData.jenis_kelamin ? [formData.jenis_kelamin.toString()] : []}
                          onChange={(e) => handleSelectChange("jenis_kelamin")(e.target.value || null)}
                          isRequired
                      >
                          <SelectItem key="L" value="L">Laki-laki</SelectItem>
                          <SelectItem key="P" value="P">Perempuan</SelectItem>
                      </Select>
                     <Input label="HP" name="hp" type="tel" value={formData.hp || ""} onChange={handleInputChange} />
                     <Input label="Tempat Lahir" name="tempat_lahir" value={formData.tempat_lahir || ""} onChange={handleInputChange} isRequired />
                     <Input label="Tanggal Lahir" name="tanggal_lahir" type="date" value={formData.tanggal_lahir || ""} onChange={handleInputChange} isRequired />
                     <Input label="Nama Ayah" name="nama_ayah" value={formData.nama_ayah || ""} onChange={handleInputChange} />
                     <Input label="Nama Ibu" name="nama_ibu" value={formData.nama_ibu || ""} onChange={handleInputChange} />
                     <Select
                         label="Pendidikan"
                         placeholder="Pilih Pendidikan"
                         selectedKeys={formData.pendidikan ? [formData.pendidikan.toString()] : []}
                         onChange={(e) => handleSelectChange("pendidikan")(e.target.value || null)}
                         isRequired
                     >
                        {/* Options matching backend */}
                        {['SD', 'SMP', 'SMA', 'SMK', 'PAKET-C', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'TK', 'Tidak Sekolah', 'Lainnya'].map(opt => (
                             <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                     </Select>
                      <Input label="Jurusan" name="jurusan" value={formData.jurusan || ""} onChange={handleInputChange} />
                 </div>
             </div>

            <Divider />

            {/* --- Alamat --- */}
             <div>
                <h2 className="text-xl font-semibold mb-4">Alamat</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Alamat" name="alamat" value={formData.alamat || ""} onChange={handleInputChange} isRequired className="md:col-span-2"/>
                     <Input label="RT" name="rt" value={formData.rt || ""} onChange={handleInputChange} isRequired />
                    <Input label="RW" name="rw" value={formData.rw || ""} onChange={handleInputChange} isRequired />
                     <Select
                         label="Provinsi"
                         placeholder="Pilih Provinsi"
                         items={provinsiOptions}
                         selectedKeys={formData.provinsi_id ? [String(formData.provinsi_id)] : []}
                         onChange={(e) => handleSelectChange("provinsi_id")(e.target.value ? Number(e.target.value) : null)}
                         isRequired
                      >
                        {(item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
                     </Select>
                    <Select
                        label="Kota/Kabupaten"
                        placeholder={isKotaLoading ? "Memuat..." : "Pilih Kota/Kabupaten"}
                        items={kotaOptions}
                        selectedKeys={formData.kota_kab_id ? [String(formData.kota_kab_id)] : []}
                        onChange={(e) => handleSelectChange("kota_kab_id")(e.target.value ? Number(e.target.value) : null)}
                        isDisabled={!formData.provinsi_id || isKotaLoading}
                        isRequired
                    >
                       {(item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
                    </Select>
                    <Select
                         label="Kecamatan"
                         placeholder={isKecamatanLoading ? "Memuat..." : "Pilih Kecamatan"}
                         items={kecamatanOptions}
                         selectedKeys={formData.kecamatan_id ? [String(formData.kecamatan_id)] : []}
                         onChange={(e) => handleSelectChange("kecamatan_id")(e.target.value ? Number(e.target.value) : null)}
                         isDisabled={!formData.kota_kab_id || isKecamatanLoading}
                         isRequired
                     >
                        {(item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
                     </Select>
                    <Select
                        label="Desa/Kelurahan"
                         placeholder={isKelurahanLoading ? "Memuat..." : "Pilih Desa/Kelurahan"}
                        items={kelurahanOptions}
                        selectedKeys={formData.desa_kel_id ? [String(formData.desa_kel_id)] : []}
                        onChange={(e) => handleSelectChange("desa_kel_id")(e.target.value ? Number(e.target.value) : null)}
                        isDisabled={!formData.kecamatan_id || isKelurahanLoading}
                        isRequired
                    >
                       {(item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
                    </Select>
                     <Input label="Kode Pos" name="kode_pos" value={formData.kode_pos || ""} onChange={handleInputChange} />
                     <Select
                        label="Daerah Sambung"
                        placeholder="Pilih Daerah"
                        items={daerahSambungOptions}
                        selectedKeys={formData.id_daerah_sambung ? [String(formData.id_daerah_sambung)] : []}
                        onChange={(e) => handleSelectChange("id_daerah_sambung")(e.target.value ? Number(e.target.value) : null)}
                        isRequired
                    >
                        {(item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
                    </Select>
                    <Input label="Kelompok Sambung" name="kelompok_sambung" value={formData.kelompok_sambung || ""} onChange={handleInputChange} isRequired />
                 </div>
             </div>

             <Divider/>

            {/* --- Informasi Pondok --- */}
             <div>
                <h2 className="text-xl font-semibold mb-4">Informasi Pondok</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Select
                         label="Asal Pondok"
                         placeholder="Pilih Pondok"
                         items={ponpesOptions}
                         selectedKeys={formData.id_ponpes ? [String(formData.id_ponpes)] : []}
                         onChange={(e) => handleSelectChange("id_ponpes")(e.target.value ? Number(e.target.value) : null)}
                         isRequired
                     >
                         {(item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
                     </Select>
                     <Select
                         label="Status Mondok"
                         placeholder="Pilih Status"
                         selectedKeys={formData.status_mondok ? [formData.status_mondok.toString()] : []}
                         onChange={(e) => handleSelectChange("status_mondok")(e.target.value || null)}
                         isRequired
                      >
                          <SelectItem key="reguler" value="reguler">Reguler</SelectItem>
                          <SelectItem key="kiriman" value="kiriman">Kiriman</SelectItem>
                          <SelectItem key="pelajar/mahasiswa" value="pelajar/mahasiswa">Pelajar/Mahasiswa</SelectItem>
                      </Select>
                     
                      {formData.status_mondok === 'kiriman' && (
                        <Select
                            label="Daerah Kiriman"
                            placeholder="Pilih Daerah Kiriman"
                            // We reuse the options from daerah sambung as requested
                            items={daerahSambungOptions}
                            selectedKeys={formData.id_daerah_kiriman ? [String(formData.id_daerah_kiriman)] : []}
                            onChange={(e) => handleSelectChange("id_daerah_kiriman")(e.target.value ? Number(e.target.value) : null)}
                            // This field is required only if it is visible
                            isRequired={formData.status_mondok === 'kiriman'}
                            className="md:col-span-2" // Make it full width in this section
                        >
                            {(item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
                        </Select>
                      )}

                 </div>
            </div>

            {/* --- Action Buttons --- */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                color="danger"
                variant="flat"
                onPress={onCancel}
                isDisabled={isSubmitting || isCompressing || isInitialLoading}
              >
                Batal
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="solid"
                startContent={!(isSubmitting || isCompressing) ? <CheckCircle size={16} /> : undefined}
                isLoading={isSubmitting || isCompressing} // Show spinner if submitting or compressing
                isDisabled={
                    isSubmitting || isCompressing || isInitialLoading || // Disable during processes
                    isKotaLoading || isKecamatanLoading || isKelurahanLoading // Disable if dependent selects loading
                }
              >
                 {isCompressing ? 'Mengompres...' : (isSubmitting ? 'Memverifikasi...' : 'Verifikasi')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>

      {/* Camera Modal (Same as previous implementation) */}
       <Modal isOpen={isCameraModalOpen} onOpenChange={onCameraModalOpenChange} size="xl" placement="center" scrollBehavior="inside">
        <ModalContent>
          {(onCloseCallback) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ambil Foto Santri</ModalHeader>
              <ModalBody>
                 {cameraError && <p className="text-danger text-sm mb-2">{cameraError}</p>}
                 {/* Container to help enforce aspect ratio visually */}
                 <div className="w-full"> {/* 4:3 Aspect Ratio for container (adjust if needed) */}
                     <div className="mx-auto w-2/3">
                         <Camera
                             ref={cameraRef}
                             facingMode={cameraFacingMode}
                             aspectRatio={3 / 4} // Request 3:4 aspect ratio photo
                             numberOfCamerasCallback={setNumberOfCameras}
                             errorMessages={{
                                noCameraAccessible: 'Kamera tidak ditemukan/tersedia.',
                                permissionDenied: 'Izin kamera ditolak. Mohon izinkan akses kamera.',
                                switchCamera: 'Tidak bisa ganti kamera (hanya 1 terdeteksi).',
                                canvas: 'Canvas tidak didukung browser ini.'
                            }}
                          />

                          <Button 
                            color="secondary"                              
                            hidden={numberOfCameras <= 1}
                            onClick={() => {
                              cameraRef.current.switchCamera();
                            }}
                          >
                            Ganti Kamera
                          </Button>
                     </div>
                 </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseCallback}>
                  Tutup
                </Button>
                {numberOfCameras > 1 && (
                     <Tooltip content={`Ganti ke kamera ${cameraFacingMode === 'user' ? 'belakang' : 'depan'}`}>
                        <Button isIconOnly color="default" variant="flat" onPress={handleSwitchCamera} aria-label="Ganti Kamera">
                           <RefreshCcw size={18} />
                        </Button>
                    </Tooltip>
                )}
                <Button color="primary" onPress={handleTakePhoto}>
                   <CameraIcon size={16} className="mr-1"/> Ambil Foto
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PesertaVerifikasiForm;