import type { CategoryKey } from "../Data/Products";

export type Page =
  | { name: "home" }
  | { name: "catalog"; category?: CategoryKey | "all" }
  | { name: "product"; id: number }
  | { name: "cart" }
  | { name: "about" }
  | { name: "contact" }
  | { name: "success"; orderId: string }

export type Nav = (page: Page) => void;
