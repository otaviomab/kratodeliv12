import { ReactNode } from "react";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
} 