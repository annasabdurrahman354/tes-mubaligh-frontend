export type AkhlakKertosono = {
  id: string;
  guru_id: string;
  guru_nama: string;
  guru_foto: string;
  catatan: string;
  created_at: string | null;
};

export type AkademikKertosono = {
  id: string;
  guru_id: string;
  guru_nama: string;
  guru_foto: string;
  penilaian: string;
  kekurangan_tajwid: string[];
  kekurangan_khusus: string[];
  kekurangan_keserasian: string[];
  kekurangan_kelancaran: string[];
  guru_pengganti: string | null;
  catatan: string;
  rekomendasi_penarikan: boolean;
  durasi: number;
  created_at: string | null;
};

export type AkhlakKertosonoForm = {
  peserta_id: string;
  catatan: string;
};

export type AkademikKertosonoForm = {
  peserta_id: string;
  penilaian: string;
  kekurangan_tajwid: string[];
  kekurangan_khusus: string[];
  kekurangan_keserasian: string[];
  kekurangan_kelancaran: string[];
  guru_pengganti: string | null;
  catatan: string;
  rekomendasi_penarikan: boolean;
  created_at: Date;
  durasi: number;
};

export type PesertaKertosono = {
  id: string;
  periode_id: string;
  kelompok: string;
  nomor_cocard: number;
  nispn: string; // Replaces nis
  nomor_identitas: string; // Renamed from nik
  smartcard: string; // Renamed from rfid
  kota: string; // Renamed from kota_nama
  asal_ponpes: string; // Renamed from asal_pondok_nama
  asal_daerah: string; // Renamed from asal_daerah_nama
  pendidikan: string;
  status_mondok: string;
  keahlian: string;
  hobi: string;
  umur: number;
  nama_ayah: string;
  riwayat_tes: number;
  jumlah_penyimakan: number;
  rekomendasi: string | null; // Added from controller transform
  hasil_tes: string | null; // Renamed from hasil_sistem, nullable in controller
  telah_disimak: boolean;
  nilai_anda: number | null; // Renamed from penilaian_anda? Controller sends 'nilai_anda', seemingly number or null? logic says $userAssessment?->nilai.
  rekomendasi_anda: boolean | null;
  foto_identitas: string;
  akhlak: AkhlakKertosono[];
  akademik: AkademikKertosono[];
};

export type PesertaKertosonoVerifikasi = {
  id: string;
  periode_id: string;
  asal_ponpes_id: number | null; // Renamed from id_ponpes
  nispn: string;
  nama: string | null; 
  nama_panggilan: string | null;
  jenis_kelamin: "laki-laki" | "perempuan" | null;
  nomor_cocard: number | null;
  nisn: string | null;
  nomor_identitas: string | null; // Renamed from nik
  smartcard: string | null; 
  
  nama_ayah: string | null;
  nama_ibu: string | null;
  
  tempat_lahir: string | null;
  tanggal_lahir: string | null; // Y-m-d from backend
  
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  provinsi_id: number | null;
  kota_id: number | null; // Renamed from kota_kab_id
  kecamatan_id: number | null; 
  kelurahan_id: number | null; // Renamed from desa_kel_id
  kode_pos: string | null; 
  nomor_telepon: string | null; // Replaces hp

  provinsi_nama: string | null;
  kota_nama: string | null; 
  kecamatan_nama: string | null;
  kelurahan_nama: string | null;

  daerah_sambung_id: number | null; // Renamed from id_daerah_sambung
  kelompok_sambung: string | null; 
  daerah_sambung_nama: string | null;

  asal_ponpes_nama: string | null; 

  status_mondok: string | null; 
  daerah_kiriman_id: number | null; // Renamed from id_daerah_kiriman
  daerah_kiriman_nama: string | null;

  jenjang_pendidikan: string | null; // Renamed from pendidikan
  jurusan_pendidikan: string | null; // Renamed from jurusan
  
  keahlian: string | null;
  hobi: string | null;
  umur: number | null; 
  riwayat_tes: number | null; 
  
  foto_identitas: string | null; // Renamed from foto_smartcard
  new_person_photo?: File | null;
};

export function getFirstValidWord(text: string) {
  const words = text.trim().split(/\s+/); // Split by spaces while handling multiple spaces

  if (words.length === 0) return ""; // Return empty if no words exist

  if (words[0].length > 2 || words.length === 1) {
    return words[0]; // Return first word if it's longer than 2 chars or if it's the only word
  }

  return words.length > 1 ? words[1] : words[0]; // Otherwise, return second word if available
}