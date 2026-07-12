// Mock data + placeholder async fetchers. Swap with real API calls later.

export type VehicleStatus = "active" | "maintenance" | "idle" | "retired";
export type DriverStatus = "on-duty" | "off-duty" | "on-leave";
export type TripStatus = "scheduled" | "in-transit" | "completed" | "cancelled";
export type MaintenanceStatus = "scheduled" | "in-progress" | "completed" | "overdue";

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  year: number;
  odometer: number;
  status: VehicleStatus;
  driver?: string;
  fuelType: "Diesel" | "Petrol" | "Electric";
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  licenseExpiry: string; // ISO date
  status: DriverStatus;
  rating: number;
  assignedVehicle?: string;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  vehicle: string;
  driver: string;
  departure: string;
  arrival: string;
  distanceKm: number;
  status: TripStatus;
}

export interface MaintenanceRecord {
  id: string;
  vehicle: string;
  type: string;
  date: string;
  cost: number;
  status: MaintenanceStatus;
  notes?: string;
}

export interface FuelLog {
  id: string;
  vehicle: string;
  date: string;
  liters: number;
  costPerLiter: number;
  total: number;
  odometer: number;
  station: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  vehicle?: string;
}

export const vehicles: Vehicle[] = [
  { id: "V-1001", plate: "MH-12 AB 1234", model: "Tata Ace Gold", type: "Mini Truck", year: 2022, odometer: 48210, status: "active", driver: "Rohit Sharma", fuelType: "Diesel" },
  { id: "V-1002", plate: "DL-08 CA 4521", model: "Mahindra Bolero Pickup", type: "Pickup", year: 2021, odometer: 72340, status: "active", driver: "Anil Verma", fuelType: "Diesel" },
  { id: "V-1003", plate: "KA-03 MK 7788", model: "Ashok Leyland Dost", type: "Light Truck", year: 2020, odometer: 96120, status: "maintenance", driver: "Suresh Rao", fuelType: "Diesel" },
  { id: "V-1004", plate: "TN-22 BX 5566", model: "Eicher Pro 2049", type: "Truck", year: 2023, odometer: 22580, status: "active", driver: "Karthik R", fuelType: "Diesel" },
  { id: "V-1005", plate: "GJ-05 KL 9911", model: "Tata 407", type: "Truck", year: 2019, odometer: 128900, status: "idle", fuelType: "Diesel" },
  { id: "V-1006", plate: "MH-14 EE 2244", model: "Mahindra Treo Zor", type: "3-Wheeler EV", year: 2024, odometer: 8450, status: "active", driver: "Vikas Patil", fuelType: "Electric" },
  { id: "V-1007", plate: "RJ-14 UY 3311", model: "Force Trax", type: "Van", year: 2018, odometer: 158420, status: "retired", fuelType: "Diesel" },
  { id: "V-1008", plate: "UP-32 QW 8899", model: "Tata Intra V30", type: "Mini Truck", year: 2023, odometer: 31220, status: "active", driver: "Manoj Kumar", fuelType: "Diesel" },
];

export const drivers: Driver[] = [
  { id: "D-201", name: "Rohit Sharma", phone: "+91 98765 43210", license: "MH1420180012345", licenseExpiry: "2026-08-14", status: "on-duty", rating: 4.7, assignedVehicle: "MH-12 AB 1234" },
  { id: "D-202", name: "Anil Verma", phone: "+91 99887 12345", license: "DL0820190098234", licenseExpiry: "2026-02-11", status: "on-duty", rating: 4.5, assignedVehicle: "DL-08 CA 4521" },
  { id: "D-203", name: "Suresh Rao", phone: "+91 90000 22334", license: "KA0320170045678", licenseExpiry: "2026-01-30", status: "off-duty", rating: 4.2, assignedVehicle: "KA-03 MK 7788" },
  { id: "D-204", name: "Karthik R", phone: "+91 98211 55667", license: "TN2220210033221", licenseExpiry: "2027-05-22", status: "on-duty", rating: 4.8, assignedVehicle: "TN-22 BX 5566" },
  { id: "D-205", name: "Vikas Patil", phone: "+91 90909 88776", license: "MH1420200011223", licenseExpiry: "2026-03-05", status: "on-duty", rating: 4.6, assignedVehicle: "MH-14 EE 2244" },
  { id: "D-206", name: "Manoj Kumar", phone: "+91 97777 44556", license: "UP3220160055667", licenseExpiry: "2026-11-18", status: "on-leave", rating: 4.4, assignedVehicle: "UP-32 QW 8899" },
  { id: "D-207", name: "Deepak Yadav", phone: "+91 98123 09876", license: "HR2620200044556", licenseExpiry: "2027-09-01", status: "off-duty", rating: 4.3 },
];

