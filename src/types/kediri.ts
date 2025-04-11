export type AkhlakKediri = {
  id: string;
  guru_id: string;
  guru_nama: string;
  guru_foto: string;
  catatan: string;
  poin: number | null;
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
  catatan: string;
  created_at: string;
};

export type AkhlakKediriForm = {
  tes_santri_id: string;
  poin: number;
  catatan: string;
};

export type AkademikKediriForm = {
  tes_santri_id: string;
  nilai_makna: number;
  nilai_keterangan: number;
  nilai_penjelasan: number;
  nilai_pemahaman: number;
  catatan: string;
  durasi_penilaian: number;
};

export type PesertaKediri = {
  id: string;
  periode_id: string;
  nispn: string;
  nama_lengkap: string;
  nama_panggilan: string;
  jenis_kelamin: string;
  kelompok: string;
  nomor_cocard: number;
  nis: string | null;
  nik: string;
  rfid: string | null;
  kota_nama: string | null;
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
  total_poin_akhlak: number | null;
  avg_nilai_makna: number | null;
  avg_nilai_keterangan: number | null;
  avg_nilai_penjelasan: number | null;
  avg_nilai_pemahaman: number | null;
  avg_nilai: number | null;
  hasil_sistem: string;
  telah_disimak: boolean;
  foto_smartcard: string;
  akhlak: AkhlakKediri[];
  akademik: AkademikKediri[];
};

export const mockPesertaKediri = [
  {
    id: "1",
    periode_id: "2025-01",
    siswa_id: "S123456",
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
    total_poin_akhlak: 85,
    avg_nilai_makna: 88,
    avg_nilai_keterangan: 85,
    avg_nilai_penjelasan: 84,
    avg_nilai_pemahaman: 86,
    avg_nilai: 85.75,
    hasil_sistem: "Tidak Lulus",
    telah_disimak: true,
    penilaian_anda: 88,
    foto_smartcard: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    akhlak: [
      {
        id: "A1",
        guru_id: "G1",
        guru_nama: "Ust. Ridwan",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        catatan: "Santri sopan dan disiplin dalam mengaji.",
        poin: 85,
        created_at: "2025-02-10T08:00:00Z",
      },
    ],
    akademik: [
      {
        id: "K1",
        guru_id: "G2",
        guru_nama: "Ust. Fadli",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        nilai_makna: 88,
        nilai_keterangan: 85,
        nilai_penjelasan: 84,
        nilai_pemahaman: 86,
        catatan: "Perlu lebih berhati-hati dalam tajwid.",
        created_at: "2025-02-10T08:30:00Z",
      },
    ],
  },
  {
    id: "2",
    periode_id: "2025-01",
    siswa_id: "S876543",
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
    total_poin_akhlak: 78,
    avg_nilai_makna: 80,
    avg_nilai_keterangan: 78,
    avg_nilai_penjelasan: 76,
    avg_nilai_pemahaman: 79,
    avg_nilai: 78.25,
    hasil_sistem: "Tidak Lulus",
    telah_disimak: false,
    penilaian_anda: 79,
    foto_smartcard: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    akhlak: [
      {
        id: "A2",
        guru_id: "G3",
        guru_nama: "Ust. Rahmat",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        catatan: "Perlu lebih disiplin dalam waktu shalat.",
        poin: 78,
        created_at: "2025-02-11T09:00:00Z",
      },
    ],
    akademik: [
      {
        id: "K2",
        guru_id: "G4",
        guru_nama: "Ust. Aminah",
        guru_foto: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        nilai_makna: 80,
        nilai_keterangan: 78,
        nilai_penjelasan: 76,
        nilai_pemahaman: 79,
        catatan: "Harus lebih banyak latihan pernapasan.",
        created_at: "2025-02-11T09:30:00Z",
      },
    ],
  },
];
