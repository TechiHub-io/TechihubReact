import Footer from "@/(components)/shared/Footer"
import UserProfileCheck from "./(components)/UserProfileCheck"
import BlueHeader from "@/(components)/shared/BlueHeader"

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
    <UserProfileCheck>
      <BlueHeader />
      {children}
    </UserProfileCheck>
    </section>
}