import React, { useEffect, useState, useCallback } from "react";
import { PesertaKertosonoVerifikasi } from "@/types/kertosono";
import { addToast, Button, Card, CardBody, cn, Divider, Input, Select, SelectItem, Spinner, toast } from "@heroui/react";
import api, { handleApiError } from "@/libs/axios"; // Make sure this path is correct

// Interface for the standardized return format (keep this)
interface SelectOption {
  value: number | string;
  label: string;
}

interface PesertaVerifikasiFormProps {
  santri: PesertaKertosonoVerifikasi;
  onSubmit: (data: Partial<PesertaKertosonoVerifikasi>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const PesertaVerifikasiForm: React.FC<PesertaVerifikasiFormProps> = ({
  santri,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Partial<PesertaKertosonoVerifikasi>>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isKotaLoading, setIsKotaLoading] = useState(false);
  const [isKecamatanLoading, setIsKecamatanLoading] = useState(false);
  const [isKelurahanLoading, setIsKelurahanLoading] = useState(false);

  const [provinsiOptions, setProvinsiOptions] = useState<SelectOption[]>([]);
  const [kotaOptions, setKotaOptions] = useState<SelectOption[]>([]);
  const [kecamatanOptions, setKecamatanOptions] = useState<SelectOption[]>([]);
  const [kelurahanOptions, setKelurahanOptions] = useState<SelectOption[]>([]);
  const [daerahSambungOptions, setDaerahSambungOptions] = useState<SelectOption[]>([]);
  const [ponpesOptions, setPonpesOptions] = useState<SelectOption[]>([]);

  // --- Fetch Functions Defined Directly in Component and Memoized ---

  const getProvinsiOptions = useCallback(async (): Promise<SelectOption[]> => {
    console.log("Fetching Provinsi options (local)..."); // Optional log
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
  }, []); // Empty dependency array - function doesn't depend on component state/props

  const getKotaOptions = useCallback(async (provinsiId: string | number): Promise<SelectOption[]> => {
    console.log(`Workspaceing Kota options for ${provinsiId} (local)...`); // Optional log
    if (!provinsiId) return [];
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
    }
  }, []); // Empty dependency array

  const getKecamatanOptions = useCallback(async (kotaId: string | number): Promise<SelectOption[]> => {
    console.log(`Workspaceing Kecamatan options for ${kotaId} (local)...`); // Optional log
    if (!kotaId) return [];
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
    }
  }, []); // Empty dependency array

