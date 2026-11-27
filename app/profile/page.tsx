import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile-page";

export const metadata: Metadata = { title: "Profile | TIX ID" };
export default function Page() { return <ProfilePage />; }