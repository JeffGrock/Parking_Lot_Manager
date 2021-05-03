/**
 * Represents a Parking Lot.
 */
class ParkingLot {
  /**
   * Constructor for Parking Lot.
   * @constructor
   * @param {DataBase} db - A reference to the database instance.
   */
  constructor(db) {
    this.db = db;
    //this is an example of what the array will look like, first set represents the X coordinate, second set represents the Y coordinate, and then each contains both the spotID and it's status

    this.parkingSpots = [
      [
        [101, "open"],
        [102, "open"],
        [103, "open"],
        [104, "open"],
        [105, "open"],
        [106, "open"],
        [107, "open"],
        [108, "open"],
        [109, "store"],
      ],
      [
        [201, "open"],
        [202, "open"],
        [203, "open"],
        [204, "open"],
        [205, "open"],
        [206, "open"],
        [207, "open"],
        [208, "open"],
        [209, "store"],
      ],
      [
        [301, "open"],
        [302, "open"],
        [303, "open"],
        [304, "open"],
        [305, "open"],
        [306, "open"],
        [307, "open"],
        [308, "open"],
        [309, "store"],
      ],
      [
        [401, "open"],
        [402, "open"],
        [403, "open"],
        [404, "open"],
        [405, "open"],
        [406, "open"],
        [407, "open"],
        [408, "open"],
        [409, "store"],
      ],
      [
        [501, "open"],
        [502, "open"],
        [503, "open"],
        [504, "open"],
        [505, "open"],
        [506, "open"],
        [507, "open"],
        [508, "open"],
        [509, "store"],
      ],
      [
        [601, "open"],
        [602, "open"],
        [603, "open"],
        [604, "open"],
        [605, "open"],
        [606, "open"],
        [607, "open"],
        [608, "open"],
        [609, "store"],
      ],
      [
        [701, "open"],
        [702, "open"],
        [703, "open"],
        [704, "open"],
        [705, "open"],
        [706, "open"],
        [707, "open"],
        [708, "open"],
        [709, "store"],
      ],
      [
        [801, "open"],
        [802, "open"],
        [803, "open"],
        [804, "open"],
        [805, "open"],
        [806, "open"],
        [807, "open"],
        [808, "open"],
        [809, "store"],
      ],
      [
        [901, "store"],
        [902, "store"],
        [903, "store"],
        [904, "store"],
        [905, "store"],
        [906, "store"],
        [907, "store"],
        [908, "store"],
        [909, "store"],
      ],
    ];
  }

  /**
   * Calls the database function to retrieve the current database object
   */
  getCurrentParkingLot() {
    return this.db.getCurrentParkingLot();
  }

  /**
   * Calls database function to add the parking spots to database.
   */
  addParkingLot() {
    this.db.addParkingLot({ parkingSpots: this.parkingSpots });
  }

  /**
   * Calls the database function to update the parking lot object
   */
  updateParkingLot(parkingSpots) {
    this.db.updateParkingLot(parkingSpots);
   }

   /**
    * Calls the database function to delete and re-add the parking lot object
    */
   deleteParkingLot() {
    defaultLot = new ParkingLot();
    this.db.deleteParkingLot({parkingSpots: defaultLot.parkingSpots});
   }

  /**
   * Attempts to reserve a spot based on spotID
   * @param {number} spotID - The id of the parking spot
   * @returns {string} - "space reserved", "spot unavailable" or "spot does not exist"
   */
  reserveSpot(spotID) {
    for (let i = 0; i <= this.parkingSpots.length - 1; i++) {
      for (let j = 0; j <= this.parkingSpots[i].length - 1; j++) {
        if (this.parkingSpots[i][j][0] == spotID) {
          if (this.parkingSpots[i][j][1] == "open") {
            this.parkingSpots[i][j][1] = "reserved";
            return "space reserved";
          } else {
            return "spot unavailable";
          }
        }
      }
    }
    return "spot does not exist";
  }

  /**
   * Takes ID for the spot and checks if it is "open"
   * @param {number} spotID - The id of the parking spot
   * @returns {boolean} - true if spot is available
   */
  isParkingSpotAvailable(spotID) {
    for (let i = 0; i <= this.parkingSpots.length - 1; i++) {
      for (let j = 0; j <= this.parkingSpots[i].length - 1; j++) {
        if (this.parkingSpots[i][j][0] == spotID) {
          if (this.parkingSpots[i][j][1] == "open") {
            return true;
          } else {
            return false;
          }
        }
      }
    }
    return false;
  }

  /**
   * Takes ID for spot and returns x coordinate
   * @param {number} spotID - The id of the parking spot
   * @returns {number} - The column index of the parking spot in the array
   */
  findSpotCoordinatesX(spotID) {
    for (let i = 0; i <= this.parkingSpots.length - 1; i++) {
      for (let j = 0; j <= this.parkingSpots[i].length - 1; j++) {
        if (this.parkingSpots[i][j][0] == spotID) {
          return i;
        }
      }
    }
    return "does not exist";
  }

