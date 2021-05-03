class PayRate {
    constructor(db, parkingLot) {
      this.db = db;
      this.parkingLot = parkingLot;
    }
  
    getPayRate() {
      return this.db.getPayRate();
    }

    updatePayRate(id, data) {
      return this.db.updatePayRate(id, data);  
    }
  }
  
  module.exports = PayRate;
  