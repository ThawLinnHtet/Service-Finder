export type SafeUser = {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  location: {
    city: string;
    township: string;
    address: string | null;
    latitude: string;
    longitude: string;
  };
  createdAt: Date;
  providerStatus?: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

export type UploadedImage = {
  url: string;
  publicId: string;
};
