import { Bars3Icon, HomeIcon } from "@heroicons/react/20/solid";
import { Drawer } from "@material-tailwind/react";
import { useState } from "react";
import { Link, useOutlet } from "react-router-dom";

export default function AdminLayout(): JSX.Element {
  const outlet = useOutlet();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  return (
    <div className="w-screen">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="flex flex-col gap-4 items-center w-full py-8">
          <Link to="/admin/products">
            <h2 className="text-lg font-semibold text-light-blue-700 underline">
              Products
            </h2>
          </Link>
          <Link to="/admin/sales">
            <h2 className="text-lg font-semibold text-light-blue-700 underline">
              Sales
            </h2>
          </Link>
          <Link to="/admin/categories">
            <h2 className="text-lg font-semibold text-light-blue-700 underline">
              Categories
            </h2>
          </Link>
        </div>
      </Drawer>
      <div className="relative flex w-full justify-center shadow-lg items-center py-4 px-8 bg-secondary">
        <div className="flex gap-6 items-center absolute inset-0 my-auto left-4">
          <button>
            <Bars3Icon
              className="text-primary h-6 w-6"
              onClick={() => setDrawerOpen(true)}
            />
          </button>
          <Link to="/">
            <HomeIcon className="text-primary h-6 w-6 hover:text-cyan-900 transition-all" />
          </Link>
        </div>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      {outlet}
    </div>
  );
}
