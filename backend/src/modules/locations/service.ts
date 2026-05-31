import { BadRequestError } from "../../common/errors/app-error";
import { env } from "../../config/env";

type ReverseGeocodeResult = {
  city: string;
  township: string;
  address: string | null;
};

type MapboxContextItem = {
  name?: string;
};

type MapboxFeature = {
  properties?: {
    feature_type?: string;
    full_address?: string;
    name?: string;
    context?: {
      place?: MapboxContextItem;
      locality?: MapboxContextItem;
      district?: MapboxContextItem;
      neighborhood?: MapboxContextItem;
      region?: MapboxContextItem;
      country?: MapboxContextItem;
    };
  };
};

type MapboxResponse = {
  message?: string;
  features?: MapboxFeature[];
};

export const reverseGeocodeCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> => {
  validateCoordinates(latitude, longitude);

  const url = new URL("https://api.mapbox.com/search/geocode/v6/reverse");
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("access_token", env.MAPBOX_ACCESS_TOKEN);
  url.searchParams.set("language", "en");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const mapboxMessage = await extractMapboxMessage(response);
    throw new BadRequestError(
      mapboxMessage
        ? `Unable to detect location from coordinates: ${mapboxMessage}`
        : "Unable to detect location from coordinates",
    );
  }

  const payload = (await response.json()) as MapboxResponse;
  const features = payload.features ?? [];

  const city = findCity(features);
  const township = findTownship(features);

  if (!city || !township) {
    throw new BadRequestError(
      "Unable to detect city and township from coordinates",
    );
  }

  return {
    city,
    township,
    address: getTrimmed(features[0]?.properties?.full_address) ?? null,
  };
};

const validateCoordinates = (latitude: number, longitude: number): void => {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new BadRequestError("Latitude must be between -90 and 90");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new BadRequestError("Longitude must be between -180 and 180");
  }
};

const findCity = (features: MapboxFeature[]): string | null => {
  for (const feature of features) {
    const city = getTrimmed(feature.properties?.context?.place?.name);
    if (city) {
      return city;
    }
  }

  for (const feature of features) {
    if (feature.properties?.feature_type === "place") {
      const city = getTrimmed(feature.properties?.name);
      if (city) {
        return city;
      }
    }
  }

  return null;
};

const findTownship = (features: MapboxFeature[]): string | null => {
  for (const feature of features) {
    const locality = getTrimmed(feature.properties?.context?.locality?.name);
    if (locality) {
      return locality;
    }
  }

  for (const feature of features) {
    const district = getTrimmed(feature.properties?.context?.district?.name);
    if (district) {
      return district;
    }
  }

  for (const feature of features) {
    const neighborhood = getTrimmed(
      feature.properties?.context?.neighborhood?.name,
    );
    if (neighborhood) {
      return neighborhood;
    }
  }

  for (const feature of features) {
    const featureType = feature.properties?.feature_type;
    if (
      featureType === "locality" ||
      featureType === "district" ||
      featureType === "neighborhood"
    ) {
      const township = getTrimmed(feature.properties?.name);
      if (township) {
        return township;
      }
    }
  }

  return null;
};

const getTrimmed = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const extractMapboxMessage = async (response: Response): Promise<string | null> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as MapboxResponse;
      return getTrimmed(payload.message) ?? response.statusText;
    } catch {
      return response.statusText || null;
    }
  }

  return getTrimmed(response.statusText);
};
