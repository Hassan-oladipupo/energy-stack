import { DataTypes, type Model, type Sequelize } from "sequelize"

export interface ProductModel extends Model {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export function initProductModel(sequelize: Sequelize) {
  return sequelize.define<ProductModel>(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["solar-panels", "inverters", "batteries", "accessories"]],
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      tableName: "products",
      timestamps: true,
    },
  )
}
