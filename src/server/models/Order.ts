import { DataTypes, type Model, type Sequelize } from "sequelize"

export interface OrderModel extends Model {
  id: number
  sessionId: string
  status: "pending" | "placed" | "shipped" | "delivered"
  subtotal: number
  tax: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export function initOrderModel(sequelize: Sequelize) {
  return sequelize.define<OrderModel>(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "placed", "shipped", "delivered"),
        allowNull: false,
        defaultValue: "pending",
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    },
  )
}
