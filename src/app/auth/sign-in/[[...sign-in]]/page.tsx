import { buttonVariants } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          cardBox: {
            boxShadow: "none",
          },
          card: {
            background: "var(--background)",
            display: "block",
          },
          headerTitle: {
            display: "none",
          },
          headerSubtitle: {
            display: "none",
          },
          dividerRow: {
            display: "none",
          },
          footer: {
            display: "none",
          },
          form: {
            display: "none",
          },
          socialButtons: {
            display: "flex",
            flexDirection: "column",
          },
          socialButtonsBlockButton: {
            background: "var(--foreground)",
            color: "var(--background)",
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
            "&:hover": {
              background: "var(--sidebar-primary)",
            },
          },
        },
      }}
    />
  );
}
