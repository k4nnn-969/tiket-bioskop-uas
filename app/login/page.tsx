import type { Metadata } from "next";
import { LoginPage } from "./login-page";

export const metadata: Metadata = {
  title: "Login Lokal | TIX ID",
  description: "Masuk atau buat akun demo lokal TIX ID.",
};

export default function Page() {
  return <LoginPage />;
}
