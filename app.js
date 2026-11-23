let customers = [
    { id: "C001", name: "Kasun Perera", phone: "0771234567", address: "Galle Road, Colombo" },
    { id: "C002", name: "Nimal Fernando", phone: "0719876543", address: "Kandy" },
    { id: "C003", name: "Amali Silva", phone: "0755554321", address: "Negombo" }
];

let items = [
    { code: "B001", name: "Classic Beef Burger", category: "Burgers", price: 850.00, stock: 35, icon: "🍔" },
    { code: "B002", name: "Crispy Chicken Burger", category: "Burgers", price: 750.00, stock: 40, icon: "🍔" },
    { code: "B003", name: "Cheese Blast Burger", category: "Burgers", price: 950.00, stock: 25, icon: "🍔" },
    { code: "F001", name: "Golden French Fries", category: "Fries", price: 400.00, stock: 50, icon: "🍟" },
    { code: "F002", name: "Cheesy Loaded Fries", category: "Fries", price: 650.00, stock: 20, icon: "🍟" },
    { code: "D001", name: "Chilled Coca-Cola", category: "Drinks", price: 200.00, stock: 60, icon: "🥤" },
    { code: "D002", name: "Chocolate Milkshake", category: "Drinks", price: 450.00, stock: 30, icon: "🥤" }
];

let cart = [];
let orders = [];
let orderCounter = 1;

document.addEventListener("DOMContentLoaded", function () {
    loadStoredData();
    initNavigation();
    initPOS();
    initCustomerCRUD();
    initItemCRUD();
    initOrdersView();
});

function loadStoredData() {
    const savedCust = localStorage.getItem("grill_customers");
    if (savedCust) customers = JSON.parse(savedCust);

    const savedItems = localStorage.getItem("grill_items");
    if (savedItems) items = JSON.parse(savedItems);

    const savedOrders = localStorage.getItem("grill_orders");
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
        orderCounter = orders.length + 1;
    }
}

function saveStoredData() {
    localStorage.setItem("grill_customers", JSON.stringify(customers));
    localStorage.setItem("grill_items", JSON.stringify(items));
    localStorage.setItem("grill_orders", JSON.stringify(orders));
}

function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    navButtons.forEach(button => {
        button.addEventListener("click", function () {
            navButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));

            this.classList.add("active");
            const targetId = this.getAttribute("data-tab");
            document.getElementById(targetId).classList.add("active");

            if (targetId === "pos-section") {
                renderProductGrid();
                populateCustomerDropdown();
            } else if (targetId === "customers-section") {
                renderCustomerTable();
            } else if (targetId === "items-section") {
                renderItemTable();
            } else if (targetId === "orders-section") {
                renderOrdersTable();
            }
        });
    });
}

function initCustomerCRUD() {
    const form = document.getElementById("customer-form");
    const editIdInput = document.getElementById("customer-edit-id");
    const idInput = document.getElementById("cust-id");
    const nameInput = document.getElementById("cust-name");
    const phoneInput = document.getElementById("cust-phone");
    const addressInput = document.getElementById("cust-address");
    const formTitle = document.getElementById("customer-form-title");
    const btnCancel = document.getElementById("btn-cancel-customer");

    renderCustomerTable();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const editId = editIdInput.value;
        const customerData = {
            id: idInput.value.trim(),
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim()
        };

        if (editId) {
            const index = customers.findIndex(c => c.id === editId);
            if (index !== -1) {
                customers[index] = customerData;
            }
        } else {
            const exists = customers.some(c => c.id.toLowerCase() === customerData.id.toLowerCase());
            if (exists) {
                alert("Customer ID already exists!");
                return;
            }
            customers.push(customerData);
        }

        saveStoredData();
        renderCustomerTable();
        populateCustomerDropdown();
        resetCustomerForm();
    });

    btnCancel.addEventListener("click", resetCustomerForm);

    function resetCustomerForm() {
        form.reset();
        editIdInput.value = "";
        idInput.disabled = false;
        formTitle.textContent = "Add New Customer";
    }
}

