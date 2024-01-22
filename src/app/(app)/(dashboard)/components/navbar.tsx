import { UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/logo";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 flex items-center">
      <div className="flex items-center w-full border border-white/30 bg-black/10 backdrop-blur shadow-sm rounded-full px-2 py-1">
        <div className="flex items-center gap-x-4">
          <div className="hidden md:flex">
            <Logo />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-x-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: {
                  height: 30,
                  width: 30,
                },
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
};
