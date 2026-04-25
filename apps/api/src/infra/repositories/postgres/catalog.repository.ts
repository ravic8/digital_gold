import { Product, ProductSearchQuery } from "@digital-gold/shared";
import { getDbPool } from "../../postgres/client";
import { CatalogRepository } from "../types";

interface ProductRow {
  id: string;
  name: string;
  category: Product["category"];
  price_min: string;
  price_max: string;
  purity: Product["purity"];
  weight_grams: string;
  styles: string[];
  occasions: string[];
  images: string[];
  description: string;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    priceMin: Number(row.price_min),
    priceMax: Number(row.price_max),
    purity: row.purity,
    weightGrams: Number(row.weight_grams),
    styles: row.styles,
    occasions: row.occasions,
    images: row.images,
    description: row.description
  };
}

export class PostgresCatalogRepository implements CatalogRepository {
  async list(query: ProductSearchQuery): Promise<Product[]> {
    const where: string[] = [];
    const values: Array<string | number> = [];

    if (query.category) {
      values.push(query.category);
      where.push(`category = $${values.length}`);
    }
    if (query.purity) {
      values.push(query.purity);
      where.push(`purity = $${values.length}`);
    }
    if (query.minPrice !== undefined) {
      values.push(query.minPrice);
      where.push(`price_min >= $${values.length}`);
    }
    if (query.maxPrice !== undefined) {
      values.push(query.maxPrice);
      where.push(`price_max <= $${values.length}`);
    }
    if (query.style) {
      values.push(query.style);
      where.push(`$${values.length} = ANY(styles)`);
    }
    if (query.q) {
      values.push(`%${query.q}%`);
      where.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length} OR array_to_string(styles, ' ') ILIKE $${values.length})`);
    }

    const sql = `
      SELECT id, name, category, price_min, price_max, purity, weight_grams, styles, occasions, images, description
      FROM products
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY created_at DESC
      LIMIT 200
    `;

    const result = await getDbPool().query<ProductRow>(sql, values);
    return result.rows.map(toProduct);
  }

  async getById(id: string): Promise<Product | null> {
    const result = await getDbPool().query<ProductRow>(
      `SELECT id, name, category, price_min, price_max, purity, weight_grams, styles, occasions, images, description
       FROM products WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (!result.rowCount) {
      return null;
    }

    return toProduct(result.rows[0]);
  }

  async create(product: Product): Promise<Product> {
    const result = await getDbPool().query<ProductRow>(
      `INSERT INTO products (
         id, name, category, price_min, price_max, purity, weight_grams, styles, occasions, images, description
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, category, price_min, price_max, purity, weight_grams, styles, occasions, images, description`,
      [
        product.id,
        product.name,
        product.category,
        product.priceMin,
        product.priceMax,
        product.purity,
        product.weightGrams,
        product.styles,
        product.occasions,
        product.images,
        product.description
      ]
    );

    return toProduct(result.rows[0]);
  }

  async update(id: string, patch: Partial<Omit<Product, "id">>): Promise<Product | null> {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const merged: Product = { ...existing, ...patch, id };
    const result = await getDbPool().query<ProductRow>(
      `UPDATE products
       SET name = $2,
           category = $3,
           price_min = $4,
           price_max = $5,
           purity = $6,
           weight_grams = $7,
           styles = $8,
           occasions = $9,
           images = $10,
           description = $11,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, category, price_min, price_max, purity, weight_grams, styles, occasions, images, description`,
      [
        id,
        merged.name,
        merged.category,
        merged.priceMin,
        merged.priceMax,
        merged.purity,
        merged.weightGrams,
        merged.styles,
        merged.occasions,
        merged.images,
        merged.description
      ]
    );

    return result.rowCount ? toProduct(result.rows[0]) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await getDbPool().query("DELETE FROM products WHERE id = $1", [id]);
    return Boolean(result.rowCount && result.rowCount > 0);
  }
}
