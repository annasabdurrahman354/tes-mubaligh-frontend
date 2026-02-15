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
  durasi: number;
};

export type PesertaKediri = {
  id: string;
  periode_id: string;
  nispn: string;
  nama: string; // Updated from nama_lengkap
  nama_panggilan: string;
  jenis_kelamin: string;
  kelompok: string;
  nomor_cocard: number;
  nomor_identitas: string | null; // Added
  smartcard: string | null; // Replaces rfid
  kota: string | null; // Updated from kota_nama
  asal_ponpes: string; // Updated from asal_pondok_nama
  asal_daerah: string; // Updated from asal_daerah_nama
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
  nilai_anda: number | null; // Added
  hasil_tes: string | null; // Nullable in controller ($peserta->hasil_tes?->getLabel())
  telah_disimak: boolean;
  foto_identitas: string; 
  akhlak: AkhlakKediri[];
  akademik: AkademikKediri[];
};