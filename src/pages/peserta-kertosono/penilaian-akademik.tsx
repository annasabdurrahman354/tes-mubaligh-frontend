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
} from "@heroui/react";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import ActionPesertaTopbar from "@/components/action-peserta-topbar";
import { CustomRadio } from "@/components/custom-radio";
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkademikKertosonoCard from "@/components/riwayat-akademik-kertosono-card";
import Timer from "@/components/timer";
import { useAuth } from "@/hooks/use-auth";
import { useKertosono } from "@/hooks/use-kertosono";
import { usePeserta } from "@/hooks/use-peserta";

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
          return false; // Trigger validation error
        }
      }

      return true; // Validation passes
    },
  ),
});

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

  // Redirect immediately if selectedPeserta is empty or null
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      navigate("/peserta-kertosono?action=penilaian-akademik", {
        replace: true,
      });
    }
  }, [selectedPeserta, navigate]);

  useEffect(() => {
    const updatedFormValues = selectedPeserta.map((peserta) => {
      const existingForm = formValues.find(
        (form) => form.tes_santri_id === peserta.id,
      );

      if (peserta.telah_disimak) {
        // Check if the peserta has a matching akademik entry for the guru_id
        const akademikEntry = peserta.akademik?.find(
          (akademik) => akademik.guru_id == user?.id,
        );

        if (akademikEntry) {
          // Pre-fill the form with data from akademikEntry
          return (
            existingForm || {
              tes_santri_id: peserta.id,
              penilaian: akademikEntry.penilaian || "",
              kekurangan_tajwid: akademikEntry.kekurangan_tajwid || [],
              kekurangan_khusus: akademikEntry.kekurangan_khusus || [],
              kekurangan_keserasian: akademikEntry.kekurangan_keserasian || [],
              kekurangan_kelancaran: akademikEntry.kekurangan_kelancaran || [],
              catatan: akademikEntry.catatan || "",
              rekomendasi_penarikan:
                akademikEntry.rekomendasi_penarikan || false,
              awal_penilaian: akademikEntry.durasi_penilaian
                ? new Date(Date.now() - akademikEntry.durasi_penilaian * 60000)
                : new Date(),
              akhir_penilaian: null,
              durasi_penilaian: akademikEntry.durasi_penilaian,
            }
          );
        }
      }

      // Default to existingForm or a blank form for this peserta
      return (
        existingForm || {
          tes_santri_id: peserta.id,
          penilaian: "",
          kekurangan_tajwid: [],
          kekurangan_khusus: [],
          kekurangan_keserasian: [],
          kekurangan_kelancaran: [],
          catatan: "",
          rekomendasi_penarikan: false,
          awal_penilaian: new Date(Date.now()),
          akhir_penilaian: null,
          durasi_penilaian: null,
        }
      );
    });

    setFormValues(updatedFormValues);
  }, [selectedPeserta]);

  // Don't render anything if redirecting
  if (!selectedPeserta || selectedPeserta.length === 0) {
    return null;
  }

  const handleRemovePeserta = (indexToRemove) => {
    // Save a reference to the peserta to remove
    const pesertaToRemove = selectedPeserta[indexToRemove];

    // Check if this is the last peserta
    if (selectedPeserta.length === 1) {
      // First toggle the selection to empty the array
      toggleSelectedPeserta(pesertaToRemove);
      // Then navigate - this ensures the array is updated before navigation
      navigate("/peserta-kertosono?action=penilaian-akademik", {
        replace: true,
      });

      return; // Important: Return immediately to prevent further processing
    }

    // Handle non-last item cases
    if (activePesertaIndex === selectedPeserta.length - 1) {
      setActivePesertaIndex(activePesertaIndex - 1);
    }

    // Remove the peserta
    toggleSelectedPeserta(pesertaToRemove);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter relative">
      <ActionPesertaTopbar />
      <main className="container flex flex-col flex-grow mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 gap-4">
        <PesertaProfileCard peserta={selectedPeserta[activePesertaIndex]} />
        <div className="flex flex-col">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            color="primary"
            selectedKey={tab}
            size="md"
            variant="bordered"
            onSelectionChange={setTab}
          >
            <Tab key="penilaian" title="Form Penilaian">
              <Formik
                enableReinitialize // Allows reinitialization when `initialValues` change
                initialValues={formValues[activePesertaIndex] || {}}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  try {
                    // Call the API to store the form data
                    setLoading(true);

                    const akhirPenilaian = Date.now(); // Current timestamp
                    const awalPenilaian =
                      formValues[activePesertaIndex]?.awal_penilaian ||
                      akhirPenilaian;

                    // Calculate durasi_penilaian in minutes and round
                    const durasiPenilaianMinutes = formValues[
                      activePesertaIndex
                    ]?.durasi_penilaian
                      ? formValues[activePesertaIndex]?.durasi_penilaian
                      : Math.round((akhirPenilaian - awalPenilaian) / 60000);

                    // Update the active form values with `akhir_penilaian` and `durasi_penilaian`
                    const updatedFormValues = {
                      ...formValues[activePesertaIndex],
                      akhir_penilaian: akhirPenilaian,
                      durasi_penilaian: durasiPenilaianMinutes,
                    };

                    setFormValues((prevValues) => {
                      const newValues = [...prevValues];

                      newValues[activePesertaIndex] = updatedFormValues;

                      return newValues;
                    });

                    // Store the updated form values via API
                    const storedForm = await storeAkademikKertosono(
                      updatedFormValues.tes_santri_id,
                      updatedFormValues.penilaian,
                      updatedFormValues.penilaian == "Lulus"
                        ? null
                        : updatedFormValues.kekurangan_tajwid,
                      updatedFormValues.penilaian == "Lulus"
                        ? null
                        : updatedFormValues.kekurangan_khusus,
                      updatedFormValues.penilaian == "Lulus"
                        ? null
                        : updatedFormValues.kekurangan_keserasian,
                      updatedFormValues.penilaian == "Lulus"
                        ? null
                        : updatedFormValues.kekurangan_kelancaran,
                      updatedFormValues.catatan,
                      updatedFormValues.rekomendasi_penarikan == "Tidak Lulus"
                        ? null
                        : updatedFormValues.rekomendasi_penarikan,
                      updatedFormValues.durasi_penilaian,
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
                    if (error instanceof Error) {
                      addToast({
                        title: "Terjadi Kesalahan!",
                        description: error.message,
                        timeout: 3000,
                        variant: "flat",
                        color: "danger",
                        shouldShowTimeoutProgess: true,
                      });
                    }
                  }
                  setLoading(false);
                }}
              >
                {({ values, handleSubmit, setFieldValue, errors, touched }) => (
                  <Card
                    fullWidth
                    className={cn(
                      `border-small dark:border-small border-default-100`,
                    )}
                  >
                    <CardBody className="overflow-hidden">
                      <div className="flex flex-col gap-6 p-2">
                        {values.awal_penilaian ? (
                          <Timer
                            className="absolute top-2 right-2"
                            datetimeOrMinutes={values.awal_penilaian}
                          />
                        ) : null}
                        <RadioGroup
                          isRequired
                          classNames={{
                            wrapper: "w-full flex flex-row gap-6 mt-2 mb-3",
                          }}
                          errorMessage={errors.penilaian}
                          isDisabled={loading}
                          isInvalid={!!errors.penilaian}
                          label="Nilai Bacaan"
                          value={values.penilaian}
                          onValueChange={(value) => {
                            setFieldValue("penilaian", value);
                            setFormValues((prevValues) => {
                              const updatedValues = [...prevValues];

                              updatedValues[activePesertaIndex] = {
                                ...updatedValues[activePesertaIndex],
                                penilaian: value,
                              };

                              return updatedValues;
                            });
                          }}
                        >
                          <CustomRadio buttonColor="success" value="Lulus">
                            Lulus
                          </CustomRadio>
                          <CustomRadio buttonColor="danger" value="Tidak Lulus">
                            Tidak Lulus
                          </CustomRadio>
                        </RadioGroup>
                        {values.penilaian === "Tidak Lulus" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <CheckboxGroup
                              color="danger"
                              isDisabled={loading}
                              label="Kekurangan Tajwid"
                              value={values.kekurangan_tajwid}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_tajwid", value);
                                setFormValues((prevValues) => {
                                  const updatedValues = [...prevValues];

                                  updatedValues[activePesertaIndex] = {
                                    ...updatedValues[activePesertaIndex],
                                    kekurangan_tajwid: value,
                                  };

                                  return updatedValues;
                                });
                              }}
                            >
                              <Checkbox value="Dengung">Dengung</Checkbox>
                              <Checkbox value="Mad">Mad</Checkbox>
                              <Checkbox value="Makhraj">Makhraj</Checkbox>
                              <Checkbox value="Tafkhim-Tarqiq">
                                Tafkhim-Tarqiq
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              color="danger"
                              isDisabled={loading}
                              label="Kekurangan Khusus"
                              value={values.kekurangan_khusus}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_khusus", value);
                                setFormValues((prevValues) => {
                                  const updatedValues = [...prevValues];

                                  updatedValues[activePesertaIndex] = {
                                    ...updatedValues[activePesertaIndex],
                                    kekurangan_khusus: value,
                                  };

                                  return updatedValues;
                                });
                              }}
                            >
                              <Checkbox value="Harakat">Harakat</Checkbox>
                              <Checkbox value="Lafadz">Lafadz</Checkbox>
                              <Checkbox value="Lam Jalalah">
                                Lam Jalalah
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              color="danger"
                              isDisabled={loading}
                              label="Kekurangan Keserasian"
                              value={values.kekurangan_keserasian}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_keserasian", value);
                                setFormValues((prevValues) => {
                                  const updatedValues = [...prevValues];

                                  updatedValues[activePesertaIndex] = {
                                    ...updatedValues[activePesertaIndex],
                                    kekurangan_keserasian: value,
                                  };

                                  return updatedValues;
                                });
                              }}
                            >
                              <Checkbox value="Panjang Pendek">
                                Panjang Pendek
                              </Checkbox>
                              <Checkbox value="Ikhtilash Huruf Sukun">
                                Ikhtilash Huruf Sukun
                              </Checkbox>
                              <Checkbox value="Ikhtilash Huruf Syiddah">
                                Ikhtilash Huruf Syiddah
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              color="danger"
                              isDisabled={loading}
                              label="Kekurangan Kelancaran"
                              value={values.kekurangan_kelancaran}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_kelancaran", value);
                                setFormValues((prevValues) => {
                                  const updatedValues = [...prevValues];

                                  updatedValues[activePesertaIndex] = {
                                    ...updatedValues[activePesertaIndex],
                                    kekurangan_kelancaran: value,
                                  };

                                  return updatedValues;
                                });
                              }}
                            >
                              <Checkbox value="Kecepatan">Kecepatan</Checkbox>
                              <Checkbox value="Ketartilan">Ketartilan</Checkbox>
                            </CheckboxGroup>
                          </div>
                        )}
                        {errors.kekurangan && (
                          <p className="text-danger-500 text-medium items-start">
                            {errors.kekurangan}
                          </p>
                        )}
                      </div>
                      {values.penilaian === "Lulus" && (
                        <Checkbox
                          className="mt-2 mx-0.5"
                          isDisabled={loading}
                          isSelected={values.rekomendasi_penarikan}
                          onValueChange={(value) => {
                            setFieldValue("catatan", value);
                            setFormValues((prevValues) => {
                              const updatedValues = [...prevValues];

                              updatedValues[activePesertaIndex] = {
                                ...updatedValues[activePesertaIndex],
                                rekomendasi_penarikan: value,
                              };

                              return updatedValues;
                            });
                          }}
                        >
                          Rekomendasi Penarikan
                        </Checkbox>
                      )}
                      <Textarea
                        isMultiline
                        className="w-full mt-4 px-2"
                        isDisabled={loading}
                        label="Catatan"
                        placeholder="Tuliskan catatan penilaian"
                        value={values.catatan}
                        onValueChange={(text) => {
                          setFieldValue("catatan", text);
                          setFormValues((prevValues) => {
                            const updatedValues = [...prevValues];

                            updatedValues[activePesertaIndex] = {
                              ...updatedValues[activePesertaIndex],
                              catatan: text,
                            };

                            return updatedValues;
                          });
                        }}
                      />
                      <div className="flex flex-row justify-end mt-6 gap-4 p-2">
                        <Button
                          color="danger"
                          disabled={loading}
                          variant="flat"
                          onPress={() =>
                            handleRemovePeserta(activePesertaIndex)
                          }
                        >
                          Batal
                        </Button>
                        <Button
                          color="primary"
                          disabled={loading}
                          isLoading={loading}
                          variant="shadow"
                          onPress={() => handleSubmit()}
                        >
                          Simpan
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </Formik>
            </Tab>
            <Tab key="riwayat" title="Riwayat">
              <Card
                fullWidth
                className={cn(
                  `border-small dark:border-small border-default-100`,
                )}
              >
                <CardBody className="overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {selectedPeserta[activePesertaIndex].akademik.map(
                      (akademik) => (
                        <RiwayatAkademikKertosonoCard
                          key={akademik.id}
                          akademik={akademik}
                        />
                      ),
                    )}
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </main>
      <PesertaRFIDScanner />
    </div>
  );
}
