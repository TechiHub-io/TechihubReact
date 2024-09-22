import Footer from "@/(components)/shared/Footer";
import Header from "@/(components)/shared/Header";
import { ReactNode } from "react";

export default function Layout({ children }: {children: ReactNode}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}