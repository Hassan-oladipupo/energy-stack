import { DataTypes, type Model, type Sequelize } from "sequelize"

export interface CartModel extends Model {
  id: number
  sessionId: string
  createdAt: Date
  updatedAt: Date
}

export function initCartModel(sequelize: Sequelize) {
  return sequelize.define<CartModel>(
    "Cart",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "carts",
      timestamps: true,
    },
  )
}
