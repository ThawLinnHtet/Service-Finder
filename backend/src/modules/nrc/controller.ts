import type { Request, Response } from "express";
import {
  getNrcStates,
  getNrcTownshipsByStateCode,
  getNrcTypes,
  translateNrc,
} from "./service";
import type { TranslateNrcInput } from "./validation";

export const listNrcTypesController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const types = getNrcTypes();

  res.status(200).json({
    success: true,
    data: types,
  });
};

export const listNrcStatesController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const states = await getNrcStates();

  res.status(200).json({
    success: true,
    data: states,
  });
};

export const listNrcTownshipsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { stateCode } = req.params as { stateCode: string };
  const townships = await getNrcTownshipsByStateCode(stateCode);

  res.status(200).json({
    success: true,
    data: townships,
  });
};

export const translateNrcController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const translated = await translateNrc(req.body as TranslateNrcInput);

  res.status(200).json({
    success: true,
    data: translated,
  });
};
