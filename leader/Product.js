// Product Object Definition
class Product {
  constructor(product_id, product_name, multiplier = 1) {
    this.product_id = product_id;
    this.product_name = product_name;
    this.multiplier = multiplier;
  }

  // Factory method to create from database row
  static fromRow(row) {
    return new Product(
      row.product_id,
      row.product_name,
      row.multiplier
    );
  }
}

module.exports = Product;
