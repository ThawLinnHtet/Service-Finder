import { getDistricts, getStates } from "mm-nric";

type NrcStateSeed = {
  code: string;
  name: string;
  nameMm: string;
};

type NrcTownshipSeed = {
  stateCode: string;
  code: string;
  codeMm: string;
  name: string;
  nameMm: string;
};

type RawState = {
  code: number;
  en: string;
  mm: string;
};

type RawDistrict = {
  code: number;
  en: string;
  mm: string;
  fullEn?: string;
  fullMm?: string;
};

const STATE_NAME_OVERRIDES: Record<number, string> = {
  14: "Ayeyarwady",
};

const rawStates = getStates() as unknown as RawState[];
const rawDistricts = getDistricts() as unknown as RawDistrict[];

export const nrcStateSeeds: NrcStateSeed[] = rawStates
  .map((state) => ({
    code: `${state.code}`,
    name: STATE_NAME_OVERRIDES[state.code] ?? state.en.trim(),
    nameMm: state.mm.trim(),
  }))
  .filter(
    (state) =>
      state.code.length > 0 && state.name.length > 0 && state.nameMm.length > 0,
  )
  .sort((a, b) => Number(a.code) - Number(b.code));

const townshipMap = new Map<string, NrcTownshipSeed>();

for (const district of rawDistricts) {
  const stateCode = `${district.code}`.trim();
  const townshipCode = district.en.trim().toUpperCase();
  const townshipCodeMm = district.mm.trim();
  const townshipName = (district.fullEn ?? district.en).trim();
  const townshipNameMm = (district.fullMm ?? district.mm).trim();

  if (!stateCode || !townshipCode || !townshipCodeMm || !townshipName || !townshipNameMm) {
    continue;
  }

  const key = `${stateCode}:${townshipCode}`;

  if (!townshipMap.has(key)) {
    townshipMap.set(key, {
      stateCode,
      code: townshipCode,
      codeMm: townshipCodeMm,
      name: townshipName,
      nameMm: townshipNameMm,
    });
  }
}

export const nrcTownshipSeeds: NrcTownshipSeed[] = Array.from(
  townshipMap.values(),
).sort((a, b) => {
  const stateCodeCompare = Number(a.stateCode) - Number(b.stateCode);
  if (stateCodeCompare !== 0) {
    return stateCodeCompare;
  }

  return a.name.localeCompare(b.name, "en");
});

export const validateNrcSeedData = (): void => {
  if (nrcStateSeeds.length !== 14) {
    throw new Error(`Expected 14 NRC states, received ${nrcStateSeeds.length}`);
  }

  const stateCodeSet = new Set(nrcStateSeeds.map((state) => state.code));

  for (const township of nrcTownshipSeeds) {
    if (!stateCodeSet.has(township.stateCode)) {
      throw new Error(
        `NRC township ${township.code} references unknown state ${township.stateCode}`,
      );
    }
  }

  const stateTownshipCounts = new Map<string, number>();

  for (const township of nrcTownshipSeeds) {
    stateTownshipCounts.set(
      township.stateCode,
      (stateTownshipCounts.get(township.stateCode) ?? 0) + 1,
    );
  }

  for (const state of nrcStateSeeds) {
    const count = stateTownshipCounts.get(state.code) ?? 0;
    if (count === 0) {
      throw new Error(`No NRC townships found for state ${state.code}`);
    }
  }
};
