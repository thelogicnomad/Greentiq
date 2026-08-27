export interface UserProfile {
  name: string;
  avatarUrl?: string;
  role: string;
}

export const currentUser: UserProfile = {
  name: "Akash KS",
  avatarUrl: "/profile.png",
  role: "CRM Admin",
};
