export interface HasilSistem {
  lulus: number;
  tidak_lulus: number;
  perlu_musyawarah: number;
  belum_pengetesan: number;
}

export interface GenderStatistics {
  total_active_peserta: number;
  min_akademik_per_peserta: number;
  max_akademik_per_peserta: number;
  count_peserta_with_min_akademik: number;
  count_peserta_with_max_akademik: number;
  user_akademik_count: number;
  hasil_sistem: HasilSistem;
}

export interface ByGender {
  "Laki-laki": GenderStatistics;
  "Perempuan": GenderStatistics;
}

export interface StatistikTes {
  periode_tes: string;
  overall: GenderStatistics;
  by_gender: ByGender;
}
