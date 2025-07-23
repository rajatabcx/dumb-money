import { Header } from "@/components/common/Header";
import { Hero } from "@/components/common/Hero";
import { getAuthToken } from "@/lib/auth";
import { api } from "../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export default async function Page() {
  const token = await getAuthToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });
  const isSignedIn = !!user;

  return (
    <>
      <Header isSignedIn={isSignedIn} />
      <Hero />
    </>
  );
}
