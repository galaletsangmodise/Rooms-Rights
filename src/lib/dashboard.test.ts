export type RoomAmount = { rent_amount: number };

export function summariseRooms(rooms: RoomAmount[]) {
  return {
    roomCount: rooms.length,
    monthlyRent: rooms.reduce((total, room) => total + room.rent_amount, 0),
  };
}