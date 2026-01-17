"use client";

import { Button } from "@/components/ui/button";
import { CircleUser, HomeIcon, PlusIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">{children}</div>
      <div className="border-t py-4 px-4 flex gap-2 justify-center">
        <Button
          size="icon-lg"
          onClick={() => router.push("/home")}
          variant={isActive("/home") ? "default" : "outline"}
        >
          <HomeIcon />
        </Button>
        <Button
          size="icon-lg"
          onClick={() => router.push("/upload")}
          variant={isActive("/upload") ? "default" : "outline"}
        >
          <PlusIcon />
        </Button>
        <Button
          size="icon-lg"
          onClick={() => router.push("/profile")}
          variant={isActive("/profile") ? "default" : "outline"}
        >
          <CircleUser />
        </Button>
      </div>
    </div>
  );
}
