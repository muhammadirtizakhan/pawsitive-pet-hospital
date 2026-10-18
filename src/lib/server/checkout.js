const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function error(message, status = 400) { return Object.assign(new Error(message), { status }); }
async function prepareCheckout(client, body) {
  const string = (key, max) => {
    if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > max) throw error(`Valid ${key.replaceAll('_', ' ')} required`);
    return body[key].trim();
  };
  const customer_name = string('customer_name', 120);
  const customer_email = string('customer_email', 254).toLowerCase();
  const phone = string('phone', 30);
  const address = string('address', 1000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) throw error('Valid email required');
  if (phone.replace(/\D/g, '').length < 10) throw error('Valid phone required');
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 50) throw error('Order must contain 1–50 items');
  const items = body.items;
  if (items.some(i => !i || !UUID.test(i.product_id || '') ||
    (i.variant_id && !UUID.test(i.variant_id)) || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 100)) throw error('Invalid product, flavor or quantity');
  const ids = [...new Set(items.map(i => i.product_id))];
  const { data: products, error: queryError } = await client.from('products')
    .select('id,name,price,status,variants:product_variants(id,product_id,variant_type,variant_value,price)')
    .in('id', ids).eq('status', 'active');
  if (queryError) throw new Error('Product pricing lookup failed');
  const byId = new Map((products || []).map(p => [p.id, p]));
  let cents = 0;
  const prepared = items.map(i => {
    const p = byId.get(i.product_id);
    if (!p) throw error('A product is no longer available. Refresh your cart.', 409);
    const variant = i.variant_id ? (p.variants || []).find(v => v.id === i.variant_id) : null;
    if (i.variant_id && !variant) throw error('A flavor no longer belongs to its product.', 409);
    if (!variant && (p.variants || []).some(v => v.variant_type === 'flavor')) throw error('Please select a flavor for each flavored product.', 409);
    const rawPrice = variant?.price ?? p.price;
    const price = rawPrice === null || rawPrice === undefined ? NaN : Number(rawPrice);
    if (!Number.isFinite(price) || price < 0 || price > 10000000) throw error('Product price needs checking. Please contact the clinic.', 409);
    const unit = Math.round(price * 100), line = unit * i.quantity;
    cents += line;
    return { product_id: p.id, variant_id: variant?.id || null,
      product_name: p.name, variant_name: variant?.variant_value || null,
      quantity: i.quantity, unit_price: unit / 100, line_total: line / 100 };
  });
  if (body.total !== undefined && (!Number.isFinite(Number(body.total)) || Math.round(Number(body.total) * 100) !== cents)) {
    throw error('A price changed. Refresh your cart and review the total before ordering.', 409);
  }
  return { order: { customer_name, customer_email, phone, address, subtotal: cents / 100, delivery_fee: 0, total: cents / 100 }, items: prepared };
}
module.exports = { prepareCheckout };
