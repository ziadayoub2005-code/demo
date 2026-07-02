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
            
            # أودو 19 أحياناً يستخدم table_number أو name
            if 'table_number' in table_model._fields:
                table = table_model.search([('table_number', '=', str(table_number))], limit=1)
                if not table and str(table_number).isdigit():
                    table = table_model.search([('table_number', '=', int(table_number))], limit=1)
            elif 'name' in table_model._fields:
                table = table_model.search([('name', '=', str(table_number))], limit=1)
            
            # محاولة البحث بالـ ID مباشرة كـ fallback أخير
            if not table and str(table_number).isdigit():
                table_by_id = table_model.browse(int(table_number))
                if table_by_id.exists():
                    table = table_by_id

            # نجمع المنتجات في المصفوفة بتاعة أودو الخاصة بإنشاء الجداول
            order_lines = []
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

                order_lines.append((0, 0, {
                    'product_id': product.id,
                    'qty': item.get('quantity'),
                    'price_unit': item.get('price', product.lst_price),
                    'price_subtotal': item.get('price', product.lst_price) * item.get('quantity'),
                    'price_subtotal_incl': item.get('price', product.lst_price) * item.get('quantity'),
                }))

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
            
            # حماية عشان لو حقل الملاحظة مش موجود في نسخة أودو دي ميعملش إيرور
            if 'note' in request.env['pos.order']._fields:
                order_vals['note'] = data.get('customer_note', '')
                
            order = request.env['pos.order'].sudo().create(order_vals)

            # نرد على موقعنا بإن الدنيا تمام
            return request.make_json_response({'status': 'success', 'order_id': order.id})

        except Exception as e:
            return request.make_json_response({'status': 'error', 'message': str(e)}, status=500)
