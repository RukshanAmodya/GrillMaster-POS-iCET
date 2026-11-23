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
