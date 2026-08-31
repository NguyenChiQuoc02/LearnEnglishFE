"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { listProvinces, listWardsByProvince } from "@/app/services/address.service";
import type { ProvinceResponse, WardResponse } from "@/app/types";
import { normalizeVietnamese } from "@/app/utils/text";

const provinceFilter = createFilterOptions<ProvinceResponse>({
  stringify: (option) => normalizeVietnamese(option.fullName),
});

const wardFilter = createFilterOptions<WardResponse>({
  stringify: (option) => normalizeVietnamese(option.fullName ?? option.name),
});

export type ProvinceWardValue = {
  provinceCode: string;
  wardCode: string;
};

type ProvinceWardSelectProps = {
  value: ProvinceWardValue;
  onChange: (value: ProvinceWardValue) => void;
};

export default function ProvinceWardSelect({ value, onChange }: ProvinceWardSelectProps) {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [wards, setWards] = useState<WardResponse[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);

  function fetchProvinces() {
    listProvinces().then(setProvinces).catch(() => setProvinces([]));
  }

  function fetchWards(provinceCode: string) {
    setLoadingWards(true);
    listWardsByProvince(provinceCode)
      .then(setWards)
      .catch(() => setWards([]))
      .finally(() => setLoadingWards(false));
  }

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (value.provinceCode) {
      fetchWards(value.provinceCode);
    }
  }, [value.provinceCode]);

  const visibleWards = value.provinceCode ? wards : [];
  const selectedProvince = provinces.find((p) => p.code === value.provinceCode) ?? null;
  const selectedWard = visibleWards.find((w) => w.code === value.wardCode) ?? null;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <Autocomplete
        fullWidth
        options={provinces}
        getOptionLabel={(option) => option.fullName}
        filterOptions={provinceFilter}
        isOptionEqualToValue={(option, selected) => option.code === selected.code}
        value={selectedProvince}
        onChange={(_, newValue) => onChange({ provinceCode: newValue?.code ?? "", wardCode: "" })}
        renderInput={(params) => <TextField {...params} label={t("address.province")} />}
      />

      <Autocomplete
        fullWidth
        disabled={!value.provinceCode}
        loading={loadingWards}
        options={visibleWards}
        getOptionLabel={(option) => option.fullName ?? option.name}
        filterOptions={wardFilter}
        isOptionEqualToValue={(option, selected) => option.code === selected.code}
        value={selectedWard}
        onChange={(_, newValue) =>
          onChange({ provinceCode: value.provinceCode, wardCode: newValue?.code ?? "" })
        }
        noOptionsText={value.provinceCode ? undefined : t("address.selectProvinceFirst")}
        renderInput={(params) => <TextField {...params} label={t("address.ward")} />}
      />
    </Stack>
  );
}
