import { useAtom } from "jotai";
import { PesertaKertosono } from "@/types/kertosono";
import { activePesertaIndexAtom, formValuesAtom, pesertaAtom, selectedPesertaAtom } from "@/atoms/pesertaAtom";
import { PesertaKediri } from "@/types/kediri";
import { useEffect } from "react";

export const usePeserta = () => {
  const [peserta, setPeserta] = useAtom(pesertaAtom);
  const [selectedPeserta, setSelectedPeserta] = useAtom(selectedPesertaAtom);
  const [activePesertaIndex, setActivePesertaIndex] = useAtom(activePesertaIndexAtom);
  const [formValues, setFormValues] = useAtom(formValuesAtom);

  const toggleSelectedPeserta = (peserta: PesertaKediri | PesertaKertosono) => {
    setSelectedPeserta((prevSelected: any) => {
      if (!prevSelected) return [peserta];

      const exists = prevSelected.some((item: any) => item.id === peserta.id);
      return exists
        ? prevSelected.filter((item: any) => item.id !== peserta.id)
        : [...prevSelected, peserta];
    });
  };

  const isSelectedPeserta = (peserta: PesertaKediri | PesertaKertosono) => {
    return selectedPeserta?.some((item) => item.id === peserta.id);
  };

  const addSelectedPeserta = (peserta: PesertaKediri | PesertaKertosono) => {
    setSelectedPeserta((prevSelected: any) => {
        // If the array is null, initialize it as an empty array
        if (!prevSelected) {
            return [peserta];
        }

        // Check if the peserta is already in the list (you can define your own condition)
        const exists = prevSelected.some((item: any) => item.id === peserta.id);
        if (exists) {
            return prevSelected;
        }

        // Add the new peserta to the list if not already present
        return [...prevSelected, peserta];
    });
  };

  const clearSelectedPeserta = () => {
    setSelectedPeserta([]);
  };

  const clearPeserta = () => {
    setPeserta([]);
  };

  const clearForm = () => {
    setFormValues([]);
  };

  useEffect(() => {
    if (activePesertaIndex >= selectedPeserta.length) {
      setActivePesertaIndex(0);
    }
  }, [selectedPeserta, activePesertaIndex, setActivePesertaIndex]);


  return {peserta, setPeserta, selectedPeserta, setSelectedPeserta, activePesertaIndex, setActivePesertaIndex, formValues, setFormValues, toggleSelectedPeserta, addSelectedPeserta, isSelectedPeserta, clearSelectedPeserta, clearPeserta, clearForm};
};
