"use client";

import NextLink from "next/link";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";

import { ThemeSwitch } from "@/components/theme-switch";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import clsx from "clsx";

import { AppLogo } from "./icons";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useAuth,
} from "@clerk/clerk-react";

export const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <span>
              <AppLogo className="text-orange-600" />
            </span>
            <p className="font-bold text-inherit text-orange-600">BotForge</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        {isSignedIn ? (
          <NavbarItem className="hidden md:flex">
            <SignOutButton />
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden md:flex font-semibold">
              <SignInButton mode="modal" />
            </NavbarItem>
            <NavbarItem className="hidden md:flex font-semibold">
              <SignUpButton mode="modal" />
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
    </NextUINavbar>
  );
};
