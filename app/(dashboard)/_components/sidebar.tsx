import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

interface SidebarProps {}
const Sidebar = (props: SidebarProps) => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
      <div className='p-6'>
        <Logo />
      </div>
      <div className='flex flex-col w-full'>
        <SidebarRoutes />
      </div>
    </div>
  );
};
export default Sidebar;
