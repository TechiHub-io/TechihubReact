import UserProfileCheck from "../user-profile/(components)/UserProfileCheck"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
    {/* <UserProfileCheck> */}
     {children}
    {/* </UserProfileCheck>  */}
    </section>
}