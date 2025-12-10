import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />
        
        {/* Scan Lines */}
        <div className="absolute inset-0 scanlines opacity-50" />
      </div>

      <Navbar />
      
      <main className="relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
