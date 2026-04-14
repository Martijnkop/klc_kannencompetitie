// ProductSalesSimplified Object Definition
class ProductSalesSimplified {
  constructor(product_name, product_id, product_amount, lid_naam = null) {
    this.product_name = product_name;
    this.product_id = product_id;
    this.product_amount = product_amount;
    this.lid_naam = lid_naam;
  }

  // Factory method to create from database row
  static fromRow(row) {
    return new ProductSalesSimplified(
      row.product_name,
      row.product_id,
      row.product_amount,
      row.lid_naam
    );
  }
}

module.exports = ProductSalesSimplified;