  const getKelurahanOptions = useCallback(async (kecamatanId: string | number): Promise<SelectOption[]> => {
    console.log(`Workspaceing Kelurahan options for ${kecamatanId} (local)...`); // Optional log
    if (!kecamatanId) return [];
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
    }
  }, []); // Empty dependency array

  const getDaerahSambungOptions = useCallback(async (): Promise<SelectOption[]> => {
    console.log("Fetching Daerah Sambung options (local)..."); // Optional log
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
  }, []); // Empty dependency array

  const getPonpesOptions = useCallback(async (): Promise<SelectOption[]> => {
    console.log("Fetching Ponpes options (local)..."); // Optional log
    try {
      const response = await api.get("options/ponpes");
      const formattedData: SelectOption[] = Object.entries(response.data ?? {}).map(
        ([label, value]) => ({
          value: value as (string | number),
          label: label,
        })
      );
      formattedData.sort((a, b) => a.label.localeCompare(b.label));
      return formattedData;
    } catch (err) {
      handleApiError(err);
       addToast({ title: "Error", description: "Gagal memuat data pondok pesantren.", color: 'danger' });
      return [];
    }
  }, []); // Empty dependency array


  // 1. Initialize form data from santri prop
  useEffect(() => {
    console.log("Effect: Initializing formData from santri", santri);
    setFormData({
        id_ponpes: santri.id_ponpes,
        jenis_kelamin: santri.jenis_kelamin,
        nama_lengkap: santri.nama_lengkap,
        nama_panggilan: santri.nama_panggilan,
        nama_ayah: santri.nama_ayah,
        nama_ibu: santri.nama_ibu,
        tempat_lahir: santri.tempat_lahir,
        tanggal_lahir: santri.tanggal_lahir, // Ensure backend/API returns in YYYY-MM-DD format for input type="date"
        alamat: santri.alamat,
        rt: santri.rt,
        rw: santri.rw,
        provinsi_id: santri.provinsi_id,
        kota_kab_id: santri.kota_kab_id,
        kecamatan_id: santri.kecamatan_id,
        desa_kel_id: santri.desa_kel_id,
        kode_pos: santri.kode_pos,
        hp: santri.hp,
        id_daerah_sambung: santri.id_daerah_sambung,
        kelompok_sambung: santri.kelompok_sambung,
        pendidikan: santri.pendidikan,
        jurusan: santri.jurusan,
        status_mondok: santri.status_mondok,
    });
    // Reset initial loading flag when santri data changes and form is initialized
    // We'll handle the actual end of loading after fetches complete
    setIsInitialLoading(true);
  }, [santri]); // Depend only on santri

  // 2. Fetch static options once (or when memoized functions change, which they shouldn't)
  useEffect(() => {
    console.log("Effect: Loading static options");
    const loadStaticOptions = async () => {
      try {
        // No need to set setIsInitialLoading(true) here, it's set when santri changes
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
        // Error handling is now within the fetch functions themselves
        console.error("Error in loadStaticOptions Promise.all:", error); // Should be rare now
      }
      // Don't stop initial loading here, wait for initial dependent options
    };
    loadStaticOptions();
  }, [getProvinsiOptions, getPonpesOptions, getDaerahSambungOptions]); // Depend on memoized functions


  // 3. Fetch initial dependent options based on INITIALIZED formData
  useEffect(() => {
    // Only run this AFTER formData has been initialized from santri
    // And after static options have likely started loading (provinsiOptions might still be empty initially)
    if (formData.provinsi_id === undefined) {
         // If formData is set but has no province, initial dependent load is done (nothing to load)
         if (!isInitialLoading) return; // Avoid unnecessary runs if already loaded
         console.log("Effect: Initial dependent options - No provinsi_id, skipping fetch.");
         setIsInitialLoading(false); // Can stop initial loading now
         return;
    }

    console.log("Effect: Loading initial dependent options for:", formData.provinsi_id);
    const loadInitialDependentOptions = async () => {
      try {
        // Reset dependent options before fetching
        setKotaOptions([]);
        setKecamatanOptions([]);
        setKelurahanOptions([]);

        // Start specific loaders
        setIsKotaLoading(true);
        const initialKota = await getKotaOptions(formData.provinsi_id!); // Use non-null assertion if check passed
        setKotaOptions(initialKota);
        setIsKotaLoading(false);
        console.log("Effect: Initial Kota loaded", initialKota);

        if (formData.kota_kab_id) {
            setIsKecamatanLoading(true);
            const initialKecamatan = await getKecamatanOptions(formData.kota_kab_id);
            setKecamatanOptions(initialKecamatan);
            setIsKecamatanLoading(false);
            console.log("Effect: Initial Kecamatan loaded", initialKecamatan);

            if (formData.kecamatan_id) {
                setIsKelurahanLoading(true);
                const initialKelurahan = await getKelurahanOptions(formData.kecamatan_id);
                setKelurahanOptions(initialKelurahan);
                setIsKelurahanLoading(false);
                console.log("Effect: Initial Kelurahan loaded", initialKelurahan);
            }
        }
      } catch (error) {
        console.error("Error loading initial dependent options:", error);
        // Error handling is within fetch functions, but reset loading states here
        setIsKotaLoading(false);
        setIsKecamatanLoading(false);
        setIsKelurahanLoading(false);
      } finally {
          console.log("Effect: Finished loading initial dependent options.");
          setIsInitialLoading(false); // Stop the overall initial loading indicator
      }
    };

    loadInitialDependentOptions();

  }, [
      // Depend on the *existence* of these IDs in the initialized formData
      formData.provinsi_id,
      formData.kota_kab_id,
      formData.kecamatan_id,
      // Depend on the memoized fetch functions
      getKotaOptions,
      getKecamatanOptions,
      getKelurahanOptions
      // DO NOT depend on provinsiOptions.length here - it causes re-runs when static options load.
      // The logic now runs once formData is initialized with a provinsi_id.
  ]);


  // 4. Handle changes to regular input fields
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []); // No dependencies needed

  // --- Event Handlers for Select Changes (also memoized) ---

  // 5a. Handle *user-triggered* provinsi change
   const handleProvinsiChange = useCallback(async (provinsiId: string | number | null) => {
    console.log("Handler: Provinsi changed to", provinsiId);
    // Update formData first for the selected province
    setFormData((prev) => ({
      ...prev,
      provinsi_id: provinsiId,
      kota_kab_id: null, // Reset downstream values
      kecamatan_id: null,
      desa_kel_id: null
    }));

    // Reset downstream options
    setKotaOptions([]);
    setKecamatanOptions([]);
    setKelurahanOptions([]);

    if (provinsiId) {
      setIsKotaLoading(true);
      try {
        const kota = await getKotaOptions(provinsiId); // Use memoized function
        setKotaOptions(kota);
      } finally {
        setIsKotaLoading(false);
      }
    }
  }, [getKotaOptions]); // Depends on getKotaOptions

  // 5b. Handle *user-triggered* kota change
  const handleKotaChange = useCallback(async (kotaId: string | number | null) => {
    console.log("Handler: Kota changed to", kotaId);
     setFormData((prev) => ({
      ...prev,
      kota_kab_id: kotaId,
      kecamatan_id: null, // Reset downstream values
      desa_kel_id: null
    }));

    // Reset downstream options
    setKecamatanOptions([]);
    setKelurahanOptions([]);

    if (kotaId) {
      setIsKecamatanLoading(true);
      try {
        const kecamatan = await getKecamatanOptions(kotaId); // Use memoized function
        setKecamatanOptions(kecamatan);
      } finally {
        setIsKecamatanLoading(false);
      }
    }
  }, [getKecamatanOptions]); // Depends on getKecamatanOptions

  // 5c. Handle *user-triggered* kecamatan change
  const handleKecamatanChange = useCallback(async (kecamatanId: string | number | null) => {
    console.log("Handler: Kecamatan changed to", kecamatanId);
     setFormData((prev) => ({
      ...prev,
      kecamatan_id: kecamatanId,
      desa_kel_id: null // Reset downstream value
    }));

    // Reset downstream options
    setKelurahanOptions([]);

    if (kecamatanId) {
      setIsKelurahanLoading(true);
      try {
        const kelurahan = await getKelurahanOptions(kecamatanId); // Use memoized function
        setKelurahanOptions(kelurahan);
      } finally {
        setIsKelurahanLoading(false);
      }
    }
  }, [getKelurahanOptions]); // Depends on getKelurahanOptions


  // 5d. Generic handler to update state and call specific handlers
  const handleSelectChange = useCallback((name: string) => (value: string | number | null) => {
    // Update the specific field that changed
    // Note: For dependent fields (provinsi, kota, kecamatan), the specific handlers below will update formData *again*,
    // but React batches state updates, so it's usually fine. Alternatively, remove setFormData from specific handlers.
    // Let's keep setFormData here for non-dependent fields like 'jenis_kelamin'.
    // And let the specific handlers manage their field and downstream resets.
     if (name === "provinsi_id") {
        handleProvinsiChange(value);
    } else if (name === "kota_kab_id") {
        handleKotaChange(value);
    } else if (name === "kecamatan_id") {
        handleKecamatanChange(value);
    } else if (name === "desa_kel_id") {
        // Only update formData for the last item in the chain
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    else {
       // Handle other select fields like jenis_kelamin, id_ponpes etc.
       setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, [handleProvinsiChange, handleKotaChange, handleKecamatanChange]); // Depends on the specific handlers


  // 6. Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    // Validation logic remains the same
    const requiredFields: (keyof PesertaKertosonoVerifikasi)[] = [ // More specific type
      "nama_lengkap", "jenis_kelamin", "tempat_lahir", "tanggal_lahir",
      "alamat", "rt", "rw", "id_ponpes", "provinsi_id", "kota_kab_id",
      "kecamatan_id", "desa_kel_id", "id_daerah_sambung", "kelompok_sambung",
      "pendidikan", "status_mondok",
    ];
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

    await onSubmit(formData);
  }, [formData, onSubmit]); // Depends on formData and the onSubmit prop

  // 7. Show spinner during initial load phase
  if (isInitialLoading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="lg" color="primary" />
        <span className="ml-3">Memuat data awal...</span>
      </div>
    );
  }

  // 8. Render the form
  return (
    <Card
      fullWidth
      className={cn(`border-small dark:border-small border-default-100`)}
    >
      <form onSubmit={handleSubmit}>
      <CardBody className="p-6 space-y-6"> {/* Added padding and vertical spacing */}
          {/* Personal Info Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Pribadi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                isReadOnly
                label="NISPN"
                value={santri.nispn}
                variant="bordered" // Or "flat", "faded"
              />
              <Input
                isReadOnly
                label="NIK"
                value={santri.nik}
                variant="bordered"
              />
              <Input
                label="Nama Lengkap"
                name="nama_lengkap"
                value={formData.nama_lengkap || ""}
                onChange={handleInputChange}
                isRequired
              />
              <Input
                label="Nama Panggilan"
                name="nama_panggilan"
                value={formData.nama_panggilan || ""}
                onChange={handleInputChange}
              />
              <Select
                label="Jenis Kelamin"
                name="jenis_kelamin"
                placeholder="Pilih Jenis Kelamin"
                // Use toString() for selectedKeys if value can be number
                selectedKeys={formData.jenis_kelamin ? [formData.jenis_kelamin.toString()] : []}
                // Pass the value directly from the event
                onChange={(e) => handleSelectChange("jenis_kelamin")(e.target.value || null)}
                isRequired
              >
                <SelectItem key="L" value="L">Laki-laki</SelectItem>
                <SelectItem key="P" value="P">Perempuan</SelectItem>
              </Select>
              <Input
                label="HP"
                name="hp"
                value={formData.hp || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir || ""}
                onChange={handleInputChange}
                isRequired
              />
              <Input
                label="Tanggal Lahir"
                name="tanggal_lahir"
                type="date"
                // Ensure value is in 'YYYY-MM-DD' format for date input
                // Slice if it includes time information from backend
                value={formData.tanggal_lahir ? formData.tanggal_lahir.toString().slice(0, 10) : ""}
                onChange={handleInputChange}
                isRequired
              />
              <Input
                label="Nama Ayah"
                name="nama_ayah"
                value={formData.nama_ayah || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Nama Ibu"
                name="nama_ibu"
                value={formData.nama_ibu || ""}
                onChange={handleInputChange}
              />
              <Select
                label="Pendidikan"
                name="pendidikan"
                placeholder="Pilih Pendidikan"
                selectedKeys={formData.pendidikan ? [formData.pendidikan.toString()] : []}
                onChange={(e) => handleSelectChange("pendidikan")(e.target.value || null)}
                isRequired
              >
                <SelectItem key="S1" value="S1">S1</SelectItem>
                <SelectItem key="S2" value="S2">S2</SelectItem>
                <SelectItem key="S3" value="S3">S3</SelectItem>
                <SelectItem key="D2" value="D2">D2</SelectItem>
                <SelectItem key="D3" value="D3">D3</SelectItem>
                <SelectItem key="D4" value="D4">D4</SelectItem>
                <SelectItem key="PAKET-C" value="PAKET-C">PAKET-C</SelectItem>
                <SelectItem key="SMA" value="SMA">SMA</SelectItem>
                <SelectItem key="SMK" value="SMK">SMK</SelectItem>
                <SelectItem key="SMP" value="SMP">SMP</SelectItem>
                <SelectItem key="SD" value="SD">SD</SelectItem>
                <SelectItem key="TK" value="TK">TK</SelectItem>
              </Select>
              <Input
                label="Jurusan"
                name="jurusan"
                value={formData.jurusan || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Divider />

          {/* Address Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Alamat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Alamat"
                name="alamat"
                value={formData.alamat || ""}
                onChange={handleInputChange}
                isRequired
              />
              <div className="flex gap-2">
                <Input
                  label="RT"
                  name="rt"
                  value={formData.rt || ""}
                  onChange={handleInputChange}
                  isRequired
                />
                <Input
                  label="RW"
                  name="rw"
                  value={formData.rw || ""}
                  onChange={handleInputChange}
                  isRequired
                />
              </div>
              <Select
                label="Provinsi"
                name="provinsi_id"
                placeholder="Pilih Provinsi"
                selectedKeys={formData.provinsi_id ? [formData.provinsi_id.toString()] : []}
                // Convert value to Number or null
                onChange={(e) => handleSelectChange("provinsi_id")(e.target.value ? Number(e.target.value) : null)}
                isRequired
              >
                {provinsiOptions.map((option) => (
                  <SelectItem key={option.value.toString()} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Kota/Kabupaten"
                name="kota_kab_id"
                placeholder={isKotaLoading ? "Memuat..." : "Pilih Kota/Kabupaten"}
                selectedKeys={formData.kota_kab_id ? [formData.kota_kab_id.toString()] : []}
                onChange={(e) => handleSelectChange("kota_kab_id")(e.target.value ? Number(e.target.value) : null)}
                isDisabled={!formData.provinsi_id || isKotaLoading || isInitialLoading} // Also disable during initial load
                isRequired
              >
                {kotaOptions.map((option) => (
                  <SelectItem key={option.value.toString()} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Kecamatan"
                name="kecamatan_id"
                placeholder={isKecamatanLoading ? "Memuat..." : "Pilih Kecamatan"}
                selectedKeys={formData.kecamatan_id ? [formData.kecamatan_id.toString()] : []}
                onChange={(e) => handleSelectChange("kecamatan_id")(e.target.value ? Number(e.target.value) : null)}
                isDisabled={!formData.kota_kab_id || isKecamatanLoading || isInitialLoading}
                isRequired
              >
                {kecamatanOptions.map((option) => (
                  <SelectItem key={option.value.toString()} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Desa/Kelurahan"
                name="desa_kel_id"
                placeholder={isKelurahanLoading ? "Memuat..." : "Pilih Desa/Kelurahan"}
                selectedKeys={formData.desa_kel_id ? [formData.desa_kel_id.toString()] : []}
                onChange={(e) => handleSelectChange("desa_kel_id")(e.target.value ? Number(e.target.value) : null)}
                isDisabled={!formData.kecamatan_id || isKelurahanLoading || isInitialLoading}
                isRequired
              >
                {kelurahanOptions.map((option) => (
                  <SelectItem key={option.value.toString()} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Kode Pos"
                name="kode_pos"
                value={formData.kode_pos || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Divider/>

          {/* Pondok Info Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Pondok</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Asal Pondok"
                name="id_ponpes"
                placeholder="Pilih Pondok"
                selectedKeys={formData.id_ponpes ? [formData.id_ponpes.toString()] : []}
                onChange={(e) => handleSelectChange("id_ponpes")(e.target.value ? Number(e.target.value) : null)}
                isRequired
              >
                {ponpesOptions.map((option) => (
                  <SelectItem key={option.value.toString()} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Status Mondok"
                name="status_mondok"
                placeholder="Pilih Status"
                selectedKeys={formData.status_mondok ? [formData.status_mondok.toString()] : []}
                onChange={(e) => handleSelectChange("status_mondok")(e.target.value || null)}
                isRequired
              >
                <SelectItem key="person" value="person">Person</SelectItem>
                <SelectItem key="kiriman" value="kiriman">Kiriman</SelectItem>
                <SelectItem key="pelajar" value="pelajar">Pelajar</SelectItem>
              </Select>
              <Select
                label="Daerah Sambung"
                name="id_daerah_sambung"
                placeholder="Pilih Daerah"
                selectedKeys={formData.id_daerah_sambung ? [formData.id_daerah_sambung.toString()] : []}
                onChange={(e) => handleSelectChange("id_daerah_sambung")(e.target.value ? Number(e.target.value) : null)}
                isRequired
              >
                {daerahSambungOptions.map((option) => (
                  <SelectItem key={option.value.toString()} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Kelompok Sambung"
                name="kelompok_sambung"
                value={formData.kelompok_sambung || ""}
                onChange={handleInputChange}
                isRequired
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              color="default"
              variant="flat"
              onPress={onCancel} // Use onPress for HeroUI Button if it's intended for click/tap
              isDisabled={isSubmitting || isInitialLoading} // Disable during initial load too
            >
              Batal
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              // Disable submit if submitting, during initial load, or if dependent options are actively loading
              isDisabled={isSubmitting || isInitialLoading || isKotaLoading || isKecamatanLoading || isKelurahanLoading}
            >
              Simpan
            </Button>
          </div>
      </CardBody>
      </form>
    </Card>
  );
};

export default PesertaVerifikasiForm;