import {
  addToast,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  cn,
  Radio,
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
import EmptyState from "@/components/empty-state";
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkademikKediriCard from "@/components/riwayat-akademik-kediri-card";
import Timer from "@/components/timer";
import { useAuth } from "@/hooks/use-auth";
import { useKediri } from "@/hooks/use-kediri";
import { usePeserta } from "@/hooks/use-peserta";
import { SelectOption } from "@/types";
import api, { handleApiError } from "@/libs/axios";

// --- Constants for Deficiency Options ---
const KEKURANGAN_MAKNA_OPTIONS: SelectOption[] = [
  { label: 'Kefasihan Pelafalan', value: 'Kefasihan Pelafalan' },
  { label: 'Kesesuaian Makna', value: 'Kesesuaian Makna' },
  { label: 'Nahwu Shorof', value: 'Nahwu Shorof' },
];

const KEKURANGAN_PEMAHAMAN_OPTIONS: SelectOption[] = [
  { label: 'Kemampuan Menyimpulkan', value: 'Kemampuan Menyimpulkan' },
  { label: 'Pemahaman Implementasi', value: 'Pemahaman Implementasi' },
];

const KEKURANGAN_PENJELASAN_OPTIONS: SelectOption[] = [
  { label: 'Kemampuan Menjelaskan', value: 'Kemampuan Menjelaskan' },
];

const KEKURANGAN_KETERANGAN_OPTIONS: SelectOption[] = [
  { label: 'Kesesuaian Keterangan', value: 'Kesesuaian Keterangan' },
  { label: 'Penyusunan Kalimat', value: 'Penyusunan Kalimat' },
];
// ----------------------------------------

// Validation schema
const validationSchema = Yup.object().shape({
  nilai_makna: Yup.string().required("Nilai makna harus dipilih."),
  nilai_keterangan: Yup.string().required("Nilai keterangan harus dipilih."),
  nilai_penjelasan: Yup.string().required("Nilai penjelasan harus dipilih."),
  nilai_pemahaman: Yup.string().required("Nilai pemahaman harus dipilih."),

  kekurangan_makna: Yup.mixed().test(
    "required-if-60-makna",
    "Kekurangan makna harus dipilih jika nilai 60.",
    function (value) {
      const { nilai_makna } = this.parent;
      if (nilai_makna === "60") {
        return Array.isArray(value) && value.length > 0;
      }
      return true;
    }
  ),
  kekurangan_keterangan: Yup.mixed().test(
    "required-if-60-keterangan",
    "Kekurangan keterangan harus dipilih jika nilai 60.",
    function (value) {
      const { nilai_keterangan } = this.parent;
      if (nilai_keterangan === "60") {
        return Array.isArray(value) && value.length > 0;
      }
      return true;
    }
  ),
  kekurangan_penjelasan: Yup.mixed().test(
    "required-if-60-penjelasan",
    "Kekurangan penjelasan harus dipilih jika nilai 60.",
    function (value) {
      const { nilai_penjelasan } = this.parent;
      if (nilai_penjelasan === "60") {
        return Array.isArray(value) && value.length > 0;
      }
      return true;
    }
  ),
  kekurangan_pemahaman: Yup.mixed().test(
    "required-if-60-pemahaman",
    "Kekurangan pemahaman harus dipilih jika nilai 60.",
    function (value) {
      const { nilai_pemahaman } = this.parent;
      if (nilai_pemahaman === "60") {
        return Array.isArray(value) && value.length > 0;
      }
      return true;
    }
  ),

  catatan: Yup.string(),
});

// Helper function to safely get initial duration number
const getInitialDuration = (duration) => {
  const num = Number(duration);
  return isNaN(num) ? 0 : num;
}

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
  const [guruPenggantiOptions, setGuruPenggantiOptions] = useState<SelectOption[]>([]);

  // --- State for cancel confirmation modal ---
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  // ------------------------------------------

  const getGuruPenggantiKediriOptions = useCallback(async (): Promise<SelectOption[]> => {
    console.log("Fetching guru pengganti options...");
    try {
      const response = await api.get(`options/guru-pengganti-kediri/${user?.id}`);
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
      getGuruPenggantiKediriOptions().then(setGuruPenggantiOptions);
    }
  }, [getGuruPenggantiKediriOptions, user?.id]);

  // Redirect effect (remains the same)
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      navigate("/peserta-kediri?action=penilaian-akademik", { replace: true });
    }
  }, [selectedPeserta, navigate]);

  // Effect to initialize form values, calculating 'awal_penilaian' for continuous timer effect
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      return;
    }

    const updatedFormValues = selectedPeserta.map((peserta) => {
      const existingForm = formValues.find(
        (form) => form.tes_santri_id === peserta.id,
      );

      // If form state for this participant already exists *and* has an awal_penilaian,
      // reuse it. This prevents recalculating the fake start time unnecessarily
      // when navigating between tabs or causing minor re-renders.
      if (existingForm && existingForm.awal_penilaian) {
        return existingForm;
      }

      // --- Start Calculation Logic ---
      let calculated_awal_penilaian = new Date(Date.now()); // Default to now (for new assessments)
      let current_total_duration = null; // Stays null for new, holds loaded duration for existing

      const akademikEntry = peserta.telah_disimak
        ? peserta.akademik?.find((akademik) => akademik.guru_id == user?.id)
        : null;

      if (akademikEntry) {
        const loadedDuration = getInitialDuration(akademikEntry.durasi_penilaian);
        current_total_duration = loadedDuration; // Store the loaded duration
        // Calculate the fake start time in the past
        calculated_awal_penilaian = new Date(Date.now() - loadedDuration * 60000);
      }
      // --- End Calculation Logic ---

      // --- Construct Initial Data ---
      const initialData = {
        tes_santri_id: peserta.id,
        nilai_makna: akademikEntry ? String(akademikEntry.nilai_makna || "") : "",
        nilai_keterangan: akademikEntry ? String(akademikEntry.nilai_keterangan || "") : "",
        nilai_penjelasan: akademikEntry ? String(akademikEntry.nilai_penjelasan || "") : "",
        nilai_pemahaman: akademikEntry ? String(akademikEntry.nilai_pemahaman || "") : "",
        kekurangan_makna: akademikEntry ? akademikEntry.kekurangan_makna || [] : [],
        kekurangan_keterangan: akademikEntry ? akademikEntry.kekurangan_keterangan || [] : [],
        kekurangan_penjelasan: akademikEntry ? akademikEntry.kekurangan_penjelasan || [] : [],
        kekurangan_pemahaman: akademikEntry ? akademikEntry.kekurangan_pemahaman || [] : [],
        guru_pengganti: akademikEntry ? akademikEntry.guru_pengganti || null : null,
        catatan: akademikEntry ? akademikEntry.catatan || "" : "",
        awal_penilaian: calculated_awal_penilaian, // Use the calculated start time
        durasi_penilaian: current_total_duration, // Store latest known total duration
        // No 'original_durasi_penilaian' needed in this approach
      };
      // --- End Construct Initial Data ---

      // If existingForm exists but didn't have awal_penilaian (e.g., from previous session/different logic),
      // merge non-timer fields, but prioritize the newly calculated timer fields.
      if (existingForm && !existingForm.awal_penilaian) {
        return {
          ...initialData, // Use fresh timer fields (awal_penilaian, durasi_penilaian)
          // Keep other fields from existingForm if they exist, otherwise use initialData's
          tes_santri_id: existingForm.tes_santri_id || initialData.tes_santri_id,
          nilai_makna: existingForm.nilai_makna || initialData.nilai_makna,
          nilai_keterangan: existingForm.nilai_keterangan || initialData.nilai_keterangan,
          nilai_penjelasan: existingForm.nilai_penjelasan || initialData.nilai_penjelasan,
          nilai_pemahaman: existingForm.nilai_pemahaman || initialData.nilai_pemahaman,
          kekurangan_makna: existingForm.kekurangan_makna || initialData.kekurangan_makna,
          kekurangan_keterangan: existingForm.kekurangan_keterangan || initialData.kekurangan_keterangan,
          kekurangan_penjelasan: existingForm.kekurangan_penjelasan || initialData.kekurangan_penjelasan,
          kekurangan_pemahaman: existingForm.kekurangan_pemahaman || initialData.kekurangan_pemahaman,
          guru_pengganti: existingForm.guru_pengganti || initialData.guru_pengganti,
          catatan: existingForm.catatan || initialData.catatan,
        };
      }

      return initialData; // Return the fully constructed initial data
    });

    setFormValues(updatedFormValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeserta, user?.id]); // Dependencies: run when participants change or user changes

  // Don't render if redirecting (remains the same)
  if (!selectedPeserta || selectedPeserta.length === 0) {
    return null;
  }

  // handleRemovePeserta (remains the same)
  const handleRemovePeserta = (indexToRemove) => {
    const pesertaToRemove = selectedPeserta[indexToRemove];
    if (selectedPeserta.length === 1) {
      toggleSelectedPeserta(pesertaToRemove);
      navigate("/peserta-kediri?action=penilaian-akademik", { replace: true });
      return;
    }
    if (activePesertaIndex === selectedPeserta.length - 1) {
      setActivePesertaIndex(activePesertaIndex - 1);
    }
    toggleSelectedPeserta(pesertaToRemove);
  };

  // --- Handler for confirming cancellation ---
  const handleConfirmCancel = () => {
    handleRemovePeserta(activePesertaIndex);
    setIsCancelModalOpen(false); // Close modal after confirming
  };
  // ----------------------------------------

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter relative">
      <ActionPesertaTopbar />
      <main className="container flex flex-col flex-grow mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 gap-4">
        {selectedPeserta[activePesertaIndex] && (
          <PesertaProfileCard peserta={selectedPeserta[activePesertaIndex]} />
        )}
        <div className="flex flex-col">
          <Tabs
            fullWidth aria-label="Tabs form" color="primary" selectedKey={tab} size="md" variant="bordered"
            onSelectionChange={(key) => setTab(String(key))}
          >
            <Tab key="penilaian" title="Form Penilaian">
              {formValues[activePesertaIndex] ? (
                <Formik
                  enableReinitialize
                  initialValues={formValues[activePesertaIndex]}
                  validationSchema={validationSchema}
                  onSubmit={async (/* values */) => {
                    try {
                      setLoading(true);
                      const currentFormState = formValues[activePesertaIndex];

                      // Get the calculated start time used by the timer
                      const timerStartTime = currentFormState?.awal_penilaian?.getTime();

                      if (!timerStartTime) {
                        // Handle case where start time is somehow missing
                        throw new Error("Assessment start time is missing.");
                      }

                      // Calculate the TOTAL duration based on the timer's start time and now
                      const totalDurasiMenit = Math.round(
                        (Date.now() - timerStartTime) / 60000,
                      );

                      // Prepare the payload with the calculated total duration
                      const updatedFormValuesPayload = {
                        ...currentFormState,
                        durasi_penilaian: totalDurasiMenit, // This IS the total accumulated time
                      };

                      // Update the central formValues state (primarily useful if NOT removing participant immediately)
                      setFormValues((prevValues) => {
                        const newValues = [...prevValues];
                        if (newValues[activePesertaIndex]) {
                          // Update with the final calculated total duration.
                          // The awal_penilaian doesn't strictly need updating here
                          // because the participant is removed right after.
                          newValues[activePesertaIndex] = {
                            ...newValues[activePesertaIndex],
                            durasi_penilaian: totalDurasiMenit,
                          };
                        }
                        return newValues;
                      });

                      // Call the API with the final accumulated duration - updated to include guru_pengganti
                      const storedForm = await storeAkademikKediri(
                        updatedFormValuesPayload.tes_santri_id,
                        updatedFormValuesPayload.nilai_makna,
                        updatedFormValuesPayload.nilai_keterangan,
                        updatedFormValuesPayload.nilai_penjelasan,
                        updatedFormValuesPayload.nilai_pemahaman,
                        updatedFormValuesPayload.nilai_makna === "60" ? updatedFormValuesPayload.kekurangan_makna : null,
                        updatedFormValuesPayload.nilai_keterangan === "60" ? updatedFormValuesPayload.kekurangan_keterangan : null,
                        updatedFormValuesPayload.nilai_penjelasan === "60" ? updatedFormValuesPayload.kekurangan_penjelasan : null,
                        updatedFormValuesPayload.nilai_pemahaman === "60" ? updatedFormValuesPayload.kekurangan_pemahaman : null,
                        updatedFormValuesPayload.guru_pengganti,
                        updatedFormValuesPayload.catatan,
                        updatedFormValuesPayload.durasi_penilaian, // Send the final total
                      );

                      addToast({
                        title: "Yeayy!", description: storedForm.message, timeout: 3000,
                        variant: "flat", color: "success", shouldShowTimeoutProgess: true,
                      });
                      console.log("Form stored successfully:", storedForm);
                      handleRemovePeserta(activePesertaIndex);
                      window.scrollTo(0, 0);

                    } catch (error) {
                      addToast({
                        title: "Terjadi Kesalahan!",
                        description: error instanceof Error ? error.message : String(error),
                        timeout: 3000,
                        variant: "flat", color: "danger", shouldShowTimeoutProgess: true,
                      });
                      console.error("Error storing form:", error);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {({ values, handleSubmit, setFieldValue, errors, touched }) => (
                    <Card fullWidth className={cn(`border-small dark:border-small border-default-100 relative`,)} >
                      <CardBody className="overflow-hidden">
                        {/* Timer now displays the 'continuous' total time */}
                        {values.awal_penilaian ? (
                          <Timer
                            className="absolute top-2 right-2"
                            datetimeOrMinutes={values.awal_penilaian}
                          />
                        ) : null}

                        {/* Add padding top to avoid overlap */}
                        <div className="flex flex-col gap-6 p-2 pt-8">
                          {/* RadioGroups and Textarea */}
                          {/* Ensure onValueChange updates central state */}
                          <RadioGroup /* Nilai Makna */
                            classNames={{ wrapper: "flex w-full justify-between px-4", }} color="primary"
                            errorMessage={errors.nilai_makna} isDisabled={loading}
                            isInvalid={!!errors.nilai_makna && !!touched.nilai_makna} isRequired
                            label="Nilai Makna" orientation="horizontal" value={values.nilai_makna}
                            onValueChange={(value) => {
                              setFieldValue("nilai_makna", value);
                              setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], nilai_makna: value, }; } return newValues; });
                            }} >
                            <Radio value="60">60</Radio><Radio value="70">70</Radio><Radio value="80">80</Radio><Radio value="90">90</Radio>
                          </RadioGroup>

                          {values.nilai_makna === "60" && (
                            <CheckboxGroup
                              color="danger" isDisabled={loading} label="Kekurangan Makna (Wajib)"
                              value={values.kekurangan_makna}
                              className="px-4"
                              isInvalid={!!errors.kekurangan_makna && !!touched.kekurangan_makna}
                              errorMessage={errors.kekurangan_makna ? String(errors.kekurangan_makna) : undefined}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_makna", value);
                                setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_makna: value }; } return newValues; });
                              }}
                            >
                              {KEKURANGAN_MAKNA_OPTIONS.map((option) => (
                                <Checkbox key={String(option.value)} value={String(option.value)}>
                                  {option.label}
                                </Checkbox>
                              ))}
                            </CheckboxGroup>
                          )}

                          <RadioGroup /* Nilai Keterangan */
                            classNames={{ wrapper: "flex w-full justify-between px-4", }} color="primary"
                            errorMessage={errors.nilai_keterangan} isDisabled={loading}
                            isInvalid={!!errors.nilai_keterangan && !!touched.nilai_keterangan} isRequired
                            label="Nilai Keterangan" orientation="horizontal" value={values.nilai_keterangan}
                            onValueChange={(value) => {
                              setFieldValue("nilai_keterangan", value);
                              setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], nilai_keterangan: value, }; } return newValues; });
                            }} >
                            <Radio value="60">60</Radio><Radio value="70">70</Radio><Radio value="80">80</Radio><Radio value="90">90</Radio>
                          </RadioGroup>

                          {values.nilai_keterangan === "60" && (
                            <CheckboxGroup
                              color="danger" isDisabled={loading} label="Kekurangan Keterangan (Wajib)"
                              value={values.kekurangan_keterangan}
                              className="px-4"
                              isInvalid={!!errors.kekurangan_keterangan && !!touched.kekurangan_keterangan}
                              errorMessage={errors.kekurangan_keterangan ? String(errors.kekurangan_keterangan) : undefined}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_keterangan", value);
                                setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_keterangan: value }; } return newValues; });
                              }}
                            >
                              {KEKURANGAN_KETERANGAN_OPTIONS.map((option) => (
                                <Checkbox key={String(option.value)} value={String(option.value)}>
                                  {option.label}
                                </Checkbox>
                              ))}
                            </CheckboxGroup>
                          )}

                          <RadioGroup /* Nilai Penjelasan */
                            classNames={{ wrapper: "flex w-full justify-between px-4", }} color="primary"
                            errorMessage={errors.nilai_penjelasan} isDisabled={loading}
                            isInvalid={!!errors.nilai_penjelasan && !!touched.nilai_penjelasan} isRequired
                            label="Nilai Penjelasan" orientation="horizontal" value={values.nilai_penjelasan}
                            onValueChange={(value) => {
                              setFieldValue("nilai_penjelasan", value);
                              setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], nilai_penjelasan: value, }; } return newValues; });
                            }} >
                            <Radio value="60">60</Radio><Radio value="70">70</Radio><Radio value="80">80</Radio><Radio value="90">90</Radio>
                          </RadioGroup>

                          {values.nilai_penjelasan === "60" && (
                            <CheckboxGroup
                              color="danger" isDisabled={loading} label="Kekurangan Penjelasan (Wajib)"
                              value={values.kekurangan_penjelasan}
                              className="px-4"
                              isInvalid={!!errors.kekurangan_penjelasan && !!touched.kekurangan_penjelasan}
                              errorMessage={errors.kekurangan_penjelasan ? String(errors.kekurangan_penjelasan) : undefined}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_penjelasan", value);
                                setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_penjelasan: value }; } return newValues; });
                              }}
                            >
                              {KEKURANGAN_PENJELASAN_OPTIONS.map((option) => (
                                <Checkbox key={String(option.value)} value={String(option.value)}>
                                  {option.label}
                                </Checkbox>
                              ))}
                            </CheckboxGroup>
                          )}

                          <RadioGroup /* Nilai Pemahaman */
                            classNames={{ wrapper: "flex w-full justify-between px-4", }} color="primary"
                            errorMessage={errors.nilai_pemahaman} isDisabled={loading}
                            isInvalid={!!errors.nilai_pemahaman && !!touched.nilai_pemahaman} isRequired
                            label="Nilai Pemahaman" orientation="horizontal" value={values.nilai_pemahaman}
                            onValueChange={(value) => {
                              setFieldValue("nilai_pemahaman", value);
                              setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], nilai_pemahaman: value, }; } return newValues; });
                            }} >
                            <Radio value="60">60</Radio><Radio value="70">70</Radio><Radio value="80">80</Radio><Radio value="90">90</Radio>
                          </RadioGroup>

                          {values.nilai_pemahaman === "60" && (
                            <CheckboxGroup
                              color="danger" isDisabled={loading} label="Kekurangan Pemahaman (Wajib)"
                              value={values.kekurangan_pemahaman}
                              className="px-4"
                              isInvalid={!!errors.kekurangan_pemahaman && !!touched.kekurangan_pemahaman}
                              errorMessage={errors.kekurangan_pemahaman ? String(errors.kekurangan_pemahaman) : undefined}
                              onValueChange={(value) => {
                                setFieldValue("kekurangan_pemahaman", value);
                                setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], kekurangan_pemahaman: value }; } return newValues; });
                              }}
                            >
                              {KEKURANGAN_PEMAHAMAN_OPTIONS.map((option) => (
                                <Checkbox key={String(option.value)} value={String(option.value)}>
                                  {option.label}
                                </Checkbox>
                              ))}
                            </CheckboxGroup>
                          )}


                          <Textarea /* Catatan */
                            isDisabled={loading} label="Catatan Penguji" minRows={4}
                            placeholder="Tuliskan catatan penilaian" value={values.catatan}
                            onValueChange={(text) => {
                              setFieldValue("catatan", text);
                              setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], catatan: text, }; } return newValues; });
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
                            {[
                              { value: "", label: "Pilih salah satu guru pengganti (opsional)" },
                              ...guruPenggantiOptions,
                            ].map((option) => (
                              <SelectItem key={String(option.value)} value={String(option.value)}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </Select>
                          {/* ----------------------------------- */}
                        </div>
                        {/* Buttons */}
                        <div className="flex flex-row justify-end mt-6 gap-4 p-2">
                          <Button color="danger" disabled={loading} variant="flat" onPress={() => setIsCancelModalOpen(true)}> Batal </Button>
                          <Button color="primary" disabled={loading} isLoading={loading} variant="shadow" onPress={() => handleSubmit()} type="submit" > Simpan </Button>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </Formik>
              ) : (
                <Card fullWidth className={cn(`border-small dark:border-small border-default-100`)}>
                  <CardBody>
                    <p>Memuat data peserta...</p>
                  </CardBody>
                </Card>)}
            </Tab>
            <Tab key="riwayat" title="Riwayat">
              {selectedPeserta[activePesertaIndex] ? (
                <Card fullWidth className={cn(`border-small dark:border-small border-default-100`,)} >
                  <CardBody className="overflow-hidden">
                    <div className="flex flex-col gap-4">
                      {selectedPeserta[activePesertaIndex].akademik && selectedPeserta[activePesertaIndex].akademik.length > 0 ? (
                        selectedPeserta[activePesertaIndex].akademik.map((akademik) => (<RiwayatAkademikKediriCard key={akademik.id} akademik={akademik} />),)
                      ) : (<EmptyState />)}
                    </div>
                  </CardBody>
                </Card>
              ) : (<p>Memuat riwayat pengetesan...</p>)}
            </Tab>
          </Tabs>
        </div>
      </main>
      <PesertaRFIDScanner />

      {/* --- Cancel Confirmation Modal --- */}
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
      {/* ------------------------------- */}
    </div>
  );
}