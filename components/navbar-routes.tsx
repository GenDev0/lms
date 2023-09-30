"use client";

import { UserButton } from "@clerk/nextjs";

interface NavbarRoutesProps {}

const NavbarRoutes = (props: NavbarRoutesProps) => {
  return (
    <div className='flex gap-x-2 ml-auto'>
      <UserButton />
    </div>
  );
};
export default NavbarRoutes;
