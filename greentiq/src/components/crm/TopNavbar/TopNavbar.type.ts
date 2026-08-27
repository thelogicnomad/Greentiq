import { UserProfile } from "@/lib/mock-user";

export interface TopNavbarProps {
  user?: UserProfile;
  onOpenAddModal?: () => void;
  className?: string;
}
