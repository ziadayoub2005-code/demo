import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odooClient";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Received order payload:", payload);

    // 1. Find an open POS session
    let sessionId = false;
    const sessions = await odooCall("pos.session", "search_read", [[["state", "=", "opened"]]], { fields: ["id"] });
    if (sessions.length > 0) {
      sessionId = sessions[0].id;
    } else {
      throw new Error("No open POS session found. Please open a POS session in Odoo first.");
    }

    // 2. Find the restaurant table if table_number is provided
    let tableId = false;
    if (payload.table_number) {
      // Try to find the table by table_number (which might be an integer or string)
      const tables = await odooCall("restaurant.table", "search_read", [], { fields: ["id", "table_number", "display_name"] });
      const tableStr = String(payload.table_number).trim();
      
      const foundTable = tables.find((t: any) => 
        String(t.table_number) === tableStr || 
        String(t.display_name).includes(tableStr)
      );
      
      if (foundTable) {
        tableId = foundTable.id;
      }
    }

    // 3. Find or create a customer (res.partner) based on phone number
    let partnerId = 3; // Default Administrator if no phone
    if (payload.customer_phone) {
      const partners = await odooCall("res.partner", "search_read", [[["phone", "=", payload.customer_phone]]], { fields: ["id"] });
      if (partners.length > 0) {
        partnerId = partners[0].id;
      } else {
        partnerId = await odooCall("res.partner", "create", [{
          name: payload.customer_phone,
          phone: payload.customer_phone,
        }]);
      }
    }

    // 4. Resolve product.product IDs
    const templateIds: number[] = [];
    const productNames: string[] = [];
    
    payload.items.forEach((item: any) => {
      const parsedId = parseInt(item.product_id);
      if (!isNaN(parsedId)) {
        templateIds.push(parsedId);
      } else {
        productNames.push(item.name);
        if (item.nameEn) productNames.push(item.nameEn);
      }
    });

    let templateToProductMap: Record<number, number> = {};
    let nameToProductMap: Record<string, number> = {};

    if (templateIds.length > 0) {
      const products = await odooCall("product.product", "search_read", [[["product_tmpl_id", "in", templateIds]]], { fields: ["id", "product_tmpl_id"] });
      products.forEach((p: any) => {
        templateToProductMap[p.product_tmpl_id[0]] = p.id;
      });
    }

    if (productNames.length > 0) {
      const productsByName = await odooCall("product.product", "search_read", [[["name", "in", productNames]]], { fields: ["id", "name"] });
      productsByName.forEach((p: any) => {
        nameToProductMap[p.name] = p.id;
      });
    }

    // 5. Map items to Odoo pos.order.line format
    let amountTotal = 0;
    const orderLines = payload.items.map((item: any) => {
      let description = item.name;
      let optionsPrice = 0;
      
      if (item.options && item.options.length > 0) {
        description += "\nالإضافات:\n" + item.options.map((opt: any) => {
          optionsPrice += (opt.price || 0);
          return `- ${opt.name}`;
        }).join("\n");
      }
      
      if (item.instructions) {
        description += `\nملاحظات: ${item.instructions}`;
      }

      let productId = null;
      const parsedId = parseInt(item.product_id);
      if (!isNaN(parsedId)) {
        productId = templateToProductMap[parsedId] || parsedId;
      } else {
        productId = nameToProductMap[item.name] || nameToProductMap[item.nameEn];
      }

      if (!productId) {
        throw new Error(`Product not found in Odoo for item: ${item.name}`);
      }

      const unitPrice = (item.price || 0) + optionsPrice;
      const subtotal = unitPrice * item.quantity;
      amountTotal += subtotal;

      return [0, 0, {
        product_id: productId,
        qty: item.quantity,
        price_unit: unitPrice,
        price_subtotal: subtotal,
        price_subtotal_incl: subtotal,
        note: description,
        customer_note: description,
      }];
    });

    let orderNote = `الطلب عبر الموقع\n`;
    if (payload.order_type) orderNote += `نوع الطلب: ${payload.order_type}\n`;
    if (payload.delivery_address) orderNote += `العنوان: ${payload.delivery_address}\n`;
    if (payload.pickup_time) orderNote += `وقت الاستلام: ${payload.pickup_time}\n`;
    if (payload.customer_note) orderNote += `ملاحظات العميل: ${payload.customer_note}\n`;

    if (orderLines.length > 0) {
      const combinedNote = (orderLines[0][2].customer_note ? orderLines[0][2].customer_note + "\n\n" : "") + "--- معلومات الطلب ---\n" + orderNote;
      orderLines[0][2].customer_note = combinedNote;
      orderLines[0][2].note = combinedNote;
    }

    // 6. Create the POS Order in Odoo
    const orderData: any = {
      session_id: sessionId,
      partner_id: partnerId,
      lines: orderLines,
      amount_total: amountTotal,
      amount_tax: 0,
      amount_paid: 0,
      amount_return: 0,
    };

    if (tableId) {
      orderData.table_id = tableId;
    }

    const orderId = await odooCall("pos.order", "create", [orderData]);

    return NextResponse.json({
      status: "success",
      order_id: orderId,
      message: "Order successfully created in Odoo",
    });
  } catch (error: any) {
    console.error("Error creating order in Odoo:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