function renderCustomerTable() {
    const tbody = document.getElementById("customer-table-body");
    tbody.innerHTML = "";

    customers.forEach(cust => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${cust.id}</td>
            <td>${cust.name}</td>
            <td>${cust.phone}</td>
            <td>${cust.address}</td>
            <td>
                <button class="action-btn action-edit" onclick="editCustomer('${cust.id}')">Edit</button>
                <button class="action-btn action-delete" onclick="deleteCustomer('${cust.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editCustomer(id) {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;

    document.getElementById("customer-edit-id").value = cust.id;
    const idInput = document.getElementById("cust-id");
    idInput.value = cust.id;
    idInput.disabled = true;

    document.getElementById("cust-name").value = cust.name;
    document.getElementById("cust-phone").value = cust.phone;
    document.getElementById("cust-address").value = cust.address;
    document.getElementById("customer-form-title").textContent = "Edit Customer: " + cust.id;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteCustomer(id) {
    if (confirm("Are you sure you want to delete customer " + id + "?")) {
        customers = customers.filter(c => c.id !== id);
        saveStoredData();
        renderCustomerTable();
        populateCustomerDropdown();
    }
}

function initItemCRUD() {
    const form = document.getElementById("item-form");
    const editCodeInput = document.getElementById("item-edit-code");
    const codeInput = document.getElementById("item-code");
    const nameInput = document.getElementById("item-name");
    const catInput = document.getElementById("item-category");
    const priceInput = document.getElementById("item-price");
    const qtyInput = document.getElementById("item-qty");
    const formTitle = document.getElementById("item-form-title");
    const btnCancel = document.getElementById("btn-cancel-item");

    renderItemTable();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const editCode = editCodeInput.value;
        const category = catInput.value;

        let icon = "🍔";
        if (category === "Fries") icon = "🍟";
        if (category === "Drinks") icon = "🥤";

        const itemData = {
            code: codeInput.value.trim(),
            name: nameInput.value.trim(),
            category: category,
            price: parseFloat(priceInput.value),
            stock: parseInt(qtyInput.value),
            icon: icon
        };

        if (editCode) {
            const index = items.findIndex(i => i.code === editCode);
            if (index !== -1) {
                items[index] = itemData;
            }
        } else {
            const exists = items.some(i => i.code.toLowerCase() === itemData.code.toLowerCase());
            if (exists) {
                alert("Item Code already exists!");
                return;
            }
            items.push(itemData);
        }

        saveStoredData();
        renderItemTable();
        renderProductGrid();
        resetItemForm();
    });

    btnCancel.addEventListener("click", resetItemForm);

    function resetItemForm() {
        form.reset();
        editCodeInput.value = "";
        codeInput.disabled = false;
        formTitle.textContent = "Add New Food Item";
    }
}

function renderItemTable() {
    const tbody = document.getElementById("item-table-body");
    tbody.innerHTML = "";

    items.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.code}</td>
            <td>${item.icon} ${item.name}</td>
            <td>${item.category}</td>
            <td>Rs. ${item.price.toFixed(2)}</td>
            <td>${item.stock}</td>
            <td>
                <button class="action-btn action-edit" onclick="editItem('${item.code}')">Edit</button>
                <button class="action-btn action-delete" onclick="deleteItem('${item.code}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editItem(code) {
    const item = items.find(i => i.code === code);
    if (!item) return;

    document.getElementById("item-edit-code").value = item.code;
    const codeInput = document.getElementById("item-code");
    codeInput.value = item.code;
    codeInput.disabled = true;

    document.getElementById("item-name").value = item.name;
    document.getElementById("item-category").value = item.category;
    document.getElementById("item-price").value = item.price;
    document.getElementById("item-qty").value = item.stock;
    document.getElementById("item-form-title").textContent = "Edit Item: " + item.code;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteItem(code) {
    if (confirm("Are you sure you want to delete item " + code + "?")) {
        items = items.filter(i => i.code !== code);
        saveStoredData();
        renderItemTable();
        renderProductGrid();
    }
}

let selectedCategory = "all";

function initPOS() {
    renderProductGrid();
    populateCustomerDropdown();

    const catButtons = document.querySelectorAll(".cat-btn");
    catButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            catButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            selectedCategory = this.getAttribute("data-cat");
            renderProductGrid();
        });
    });

    document.getElementById("cart-discount").addEventListener("input", updateCartSummary);
    document.getElementById("btn-place-order").addEventListener("click", placeOrder);
    document.getElementById("btn-close-receipt").addEventListener("click", () => {
        document.getElementById("receipt-modal").classList.remove("active");
    });
}

function populateCustomerDropdown() {
    const select = document.getElementById("order-customer-select");
    const currentValue = select.value;
    select.innerHTML = `<option value="">Walk-in Customer</option>`;

    customers.forEach(cust => {
        const option = document.createElement("option");
        option.value = cust.id;
        option.textContent = `${cust.id} - ${cust.name}`;
        select.appendChild(option);
    });

    select.value = currentValue;
}

