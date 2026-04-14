// User Object Definition
class User {
  constructor(lid_naam, group_id = null) {
    this.lid_naam = lid_naam;
    this.group_id = group_id;
  }

  // Factory method to create from database row
  static fromRow(row) {
    return new User(
      row.lid_naam,
      row.group_id
    );
  }
}

module.exports = User;
