import { Component } from '@angular/core';
import { DriverHubService } from '../../services/driverHub.service';
import { LocationService } from '../../services/location.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-map',
  imports: [FormsModule],
  templateUrl: './driver-map.html',
  styles: ``,
})
export class DriverMap {

    currentLatitude: number = 0;
  currentLongitude: number = 0;
  tripId: string ="";
constructor(private driverHubService: DriverHubService, private locationService: LocationService) {}

setAvailable(){
  this.locationService.getCurrentPosition().then(currentLocation => {
    this.driverHubService.SetAsAvailable({Lat: currentLocation.lat, Lng: currentLocation.lng}).subscribe(res => {
      console.log('Driver set as available', res);
    });
  }).catch(error => {
    console.error('Error getting current location', error);
  });
}

updateLocation(){
  this.driverHubService.UpdateLocation({Lat: this.currentLatitude, Lng: this.currentLongitude}).subscribe(res => {
    console.log('Driver location updated', res);
  });
}


acceptTrip(){
  this.driverHubService.AcceptTrip(this.tripId).subscribe(res => {
    console.log('Trip accepted successfully', res);
  }, err => {
    console.error('Error accepting trip', err);
  });

}

}
