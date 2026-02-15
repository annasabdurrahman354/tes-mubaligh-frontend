import { usePeserta } from "./use-peserta";
import { useCallback } from 'react';
import api, { handleApiError } from "@/libs/axios";
import {
  AkademikKediriForm,
  AkhlakKediriForm,
  PesertaKediri,
} from "@/types/kediri";

// Define the expected paginated response structure FROM YOUR ACTUAL API
export interface PaginatedPesertaResponse {
  data: PesertaKediri[];
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


export function useKediri() {

  const getPesertaKediri = useCallback(async (
    params: Record<string, string | number>,
  ): Promise<PaginatedPesertaResponse | null> => {
    try {
      // The actual response type from axios might differ slightly, but casting helps usage
      const response = await api.get<PaginatedPesertaResponse>("tes/peserta-kediri", { params });
      // Assuming response.data directly contains the structure defined above
      return response.data;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  }, []);

  const getPesertaKediriByRFID = async (
    smartcard: string,
  ): Promise<PesertaKediri | null | any> => {
    try {
      const response = await api.get("peserta-kediri/smartcard", {
        params: { smartcard: smartcard },
      });

      return response.data.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkademikKediri = async (
    peserta_id: string,
    nilai_makna: string,
    nilai_keterangan: string,
    nilai_penjelasan: string,
    nilai_pemahaman: string,
    kekurangan_makna: string[] | null,
    kekurangan_keterangan: string[] | null,
    kekurangan_penjelasan: string[] | null,
    kekurangan_pemahaman: string[] | null,
    catatan_makna: string | null,
    catatan_keterangan: string | null,
    catatan_penjelasan: string | null,
    catatan_pemahaman: string | null,
    guru_pengganti: string | null,
    catatan: string,
    durasi: number,
  ): Promise<AkademikKediriForm | any> => {
    try {
      const response = await api.post<AkademikKediriForm>("tes/akademik-kediri", {
        peserta_id,
        nilai_makna,
        nilai_keterangan,
        nilai_penjelasan,
        nilai_pemahaman,
        kekurangan_makna,
        kekurangan_keterangan,
        kekurangan_penjelasan,
        kekurangan_pemahaman,
        catatan_makna,
        catatan_keterangan,
        catatan_penjelasan,
        catatan_pemahaman,
        guru_pengganti,
        catatan,
        durasi,
      });

      console.log(response.data);

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkhlakKediri = async (
    peserta_id: string,
    catatan: string,
  ): Promise<AkhlakKediriForm | any> => {
    try {
      const response = await api.post<AkhlakKediriForm>("tes/akhlak-kediri", {
        peserta_id,
        catatan,
      });

      console.log(response.data);

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  return {
    getPesertaKediri,
    getPesertaKediriByRFID,
    storeAkademikKediri,
    storeAkhlakKediri,
  };
}
