from odoo import http
from odoo.http import request
import json

class PosQrOrderController(http.Controller):
    # مسار الـ API ونوع الاستقبال
    @http.route('/api/create_pos_order', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False, cors='*')
    def create_pos_order(self, **kw):
        
        # عشان نحل مشكلة الـ CORS من متصفح العميل
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ])

        try:
            # قراءة الـ JSON اللي جاي من موقعنا Next.js
            data = json.loads(request.httprequest.data)
            table_number = data.get('table_number')
            items = data.get('items', [])

            if not items:
                return request.make_json_response({'status': 'error', 'message': 'No items'}, status=400)

            # هنجيب الجلسة بتاعة الكاشير المفتوحة حالياً من الداتا بيز
            session = request.env['pos.session'].sudo().search([('state', '=', 'opened')], limit=1)
            if not session:
                return request.make_json_response({'status': 'error', 'message': 'No open session'}, status=400)

            # هنجيب الطاولة اللي العميل قاعد عليها بشكل مرن ومتوافق مع إصدارات أودو المختلفة
            table_model = request.env['restaurant.table'].sudo()
            table = False
            # فقط لو فيه رقم طاولة حقيقي
            if table_number and table_number != "N/A":
                if 'table_number' in table_model._fields:
                    # لو الحقل integer هنحتاج نتأكد إنه رقم
                    if str(table_number).isdigit():
                        table = table_model.search([('table_number', '=', int(table_number))], limit=1)
                    else:
                        table = table_model.search([('table_number', '=', str(table_number))], limit=1)
                elif 'name' in table_model._fields:
                    table = table_model.search([('name', '=', str(table_number))], limit=1)
                
                # محاولة البحث بالـ ID مباشرة كـ fallback أخير
                if not table and str(table_number).isdigit():
                    table_by_id = table_model.browse(int(table_number))
                    if table_by_id.exists():
                        table = table_by_id

            # نجمع المنتجات في المصفوفة بتاعة أودو الخاصة بإنشاء الجداول
            order_lines = []
            item_global_notes = []
            
            for item in items:
                # البحث عن المنتج بالاسم العربي أو الإنجليزي
                product = request.env['product.product'].sudo().search([
                    '|',
                    ('name', 'ilike', item.get('name', '')),
                    ('name', 'ilike', item.get('nameEn', ''))
                ], limit=1)
                
                # إذا لم يعثر عليه، يستخدم أول منتج متاح في نقطة البيع كـ fallback لتسهيل التجربة
                if not product:
                    product = request.env['product.product'].sudo().search([('available_in_pos', '=', True)], limit=1)
                
                if not product:
                    return request.make_json_response({
                        'status': 'error', 
                        'message': f"Product '{item.get('nameEn')}' not found in Odoo"
                    }, status=400)

                # معالجة الإضافات (Attributes/Options) وإضافتها كملاحظة وسعر إضافي على الصنف الرئيسي
                opts = item.get('options', [])
                opts_total_price = 0.0
                opt_notes = []
                for opt in opts:
                    opts_total_price += opt.get('price', 0.0)
                    opt_notes.append(f"+ {opt.get('nameAr', opt.get('name', ''))}")
                
                line_vals = {
                    'product_id': product.id,
                    'qty': item.get('quantity'),
                    'price_unit': item.get('price', product.lst_price) + opts_total_price,
                    'price_subtotal': (item.get('price', product.lst_price) + opts_total_price) * item.get('quantity'),
                    'price_subtotal_incl': (item.get('price', product.lst_price) + opts_total_price) * item.get('quantity'),
                }
                
                # الملاحظات الخاصة بالصنف نفسه
                line_notes = []
                instr = item.get('instructions', '')
                if instr:
                    line_notes.append(f"ملاحظة: {instr}")
                if opt_notes:
                    line_notes.extend(opt_notes)
                    
                if 'customer_note' in request.env['pos.order.line']._fields and line_notes:
                    line_vals['customer_note'] = " | ".join(line_notes)

                order_lines.append((0, 0, line_vals))

            # تجميع تفاصيل الطلب كاملة (النوع والعنوان والدفع)
            order_type = data.get('order_type', 'dine_in')
            delivery_address = data.get('delivery_address', '')
            pickup_time = data.get('pickup_time', '')
            payment_method = data.get('payment_method', '')
            customer_note = data.get('customer_note', '')
            customer_phone = data.get('customer_phone', '')
            
            global_note_parts = []
            if order_type == 'delivery':
                global_note_parts.append("🛵 [توصيل - DELIVERY]")
                if delivery_address:
                    global_note_parts.append(f"📍 العنوان: {delivery_address}")
            elif order_type == 'takeaway':
                global_note_parts.append("🛍️ [استلام - TAKEAWAY]")
                if pickup_time:
                    global_note_parts.append(f"⏱️ وقت الاستلام: {pickup_time}")
            else:
                global_note_parts.append("🍽️ [محلي - DINE IN]")
                
            if customer_phone:
                global_note_parts.append(f"📱 الجوال: {customer_phone}")
                
            if payment_method:
                pay_str = "الدفع عند الاستلام" if payment_method == 'cash_on_delivery' else "دفع إلكتروني"
                global_note_parts.append(f"💰 الدفع: {pay_str}")
                
            if customer_note:
                global_note_parts.append(f"📝 ملاحظة عامة: {customer_note}")
                
            full_order_note = "\n".join(global_note_parts)

            # إضافة ملاحظات الطلب العامة لأول منتج عشان تظهر قدام الكاشير مباشرة
            if global_note_parts and order_lines and 'customer_note' in request.env['pos.order.line']._fields:
                first_line_vals = order_lines[0][2]
                existing_note = first_line_vals.get('customer_note', '')
                new_note = full_order_note
                if existing_note:
                    new_note = new_note + "\n---\n" + existing_note
                first_line_vals['customer_note'] = new_note

            # نكريت الطلب الفعلي في الداتا بيز
            order_vals = {
                'session_id': session.id,
                'table_id': table.id if table else False,
                'lines': order_lines,
                'amount_total': sum(item.get('price') * item.get('quantity') for item in items),
                'amount_paid': 0.0,
                'amount_return': 0.0,
                'amount_tax': 0.0, 
            }
            
            # إضافة العميل (Partner) حتى يظهر رقمه واسمه في شاشة الكاشير
            if customer_phone:
                partner = request.env['res.partner'].sudo().search([('phone', '=', customer_phone)], limit=1)
                if not partner:
                    partner = request.env['res.partner'].sudo().create({
                        'name': f'عميل {customer_phone}',
                        'phone': customer_phone,
                    })
                if 'partner_id' in request.env['pos.order']._fields:
                    order_vals['partner_id'] = partner.id
            
            # محاولة تعيين نوع الطلب لو الحقل الخاص به موجود (يغطي إصدارات 17 و 18 والاضافات)
            if 'preset_id' in request.env['pos.order']._fields:
                if order_type == 'takeaway':
                    preset = request.env.ref('pos_restaurant.pos_takeout_preset', raise_if_not_found=False)
                    if preset:
                        order_vals['preset_id'] = preset.id
                elif order_type == 'delivery':
                    preset = request.env.ref('pos_restaurant.pos_delivery_preset', raise_if_not_found=False)
                    if preset:
                        order_vals['preset_id'] = preset.id
                        
            if 'takeaway' in request.env['pos.order']._fields:
                order_vals['takeaway'] = (order_type in ['takeaway', 'delivery'])
                
            if 'ticket_type' in request.env['pos.order']._fields:
                if order_type == 'takeaway':
                    order_vals['ticket_type'] = 'takeout'
                else:
                    order_vals['ticket_type'] = order_type
                    
            if 'shipping_type' in request.env['pos.order']._fields:
                order_vals['shipping_type'] = order_type

            if 'order_type' in request.env['pos.order']._fields:
                order_vals['order_type'] = order_type

            # حماية عشان لو حقل الملاحظة مش موجود في نسخة أودو دي ميعملش إيرور
            if 'note' in request.env['pos.order']._fields:
                order_vals['note'] = full_order_note
                
            order = request.env['pos.order'].sudo().create(order_vals)

            # نرد على موقعنا بإن الدنيا تمام
            return request.make_json_response({'status': 'success', 'order_id': order.id})

        except Exception as e:
            return request.make_json_response({'status': 'error', 'message': str(e)}, status=500)

    @http.route('/api/debug_fields', type='http', auth='public', methods=['GET'], csrf=False, cors='*')
    def debug_fields(self, **kw):
        fields = list(request.env['pos.order']._fields.keys())
        return request.make_json_response({'fields': fields})

    @http.route('/api/get_pos_data', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_pos_data(self, **kw):
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ])
            
        try:
            # 1. Fetch Categories
            categories = request.env['pos.category'].sudo().search([])
            cats_data = [{'id': c.id, 'name': c.name} for c in categories]
            
            # 2. Fetch Products
            products = request.env['product.product'].sudo().search([('available_in_pos', '=', True)])
            prods_data = []
            for p in products:
                # Modifiers / Attributes
                attributes = []
                if 'attribute_line_ids' in p.product_tmpl_id._fields:
                    for line in p.product_tmpl_id.attribute_line_ids:
                        values = [{'id': v.id, 'name': v.name, 'price_extra': 0} for v in line.value_ids]
                        # In Odoo, price_extra is usually on product.template.attribute.value
                        if hasattr(line, 'product_template_value_ids'):
                            values = [{'id': v.id, 'name': v.name, 'price_extra': v.price_extra} for v in line.product_template_value_ids]
                        
                        attributes.append({
                            'id': line.attribute_id.id,
                            'name': line.attribute_id.name,
                            'values': values
                        })
                
                prods_data.append({
                    'id': p.id,
                    'name': p.name,
                    'price': p.list_price,
                    'pos_categ_id': p.pos_categ_ids.ids[0] if getattr(p, 'pos_categ_ids', False) else getattr(p, 'pos_categ_id', False) and p.pos_categ_id.id or False,
                    'description': p.description_sale or '',
                    'attributes': attributes,
                    'image_url': f'/web/image?model=product.product&id={p.id}&field=image_128'
                })
                
            return request.make_json_response({
                'status': 'success',
                'categories': cats_data,
                'products': prods_data
            })
        except Exception as e:
            return request.make_json_response({'status': 'error', 'message': str(e)}, status=500)
