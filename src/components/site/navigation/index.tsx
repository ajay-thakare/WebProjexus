import { ModeToggle } from "@/components/global/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { currentUser, User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navigation = async () => {
  const user = await currentUser();
  return (
    <div className="fixed top-0 right-0 left-0 flex justify-between p-4 items-center z-10">
      {/* left */}
      <aside className="flex items-center gap-2\">
        <Image
          src={"./assets/webpro-logo.svg"}
          alt="Webpro logo"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold">WebPro.</span>
      </aside>
      {/* middle --- incomplete*/}
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex justify-center items-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      {/* right */}
      <aside className="flex gap-2 items-center">
        {!user ? (
          <Link
            href={"/agency"}
            className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80 transition-colors"
          >
            Login
          </Link>
        ) : (
          <UserButton />
        )}
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
