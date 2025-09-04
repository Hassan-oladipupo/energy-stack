module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "products",
      [
        {
          name: "SolarMax Pro 400W Panel",
          description:
            "High-efficiency monocrystalline solar panel with 21% efficiency rating. Perfect for residential installations.",
          price: 299.99,
          category: "solar-panels",
          stock: 50,
          images: ["/solar-panel-installation.png"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "PowerInvert 5000W Hybrid Inverter",
          description: "Smart hybrid inverter with battery backup capability and WiFi monitoring.",
          price: 1299.99,
          category: "inverters",
          stock: 25,
          images: ["/solar-inverter.png"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "EnergyStore 10kWh Lithium Battery",
          description: "Long-lasting lithium iron phosphate battery with 6000+ cycle life.",
          price: 2499.99,
          category: "batteries",
          stock: 15,
          images: ["/solar-battery.png"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "SolarMount Roof Kit",
          description: "Complete mounting solution for tile and metal roofs. Includes all hardware.",
          price: 199.99,
          category: "accessories",
          stock: 100,
          images: ["/solar-mounting-kit.png"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "EcoPanel 350W Monocrystalline",
          description: "Cost-effective solar panel with excellent performance in low light conditions.",
          price: 249.99,
          category: "solar-panels",
          stock: 75,
          images: ["/eco-solar-panel.png"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "SmartCharge MPPT Controller",
          description: "60A MPPT charge controller with LCD display and smartphone app.",
          price: 189.99,
          category: "accessories",
          stock: 40,
          images: ["/mppt-controller.png"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {})
  },
}
