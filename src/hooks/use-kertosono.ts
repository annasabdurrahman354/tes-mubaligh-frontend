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
      const response = await api.get<PaginatedPesertaResponse>("peserta-kertosono", { params });
      // Assuming response.data directly contains the structure defined above
      return response.data;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  }, []);

  const getPesertaKertosonoByRFID = async (
    rfid: string,
  ): Promise<PesertaKertosono | null | any> => {
    try {
      const response = await api.get("peserta-kertosono/rfid", {
        params: { rfid: rfid },
      });

      return response.data.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkademikKertosono = async (
    tes_santri_id: string,
    penilaian: string,
    kekurangan_tajwid: string[],
    kekurangan_khusus: string[],
    kekurangan_keserasian: string[],
    kekurangan_kelancaran: string[],
    catatan: string | null,
    rekomendasi_penarikan: boolean,
    durasi_penilaian: number,
  ): Promise<AkademikKertosonoForm | null | any> => {
    try {
      const response = await api.post<AkademikKertosonoForm>(
        "akademik-kertosono",
        {
          tes_santri_id,
          penilaian,
          kekurangan_tajwid,
          kekurangan_khusus,
          kekurangan_keserasian,
          kekurangan_kelancaran,
          catatan,
          rekomendasi_penarikan,
          durasi_penilaian,
        },
      );

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkhlakKertosono = async (
    tes_santri_id: string,
    catatan: string,
  ): Promise<AkhlakKertosonoForm | null | any> => {
    try {
      const response = await api.post<AkhlakKertosonoForm>("akhlak-kertosono", {
        tes_santri_id,
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
      const response = await api.get<PaginatedPesertaResponse>("peserta-kertosono/verifikasi", { params });
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
  ): Promise<PesertaKertosonoVerifikasi | null> => {
      try {
          const response = await api.get<PesertaKertosonoVerifikasi>(`peserta-kertosono/verifikasi/${id_tes_santri}`);
          // The backend 'show' method directly returns the transformed object
          return response.data;
      } catch (err) {
          handleApiError(err);
          return null;
      }
  };

  /**
   * Updates a Peserta Kertosono's verification data.
   * Corresponds to: PATCH /peserta-kertosono/verifikasi/{id_tes_santri}
   * @param id_tes_santri The ID of the participant to update.
   * @param data The data to update. Should match the fields expected by the backend validator.
   * Using Partial<PesertaKertosonoVerifikasi> allows sending only changed fields,
   * but ensure all *required* fields for the *update* operation are present.
   * Alternatively, use a more specific type for the update payload if needed.
   */
  const updatePesertaKertosonoVerifikasi = async (
      id_tes_santri: string | number,
      data: Partial<PesertaKertosonoVerifikasi> | Record<string, any> // Use a specific type if preferred
  ): Promise<PesertaKertosonoVerifikasi | null> => {
      try {
          const response = await api.patch<PesertaKertosonoVerifikasi>(
              `peserta-kertosono/verifikasi/${id_tes_santri}`,
              data // Send the update data in the request body
          );
           // The backend 'update' method returns the updated transformed object
          return response.data;
      } catch (err) {
          handleApiError(err);
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
