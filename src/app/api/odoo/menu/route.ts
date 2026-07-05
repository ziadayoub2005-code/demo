import { NextResponse } from "next/server";
import { odooCall } from "@/lib/odooClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch POS Categories
    const categories = await odooCall("pos.category", "search_read", [[]], {
      fields: ["id", "name"],
    });

    // 2. Fetch POS Products
    const products = await odooCall("product.template", "search_read", [[["available_in_pos", "=", true]]], {
      fields: ["id", "name", "list_price", "pos_categ_ids", "description", "description_sale", "website_description", "attribute_line_ids"],
    });

    // Define correct ordering based on menu.xlsx
    const categoryOrder = [
      "البرغر", "ميقا", "سطل اللمة", "البوكسات", "ميني برغر", "كرسبي بايتس", 
      "الباستا", "الصوصات", "الاضافات", "مشروبات", "حلا"
    ];
    
    const productOrder = [
      "برغر وان", "ترافل", "مكسيكان", "كرسبي شكن", "كلاسيكا", "بلاك وايت", "بلاك وايت ", "جمبري كرسبي",
      "ميقا كرسبي شكن", "ميقا كرسبي شكن ", "ميقا ترافل", "ميقا ترافل ", "ميقا بلاك وايت", "ميقا بلاك وايت ",
      "سطل نيوغتس فرايز", "سطل الجمبري فرايز", "سطل ستيك فرايز", "سطل شكن فرايز",
      "توينز", "توين كلاسيكا", "توين كرسبي شكن", "توين مكس", 
      "ميني مكس بوكس", "ميني بيف بوكس", "ميني كرنش بوكس",
      "قطع جمبري مقرمش", "قطع كرسبي شيز", "قطع كرسبي شيز ", "قطع كرسبي شكن", "قطع كرسبي نيوغتس",
      "باستا ألفريدو", "باستا دي تريفوليو", "باستا بولوناز", "باستا لارابياتا",
      "صوص كوكتال", "صوص ترافل", "صوص بربيكيو", "صوص بيجي", "صوص سبايسي", "صوص الجبن الإيطالية", "صوص برغر", "صوص شيدار",
      "بطاطس صغير", "بطاطس صغير ", "بطاطس كبير", "بطاطس كبير ",
      "كوكازيرو", "سبرايت", "فنتا", "كوكاكولا", "ماء 330ml", "بيبسي",
      "تيراميسو", "تيراميسو ", "كوكيز أبيض", "كوكيز أبيض ", "كوكيز شكلاطة", "كوكيز شكلاطة "
    ];

    // Sort categories
    categories.sort((a: any, b: any) => {
      let indexA = categoryOrder.indexOf(a.name.trim());
      let indexB = categoryOrder.indexOf(b.name.trim());
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    // Extract all attribute line IDs
    const attrLineIds = products.reduce((acc: number[], p: any) => [...acc, ...p.attribute_line_ids], []);

    let attributeMap: Record<number, any> = {};
    let attrLines: any[] = [];

    if (attrLineIds.length > 0) {
      // 3. Fetch Attribute Lines
      attrLines = await odooCall("product.template.attribute.line", "search_read", [[["id", "in", attrLineIds]]], {
        fields: ["attribute_id", "product_tmpl_id", "value_ids", "product_template_value_ids"],
      });

      // Extract all template value IDs
      const templateValueIds = attrLines.reduce((acc: number[], line: any) => [...acc, ...line.product_template_value_ids], []);

      if (templateValueIds.length > 0) {
        // 4. Fetch Attribute Values
        const attrValues = await odooCall("product.template.attribute.value", "search_read", [[["id", "in", templateValueIds]]], {
          fields: ["name", "price_extra", "attribute_id"],
        });

        // Map values by their attribute_id and ID
        attrValues.forEach((val: any) => {
          const attrId = val.attribute_id[0];
          const attrName = val.attribute_id[1];
          if (!attributeMap[val.id]) {
            attributeMap[val.id] = {
              id: val.id,
              name: val.name,
              price_extra: val.price_extra,
              attrId,
              attrName
            };
          }
        });
      }
    }

    // 5. Format Products
    const formattedProducts = products.map((p: any) => {
      // Find attributes for this product
      const productAttributesMap: Record<number, any> = {};
      
      if (attrLineIds.length > 0 && p.attribute_line_ids.length > 0) {
        // Find lines for this product
        const lines = attrLines.filter((l: any) => p.attribute_line_ids.includes(l.id));
        
        lines.forEach((line: any) => {
          const attrId = line.attribute_id[0];
          const attrName = line.attribute_id[1];
          
          if (!productAttributesMap[attrId]) {
            productAttributesMap[attrId] = { id: attrId, name: attrName, values: [] };
          }
          
          // Add values that belong to this line
          line.product_template_value_ids.forEach((valId: number) => {
            if (attributeMap[valId]) {
              productAttributesMap[attrId].values.push({
                id: attributeMap[valId].id,
                name: attributeMap[valId].name,
                price_extra: attributeMap[valId].price_extra,
              });
            }
          });
        });
      }
      
      const descHtml = p.description || p.description_sale || p.website_description || "";
      const desc = descHtml.replace(/<[^>]*>?/gm, '').trim();
      
      return {
        id: p.id,
        name: p.name,
        price: p.list_price,
        pos_categ_id: p.pos_categ_ids.length > 0 ? p.pos_categ_ids[0] : false,
        description: desc,
        attributes: Object.values(productAttributesMap),
        image_url: `/api/odoo/image?model=product.template&id=${p.id}&field=image_512`, // We will create an image proxy route
      };
    });

    // Sort products
    formattedProducts.sort((a: any, b: any) => {
      let indexA = productOrder.indexOf(a.name.trim());
      let indexB = productOrder.indexOf(b.name.trim());
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    return NextResponse.json({
      status: "success",
      categories: categories,
      products: formattedProducts,
    });
  } catch (error: any) {
    console.error("Error fetching menu from Odoo:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
