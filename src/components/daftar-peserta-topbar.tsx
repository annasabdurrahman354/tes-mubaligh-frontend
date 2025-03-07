import { useState, useEffect } from "react";
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
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import BouncingChip from "./bouncing-chip";

import { getFirstValidWord, PesertaKertosono } from "@/types/kertosono";
import { PesertaKediri } from "@/types/kediri";

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
  setQuery: (query: any) => void;
};

const DaftarPesertaTopbar: React.FC<DaftarPesertaTopbarProps> = ({
  selectedPeserta,
  toggleSelectedPeserta,
  setQuery,
}) => {
  const [mounted, setMounted] = useState(false);
  const [queryNama, setQueryNama] = useState("");
  const [debouncedQueryNama, setDebouncedQueryNama] = useState("");
  const [pendingQueryNama, setPendingQueryNama] = useState("");
  const [queryGender, setQueryGender] = useState("");
  const [queryKelompok, setQueryKelompok] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isTahapKediri = location.pathname.includes("kediri");

  const selectedGenderValue = React.useMemo(
    () =>
      genderOptions.find((opt) => opt.value === queryGender)?.label ||
      "Semua Gender",
    [queryGender],
  );

  const selectedKelompokValue = React.useMemo(
    () =>
      campOptions.find((opt) => opt.value === queryKelompok)?.label ||
      "Semua Camp",
    [queryKelompok],
  );

  const handleGenderSelectionChange = (keys) => {
    const selectedValue = Array.from(keys)[0];

    setQueryGender(selectedValue);

    setQuery((prevQuery: any) => {
      const newQuery = { ...prevQuery };

      // If the value is empty, remove the filter
      if (selectedValue === "") {
        delete newQuery["filter[siswa.jenis_kelamin]"];
      } else {
        newQuery["filter[siswa.jenis_kelamin]"] = selectedValue;
      }

      return newQuery;
    });
  };

  const handleKelompokSelectionChange = (keys) => {
    const selectedValue = Array.from(keys)[0];

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

  const handleNamaChange = (value) => {
    if (isTahapKediri) {
      setPendingQueryNama(value);
    } else {
      setQueryNama(value);
    }
  };

  const handleSearchClick = () => {
    if (isTahapKediri) {
      setQueryNama(pendingQueryNama);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQueryNama(queryNama);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [queryNama]);

  useEffect(() => {
    setQuery((prevQuery) => {
      const newQuery = { ...prevQuery };

      // If the query is empty, remove the filter
      if (debouncedQueryNama === "") {
        delete newQuery["filter[namaOrCocard]"];
      } else {
        newQuery["filter[namaOrCocard]"] = debouncedQueryNama;
      }

      return newQuery;
    });
  }, [debouncedQueryNama, setQuery]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                onClick={handleSearchClick} // Click event triggers search in Kediri mode
              >
                <SearchIcon size={18} />
              </Button>
            }
            type="search"
            value={isTahapKediri ? pendingQueryNama : queryNama} // Show correct value based on mode
            onChange={(e) => handleNamaChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-min justify-center">
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
                shouldBlockScroll={false}
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
