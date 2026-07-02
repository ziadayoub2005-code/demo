export interface OdooOrderItem {
  id: string | number;
  qty: number;
  instructions?: string;
  name: string;
  nameEn: string;
  price: number;
}

export interface OdooOrderPayload {
  table: number | string;
  customer_note?: string;
  items: OdooOrderItem[];
}

/**
 * Submits the cart order to Odoo local server.
 */
export async function submitOrderToOdoo(payload: OdooOrderPayload): Promise<boolean> {
  console.log("Sending order to Odoo:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch("http://localhost:8069/api/create_pos_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_number: payload.table,
        customer_note: payload.customer_note,
        items: payload.items.map(item => ({
          product_id: item.id, // Will fallback to name search on backend if ID is string
          name: item.name,
          nameEn: item.nameEn,
          quantity: item.qty,
          price: item.price
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

