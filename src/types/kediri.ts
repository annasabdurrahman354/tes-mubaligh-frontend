export type AkhlakKediri = {
  id: string;
  guru_id: string;
  guru_nama: string;
  guru_foto: string;
  catatan: string;
  created_at: string;
};

export type AkademikKediri = {
  id: string;
  guru_id: string;
  guru_nama: string;
  guru_foto: string;
  nilai_makna: number;
  nilai_keterangan: number;
  nilai_penjelasan: number;
  nilai_pemahaman: number;
  kekurangan_makna: string[] | null;
  kekurangan_keterangan: string[] | null;
  kekurangan_penjelasan: string[] | null;
  kekurangan_pemahaman: string[] | null;
  catatan_makna: string | null;
  catatan_keterangan: string | null;
  catatan_penjelasan: string | null;
  catatan_pemahaman: string | null;
  guru_pengganti: string | null;
  catatan: string;
  rekomendasi: boolean;
  durasi: number;
  created_at: string;
};

export type AkhlakKediriForm = {
  peserta_id: string;
  catatan: string;
};

export type AkademikKediriForm = {
  peserta_id: string;
  nilai_makna: number;
  nilai_keterangan: number;
  nilai_penjelasan: number;
  nilai_pemahaman: number;
  kekurangan_makna: string[] | null;
  kekurangan_keterangan: string[] | null;
  kekurangan_penjelasan: string[] | null;
  kekurangan_pemahaman: string[] | null;
  catatan_makna: string | null;
  catatan_keterangan: string | null;
  catatan_penjelasan: string | null;
  catatan_pemahaman: string | null;
  guru_pengganti: string | null;
  catatan: string;
  rekomendasi: boolean;
  durasi: number;
};

export type PesertaKediri = {
  id: string;
  periode_id: string;
  nispn: string;
  nama: string;
  nama_panggilan: string;
  jenis_kelamin: string;
  kelompok: string;
  nomor_cocard: number;
  nomor_identitas: string | null;
  smartcard: string | null;
  kota: string | null;
  asal_ponpes: string;
  asal_daerah: string;
  pendidikan: string;
  status_mondok: string;
  keahlian: string;
  hobi: string;
  umur: number;
  nama_ayah: string;
  riwayat_tes: number;
  jumlah_penyimakan: number;
  
  avg_nilai_makna: number | null;
  avg_nilai_keterangan: number | null;
  avg_nilai_penjelasan: number | null;
  avg_nilai_pemahaman: number | null;
  nilai_akhir: number | null; 
  nilai_anda: number | null;
  rekomendasi: string | null;
  rekomendasi_anda: boolean | null;
  hasil_tes: string | null;
  telah_disimak: boolean;
  foto_identitas: string; 
  akhlak: AkhlakKediri[];
  akademik: AkademikKediri[];
};