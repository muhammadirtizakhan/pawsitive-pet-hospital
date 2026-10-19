'use client';

export default function OrdersPage({ active = false }) {
  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-orders">
      <section className="orders-section">
        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">Account</span> <h1>My Orders</h1>
            <p>Review your recent purchases and order status.</p>
          </div>
          <button className="orders-create-btn" type="button" onClick={() => window.createOrderFromHistory()}>
            <i className="fa-solid fa-plus"></i>
            Create an order
          </button>
        </div>
        <div className="orders-table-shell" id="ordersTableShell">
          <div className="orders-table-heading">
            <h2>Order history</h2>
            <span id="ordersCount">0 orders</span>
          </div>
          <div className="orders-table-scroll">
            <table className="orders-table">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Date</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody"></tbody>
            </table>
          </div>
        </div>
        <div className="orders-empty" id="ordersEmpty" style={{ display: 'none' }}>
          <div className="orders-empty-icon">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <h2>No orders yet</h2>
          <p>Your completed checkouts will appear here.</p>
          <button className="orders-create-btn" type="button" onClick={() => window.createOrderFromHistory()}>
            <i className="fa-solid fa-bag-shopping"></i>
            Create an order
          </button>
        </div>
      </section>
    </div>
  );
}
