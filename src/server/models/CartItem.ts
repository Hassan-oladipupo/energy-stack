import { DataTypes, type Model, type Sequelize } from "sequelize"

export interface CartItemModel extends Model {
  id: number
  cartId: number
  productId: number
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export function initCartItemModel(sequelize: Sequelize) {
  return sequelize.define<CartItemModel>(
    "CartItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cartId: {
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
    },
    {
      tableName: "cart_items",
      timestamps: true,
    },
  )
}
