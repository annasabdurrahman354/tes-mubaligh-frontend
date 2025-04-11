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
import EmptyState from "@/components/empty-state"; // Added for consistency in Riwayat tab
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkademikKertosonoCard from "@/components/riwayat-akademik-kertosono-card";
import Timer from "@/components/timer";
import { useAuth } from "@/hooks/use-auth";
import { useKertosono } from "@/hooks/use-kertosono";
import { usePeserta } from "@/hooks/use-peserta";

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
          return false; // Trigger validation error
        }
      }

      return true; // Validation passes
    },
  ),
  catatan: Yup.string(), // Added optional catatan validation
  rekomendasi_penarikan: Yup.boolean(), // Added boolean validation
});

// Helper function to safely get initial duration number (copied from Kediri)
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

  // Redirect effect (remains the same)
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      navigate("/peserta-kertosono?action=penilaian-akademik", {
        replace: true,
      });
    }
  }, [selectedPeserta, navigate]);

  // Effect to initialize form values, calculating 'awal_penilaian' for continuous timer effect (adapted from Kediri)
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      return;
    }

    const updatedFormValues = selectedPeserta.map((peserta) => {
      const existingForm = formValues.find(
        (form) => form.tes_santri_id === peserta.id,
      );

      // If form state for this participant already exists *and* has an awal_penilaian,
      // reuse it. This prevents recalculating the fake start time unnecessarily.
      if (existingForm && existingForm.awal_penilaian) {
          return existingForm;
      }

      // --- Start Calculation Logic (Adapted from Kediri) ---
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

      // --- Construct Initial Data (Adapted for Kertosono fields) ---
      const initialData = {
        tes_santri_id: peserta.id,
        penilaian: akademikEntry ? akademikEntry.penilaian || "" : "",
        kekurangan_tajwid: akademikEntry ? akademikEntry.kekurangan_tajwid || [] : [],
        kekurangan_khusus: akademikEntry ? akademikEntry.kekurangan_khusus || [] : [],
        kekurangan_keserasian: akademikEntry ? akademikEntry.kekurangan_keserasian || [] : [],
        kekurangan_kelancaran: akademikEntry ? akademikEntry.kekurangan_kelancaran || [] : [],
        catatan: akademikEntry ? akademikEntry.catatan || "" : "",
        rekomendasi_penarikan: akademikEntry ? akademikEntry.rekomendasi_penarikan || false : false,
        awal_penilaian: calculated_awal_penilaian, // Use the calculated start time
        durasi_penilaian: current_total_duration, // Store latest known total duration
        // No 'akhir_penilaian' needed in initial state with this logic
      };
      // --- End Construct Initial Data ---

      // If existingForm exists but didn't have awal_penilaian (e.g., from previous session/different logic),
      // merge non-timer fields, but prioritize the newly calculated timer fields.
      if (existingForm && !existingForm.awal_penilaian) {
          return {
              ...initialData, // Use fresh timer fields (awal_penilaian, durasi_penilaian)
              // Keep other fields from existingForm if they exist, otherwise use initialData's
              tes_santri_id: existingForm.tes_santri_id || initialData.tes_santri_id,
              penilaian: existingForm.penilaian || initialData.penilaian,
              kekurangan_tajwid: existingForm.kekurangan_tajwid || initialData.kekurangan_tajwid,
              kekurangan_khusus: existingForm.kekurangan_khusus || initialData.kekurangan_khusus,
              kekurangan_keserasian: existingForm.kekurangan_keserasian || initialData.kekurangan_keserasian,
              kekurangan_kelancaran: existingForm.kekurangan_kelancaran || initialData.kekurangan_kelancaran,
              catatan: existingForm.catatan || initialData.catatan,
              rekomendasi_penarikan: existingForm.rekomendasi_penarikan || initialData.rekomendasi_penarikan,
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
      navigate("/peserta-kertosono?action=penilaian-akademik", { replace: true });
      return;
    }
    if (activePesertaIndex === selectedPeserta.length - 1) {
      setActivePesertaIndex(activePesertaIndex - 1);
    }
    toggleSelectedPeserta(pesertaToRemove);
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
              {/* Add conditional rendering for loading state */}
              {formValues[activePesertaIndex] ? (
                 <Formik
                    enableReinitialize // Allows reinitialization when `initialValues` change
                    initialValues={formValues[activePesertaIndex]}
                    validationSchema={validationSchema}
                    onSubmit={async (/* values */) => { // values are implicitly from currentFormState now
                      try {
                        setLoading(true);
                        const currentFormState = formValues[activePesertaIndex];

                        // Get the calculated start time used by the timer (from Kediri)
                        const timerStartTime = currentFormState?.awal_penilaian?.getTime();

                        if (!timerStartTime) {
                          // Handle case where start time is somehow missing
                          throw new Error("Assessment start time is missing.");
                        }

                        // Calculate the TOTAL duration based on the timer's start time and now (from Kediri)
                        const totalDurasiMenit = Math.round(
                          (Date.now() - timerStartTime) / 60000,
                        );

                        // Prepare the payload with the calculated total duration (Adapted for Kertosono)
                        const updatedFormValuesPayload = {
                          ...currentFormState,
                          durasi_penilaian: totalDurasiMenit, // This IS the total accumulated time
                          // No akhir_penilaian needed in payload
                        };

                        // Update the central formValues state (primarily useful if NOT removing participant immediately)
                        setFormValues((prevValues) => {
                          const newValues = [...prevValues];
                           if(newValues[activePesertaIndex]) {
                             // Update with the final calculated total duration.
                             newValues[activePesertaIndex] = {
                               ...newValues[activePesertaIndex],
                               durasi_penilaian: totalDurasiMenit,
                             };
                           }
                          return newValues;
                        });

                        // Call the API with the final accumulated duration (Adapted for Kertosono)
                        const storedForm = await storeAkademikKertosono(
                          updatedFormValuesPayload.tes_santri_id,
                          updatedFormValuesPayload.penilaian,
                          // Conditionally send null for kekurangan if Lulus
                          updatedFormValuesPayload.penilaian === "Lulus"
                            ? null
                            : updatedFormValuesPayload.kekurangan_tajwid,
                          updatedFormValuesPayload.penilaian === "Lulus"
                            ? null
                            : updatedFormValuesPayload.kekurangan_khusus,
                          updatedFormValuesPayload.penilaian === "Lulus"
                            ? null
                            : updatedFormValuesPayload.kekurangan_keserasian,
                          updatedFormValuesPayload.penilaian === "Lulus"
                            ? null
                            : updatedFormValuesPayload.kekurangan_kelancaran,
                          updatedFormValuesPayload.catatan,
                          // Conditionally send null for rekomendasi if Tidak Lulus
                          updatedFormValuesPayload.penilaian === "Tidak Lulus"
                            ? null
                            : updatedFormValuesPayload.rekomendasi_penarikan,
                          updatedFormValuesPayload.durasi_penilaian, // Send the final total duration
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
                            description: error instanceof Error ? error.message : String(error), // Ensure message is string
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
                        className={cn( // Layout class preserved
                          `border-small dark:border-small border-default-100 relative`, // Added relative positioning
                        )}
                      >
                        <CardBody className="overflow-hidden"> {/* Layout class preserved */}
                          {/* Timer now displays the 'continuous' total time */}
                           {values.awal_penilaian ? (
                             <Timer
                               className="absolute top-2 right-2" // Layout class preserved
                               datetimeOrMinutes={values.awal_penilaian}
                             />
                           ) : null}

                          {/* Add padding top to avoid overlap */}
                           <div className="flex flex-col gap-6 p-2 pt-8"> {/* Added pt-8 */}
                             {/* RadioGroup Nilai Bacaan */}
                             <RadioGroup
                               isRequired
                               classNames={{ // Layout classes preserved
                                  wrapper: "w-full flex flex-row gap-6 mt-2 mb-3",
                               }}
                               errorMessage={errors.penilaian}
                               isDisabled={loading}
                               isInvalid={!!errors.penilaian && !!touched.penilaian}
                               label="Nilai Bacaan"
                               value={values.penilaian}
                               onValueChange={(value) => {
                                 setFieldValue("penilaian", value);
                                 // Update central state
                                 setFormValues((prevValues) => { const newValues = [...prevValues]; if (newValues[activePesertaIndex]) { newValues[activePesertaIndex] = { ...newValues[activePesertaIndex], penilaian: value }; } return newValues; });
                               }}
                             >
                               <CustomRadio buttonColor="success" value="Lulus"> Lulus </CustomRadio>
                               <CustomRadio buttonColor="danger" value="Tidak Lulus"> Tidak Lulus </CustomRadio>
                             </RadioGroup>

                             {/* Conditional Kekurangan Checkboxes */}
                             {values.penilaian === "Tidak Lulus" && (
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* Layout class preserved */}
                                 <CheckboxGroup /* Kekurangan Tajwid */
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
                                 <CheckboxGroup /* Kekurangan Khusus */
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
                                 <CheckboxGroup /* Kekurangan Keserasian */
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
                                 <CheckboxGroup /* Kekurangan Kelancaran */
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

                             {/* Validation Error for Kekurangan */}
                             {errors.kekurangan && touched.penilaian && values.penilaian === "Tidak Lulus" && ( // Added touched check
                               <p className="text-danger-500 text-medium items-start"> {/* Layout class preserved */}
                                 {errors.kekurangan}
                               </p>
                             )}

                            {/* Conditional Rekomendasi Penarikan */}
                            {values.penilaian === "Lulus" && (
                                <Checkbox /* Rekomendasi Penarikan */
                                className="mt-2 mx-0.5" // Layout class preserved
                                isDisabled={loading}
                                isSelected={values.rekomendasi_penarikan}
                                onValueChange={(value) => {
                                    // Note: The original code linked this to 'catatan', which seems wrong. Corrected to 'rekomendasi_penarikan'.
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

                            {/* Catatan Textarea */}
                             <Textarea
                               isMultiline // Layout prop preserved
                               className="w-full mt-4 px-2" // Layout classes preserved
                               isDisabled={loading}
                               label="Catatan"
                               minRows={4} // Added minRows for consistency
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
                           </div>

                          {/* Buttons */}
                          <div className="flex flex-row justify-end mt-6 gap-4 p-2"> {/* Layout classes preserved */}
                            <Button color="danger" disabled={loading} variant="flat" onPress={() => handleRemovePeserta(activePesertaIndex)} > Batal </Button>
                            <Button color="primary" disabled={loading} isLoading={loading} variant="shadow" onPress={() => handleSubmit()} type="submit" > Simpan </Button>
                          </div>
                        </CardBody>
                      </Card>
                    )}
                  </Formik>
              ) : (
                // Loading state while formValues initializes
                 <Card fullWidth className={cn(`border-small dark:border-small border-default-100`)}> <CardBody><p>Loading participant data...</p></CardBody> </Card>
              )}
            </Tab>
            <Tab key="riwayat" title="Riwayat">
              {/* Added check for selectedPeserta[activePesertaIndex] before accessing history */}
              {selectedPeserta[activePesertaIndex] ? (
                    <Card
                        fullWidth
                        className={cn( // Layout class preserved
                        `border-small dark:border-small border-default-100`,
                        )}
                    >
                        <CardBody className="overflow-hidden"> {/* Layout class preserved */}
                        <div className="flex flex-col gap-4"> {/* Layout class preserved */}
                            {/* Added check for non-empty history */}
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
                                <EmptyState /> // Use EmptyState component if no history
                            )}
                        </div>
                        </CardBody>
                    </Card>
                 ) : (
                   <p>Loading history...</p> // Placeholder while participant data loads
                 )}
            </Tab>
          </Tabs>
        </div>
      </main>
      <PesertaRFIDScanner />
    </div>
  );
}