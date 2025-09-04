import "dotenv/config";
import { Sequelize } from "sequelize";
import { type ProductModel, initProductModel } from "./Product";
import { type CartModel, initCartModel } from "./Cart";
import { type CartItemModel, initCartItemModel } from "./CartItem";
import { type OrderModel, initOrderModel } from "./Order";
import { type OrderItemModel, initOrderItemModel } from "./OrderItem";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

// Initialize models
const Product = initProductModel(sequelize)
const Cart = initCartModel(sequelize)
const CartItem = initCartItemModel(sequelize)
const Order = initOrderModel(sequelize)
const OrderItem = initOrderItemModel(sequelize)

// Define associations
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" })
CartItem.belongsTo(Cart, { foreignKey: "cartId" })
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" })

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" })
OrderItem.belongsTo(Order, { foreignKey: "orderId" })
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" })

export { sequelize, Product, Cart, CartItem, Order, OrderItem }

export type { ProductModel, CartModel, CartItemModel, OrderModel, OrderItemModel }
