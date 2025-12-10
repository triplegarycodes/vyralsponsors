import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShoppingBag } from "lucide-react";

const products = [
  {
    name: "Loading Future → ERROR. Future = Now",
    type: "Premium Hoodie",
    description: "Statement piece for the forward-thinking teen. Ultra-soft fabric, oversized fit.",
    placeholder: true,
  },
  {
    name: "Neo Band",
    type: "Smart Wearable",
    description: "Track habits, receive gentle nudges, and stay connected to your goals.",
    placeholder: true,
  },
  {
    name: "Vybes UI Skins",
    type: "Digital Cosmetics",
    description: "Customize your VYRAL experience with exclusive interface themes.",
    placeholder: true,
  },
  {
    name: "Vyra Cards",
    type: "Digital Collectibles",
    description: "Earn and trade unique cards as you level up your journey.",
    placeholder: true,
  },
];

export function MerchSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <SectionHeading
          badge="Coming Soon"
          title={
            <>
              <span className="gradient-text">VYRAL</span> Merch & Gear
            </>
          }
          description="Express your journey with exclusive drops. Each piece is designed to make a statement."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl glass-card"
              >
                {/* Placeholder Image Area */}
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 0.8, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
                  />
                  <ShoppingBag size={48} className="text-muted-foreground/30 relative z-10" />
                  
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 text-xs font-display font-semibold bg-primary/80 text-primary-foreground rounded-full">
                    Coming Soon
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                    {product.type}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-sm mt-12"
        >
          Product renders coming soon. Join the waitlist to get first access.
        </motion.p>
      </div>
    </section>
  );
}
