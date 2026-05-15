import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  listNrcStatesController,
  listNrcTownshipsController,
  listNrcTypesController,
  translateNrcController,
} from "./controller";
import { listNrcTownshipsSchema, translateNrcSchema } from "./validation";

const router = Router();

router.get("/types", asyncHandler(listNrcTypesController));
router.get("/states", asyncHandler(listNrcStatesController));
router.post(
  "/translate",
  validateRequest(translateNrcSchema),
  asyncHandler(translateNrcController),
);
router.get(
  "/states/:stateCode/townships",
  validateRequest(listNrcTownshipsSchema),
  asyncHandler(listNrcTownshipsController),
);

export const nrcRouter = router;
