import BlueHeader from "@/(components)/shared/BlueHeader"
import Footer from "@/(components)/shared/Footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <section>
    <BlueHeader />
    {children}
    <Footer />
  </section>)
}