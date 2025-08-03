"use client";

import { SelectCurrency } from "@/components/common/SelectCurrency";
import { useZodForm } from "@/hooks/useZodForm";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { use } from "react";
import { z } from "zod";
import { CountrySelector } from "@/components/common/SelectCountry";
import { uniqueCurrencies } from "@/lib/currencies";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useRouter } from "next/navigation";
import { invoiceRoute } from "@/lib/routeHelpers";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  countryCode: z.string(),
  baseCurrency: z.string(),
});

type Props = {
  defaultCurrencyPromise: Promise<string>;
  defaultCountryCodePromise: Promise<string>;
};

export function CreateCompanyForm({
  defaultCurrencyPromise,
  defaultCountryCodePromise,
}: Props) {
  const router = useRouter();

  const currency = use(defaultCurrencyPromise);
  const countryCode = use(defaultCountryCodePromise);

  const { mutate: createTeam, isPending: isCreatingTeam } = useApiMutation(
    api.company.create
  );
  const { mutate: onboardUser, isPending: isOnboardingUser } = useApiMutation(
    api.user.onboardUser
  );

  const form = useZodForm(formSchema, {
    defaultValues: {
      name: "",
      baseCurrency: currency,
      countryCode: countryCode ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createTeam({
      name: values.name,
      currency: values.baseCurrency,
      countryCode: values.countryCode,
    });

    await onboardUser();

    toast.success("Company created successfully");
    router.push(invoiceRoute());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-4 w-full">
              <FormLabel className="text-xs text-muted-foreground font-normal">
                Company name
              </FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Ex: Acme Marketing or Acme Co"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem className="mt-4 w-full">
              <FormLabel className="text-xs text-muted-foreground font-normal">
                Country
              </FormLabel>
              <FormControl className="w-full">
                <CountrySelector
                  defaultValue={field.value ?? ""}
                  onSelect={(code, name) => {
                    field.onChange(name);
                    form.setValue("countryCode", code);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseCurrency"
          render={({ field }) => (
            <FormItem className="mt-4 border-b border-border pb-4">
              <FormLabel className="text-xs text-muted-foreground font-normal">
                Base currency
              </FormLabel>
              <FormControl>
                <SelectCurrency currencies={uniqueCurrencies} {...field} />
              </FormControl>

              <FormDescription>
                If you have multiple accounts in different currencies, this will
                be the default currency for your company. You can change it
                later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          className="mt-6 w-full cursor-pointer"
          type="submit"
          isSubmitting={isCreatingTeam || isOnboardingUser}
        >
          Create
        </SubmitButton>
      </form>
    </Form>
  );
}
