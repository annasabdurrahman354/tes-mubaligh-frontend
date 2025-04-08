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
  ): Promise<PaginatedPesertaResponse | null > => {
    try {
      // The actual response type from axios might differ slightly, but casting helps usage
      const response = await api.get<PaginatedPesertaResponse>("peserta-kediri", { params });
      // Assuming response.data directly contains the structure defined above
      return response.data;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  }, []);

  const getPesertaKediriByRFID = async (
    rfid: string,
  ): Promise<PesertaKediri | null | any> => {
    try {
      const response = await api.get("peserta-kediri/rfid", {
        params: { rfid: rfid },
      });

      return response.data.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkademikKediri = async (
    tes_santri_id: string,
    nilai_makna: string,
    nilai_keterangan: string,
    nilai_penjelasan: string,
    nilai_pemahaman: string,
    catatan: string,
  ): Promise<AkademikKediriForm | any> => {
    try {
      const response = await api.post<AkademikKediriForm>("akademik-kediri", {
        tes_santri_id,
        nilai_makna,
        nilai_keterangan,
        nilai_penjelasan,
        nilai_pemahaman,
        catatan,
      });

      console.log(response.data);

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const storeAkhlakKediri = async (
    tes_santri_id: string,
    poin: number,
    catatan: string,
  ): Promise<AkhlakKediriForm | any> => {
    try {
      const response = await api.post<AkhlakKediriForm>("akhlak-kediri", {
        tes_santri_id,
        poin,
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
