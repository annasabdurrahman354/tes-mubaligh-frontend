import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Input,
    Button,
    Tabs,
    Tab,
    Divider,
    Spinner,
    Chip,
    Autocomplete,
    AutocompleteItem,
} from "@heroui/react";
import { useKertosono } from "@/hooks/use-kertosono";
import { useOptions } from "@/hooks/use-options";
import { PesertaKertosonoVerifikasi } from "@/types/kertosono";

interface SelectOption {
    value: number | string;
    label: string;
}

function PesertaKertosonoVerifikasiUpdate() {
    const { id_tes_santri } = useParams<{ id_tes_santri: string }>();
    const navigate = useNavigate();

    // --- Custom Hooks ---
    const { getSinglePesertaKertosonoVerifikasi, updatePesertaKertosonoVerifikasi } = useKertosono();
    const { getProvinsiOptions, getKotaOptions, getKecamatanOptions, getKelurahanOptions, getDaerahSambungOptions, getPonpesOptions } = useOptions();

    // --- State Variables ---
    const [formData, setFormData] = useState<Partial<PesertaKertosonoVerifikasi>>({
        id_ponpes: null, jenis_kelamin: null, nama_lengkap: null, nama_ayah: null, nama_ibu: null,
        tempat_lahir: null, tanggal_lahir: null, alamat: null, rt: null, rw: null, provinsi_id: null,
        kota_kab_id: null, kecamatan_id: null, desa_kel_id: null, kode_pos: null, hp: null,
        id_daerah_sambung: null, kelompok_sambung: null, pendidikan: null, status_mondok: null,
    });

    const [options, setOptions] = useState<{
        provinsi: SelectOption[];
        kota: SelectOption[];
        kecamatan: SelectOption[];
        kelurahan: SelectOption[];
        daerahSambung: SelectOption[];
        ponpes: SelectOption[];
        pendidikan: SelectOption[];
        jenisKelamin: SelectOption[];
        statusMondok: SelectOption[];
    }>({
        provinsi: [], kota: [], kecamatan: [], kelurahan: [], daerahSambung: [], ponpes: [],
        pendidikan: [
            { value: "S1", label: "S1" }, { value: "S2", label: "S2" }, { value: "S3", label: "S3" },
            { value: "D2", label: "D2" }, { value: "D3", label: "D3" }, { value: "D4", label: "D4" },
            { value: "PAKET-C", label: "Paket C" }, { value: "SMA", label: "SMA/MA" }, { value: "SMK", label: "SMK" },
            { value: "SMP", label: "SMP/MTs" }, { value: "SD", label: "SD/MI" }, { value: "TK", label: "TK/RA" },
        ],
        jenisKelamin: [{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }],
        statusMondok: [{ value: "person", label: "Person" }, { value: "kiriman", label: "Kiriman" }, { value: "pelajar", label: "Pelajar" }],
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("personal");
    
    // Track whether initial data has been loaded to prevent refetching
    const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

    // Track loading state for dependent dropdowns
    const [loadingStates, setLoadingStates] = useState({
        kota: false,
        kecamatan: false,
        kelurahan: false
    });

    // --- Memoized fetch functions to avoid dependency issues ---
    const fetchKota = useCallback(async (provinsiId: string | number) => {
        if (!provinsiId) return [];
        setLoadingStates(prev => ({ ...prev, kota: true }));
        try {
            const data = await getKotaOptions(provinsiId);
            setLoadingStates(prev => ({ ...prev, kota: false }));
            return data;
        } catch (err) {
            console.error("Error fetching kota options:", err);
            setError("Gagal memuat opsi Kota/Kabupaten.");
            setLoadingStates(prev => ({ ...prev, kota: false }));
            return [];
        }
    }, [getKotaOptions]);

    const fetchKecamatan = useCallback(async (kotaId: string | number) => {
        if (!kotaId) return [];
        setLoadingStates(prev => ({ ...prev, kecamatan: true }));
        try {
            const data = await getKecamatanOptions(kotaId);
            setLoadingStates(prev => ({ ...prev, kecamatan: false }));
            return data;
        } catch (err) {
            console.error("Error fetching kecamatan options:", err);
            setError("Gagal memuat opsi Kecamatan.");
            setLoadingStates(prev => ({ ...prev, kecamatan: false }));
            return [];
        }
    }, [getKecamatanOptions]);

    const fetchKelurahan = useCallback(async (kecamatanId: string | number) => {
        if (!kecamatanId) return [];
        setLoadingStates(prev => ({ ...prev, kelurahan: true }));
        try {
            const data = await getKelurahanOptions(kecamatanId);
            setLoadingStates(prev => ({ ...prev, kelurahan: false }));
            return data;
        } catch (err) {
            console.error("Error fetching kelurahan options:", err);
            setError("Gagal memuat opsi Desa/Kelurahan.");
            setLoadingStates(prev => ({ ...prev, kelurahan: false }));
            return [];
        }
    }, [getKelurahanOptions]);

    // --- Initial data loading ---
    useEffect(() => {
        // Only run this effect once
        if (isInitialDataLoaded || !id_tes_santri) return;

        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Get participant data
                const fetchedData = await getSinglePesertaKertosonoVerifikasi(id_tes_santri);
                if (!fetchedData) {
                    setError("Data peserta tidak ditemukan atau gagal dimuat.");
                    setLoading(false);
                    return;
                }

                // Set form data
                setFormData({
                    id_ponpes: fetchedData.id_ponpes || null,
                    jenis_kelamin: fetchedData.jenis_kelamin || null,
                    nama_lengkap: fetchedData.nama_lengkap || null,
                    nama_ayah: fetchedData.nama_ayah || null,
                    nama_ibu: fetchedData.nama_ibu || null,
                    tempat_lahir: fetchedData.tempat_lahir || null,
                    tanggal_lahir: fetchedData.tanggal_lahir || null,
                    alamat: fetchedData.alamat || null,
                    rt: fetchedData.rt || null,
                    rw: fetchedData.rw || null,
                    provinsi_id: fetchedData.provinsi_id || null,
                    kota_kab_id: fetchedData.kota_kab_id || null,
                    kecamatan_id: fetchedData.kecamatan_id || null,
                    desa_kel_id: fetchedData.desa_kel_id || null,
                    kode_pos: fetchedData.kode_pos || null,
                    hp: fetchedData.hp || null,
                    id_daerah_sambung: fetchedData.id_daerah_sambung || null,
                    kelompok_sambung: fetchedData.kelompok_sambung || null,
                    pendidikan: fetchedData.pendidikan || null,
                    status_mondok: fetchedData.status_mondok || null,
                });

                // Fetch all static options in parallel
                const [provinsiData, daerahSambungData, ponpesData] = await Promise.all([
                    getProvinsiOptions(),
                    getDaerahSambungOptions(),
                    getPonpesOptions(),
                ]);

                // Initialize options with static data
                const newOptions = {
                    ...options,
                    provinsi: provinsiData,
                    daerahSambung: daerahSambungData,
                    ponpes: ponpesData,
                    kota: [],
                    kecamatan: [],
                    kelurahan: []
                };

                // Fetch cascading options if needed
                if (fetchedData.provinsi_id) {
                    newOptions.kota = await fetchKota(fetchedData.provinsi_id);
                    
                    if (fetchedData.kota_kab_id && newOptions.kota.length > 0) {
                        newOptions.kecamatan = await fetchKecamatan(fetchedData.kota_kab_id);
                        
                        if (fetchedData.kecamatan_id && newOptions.kecamatan.length > 0) {
                            newOptions.kelurahan = await fetchKelurahan(fetchedData.kecamatan_id);
                        }
                    }
                }

                // Update options state with all fetched data
                setOptions(newOptions);
                setIsInitialDataLoaded(true);
            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError("Terjadi kesalahan saat memuat data awal.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [
        id_tes_santri,
        getSinglePesertaKertosonoVerifikasi,
        getProvinsiOptions,
        getDaerahSambungOptions,
        getPonpesOptions,
        fetchKota,
        fetchKecamatan,
        fetchKelurahan,
        isInitialDataLoaded
    ]);

    // --- Handle Provinsi change - fetch Kota options ---
    useEffect(() => {
        // Skip during initial data loading
        if (!isInitialDataLoaded) return;
        
        const updateKotaOptions = async () => {
            // Clear dependent dropdowns
            setOptions(prev => ({
                ...prev,
                kota: [],
                kecamatan: [],
                kelurahan: []
            }));
            
            if (formData.provinsi_id) {
                const kotaData = await fetchKota(formData.provinsi_id);
                setOptions(prev => ({ ...prev, kota: kotaData }));
            }
        };
        
        updateKotaOptions();
    }, [formData.provinsi_id, fetchKota, isInitialDataLoaded]);

    // --- Handle Kota change - fetch Kecamatan options ---
    useEffect(() => {
        // Skip during initial data loading
        if (!isInitialDataLoaded) return;
        
        const updateKecamatanOptions = async () => {
            // Clear dependent dropdowns
            setOptions(prev => ({
                ...prev,
                kecamatan: [],
                kelurahan: []
            }));
            
            if (formData.kota_kab_id) {
                const kecamatanData = await fetchKecamatan(formData.kota_kab_id);
                setOptions(prev => ({ ...prev, kecamatan: kecamatanData }));
            }
        };
        
        updateKecamatanOptions();
    }, [formData.kota_kab_id, fetchKecamatan, isInitialDataLoaded]);

    // --- Handle Kecamatan change - fetch Kelurahan options ---
    useEffect(() => {
        // Skip during initial data loading
        if (!isInitialDataLoaded) return;
        
        const updateKelurahanOptions = async () => {
            // Clear dependent dropdown
            setOptions(prev => ({
                ...prev,
                kelurahan: []
            }));
            
            if (formData.kecamatan_id) {
                const kelurahanData = await fetchKelurahan(formData.kecamatan_id);
                setOptions(prev => ({ ...prev, kelurahan: kelurahanData }));
            }
        };
        
        updateKelurahanOptions();
    }, [formData.kecamatan_id, fetchKelurahan, isInitialDataLoaded]);

    // --- Event Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleAutocompleteChange = (name: keyof PesertaKertosonoVerifikasi, selectedKey: React.Key | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedKey !== null ? selectedKey : null,
        }));
        
        if (error) setError(null);

        // Clear dependent fields when an Autocomplete driving dependency changes
        if (name === 'provinsi_id') {
            setFormData(prev => ({ ...prev, kota_kab_id: null, kecamatan_id: null, desa_kel_id: null }));
        } else if (name === 'kota_kab_id') {
            setFormData(prev => ({ ...prev, kecamatan_id: null, desa_kel_id: null }));
        } else if (name === 'kecamatan_id') {
            setFormData(prev => ({ ...prev, desa_kel_id: null }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id_tes_santri) {
            setError("ID Peserta tidak valid untuk update.");
            return;
        }
        
        setSubmitting(true);
        setError(null);

        try {
            const updatedData = await updatePesertaKertosonoVerifikasi(id_tes_santri, formData);
            if (updatedData) {
                console.log("Update successful:", updatedData);
                alert("Data berhasil diperbarui!");
                navigate('/peserta-kertosono/verifikasi');
            } else {
                setError("Gagal memperbarui data. Periksa kembali isian Anda atau coba lagi.");
            }
        } catch (err) {
            console.error("Unexpected error during submission:", err);
            setError("Terjadi kesalahan yang tidak diketahui saat menyimpan.");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper function to safely convert value to string for selectedKey
    const getKeyString = (value: string | number | null | undefined): string | null => {
        if (value === null || value === undefined || value === null) {
            return null;
        }
        return String(value);
    };

    // --- Render Loading State ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-lg font-medium">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <Card className="shadow-lg">
                 {/* CardHeader remains the same */}
                 <CardHeader className="flex flex-col items-start gap-1 bg-gradient-to-r from-slate-100 to-slate-50">
                    <h2 className="text-2xl font-bold">Verifikasi Data Peserta Kertosono</h2>
                    <p className="text-default-500">Silakan periksa dan perbarui data peserta</p>
                </CardHeader>

                {/* Error Chip remains the same */}
                 {error && (
                    <div className="px-6 pt-4">
                        <Chip color="danger" variant="flat" className="w-full justify-start py-3 text-left whitespace-normal h-auto">
                            {error}
                        </Chip>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                     {/* Tabs remain the same */}
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={(key) => setActiveTab(key as string)}
                        className="w-full px-6 pt-4" variant="underlined" color="primary" fullWidth
                    >
                        {/* Tab: Data Pribadi */}
                        <Tab key="personal" title="Data Pribadi">
                            <CardBody className="gap-6 pt-4 pb-6 px-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nama Lengkap */}
                                    <Input id="nama_lengkap" name="nama_lengkap" label="Nama Lengkap" labelPlacement="outside"
                                        placeholder="Masukkan Nama Lengkap" value={formData.nama_lengkap || ''} onChange={handleChange} isRequired className="w-full" />

                                    {/* Jenis Kelamin -> Autocomplete */}
                                    <Autocomplete
                                        id="jenis_kelamin" // Use id if needed for accessibility/labels
                                        label="Jenis Kelamin"
                                        labelPlacement="outside"
                                        placeholder="-- Pilih Jenis Kelamin --"
                                        items={options.jenisKelamin}
                                        selectedKey={getKeyString(formData.jenis_kelamin)} // Ensure string key or null
                                        onSelectionChange={(key) => handleAutocompleteChange("jenis_kelamin", key)}
                                        isRequired
                                        className="w-full"
                                        aria-label="Jenis Kelamin" // Add aria-label for accessibility
                                        allowsCustomValue={false} // Prevent custom input unless desired
                                    >
                                        {(item) => (
                                            <AutocompleteItem key={item.value} value={item.value}>
                                                {item.label}
                                            </AutocompleteItem>
                                        )}
                                    </Autocomplete>

                                    {/* Tempat Lahir */}
                                    <Input id="tempat_lahir" name="tempat_lahir" label="Tempat Lahir" labelPlacement="outside"
                                        placeholder="Masukkan Tempat Lahir" value={formData.tempat_lahir || ''} onChange={handleChange} isRequired className="w-full" />

                                    {/* Tanggal Lahir */}
                                     <Input type="date" id="tanggal_lahir" name="tanggal_lahir" label="Tanggal Lahir" labelPlacement="outside"
                                         value={formData.tanggal_lahir || ''} onChange={handleChange} isRequired className="w-full" />

                                     {/* Nama Ayah */}
                                     <Input id="nama_ayah" name="nama_ayah" label="Nama Ayah" labelPlacement="outside"
                                         placeholder="Masukkan Nama Ayah" value={formData.nama_ayah || ''} onChange={handleChange} className="w-full" />

                                     {/* Nama Ibu */}
                                     <Input id="nama_ibu" name="nama_ibu" label="Nama Ibu" labelPlacement="outside"
                                         placeholder="Masukkan Nama Ibu" value={formData.nama_ibu || ''} onChange={handleChange} className="w-full" />

                                     {/* Nomor Telepon (HP) */}
                                     <Input type="tel" id="hp" name="hp" label="Nomor Telepon (HP)" labelPlacement="outside"
                                         placeholder="Contoh: 08123456789" value={formData.hp || ''} onChange={handleChange} className="w-full" />

                                     {/* Pendidikan Terakhir -> Autocomplete */}
                                     <Autocomplete
                                        label="Pendidikan Terakhir"
                                        labelPlacement="outside"
                                        placeholder="-- Pilih Pendidikan --"
                                        items={options.pendidikan}
                                        selectedKey={getKeyString(formData.pendidikan)}
                                        onSelectionChange={(key) => handleAutocompleteChange("pendidikan", key)}
                                        isRequired
                                        className="w-full"
                                        aria-label="Pendidikan Terakhir"
                                        allowsCustomValue={false}
                                     >
                                        {(item) => (
                                            <AutocompleteItem key={item.value} value={item.value}>
                                                {item.label}
                                            </AutocompleteItem>
                                        )}
                                     </Autocomplete>

                                     {/* Status Mondok -> Autocomplete */}
                                    <Autocomplete
                                        label="Status Mondok"
                                        labelPlacement="outside"
                                        placeholder="-- Pilih Status --"
                                        items={options.statusMondok}
                                        selectedKey={getKeyString(formData.status_mondok)}
                                        onSelectionChange={(key) => handleAutocompleteChange("status_mondok", key)}
                                        isRequired
                                        className="w-full"
                                        aria-label="Status Mondok"
                                        allowsCustomValue={false}
                                     >
                                        {(item) => (
                                            <AutocompleteItem key={item.value} value={item.value}>
                                                {item.label}
                                            </AutocompleteItem>
                                        )}
                                     </Autocomplete>
                                </div>
                            </CardBody>
                        </Tab>

                        {/* Tab: Alamat */}
                        <Tab key="address" title="Alamat">
                             <CardBody className="gap-6 pt-4 pb-6 px-6">
                                {/* Alamat Jalan */}
                                <Input id="alamat" name="alamat" label="Alamat (Jalan/Dusun)" labelPlacement="outside"
                                    value={formData.alamat || ''} onChange={handleChange} placeholder="Contoh: Jl. Merdeka No. 10 atau Dsn. Krajan" isRequired className="w-full" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* RT */}
                                    <Input id="rt" name="rt" label="RT" labelPlacement="outside" value={formData.rt || ''}
                                        onChange={handleChange} maxLength={3} placeholder="001" isRequired className="w-full" />
                                    {/* RW */}
                                    <Input id="rw" name="rw" label="RW" labelPlacement="outside" value={formData.rw || ''}
                                        onChange={handleChange} maxLength={3} placeholder="002" isRequired className="w-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Provinsi -> Autocomplete */}
                                    <Autocomplete
                                        label="Provinsi" labelPlacement="outside" placeholder="-- Cari/Pilih Provinsi --"
                                        items={options.provinsi}
                                        selectedKey={getKeyString(formData.provinsi_id)}
                                        onSelectionChange={(key) => handleAutocompleteChange("provinsi_id", key)}
                                        isRequired className="w-full" aria-label="Provinsi"
                                        isLoading={loading && options.provinsi.length === 0}
                                        allowsCustomValue={false}
                                    >
                                        {(item) => (<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>)}
                                    </Autocomplete>

                                    {/* Kota/Kabupaten -> Autocomplete */}
                                    <Autocomplete
                                        label="Kota/Kabupaten" labelPlacement="outside" placeholder="-- Cari/Pilih Kota/Kabupaten --"
                                        items={options.kota}
                                        selectedKey={getKeyString(formData.kota_kab_id)}
                                        onSelectionChange={(key) => handleAutocompleteChange("kota_kab_id", key)}
                                        isRequired className="w-full" aria-label="Kota/Kabupaten"
                                        isDisabled={!formData.provinsi_id || (options.provinsi.length > 0 && options.kota.length === 0 && !error)} // Disable if province selected but no kota options yet (or province not selected)
                                        isLoading={!!formData.provinsi_id && options.kota.length === 0 && !error} // Show loading only when options are expected
                                        allowsCustomValue={false}
                                    >
                                         {(item) => (<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>)}
                                    </Autocomplete>

                                    {/* Kecamatan -> Autocomplete */}
                                     <Autocomplete
                                        label="Kecamatan" labelPlacement="outside" placeholder="-- Cari/Pilih Kecamatan --"
                                        items={options.kecamatan}
                                        selectedKey={getKeyString(formData.kecamatan_id)}
                                        onSelectionChange={(key) => handleAutocompleteChange("kecamatan_id", key)}
                                        isRequired className="w-full" aria-label="Kecamatan"
                                        isDisabled={!formData.kota_kab_id || (options.kota.length > 0 && options.kecamatan.length === 0 && !error)}
                                        isLoading={!!formData.kota_kab_id && options.kecamatan.length === 0 && !error}
                                        allowsCustomValue={false}
                                    >
                                        {(item) => (<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>)}
                                     </Autocomplete>

                                     {/* Desa/Kelurahan -> Autocomplete */}
                                     <Autocomplete
                                        label="Desa/Kelurahan" labelPlacement="outside" placeholder="-- Cari/Pilih Desa/Kelurahan --"
                                        items={options.kelurahan}
                                        selectedKey={getKeyString(formData.desa_kel_id)}
                                        onSelectionChange={(key) => handleAutocompleteChange("desa_kel_id", key)}
                                        isRequired className="w-full" aria-label="Desa/Kelurahan"
                                        isDisabled={!formData.kecamatan_id || (options.kecamatan.length > 0 && options.kelurahan.length === 0 && !error)}
                                        isLoading={!!formData.kecamatan_id && options.kelurahan.length === 0 && !error}
                                        allowsCustomValue={false}
                                    >
                                        {(item) => (<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>)}
                                     </Autocomplete>
                                </div>

                                {/* Kode Pos */}
                                <div className="max-w-xs">
                                     <Input id="kode_pos" name="kode_pos" label="Kode Pos" labelPlacement="outside"
                                        value={formData.kode_pos || ''} onChange={handleChange} maxLength={10} className="w-full" />
                                </div>
                            </CardBody>
                        </Tab>

                         {/* Tab: Data Program */}
                        <Tab key="program" title="Data Program">
                             <CardBody className="gap-6 pt-4 pb-6 px-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {/* Daerah Sambung -> Autocomplete */}
                                     <Autocomplete
                                        label="Daerah Sambung" labelPlacement="outside" placeholder="-- Cari/Pilih Daerah Sambung --"
                                        items={options.daerahSambung}
                                        selectedKey={getKeyString(formData.id_daerah_sambung)}
                                        onSelectionChange={(key) => handleAutocompleteChange("id_daerah_sambung", key)}
                                        isRequired className="w-full" aria-label="Daerah Sambung"
                                        isLoading={loading && options.daerahSambung.length === 0}
                                        allowsCustomValue={false}
                                    >
                                         {(item) => (<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>)}
                                     </Autocomplete>

                                     {/* Kelompok Sambung */}
                                     <Input id="kelompok_sambung" name="kelompok_sambung" label="Kelompok Sambung" labelPlacement="outside"
                                        placeholder="Masukkan Kelompok Sambung" value={formData.kelompok_sambung || ''} onChange={handleChange} isRequired className="w-full" />

                                     {/* Asal Pondok Pesantren -> Autocomplete */}
                                     <Autocomplete
                                        label="Asal Pondok Pesantren" labelPlacement="outside" placeholder="-- Cari/Pilih Pondok --"
                                        items={options.ponpes}
                                        selectedKey={getKeyString(formData.id_ponpes)}
                                        onSelectionChange={(key) => handleAutocompleteChange("id_ponpes", key)}
                                        isRequired className="w-full" aria-label="Asal Pondok Pesantren"
                                        isLoading={loading && options.ponpes.length === 0}
                                        allowsCustomValue={false}
                                     >
                                         {(item) => (<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>)}
                                     </Autocomplete>
                                </div>
                            </CardBody>
                        </Tab>
                    </Tabs>

                    <Divider />

                     {/* CardFooter with Previous/Next/Submit remains the same */}
                    <CardFooter className="flex justify-between p-6">
                        <Button type="button" variant="flat" onPress={() => {/* ... */}} isDisabled={activeTab === "personal"}>
                            Sebelumnya
                        </Button>
                        {activeTab !== "program" ? (
                             <Button type="button" color="primary" onPress={() => {/* ... */}}>
                                Selanjutnya
                             </Button>
                        ) : (
                            <Button type="submit" color="success" isDisabled={submitting}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                            >
                                {submitting ? (<> <Spinner color="current" size="sm" className="mr-2" /> Menyimpan... </>) : ("Simpan Perubahan")}
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default PesertaKertosonoVerifikasiUpdate;