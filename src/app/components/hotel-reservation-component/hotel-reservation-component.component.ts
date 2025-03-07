import { Component } from '@angular/core';
import { Booking, Room } from '../../model/hotel';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-hotel-reservation-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-reservation-component.component.html',
  styleUrl: './hotel-reservation-component.component.scss'
})
export class HotelReservationComponentComponent {
  bookingForm: FormGroup;
  rooms: Room[] = [];
  lastBooking: Booking | null = null;

  constructor(public hotelService: HotelService, private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      numberOfRooms: [
        null,
        [Validators.required, Validators.min(1), Validators.max(5)]
      ]
    });

    console.log('constructor intialized');
    this.rooms = this.hotelService.getAllRooms();
    console.log('rooms ==>', this.rooms);
  }

  ngOnInit() {
    console.log('ngOnInit intialized');
  }

  bookRooms() {
    const numberOfRooms = this.bookingForm.get('numberOfRooms')?.value;
    if (numberOfRooms < 1 || numberOfRooms > 5) {
      return;
    }

    const booking = this.hotelService.findOptimalRooms(numberOfRooms);

    if (booking) {
      const success = this.hotelService.bookRooms(booking.roomIds);
      if (success) {
        this.lastBooking = booking;
        this.rooms = this.hotelService.getAllRooms();
      } else {
        alert('Failed to book rooms');
      }
    } else {
      alert('No suitable rooms available');
    }
  }

  generateRandomOccupancy() {
    this.hotelService.generateRandomOccupancy();
    this.rooms = this.hotelService.getAllRooms();
    this.lastBooking = null;
  }

  resetBookings() {
    this.hotelService.resetBookings();
    this.rooms = this.hotelService.getAllRooms();
    this.lastBooking = null;
  }

}
