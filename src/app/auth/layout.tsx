import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth",
  description: "Auth",
};

export default function AuthenticationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
