// Mock inventory data
export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  availability: 'Available' | 'Low' | 'Out of Stock';
  stock: number;
  reorder: number;
  image?: string;
}

export const getMockInventory = (): InventoryItem[] => [
  {
    id: '1',
    itemCode: 'I-1001',
    name: 'Surgical Masks',
    category: 'PPE',
    availability: 'Available',
    stock: 500,
    reorder: 200,
    image: 'https://cdn-icons-png.flaticon.com/512/3039/3039474.png',
  },
  {
    id: '2',
    itemCode: 'I-1002',
    name: 'Gloves',
    category: 'PPE',
    availability: 'Low',
    stock: 50,
    reorder: 150,
  },
  {
    id: '3',
    itemCode: 'I-1003',
    name: 'Hand Sanitizer',
    category: 'Sanitizer',
    availability: 'Available',
    stock: 200,
    reorder: 100,
  },
  {
    id: '4',
    itemCode: 'I-1004',
    name: 'Thermometers',
    category: 'Medical Equipment',
    availability: 'Out of Stock',
    stock: 0,
    reorder: 300,
  },
  {
    id: '5',
    itemCode: 'I-1005',
    name: 'Stethoscopes',
    category: 'Medical Equipment',
    availability: 'Available',
    stock: 30,
    reorder: 50,
  },
  {
    id: '6',
    itemCode: 'I-1006',
    name: 'Blood Pressure Monitors',
    category: 'Medical Equipment',
    availability: 'Low',
    stock: 20,
    reorder: 100,
  },
  {
    id: '7',
    itemCode: 'I-1007',
    name: 'Bandages',
    category: 'First Aid',
    availability: 'Available',
    stock: 300,
    reorder: 200,
  },
  {
    id: '8',
    itemCode: 'I-1008',
    name: 'IV Fluids',
    category: 'Medical Supplies',
    availability: 'Low',
    stock: 10,
    reorder: 150,
  },
  {
    id: '9',
    itemCode: 'I-1009',
    name: 'Scalpel Blades',
    category: 'Surgical Instruments',
    availability: 'Out of Stock',
    stock: 0,
    reorder: 200,
  },
  {
    id: '10',
    itemCode: 'I-1010',
    name: 'Syringes',
    category: 'Medical Supplies',
    availability: 'Available',
    stock: 400,
    reorder: 300,
  },
  {
    id: '11',
    itemCode: 'I-1011',
    name: 'Medical Gowns',
    category: 'PPE',
    availability: 'Available',
    stock: 150,
    reorder: 100,
  },
  {
    id: '12',
    itemCode: 'I-1012',
    name: 'Disinfectant Wipes',
    category: 'Sanitizer',
    availability: 'Low',
    stock: 25,
    reorder: 200,
  },
];
