import {
  BarChart3,
  Building2,
  Calculator,
  Coins,
  FolderTree,
  HelpCircle,
  LayoutGrid,
  Library,
  MessageSquare,
  Settings,
  Layers,
  Tags,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

export const SIDEBAR: {
  admin: SidebarGroup[];
  public: SidebarGroup[];
} = {
  admin: [
    {
      label: "Overview",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          icon: LayoutGrid,
        },
      ],
    },

    {
      label: "Management",
      items: [
        {
          title: "Inquiries",
          url: "/admin/inquiries",
          icon: MessageSquare,
        },
        {
          title: "Service Categories",
          url: "/admin/service-categories",
          icon: Tags,
        },
        {
          title: "Service Types",
          url: "/admin/service-types",
          icon: Layers,
        },
        {
          title: "Industries",
          url: "/admin/industries",
          icon: Building2,
        },
        {
          title: "Pricing Rules",
          url: "/admin/packages",
          icon: Coins,
        },
        {
          title: "Feature Library",
          url: "/admin/package-features",
          icon: Library,
        },
        {
          title: "Add-ons",
          url: "/admin/addons",
          icon: FolderTree,
        },
        {
          title: "Calculations",
          url: "/admin/calculations",
          icon: Calculator,
        },
        {
          title: "Project Metadata",
          url: "/admin/price-config",
          icon: Settings,
        },
      ],
    },
  ],

  public: [
    {
      label: "Workspace",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutGrid,
        },
        {
          title: "Calculator",
          url: "/public/calculator",
          icon: Calculator,
        },
        {
          title: "My Estimates",
          url: "/public/estimates",
          icon: BarChart3,
        },
      ],
    },

    {
      label: "Support",
      items: [
        {
          title: "Help Center",
          url: "/faq",
          icon: HelpCircle,
        },
      ],
    },
  ],
};