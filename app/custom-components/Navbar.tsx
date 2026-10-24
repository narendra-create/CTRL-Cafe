import React from "react";
import { AvatarDropdown } from "@/components/avatar-dropdown";
import { createClient } from "@/lib/supabase/serverClient";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getInitials } from "@/lib/utils/tools";
import ThemeChangeButton from "@/app/custom-components/ThemeChangeButton";

const Navbar = async () => {
  const supabase = await createClient();
  const data = await supabase.auth.getClaims();
  const claims = data.data?.claims ?? null;
  const name =
    claims?.user_metadata?.name ?? // email/password signup
    claims?.user_metadata?.full_name ?? // Google OAuth
    claims?.user_metadata?.global_name; // Discord OAuth
  const image = claims?.user_metadata?.avatar_url; // Google & Discord only
  // null for email/password users

  return (
    <nav className="md:w-[99%] w-[95%] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.12)] dark:bg-white/3 bg-black/15 backdrop-blur-sm fixed z-50 border dark:border-white/5 border-black/20 rounded-2xl top-1.5 flex justify-between items-center mx-2 py-3 md:py-5 pl-5 pr-2.5 md:pl-10 md:pr-5">
      <Link href={"/"} className="flex gap-4 items-center">
        <div className="bg-yellow-400 dark:bg-yellow-500 rounded-2xl p-1">
          <Image
            src={"/CTRL-CAFE-ICON.webp"}
            alt="CTRL"
            width={38}
            height={38}
          />
        </div>
        <h3 className="hidden md:block font-heading font-semibold text-black/80 dark:text-white">
          CTRL-CAFE
        </h3>
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 md:gap-5">
          <Link
            href={"/plans"}
            className="dark:text-yellow-100 underline underline-offset-3 focus:underline text-yellow-800 tracking-wide font-bold dark:font-medium font-mono md:text-lg"
          >
            PLANS
          </Link>
        </div>
        <div>
          {claims ? (
            <div className="flex items-center justify-center gap-2.5 md:gap-4">
              <AvatarDropdown imageurl={image} name={getInitials(name)} />
              <ThemeChangeButton />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2.5 md:gap-4">
              <Link href={"/auth/login"}>
                <Button className="bg-transparent md:text-xl hover:bg-amber-500 dark:hover:bg-amber-200 hover:text-black dark:text-white text-black border border-amber-600 dark:border-amber-200 font-medium font-heading tracking-wide">
                  Log In
                </Button>
              </Link>
              <ThemeChangeButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
