import { DataTypes, type Model, type Sequelize } from "sequelize"

export interface OrderItemModel extends Model {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

export function initOrderItemModel(sequelize: Sequelize) {
  return sequelize.define<OrderItemModel>(
    "OrderItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "order_items",
      timestamps: true,
    },
  )
}
