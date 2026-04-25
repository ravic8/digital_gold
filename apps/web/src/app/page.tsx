import Link from "next/link";
import { Product } from "@digital-gold/shared";
import { getApiBaseUrl, safeJsonFetch } from "../lib/api";
import { getProductImageUrl, getProductVisualMeta } from "../lib/showcase";
import AiStylistPanel from "./AiStylistPanel";

interface ProductListResponse {
  items: Product[];
}

async function getProducts(): Promise<Product[]> {
  const apiBase = getApiBaseUrl();
  const data = await safeJsonFetch<ProductListResponse>(`${apiBase}/api/catalog/products`, { cache: "no-store" });
  return data?.items ?? [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <section className="home">
      <div className="topDeck">
        <div className="hero">
          <p className="eyebrow">DIGITAL GOLD EDITION</p>
          <h2>Premium Jewellery Discovery for Modern Buyers</h2>
          <p>
            Discover curated designs, compare craftsmanship, and move from inspiration to consultation in one seamless
            experience.
          </p>

          <div className="actions">
            <Link href="/enquiry" className="button">
              Start Enquiry
            </Link>
            <Link href="/book-appointment" className="button alt">
              Reserve Consultation
            </Link>
          </div>

          <div className="heroStats">
            <div>
              <strong>10,000+</strong>
              <span>Designs Ready</span>
            </div>
            <div>
              <strong>AI Guided</strong>
              <span>Personalized Discovery</span>
            </div>
            <div>
              <strong>Lead Driven</strong>
              <span>Built for Store Conversions</span>
            </div>
          </div>
        </div>

        <AiStylistPanel products={products.map((product) => ({ id: product.id, name: product.name }))} />
      </div>

      <div className="sectionHeader">
        <h3>Featured Catalogue</h3>
        <p>Premium preview cards with visualized pricing and craftsmanship details.</p>
      </div>

      <ul className="catalogGrid">
        {products.map((product) => {
          const visual = getProductVisualMeta(product);
          return (
            <li key={product.id} className="catalogCard">
              <img src={getProductImageUrl(product)} alt={product.name} className="catalogImage" loading="lazy" />
              <div className="catalogOverlay">
                <p className="pill">{visual.headline}</p>
                <h4>{product.name}</h4>
                <p className="catalogMeta">
                  {product.purity.toUpperCase()} • {product.weightGrams}g • Popularity {visual.popularity}%
                </p>
                <p className="price">Rs. {visual.finalPrice.toLocaleString()}</p>
                <p className="subPrice">Making charges from Rs. {visual.makingCharge.toLocaleString()}</p>
                <p className="craft">{visual.craftNote}</p>
                <Link href={`/catalog/${product.id}`} className="link light">
                  View premium details
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
