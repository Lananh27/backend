type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Document Detail</h1>
      <p className="mt-4">Slug: {slug}</p>
    </div>
  );
}