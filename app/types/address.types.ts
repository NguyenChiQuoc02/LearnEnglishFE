export type AdministrativeRegion = {
  id: number;
  name: string;
  nameEn: string;
  codeName: string | null;
  codeNameEn: string | null;
};

export type AdministrativeUnit = {
  id: number;
  fullName: string | null;
  fullNameEn: string | null;
  shortName: string | null;
  shortNameEn: string | null;
  codeName: string | null;
  codeNameEn: string | null;
};

export type ProvinceResponse = {
  code: string;
  name: string;
  fullName: string;
};

export type WardResponse = {
  code: string;
  name: string;
  fullName: string | null;
  provinceCode: string | null;
};
