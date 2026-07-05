import sys
sys.stdout.reconfigure(encoding='utf-8')
import xmlrpc.client
url = 'http://localhost:8069'
db = 'restaurant_demo'
username = 'ziad46333@gmail.com'
password = 'admin'

common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})
models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

pos_cats = models.execute_kw(db, uid, password, 'pos.category', 'search_read', [[]], {'fields': ['name']})
print(f'--- عدد التصنيفات المضافة: {len(pos_cats)} ---')
for c in pos_cats:
    print(f"- {c['name']}")

products = models.execute_kw(db, uid, password, 'product.template', 'search_read', [[('available_in_pos', '=', True)]], {'fields': ['name', 'list_price', 'description_sale', 'attribute_line_ids']})
print(f'\n--- عدد المنتجات المضافة (متاحة في نقطة البيع): {len(products)} ---')
for p in products[:5]:
    desc = str(p.get('description_sale', ''))[:50].replace('\n', ' ')
    if desc == 'False' or not desc: desc = 'بدون وصف'
    print(f"- {p['name']} | السعر: {p['list_price']} SAR | الوصف: {desc}")
    if p['attribute_line_ids']:
        attrs = models.execute_kw(db, uid, password, 'product.template.attribute.line', 'read', [p['attribute_line_ids']], {'fields': ['attribute_id', 'value_ids']})
        for a in attrs:
            attr_name = a['attribute_id'][1]
            vals = models.execute_kw(db, uid, password, 'product.attribute.value', 'read', [a['value_ids']], {'fields': ['name', 'price_extra']})
            val_strs = [f"{v['name']} (+{v['price_extra']} SAR)" for v in vals]
            print(f"    * إضافات ({attr_name}): {', '.join(val_strs)}")
