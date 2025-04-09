import { useState, useEffect, useMemo } from "react"; // Added useMemo
import {
  Button,
  Navbar,
  NavbarItem,
  Input,
  DropdownTrigger,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Divider,
} from "@heroui/react";
import { ChevronDown, SearchIcon, X } from "lucide-react";
import React from "react"; // React is already imported
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import BouncingChip from "./bouncing-chip";

import { getFirstValidWord, PesertaKertosono } from "@/types/kertosono"; // Assuming these types are correctly defined
import { PesertaKediri } from "@/types/kediri"; // Assuming these types are correctly defined

const genderOptions = [
  { label: "Semua Gender", value: "" },
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];

const campOptions = [
    { label: "Semua Camp", value: "" },
    { label: "Camp A", value: "A" },
    { label: "Camp B", value: "B" },
    { label: "Camp C", value: "C" },
    { label: "Camp D", value: "D" },
    { label: "Camp E", value: "E" },
    { label: "Camp F", value: "F" },
    { label: "Camp G", value: "G" },
    { label: "Camp H", value: "H" },
    { label: "Camp I", value: "I" },
    { label: "Camp J", value: "J" },
    { label: "Camp K", value: "K" },
    { label: "Camp L", value: "L" },
    { label: "Camp M", value: "M" },
    { label: "Camp N", value: "N" },
    { label: "Camp O", value: "O" },
    { label: "Camp P", value: "P" },
    { label: "Camp Q", value: "Q" },
    { label: "Camp R", value: "R" },
    { label: "Camp S", value: "S" },
    { label: "Camp T", value: "T" },
];

type DaftarPesertaTopbarProps = {
  selectedPeserta: PesertaKediri[] | PesertaKertosono[];
  toggleSelectedPeserta: (peserta: PesertaKediri | PesertaKertosono) => void;
  setQuery: (
    updater: (prevQuery: any) => any // More specific type for updater function
  ) => void;
};

