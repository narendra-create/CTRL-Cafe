import { foodItems } from "@/src/db/schema";

//(property) category: "food" | "beverage" | "snacks" | "dessert"

export const mockFoodItems: Array<typeof foodItems.$inferSelect> = [
  {
    id: "123",
    name: "Paneer Chlly",
    category: "snacks",
    description: "Paneer cubes fried and then tossed into sauces",
    imageUrl: "https://www.pexels.com/photo/a-bowl-of-cooked-food-in-a-bowl-on-a-rustic-background-7160695/",
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
    imageUrl: "https://www.pexels.com/photo/plate-with-greasy-momos-dumplings-18803177/",
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
    imageUrl: "https://www.pexels.com/photo/delicious-tandoori-chicken-with-fresh-veggies-31771054/",
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
    imageUrl: "https://www.pexels.com/photo/food-photography-of-pasta-1438672/",
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
    imageUrl: "https://www.pexels.com/photo/delicious-cheeseburger-with-pickles-on-a-plate-32480062/",
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
    imageUrl: "https://www.pexels.com/photo/vegetable-fried-rice-with-sauces-on-plate-35071826/",
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
    imageUrl: "https://www.pexels.com/photo/delicious-margherita-pizza-with-fresh-toppings-31596394/",
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
    imageUrl: "https://www.pexels.com/photo/grilled-paneer-corn-sandwich-with-sauces-36268517/",
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
    imageUrl: "https://www.pexels.com/photo/noodles-on-white-ceramic-plate-3926121/",
    isAvailable: true,
    price: "99",
    serves: 1,
    createdAt: new Date()
  }
];

export const singleMockFood: typeof foodItems.$inferSelect = mockFoodItems[0];

export default mockFoodItems;