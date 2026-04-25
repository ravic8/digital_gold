import EnquiryForm from "./EnquiryForm";

interface Props {
  searchParams: Promise<{ productId?: string }>;
}

export default async function EnquiryPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <section>
      <EnquiryForm initialProductId={params.productId} />
    </section>
  );
}
