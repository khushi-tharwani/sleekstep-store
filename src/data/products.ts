
import { Product } from "../types";

export const products: Product[] = [
  {
    id: "1",
    name: "Air Max Supreme",
    brand: "Nike",
    category: "Running",
    price: 199.99,
    description: "Innovative cushioning provides excellent comfort and support for everyday runners. The breathable mesh upper keeps your feet cool while the durable rubber outsole delivers reliable traction on various surfaces.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5"
    ],
    sizes: [
      { id: "s1", value: "US 7", available: true },
      { id: "s2", value: "US 8", available: true },
      { id: "s3", value: "US 9", available: true },
      { id: "s4", value: "US 10", available: true },
      { id: "s5", value: "US 11", available: false }
    ],
    colors: [
      { id: "c1", name: "Black", value: "#000000", available: true },
      { id: "c2", name: "White", value: "#FFFFFF", available: true },
      { id: "c3", name: "Red", value: "#FF0000", available: true }
    ],
    stock: 15,
    rating: 4.8,
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "Michael Johnson",
        rating: 5,
        comment: "Extremely comfortable for long runs. Great purchase!",
        createdAt: "2023-05-15T10:30:00Z"
      },
      {
        id: "r2",
        userId: "u2",
        userName: "Sarah Williams",
        rating: 4,
        comment: "Good shoes but runs a bit small. Order half size up.",
        createdAt: "2023-06-20T14:15:00Z"
      }
    ],
    isFeatured: true,
    isTrending: true,
    createdAt: "2023-01-10T08:00:00Z"
  },
  {
    id: "2",
    name: "Ultra Boost Elite",
    brand: "Adidas",
    category: "Running",
    price: 179.99,
    description: "Responsive boost cushioning and a supportive fit make these shoes perfect for daily training and long-distance running. The Primeknit upper adapts to the shape of your foot for comfortable support.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329"
    ],
    sizes: [
      { id: "s1", value: "US 7", available: true },
      { id: "s2", value: "US 8", available: true },
      { id: "s3", value: "US 9", available: true },
      { id: "s4", value: "US 10", available: false },
      { id: "s5", value: "US 11", available: true }
    ],
    colors: [
      { id: "c1", name: "Blue", value: "#0000FF", available: true },
      { id: "c2", name: "Grey", value: "#808080", available: true }
    ],
    stock: 8,
    rating: 4.7,
    reviews: [
      {
        id: "r1",
        userId: "u3",
        userName: "David Brown",
        rating: 5,
        comment: "These shoes feel like walking on clouds. Perfect cushioning!",
        createdAt: "2023-04-18T09:45:00Z"
      }
    ],
    isFeatured: true,
    isTrending: true,
    createdAt: "2023-02-05T10:15:00Z"
  },
  {
    id: "3",
    name: "Classic Leather",
    brand: "Puma",
    category: "Casual",
    price: 89.99,
    description: "Timeless design meets modern comfort. These classic leather shoes are perfect for everyday wear with premium materials and cushioned insoles for all-day comfort.",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f",
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1"
    ],
    sizes: [
      { id: "s1", value: "US 7", available: false },
      { id: "s2", value: "US 8", available: true },
      { id: "s3", value: "US 9", available: true },
      { id: "s4", value: "US 10", available: true },
      { id: "s5", value: "US 11", available: true }
    ],
    colors: [
      { id: "c1", name: "Brown", value: "#8B4513", available: true },
      { id: "c2", name: "Black", value: "#000000", available: true }
    ],
    stock: 20,
    rating: 4.5,
    reviews: [
      {
        id: "r1",
        userId: "u4",
        userName: "Emily Davis",
        rating: 5,
        comment: "Classic design and very comfortable. Goes with everything!",
        createdAt: "2023-03-22T16:20:00Z"
      },
      {
        id: "r2",
        userId: "u5",
        userName: "Robert Wilson",
        rating: 4,
        comment: "Good quality leather and comfortable fit. Highly recommended.",
        createdAt: "2023-04-10T11:30:00Z"
      }
    ],
    isFeatured: false,
    isTrending: false,
    createdAt: "2023-01-20T09:30:00Z"
  },
  {
    id: "4",
    name: "EvoKnit Runner",
    brand: "Puma",
    category: "Running",
    price: 129.99,
    salePrice: 99.99,
    description: "Lightweight and breathable design perfect for fast-paced runs. The responsive cushioning provides excellent energy return while the knit upper ensures a sock-like fit.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d"
    ],
    sizes: [
      { id: "s1", value: "US 7", available: true },
      { id: "s2", value: "US 8", available: true },
      { id: "s3", value: "US 9", available: true },
      { id: "s4", value: "US 10", available: true },
      { id: "s5", value: "US 11", available: false }
    ],
    colors: [
      { id: "c1", name: "Black", value: "#000000", available: true },
      { id: "c2", name: "Red", value: "#FF0000", available: true },
      { id: "c3", name: "Grey", value: "#808080", available: false }
    ],
    stock: 12,
    rating: 4.6,
    reviews: [
      {
        id: "r1",
        userId: "u6",
        userName: "Jennifer Martinez",
        rating: 5,
        comment: "Perfect for my morning runs. Lightweight and supportive.",
        createdAt: "2023-05-05T08:15:00Z"
      }
    ],
    isFeatured: true,
    isTrending: false,
    createdAt: "2023-02-15T11:00:00Z"
  },
  {
    id: "5",
    name: "Court Vision Low",
    brand: "Nike",
    category: "Basketball",
    price: 109.99,
    description: "Inspired by '80s basketball shoes, these sneakers feature clean lines and classic hoops style. The durable leather upper and cushioned insole provide long-lasting comfort for everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
    ],
    sizes: [
      { id: "s1", value: "US 7", available: true },
      { id: "s2", value: "US 8", available: true },
      { id: "s3", value: "US 9", available: true },
      { id: "s4", value: "US 10", available: true },
      { id: "s5", value: "US 11", available: true }
    ],
    colors: [
      { id: "c1", name: "White", value: "#FFFFFF", available: true },
      { id: "c2", name: "Black", value: "#000000", available: true }
    ],
    stock: 25,
    rating: 4.4,
    reviews: [
      {
        id: "r1",
        userId: "u7",
        userName: "James Thompson",
        rating: 4,
        comment: "Good quality, classic style. Exactly what I was looking for.",
        createdAt: "2023-04-02T13:40:00Z"
      },
      {
        id: "r2",
        userId: "u8",
        userName: "Michelle Garcia",
        rating: 5,
        comment: "These shoes look great with everything! Very versatile.",
        createdAt: "2023-05-12T15:50:00Z"
      }
    ],
    isFeatured: false,
    isTrending: true,
    createdAt: "2023-01-15T14:20:00Z"
  },
  {
    id: "6",
    name: "Cloudfoam Daily",
    brand: "Adidas",
    category: "Casual",
    price: 69.99,
    description: "Everyday comfort meets street style with these versatile sneakers. The cloudfoam midsole offers superior cushioning while the sleek design pairs easily with any outfit.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329"
    ],
    sizes: [
      { id: "s1", value: "US 7", available: true },
      { id: "s2", value: "US 8", available: true },
      { id: "s3", value: "US 9", available: true },
      { id: "s4", value: "US 10", available: true },
      { id: "s5", value: "US 11", available: true }
    ],
    colors: [
      { id: "c1", name: "White", value: "#FFFFFF", available: true },
      { id: "c2", name: "Black", value: "#000000", available: true },
      { id: "c3", name: "Navy", value: "#000080", available: true }
    ],
    stock: 30,
    rating: 4.3,
    reviews: [
      {
        id: "r1",
        userId: "u9",
        userName: "Daniel Lewis",
        rating: 4,
        comment: "Great casual shoes at a reasonable price.",
        createdAt: "2023-03-10T10:10:00Z"
      }
    ],
    isFeatured: false,
    isTrending: true,
    createdAt: "2023-02-25T12:45:00Z"
  }
];
