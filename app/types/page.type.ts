export interface PageProps {
  userRole: "admin" | "coordinator" | "student";
  userName: string;
  onLogout: () => void;
}
