import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PesertaKertosonoVerifikasi } from "@/types/kertosono";
import { Spinner, Card, CardBody, Button, Divider, toast, addToast, Navbar, NavbarContent, NavbarItem, Avatar, Chip, cn, Input } from "@heroui/react";
import { ArrowLeft, CheckCircle, CircleX, Clock, GraduationCap, Handshake, HeartHandshake, MapPinned, School, Smile } from "lucide-react";
import { useKertosono } from "@/hooks/use-kertosono";
import PesertaVerifikasiForm from "@/components/peserta-verifikasi-form";
import ActionPesertaVerifikasiTopbar from "@/components/action-peserta-verifikasi-topbar";
import { ucwordsCustom, ucwords } from "@/libs/helper";

const PesertaKertosonoVerifikasiDetail: React.FC = () => {
  const { id_tes_santri } = useParams<{ id_tes_santri: string }>();
  const navigate = useNavigate();
  const { getSinglePesertaKertosonoVerifikasi, updatePesertaKertosonoVerifikasi } = useKertosono();
  
  const [santri, setSantri] = useState<PesertaKertosonoVerifikasi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSantri = async () => {
      if (!id_tes_santri) {
        addToast({
          title: "Error",
          description: "ID Santri tidak valid",
          color: 'danger',
        });
        navigate("/");
        return;
      }
  
      setIsLoading(true);
      try {
        const data = await getSinglePesertaKertosonoVerifikasi(id_tes_santri);
        if (data) {
          setSantri(data);
        } else {
          addToast({
            title: "Error",
            description: "Data santri tidak ditemukan",
            color: 'danger',
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching santri:", error);
        addToast({
          title: "Error",
          description: "Data santri tidak ditemukan",
          color: 'danger',
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSantri();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_tes_santri]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (formData: Partial<PesertaKertosonoVerifikasi>) => {
    if (!id_tes_santri || !santri) return;

    setIsSubmitting(true);
    try {
      const updatedData = await updatePesertaKertosonoVerifikasi(id_tes_santri, formData);
      if (updatedData) {
        setSantri(updatedData);
        setIsEditing(false);
        addToast({
            title: "Berhasil",
            description: "Data santri berhasil diperbarui",
            color: 'success',
        })
      }
    } catch (error) {
      console.error("Error updating santri:", error);
      addToast({
        title: "Error",
        description: "Gagal memperbarui data santri",
        color: 'danger',
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center font-inter relative">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!santri) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-inter relative items-center justify-center">
        <p className="text-center text-lg">Data santri tidak ditemukan</p>
        <Button color="primary" variant="light" onPress={() => navigate(-1)} startContent={<ArrowLeft size={16} />}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter relative">
      <Navbar
        isBordered
        maxWidth="full"
      >
        <NavbarContent justify="start">
          <Button
            isIconOnly
            aria-label="Back"
            className="flex-grow-0"
            variant="light"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
        </NavbarContent>
        <NavbarContent justify="center">
          <p className="font-medium text-xl">
            {santri.nama_lengkap || "Santri"}
          </p>
        </NavbarContent>
        {
          isEditing ? (
            <NavbarContent justify="end">
              <Button color="danger" variant="flat" onPress={handleCancel}>
                Batalkan
              </Button>
            </NavbarContent>
          ) : (
            <NavbarContent justify="end">
              <NavbarItem>
                <Button color="primary" variant="flat" onPress={handleEdit}>
                  Edit Biodata
                </Button>
              </NavbarItem>
            </NavbarContent>
          )
        }
      </Navbar>

      <main className="container flex flex-col flex-grow mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 gap-4">
        <Card
          fullWidth
          className={cn(`border-small dark:border-small border-default-100`)}
        >
          <CardBody className="flex flex-row items-center justify-center gap-2">
            <div className="flex flex-col flex-1 rounded-lg p-2">
              <div className="flex flex-row items-center mb-4">
                <Avatar
                  isBordered
                  className="mr-4"
                  size="lg"
                  src={santri.foto_smartcard}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-large font-semibold">
                      {santri.nama_lengkap}
                    </h3>
                  </div>
                  <p className="mb-2 text-small font-medium text-default-600">
                    {santri.jenis_kelamin === "L" ? "bin" : "binti"}{" "}
                    {santri.nama_ayah}
                  </p>
                </div>
              </div>
              <Divider />
              <div className="flex flex-row flex-wrap gap-2 mt-4 text-small">
                <Chip
                  color="primary"
                  startContent={<School size={18} />}
                  variant="flat"
                >
                  {ucwordsCustom(santri.asal_pondok_nama)}
                </Chip>
                <Chip
                  color="primary"
                  startContent={<MapPinned size={18} />}
                  variant="flat"
                >
                  {ucwords(santri.asal_daerah_nama)}
                </Chip>
                <Chip
                  color="primary"
                  startContent={<GraduationCap size={18} />}
                  variant="flat"
                >
                  {ucwordsCustom(santri.jurusan !== null && santri.jurusan !== '' && santri.jurusan !== '-' ? santri.pendidikan + "-" + santri.jurusan : santri.pendidikan)}
                </Chip>
                <Chip
                  color="primary"
                  startContent={<Clock size={18} />}
                  variant="flat"
                >
                  {santri.umur} Tahun
                </Chip>
                <Chip
                  color="primary"
                  startContent={<Handshake size={18} />}
                  variant="flat"
                >
                  {ucwords(santri.status_mondok)}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
        {isEditing ? (
          <PesertaVerifikasiForm
            santri={santri}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <PesertaVerifikasiView santri={santri} />
        )}
      </main>
    </div>
  );
};

// Component to display santri details using NextUI
const PesertaVerifikasiView: React.FC<{ santri: PesertaKertosonoVerifikasi }> = ({ santri }) => {

  // Helper function to format value or return placeholder
  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === '') {
      return "-";
    }
    return String(value);
  };

  // Helper function for RT/RW display
  const formatRtRw = (rt: string | null | undefined, rw: string | null | undefined): string => {
    const formattedRt = formatValue(rt);
    const formattedRw = formatValue(rw);
    if (formattedRt === "-" && formattedRw === "-") return "-";
    return `${formattedRt}/${formattedRw}`;
  };

  // Helper function for gender display
  const formatJenisKelamin = (value: 'L' | 'P' | null | string): string => {
    if (value === 'L') return 'Laki-laki';
    if (value === 'P') return 'Perempuan';
    return '-';
  };


  return (
    <Card
      fullWidth
      className={cn(`border-small dark:border-small border-default-100`)}
    >
      <CardBody className="p-6 space-y-6"> {/* Added padding and vertical spacing */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informasi Pribadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isReadOnly
              label="NISPN"
              value={formatValue(santri.nispn)}
              variant="bordered" // Or "flat", "faded"
            />
            <Input
              isReadOnly
              label="NIK"
              value={formatValue(santri.nik)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Nama Lengkap"
              value={formatValue(santri.nama_lengkap)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Nama Panggilan"
              value={formatValue(santri.nama_panggilan)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Jenis Kelamin"
              value={formatJenisKelamin(santri.jenis_kelamin)}
              variant="bordered"
            />
             <Input
              isReadOnly
              label="Umur"
              value={formatValue(santri.umur)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Tempat Lahir"
              value={formatValue(santri.tempat_lahir)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Tanggal Lahir"
              // Consider formatting the date if needed (e.g., using date-fns)
              value={formatValue(santri.tanggal_lahir)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Nama Ayah"
              value={formatValue(santri.nama_ayah)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Nama Ibu"
              value={formatValue(santri.nama_ibu)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Pendidikan"
              value={formatValue(santri.pendidikan)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Jurusan"
              value={formatValue(santri.jurusan)}
              variant="bordered"
            />
             <Input
              isReadOnly
              label="HP"
              value={formatValue(santri.hp)}
              variant="bordered"
            />
          </div>
        </div>

        <Divider />

        <div>
          <h2 className="text-xl font-semibold mb-4">Alamat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isReadOnly
              label="Alamat"
              value={formatValue(santri.alamat)}
              variant="bordered"
              // Consider using Textarea if address is very long
              // className="md:col-span-2" // Optional: make address span full width
            />
             <Input
              isReadOnly
              label="RT/RW"
              value={formatRtRw(santri.rt, santri.rw)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Provinsi"
              value={formatValue(santri.provinsi)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Kota/Kabupaten"
              value={formatValue(santri.kota_kab)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Kecamatan"
              value={formatValue(santri.kecamatan)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Desa/Kelurahan"
              value={formatValue(santri.desa_kel)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Kode Pos"
              value={formatValue(santri.kode_pos)}
              variant="bordered"
            />
          </div>
        </div>

        <Divider />

        <div>
          <h2 className="text-xl font-semibold mb-4">Informasi Pondok</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isReadOnly
              label="Asal Pondok"
              value={formatValue(santri.asal_pondok_nama)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Status Mondok"
              value={formatValue(santri.status_mondok)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Daerah Sambung"
              value={formatValue(santri.asal_daerah_nama)}
              variant="bordered"
            />
            <Input
              isReadOnly
              label="Kelompok Sambung"
              value={formatValue(santri.kelompok_sambung)}
              variant="bordered"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PesertaKertosonoVerifikasiDetail;
