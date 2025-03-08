import { LocationStats } from "@/components/statistic/location-stats";
import { useAuth } from "@/hooks/use-auth";
import { useStatistik } from "@/hooks/use-statistik";
import { ROLE } from "@/types/enum";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { useState } from "react";

export default function StatistikPage() {
  const [tab, setTab] = useState("kediri");
  const {statistikKediri, statistikKertosono} = useStatistik()
  const { hasRole } = useAuth();

  return (
    <div>
      <section className="flex flex-col gap-4 w-full">
        <header className="w-full">
          <h1 className="text-lg text-gray-800">Statistik Tes</h1>
          <p className="text-sm text-gray-500">Periode {statistikKediri.periode_tes ?? statistikKertosono.periode_tes}</p>
        </header>

        <Card
          className="border-small border-default-200 dark:border-default-100"
          shadow="none"
        >
          <CardBody>
            <Tabs
              aria-label="Options"
              selectedKey={tab}
              onSelectionChange={(key) => setTab(String(key))}
            >
              {(hasRole(ROLE.GURU_KEDIRI) ||
                hasRole(ROLE.ADMIN_KEDIRI) ||
                hasRole(ROLE.SUPERADMIN)) && (
                <Tab key="kediri" title="Pengetesan Kediri">
                  <LocationStats data={statistikKediri} />
                </Tab>
              )}
              {(hasRole(ROLE.GURU_KERTOSONO) ||
                hasRole(ROLE.ADMIN_KERTOSONO) ||
                hasRole(ROLE.SUPERADMIN)) && (
                <Tab key="kertosono" title="Pengetesan Kertosono">
                  <LocationStats data={statistikKertosono} />
                </Tab>
              )}
            </Tabs>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
