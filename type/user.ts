export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: "local" | "google";
};
export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  authLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
};
