export default async function Page({
  params,
}: {
  params: { agencyId: string };
}) {
  // Await the params resolution
  const { agencyId } = await Promise.resolve(params);
  return <div>{agencyId}</div>;
}
