export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BotForge",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
      isProtected: true,
    },
  ],
};
