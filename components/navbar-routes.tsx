"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search-input";
import { useEffect, useState } from "react";
import { isTeacher } from "@/lib/teacher";

interface NavbarRoutesProps {}

const NavbarRoutes = (props: NavbarRoutesProps) => {
  const { userId } = useAuth();
  const isTeach = isTeacher(userId);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
        ) : isTeach ? (
          <Link href={"/teacher/courses"}>
            <Button size={"sm"} variant={"ghost"}>
              Teacher mode
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl='/' />
      </div>
    </>
  );
};
export default NavbarRoutes;
