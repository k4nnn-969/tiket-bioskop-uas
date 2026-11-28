import CinemaExplorer from "@/components/CinemaExplorer";

export default async function CinemaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CinemaExplorer initialSlug={slug} />;
}