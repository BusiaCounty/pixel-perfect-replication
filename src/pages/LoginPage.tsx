import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({ title: "Account created!", description: "Redirecting to dashboard..." });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Login successful", description: "Redirecting to dashboard..." });
      }
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
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

          <h2 className="mb-2 text-2xl font-bold font-display text-foreground text-center lg:text-left">
            {isSignUp ? "Create account" : "Welcome back"}
          </h2>
          <p className="mb-8 text-sm text-muted-foreground text-center lg:text-left">
            {isSignUp ? "Sign up for a staff account" : "Sign in to your staff account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Mwangi" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@county.go.ke" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">← Back to public site</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
