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
  catatan: string;
  rekomendasi_penarikan: boolean;
  durasi_penilaian: number;
  created_at: string | null;
};

export type AkhlakKertosonoForm = {
  tes_santri_id: string;
  catatan: string;
};

export type AkademikKertosonoForm = {
  tes_santri_id: string;
  penilaian: string;
  kekurangan_tajwid: string[];
  kekurangan_khusus: string[];
  kekurangan_keserasian: string[];
  kekurangan_kelancaran: string[];
  catatan: string;
  rekomendasi_penarikan: boolean;
  created_at: Date;
  durasi_penilaian: number;
};

export type PesertaKertosono = {
  id: string;
  periode_id: string;
  nispn: string;
  nama_lengkap: string;
  nama_panggilan: string | null;
  jenis_kelamin: string;
  kelompok: string;
  nomor_cocard: number;
  nis: string;
  nik: string;
  rfid: string;
  kota_nama: string;
  asal_pondok_nama: string;
  asal_daerah_nama: string;
  pendidikan: string;
  status_mondok: string;
  keahlian: string;
  hobi: string;
  umur: number;
  nama_ayah: string;
  riwayat_tes: number;
  jumlah_penyimakan: number;
  count_akademik_lulus: number;
  count_akademik_tidak_lulus: number;
  semua_kekurangan: string[];
  perekomendasi: string[];
  hasil_sistem: string;
  telah_disimak: boolean;
  penilaian_anda: string;
  rekomendasi_anda: boolean;
  foto_smartcard: string;
  akhlak: AkhlakKertosono[];
  akademik: AkademikKertosono[];
};

export type PesertaKertosonoVerifikasi = {
  id_tes_santri: string; // Corresponds to id_tes_santri
  id_periode: string; // Type depends on DB schema, PHP allows mixed
  id_ponpes: number | null; // Type depends on DB schema, validation suggests number
  nispn: string;
  nama_lengkap: string | null;
  nama_panggilan: string | null;
  jenis_kelamin: string | null; // Assuming 'L'/'P' based on validation, but could be other string
  kelompok: string | null;
  nomor_cocard: number | null;
  nik: string | null;
  rfid: string | null;
  nama_ibu: string | null; // Potentially nullable if siswa relation isn't loaded
  tempat_lahir: string | null; // Potentially nullable if siswa relation isn't loaded
  tanggal_lahir: string | null; // Format 'YYYY-MM-DD' or null
  alamat: string | null; // Potentially nullable if siswa relation isn't loaded
  rt: string | null; // Potentially nullable if siswa relation isn't loaded
  rw: string | null; // Potentially nullable if siswa relation isn't loaded
  provinsi_id: number | null; // Validation suggests number, potentially nullable
  provinsi: string | null; // Validation suggests number, potentially nullable
  kota_kab_id: number | null; // Validation suggests number, potentially nullable
  kota_kab: string | null; // Validation suggests number, potentially nullable
  kecamatan_id: number | null; // Validation suggests number, potentially nullable
  kecamatan: string | null; // Validation suggests number, potentially nullable
  desa_kel_id: number | null; // Validation suggests number, potentially nullable
  desa_kel: string | null; // Validation suggests number, potentially nullable
  kode_pos: string | null; // Potentially nullable if siswa relation isn't loaded
  kota_nama: string | null; // From related kota via siswa
  hp: string | null; // Potentially nullable if siswa relation isn't loaded
  id_daerah_sambung: number | null; // Validation suggests number, potentially nullable
  kelompok_sambung: string | null; // Potentially nullable if siswa relation isn't loaded
  asal_pondok_nama: string | null; // From Accessor asalPondokWithDaerah
  asal_daerah_nama: string; // From Accessor asalDaerah, formatted, defaults to empty string
  pendidikan: string | null;
  jurusan: string | null;
  status_mondok: string | null; // Based on validation
  umur: number | null; // Calculated age
  nama_ayah: string | null; // Formatted name
  riwayat_tes: string | number | null; // Type depends on the Accessor/Attribute 'riwayat_tes', could be number, string, array, object? Using 'unknown' for safety. The example type suggests 'number'.
  foto_smartcard: string | null; // URL from Accessor urlFotoIdentitas on Siswa
};

