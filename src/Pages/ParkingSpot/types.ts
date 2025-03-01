export type ParkingSpot = {
    id: number;
    location_name: string;
    address: string;
    longitude: number;
    latitude: number;
    b_total_spots: number;
    c_total_spots: number;
    b_available_spots: number;
    c_available_spots: number;
    b_cost: number;
    c_cost: number;
    ev_total_spots: number;
    ev_available_spots: number;
    ev_charging_cost: number;
    parking_type: string;
    admin_id: string;
    image?: string;
};

export type ParkingRating = {
    id: number;
    rating: number;
    comment: string;
    user_name: string;
    created_at: string;
}; 