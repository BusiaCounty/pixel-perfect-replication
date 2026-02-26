import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/** Minimum password strength: at least 8 chars, 1 uppercase, 1 number */
function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-400" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-400" };
  return { score, label: "Strong", color: "bg-green-500" };
}

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  /**
   * When Supabase redirects back here, it puts the session tokens in the
   * URL hash. The supabase-js library automatically exchanges them on
   * auth state change — we just need to wait for that event.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is now set — user can update their password
        setTokenError(null);
      } else if (event === "SIGNED_OUT") {
        setTokenError(
          "Your reset link has expired or is invalid. Please request a new one.",
        );
      }
    });

    // If there's no hash at all when landing here, the user navigated directly
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) {
      // Give the auth state change listener a moment to fire first
      const timer = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
            setTokenError(
              "No valid reset token found. Please request a new password reset link.",
            );
          }
        });
      }, 800);
      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      // Sign out so they log in fresh with the new password
      await supabase.auth.signOut();
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reset password.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength(password);
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
          Create a new password
        </h1>
        <p className="text-lg text-primary-foreground/70 max-w-md">
          Choose a strong, unique password that you don't use on other sites.
          Your account security matters.
        </p>

        {/* Tips */}
        <div className="mt-12 rounded-xl border border-white/20 bg-white/10 p-5 space-y-3">
          <p className="text-sm font-semibold text-primary-foreground">
            Password tips:
          </p>
          {[
            "At least 8 characters long",
            "Mix uppercase and lowercase letters",
            "Include numbers or symbols",
            "Avoid personal info like birthdays",
          ].map((tip) => (
            <div
              key={tip}
              className="flex items-center gap-2 text-sm text-primary-foreground/80"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              {tip}
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

          {/* Token error state */}
          {tokenError && (
            <div className="text-center space-y-5 animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Link expired
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tokenError}
                </p>
              </div>
              <Link to="/forgot-password">
                <Button className="w-full">Request a new reset link</Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  ← Back to sign in
                </Link>
              </p>
            </div>
          )}

          {/* Success state */}
          {done && !tokenError && (
            <div className="text-center space-y-5 animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Password updated!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your password has been reset successfully. Redirecting you to
                  the login page in 3 seconds…
                </p>
              </div>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Go to Sign In now
                </Button>
              </Link>
            </div>
          )}

          {/* Form state */}
          {!done && !tokenError && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <KeyRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display text-foreground leading-none">
                      New password
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Secure your account
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter and confirm your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="space-y-2">
                  <Label htmlFor="reset-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              s <= strength.score ? strength.color : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          strength.score <= 1
                            ? "text-red-500"
                            : strength.score <= 2
                              ? "text-orange-500"
                              : strength.score <= 3
                                ? "text-yellow-600"
                                : "text-green-600"
                        }`}
                      >
                        {strength.label} password
                        {strength.score <= 2 &&
                          " — try adding numbers or symbols"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="reset-confirm">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="reset-confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={
                        mismatch
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirm ? "Hide confirmation" : "Show confirmation"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {mismatch && (
                    <p className="text-xs text-destructive">
                      Passwords don't match
                    </p>
                  )}
                </div>

                <Button
                  id="reset-submit-btn"
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading || mismatch || password.length < 8}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating password…
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                <Link
                  to="/forgot-password"
                  className="hover:text-primary transition-colors"
                >
                  Request a new reset link
                </Link>
                {" · "}
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
