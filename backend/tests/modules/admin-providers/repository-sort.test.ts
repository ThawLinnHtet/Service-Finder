const findManyMock = jest.fn();

jest.mock("../../../src/database/prisma", () => ({
  prisma: {
    providerProfile: {
      findMany: findManyMock,
    },
  },
}));

import { findProvidersForAdminList } from "../../../src/modules/admin-providers/repository";

describe("admin providers list repository sorting", () => {
  beforeEach(() => {
    findManyMock.mockReset();
    findManyMock.mockResolvedValue([]);
  });

  it("uses newest-first ordering by createdAt with stable id tie-breaker", async () => {
    await findProvidersForAdminList({
      status: "PENDING",
      cursor: undefined,
      limit: 20,
    });

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "PENDING" },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        take: 20,
      }),
    );
  });

  it("keeps cursor-based pagination behavior", async () => {
    await findProvidersForAdminList({
      status: undefined,
      cursor: "550e8400-e29b-41d4-a716-446655440000",
      limit: 10,
    });

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: { id: "550e8400-e29b-41d4-a716-446655440000" },
        skip: 1,
        take: 10,
      }),
    );
  });
});
