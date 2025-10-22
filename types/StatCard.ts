import { ReactNode } from "react";

export interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  color?: string;
}