export const trips: Trip[] = [
  { id: "T-9001", origin: "Mumbai", destination: "Pune", vehicle: "MH-12 AB 1234", driver: "Rohit Sharma", departure: "2026-07-12T06:30", arrival: "2026-07-12T10:15", distanceKm: 148, status: "completed" },
  { id: "T-9002", origin: "Delhi", destination: "Jaipur", vehicle: "DL-08 CA 4521", driver: "Anil Verma", departure: "2026-07-12T05:00", arrival: "2026-07-12T11:20", distanceKm: 268, status: "in-transit" },
  { id: "T-9003", origin: "Chennai", destination: "Bengaluru", vehicle: "TN-22 BX 5566", driver: "Karthik R", departure: "2026-07-13T22:00", arrival: "2026-07-14T05:30", distanceKm: 346, status: "scheduled" },
  { id: "T-9004", origin: "Ahmedabad", destination: "Surat", vehicle: "GJ-05 KL 9911", driver: "—", departure: "2026-07-11T13:00", arrival: "2026-07-11T17:20", distanceKm: 265, status: "cancelled" },
  { id: "T-9005", origin: "Pune", destination: "Nashik", vehicle: "MH-14 EE 2244", driver: "Vikas Patil", departure: "2026-07-12T08:00", arrival: "2026-07-12T12:00", distanceKm: 210, status: "in-transit" },
  { id: "T-9006", origin: "Lucknow", destination: "Kanpur", vehicle: "UP-32 QW 8899", driver: "Manoj Kumar", departure: "2026-07-10T09:00", arrival: "2026-07-10T11:00", distanceKm: 88, status: "completed" },
];

export const maintenance: MaintenanceRecord[] = [
  { id: "M-501", vehicle: "KA-03 MK 7788", type: "Engine Overhaul", date: "2026-07-10", cost: 42500, status: "in-progress", notes: "Turbocharger replacement" },
  { id: "M-502", vehicle: "MH-12 AB 1234", type: "Oil Change", date: "2026-07-08", cost: 3800, status: "completed" },
  { id: "M-503", vehicle: "DL-08 CA 4521", type: "Tyre Rotation", date: "2026-07-15", cost: 1500, status: "scheduled" },
  { id: "M-504", vehicle: "TN-22 BX 5566", type: "Brake Pad Replacement", date: "2026-07-05", cost: 6200, status: "completed" },
  { id: "M-505", vehicle: "GJ-05 KL 9911", type: "Battery Replacement", date: "2026-07-01", cost: 8900, status: "overdue" },
];

export const fuelLogs: FuelLog[] = [
  { id: "F-101", vehicle: "MH-12 AB 1234", date: "2026-07-11", liters: 45, costPerLiter: 92.5, total: 4162.5, odometer: 48210, station: "IOCL Vashi" },
  { id: "F-102", vehicle: "DL-08 CA 4521", date: "2026-07-11", liters: 60, costPerLiter: 90.8, total: 5448, odometer: 72340, station: "HPCL Karol Bagh" },
  { id: "F-103", vehicle: "TN-22 BX 5566", date: "2026-07-10", liters: 80, costPerLiter: 91.2, total: 7296, odometer: 22580, station: "BPCL Guindy" },
  { id: "F-104", vehicle: "UP-32 QW 8899", date: "2026-07-09", liters: 55, costPerLiter: 89.9, total: 4944.5, odometer: 31220, station: "IOCL Hazratganj" },
  { id: "F-105", vehicle: "MH-12 AB 1234", date: "2026-07-05", liters: 42, costPerLiter: 92.1, total: 3868.2, odometer: 47780, station: "IOCL Vashi" },
];

export const expenses: Expense[] = [
  { id: "E-301", category: "Toll", description: "Mumbai-Pune Expressway", date: "2026-07-12", amount: 320, vehicle: "MH-12 AB 1234" },
  { id: "E-302", category: "Repair", description: "Windshield wiper", date: "2026-07-10", amount: 850, vehicle: "DL-08 CA 4521" },
  { id: "E-303", category: "Insurance", description: "Quarterly premium", date: "2026-07-01", amount: 18200 },
  { id: "E-304", category: "Parking", description: "Warehouse overnight", date: "2026-07-09", amount: 450, vehicle: "TN-22 BX 5566" },
  { id: "E-305", category: "Permit", description: "Interstate permit", date: "2026-07-04", amount: 2100 },
];

export const fleetTrend = [
  { month: "Feb", trips: 210, distance: 42000 },
  { month: "Mar", trips: 245, distance: 48200 },
  { month: "Apr", trips: 268, distance: 51800 },
  { month: "May", trips: 302, distance: 58900 },
  { month: "Jun", trips: 288, distance: 55400 },
  { month: "Jul", trips: 321, distance: 62100 },
];

export const fuelSpendTrend = [
  { week: "W1", diesel: 128000, electric: 4200 },
  { week: "W2", diesel: 142000, electric: 4600 },
  { week: "W3", diesel: 135000, electric: 5100 },
  { week: "W4", diesel: 156000, electric: 5400 },
];

export const utilizationByType = [
  { name: "Mini Truck", value: 32 },
  { name: "Truck", value: 24 },
  { name: "Pickup", value: 18 },
  { name: "Van", value: 12 },
  { name: "EV", value: 14 },
];

// Placeholder async fetchers — backend team can swap the internals later.
const wait = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(v), ms));
export const fetchVehicles = () => wait(vehicles);
export const fetchDrivers = () => wait(drivers);
export const fetchTrips = () => wait(trips);
export const fetchMaintenance = () => wait(maintenance);
export const fetchFuelLogs = () => wait(fuelLogs);
export const fetchExpenses = () => wait(expenses);
