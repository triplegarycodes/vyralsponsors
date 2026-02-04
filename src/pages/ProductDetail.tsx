import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import {
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  category: string | null;
  slug: string | null;
  features: string[] | null;
  specs: Record<string, string> | null;
  images: string[] | null;
}

interface Variant {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  color_hex: string | null;
  stock_quantity: number;
  price_cents: number | null;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (productError || !productData) {
      setLoading(false);
      return;
    }

    setProduct({
      ...productData,
      features: productData.features as string[] | null,
      specs: productData.specs as Record<string, string> | null,
      images: productData.images as string[] | null,
    });

    // Load variants
    const { data: variantsData } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productData.id)
      .eq("is_available", true);

    if (variantsData) {
      setVariants(variantsData);
      if (variantsData.length > 0) {
        setSelectedVariant(variantsData[0]);
        setSelectedColor(variantsData[0].color);
        setSelectedSize(variantsData[0].size);
      }
    }

    setLoading(false);
  };

  // Get unique sizes and colors
  const sizes = [...new Set(variants.filter((v) => v.size).map((v) => v.size!))];
  const colors = [...new Set(variants.filter((v) => v.color).map((v) => ({
    name: v.color!,
    hex: v.color_hex,
  })))].filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i);

  // Update selected variant when size/color changes
  useEffect(() => {
    if (variants.length === 0) return;

    const matchingVariant = variants.find(
      (v) =>
        (selectedSize ? v.size === selectedSize : true) &&
        (selectedColor ? v.color === selectedColor : true)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [selectedSize, selectedColor, variants]);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (variants.length > 0 && !selectedVariant) {
      toast({
        title: "Please select options",
        description: "Choose size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    await addToCart(product.id, selectedVariant?.id, quantity);
  };

  const currentPrice = selectedVariant?.price_cents ?? product?.price_cents ?? 0;
  const inCart = isInCart(product?.id || "", selectedVariant?.id);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-10 bg-muted rounded w-1/4 animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-foreground transition-colors">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li className="capitalize">
              <Link
                to={`/shop?category=${product.category}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 glass-card">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-muted-foreground" />
                </div>
              )}

              {/* Image Navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={() =>
                      setCurrentImageIndex((i) =>
                        i === 0 ? product.images!.length - 1 : i - 1
                      )
                    }
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={() =>
                      setCurrentImageIndex((i) =>
                        i === product.images!.length - 1 ? 0 : i + 1
                      )
                    }
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      currentImageIndex === i
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge
                variant="outline"
                className="mb-3 capitalize border-primary/20 text-primary"
              >
                {product.category}
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="font-display text-3xl font-bold gradient-text">
              {formatPrice(currentPrice)}
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Color: <span className="text-muted-foreground">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color.name
                          ? "border-primary scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color.hex || "#ccc" }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className={`w-5 h-5 ${
                          color.hex === "#ffffff" ? "text-foreground" : "text-white"
                        }`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Size</label>
                  <button className="text-sm text-primary hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const hasStock = variants.some(
                      (v) =>
                        v.size === size &&
                        (!selectedColor || v.color === selectedColor) &&
                        v.stock_quantity > 0
                    );
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : hasStock
                            ? "border-border hover:border-primary/50"
                            : "border-border/50 text-muted-foreground/50 cursor-not-allowed line-through"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-3 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="rounded-l-none"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {selectedVariant && selectedVariant.stock_quantity < 10 && (
                  <span className="text-sm text-amber-500">
                    Only {selectedVariant.stock_quantity} left
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-14 text-lg font-semibold"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {inCart ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-4 border-border/50 hover:border-primary/50 hover:text-primary"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border/50">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs Accordion */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="specs" className="border-border/50">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <dl className="space-y-2">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <dt className="text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </dt>
                          <dd className="text-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care" className="border-border/50">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Care Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      {product.specs?.care || "Machine wash cold. Tumble dry low. Do not bleach."}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
