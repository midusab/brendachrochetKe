import { DeliveryZone } from '../types';

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'nairobi_cbd',
    name: 'Nairobi CBD (Doorstep Rider)',
    feeKes: 150,
    estimatedDays: 'Same-day / 24 hours',
    description: 'Direct rider delivery to your office, apartment, or address in Nairobi CBD'
  },
  {
    id: 'nairobi_metro',
    name: 'Nairobi Metropolitan (Doorstep Rider)',
    feeKes: 300,
    estimatedDays: '1 business day',
    description: 'Westlands, Kilimani, Lavington, Karen, South B/C, Ngara, Kasarani, Langata'
  },
  {
    id: 'nairobi_environs',
    name: 'Nairobi Outskirts & Environs',
    feeKes: 450,
    estimatedDays: '1 - 2 business days',
    description: 'Kiambu Town, Ruiru, Kikuyu, Rongai, Ngong, Athi River, Thika, Kitengela'
  },
  {
    id: 'upcountry_express',
    name: 'Rest of Kenya (G4S / Wells Fargo / EasyCoach)',
    feeKes: 500,
    estimatedDays: '2 - 3 business days',
    description: 'Mombasa, Kisumu, Nakuru, Eldoret, Nyeri, Meru, Machakos, Malindi & all counties'
  },
  {
    id: 'international_express',
    name: 'International Express Courier (DHL)',
    feeKes: 2800,
    estimatedDays: '4 - 7 business days',
    description: 'Worldwide door-to-door insured air shipping with tracking'
  }
];

export const FREE_DELIVERY_THRESHOLD_KES = 10000;
