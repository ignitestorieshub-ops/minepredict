import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LiveCounter } from "@/components/LiveCounter";
import { SocialProofTicker } from "@/components/SocialProofTicker";
import { toast } from "sonner";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@miness.app`;

    try {
      if (tab === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;
        toast.success("Account created! Logging in...");
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      <div className="scanline-overlay" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary neon-text animate-pulse-neon inline-block px-4 py-2">
            ⛏️ MINESS PREDICTOR
          </h1>
          <p className="text-muted-foreground mt-3 font-body text-lg">
            The #1 Mines Prediction Tool — Trusted by <span className="text-secondary font-semibold">50,000+</span> Players
          </p>
          <div className="mt-3 flex justify-center">
            <LiveCounter />
          </div>
        </div>

        <div className="glass-panel p-6 neon-glow">
          <div className="flex mb-6 rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-3 text-sm font-heading font-semibold transition-all ${
                tab === "login" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-3 text-sm font-heading font-semibold transition-all ${
                tab === "register" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              REGISTER
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="mt-1 bg-input border-border focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-1 bg-input border-border focus:border-primary"
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
            </div>
            <Button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-heading font-bold text-base py-6 animate-pulse-neon hover:shadow-lg transition-all"
            >
              {loading ? "Processing..." : tab === "login" ? "🔓 LOGIN" : "🚀 CREATE ACCOUNT"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              ⭐⭐⭐⭐⭐ <span className="text-secondary">4.9/5</span> from 12,847 reviews
            </p>
          </div>
        </div>
      </div>

      <SocialProofTicker />
    </div>
  );
}
