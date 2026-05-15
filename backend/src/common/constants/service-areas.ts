type ServiceAreasByCity = Record<string, string[]>;

export const MAX_SERVICE_AREAS_PER_SERVICE = 10;

const SERVICE_AREAS_BY_CITY: ServiceAreasByCity = {
  yangon: [
    "ahlone",
    "bahan",
    "botahtaung",
    "cocokyun",
    "dagon",
    "dagon myothit east",
    "dagon myothit north",
    "dagon myothit seikkan",
    "dagon myothit south",
    "dawbon",
    "hlaing",
    "hlaingthaya",
    "insein",
    "kamayut",
    "kyauktada",
    "kyimyindaing",
    "lanmadaw",
    "latha",
    "mayangone",
    "mingaladon",
    "mingala taungnyunt",
    "north okkalapa",
    "pabedan",
    "pazundaung",
    "sanchaung",
    "seikgyikanaungto",
    "seikkan",
    "shwepyitha",
    "south okkalapa",
    "tamwe",
    "thaketa",
    "thingangyun",
    "yankin",
  ],
  mandalay: [
    "aungmyethazan",
    "chanayethazan",
    "chanmyathazi",
    "mahaaungmye",
    "patheingyi",
    "pyigyidagun",
    "amarapura",
  ],
  naypyidaw: [
    "ottarathiri",
    "pobbathiri",
    "zabuthiri",
    "zeyarthiri",
    "dakkhinathiri",
    "tatkon",
    "lewe",
    "pyinmana",
  ],
  naypyitaw: [
    "ottarathiri",
    "pobbathiri",
    "zabuthiri",
    "zeyarthiri",
    "dakkhinathiri",
    "tatkon",
    "lewe",
    "pyinmana",
  ],
};

export const getAllowedServiceAreasForCity = (city: string): string[] | null => {
  const key = normalizeAreaName(city);
  return SERVICE_AREAS_BY_CITY[key] ?? null;
};

export const normalizeAreaName = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/township/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
