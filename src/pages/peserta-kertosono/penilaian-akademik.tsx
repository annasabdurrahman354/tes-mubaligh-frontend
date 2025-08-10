import {
  addToast,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  cn,
  RadioGroup,
  Tab,
  Tabs,
  Textarea,
  Select,
  SelectItem,
  // --- Add Modal imports ---
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // -----------------------
} from "@heroui/react";
import { Formik } from "formik";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import ActionPesertaTopbar from "@/components/action-peserta-topbar";
import { CustomRadio } from "@/components/custom-radio";
import EmptyState from "@/components/empty-state";
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkademikKertosonoCard from "@/components/riwayat-akademik-kertosono-card";
import Timer from "@/components/timer";
import { useAuth } from "@/hooks/use-auth";
import { useKertosono } from "@/hooks/use-kertosono";
import { usePeserta } from "@/hooks/use-peserta";
import { SelectOption } from "@/types";
import api, { handleApiError } from "@/libs/axios";

// Validation schema remains the same
const validationSchema = Yup.object().shape({
  penilaian: Yup.string().required("Penilaian harus dipilih."),
  kekurangan: Yup.string().test(
    "kekurangan-not-empty",
    "Setidaknya satu kekurangan harus dipilih jika penilaian Tidak Lulus.",
    function (_, context) {
      const {
        penilaian,
        kekurangan_tajwid,
        kekurangan_khusus,
        kekurangan_keserasian,
        kekurangan_kelancaran,
      } = context.parent;

      if (penilaian === "Tidak Lulus") {
        const allKekuranganEmpty =
          (!kekurangan_tajwid || kekurangan_tajwid.length === 0) &&
          (!kekurangan_khusus || kekurangan_khusus.length === 0) &&
          (!kekurangan_keserasian || kekurangan_keserasian.length === 0) &&
          (!kekurangan_kelancaran || kekurangan_kelancaran.length === 0);

        if (allKekuranganEmpty) {
          return false;
        }
      }

      return true;
    },
  ),
  catatan: Yup.string(),
  rekomendasi_penarikan: Yup.boolean(),
});

// Helper function to safely get initial duration number
const getInitialDuration = (duration) => {
  const num = Number(duration);
  return isNaN(num) ? 0 : num;
};

