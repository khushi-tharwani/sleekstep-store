
import { Link } from "react-router-dom";

const categories = [
  {
    id: "running",
    name: "Running",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
    count: 24
  },
  {
    id: "casual",
    name: "Casual",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
    count: 18
  },
  {
    id: "basketball",
    name: "Basketball",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842",
    count: 12
  },
  {
    id: "training",
    name: "Training",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    count: 15
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-dark-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of footwear categories to find your perfect match
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-lg aspect-square hover-card"
            >
              {/* Background image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${category.image}')` }}
              ></div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 z-10">
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-gray-300">{category.count} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
