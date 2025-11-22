import { Component } from '@angular/core';
import { Coordinates } from '../../models/trip-request.dto';
import { TripService } from '../../services/trip.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rider-map',
  imports: [FormsModule],
  templateUrl: './rider-map.html',
  styles: ``,
})
export class RiderMap {

role:string ="";
currentLatitude: String|null=null;
currentLongitude: String|null=null;
destinationLatitude: String|null=null;
destinationLongitude: String|null=null;
constructor( private tripService: TripService) {}
requestTrip() {
  // Log the raw coordinate values
  console.log('Raw coordinates:', {
    currentLat: this.currentLatitude,
    currentLng: this.currentLongitude,
    destLat: this.destinationLatitude,
    destLng: this.destinationLongitude
  });

  const request = {
    PaymentMethod: 1,
    PickupCoordinates: {
      Lat: +this.currentLatitude!,   // Unary + converts string to number
      Lng: +this.currentLongitude!
    },
    DistinationCoordinates: {
      Lat: +this.destinationLatitude!,
      Lng: +this.destinationLongitude!
    }
  };

  // Log the complete request object
  console.log('Complete request object:', request);
  console.log('Request as JSON:', JSON.stringify(request));
  
  // Log individual nested objects
  console.log('PickupCoordinates:', request.PickupCoordinates);
  console.log('DistinationCoordinates:', request.DistinationCoordinates);

  this.tripService.requestTrip(request).subscribe({
    next: (res) => {
      console.log('SUCCESS:', res);
    },
    error: (err) => {
      console.error('ERROR Status:', err.status);
      console.error('ERROR Response:', err.error);
      console.error('Full error object:', JSON.stringify(err.error, null, 2));
    }
  });
}
}
