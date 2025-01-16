import { ID } from "@/lib/fetch/types";

export { type UserType } from "../../schema";

export type ConnectProductType = {
  id: ID;
  product_id: ID;
  name: string;
  title: string;
}
