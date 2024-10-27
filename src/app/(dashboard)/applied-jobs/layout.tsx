import BlueHeader from "@/(components)/shared/BlueHeader"

export default function   AppliedjobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
    <BlueHeader />
    {children}</section>
}