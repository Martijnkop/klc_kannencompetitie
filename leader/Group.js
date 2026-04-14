// Group Object Definition
class Group {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  // Factory method to create from database row
  static fromRow(row) {
    return new Group(
      row.id,
      row.name
    );
  }
}

module.exports = Group;
