import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import { IdCard, LogOut, Mail, Moon, School2, Sun } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function AkunPage() {
  const { theme, setDarkTheme, setLightTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4">
        <Card className="w-full">
          <CardBody className="flex-row items-center gap-3 p-4">
            <Avatar
              alt={user?.nama}
              className="w-16 h-16 text-medium"
              src={user?.foto}
            />
            <div className="flex flex-col items-start gap-1">
              <div className="flex flex-col items-start">
                <h1 className="text-lg">{user?.nama}</h1>
                {user?.nama_panggilan && (
                  <p className="text-default-500">({user.nama_panggilan})</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user?.roles.map((role) => (
                  <Chip key={role} color="primary" variant="flat">
                    {role}
                  </Chip>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="w-full">
          <CardHeader className="text-lg">Informasi Akun</CardHeader>
          <Divider />
          <CardBody className="gap-4 p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary-50">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-small text-default-500">Username</p>
                <p>{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary-50">
                <IdCard className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-small text-default-500">RFID</p>
                <p>{user?.rfid ?? "Belum terkoneksi RFID"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary-50">
                <School2 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-small text-default-500">Pondok Pesantren</p>
                <p>{user?.pondok ?? "Tidak ada data"}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="flex flex-row gap-2 items-center justify-center align-middle flex-wrap md:flex-nowrap">
          <Button
            color={theme === "light" ? "primary" : "default"}
            startContent={
              theme === "light" ? <Sun size={16} /> : <Moon size={16} />
            }
            variant={theme === "light" ? "solid" : "bordered"}
            onPress={() =>
              theme === "light" ? setDarkTheme() : setLightTheme()
            }
          >
            {theme === "light" ? "Terang" : "Gelap"}
          </Button>

          <Button
            color="danger"
            startContent={<LogOut size={16} />}
            variant="flat"
            onPress={logout}
          >
            Keluar
          </Button>
        </div>
      </section>
    </div>
  );
}
