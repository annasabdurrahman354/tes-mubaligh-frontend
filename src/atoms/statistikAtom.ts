import { atomWithStorage } from "jotai/utils";

import { StatistikTes } from "@/types/statistik";

export const statistikKediriAtom = atomWithStorage<StatistikTes>(
  "statistik-kediri",
  {
    periode_tes: null,
    overall: {
      total_active_peserta: null,
      min_akademik_per_peserta: null,
      max_akademik_per_peserta: null,
      count_peserta_with_min_akademik: null,
      count_peserta_with_max_akademik: null,
      user_akademik_count: null,
      hasil_sistem: {
        lulus: null,
        tidak_lulus: null,
        perlu_musyawarah: null,
        belum_pengetesan: null,
      },
    },
    by_gender: {
      "Laki-laki": {
        total_active_peserta: null,
        min_akademik_per_peserta: null,
        max_akademik_per_peserta: null,
        count_peserta_with_min_akademik: null,
        count_peserta_with_max_akademik: null,
        user_akademik_count: null,
        hasil_sistem: {
          lulus: null,
          tidak_lulus: null,
          perlu_musyawarah: null,
          belum_pengetesan: null,
        },
      },
      Perempuan: {
        total_active_peserta: null,
        min_akademik_per_peserta: null,
        max_akademik_per_peserta: null,
        count_peserta_with_min_akademik: null,
        count_peserta_with_max_akademik: null,
        user_akademik_count: null,
        hasil_sistem: {
          lulus: null,
          tidak_lulus: null,
          perlu_musyawarah: null,
          belum_pengetesan: null,
        },
      },
    },
  },
);

export const statistikKertosonoAtom = atomWithStorage<StatistikTes>(
  "statistik-kertosono",
  {
    periode_tes: null,
    overall: {
      total_active_peserta: null,
      min_akademik_per_peserta: null,
      max_akademik_per_peserta: null,
      count_peserta_with_min_akademik: null,
      count_peserta_with_max_akademik: null,
      user_akademik_count: null,
      hasil_sistem: {
        lulus: null,
        tidak_lulus: null,
        perlu_musyawarah: null,
        belum_pengetesan: null,
      },
    },
    by_gender: {
      "Laki-laki": {
        total_active_peserta: null,
        min_akademik_per_peserta: null,
        max_akademik_per_peserta: null,
        count_peserta_with_min_akademik: null,
        count_peserta_with_max_akademik: null,
        user_akademik_count: null,
        hasil_sistem: {
          lulus: null,
          tidak_lulus: null,
          perlu_musyawarah: null,
          belum_pengetesan: null,
        },
      },
      Perempuan: {
        total_active_peserta: null,
        min_akademik_per_peserta: null,
        max_akademik_per_peserta: null,
        count_peserta_with_min_akademik: null,
        count_peserta_with_max_akademik: null,
        user_akademik_count: null,
        hasil_sistem: {
          lulus: null,
          tidak_lulus: null,
          perlu_musyawarah: null,
          belum_pengetesan: null,
        },
      },
    },
  },
);
