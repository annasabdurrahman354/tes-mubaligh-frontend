export type User = {
  id: string;
  nama: string;
  nama_panggilan?: string | null;
  username: string;
  email: string;
  nomor_telepon?: string | null;
  nik?: string | null;
  rfid?: string | null;
  pondok_id: number;
  pondok: string;
  roles: string[];
  foto: string;
};

export type Session = {
  token: string | null;
  user: User | null;
  login_at: Date | null;
};
