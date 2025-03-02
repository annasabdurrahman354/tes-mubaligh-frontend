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
} from "@heroui/react";
import { ArrowLeft, ChevronDown, SearchIcon } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

const genderOptions = [
  { label: "Semua Gender", value: "-" },
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];

const campOptions = [
  { label: "Semua Camp", value: "-" },
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

export default function DaftarPesertaTopbar() {
  const [mounted, setMounted] = useState(false);
  const [selectedGender, setSelectedGender] = useState(new Set(["-"]));
  const [selectedCamp, setSelectedCamp] = useState(new Set(["-"]));
  const location = useLocation();

  const isPesertaKediri = location.pathname === "/peserta-kediri";

  const selectedGenderValue = React.useMemo(
    () =>
      genderOptions.find((opt) => opt.value === Array.from(selectedGender)[0])
        ?.label || "-",
    [selectedGender],
  );

  const selectedCampValue = React.useMemo(
    () =>
      campOptions.find((opt) => opt.value === Array.from(selectedCamp)[0])
        ?.label || "-",
    [selectedCamp],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar
      isBordered
      as={"div"}
      classNames={{
        wrapper: "w-full min-h-min flex flex-col py-4 md:flex-row md:py-0",
      }}
      maxWidth="full"
    >
      <NavbarItem className="flex-grow w-full flex gap-4">
        <Button
          isIconOnly
          aria-label="Back"
          className="flex-grow-0"
          variant="light"
        >
          <ArrowLeft />
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
        />
      </NavbarItem>
      <NavbarItem as="div" className="flex gap-2 md:w-min">
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              color="primary"
              endContent={<ChevronDown className="h-4 w-4" />}
              variant="flat"
            >
              {selectedGenderValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Select Gender"
            selectedKeys={selectedGender}
            selectionMode="single"
            variant="light"
            onSelectionChange={setSelectedGender}
          >
            {genderOptions.map((option) => (
              <DropdownItem key={option.value}>{option.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {isPesertaKediri && (
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="capitalize"
                color="primary"
                endContent={<ChevronDown className="h-4 w-4" />}
                variant="flat"
              >
                {selectedCampValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Select Camp"
              className="max-h-[50vh] overflow-y-auto"
              selectedKeys={selectedCamp}
              selectionMode="single"
              shouldBlockScroll={false}
              variant="bordered"
              onSelectionChange={setSelectedCamp}
            >
              {campOptions.map((option) => (
                <DropdownItem key={option.value}>{option.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarItem>
    </Navbar>
  );
}
