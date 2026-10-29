import { foodItems } from "@/src/db/schema";

//(property) category: "food" | "beverage" | "snacks" | "dessert"

export const mockFoodItems: Array<typeof foodItems.$inferSelect> = [
  {
    id: "123",
    name: "Paneer Chlly",
    category: "snacks",
    description: "Paneer cubes fried and then tossed into sauces",
    imageUrl: "https://images.pexels.com/photos/7160695/pexels-photo-7160695.jpeg",
    isAvailable: true,
    price: "123",
    serves: 1,
    createdAt: new Date()
  },
  {
    id: "456",
    name: "Momos",
    category: "snacks",
    description: "Steamed dumplings filled with seasoned vegetables and served with spicy chutney",
    imageUrl: "https://images.pexels.com/photos/18803177/pexels-photo-18803177.jpeg",
    isAvailable: true,
    price: "99",
    serves: 1,
    createdAt: new Date()
  },
  {
    id: "789",
    name: "Chicken Lolypop",
    category: "snacks",
    description: "Crispy chicken wings marinated in spices and coated with a flavorful sauce",
    imageUrl: "https://images.pexels.com/photos/31771054/pexels-photo-31771054.jpeg",
    isAvailable: true,
    price: "179",
    serves: 2,
    createdAt: new Date()
  },
  {
    id: "321",
    name: "White sauce Pasta",
    category: "food",
    description: "Creamy white sauce pasta tossed with herbs, vegetables, and Italian seasoning",
    imageUrl: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg",
    isAvailable: true,
    price: "149",
    serves: 2,
    createdAt: new Date()
  },
  {
    id: "654",
    name: "Cheese Burger",
    category: "food",
    description: "Juicy burger layered with melted cheese, fresh vegetables, and a house sauce",
    imageUrl: "https://images.pexels.com/photos/32480062/pexels-photo-32480062.jpeg",
    isAvailable: true,
    price: "129",
    serves: 1,
    createdAt: new Date()
  },
  {
    id: "987",
    name: "Fried Rice",
    category: "food",
    description: "Wok-tossed rice with fresh vegetables, soy sauce, and aromatic spices",
    imageUrl: "https://images.pexels.com/photos/35071826/pexels-photo-35071826.jpeg",
    isAvailable: true,
    price: "119",
    serves: 4,
    createdAt: new Date()
  },
  {
    id: "213",
    name: "Pizza",
    category: "food",
    description: "Classic pizza topped with mozzarella cheese, tomato sauce, and fresh herbs",
    imageUrl: "https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg",
    isAvailable: true,
    price: "199",
    serves: 2,
    createdAt: new Date()
  },
  {
    id: "546",
    name: "Corn Cheese Sandwich",
    category: "snacks",
    description: "Grilled sandwich stuffed with sweet corn, melted cheese, and mild spices",
    imageUrl: "https://images.pexels.com/photos/36268517/pexels-photo-36268517.jpeg",
    isAvailable: false,
    price: "109",
    serves: 1,
    createdAt: new Date()
  },
  {
    id: "879",
    name: "DimSums",
    category: "snacks",
    description: "Delicate dumplings filled with seasoned ingredients and served with dipping sauce",
    imageUrl: null,
    isAvailable: true,
    price: "129",
    serves: 1,
    createdAt: new Date()
  },
  {
    id: "852",
    name: "Chaumin",
    category: "food",
    description: null,
    imageUrl: "https://images.pexels.com/photos/3926121/pexels-photo-3926121.jpeg",
    isAvailable: true,
    price: "99",
    serves: 1,
    createdAt: new Date()
  }
];

export const singleMockFood: typeof foodItems.$inferSelect = mockFoodItems[0];

export default mockFoodItems;