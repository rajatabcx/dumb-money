import { Star } from "lucide-react";
import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { freeInvoiceGeneratorRoute } from "@/lib/routeHelpers";

const reviews = {
  count: 200,
  rating: 5.0,
  avatars: [
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
      alt: "Avatar 1",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
      alt: "Avatar 2",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
      alt: "Avatar 3",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
      alt: "Avatar 4",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
      alt: "Avatar 5",
    },
  ],
};

export const Hero = () => (
  <section className="h-screen flex items-center justify-center">
    <div className="container text-center">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <h1 className="text-3xl font-extrabold lg:text-6xl">
          Get Paid Faster with <br />
          Professional Invoices
        </h1>
        <p className="text-muted-foreground text-balance lg:text-lg">
          Stop chasing payments. Create professional invoices, send customers
          instantly, <br /> get paid faster. Perfect for freelancers,
          contractors, and small business owners.
        </p>
      </div>
      <Button asChild size="lg" className="mt-10">
        <a href={freeInvoiceGeneratorRoute()}>Create Invoice</a>
      </Button>
      <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
        <span className="mx-4 inline-flex items-center -space-x-4">
          {reviews.avatars.map((avatar, index) => (
            <Avatar key={index} className="size-14 border">
              <AvatarImage src={avatar.src} alt={avatar.alt} />
            </Avatar>
          ))}
        </span>
        <div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className="size-5 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="mr-1 font-semibold">
              {reviews.rating?.toFixed(1)}
            </span>
          </div>
          <p className="text-muted-foreground text-left font-medium">
            from {reviews.count}+ reviews
          </p>
        </div>
      </div>
    </div>
  </section>
);
