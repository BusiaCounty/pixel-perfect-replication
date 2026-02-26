import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    toast({ title: "Login successful", description: "Redirecting to dashboard..." });
    setTimeout(() => navigate("/dashboard"), 500);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden hero-gradient lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-16">
        <Link to="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <Building2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <span className="text-2xl font-bold font-display text-primary-foreground">County PMTS</span>
        </Link>
        <h1 className="mb-4 text-4xl font-bold font-display text-primary-foreground">Staff Portal</h1>
        <p className="text-lg text-primary-foreground/70 max-w-md">
          Access your dashboard, manage projects, and track county development progress in real time.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-foreground">County PMTS</span>
          </div>

          <h2 className="mb-2 text-2xl font-bold font-display text-foreground text-center lg:text-left">Welcome back</h2>
          <p className="mb-8 text-sm text-muted-foreground text-center lg:text-left">Sign in to your staff account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@county.go.ke" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign In</Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">← Back to public site</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
