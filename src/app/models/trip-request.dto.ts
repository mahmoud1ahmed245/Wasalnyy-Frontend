export interface TripRequestDto {
  PaymentMethod: number;
  PickupCoordinates: Coordinates;
  DistinationCoordinates: Coordinates;  // Typo matches backend
}

export interface Coordinates {
  Lat: number;
  Lng: number;
}