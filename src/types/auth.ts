export type User = {
  id: string;
  person_id: string;
  nama: string;
  nama_panggilan?: string | null;
  username: string;
  email: string;
  nomor_telepon?: string | null;
  nomor_identitas?: string | null;
  smartcard?: string | null;
  ponpes_aktif: {
    id: string | number;
    nama: string;
  }[];
  roles: string[];
  foto_identitas: string;
};

export type Session = {
  token: string | null;
  user: User | null;
  login_at: Date | null;
};
