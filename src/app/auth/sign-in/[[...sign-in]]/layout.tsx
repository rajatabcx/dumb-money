"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { signUpRoute } from "@/lib/routeHelpers";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthenticationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="relative container flex-1 shrink-0 items-center justify-center grid grid-cols-1 max-w-none lg:grid-cols-2 h-screen">
      <Link
        href={signUpRoute()}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 md:top-8 md:right-8 hidden lg:block"
        )}
      >
        Sign Up
      </Link>
      <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
        <div className="bg-primary/5 absolute inset-0" />
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-20 cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
        </Link>
        <img
          src="https://images.unsplash.com/photo-1653549892896-dde02867edee?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Authentication"
          className="w-full h-full object-cover absolute left-0 top-0 z-10"
        />
      </div>
      <div className="flex items-center justify-center lg:p-8">
        <div className="mx-auto flex flex-col justify-center gap-6 w-full">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to Dumb Money
            </h1>
            <p className="text-muted-foreground text-sm">
              Welcome back! Please sign in to continue
            </p>
          </div>
          <div className="w-full flex justify-center">{children}</div>
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
