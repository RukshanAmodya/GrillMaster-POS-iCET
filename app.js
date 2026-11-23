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
