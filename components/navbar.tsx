"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  link as linkStyles,
} from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";

import { AppLogo } from "@/components/icons";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { dark, neobrutalism, shadesOfPurple } from "@clerk/themes";
import { useTheme } from "next-themes";
import { title } from "./primitives";

export const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { theme } = useTheme();

  return (
    <NextUINavbar maxWidth="xl" position="sticky" isBlurred isBordered>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <span>
              <AppLogo className="text-orange-600" />
            </span>
            <p className={`${title({ color: "yellow" })} !text-lg`}>BotForge</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden sm:flex gap-4 justify-start items-center ml-2">
          {siteConfig.navItems.map((item) => {
            if (item?.isProtected && !isSignedIn) return null;

            return (
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
            );
          })}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {isSignedIn ? (
          <NavbarItem className="hidden sm:flex">
            <UserButton
              appearance={{ baseTheme: theme === "dark" ? dark : neobrutalism }}
            />
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden sm:flex font-semibold">
              <SignInButton mode="redirect" redirectUrl="/dashboard" />
            </NavbarItem>
            <NavbarItem className="hidden sm:flex font-semibold">
              <SignUpButton mode="redirect" redirectUrl="/dashboard" />
            </NavbarItem>
          </>
        )}
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <ul className="flex flex-col  gap-4 justify-center items-center ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium text-xl"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>

        <div className="mt-auto flex justify-between py-4 ">
          {isSignedIn ? (
            <NavbarItem className="flex px-4 py-2 w-full justify-center">
              <UserButton
                appearance={{
                  baseTheme: theme === "dark" ? dark : neobrutalism,
                }}
              />
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className="flex font-semibold px-4 py-2 w-full justify-center">
                <SignInButton mode="modal" />
              </NavbarItem>
              <NavbarItem className="flex font-semibold px-4 py-2 w-full justify-center">
                <SignUpButton mode="modal" />
              </NavbarItem>
            </>
          )}
          <NavbarItem className="flex gap-2 px-4 py-2 w-full justify-center">
            <ThemeSwitch />
          </NavbarItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
