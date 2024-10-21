import Footer from "@/(components)/shared/Footer"
import Header from "@/(components)/shared/Header"

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
    <Header />
    {children}
    <Footer />
    </section>
}