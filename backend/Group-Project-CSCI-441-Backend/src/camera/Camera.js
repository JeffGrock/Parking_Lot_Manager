class Camera {
  /**
   * Constructor for Camera.
   * @constructor
   * @param {DataBase} db - A reference to the database instance.
   * @param {ParkingLot} parkingLot - A reference to the Parking Lot instance.
   */
  constructor(db, parkingLot) {
    this.db = db;
    this.parkingLot = parkingLot;
  }
  spotOccupied(spot, plateNumber) {
    this.parkingLot.occupiedSpot(spot);
  }
  spotDeparted(spot, plateNumber) {
    this.parkingLot.openSpot(spot);
  }
}
