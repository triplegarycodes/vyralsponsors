import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    price_cents: number;
    image_url: string | null;
    slug: string | null;
  };
  variant?: {
    id: string;
    name: string;
    size: string | null;
    color: string | null;
    color_hex: string | null;
    price_cents: number | null;
  } | null;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string, variantId?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for guest cart
const GUEST_CART_KEY = "vyral_guest_cart";

interface GuestCartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price_cents ?? item.product.price_cents;
    return sum + price * item.quantity;
  }, 0);

  // Load cart on mount and auth change
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      loadGuestCart();
    }
  }, [user]);

  const loadGuestCart = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (!stored) {
        setItems([]);
        setLoading(false);
        return;
      }

      const guestItems: GuestCartItem[] = JSON.parse(stored);
      const productIds = [...new Set(guestItems.map((i) => i.productId))];

      if (productIds.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      // Fetch product details
      const { data: products } = await supabase
        .from("products")
        .select("id, name, price_cents, image_url, slug")
        .in("id", productIds);

      const variantIds = guestItems.filter((i) => i.variantId).map((i) => i.variantId!);
      let variants: any[] = [];
      if (variantIds.length > 0) {
        const { data } = await supabase
          .from("product_variants")
          .select("id, name, size, color, color_hex, price_cents")
          .in("id", variantIds);
        variants = data || [];
      }

      const cartItems: CartItem[] = guestItems.map((item, index) => ({
        id: `guest-${index}`,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        product: products?.find((p) => p.id === item.productId) || {
          id: item.productId,
          name: "Unknown Product",
          price_cents: 0,
          image_url: null,
          slug: null,
        },
        variant: item.variantId
          ? variants.find((v) => v.id === item.variantId)
          : null,
      }));

      setItems(cartItems);
    } catch (error) {
      console.error("Error loading guest cart:", error);
    }
    setLoading(false);
  };

  const loadUserCart = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get or create cart
      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!cart) {
        const { data: newCart, error } = await supabase
          .from("carts")
          .insert({ user_id: user.id })
          .select("id")
          .single();

        if (error) throw error;
        cart = newCart;
      }

      setCartId(cart.id);

      // Migrate guest cart if exists
      const guestCartStr = localStorage.getItem(GUEST_CART_KEY);
      if (guestCartStr) {
        const guestItems: GuestCartItem[] = JSON.parse(guestCartStr);
        for (const item of guestItems) {
          await supabase.from("cart_items").upsert(
            {
              cart_id: cart.id,
              product_id: item.productId,
              variant_id: item.variantId,
              quantity: item.quantity,
            },
            { onConflict: "cart_id,product_id,variant_id" }
          );
        }
        localStorage.removeItem(GUEST_CART_KEY);
      }

      // Load cart items
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          variant_id,
          quantity,
          products:product_id (id, name, price_cents, image_url, slug),
          product_variants:variant_id (id, name, size, color, color_hex, price_cents)
        `)
        .eq("cart_id", cart.id);

      const mappedItems: CartItem[] = (cartItems || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id,
        quantity: item.quantity,
        product: item.products,
        variant: item.product_variants,
      }));

      setItems(mappedItems);
    } catch (error) {
      console.error("Error loading user cart:", error);
    }
    setLoading(false);
  };

  const addToCart = async (productId: string, variantId?: string, quantity = 1) => {
    if (user && cartId) {
      // Add to database
      const existingItem = items.find(
        (i) => i.productId === productId && i.variantId === (variantId || null)
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: productId,
          variant_id: variantId || null,
          quantity,
        });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to add item to cart",
            variant: "destructive",
          });
          return;
        }

        await loadUserCart();
      }
    } else {
      // Add to guest cart
      const stored = localStorage.getItem(GUEST_CART_KEY);
      const guestItems: GuestCartItem[] = stored ? JSON.parse(stored) : [];

      const existingIndex = guestItems.findIndex(
        (i) => i.productId === productId && i.variantId === (variantId || null)
      );

      if (existingIndex >= 0) {
        guestItems[existingIndex].quantity += quantity;
      } else {
        guestItems.push({
          productId,
          variantId: variantId || null,
          quantity,
        });
      }

      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
      await loadGuestCart();
    }

    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  const removeFromCart = async (itemId: string) => {
    if (user && cartId) {
      await supabase.from("cart_items").delete().eq("id", itemId);
      await loadUserCart();
    } else {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (!stored) return;

      const guestItems: GuestCartItem[] = JSON.parse(stored);
      const index = parseInt(itemId.replace("guest-", ""));
      guestItems.splice(index, 1);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
      await loadGuestCart();
    }

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    if (user && cartId) {
      await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);
      await loadUserCart();
    } else {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (!stored) return;

      const guestItems: GuestCartItem[] = JSON.parse(stored);
      const index = parseInt(itemId.replace("guest-", ""));
      guestItems[index].quantity = quantity;
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
      await loadGuestCart();
    }
  };

  const clearCart = async () => {
    if (user && cartId) {
      await supabase.from("cart_items").delete().eq("cart_id", cartId);
      setItems([]);
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
      setItems([]);
    }
  };

  const isInCart = (productId: string, variantId?: string) => {
    return items.some(
      (i) => i.productId === productId && i.variantId === (variantId || null)
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
