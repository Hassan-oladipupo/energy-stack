import { sequelize } from "../models"
import { beforeAll, afterAll, beforeEach } from "@jest/globals"

beforeAll(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.close()
})

beforeEach(async () => {
  // Clean up database before each test
  await sequelize.truncate({ cascade: true })
})
