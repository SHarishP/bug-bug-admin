"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Product",
      active: pathname === "/",
    },
    {
      href: "/insight",
      label: "Insight",
      active: pathname === "/insight",
    },
    {
      href: "/category",
      label: "Category",
      active: pathname === "/category",
    },
    {
      href: "/testimonial",
      label: "Testimonial",
      active: pathname === "/testimonial",
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route, idx) => (
        <Link
          key={idx}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-black",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
