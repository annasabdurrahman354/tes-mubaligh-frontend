import React from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { StatCard } from "./stat-card";
import { CircleChartCard } from "./circle-chart-card";
import { BarChartCard } from "./bar-chart-card";
import { StatistikTes } from "@/types/statistik";

interface LocationStatsProps {
  data: StatistikTes;
}

export function LocationStats({ data }: LocationStatsProps) {
  const [selected, setSelected] = React.useState("overview");
  
  // Calculate summary metrics
  const totalPeserta = data.overall.total_active_peserta;
  const sudahTes = totalPeserta - data.overall.hasil_sistem.belum_pengetesan;
  const belumTes = data.overall.hasil_sistem.belum_pengetesan;
  
  // Prepare data for hasil sistem donut chart
  const hasilSistemData = [
    { name: "Lulus", value: data.overall.hasil_sistem.lulus, color: "#17C964" },
    { name: "Tidak Lulus", value: data.overall.hasil_sistem.tidak_lulus, color: "#F31260" },
    { name: "Perlu Musyawarah", value: data.overall.hasil_sistem.perlu_musyawarah, color: "#F5A524" },
    { name: "Belum Pengetesan", value: data.overall.hasil_sistem.belum_pengetesan, color: "#889096" }
  ];
  
  // Prepare data for gender distribution donut chart
  const genderData = [
    { name: "Laki-laki", value: data.by_gender["Laki-laki"].total_active_peserta, color: "#006FEE" },
    { name: "Perempuan", value: data.by_gender["Perempuan"].total_active_peserta, color: "#FF4ECD" }
  ];
  
  // Prepare data for academic metrics bar chart
  const academicData = [
    { 
      name: "Laki-laki", 
      min: data.by_gender["Laki-laki"].min_akademik_per_peserta,
      max: data.by_gender["Laki-laki"].max_akademik_per_peserta,
      count: data.by_gender["Laki-laki"].user_akademik_count
    },
    { 
      name: "Perempuan", 
      min: data.by_gender["Perempuan"].min_akademik_per_peserta,
      max: data.by_gender["Perempuan"].max_akademik_per_peserta,
      count: data.by_gender["Perempuan"].user_akademik_count
    }
  ];
  
  // Prepare data for hasil sistem by gender bar chart
  const hasilByGenderData = [
    { 
      name: "Laki-laki", 
      lulus: data.by_gender["Laki-laki"].hasil_sistem.lulus,
      tidak_lulus: data.by_gender["Laki-laki"].hasil_sistem.tidak_lulus,
      perlu_musyawarah: data.by_gender["Laki-laki"].hasil_sistem.perlu_musyawarah,
      belum_pengetesan: data.by_gender["Laki-laki"].hasil_sistem.belum_pengetesan
    },
    { 
      name: "Perempuan", 
      lulus: data.by_gender["Perempuan"].hasil_sistem.lulus,
      tidak_lulus: data.by_gender["Perempuan"].hasil_sistem.tidak_lulus,
      perlu_musyawarah: data.by_gender["Perempuan"].hasil_sistem.perlu_musyawarah,
      belum_pengetesan: data.by_gender["Perempuan"].hasil_sistem.belum_pengetesan
    }
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Peserta" 
          value={totalPeserta} 
          icon="lucide:users" 
          color="primary" 
        />
        <StatCard 
          title="Sudah Tes" 
          value={sudahTes} 
          icon="lucide:check-circle" 
          color="success" 
        />
        <StatCard 
          title="Belum Tes" 
          value={belumTes} 
          icon="lucide:clock" 
          color="warning" 
        />
      </div>
      
      <Tabs 
        aria-label="Statistics Categories" 
        selectedKey={selected} 
        onSelectionChange={setSelected as any}
        variant="underlined"
        color="primary"
        className="mt-2"
      >
        <Tab key="overview" title="Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CircleChartCard 
              title="Hasil Sistem" 
              color="success" 
              categories={["Lulus", "Tidak Lulus", "Perlu Musyawarah", "Belum Pengetesan"]} 
              chartData={hasilSistemData}
            />
            <CircleChartCard 
              title="Distribusi Gender" 
              color="primary" 
              categories={["Laki-laki", "Perempuan"]} 
              chartData={genderData}
            />
          </div>
        </Tab>
        <Tab key="academic" title="Academic Metrics">
          <div className="grid grid-cols-1 gap-6 mt-4">
            <BarChartCard 
              title="Metrics Akademik per Gender" 
              color="primary"
              data={academicData}
              keys={[
                { key: "min", color: "#006FEE", name: "Min Akademik" },
                { key: "max", color: "#17C964", name: "Max Akademik" },
                { key: "count", color: "#F5A524", name: "User Akademik Count" }
              ]}
              timeRanges={["Maret 2025"]}
              defaultTimeRange="maret-2025"
            />
          </div>
        </Tab>
        <Tab key="results" title="Hasil Tes">
          <div className="grid grid-cols-1 gap-6 mt-4">
            <BarChartCard 
              title="Hasil Sistem per Gender" 
              color="success"
              data={hasilByGenderData}
              keys={[
                { key: "lulus", color: "#17C964", name: "Lulus" },
                { key: "tidak_lulus", color: "#F31260", name: "Tidak Lulus" },
                { key: "perlu_musyawarah", color: "#F5A524", name: "Perlu Musyawarah" },
                { key: "belum_pengetesan", color: "#889096", name: "Belum Pengetesan" }
              ]}
              timeRanges={["Maret 2025"]}
              defaultTimeRange="maret-2025"
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}