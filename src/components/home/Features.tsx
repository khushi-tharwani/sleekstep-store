
import { Truck, Shield, RotateCcw, CreditCard } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over $75"
  },
  {
    id: 2,
    icon: Shield,
    title: "Secure Payment",
    description: "Safe & secure checkout"
  },
  {
    id: 3,
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy"
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Payment Methods",
    description: "Accept all major credit cards"
  }
];

const Features = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center p-6 bg-dark-100 rounded-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
