import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthGuard } from "@/components/auth/AuthGuard";

// Pages
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import Modules from "./pages/Modules";
import Neo from "./pages/Neo";
import Vision from "./pages/Vision";
import Support from "./pages/Support";
import Sponsors from "./pages/Sponsors";
import VyralView from "./pages/VyralView";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/neo" element={<Neo />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/support" element={<Support />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/vyral-view" element={<VyralView />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Shop Routes */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Auth Routes */}
              <Route
                path="/auth/login"
                element={
                  <AuthGuard requireAuth={false}>
                    <Login />
                  </AuthGuard>
                }
              />
              <Route
                path="/auth/signup"
                element={
                  <AuthGuard requireAuth={false}>
                    <Signup />
                  </AuthGuard>
                }
              />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <AuthGuard>
                    <Checkout />
                  </AuthGuard>
                }
              />
              <Route
                path="/account"
                element={
                  <AuthGuard>
                    <Account />
                  </AuthGuard>
                }
              />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
