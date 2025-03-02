import {
  addToast,
  Button,
  Card,
  CardBody,
  cn,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { Formik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import ActionPesertaTopbar from "@/components/action-peserta-topbar";
import EmptyState from "@/components/empty-state";
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkademikKediriCard from "@/components/riwayat-akademik-kediri-card";
import { useAuth } from "@/hooks/use-auth";
import { useKediri } from "@/hooks/use-kediri";
import { usePeserta } from "@/hooks/use-peserta";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  nilai_makna: Yup.string().required("Nilai makna harus dipilih."),
  nilai_keterangan: Yup.string().required("Nilai keterangan harus dipilih."),
  nilai_penjelasan: Yup.string().required("Nilai penjelasan harus dipilih."),
  nilai_pemahaman: Yup.string().required("Nilai pemahaman harus dipilih."),
  catatanPenguji: Yup.string(), // Optional field
});

export default function PenilaianAkademikKediriPage() {
  const { user } = useAuth();
  const { storeAkademikKediri } = useKediri();
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
      navigate("/peserta-kediri?action=penilaian-akademik", { replace: true });
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
              nilai_makna: String(akademikEntry.nilai_makna),
              nilai_keterangan: String(akademikEntry.nilai_keterangan),
              nilai_penjelasan: String(akademikEntry.nilai_penjelasan),
              nilai_pemahaman: String(akademikEntry.nilai_pemahaman),
              catatan: akademikEntry.catatan,
            }
          );
        }
      }

      return (
        existingForm || {
          tes_santri_id: peserta.id,
          nilai_makna: "",
          nilai_keterangan: "",
          nilai_penjelasan: "",
          nilai_pemahaman: "",
          catatan: "",
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
      navigate("/peserta-kediri?action=penilaian-akademik", { replace: true });

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
                    const formValueToStore = formValues[activePesertaIndex];
                    const storedForm = await storeAkademikKediri(
                      formValueToStore.tes_santri_id,
                      formValueToStore.nilai_makna,
                      formValueToStore.nilai_keterangan,
                      formValueToStore.nilai_penjelasan,
                      formValueToStore.nilai_pemahaman,
                      formValueToStore.catatan,
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
                        <RadioGroup
                          classNames={{
                            wrapper: "flex w-full justify-between px-4",
                          }}
                          color="primary"
                          defaultValue={values.nilai_makna}
                          errorMessage={errors.nilai_makna}
                          isDisabled={loading}
                          isInvalid={!!errors.nilai_makna}
                          label="Nilai Makna"
                          orientation="horizontal"
                          value={values.nilai_makna}
                          onValueChange={(value) => {
                            setFieldValue("nilai_makna", value);
                            setFormValues((prevValues) => {
                              const updatedValues = [...prevValues];

                              updatedValues[activePesertaIndex] = {
                                ...updatedValues[activePesertaIndex],
                                nilai_makna: value,
                              };

                              return updatedValues;
                            });
                          }}
                        >
                          <Radio value="60">60</Radio>
                          <Radio value="70">70</Radio>
                          <Radio value="80">80</Radio>
                          <Radio value="90">90</Radio>
                        </RadioGroup>

                        <RadioGroup
                          classNames={{
                            wrapper: "flex w-full justify-between px-4",
                          }}
                          color="primary"
                          defaultValue={values.nilai_keterangan}
                          errorMessage={errors.nilai_keterangan}
                          isDisabled={loading}
                          isInvalid={!!errors.nilai_keterangan}
                          label="Nilai Keterangan"
                          orientation="horizontal"
                          value={values.nilai_keterangan}
                          onValueChange={(value) => {
                            setFieldValue("nilai_keterangan", value);
                            setFormValues((prevValues) => {
                              const updatedValues = [...prevValues];

                              updatedValues[activePesertaIndex] = {
                                ...updatedValues[activePesertaIndex],
                                nilai_keterangan: value,
                              };

                              return updatedValues;
                            });
                          }}
                        >
                          <Radio value="60">60</Radio>
                          <Radio value="70">70</Radio>
                          <Radio value="80">80</Radio>
                          <Radio value="90">90</Radio>
                        </RadioGroup>

                        <RadioGroup
                          classNames={{
                            wrapper: "flex w-full justify-between px-4",
                          }}
                          color="primary"
                          defaultValue={values.nilai_penjelasan}
                          errorMessage={errors.nilai_penjelasan}
                          isDisabled={loading}
                          isInvalid={!!errors.nilai_penjelasan}
                          label="Nilai Penjelasan"
                          orientation="horizontal"
                          value={values.nilai_penjelasan}
                          onValueChange={(value) => {
                            setFieldValue("nilai_penjelasan", value);
                            setFormValues((prevValues) => {
                              const updatedValues = [...prevValues];

                              updatedValues[activePesertaIndex] = {
                                ...updatedValues[activePesertaIndex],
                                nilai_penjelasan: value,
                              };

                              return updatedValues;
                            });
                          }}
                        >
                          <Radio value="60">60</Radio>
                          <Radio value="70">70</Radio>
                          <Radio value="80">80</Radio>
                          <Radio value="90">90</Radio>
                        </RadioGroup>

                        <RadioGroup
                          classNames={{
                            wrapper: "flex w-full justify-between px-4",
                          }}
                          color="primary"
                          defaultValue={values.nilai_pemahaman}
                          errorMessage={errors.nilai_pemahaman}
                          isDisabled={loading}
                          isInvalid={!!errors.nilai_pemahaman}
                          label="Nilai Pemahaman"
                          orientation="horizontal"
                          value={values.nilai_pemahaman}
                          onValueChange={(value) => {
                            setFieldValue("nilai_pemahaman", value);
                            setFormValues((prevValues) => {
                              const updatedValues = [...prevValues];

                              updatedValues[activePesertaIndex] = {
                                ...updatedValues[activePesertaIndex],
                                nilai_pemahaman: value,
                              };

                              return updatedValues;
                            });
                          }}
                        >
                          <Radio value="60">60</Radio>
                          <Radio value="70">70</Radio>
                          <Radio value="80">80</Radio>
                          <Radio value="90">90</Radio>
                        </RadioGroup>

                        <Textarea
                          multiline
                          errorMessage={errors.catatan}
                          isDisabled={loading}
                          isInvalid={errors.catatan && touched.catatan}
                          label="Catatan Penguji"
                          mode="outlined"
                          numberOfLines={4}
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
                      </div>
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
                        <RiwayatAkademikKediriCard
                          key={akademik.id}
                          akademik={akademik}
                        />
                      ),
                    )}
                    {selectedPeserta[activePesertaIndex].akademik.length ==
                      0 && <EmptyState />}
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