export default function PenilaianAkademikKertosonoPage() {
  const { user } = useAuth();
  const { storeAkademikKertosono } = useKertosono();
  const {
    selectedPeserta,
    toggleSelectedPeserta,
    activePesertaIndex,
    setActivePesertaIndex,
    formValues,
    setFormValues,
  } = usePeserta();
  const navigate = useNavigate();
  const [tab, setTab] = useState("penilaian");
  const [loading, setLoading] = useState(false);
  const [guruPenggantiOptions, setGuruPenggantiOptions] = useState<SelectOption[]>([]);

  // --- State for cancel confirmation modal ---
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  // ------------------------------------------

  const getGuruPenggantiKertosonoOptions = useCallback(async (): Promise<SelectOption[]> => {
    console.log("Fetching guru pengganti options...");
    try {
        const response = await api.get(`options/guru-pengganti-kertosono/${user?.id}`);
        // Assuming the API returns an object like { "Ponpes A (Daerah X)": 1, ... }
        const formattedData: SelectOption[] = Object.entries(response.data ?? {}).map(
            ([label, value]) => ({
                value: value as (string | number),
                label: label,
            })
        );
        formattedData.sort((a, b) => a.label.localeCompare(b.label));
        return formattedData;
    } catch (err) {
        handleApiError(err);
        addToast({ 
          title: "Error", 
          description: "Gagal memuat guru pengganti.", 
          color: 'danger' 
        });
        return [];
    }
  }, [user?.id]);

  // Effect to fetch guru pengganti options
  useEffect(() => {
    if (user?.id) {
      getGuruPenggantiKertosonoOptions().then(setGuruPenggantiOptions);
    }
  }, [getGuruPenggantiKertosonoOptions, user?.id]);

  // Redirect effect
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      navigate("/peserta-kertosono?action=penilaian-akademik", {
        replace: true,
      });
    }
  }, [selectedPeserta, navigate]);

  // Effect to initialize form values
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      return;
    }

    const updatedFormValues = selectedPeserta.map((peserta) => {
      const existingForm = formValues.find(
        (form) => form.tes_santri_id === peserta.id,
      );

      if (existingForm && existingForm.awal_penilaian) {
          return existingForm;
      }

      let calculated_awal_penilaian = new Date(Date.now());
      let current_total_duration = null;

      const akademikEntry = peserta.telah_disimak
        ? peserta.akademik?.find((akademik) => akademik.guru_id == user?.id)
        : null;

      if (akademikEntry) {
        const loadedDuration = getInitialDuration(akademikEntry.durasi_penilaian);
        current_total_duration = loadedDuration;
        calculated_awal_penilaian = new Date(Date.now() - loadedDuration * 60000);
      }

      const initialData = {
        tes_santri_id: peserta.id,
        penilaian: akademikEntry ? akademikEntry.penilaian || "" : "",
        kekurangan_tajwid: akademikEntry ? akademikEntry.kekurangan_tajwid || [] : [],
        kekurangan_khusus: akademikEntry ? akademikEntry.kekurangan_khusus || [] : [],
        kekurangan_keserasian: akademikEntry ? akademikEntry.kekurangan_keserasian || [] : [],
        kekurangan_kelancaran: akademikEntry ? akademikEntry.kekurangan_kelancaran || [] : [],
        guru_pengganti: akademikEntry ? akademikEntry.guru_pengganti || null : null,
        catatan: akademikEntry ? akademikEntry.catatan || "" : "",
        rekomendasi_penarikan: akademikEntry ? akademikEntry.rekomendasi_penarikan || false : false,
        awal_penilaian: calculated_awal_penilaian,
        durasi_penilaian: current_total_duration,
      };

      if (existingForm && !existingForm.awal_penilaian) {
          return {
              ...initialData,
              tes_santri_id: existingForm.tes_santri_id || initialData.tes_santri_id,
              penilaian: existingForm.penilaian || initialData.penilaian,
              kekurangan_tajwid: existingForm.kekurangan_tajwid || initialData.kekurangan_tajwid,
              kekurangan_khusus: existingForm.kekurangan_khusus || initialData.kekurangan_khusus,
              kekurangan_keserasian: existingForm.kekurangan_keserasian || initialData.kekurangan_keserasian,
              kekurangan_kelancaran: existingForm.kekurangan_kelancaran || initialData.kekurangan_kelancaran,
              guru_pengganti: existingForm.guru_pengganti || initialData.guru_pengganti,
              catatan: existingForm.catatan || initialData.catatan,
              rekomendasi_penarikan: existingForm.rekomendasi_penarikan || initialData.rekomendasi_penarikan,
          };
      }

      return initialData;
    });

    setFormValues(updatedFormValues);
  }, [selectedPeserta, user?.id, setFormValues]);

  // Don't render if redirecting
  if (!selectedPeserta || selectedPeserta.length === 0) {
    return null;
  }

  // handleRemovePeserta
  const handleRemovePeserta = (indexToRemove) => {
    const pesertaToRemove = selectedPeserta[indexToRemove];
    if (selectedPeserta.length === 1) {
      toggleSelectedPeserta(pesertaToRemove);
      navigate("/peserta-kertosono?action=penilaian-akademik", { replace: true });
      return;
    }
    if (activePesertaIndex === selectedPeserta.length - 1) {
      setActivePesertaIndex(activePesertaIndex - 1);
    }
    toggleSelectedPeserta(pesertaToRemove);
  };

  // Handler for confirming cancellation
  const handleConfirmCancel = () => {
    handleRemovePeserta(activePesertaIndex);
    setIsCancelModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter relative">
      <ActionPesertaTopbar />
      <main className="container flex flex-col flex-grow mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 gap-4">
        {selectedPeserta[activePesertaIndex] && (
            <PesertaProfileCard peserta={selectedPeserta[activePesertaIndex]} />
        )}
        <div className="flex flex-col">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            color="primary"
            selectedKey={tab}
            size="md"
            variant="bordered"
            onSelectionChange={(key) => setTab(String(key))}
          >
            <Tab key="penilaian" title="Form Penilaian">
              {formValues[activePesertaIndex] ? (
                <Formik
                  enableReinitialize
                  initialValues={formValues[activePesertaIndex]}
                  validationSchema={validationSchema}
                  onSubmit={async () => {
                    try {
                      setLoading(true);
                      const currentFormState = formValues[activePesertaIndex];
                      const timerStartTime = currentFormState?.awal_penilaian?.getTime();

                      if (!timerStartTime) {
                        throw new Error("Assessment start time is missing.");
                      }

                      const totalDurasiMenit = Math.round(
                        (Date.now() - timerStartTime) / 60000,
                      );

                      const updatedFormValuesPayload = {
                        ...currentFormState,
                        durasi_penilaian: totalDurasiMenit,
                      };

                      setFormValues((prevValues) => {
                        const newValues = [...prevValues];
                          if(newValues[activePesertaIndex]) {
                             newValues[activePesertaIndex] = {
                               ...newValues[activePesertaIndex],
                               durasi_penilaian: totalDurasiMenit,
                             };
                           }
                         return newValues;
                      });

                      const storedForm = await storeAkademikKertosono(
                        updatedFormValuesPayload.tes_santri_id,
                        updatedFormValuesPayload.penilaian,
                        updatedFormValuesPayload.penilaian === "Lulus" ? null : updatedFormValuesPayload.kekurangan_tajwid,
                        updatedFormValuesPayload.penilaian === "Lulus" ? null : updatedFormValuesPayload.kekurangan_khusus,
                        updatedFormValuesPayload.penilaian === "Lulus" ? null : updatedFormValuesPayload.kekurangan_keserasian,
                        updatedFormValuesPayload.penilaian === "Lulus" ? null : updatedFormValuesPayload.kekurangan_kelancaran,
                        updatedFormValuesPayload.guru_pengganti,
                        updatedFormValuesPayload.catatan,
                        updatedFormValuesPayload.penilaian === "Tidak Lulus" ? null : updatedFormValuesPayload.rekomendasi_penarikan,
                        updatedFormValuesPayload.durasi_penilaian,
                      );

                      addToast({
                        title: "Yeayy!",
                        description: storedForm.message,
                        timeout: 3000,
                        variant: "flat",
                        color: "success",
                        shouldShowTimeoutProgess: true,
                      });

                      console.log("Form stored successfully:", storedForm);
                      handleRemovePeserta(activePesertaIndex);
                      window.scrollTo(0, 0);
                    } catch (error) {
                       addToast({
                         title: "Terjadi Kesalahan!",
                         description: error instanceof Error ? error.message : String(error),
                         timeout: 3000,
                         variant: "flat",
                         color: "danger",
                         shouldShowTimeoutProgess: true,
                       });
                      console.error("Error storing form:", error);
                    } finally {
                         setLoading(false);
                    }
                  }}
                >
                  {({ values, handleSubmit, setFieldValue, errors, touched }) => (
                    <Card
                      fullWidth
                      className={cn(
                        `border-small dark:border-small border-default-100 relative`,
                      )}
                    >
                      <CardBody className="overflow-hidden">
                          {values.awal_penilaian ? (
                            <Timer
                              className="absolute top-2 right-2"
                              datetimeOrMinutes={values.awal_penilaian}
                            />
                          ) : null}

                          <div className="flex flex-col gap-6 p-2 pt-8">
                            <RadioGroup
                              isRequired
                              classNames={{
                                wrapper: "w-full flex flex-row gap-6 my-2 px-4",
                                label: "px-2",
                              }}
                              errorMessage={errors.penilaian}
                              isDisabled={loading}
                              isInvalid={!!errors.penilaian && !!touched.penilaian}
                              label="Nilai Bacaan"
                              value={values.penilaian}
                              onValueChange={(value) => {
                                setFieldValue("penilaian", value);
                                setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], penilaian: value }; } return newValues; });
                              }}
                            >
                              <CustomRadio buttonColor="success" value="Lulus"> Lulus </CustomRadio>
                              <CustomRadio buttonColor="danger" value="Tidak Lulus"> Tidak Lulus </CustomRadio>
                            </RadioGroup>

                            {values.penilaian === "Tidak Lulus" && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
                                <CheckboxGroup
                                  color="danger" isDisabled={loading} label="Kekurangan Tajwid"
                                  value={values.kekurangan_tajwid}
                                  onValueChange={(value) => {
                                     setFieldValue("kekurangan_tajwid", value);
                                     setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_tajwid: value }; } return newValues; });
                                  }}
                                >
                                  <Checkbox value="Dengung">Dengung</Checkbox>
                                  <Checkbox value="Mad">Mad</Checkbox>
                                  <Checkbox value="Makhraj">Makhraj</Checkbox>
                                  <Checkbox value="Tafkhim-Tarqiq"> Tafkhim-Tarqiq </Checkbox>
                                </CheckboxGroup>
                                <CheckboxGroup
                                   color="danger" isDisabled={loading} label="Kekurangan Khusus"
                                   value={values.kekurangan_khusus}
                                   onValueChange={(value) => {
                                       setFieldValue("kekurangan_khusus", value);
                                       setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_khusus: value }; } return newValues; });
                                   }}
                                >
                                     <Checkbox value="Harakat">Harakat</Checkbox>
                                     <Checkbox value="Lafadz">Lafadz</Checkbox>
                                     <Checkbox value="Lam Jalalah"> Lam Jalalah </Checkbox>
                                </CheckboxGroup>
                                <CheckboxGroup
                                    color="danger" isDisabled={loading} label="Kekurangan Keserasian"
                                    value={values.kekurangan_keserasian}
                                    onValueChange={(value) => {
                                       setFieldValue("kekurangan_keserasian", value);
                                       setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_keserasian: value }; } return newValues; });
                                    }}
                                >
                                    <Checkbox value="Panjang Pendek"> Panjang Pendek </Checkbox>
                                    <Checkbox value="Ikhtilash Huruf Sukun"> Ikhtilash Huruf Sukun </Checkbox>
                                    <Checkbox value="Ikhtilash Huruf Syiddah"> Ikhtilash Huruf Syiddah </Checkbox>
                                </CheckboxGroup>
                                <CheckboxGroup
                                    color="danger" isDisabled={loading} label="Kekurangan Kelancaran"
                                    value={values.kekurangan_kelancaran}
                                    onValueChange={(value) => {
                                        setFieldValue("kekurangan_kelancaran", value);
                                        setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_kelancaran: value }; } return newValues; });
                                    }}
                                >
                                    <Checkbox value="Kecepatan">Kecepatan</Checkbox>
                                    <Checkbox value="Ketartilan">Ketartilan</Checkbox>
                                </CheckboxGroup>
                              </div>
                            )}

                            {errors.kekurangan && touched.penilaian && values.penilaian === "Tidak Lulus" && (
                              <p className="text-danger-500 text-medium items-start">
                                {errors.kekurangan}
                              </p>
                            )}

                           {values.penilaian === "Lulus" && (
                                <Checkbox
                                  className="mx-0.5"
                                  isDisabled={loading}
                                  isSelected={values.rekomendasi_penarikan}
                                  onValueChange={(value) => {
                                    setFieldValue("rekomendasi_penarikan", value);
                                    setFormValues((prevValues) => {
                                      const newValues = [...prevValues];
                                      if (newValues[activePesertaIndex]) {
                                         newValues[activePesertaIndex] = {
                                            ...newValues[activePesertaIndex],
                                            rekomendasi_penarikan: value,
                                         };
                                      }
                                      return newValues;
                                    });
                                  }}
                                 >
                                 Rekomendasi Penarikan
                                </Checkbox>
                            )}

                            <Textarea
                              isMultiline
                              className="w-full px-2"
                              isDisabled={loading}
                              label="Catatan"
                              minRows={4}
                              placeholder="Tuliskan catatan penilaian"
                              value={values.catatan}
                              onValueChange={(text) => {
                                setFieldValue("catatan", text);
                                setFormValues((prevValues) => {
                                  const newValues = [...prevValues];
                                  if (newValues[activePesertaIndex]) {
                                    newValues[activePesertaIndex] = {
                                      ...newValues[activePesertaIndex],
                                      catatan: text,
                                    };
                                  }
                                  return newValues;
                                });
                              }}
                            />
                            
                            {/* --- Guru Pengganti Select Field --- */}
                            <Select
                              className="w-full"
                              isDisabled={loading}
                              label="Guru Pengganti"
                              placeholder="Pilih guru pengganti (opsional)"
                              isClearable={true}
                              selectedKeys={values.guru_pengganti ? [String(values.guru_pengganti)] : []}
                              onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0] || "";
                                setFieldValue("guru_pengganti", selectedValue);
                                setFormValues((prevValues) => {
                                  const newValues = [...prevValues];
                                  if (newValues[activePesertaIndex]) {
                                    newValues[activePesertaIndex] = {
                                      ...newValues[activePesertaIndex],
                                      guru_pengganti: selectedValue,
                                    };
                                  }
                                  return newValues;
                                });
                              }}
                            >
                              {/* Blank option */}
                              <SelectItem key="">
                                Pilih salah satu guru pengganti (opsional)
                              </SelectItem>
                              {guruPenggantiOptions.map((option) => (
                                <SelectItem key={String(option.value)} value={String(option.value)}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </Select>
                            {/* ----------------------------------- */}
                          </div>

                        {/* Buttons */}
                        <div className="flex flex-row justify-end mt-6 gap-4 p-2">
                          <Button
                            color="danger"
                            disabled={loading}
                            variant="flat"
                            onPress={() => setIsCancelModalOpen(true)}
                          >
                            Batal
                          </Button>
                          <Button
                            color="primary"
                            disabled={loading}
                            isLoading={loading}
                            variant="shadow"
                            onPress={() => handleSubmit()}
                            type="submit"
                          >
                            Simpan
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </Formik>
              ) : (
                 <Card fullWidth className={cn(`border-small dark:border-small border-default-100`)}> 
                   <CardBody><p>Memuat data peserta tes...</p></CardBody> 
                 </Card>
              )}
            </Tab>
            <Tab key="riwayat" title="Riwayat">
              {selectedPeserta[activePesertaIndex] ? (
                <Card
                  fullWidth
                  className={cn(
                    `border-small dark:border-small border-default-100`,
                  )}
                >
                  <CardBody className="overflow-hidden">
                    <div className="flex flex-col gap-4">
                      {selectedPeserta[activePesertaIndex].akademik && selectedPeserta[activePesertaIndex].akademik.length > 0 ? (
                        selectedPeserta[activePesertaIndex].akademik.map(
                          (akademik) => (
                            <RiwayatAkademikKertosonoCard
                              key={akademik.id}
                              akademik={akademik}
                            />
                          ),
                        )
                      ) : (
                        <EmptyState />
                      )}
                    </div>
                  </CardBody>
                </Card>
              ) : (
                  <p>Memuat riwayat pengetesan...</p>
              )}
            </Tab>
          </Tabs>
        </div>
      </main>
      <PesertaRFIDScanner />

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={isCancelModalOpen} onOpenChange={setIsCancelModalOpen} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Konfirmasi Pembatalan</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin membatalkan penilaian untuk peserta ini?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsCancelModalOpen(false)}>
              Tidak
            </Button>
            <Button color="danger" variant="shadow" onPress={handleConfirmCancel}>
              Ya, Batalkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}