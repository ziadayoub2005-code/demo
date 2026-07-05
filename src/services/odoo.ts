export interface OdooOrderOption {
  name: string;
  nameEn: string;
  price: number;
}

export interface OdooOrderItem {
  id: string | number;
  qty: number;
  instructions?: string;
  name: string;
  nameEn: string;
  price: number;
  options?: OdooOrderOption[];
}

export interface OdooOrderPayload {
  table: number | string;
  order_type?: string;
  delivery_address?: string;
  pickup_time?: string;
  payment_method?: string;
  customer_note?: string;
  customer_phone?: string;
  items: OdooOrderItem[];
}

/**
 * Submits the cart order to Odoo local server.
 */
export async function submitOrderToOdoo(payload: OdooOrderPayload): Promise<boolean> {
  console.log("Sending order to Odoo:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch("/api/odoo/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_number: payload.table,
        order_type: payload.order_type,
        delivery_address: payload.delivery_address,
        pickup_time: payload.pickup_time,
        payment_method: payload.payment_method,
        customer_note: payload.customer_note,
        customer_phone: payload.customer_phone,
        items: payload.items.map(item => ({
          product_id: item.id, // Will fallback to name search on backend if ID is string
          name: item.name,
          nameEn: item.nameEn,
          quantity: item.qty,
          price: item.price,
          instructions: item.instructions,
          options: item.options?.map(opt => ({
            name: opt.name,
            nameEn: opt.nameEn,
            price: opt.price
          }))
        }))
      }),
    });

    if (!response.ok) {
      const rawText = await response.text();
      console.error("Odoo API returned error status:", response.status, "Raw response:", rawText);
      try {
        const errData = JSON.parse(rawText);
        console.error("Odoo API parsed error:", errData);
      } catch (e) {
        // Not a JSON response
      }
      return false;
    }

    const resData = await response.json();
    console.log("Order successfully registered in Odoo POS:", resData);
    return true;
  } catch (error) {
    console.error("Failed to connect to Odoo backend:", error);
    return false;
  }
}
export interface OdooPosAttributeValue {
  id: number;
  name: string;
  price_extra: number;
}

export interface OdooPosAttribute {
  id: number;
  name: string;
  values: OdooPosAttributeValue[];
}

export interface OdooPosProduct {
  id: number;
  name: string;
  price: number;
  pos_categ_id: number | false;
  description: string;
  attributes: OdooPosAttribute[];
  image_url: string;
}

export interface OdooPosCategory {
  id: number;
  name: string;
}

export async function fetchPosMenu(): Promise<{ categories: OdooPosCategory[], products: OdooPosProduct[] } | null> {
  try {
    const res = await fetch("/api/odoo/menu", { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success') {
      return {
        categories: data.categories,
        products: data.products
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch POS menu:", error);
    return null;
  }
}
