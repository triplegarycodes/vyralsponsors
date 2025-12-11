import { motion } from "framer-motion";
import { Sponsor3DCard } from "./Sponsor3DCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

interface TierProps {
  name: string;
  tagline: string;
  price: string;
  priceNote?: string;
  icon: ReactNode;
  perks: string[];
  glowColor: string;
  featured?: boolean;
  delay?: number;
}

export function SponsorshipTierCard({
  name,
  tagline,
  price,
  priceNote,
  icon,
  perks,
  glowColor,
  featured = false,
  delay = 0,
}: TierProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="h-full"
    >
      <Sponsor3DCard glowColor={glowColor} className="h-full">
        <div className="relative p-6 md:p-8 h-full flex flex-col" style={{ transform: "translateZ(30px)" }}>
          {/* Featured badge */}
          {featured && (
            <div className="absolute -top-px left-1/2 -translate-x-1/2">
              <div className="px-4 py-1 bg-primary text-primary-foreground text-xs font-display font-bold uppercase tracking-wider rounded-b-lg">
                Most Popular
              </div>
            </div>
          )}

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 180 }}
            transition={{ duration: 0.4 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"
          >
            {icon}
          </motion.div>

          {/* Name & Tagline */}
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">{tagline}</p>

          {/* Price */}
          <div className="mb-6">
            <div className="font-display text-4xl font-black gradient-text">
              {price}
            </div>
            {priceNote && (
              <p className="text-muted-foreground text-xs mt-1">{priceNote}</p>
            )}
          </div>

          {/* Perks */}
          <ul className="space-y-3 mb-8 flex-1">
            {perks.map((perk, index) => (
              <motion.li
                key={perk}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + index * 0.05 }}
                className="flex items-start gap-3 text-sm"
              >
                <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={16} />
                <span className="text-muted-foreground">{perk}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <NeonButton
            variant={featured ? "primary" : "outline"}
            className="w-full"
          >
            Claim {name}
          </NeonButton>
        </div>
      </Sponsor3DCard>
    </motion.div>
  );
}
