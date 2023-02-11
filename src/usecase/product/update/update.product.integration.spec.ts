import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from './update.product.usecase';
import CreateProductUseCase from './../create/create.product.usecase';
import FindProductUseCase from './../find/find.product.usecase';

describe("Test update product use case", () => {
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

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const findProductUseCase = new FindProductUseCase(productRepository);

    const input = {
      name: "Boots Xtreme",
      price: 199.99,
      type: "a"
    };

    const product = await createProductUseCase.execute(input);

    expect(input.name).toEqual(product.name);
    expect(input.price).toEqual(product.price);
    expect(product.id).toBeTruthy();

    product.name = "Coca-Cola";
    product.price = 5.60;

    const output = await usecase.execute(product);
    const updated = await findProductUseCase.execute({ id: product.id });
    expect(output.name).toEqual(updated.name);
    expect(output.price).toEqual(updated.price);
    expect(output.name).toEqual(product.name);
    expect(output.price).toEqual(product.price);

  });
});
