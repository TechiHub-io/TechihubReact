import Footer from "@/(components)/shared/Footer"
import Header from "@/(components)/shared/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <section>
    <Header />
    {children}
    <Footer />
  </section>)
}