export function getFirstValidWord(text: string) {
  const words = text.trim().split(/\s+/); // Split by spaces while handling multiple spaces

  if (words.length === 0) return ""; // Return empty if no words exist

  if (words[0].length > 2 || words.length === 1) {
    return words[0]; // Return first word if it's longer than 2 chars or if it's the only word
  }

  return words.length > 1 ? words[1] : words[0]; // Otherwise, return second word if available
}

export const mockPesertaKertosono = [
  {
    id: "1",
    periode_id: "2025-01",
    nispn: "12345678",
    nama_lengkap: "Ahmad Fauzan",
    nama_panggilan: "Fauzan",
    jenis_kelamin: "L",
    kelompok: "A1",
    nomor_cocard: 101,
    nis: "987654321",
    nik: "321654987",
    rfid: "RFID12345",
    kota_nama: "Surabaya",
    asal_pondok_nama: "Pondok Al-Hikmah",
    asal_daerah_nama: "Jawa Timur",
    pendidikan: "SMA",
    status_mondok: "Santri Mukim",
    keahlian: "Tahfidz",
    hobi: "Membaca",
    umur: 17,
    nama_ayah: "Bapak Hasan",
    riwayat_tes: 3,
    jumlah_penyimakan: 5,
    count_akademik_lulus: 2,
    count_akademik_tidak_lulus: 1,
    semua_kekurangan: [],
    jumlah_merekomendasikan: 85,
    hasil_sistem: "Lulus",
    telah_disimak: true,
    penilaian_anda: "Lulus",
    rekomendasi_anda: true,
    foto_smartcard: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    akhlak: [
      {
        id: "A1",
        guru_id: "G1",
        guru_nama: "Ust. Ridwan",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        catatan: "Santri sopan dan disiplin dalam mengaji.",
        created_at: "2025-02-10T08:00:00Z",
      },
    ],
    akademik: [
      {
        id: "K1",
        guru_id: "G2",
        guru_nama: "Ust. Fadli",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        penilaian: "Baik",
        kekurangan_tajwid: ["Idgham belum sempurna"],
        kekurangan_khusus: ["Kurang fokus saat tes"],
        kekurangan_keserasian: [],
        kekurangan_kelancaran: ["Terlalu cepat dalam membaca"],
        catatan: "Perlu lebih berhati-hati dalam tajwid.",
        rekomendasi_penarikan: false,
        durasi_penilaian: 15,
        created_at: "2025-02-10T08:30:00Z",
      },
    ],
  },
  {
    id: "2",
    periode_id: "2025-01",
    nispn: "87654321",
    nama_lengkap: "Siti Aisyah",
    nama_panggilan: "Aisyah",
    jenis_kelamin: "P",
    kelompok: "B2",
    nomor_cocard: 102,
    nis: "123456789",
    nik: "987321654",
    rfid: "RFID67890",
    kota_nama: "Jakarta",
    asal_pondok_nama: "Pondok Darussalam",
    asal_daerah_nama: "DKI Jakarta",
    pendidikan: "SMP",
    status_mondok: "Santri Non-Mukim",
    keahlian: "Qira'at",
    hobi: "Menulis",
    umur: 15,
    nama_ayah: "Bapak Rahman",
    riwayat_tes: 2,
    jumlah_penyimakan: 4,
    count_akademik_lulus: 1,
    count_akademik_tidak_lulus: 1,
    semua_kekurangan: [],
    jumlah_merekomendasikan: 85,
    hasil_sistem: "Tidak Lulus",
    telah_disimak: true,
    penilaian_anda: "Tidak Lulus",
    rekomendasi_anda: true,
    foto_smartcard: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    akhlak: [
      {
        id: "A2",
        guru_id: "G3",
        guru_nama: "Ust. Rahmat",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        catatan: "Perlu lebih disiplin dalam waktu shalat.",
        created_at: "2025-02-11T09:00:00Z",
      },
    ],
    akademik: [
      {
        id: "K2",
        guru_id: "G4",
        guru_nama: "Ust. Aminah",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        penilaian: "Cukup",
        kekurangan_tajwid: ["Makharijul huruf kurang tepat"],
        kekurangan_khusus: [],
        kekurangan_keserasian: ["Kurang intonasi"],
        kekurangan_kelancaran: ["Sering terhenti di tengah ayat"],
        catatan: "Harus lebih banyak latihan pernapasan.",
        rekomendasi_penarikan: false,
        durasi_penilaian: 20,
        created_at: "2025-02-11T09:30:00Z",
      },
    ],
  },
];
