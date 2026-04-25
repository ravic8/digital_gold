import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@digital-gold/shared";
import { getApiBaseUrl, safeJsonFetch } from "../../../lib/api";
import { getProductImageUrl, getProductVisualMeta } from "../../../lib/showcase";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const apiBase = getApiBaseUrl();
  return safeJsonFetch<Product>(`${apiBase}/api/catalog/products/${id}`, { cache: "no-store" });
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const visual = getProductVisualMeta(product);

  return (
    <section className="detailPage">
      <div className="detailMedia">
        <img src={getProductImageUrl(product)} alt={product.name} className="detailImage" />
      </div>

      <div className="detailPanel">
        <p className="eyebrow">{visual.headline}</p>
        <h2>{product.name}</h2>
        <p className="detailDescription">{product.description}</p>

        <div className="detailMetrics">
          <div>
            <span>Design ID</span>
            <strong>{product.id}</strong>
          </div>
          <div>
            <span>Purity</span>
            <strong>{product.purity.toUpperCase()}</strong>
          </div>
          <div>
            <span>Weight</span>
            <strong>{product.weightGrams}g</strong>
          </div>
          <div>
            <span>Occasion</span>
            <strong>{product.occasions[0] ?? "Custom"}</strong>
          </div>
        </div>

        <p className="price">Rs. {visual.finalPrice.toLocaleString()}</p>
        <p className="subPrice">
          Estimated range: Rs. {product.priceMin.toLocaleString()} - Rs. {product.priceMax.toLocaleString()} • Making
          Rs. {visual.makingCharge.toLocaleString()}
        </p>
        <p className="craft">{visual.craftNote}</p>

        <div className="chipRow">
          {product.styles.map((style) => (
            <span key={style} className="chip">
              {style}
            </span>
          ))}
        </div>

        <div className="actions">
          <Link href={`/enquiry?productId=${product.id}`} className="button">
            Enquire on this design
          </Link>
          <Link href="/book-appointment" className="button alt">
            Book consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
