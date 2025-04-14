// Enums
export enum UserRole {
  CLIENT = "client",
  ADMIN = "admin",
  COACH = "coach",
}

export enum SidebarTab {
  GENERAL_INFO = "GENERAL INFORMATION",
  CLIENT_FEEDBACK = "CLIENT FEEDBACK",
  CHANGE_PASSWORD = "CHANGE PASSWORD",
}

// Types
export type SidebarProps = {
  position?: UserRole;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
};

export type Tab = {
  name: SidebarTab;
  path?: string;
};
