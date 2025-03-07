export interface Room {
    id: number;
    floor: number;
    isBooked: boolean;
}

export interface Booking {
    roomIds: number[];
    totalTravelTime: number;
}