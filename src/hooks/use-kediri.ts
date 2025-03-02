import { usePeserta } from "./use-peserta";

import api, { handleApiError } from "@/libs/axios";
import {
  AkademikKediriForm,
  AkhlakKediriForm,
  PesertaKediri,
} from "@/types/kediri";

export function useKediri() {
  const { setPeserta } = usePeserta();

  const getPesertaKediri = async (
    params: Record<string, string>,
  ): Promise<PesertaKediri[] | null | any> => {
    try {
      const response = await api.get("peserta-kediri", { params });

      setPeserta(response.data);

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

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