  /**
   * Takes ID for spot and returns y coordinate
   * @param {number} spotID - The id of the parking spot
   * @returns {number} - The row index of the parking spot in the array
   */
  findSpotCoordinatesY(spotID) {
    for (let i = 0; i <= this.parkingSpots.length - 1; i++) {
      for (let j = 0; j <= this.parkingSpots[i].length - 1; j++) {
        if (this.parkingSpots[i][j][0] == spotID) {
          return j;
        }
      }
    }
    return "does not exist";
  }

  /**
   * Takes spot and updates its status to "open"
   * @param {number} spotID - The id of the parking spot
   */
  openSpot(spotID) {
    this.updateSpotStatus(spotID, "open");
  }

  /**
   * Takes spot and updates its status to "reserved"
   * @param {number} spotID - The id of the parking spot
   */
  reservedSpot(spotID) {
    this.updateSpotStatus(spotID, "reserved");
  }

  /**
   * Takes spot and updates its status to "occupied" when camera detects car is present
   * @param {number} spotID - The id of the parking spot
   */
  occupiedSpot(spotID) {
    this.updateSpotStatus(spotID, "occupied");
  }

  /**
   * Takes spot and updates its status to "closed"
   * @param {number} spotID - The id of the parking spot
   */
  closeSpot(spotID) {
    this.updateSpotStatus(spotID, "closed");
  }

  /**
   * Takes spot and updates its status to "store"
   * @param {number} spotID - The id of the parking spot
   */
  storeSpot(spotID) {
    this.updateSpotStatus(spotID, "store");
  }

  /**
   * Checks if the parking lot is full.
   * @returns {boolean} - true if parking lot is full
   */
  isParkingLotFull() {
    for (let i = 0; i <= this.parkingSpots.length - 1; i++) {
      for (let j = 0; j <= this.parkingSpots[i].length - 1; j++) {
        if (this.parkingSpots[i][j][1] == "open") {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Takes the parking spot's ID and the string status to be updated to
   * @param {number} spotID - The id of the parking spot
   * @param {string} newSpotStatus - The new status of the spot
   */
  updateSpotStatus(spotID, newSpotStatus) {
    for (let i = 0; i <= this.parkingSpots.length - 1; i++) {
      for (let j = 0; j <= this.parkingSpots[i].length - 1; j++) {
        if (this.parkingSpots[i][j][0] == spotID) {
          this.parkingSpots[i][j][1] = newSpotStatus;
        }
      }
    }
  }

  /**
   * Takes ID for store and returns the ID for the closest "open" parking spot
   * @param {number} storeID - The id of the store
   * @returns {number} - the closest open parking spot to the store
   */
  findClosestSpot(storeID) {
    let xStore = this.findSpotCoordinatesX(storeID); //get x coordinate for storeID
    let yStore = this.findSpotCoordinatesY(storeID); //get y coordinate for storeID
    let distanceTemp = 999;
    let shortestSpotID = 0;
    //EACH parkingSpot HAS AN x AND A y VALUE FROM THE MATRIX TO BE USED FOR ALGORITHM
    //USE DISTANCE FORMULA TO FIND CLOSEST AVAILALBLE SPOT TO THE SELECTED store's coordinates
    for (let i = 0; i <= this.parkingSpots.length - 1; i++) {
      for (let j = 0; j <= this.parkingSpots[i].length - 1; j++) {
        if (
          Math.sqrt((xStore - i) * (xStore - i) + (yStore - j) * (yStore - j)) <
          distanceTemp
        ) {
          if (this.parkingSpots[i][j][1] == "open") {
            distanceTemp = Math.sqrt(
              (xStore - i) * (xStore - i) + (yStore - j) * (yStore - j)
            );
            shortestSpotID = this.parkingSpots[i][j][0];
          }
        }
      }
    }
    if (shortestSpotID != 0) {
      this.reservedSpot(shortestSpotID);
      return shortestSpotID;
    }
    return "no spot available";
  }

  //FUCNTION: returns random "open" spot
  /**
   * Returns random "open" spot
   * @returns {number} - random open parking spot
   */
  findRandomSpot() {
    while (this.isParkingLotFull() == false) {
      let xSpot = Math.floor(
        Math.random() * Math.floor(this.parkingSpots.length - 1)
      );
      let ySpot = Math.floor(
        Math.random() * Math.floor(this.parkingSpots[xSpot].length - 1)
      );
      if (this.parkingSpots[xSpot][ySpot][1] == "open") {
        this.reservedSpot(this.parkingSpots[xSpot][ySpot][0]);
        return this.parkingSpots[xSpot][ySpot][0];
      }
    }
  }
}

module.exports = ParkingLot;
