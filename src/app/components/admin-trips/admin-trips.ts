
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-trips.html',
  styleUrls: ['./admin-trips.css'],
})
export class AdminTripsComponent implements OnInit {
  trips: any[] = [];
  tripId: string = '';
  tripStatus: string = '';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  tripStatusOptions: string[] = ['Pending', 'Accepted', 'Started', 'Completed', 'Cancelled'];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  goBack() {
    window.location.href = '/admin';
  }

  // Get trip by ID
  getTripById() {
    if (!this.tripId.trim()) {
      this.message = 'Please enter a trip ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getTripById(this.tripId).subscribe({
      next: (data) => {
        if (data) {
          this.trips = [data];
          this.isLoading = false;
          this.message = `Trip found`;
          this.messageType = 'success';
        } else {
          this.trips = [];
          this.isLoading = false;
          this.message = 'Trip not found';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.trips = [];
        this.message = 'Trip not found';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Get trips by status
  getTripsByStatus() {
    if (!this.tripStatus.trim()) {
      this.message = 'Please select a trip status';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getTripsByStatus(this.tripStatus).subscribe({
      next: (data) => {
        this.trips = data;
        this.isLoading = false;
        this.message = `Loaded ${data.length} trips with status: ${this.tripStatus}`;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.trips = [];
        this.message = 'Error loading trips by status';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }
}