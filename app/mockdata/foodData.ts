import type { FoodCardProps } from "@/app/custom-components/cards/FoodCard";

export const mockFoodItems: FoodCardProps[] = [
  {
    id: "food-1",
    name: "Truffle Parmesan Fries",
    imageUrl: "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg",
    price: 180,
    serving: 2,
    description:
      "Crispy hand-cut golden potatoes tossed in fragrant white truffle oil, grated aged parmesan, roasted garlic flakes, and fresh parsley with a side of house-made garlic aioli dip.",
    addButton: true,
  },
  {
    id: "food-2",
    name: "Classic Smash Burger",
    imageUrl: "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg",
    price: 260,
    serving: 1,
    description:
      "Double juicy smashed beef patties with melted cheddar cheese, caramelized onions, house pickles, and our signature secret smoky sauce on a toasted brioche bun.",
    addButton: true,
  },
  {
    id: "food-3",
    name: "Iced Caramel Macchiato",
    imageUrl: "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg",
    price: 160,
    serving: 1,
    description: "Espresso with vanilla syrup, cold milk, and caramel drizzle.",
    addButton: true,
  },
  {
    id: "food-4",
    name: "Spicy Peri-Peri Wings",
    imageUrl: null,
    price: 240,
    serving: "3-4 pieces",
    description:
      "Crispy double-fried chicken wings glazed in a fiery African bird's eye chili marinade, finished with lime zest and served with chilled ranch.",
    addButton: true,
  },
  {
    id: "food-5",
    name: "Artisan Margherita Flatbread",
    imageUrl: "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg",
    price: 320,
    serving: 2,
    description: null,
    addButton: false,
  },
  {
    id: "food-6",
    name: "Dark Chocolate Brownie Sundae",
    imageUrl: "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg",
    price: 210,
    serving: 1,
    description:
      "Warm Belgian dark chocolate fudge brownie served with a generous scoop of Madagascar vanilla bean gelato, drizzled with hot melted fudge and roasted hazelnuts.",
    addButton: true,
  },
];

export const singleMockFood: FoodCardProps = mockFoodItems[0];

export default mockFoodItems;
