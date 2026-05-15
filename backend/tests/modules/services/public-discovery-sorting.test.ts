import { ValidationError } from "../../../src/common/errors/app-error";
import { listPublicServicesSchema } from "../../../src/modules/services/validation";

jest.mock("../../../src/modules/services/repository", () => ({
  searchPublicServiceIds: jest.fn(),
  findPublicServicesByIds: jest.fn(),
}));

jest.mock("../../../src/common/repositories/reference", () => ({
  hasCategory: jest.fn(),
  countSkillsByCategory: jest.fn(),
}));

import {
  findPublicServicesByIds,
  searchPublicServiceIds,
} from "../../../src/modules/services/repository";
import { listPublicServices } from "../../../src/modules/services/service";

const mockedSearchPublicServiceIds = searchPublicServiceIds as jest.Mock;
const mockedFindPublicServicesByIds = findPublicServicesByIds as jest.Mock;

const buildService = (id: string, price: string) => ({
  id,
  providerId: "provider-1",
  categoryId: "category-1",
  title: `Service ${id}`,
  description: "Description for service",
  price,
  experienceYears: 3,
  isActive: true,
  isVisible: true,
  isAvailable: true,
  createdAt: new Date("2026-05-15T10:00:00.000Z"),
  updatedAt: new Date("2026-05-15T10:00:00.000Z"),
  category: {
    id: "category-1",
    name: "Education",
  },
  serviceSkills: [
    {
      skill: {
        id: "skill-1",
        name: "Math",
      },
    },
  ],
  customSkills: [],
  serviceAreas: [
    {
      city: "Yangon",
      township: "Hlaing",
    },
  ],
  provider: {
    id: "provider-1",
    username: "provider",
    city: "Yangon",
    township: "Hlaing",
    address: "No. 1",
    latitude: 16.8661,
    longitude: 96.1951,
    createdAt: new Date("2026-05-12T10:00:00.000Z"),
    providerProfile: {
      status: "APPROVED",
      ratingAverage: 4.5,
      ratingCount: 10,
    },
  },
});

