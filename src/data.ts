import { Product } from './types';

const sampleReviews = [
  { id: 'r1', author: 'Michael T.', rating: 5, comment: 'Absolutely incredible performance and the camera is unmatched.', date: '2026-05-12' },
  { id: 'r2', author: 'Sarah J.', rating: 4, comment: 'Great phone overall, but battery life could be slightly better out of the box.', date: '2026-04-28' },
  { id: 'r3', author: 'David L.', rating: 5, comment: 'The screen is so fluid and responsive. Best upgrade I have made in years.', date: '2026-06-01' }
];

export const products: Product[] = [
  {
    id: 'p-1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 155000,
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
    features: ['Titanium Design', 'A17 Pro Chip', 'Pro Camera System'],
    specs: {
      screen: '6.7" Super Retina XDR (120Hz)',
      processor: 'A17 Pro',
      ram: '8GB',
      storage: '256GB / 512GB / 1TB',
      battery: '4422 mAh',
      camera: 'Triple 48MP Rear / 12MP Front'
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'p-2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 168000,
    description: 'Galaxy AI is here. Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
    features: ['Galaxy AI', 'Built-in S Pen', 'Titanium Exterior'],
    specs: {
      screen: '6.8" Dynamic AMOLED 2X (120Hz)',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB / 512GB / 1TB',
      battery: '5000 mAh',
      camera: 'Quad 200MP Rear / 12MP Front'
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'p-3',
    name: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    price: 116000,
    description: 'Leica optics meet Snapdragon 8 Gen 3 performance. The Xiaomi 14 Pro delivers an uncompromised flagship experience with an immersive micro-curved display.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?q=80&w=800&auto=format&fit=crop',
    features: ['Leica Summilux Lens', 'HyperOS', '120W HyperCharge'],
    specs: {
      screen: '6.73" AMOLED (120Hz)',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB / 16GB',
      storage: '256GB / 512GB',
      battery: '4880 mAh',
      camera: 'Triple 50MP Rear / 32MP Front'
    }
  },
  {
    id: 'p-4',
    name: 'Redmi Note 13 Pro+',
    brand: 'Redmi',
    price: 51000,
    description: 'Every shot is a masterpiece with the 200MP ultra-high res camera with OIS. Experience smooth visuals on the 1.5K curved AMOLED display.',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop',
    features: ['200MP OIS Camera', '120W Fast Charging', 'IP68 Water Resistance'],
    specs: {
      screen: '6.67" AMOLED (120Hz)',
      processor: 'Dimensity 7200-Ultra',
      ram: '8GB / 12GB',
      storage: '256GB / 512GB',
      battery: '5000 mAh',
      camera: 'Triple 200MP Rear / 16MP Front'
    }
  },
  {
    id: 'p-5',
    name: 'Tecno Phantom V Fold',
    brand: 'Tecno',
    price: 142000,
    description: 'Unfold endless possibilities with Tecno\'s premium foldable device. Featuring an aerospace-grade hinge and a stunning dual display setup.',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop',
    features: ['Foldable Design', '5-Lens Camera System', 'Virtually Creaseless'],
    specs: {
      screen: '7.85" Foldable AMOLED / 6.42" Cover',
      processor: 'Dimensity 9000+',
      ram: '12GB',
      storage: '256GB / 512GB',
      battery: '5000 mAh',
      camera: 'Triple 50MP Rear / 32MP+16MP Front'
    }
  },
  {
    id: 'p-6',
    name: 'iPhone 15',
    brand: 'Apple',
    price: 103000,
    description: 'Dynamic Island comes to iPhone 15. Innovative new design features durable color-infused glass and aluminum. A 48MP Main camera shoots in super-high resolution.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    features: ['Dynamic Island', 'Color-infused Glass', 'USB-C Connectivity'],
    specs: {
      screen: '6.1" Super Retina XDR (60Hz)',
      processor: 'A16 Bionic',
      ram: '6GB',
      storage: '128GB / 256GB / 512GB',
      battery: '3349 mAh',
      camera: 'Dual 48MP Rear / 12MP Front'
    }
  },
  {
    id: 'p-7',
    name: 'Sony Xperia 1 V',
    brand: 'Sony',
    price: 180000,
    description: 'Pro camera, pro display. Created with Sony Alpha engineers for unparalleled photography.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?q=80&w=800&auto=format&fit=crop',
    features: ['Exmor T Mobile Sensor', '4K HDR OLED 120Hz', 'Real-time Eye AF', '3.5mm Audio Jack'],
    specs: {
      screen: '6.5" 4K HDR OLED 120Hz',
      processor: 'Snapdragon 8 Gen 2',
      ram: '12GB',
      storage: '256GB / 512GB',
      battery: '5000 mAh',
      camera: 'Triple 48MP Rear / 12MP Front'
    }
  },
  {
    id: 'p-8',
    name: 'Asus ROG Phone 8 Pro',
    brand: 'Asus',
    price: 155000,
    description: 'Beyond gaming. A premium flagship with uncompromising gaming DNA and sleek redesign.',
    image: 'https://images.unsplash.com/photo-1649859398021-afbfe80e83b9?q=80&w=800&auto=format&fit=crop',
    features: ['165Hz AMOLED', 'AirTrigger Controls', 'AeroActive Cooler X Support', 'IP68 Water Resistance'],
    specs: {
      screen: '6.78" FHD+ AMOLED 165Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '16GB / 24GB',
      storage: '512GB / 1TB',
      battery: '5500 mAh',
      camera: 'Triple 50MP Rear / 32MP Front'
    }
  }
].map(p => ({ ...p, reviews: sampleReviews }));
