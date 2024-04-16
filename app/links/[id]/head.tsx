import links from "@/links.json";
import { notFound } from "next/navigation";

export default function LinkHead({ params }: { params: { id: string } }) {
  const link = links[params.id];

  if (link == null) {
    return notFound();
  }

  return (
    <>
      <meta property="og:title" content={link.title} />
      <meta property="og:site_name" content="Doge Sound Club" />
      <meta property="og:description" content={link.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@dogesoundclub" />
      <meta
        property="og:image"
        content={`https://rauchg.com/og/${link.image}`}
      />
    </>
  );
}
