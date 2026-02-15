import { useCallback } from 'react';
import api, { handleApiError } from "@/libs/axios";
import {
  AkademikKertosonoForm,
  AkhlakKertosonoForm,
  PesertaKertosono,
  PesertaKertosonoVerifikasi,
} from "@/types/kertosono";

// Define the expected paginated response structure FROM YOUR ACTUAL API
export interface PaginatedPesertaResponse {
  data: PesertaKertosono[] | PesertaKertosonoVerifikasi[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
    // Or potentially an array of link objects as shown in your example:
    // { url: string | null; label: string; active: boolean }[];
  };
  // Meta fields are directly at the top level in your API response
  current_page: number;
  from: number | null;
  last_page: number;
  // Keep the detailed links array if needed, matches your example
  meta_links?: { url: string | null; label: string; active: boolean }[]; // Renamed to avoid conflict
  path: string;
  per_page: number;
  to: number | null;
  total: number;
  // Add other top-level fields if necessary (e.g., first_page_url, etc.)
  first_page_url?: string | null;
  last_page_url?: string | null;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}


export function useKertosono() {

  const getPesertaKertosono = useCallback(async (
    params: Record<string, string | number>,
  ): Promise<PaginatedPesertaResponse | null > => {
    try {
      // The actual response type from axios might differ slightly, but casting helps usage
      const response = await api.get<PaginatedPesertaResponse>("tes/peserta-kertosono", { params });
      
      // Transform keys to match new standard if needed
      if (response && response.data && Array.isArray(response.data.data)) {
         const transformedData = response.data.data.map((item: any) => ({
             ...item,
             nama: item.nama ?? item.nama_lengkap,
             foto_identitas: item.foto_identitas ?? item.foto_smartcard,
             smartcard: item.smartcard ?? item.rfid,
             kota: item.kota ?? item.kota_nama,
             asal_ponpes: item.asal_ponpes ?? item.asal_pondok_nama,
             asal_daerah: item.asal_daerah ?? item.asal_daerah_nama,
             nomor_identitas: item.nomor_identitas ?? item.nik,
             nispn: item.nispn ?? item.nis,
         }));
         return { ...response.data, data: transformedData };
      }

      return response.data;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  }, []);

  const getPesertaKertosonoByRFID = async (
    smartcard: string,
  ): Promise<PesertaKertosono | null | any> => {
    try {
      const response = await api.get("peserta-kertosono/smartcard", {
        params: { smartcard: smartcard },
      });

      const item = response.data.data;
      if (item) {
          return {
             ...item,
             nama: item.nama ?? item.nama_lengkap,
             foto_identitas: item.foto_identitas ?? item.foto_smartcard,
             smartcard: item.smartcard ?? item.rfid,
             kota: item.kota ?? item.kota_nama,
             asal_ponpes: item.asal_ponpes ?? item.asal_pondok_nama,
             asal_daerah: item.asal_daerah ?? item.asal_daerah_nama,
             nomor_identitas: item.nomor_identitas ?? item.nik,
             nispn: item.nispn ?? item.nis,
          };
      }

      return item;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkademikKertosono = async (
    peserta_id: string,
    nilai: string,
    kekurangan_tajwid: string[],
    kekurangan_khusus: string[],
    kekurangan_keserasian: string[],
    kekurangan_kelancaran: string[],
    guru_pengganti: string | null,
    catatan: string | null,
    rekomendasi_penarikan: boolean,
    durasi: number,
  ): Promise<AkademikKertosonoForm | null | any> => {
    try {
      const response = await api.post<AkademikKertosonoForm>(
        "tes/akademik-kertosono",
        {
          peserta_id,
          nilai,
          kekurangan_tajwid,
          kekurangan_khusus,
          kekurangan_keserasian,
          kekurangan_kelancaran,
          guru_pengganti,
          catatan,
          rekomendasi_penarikan,
          durasi,
        },
      );

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkhlakKertosono = async (
    peserta_id: string,
    catatan: string,
  ): Promise<AkhlakKertosonoForm | null | any> => {
    try {
      const response = await api.post<AkhlakKertosonoForm>("tes/akhlak-kertosono", {
        peserta_id,
        catatan,
      });

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  /**
   * Fetches a paginated list of Peserta Kertosono for verification.
   * Corresponds to: GET /peserta-kertosono/verifikasi
   */
  const getPesertaKertosonoVerifikasi = useCallback(async (
    params: Record<string, string | number>,
  ): Promise<PaginatedPesertaResponse | null > => {
    try {
      // Note: The data array within the response should contain PesertaKertosonoVerifikasi objects
      const response = await api.get<PaginatedPesertaResponse>("tes/peserta-kertosono/verifikasi", { params });
      return response.data;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  }, []);

  /**
   * Fetches a single Peserta Kertosono for verification by their ID.
   * Corresponds to: GET /peserta-kertosono/verifikasi/{id_tes_santri}
   */
  const getSinglePesertaKertosonoVerifikasi = async (
      id_tes_santri: string | number // Can be string or number depending on usage
  ): Promise<PesertaKertosonoVerifikasi | null | any> => {
      try {
          const response = await api.get<PesertaKertosonoVerifikasi>(`tes/peserta-kertosono/verifikasi/${id_tes_santri}`);
          const item = response.data;
          
          if (item) {
             return {
                 ...item,
                 nama: (item as any).nama ?? (item as any).nama_lengkap,
                 foto_identitas: (item as any).foto_identitas ?? (item as any).foto_smartcard,
                 smartcard: (item as any).smartcard ?? (item as any).rfid,
                 nomor_identitas: (item as any).nomor_identitas ?? (item as any).nik, // data migration or fallback
                 nama_panggilan: item.nama_panggilan, 
                 // Map other verification specific fields if needed
             };
          }

          return item;
      } catch (err) {
          handleApiError(err);
          return null;
      }
  };

  const updatePesertaKertosonoVerifikasi = async (
    id_tes_santri: string,
    formData: FormData // <--- Change parameter to accept FormData
  ): Promise<PesertaKertosonoVerifikasi | null> => {
    try {
      // Assuming your API endpoint is /api/peserta-kertosono-verifikasi/{id}
      const response = await api.post(`peserta-kertosono/verifikasi/${id_tes_santri}`, formData, {
         headers: {
           // Axios usually sets multipart/form-data automatically when FormData is detected
           // If using fetch, omit the Content-Type header manually
           'Content-Type': 'multipart/form-data',
           // Add '_method': 'PUT' if your backend expects it for updates via POST
           // Or use axios.put if your backend route uses PUT method
         },
         // If your backend expects PUT but you send POST due to FormData limitations
         // Often, you send a hidden field '_method' with value 'PUT'
         // formData.append('_method', 'PUT'); // Add this before sending if needed
      });
  
      if (response.status === 200 && response.data) {
        return response.data as PesertaKertosonoVerifikasi;
      }
      return null;
    } catch (error: any) {
      handleApiError(error);
      // You might want more specific error handling here,
      // e.g., returning validation errors from the response if available
      return null;
    }
  };
  
  return {
    getPesertaKertosono,
    getPesertaKertosonoByRFID,
    storeAkademikKertosono,
    storeAkhlakKertosono,
    getPesertaKertosonoVerifikasi,
    getSinglePesertaKertosonoVerifikasi,
    updatePesertaKertosonoVerifikasi,
  };
}
