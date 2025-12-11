import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { NeonButton } from "@/components/ui/NeonButton";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center pt-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-8"
            >
              <span className="font-display text-9xl font-black gradient-text glitch">
                404
              </span>
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lost in the <span className="neon-text">Void</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              This page doesn't exist... yet. Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/">
                <NeonButton size="lg">
                  <Home size={18} />
                  Back to Home
                </NeonButton>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
