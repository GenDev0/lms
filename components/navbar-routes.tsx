"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search-input";
import { useEffect, useState } from "react";

interface NavbarRoutesProps {}

const NavbarRoutes = (props: NavbarRoutesProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  useEffect(() => {
    if (!isMounted) return;
  }, []);

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"ghost"}>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={"/teacher/courses"}>
            <Button size={"sm"} variant={"ghost"}>
              Teacher mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl='/' />
      </div>
    </>
  );
};
export default NavbarRoutes;
