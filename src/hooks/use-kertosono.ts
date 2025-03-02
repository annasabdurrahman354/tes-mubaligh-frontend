import { usePeserta } from "./use-peserta";

import api, { handleApiError } from "@/libs/axios";
import {
  AkademikKertosonoForm,
  AkhlakKertosonoForm,
  PesertaKertosono,
} from "@/types/kertosono";
import { PesertaKediri } from "@/types/kediri";

export function useKertosono() {
  const { setPeserta } = usePeserta();

  const getPesertaKertosono = async (
    params: Record<string, string>,
  ): Promise<PesertaKediri[] | null | any> => {
    try {
      const response = await api.get("peserta-kertosono", { params });

      setPeserta(response.data);

      return response.data;
    } catch (err) {
      handleApiError(err);
    }
  };

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

  return {
    getPesertaKertosono,
    getPesertaKertosonoByRFID,
    storeAkademikKertosono,
    storeAkhlakKertosono,
  };
}
