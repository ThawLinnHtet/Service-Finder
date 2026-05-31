import { prisma } from "../../database/prisma";

export const findNrcStates = () => {
  return prisma.nrcState.findMany({
    orderBy: [{ code: "asc" }],
    select: {
      code: true,
      name: true,
      nameMm: true,
    },
  });
};

export const findNrcStateByCode = (stateCode: string) => {
  return prisma.nrcState.findUnique({
    where: { code: stateCode },
    select: { code: true },
  });
};

export const findNrcTownshipsByStateCode = (stateCode: string) => {
  return prisma.nrcTownship.findMany({
    where: { stateCode },
    orderBy: [{ name: "asc" }],
    select: {
      stateCode: true,
      code: true,
      codeMm: true,
      name: true,
      nameMm: true,
    },
  });
};

export const findNrcTownshipByStateAndCode = (
  stateCode: string,
  code: string,
) => {
  return prisma.nrcTownship.findUnique({
    where: {
      stateCode_code: {
        stateCode,
        code,
      },
    },
    select: {
      stateCode: true,
      code: true,
      codeMm: true,
      name: true,
      nameMm: true,
    },
  });
};
