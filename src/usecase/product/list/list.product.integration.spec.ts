import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from './list.product.usecase';

describe("Test list products use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a products", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = new Product("101", "Red Boots", 199.81);
    await productRepository.create(product1);
    const product2 = new Product("102", "Blue Boots", 299.81);
    await productRepository.create(product2);
    const product3 = new Product("103", " Dark Shoes", 399.81);
    await productRepository.create(product3);

    const output = await usecase.execute({});
    expect(output.products.length).toBe(3);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe(product1.name);
    expect(output.products[0].price).toBe(product1.price);
    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe(product2.name);
    expect(output.products[1].price).toBe(product2.price);
    expect(output.products[2].id).toBe(product3.id);
    expect(output.products[2].name).toBe(product3.name);
    expect(output.products[2].price).toBe(product3.price);
  });
});
