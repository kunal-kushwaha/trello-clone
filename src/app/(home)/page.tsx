import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../../../public/fonts/font.woff2",
});

const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const HomePage = () => {
  return (
    <div className="h-full bg-slate-100">
      {/* Navbar */}
      <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
          <Logo />
          <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
            <Button size="sm" variant="outline" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <main className="pt-40 pb-20 bg-slate-100">
        <div className="flex items-center justify-center flex-col">
          <div
            className={cn(
              "flex items-center justify-center flex-col",
              headingFont.className
            )}
          >
            <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
              Trello 2.0 helps team move
            </h1>
            <div className="text-3xl md:text-6xl bg-gradient-to-r from-red-600 to-violet-600 text-white px-4 p-2 rounded-xl pb-4 w-fit">
              work forward.
            </div>
          </div>
          <div
            className={cn(
              "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
              textFont.className
            )}
          >
            Collaborate, manage projects, and reach new productivity peaks. From
            high rises to the home office, the way your team works is unique -
            accomplish it all with Trello 2.0.
          </div>
          <Button className="mt-6" size="lg" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
