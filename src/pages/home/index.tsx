import { Card, CardBody, Divider, Tabs, Tab, cn, Button } from "@heroui/react";
import {
  Users,
  BookCheckIcon,
  ArrowBigUpDash,
  ArrowBigDownDash,
  CalendarClock,
  BookOpenText,
  HeartHandshake,
  LogOut,
  Moon,
  Sun,
  UserRoundCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import PercentageStat from "@/components/percentage-stat";
import MenutButton from "@/components/menu-button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { ROLE } from "@/types/enum";
import { useStatistik } from "@/hooks/use-statistik";

export default function IndexPage() {
  const [tab, setTab] = useState("kediri");
  const { theme, setDarkTheme, setLightTheme } = useTheme();
  const { logout, hasRole } = useAuth();
  const {
    getStatistikKediri,
    getStatistikKertosono,
    statistikKediri,
    statistikKertosono,
  } = useStatistik();
  const navigate = useNavigate();

  const fetchStatistik = async () => {
    try {
      if (
        hasRole(ROLE.GURU_KERTOSONO) ||
        hasRole(ROLE.ADMIN_KERTOSONO) ||
        hasRole(ROLE.SUPERADMIN)
      ) {
        await getStatistikKertosono();
      }
      if (
        hasRole(ROLE.GURU_KEDIRI) ||
        hasRole(ROLE.ADMIN_KEDIRI) ||
        hasRole(ROLE.SUPERADMIN)
      ) {
        await getStatistikKediri();
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchStatistik();
    if (!hasRole(ROLE.GURU_KEDIRI) && !hasRole(ROLE.SUPERADMIN) && !hasRole(ROLE.ADMIN_KEDIRI)) {
      setTab("kertosono");
    }
  }, []); // Empty dependency array

  return (
    <div>
      <section className="flex flex-col items-center justify-center">
        <Card
          className={cn("border-small w-full", "border-transparent")}
          isPressable={false}
          shadow="sm"
        >
          <CardBody className="flex h-full flex-row items-start gap-3 p-4 w-full">
            <div
              className={cn(
                "item-center flex rounded-medium border p-2 bg-primary-50 border-primary-100",
              )}
            >
              <CalendarClock className={cn("text-primary h-6 w-6")} />
            </div>
            <div className="flex flex-col flex-grow w-full flex-nowrap">
              <p className="text-medium">Periode Tes</p>
              <p className="text-small text-default-500">
                {statistikKediri.periode_tes ??
                  statistikKertosono.periode_tes ??
                  "Loading..."}
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center align-middle flex-wrap sm:flex-nowrap">
              <Button
                color={theme !== "light" ? "primary" : "default"}
                startContent={
                  theme !== "light" ? <Sun size={16} /> : <Moon size={16} />
                }
                variant={theme !== "light" ? "solid" : "solid"}
                onPress={() =>
                  theme === "light" ? setDarkTheme() : setLightTheme()
                }
              >
                {theme !== "light" ? "Terang" : "Gelap"}
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
          </CardBody>
        </Card>
      </section>
      <section className="flex flex-col justify-start">
        <Tabs
          aria-label="Options"
          className="mt-4"
          selectedKey={tab}
          onSelectionChange={(key) => setTab(String(key))}
        >
          {(hasRole(ROLE.GURU_KEDIRI) ||
            hasRole(ROLE.ADMIN_KEDIRI) ||
            hasRole(ROLE.SUPERADMIN)) && (
            <Tab key="kediri" title="Pengetesan Kediri">
              <Card
                className="border-small border-default-200 dark:border-default-100"
                shadow="none"
              >
                <CardBody>
                  <div className="flex flex-col w-full justify-stretch">
                    <dl className="grid w-full grid-cols-2 gap-5 lg:grid-cols-4 p-1">
                      <PercentageStat
                        color="primary"
                        icon={Users}
                        isPressable={true}
                        title="Santri Aktif"
                        value={statistikKediri.overall?.total_active_peserta}
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kediri?action=penilaian-akademik",
                              )
                            : navigate("/peserta-kediri?action=detail")
                        }
                      />
                      <PercentageStat
                        change={statistikKediri.by_gender["Laki-laki"].user_akademik_count + " L / " + statistikKediri.by_gender.Perempuan.user_akademik_count + "  P"}
                        color="secondary"
                        icon={BookCheckIcon}
                        title="Anda Simak"
                        value={statistikKediri.overall?.user_akademik_count}
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kediri?filter=anda-simak&action=penilaian-akademik",
                              )
                            : navigate(
                                "/peserta-kediri?filter=anda-simak&action=detail",
                              )
                        }
                      />
                      <PercentageStat
                        change={
                          statistikKediri.overall
                            ?.count_peserta_with_max_akademik + " Orang"
                        }
                        color="success"
                        icon={ArrowBigUpDash}
                        title="Penyimakan Terbanyak"
                        value={
                          statistikKediri.overall?.max_akademik_per_peserta
                        }
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kediri?filter=simak-terbanyak&action=penilaian-akademik",
                              )
                            : navigate(
                                "/peserta-kediri?filter=simak-terbanyak&action=detail",
                              )
                        }
                      />
                      <PercentageStat
                        change={
                          statistikKediri.overall
                            ?.count_peserta_with_min_akademik + " Orang"
                        }
                        color="danger"
                        icon={ArrowBigDownDash}
                        title="Penyimakan Tersedikit"
                        value={
                          statistikKediri.overall?.min_akademik_per_peserta
                        }
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kediri?filter=simak-tersedikit&action=penilaian-akademik",
                              )
                            : navigate(
                                "/peserta-kediri?filter=simak-tersedikit&action=detail",
                              )
                        }
                      />
                    </dl>
                  </div>
                </CardBody>
                <Divider />
                <div className="flex flex-col p-4 gap-4">
                  <p className="text-medium">Menu Utama</p>
                  {(hasRole(ROLE.GURU_KEDIRI) || hasRole(ROLE.SUPERADMIN)) && (
                    <>
                      <MenutButton
                        color="primary"
                        icon={BookOpenText}
                        isPressable={true}
                        title="Nilai Penyampaian"
                        onClick={() =>
                          navigate("/peserta-kediri?action=penilaian-akademik")
                        }
                      />
                      <MenutButton
                        color="primary"
                        icon={HeartHandshake}
                        isPressable={true}
                        title="Nilai Akhlak"
                        onClick={() =>
                          navigate("/peserta-kediri?action=penilaian-akhlak")
                        }
                      />
                    </>
                  )}
                  <MenutButton
                    color="primary"
                    icon={Users}
                    isPressable={true}
                    title="Daftar Peserta"
                    onClick={() => navigate("/peserta-kediri?action=detail")}
                  />
                </div>
              </Card>
            </Tab>
          )}
          {(hasRole(ROLE.GURU_KERTOSONO) ||
            hasRole(ROLE.ADMIN_KERTOSONO) ||
            hasRole(ROLE.SUPERADMIN) ||
            hasRole(ROLE.KOMANDAN)) && (
            <Tab key="kertosono" title="Pengetesan Kertosono">
              <Card
                className="border-small border-default-200 dark:border-default-100"
                shadow="none"
              >
                <CardBody>
                  <div className="flex flex-col w-full justify-stretch">
                    <dl className="grid w-full grid-cols-2 gap-5 lg:grid-cols-4 p-1">
                      <PercentageStat
                        color="primary"
                        icon={Users}
                        isPressable={true}
                        title="Santri Aktif"
                        value={statistikKertosono.overall?.total_active_peserta}
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kertosono?action=penilaian-akademik",
                              )
                            : navigate("/peserta-kertosono?action=detail")
                        }
                      />
                      <PercentageStat
                        change={statistikKertosono.by_gender["Laki-laki"].user_akademik_count + " L / " + statistikKertosono.by_gender.Perempuan.user_akademik_count + "  P"}
                        color="secondary"
                        icon={BookCheckIcon}
                        title="Anda Simak"
                        value={statistikKertosono.overall?.user_akademik_count}
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kertosono?filter=anda-simak&action=penilaian-akademik",
                              )
                            : navigate(
                                "/peserta-kertosono?filter=anda-simak&action=detail",
                              )
                        }
                      />
                      <PercentageStat
                        change={
                          statistikKertosono.overall
                            ?.count_peserta_with_max_akademik
                            ? statistikKertosono.overall
                                ?.count_peserta_with_max_akademik + " Orang"
                            : null
                        }
                        color="success"
                        icon={ArrowBigUpDash}
                        title="Penyimakan Terbanyak"
                        value={
                          statistikKertosono.overall?.max_akademik_per_peserta
                        }
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kertosono?filter=simak-terbanyak&action=penilaian-akademik",
                              )
                            : navigate(
                                "/peserta-kertosono?filter=simak-terbanyak&action=detail",
                              )
                        }
                      />
                      <PercentageStat
                        change={
                          statistikKertosono.overall
                            ?.count_peserta_with_min_akademik
                            ? statistikKertosono.overall
                                ?.count_peserta_with_min_akademik + " Orang"
                            : null
                        }
                        color="danger"
                        icon={ArrowBigDownDash}
                        title="Penyimakan Tersedikit"
                        value={
                          statistikKertosono.overall?.min_akademik_per_peserta
                        }
                        onClick={() =>
                          hasRole(ROLE.GURU_KERTOSONO) ||
                          hasRole(ROLE.SUPERADMIN)
                            ? navigate(
                                "/peserta-kertosono?filter=simak-tersedikit&action=penilaian-akademik",
                              )
                            : navigate(
                                "/peserta-kertosono?filter=simak-tersedikit&action=detail",
                              )
                        }
                      />
                    </dl>
                  </div>
                </CardBody>
                <Divider />
                <div className="flex flex-col p-4 gap-4">
                  <p className="text-medium">Menu Utama</p>
                  {(hasRole(ROLE.GURU_KERTOSONO) ||
                    hasRole(ROLE.SUPERADMIN)) && (
                    <>
                      <MenutButton
                        color="primary"
                        icon={BookOpenText}
                        isPressable={true}
                        title="Nilai Bacaan"
                        onClick={() =>
                          navigate(
                            "/peserta-kertosono?action=penilaian-akademik",
                          )
                        }
                      />
                      <MenutButton
                        color="primary"
                        icon={HeartHandshake}
                        isPressable={true}
                        title="Catatan Ketertiban"
                        onClick={() =>
                          navigate("/peserta-kertosono?action=penilaian-akhlak")
                        }
                      />
                    </>
                  )}
                  <MenutButton
                    color="primary"
                    icon={Users}
                    isPressable={true}
                    title="Daftar Peserta"
                    onClick={() => navigate("/peserta-kertosono?action=detail")}
                  />
                   <MenutButton
                    color="primary"
                    icon={UserRoundCheck}
                    isPressable={true}
                    title="Verifikasi Peserta"
                    onClick={() => navigate("/peserta-kertosono/verifikasi")}
                  />
                </div>
              </Card>
            </Tab>
          )}
        </Tabs>
      </section>
    </div>
  );
}