function renderProductGrid() {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    const filtered = selectedCategory === "all" 
        ? items 
        : items.filter(item => item.category === selectedCategory);

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">Rs. ${item.price.toFixed(2)}</div>
            <div class="item-stock">Stock: ${item.stock}</div>
        `;
        card.addEventListener("click", () => addToCart(item.code));
        grid.appendChild(card);
    });
}

function addToCart(code) {
    const item = items.find(i => i.code === code);
    if (!item) return;

    if (item.stock <= 0) {
        alert("Sorry, " + item.name + " is out of stock!");
        return;
    }

    const cartItem = cart.find(ci => ci.code === code);
    if (cartItem) {
        if (cartItem.qty + 1 > item.stock) {
            alert("Cannot add more than available stock (" + item.stock + ")");
            return;
        }
        cartItem.qty++;
    } else {
        cart.push({
            code: item.code,
            name: item.name,
            price: item.price,
            qty: 1
        });
    }

    renderCart();
}

function updateCartQty(code, change) {
    const cartItem = cart.find(ci => ci.code === code);
    const item = items.find(i => i.code === code);
    if (!cartItem || !item) return;

    const newQty = cartItem.qty + change;
    if (newQty <= 0) {
        removeFromCart(code);
        return;
    }

    if (newQty > item.stock) {
        alert("Cannot add more than available stock (" + item.stock + ")");
        return;
    }

    cartItem.qty = newQty;
    renderCart();
}

function removeFromCart(code) {
    cart = cart.filter(ci => ci.code !== code);
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items-container");
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">No items in cart</p>`;
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rs. ${item.price.toFixed(2)} x ${item.qty}</div>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty" onclick="updateCartQty('${item.code}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="btn-qty" onclick="updateCartQty('${item.code}', 1)">+</button>
                <button class="btn-remove" onclick="removeFromCart('${item.code}')">&times;</button>
            </div>
        `;
        container.appendChild(row);
    });

    updateCartSummary();
}

function updateCartSummary() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.qty;
    });

    const discountInput = document.getElementById("cart-discount");
    let discountPercent = parseFloat(discountInput.value) || 0;
    if (discountPercent < 0) discountPercent = 0;
    if (discountPercent > 100) discountPercent = 100;

    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = subtotal - discountAmount;

    document.getElementById("cart-subtotal").textContent = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById("cart-total").textContent = `Rs. ${finalTotal.toFixed(2)}`;
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty! Please select items first.");
        return;
    }

    const customerSelect = document.getElementById("order-customer-select");
    const customerId = customerSelect.value;
    let customerName = "Walk-in Customer";

    if (customerId) {
        const found = customers.find(c => c.id === customerId);
        if (found) customerName = `${found.name} (${found.id})`;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.qty;
    });

    const discountPercent = parseFloat(document.getElementById("cart-discount").value) || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = subtotal - discountAmount;

    cart.forEach(cartItem => {
        const product = items.find(i => i.code === cartItem.code);
        if (product) {
            product.stock -= cartItem.qty;
        }
    });

    const orderId = "ORD-" + String(orderCounter).padStart(3, "0");
    orderCounter++;

    const newOrder = {
        id: orderId,
        date: new Date().toLocaleString(),
        customer: customerName,
        items: [...cart],
        subtotal: subtotal,
        discount: discountPercent,
        total: finalTotal
    };

    orders.unshift(newOrder);

    saveStoredData();
    renderProductGrid();
    renderItemTable();

    showReceipt(newOrder);

    cart = [];
    document.getElementById("cart-discount").value = "0";
    document.getElementById("order-id-display").textContent = "#ORD-" + String(orderCounter).padStart(3, "0");
    renderCart();
}

function showReceipt(order) {
    document.getElementById("receipt-order-id").textContent = "Order #" + order.id;
    document.getElementById("receipt-date").textContent = order.date;
    document.getElementById("receipt-customer").textContent = order.customer;

    const itemsContainer = document.getElementById("receipt-items-list");
    itemsContainer.innerHTML = "";

    order.items.forEach(item => {
        const row = document.createElement("div");
        row.className = "receipt-item-row";
        row.innerHTML = `
            <span>${item.name} x ${item.qty}</span>
            <span>Rs. ${(item.price * item.qty).toFixed(2)}</span>
        `;
        itemsContainer.appendChild(row);
    });

    document.getElementById("receipt-subtotal").textContent = `Rs. ${order.subtotal.toFixed(2)}`;
    document.getElementById("receipt-discount").textContent = `${order.discount}%`;
    document.getElementById("receipt-final-total").textContent = `Rs. ${order.total.toFixed(2)}`;

    document.getElementById("receipt-modal").classList.add("active");
}

function initOrdersView() {
    renderOrdersTable();
}

function renderOrdersTable() {
    const tbody = document.getElementById("orders-table-body");
    tbody.innerHTML = "";

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">No orders placed yet</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const totalItemsCount = order.items.reduce((sum, item) => sum + item.qty, 0);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.date}</td>
            <td>${order.customer}</td>
            <td>${totalItemsCount} items</td>
            <td>${order.discount}%</td>
            <td><strong>Rs. ${order.total.toFixed(2)}</strong></td>
            <td>
                <button class="action-btn action-edit" onclick="viewOrderReceipt('${order.id}')">Receipt</button>
                <button class="action-btn action-delete" onclick="deleteOrder('${order.id}')">Cancel</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function viewOrderReceipt(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        showReceipt(order);
    }
}

function deleteOrder(orderId) {
    if (confirm("Are you sure you want to cancel order " + orderId + "?")) {
        orders = orders.filter(o => o.id !== orderId);
        saveStoredData();
        renderOrdersTable();
    }
}
