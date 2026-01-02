export interface Vehicle {
  id: string;
  name: string;
  icon: string;
  base: number;
  km: number;
  hour: number;
  fullDay: number;
  capacity: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface SiteConfig {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  stats: Stat[];
  phones: string[];
  secondaryPhone?: string;
  emails: string[];
  address: string;
  vehicles: Vehicle[];
  gallery: string[];
  socialLinks: SocialLink[];
  serviceAreas: string[];
  reviews: Review[];
  faqs: FAQ[];
}

export enum TripType {
  ONE_WAY = 'One-Way',
  ROUND_TRIP = 'Round-Trip'
}

export interface BookingDetails {
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  pickupLocation: string;
  dropLocation: string;
  date: string;
  time: string;
  tripType: TripType;
}