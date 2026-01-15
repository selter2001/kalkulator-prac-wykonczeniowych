import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, ArrowLeft, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { AnimatedBackground } from '@/components/calculator/AnimatedBackground';

const passwordSchema = z.string().min(6, 'Hasło musi mieć minimum 6 znaków');

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // The user should have been redirected here with a valid recovery token
      // which creates a session automatically
      if (session) {
        setIsValidSession(true);
      } else {
        // Listen for auth state changes (recovery link might still be processing)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
            setIsValidSession(true);
          }
        });

        // Set a timeout to show error if no session appears
        const timeout = setTimeout(() => {
          if (isValidSession === null) {
            setIsValidSession(false);
          }
        }, 3000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }
    };

    checkSession();
  }, [isValidSession]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    setIsLoading(false);
    
    if (error) {
      console.error('Password update error:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zmienić hasła. Spróbuj ponownie.',
        variant: 'destructive'
      });
    } else {
      setIsSuccess(true);
      toast({
        title: 'Hasło zmienione',
        description: 'Twoje hasło zostało pomyślnie zaktualizowane.'
      });
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Weryfikacja...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired session
  if (isValidSession === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AnimatedBackground />
        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl text-destructive">Link wygasł</CardTitle>
              <CardDescription>
                Link do resetowania hasła jest nieprawidłowy lub wygasł.
                Poproś o nowy link resetujący.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/auth')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Wróć do logowania
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AnimatedBackground />
        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-green-500" />
              </motion.div>
              <CardTitle className="text-xl">Hasło zmienione!</CardTitle>
              <CardDescription>
                Twoje hasło zostało pomyślnie zaktualizowane.
                Za chwilę zostaniesz przekierowany...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Bezpieczne hasło
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Ustaw nowe
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              hasło
            </span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl">Nowe hasło</CardTitle>
              <CardDescription>
                Wprowadź i potwierdź swoje nowe hasło
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nowe hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                      className={`pl-10 h-11 rounded-xl bg-muted/30 border-border/50 ${errors.password ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: undefined })); }}
                      className={`pl-10 h-11 rounded-xl bg-muted/30 border-border/50 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" className="w-full h-11 mt-2 bg-gradient-to-r from-primary to-primary/90" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Zapisywanie...
                      </>
                    ) : (
                      'Ustaw nowe hasło'
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
