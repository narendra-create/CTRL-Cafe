import React from "react";
import { AvatarDropdown } from "@/components/avatar-dropdown";
import { createClient } from "@/lib/supabase/serverClient";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getInitials } from "@/lib/utils/tools";

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
    <nav className="md:w-[99%] w-[95%] dark:bg-white/3 bg-black/3 backdrop-blur-sm fixed z-50 border dark:border-white/5 border-black/5 rounded-2xl top-1.5 flex justify-between items-center mx-2 py-3 md:py-5 px-5 md:px-10 md:mx-auto">
      <Link href={"/"} className="flex gap-4 items-center">
        <div className="bg-yellow-500 rounded-2xl p-1">
          <Image
            src={"/CTRL-CAFE-ICON.webp"}
            alt="CTRL"
            width={38}
            height={38}
          />
        </div>
        <h3 className="hidden md:block font-heading font-semibold text-black dark:text-white">
          CTRL-CAFE
        </h3>
      </Link>
      <div className="flex items-center gap-5">
        <div>
          <Link
            href={"/plans"}
            className="dark:text-yellow-100 focus:underline text-yellow-800 tracking-wide font-mono"
          >
            PLANS
          </Link>
        </div>
        <div>
          {claims ? (
            <AvatarDropdown imageurl={image} name={getInitials(name)} />
          ) : (
            <Link href={"/auth/login"}>
              <Button className="bg-transparent hover:bg-amber-200 hover:text-black dark:text-white text-black border border-amber-200 font-medium font-heading tracking-wide">
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