const DaftarPesertaTopbar: React.FC<DaftarPesertaTopbarProps> = ({
  selectedPeserta,
  toggleSelectedPeserta,
  setQuery,
}) => {
  const [mounted, setMounted] = useState(false);
  const [queryNama, setQueryNama] = useState(""); // State for the current input value
  const [queryGender, setQueryGender] = useState("");
  const [queryKelompok, setQueryKelompok] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isTahapKediri = location.pathname.includes("kediri");

  // --- Memoized values for dropdown labels ---
  const selectedGenderValue = useMemo( // Changed from React.useMemo
    () =>
      genderOptions.find((opt) => opt.value === queryGender)?.label ||
      "Semua Gender",
    [queryGender],
  );

  const selectedKelompokValue = useMemo( // Changed from React.useMemo
    () =>
      campOptions.find((opt) => opt.value === queryKelompok)?.label ||
      "Semua Camp",
    [queryKelompok],
  );

  // --- Handlers for Dropdowns (Unchanged) ---
  const handleGenderSelectionChange = (keys: Set<React.Key> | any) => { // Added type hint for keys
    const selectedValue = Array.from(keys)[0] as string; // Type assertion

    setQueryGender(selectedValue);

    setQuery((prevQuery: any) => {
      const newQuery = { ...prevQuery };
      if (selectedValue === "") {
        delete newQuery["filter[siswa.jenis_kelamin]"];
      } else {
        newQuery["filter[siswa.jenis_kelamin]"] = selectedValue;
      }
      return newQuery;
    });
  };

  const handleKelompokSelectionChange = (keys: Set<React.Key> | any) => { // Added type hint for keys
    const selectedValue = Array.from(keys)[0] as string; // Type assertion

    setQueryKelompok(selectedValue);

    setQuery((prevQuery: any) => {
      const newQuery = { ...prevQuery };

      // If the value is empty, remove the filter
      if (selectedValue === "") {
        delete newQuery["filter[kelompok]"];
      } else {
        newQuery["filter[kelompok]"] = selectedValue;
      }

      return newQuery;
    });
  };

  // --- Handler for Name Input Change ---
  const handleNamaChange = (value: string) => {
    setQueryNama(value); // Just update the state holding the input value
  };

  // --- Handler for Explicit Search Action (Button Click or Enter) ---
  const handleSearchClick = () => {
    // This function now updates the main query directly based on queryNama
    setQuery((prevQuery: any) => {
      const newQuery = { ...prevQuery };

      // If the query is empty, remove the filter
      if (queryNama.trim() === "") { // Use trim() to handle whitespace
        delete newQuery["filter[namaOrCocard]"];
      } else {
        newQuery["filter[namaOrCocard]"] = queryNama.trim(); // Use trimmed value
      }
      return newQuery;
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Removed Debouncing useEffects ---
  // The useEffects that previously handled debouncedQueryNama and updated
  // the query automatically based on it have been removed.

  if (!mounted) return null;

  return (
    <Navbar
      isBordered
      as={"div"}
      classNames={{
        base: "h-fit",
        wrapper: "w-full h-fit flex flex-col py-4",
      }}
      maxWidth="full"
    >
      <NavbarItem className="gap-4 flex flex-col md:flex-row w-full ">
        <div className="flex flex-grow gap-2">
          <Button
            isIconOnly
            aria-label="Back"
            className="flex-grow-0"
            variant="light"
            onPress={() => navigate("/")}
          >
            <X />
          </Button>
          <Input
            classNames={{
              base: "w-full flex-grow",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Cari nama atau cocard..."
            size="md"
            endContent={
              <Button
                isIconOnly
                aria-label="search"
                color="primary"
                radius="md"
                variant="light"
                className="-mr-3"
                onPress={handleSearchClick} // Click event triggers search
              >
                <SearchIcon size={18} />
              </Button>
            }
            type="search"
            value={queryNama} // Directly use queryNama for value
            onChange={(e) => handleNamaChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick(); // Enter key triggers search
              }
            }}
          />
        </div>
        <div className="flex gap-2 w-full md:w-min justify-center">
          {/* Gender Dropdown (Unchanged) */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="capitalize"
                color="primary"
                endContent={<ChevronDown className="h-4 w-4" />}
                variant="solid"
              >
                {selectedGenderValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Select Gender"
              selectedKeys={new Set([queryGender])}
              selectionMode="single"
              variant="light"
              onSelectionChange={handleGenderSelectionChange}
            >
              {genderOptions.map((option) => (
                <DropdownItem key={option.value}>{option.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Camp Dropdown (Conditional rendering unchanged) */}
          {isTahapKediri && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="capitalize"
                  color="primary"
                  endContent={<ChevronDown className="h-4 w-4" />}
                  variant="solid"
                >
                  {selectedKelompokValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Select Camp"
                className="max-h-[50vh] overflow-y-auto"
                selectedKeys={new Set([queryKelompok])}
                selectionMode="single"
                shouldBlockScroll={false} // Consider if true is needed based on UI lib behavior
                variant="bordered"
                onSelectionChange={handleKelompokSelectionChange}
              >
                {campOptions.map((option) => (
                  <DropdownItem key={option.value}>{option.label}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </NavbarItem>

      {/* Selected Peserta Chips (Unchanged) */}
      {selectedPeserta.length !== 0 && (
        <>
          <Divider />
          <NavbarItem
            as="div"
            className="w-full flex flex-row justify-center items-center gap-3 flex-wrap"
          >
            <AnimatePresence mode="sync">
              {selectedPeserta.map((peserta) => (
                <BouncingChip
                  key={peserta.id}
                  cocard={peserta.nomor_cocard}
                  kelompok={peserta.kelompok}
                  nama={
                    peserta.nama_panggilan
                      ? peserta.nama_panggilan
                      : getFirstValidWord(peserta.nama_lengkap)
                  }
                  src={peserta.foto_smartcard}
                  onClose={() => {
                    toggleSelectedPeserta(peserta);
                  }}
                />
              ))}
            </AnimatePresence>
          </NavbarItem>
        </>
      )}
    </Navbar>
  );
};

export default DaftarPesertaTopbar;