describe("public service discovery sorting", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("defaults to recent sort when sort is omitted", () => {
    const parsed = listPublicServicesSchema.parse({ query: {} });
    expect(parsed.query.sort).toBe("recent");
  });

  it("accepts search and rejects legacy q query key", () => {
    const parsed = listPublicServicesSchema.parse({
      query: {
        search: "math tutor",
      },
    });

    expect(parsed.query.search).toBe("math tutor");

    expect(() =>
      listPublicServicesSchema.parse({
        query: {
          q: "math tutor",
        },
      }),
    ).toThrow();
  });

  it("uses ascending price sort for lowest price flow", async () => {
    mockedSearchPublicServiceIds.mockResolvedValue([
      {
        serviceId: "service-1",
        createdAt: new Date("2026-05-15T10:00:00.000Z"),
        providerCreatedAt: new Date("2026-05-10T10:00:00.000Z"),
        price: "10000",
        distanceKm: null,
      },
      {
        serviceId: "service-2",
        createdAt: new Date("2026-05-14T10:00:00.000Z"),
        providerCreatedAt: new Date("2026-05-09T10:00:00.000Z"),
        price: "20000",
        distanceKm: null,
      },
    ]);

    mockedFindPublicServicesByIds.mockResolvedValue([
      buildService("service-2", "20000"),
      buildService("service-1", "10000"),
    ]);

    const result = await listPublicServices({
      search: undefined,
      categoryId: undefined,
      skillIds: [],
      township: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      isAvailable: undefined,
      noCompletedServices: undefined,
      latitude: undefined,
      longitude: undefined,
      sort: "price_asc",
      cursor: undefined,
      limit: 20,
    });

    expect(mockedSearchPublicServiceIds).toHaveBeenCalledWith(
      expect.objectContaining({ sort: "price_asc" }),
    );
    expect(result.data.map((item) => item.id)).toEqual(["service-1", "service-2"]);
    expect(result.data.map((item) => item.price)).toEqual(["10000", "20000"]);
  });

  it("passes search text through to repository query", async () => {
    mockedSearchPublicServiceIds.mockResolvedValue([]);
    mockedFindPublicServicesByIds.mockResolvedValue([]);

    await listPublicServices({
      search: "math",
      categoryId: undefined,
      skillIds: [],
      township: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      isAvailable: undefined,
      noCompletedServices: undefined,
      latitude: undefined,
      longitude: undefined,
      sort: "recent",
      cursor: undefined,
      limit: 20,
    });

    expect(mockedSearchPublicServiceIds).toHaveBeenCalledWith(
      expect.objectContaining({ search: "math" }),
    );
  });

  it("uses descending price sort for highest price flow", async () => {
    mockedSearchPublicServiceIds.mockResolvedValue([
      {
        serviceId: "service-2",
        createdAt: new Date("2026-05-15T10:00:00.000Z"),
        providerCreatedAt: new Date("2026-05-10T10:00:00.000Z"),
        price: "20000",
        distanceKm: null,
      },
      {
        serviceId: "service-1",
        createdAt: new Date("2026-05-14T10:00:00.000Z"),
        providerCreatedAt: new Date("2026-05-09T10:00:00.000Z"),
        price: "10000",
        distanceKm: null,
      },
    ]);

    mockedFindPublicServicesByIds.mockResolvedValue([
      buildService("service-1", "10000"),
      buildService("service-2", "20000"),
    ]);

    const result = await listPublicServices({
      search: undefined,
      categoryId: undefined,
      skillIds: [],
      township: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      isAvailable: undefined,
      noCompletedServices: undefined,
      latitude: undefined,
      longitude: undefined,
      sort: "price_desc",
      cursor: undefined,
      limit: 20,
    });

    expect(mockedSearchPublicServiceIds).toHaveBeenCalledWith(
      expect.objectContaining({ sort: "price_desc" }),
    );
    expect(result.data.map((item) => item.id)).toEqual(["service-2", "service-1"]);
    expect(result.data.map((item) => item.price)).toEqual(["20000", "10000"]);
  });

  it("supports provider_recent and nearest sort flows", async () => {
    mockedSearchPublicServiceIds.mockResolvedValue([
      {
        serviceId: "service-2",
        createdAt: new Date("2026-05-15T10:00:00.000Z"),
        providerCreatedAt: new Date("2026-05-15T10:00:00.000Z"),
        price: "20000",
        distanceKm: 1.2,
      },
      {
        serviceId: "service-1",
        createdAt: new Date("2026-05-14T10:00:00.000Z"),
        providerCreatedAt: new Date("2026-05-14T10:00:00.000Z"),
        price: "10000",
        distanceKm: 3.8,
      },
    ]);
    mockedFindPublicServicesByIds.mockResolvedValue([
      buildService("service-1", "10000"),
      buildService("service-2", "20000"),
    ]);

    const providerRecentResult = await listPublicServices({
      search: undefined,
      categoryId: undefined,
      skillIds: [],
      township: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      isAvailable: undefined,
      noCompletedServices: undefined,
      latitude: undefined,
      longitude: undefined,
      sort: "provider_recent",
      cursor: undefined,
      limit: 20,
    });

    expect(mockedSearchPublicServiceIds).toHaveBeenCalledWith(
      expect.objectContaining({ sort: "provider_recent" }),
    );
    expect(providerRecentResult.data.map((item) => item.id)).toEqual([
      "service-2",
      "service-1",
    ]);

    const nearestResult = await listPublicServices({
      search: undefined,
      categoryId: undefined,
      skillIds: [],
      township: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      isAvailable: undefined,
      noCompletedServices: undefined,
      latitude: 16.86,
      longitude: 96.19,
      sort: "nearest",
      cursor: undefined,
      limit: 20,
    });

    expect(mockedSearchPublicServiceIds).toHaveBeenCalledWith(
      expect.objectContaining({ sort: "nearest", latitude: 16.86, longitude: 96.19 }),
    );
    expect(nearestResult.data[0]?.distanceKm).toBe(1.2);
  });

  it("rejects cursor when sort does not match", async () => {
    const recentCursor = Buffer.from(
      JSON.stringify({
        sort: "recent",
        id: "550e8400-e29b-41d4-a716-446655440000",
        createdAt: "2026-05-15T10:00:00.000Z",
      }),
    ).toString("base64url");

    await expect(
      listPublicServices({
        search: undefined,
        categoryId: undefined,
        skillIds: [],
        township: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        minRating: undefined,
        isAvailable: undefined,
        noCompletedServices: undefined,
        latitude: undefined,
        longitude: undefined,
        sort: "price_asc",
        cursor: recentCursor,
        limit: 20,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
