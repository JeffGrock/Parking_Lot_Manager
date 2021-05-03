const { TestScheduler } = require("jest");
const ParkingLot = require("./ParkingLot");

parkingLot = new ParkingLot();

test("Reserve Empty Spot", () => {
  expect(parkingLot.reserveSpot(102)).toBe("space reserved");
});

test("Reserve Filled Spot", () => {
  parkingLot.reserveSpot(102);
  expect(parkingLot.reserveSpot(102)).toBe("spot unavailable");
});

test("Reserve Spot That Does Not Exist", () => {
  expect(parkingLot.reserveSpot(1000)).toBe("spot does not exist");
});

test("Check If Empty Spot Is Available", () => {
  expect(parkingLot.isParkingSpotAvailable(103)).toBe(true);
});

test("Check If Full Spot Is Available", () => {
  parkingLot.reserveSpot(103);
  expect(parkingLot.isParkingSpotAvailable(103)).toBe(false);
});

test("Check If Parking Lot Is Full", () => {
  expect(parkingLot.isParkingLotFull()).toBe(false);
});
