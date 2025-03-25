import { Injectable } from '@angular/core';
import { Booking, Room } from '../model/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private rooms: Room[] = [];

  constructor() {
    this.initializeRooms();
  }

  private initializeRooms() {
    for (let floor = 1; floor <= 9; floor++) {
      for (let roomNum = 1; roomNum <= 10; roomNum++) {
        this.rooms.push({ id: floor * 100 + roomNum, floor: floor, isBooked: false });
      }
    }
    for (let roomNum = 1; roomNum <= 7; roomNum++) {
      this.rooms.push({ id: 1000 + roomNum, floor: 10, isBooked: false });
    }
  }

  getAllRooms(): Room[] {
    return this.rooms;
  }

  private calculateTotalTravelTime(rooms: Room[]): number {
    console.log('rooms =>', rooms);

    if (rooms.length <= 1) return 0;

    const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
    console.log('floors =>', floors);

    const minFloor = floors[0];
    const maxFloor = floors[floors.length - 1];

    let horizontalTravel = 0;
    floors.forEach(floor => {
      const floorRooms = rooms.filter(r => r.floor === floor).map(r => r.id % 100);
      console.log('floorRooms =>', floorRooms);

      horizontalTravel += Math.max(...floorRooms) - Math.min(...floorRooms);
    });

    let verticalTravel = (maxFloor - minFloor) * 2;
    return horizontalTravel + verticalTravel;
  }

  findOptimalRooms(numberOfRooms: number): Booking | null {
    const availableRooms = this.rooms.filter(room => !room.isBooked);
    const roomsByFloor = new Map<number, Room[]>(); // { floor number, room data }

    availableRooms.forEach(room => {
      if (!roomsByFloor.has(room.floor)) roomsByFloor.set(room.floor, []);
      roomsByFloor.get(room.floor)!.push(room);
    });

    let bestBooking: Booking | null = null;
    let minTravelTime = Infinity;

    console.log('values =>', roomsByFloor.entries());

    // Try to book all rooms on a single floor first
    // sliding window approach
    for (const [floor, floorRooms] of roomsByFloor.entries()) {
      if (floorRooms.length >= numberOfRooms) {
        const sortedRooms = floorRooms.sort((a, b) => a.id - b.id);
        for (let i = 0; i <= sortedRooms.length - numberOfRooms; i++) {
          const candidateRooms = sortedRooms.slice(i, i + numberOfRooms);
          const travelTime = this.calculateTotalTravelTime(candidateRooms);
          if (travelTime < minTravelTime) {
            minTravelTime = travelTime;
            bestBooking = { roomIds: candidateRooms.map(room => room.id), totalTravelTime: travelTime };
          }
        }
      }
    }

    // If no single-floor option, find optimal multi-floor booking
    if (!bestBooking) {
      const sortedFloors = [...roomsByFloor.keys()].sort((a, b) => a - b);

      for (let i = 0; i < sortedFloors.length; i++) {
        let candidateRooms: Room[] = [];
        for (let j = i; j < sortedFloors.length && candidateRooms.length < numberOfRooms; j++) {
          candidateRooms = candidateRooms.concat(roomsByFloor.get(sortedFloors[j]) || []);
          if (candidateRooms.length >= numberOfRooms) {
            candidateRooms = candidateRooms.slice(0, numberOfRooms);
            const travelTime = this.calculateTotalTravelTime(candidateRooms);
            if (travelTime < minTravelTime) {
              minTravelTime = travelTime;
              bestBooking = { roomIds: candidateRooms.map(room => room.id), totalTravelTime: travelTime };
            }
            break;
          }
        }
      }
    }

    return bestBooking;
  }


  bookRooms(roomIds: number[]): boolean {
    const rooms = roomIds.map(id => this.rooms.find(r => r.id === id)!);
    if (rooms.some(room => room.isBooked)) return false;
    rooms.forEach(room => (room.isBooked = true));
    return true;
  }

  resetBookings() {
    this.rooms.forEach(room => (room.isBooked = false));
  }

  generateRandomOccupancy() {
    this.resetBookings();
    const totalRooms = this.rooms.length;
    const roomsToBook = Math.floor(totalRooms * (Math.random() * 0.7));
    for (let i = 0; i < roomsToBook; i++) {
      const availableRooms = this.rooms.filter(room => !room.isBooked);
      if (availableRooms.length > 0) {
        availableRooms[Math.floor(Math.random() * availableRooms.length)].isBooked = true;
      }
    }
  }

  getRoomsGroupedByFloor(): { floor: number, rooms: Room[] }[] {
    const groupedRooms = [];
    for (let floor = 1; floor <= 10; floor++) {
      const roomsOnFloor = this.rooms.filter(room => room.floor === floor);
      if (roomsOnFloor.length > 0) {
        groupedRooms.push({ floor: floor, rooms: roomsOnFloor });
      }
    }
    return groupedRooms;
  }
}
