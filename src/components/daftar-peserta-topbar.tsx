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
import BouncingChip from "./bouncing-chip";
import { getFirstValidWord, PesertaKertosono } from "@/types/kertosono";
import { AnimatePresence } from "framer-motion";
import { PesertaKediri } from "@/types/kediri";

const genderOptions = [
  { label: "Semua Gender", value: '' },
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];

const campOptions = [
  { label: "Semua Camp", value: '' },
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
]

type DaftarPesertaTopbarProps = {
  selectedPeserta: PesertaKediri[] | PesertaKertosono[];
  toggleSelectedPeserta: (peserta: PesertaKediri | PesertaKertosono) => void;
  setQuery: (query: any) => void
};

const DaftarPesertaTopbar: React.FC<DaftarPesertaTopbarProps> = ({
  selectedPeserta,
  toggleSelectedPeserta,
  setQuery
}) => {
  const [mounted, setMounted] = useState(false);
  const [queryNama, setQueryNama] = useState("");
  const [debouncedQueryNama, setDebouncedQueryNama] = useState("");
  const [queryGender, setQueryGender] = useState("");
  const [queryKelompok, setQueryKelompok] = useState("");
  const location = useLocation();
  const navigate = useNavigate()
  const isTahapKediri = location.pathname.includes("kediri");

  const selectedGenderValue = React.useMemo(
    () => genderOptions.find((opt) => opt.value === queryGender)?.label || "Semua Gender",
    [queryGender]
  );

  const selectedKelompokValue = React.useMemo(
    () => campOptions.find((opt) => opt.value === queryKelompok)?.label || "Semua Camp",
    [queryKelompok]
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
    setQueryNama(value);
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
    <Navbar as={"div"} isBordered maxWidth="full"  classNames={{
      wrapper: "w-full min-h-min flex flex-col py-4",
    }}>
      <NavbarItem className="gap-4 flex flex-col md:flex-row w-full ">
        <div className="flex flex-grow gap-2">
          <Button isIconOnly aria-label="Back" variant="light" className="flex-grow-0" onPress={() => navigate('/')}>
            <X />
          </Button>
          <Input
            classNames={{
              base: "w-full h-10 flex-grow",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Cari nama atau cocard..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
            value={queryNama}
            onChange={(e) => handleNamaChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-min justify-center">
          <Dropdown>
            <DropdownTrigger>
              <Button className="capitalize" color="primary" variant="solid" endContent={<ChevronDown className="h-4 w-4"/>}>
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
          { isTahapKediri && 
          <Dropdown>
            <DropdownTrigger>
              <Button className="capitalize" color="primary" variant="solid" endContent={<ChevronDown className="h-4 w-4"/>}>
              {selectedKelompokValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Select Camp"
              selectedKeys={new Set([queryKelompok])}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={handleKelompokSelectionChange}
              shouldBlockScroll={false}
              className="max-h-[50vh] overflow-y-auto"
            >
              {campOptions.map((option) => (
                <DropdownItem key={option.value}>{option.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          }
        </div>
      </NavbarItem>
      {
        selectedPeserta.length !== 0 && 
        <>
        <Divider/>
        <NavbarItem as="div" className="w-full flex flex-row justify-center items-center gap-3 flex-wrap">
          <AnimatePresence mode="sync">
          {selectedPeserta.map((peserta) => (
            <BouncingChip 
              key={peserta.id}
              src={peserta.foto_smartcard} 
              nama={peserta.nama_panggilan ? peserta.nama_panggilan : getFirstValidWord(peserta.nama_lengkap)} 
              kelompok={peserta.kelompok} 
              cocard={peserta.nomor_cocard} 
              onClose={() => {toggleSelectedPeserta(peserta)}}
            />
          ))}
          </AnimatePresence>        
        </NavbarItem>
        </>
      }
    </Navbar>
  );
}

export default DaftarPesertaTopbar;