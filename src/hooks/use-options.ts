import api, { handleApiError } from "@/libs/axios"; // Adjust path as needed

// Interface for the standardized return format
interface SelectOption {
  value: number | string;
  label: string;
}

export function useOptions() {

  const getProvinsiOptions = async (): Promise<SelectOption[]> => {
    try {
      const response = await api.get("options/provinsi");
      // Directly map response.data, assuming it's an array or defaulting to []
      // Use 'any' for item type if specific structure isn't strictly enforced
      const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
        value: item.id,
        label: item.nama,
      }));
      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getKotaOptions = async (provinsiId: string | number): Promise<SelectOption[]> => {
     if (!provinsiId) return []; // Return empty array if no ID
    try {
      const response = await api.get(`options/kota/${provinsiId}`);
      // Directly map response.data
      const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
        value: item.id,
        label: item.nama,
      }));
      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getKecamatanOptions = async (kotaId: string | number): Promise<SelectOption[]> => {
    if (!kotaId) return []; // Return empty array if no ID
    try {
      const response = await api.get(`options/kecamatan/${kotaId}`);
       // Directly map response.data
      const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
        value: item.id,
        label: item.nama,
      }));
      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getKelurahanOptions = async (kecamatanId: string | number): Promise<SelectOption[]> => {
     if (!kecamatanId) return []; // Return empty array if no ID
    try {
      const response = await api.get(`options/kelurahan/${kecamatanId}`);
      // Directly map response.data
      const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
        value: item.id,
        label: item.nama,
      }));
      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getDaerahSambungOptions = async (): Promise<SelectOption[]> => {
    try {
      const response = await api.get("options/daerah-sambung");
      // Directly map response.data
      const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
        value: item.id,
        label: item.nama,
      }));
      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getPonpesOptions = async (): Promise<SelectOption[]> => {
    try {
      const response = await api.get("options/ponpes");
      // API returns array of objects [{id, nama}]
      const formattedData: SelectOption[] = (response.data ?? []).map((item: any) => ({
        value: item.id,
        label: item.nama,
      }));
      // formattedData.sort((a, b) => a.label.localeCompare(b.label)); // Already sorted by backend

      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getGuruPenggantiKediriOptions = async (guru_id: string | number): Promise<SelectOption[]> => {
    try {
      const response = await api.get(`tes/options/guru-pengganti-kediri/${guru_id}`);
      // Directly map response.data
      const formattedData: SelectOption[] = Object.entries(response.data ?? {}).map(
        ([label, value]) => ({
          // Ensure value is treated appropriately (might be string or number)
          value: value as (string | number),
          label: label,
        })
      );
      // Sort alphabetically by label if needed
      formattedData.sort((a, b) => a.label.localeCompare(b.label));

      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getGuruPenggantiKertosonoOptions = async (guru_id: string | number): Promise<SelectOption[]> => {
    try {
      const response = await api.get(`tes/options/guru-pengganti-kertosono/${guru_id}`);
      // Directly map response.data
      const formattedData: SelectOption[] = Object.entries(response.data ?? {}).map(
        ([label, value]) => ({
          // Ensure value is treated appropriately (might be string or number)
          value: value as (string | number),
          label: label,
        })
      );
      // Sort alphabetically by label if needed
      formattedData.sort((a, b) => a.label.localeCompare(b.label));
      
      return formattedData;
    } catch (err) {
      handleApiError(err);
      return []; // Return empty array on error
    }
  };

  const getAkademikKediriCountOptions = async (): Promise<SelectOption[]> => {
    try {
      const response = await api.get("tes/options/akademik-kediri-count");
      const data = response.data ?? [];

      // If API returns an array like [0,1,2] or [{count: 0, label: '0'}]
      if (Array.isArray(data)) {
        return data.map((item: any) => ({ value: item, label: String(item) }));
      }

      // If API returns an object mapping label -> value
      if (data && typeof data === "object") {
        const formattedData: SelectOption[] = Object.entries(data).map(([label, value]) => ({
          value: value as (string | number),
          label: String(label),
        }));
        formattedData.sort((a, b) => a.label.localeCompare(b.label));
        return formattedData;
      }

      return [];
    } catch (err) {
      handleApiError(err);
      return [];
    }
  };

  const getAkademikKertosonoCountOptions = async (): Promise<SelectOption[]> => {
    try {
      const response = await api.get("tes/options/akademik-kertosono-count");
      const data = response.data ?? [];

      if (Array.isArray(data)) {
        return data.map((item: any) => ({ value: item, label: String(item) }));
      }

      if (data && typeof data === "object") {
        const formattedData: SelectOption[] = Object.entries(data).map(([label, value]) => ({
          value: value as (string | number),
          label: String(label),
        }));
        formattedData.sort((a, b) => a.label.localeCompare(b.label));
        return formattedData;
      }

      return [];
    } catch (err) {
      handleApiError(err);
      return [];
    }
  };

  // --- Return Value ---
  // Returns only the functions to fetch the options
  return {
    getProvinsiOptions,
    getKotaOptions,
    getKecamatanOptions,
    getKelurahanOptions,
    getDaerahSambungOptions,
    getPonpesOptions,
    getAkademikKediriCountOptions,
    getAkademikKertosonoCountOptions,
  };
}