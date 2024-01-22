import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const BoardIdLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(/bg.jpeg)` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <main className="relative pt-20 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
