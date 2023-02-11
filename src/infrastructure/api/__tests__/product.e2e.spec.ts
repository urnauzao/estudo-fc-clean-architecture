import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Golden Boots",
        price: 129.02,
        type: 'a'
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Golden Boots");
    expect(response.body.price).toBe(129.02);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "pencil 3x",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Green Legs",
        price: 30.00,
        type: 'a'
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Blue Legs",
        price: 31.59,
        type: 'a'
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe("Green Legs");
    expect(product.price).toBe(30.00);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Blue Legs");
    expect(product2.price).toBe(31.59);

    const listResponseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Green Legs</name>`);
    expect(listResponseXML.text).toContain(`<price>30</price>`);
    expect(listResponseXML.text).toContain(`<name>Blue Legs</name>`);
    expect(listResponseXML.text).toContain(`<price>31.59</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});
