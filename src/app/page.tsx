import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  title: "How to Dev",
  description:
    "Juan Kalleo's personal documentation of the frontend, API, and infrastructure standards used as a project reference.",
};

export default function HomePage() {
  return (
    <>
      <Navbar activeHref="/" />
      <HomeContent />
      <Footer />
    </>
  );
}
