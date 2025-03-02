import ActionPesertaTopbar from "@/components/action-peserta-topbar";
import EmptyState from "@/components/empty-state";
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkhlakKertosonoCard from "@/components/riwayat-akhlak-kertosono-card";
import { useKertosono } from "@/hooks/use-kertosono";
import { usePeserta } from "@/hooks/use-peserta";
import { addToast, Button, Card, CardBody, cn, Input, Tab, Tabs, Textarea } from "@heroui/react";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  catatan: Yup.string().required("Catatan akhlak harus diisi."),
})

export default function PenilaianAkhlakKertosonoPage() {
  const {storeAkhlakKertosono} = useKertosono();
  const {selectedPeserta, toggleSelectedPeserta, activePesertaIndex, setActivePesertaIndex, formValues, setFormValues} = usePeserta();
  const navigate = useNavigate()
  const [tab, setTab] = useState("penilaian");
  const [loading, setLoading] = useState(false);

  // Redirect immediately if selectedPeserta is empty or null
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
        navigate('/peserta-kertosono?action=penilaian-akhlak', { replace: true });
    }
  }, [selectedPeserta, navigate]);

  // Don't render anything if redirecting
  if (!selectedPeserta || selectedPeserta.length === 0) {
    return null; 
  }

  useEffect(() => {
    const updatedFormValues = selectedPeserta.map((peserta) => {
      const existingForm = formValues.find(
          (form) => form.tes_santri_id === peserta.id
      );
      
      return (
        existingForm || {
          tes_santri_id: peserta.id,
          poin: "",
          catatan: "",
        }
      );
    });

    setFormValues(updatedFormValues);
  }, [selectedPeserta]);

  const handleRemovePeserta = (indexToRemove) => {
    // Save a reference to the peserta to remove
    const pesertaToRemove = selectedPeserta[indexToRemove];
    
    // Check if this is the last peserta
    if (selectedPeserta.length === 1) {
      // First toggle the selection to empty the array
      toggleSelectedPeserta(pesertaToRemove);
      // Then navigate - this ensures the array is updated before navigation
      navigate('/peserta-kertosono?action=penilaian-akhlak', { replace: true });
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
            size="md"
            color="primary"
            variant="bordered"
            selectedKey={tab}
            onSelectionChange={setTab}
          >
            <Tab key="penilaian" title="Form Penilaian">
              <Formik
                initialValues={ formValues[activePesertaIndex] || {}}
                validationSchema={validationSchema}
                enableReinitialize // Allows reinitialization when `initialValues` change
                onSubmit={async (values) => {
                  try {
                    // Call the API to store the form data
                    setLoading(true);

                    const formValueToStore = formValues[activePesertaIndex];
                    const storedForm = await storeAkhlakKertosono(
                      formValueToStore.tes_santri_id,
                      formValueToStore.catatan
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
                    handleRemovePeserta(activePesertaIndex)
                    window.scrollTo(0, 0)
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
                {({ handleSubmit,setFieldValue, touched, values, errors }) => (
                  <Card  
                    fullWidth
                    className={cn(`border-small dark:border-small border-default-100`)}
                  >
                    <CardBody className="overflow-hidden">
                      <div className="flex flex-col gap-6 p-2">
                        <Textarea
                          isClearable
                          isRequired
                          isMultiline
                          className="w-full"
                          label="Catatan Akhlak"
                          placeholder="Tuliskan catatan akhlak"
                          isDisabled={loading}
                          isInvalid={!!errors.catatan}
                          errorMessage={errors.catatan}
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
                        <Button disabled={loading} color="danger" variant="flat" onPress={() => handleRemovePeserta(activePesertaIndex)}>
                            Batal
                        </Button>
                        <Button isLoading={loading} disabled={loading} color="primary" variant="shadow" onPress={() => handleSubmit()}>
                            Tambahkan
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
                className={cn(`border-small dark:border-small border-default-100`)}
              >
                <CardBody className="overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {
                      selectedPeserta[activePesertaIndex].akhlak.map((akhlak) => <RiwayatAkhlakKertosonoCard key={akhlak.id} akhlak={akhlak}/>)
                    }
                    {
                      selectedPeserta[activePesertaIndex].akhlak.length == 0 && <EmptyState/>
                    }
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