export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("do some auth checks idk");
  return <>{children}</>;
}
