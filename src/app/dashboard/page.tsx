import { invoiceRoute } from "@/lib/routeHelpers";
import { redirect } from "next/navigation";

const page = () => {
  redirect(invoiceRoute());
};

export default page;
