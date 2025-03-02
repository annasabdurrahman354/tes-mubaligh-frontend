export type StatistikTes = {
  periode_tes: string | null;
  overall: StatistikPeserta | null;
  by_gender: Record<string, StatistikPeserta>;
};
  
export type StatistikPeserta = {
  total_active_peserta: number | null;
  min_akademik_per_peserta: number | null;
  max_akademik_per_peserta: number | null;
  count_peserta_with_min_akademik: number | null;
  count_peserta_with_max_akademik: number | null;
  user_akademik_count: number | null;
  hasil_sistem: {
    lulus: number | null;
    tidak_lulus: number | null;
    perlu_musyawarah: number | null;
    belum_pengetesan: number | null;
  };
};
  