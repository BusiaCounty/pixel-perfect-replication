import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="hidden hero-gradient lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-16">
        <Link to="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <Building2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <span className="text-2xl font-bold font-display text-primary-foreground">
            County PMTS
          </span>
        </Link>
        <h1 className="mb-4 text-4xl font-bold font-display text-primary-foreground">
          Reset your password
        </h1>
        <p className="text-lg text-primary-foreground/70 max-w-md">
          No worries — it happens to the best of us. Enter your email and we'll
          send you a secure link to create a new password.
        </p>

        {/* Decorative steps */}
        <div className="mt-12 space-y-5">
          {[
            { step: "1", label: "Enter your email address" },
            { step: "2", label: "Check your inbox for the reset link" },
            { step: "3", label: "Create a strong new password" },
          ].map(({ step, label }) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/30 text-sm font-bold text-white">
                {step}
              </div>
              <p className="text-primary-foreground/80 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden flex items-center gap-2 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-foreground">
              County PMTS
            </span>
          </div>

          {sent ? (
            /* ── Success state ── */
            <div className="text-center space-y-5 animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Check your inbox
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  It may take a few minutes to arrive.
                </p>
              </div>
              <div className="rounded-xl border bg-muted/40 p-4 text-left text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">
                  Didn't receive it?
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you used the right email address</li>
                  <li>
                    <button
                      onClick={() => {
                        setSent(false);
                        setEmail("");
                      }}
                      className="text-primary hover:underline"
                    >
                      Try again with a different address
                    </button>
                  </li>
                </ul>
              </div>
              <Link to="/login">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-display text-foreground text-center lg:text-left">
                  Forgot password?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground text-center lg:text-left">
                  Enter your staff email and we'll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="name@county.go.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  id="forgot-submit-btn"
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending link…
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remembered it?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Back to sign in
                </Link>
              </p>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                <Link to="/" className="hover:text-primary transition-colors">
                  ← Back to public site
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
