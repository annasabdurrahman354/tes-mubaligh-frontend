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
        value: item.id_provinsi, // Adjust key based on actual API response
        label: item.nama,       // Adjust key based on actual API response
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
        value: item.id_kota_kab, // Adjust key based on actual API response
        label: item.nama,        // Adjust key based on actual API response
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
        value: item.id_kecamatan, // Adjust key based on actual API response
        label: item.nama,         // Adjust key based on actual API response
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
        value: item.id_desa_kel, // Adjust key based on actual API response
        label: item.nama,        // Adjust key based on actual API response
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
        value: item.id_daerah, // Adjust key based on actual API response
        label: item.n_daerah,  // Adjust key based on actual API response
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
      // --- IMPORTANT ---
      // Directly transform the response object using Object.entries
      // Default to empty object {} if response.data is null/undefined
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

  // --- Return Value ---
  // Returns only the functions to fetch the options
  return {
    getProvinsiOptions,
    getKotaOptions,
    getKecamatanOptions,
    getKelurahanOptions,
    getDaerahSambungOptions,
    getPonpesOptions,
  };
}