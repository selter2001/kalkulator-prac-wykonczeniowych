import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { User, UserPlus, ArrowRight, Mail, Lock, ArrowLeft, Building2, UserCircle, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { AnimatedBackground } from '@/components/calculator/AnimatedBackground';

const emailSchema = z.string().email('Nieprawidłowy adres email').max(255, 'Email nie może przekraczać 255 znaków');
const passwordSchema = z.string().min(6, 'Hasło musi mieć minimum 6 znaków');
const fullNameSchema = z.string().min(2, 'Imię i nazwisko musi mieć minimum 2 znaki').max(200, 'Imię i nazwisko nie może przekraczać 200 znaków');
const companyNameSchema = z.string().max(200, 'Nazwa firmy nie może przekraczać 200 znaków').optional();

type AuthView = 'selection' | 'login' | 'register' | 'forgot-password';

const Auth = () => {
  const [view, setView] = useState<AuthView>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; fullName?: string; companyName?: string }>({});
  
  const { signIn, signUp, continueAsGuest, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = (isRegister = false) => {
    const newErrors: typeof errors = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    if (view !== 'forgot-password') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
    }
    
    if (isRegister) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Hasła nie są identyczne';
      }
      
      try {
        fullNameSchema.parse(fullName);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.fullName = e.errors[0].message;
        }
      }
      
      if (companyName) {
        try {
          companyNameSchema.parse(companyName);
        } catch (e) {
          if (e instanceof z.ZodError) {
            newErrors.companyName = e.errors[0].message;
          }
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    
    if (error) {
      let message = 'Wystąpił błąd podczas logowania';
      if (error.message.includes('Invalid login credentials')) {
        message = 'Nieprawidłowy email lub hasło';
      } else if (error.message.includes('Email not confirmed')) {
        message = 'Email nie został potwierdzony';
      }
      toast({
        title: 'Błąd logowania',
        description: message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Zalogowano pomyślnie',
        description: 'Witaj w kalkulatorze wykończenia!'
      });
      navigate('/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    
    setIsLoading(true);
    const { error } = await signUp(email, password, fullName, companyName || undefined);
    setIsLoading(false);
    
    if (error) {
      let message = 'Wystąpił błąd podczas rejestracji';
      if (error.message.includes('User already registered')) {
        message = 'Użytkownik z tym adresem email już istnieje';
      } else if (error.message.includes('Password')) {
        message = 'Hasło jest za słabe';
      }
      toast({
        title: 'Błąd rejestracji',
        description: message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Konto utworzone!',
        description: 'Zostałeś zalogowany automatycznie.'
      });
      navigate('/');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({ email: err.errors[0].message });
        return;
      }
    }
    
    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);
    
    if (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się wysłać emaila z resetem hasła',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Email wysłany',
        description: 'Sprawdź swoją skrzynkę pocztową'
      });
      setView('login');
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
    navigate('/');
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setCompanyName('');
    setErrors({});
  };

  // Header component with title and subtitle
  const AppHeader = () => (
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
        Wszystkie ceny netto
      </motion.div>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
        <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
          Kalkulator
        </span>
        <br />
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          prac wykończeniowych
        </span>
      </h1>
      
      <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed px-4">
        Rób wyceny jak profesjonalista — bez Excela, bez tabelek. Prostota i jakość w jednej aplikacji.
      </p>
    </motion.div>
  );

  if (view === 'selection') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AnimatedBackground />
        
        <div className="relative z-10 w-full max-w-md">
          <AppHeader />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
              <CardHeader className="text-center space-y-2 pb-4">
                <CardTitle className="text-xl">Rozpocznij pracę</CardTitle>
                <CardDescription>
                  Zaloguj się lub kontynuuj jako gość
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Primary action - Login */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full h-12 text-base gap-3 shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/90" 
                    onClick={() => { resetForm(); setView('login'); }}
                  >
                    <User className="w-5 h-5" />
                    Zaloguj się
                  </Button>
                </motion.div>
                
                {/* Secondary action - Register */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="secondary" 
                    className="w-full h-11 text-base gap-3 border border-border/50 hover:bg-secondary/80"
                    onClick={() => { resetForm(); setView('register'); }}
                  >
                    <UserPlus className="w-5 h-5" />
                    Utwórz nowe konto
                  </Button>
                </motion.div>
                
                {/* Divider */}
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground/70">lub</span>
                  </div>
                </div>
                
                {/* Tertiary action - Guest mode */}
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors border border-dashed border-border/50"
                  onClick={handleGuestMode}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Kontynuuj bez logowania</span>
                </motion.button>
                
                <p className="text-xs text-center text-muted-foreground/80 leading-relaxed pt-2">
                  W trybie gościa możesz korzystać z kalkulatora,<br />ale wyceny nie zostaną zapisane.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <AppHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-3 pb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-fit -ml-2 gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => setView('selection')}
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć
              </Button>
              
              <div className="text-center space-y-1">
                <CardTitle className="text-xl">
                  {view === 'login' && 'Zaloguj się'}
                  {view === 'register' && 'Utwórz konto'}
                  {view === 'forgot-password' && 'Resetuj hasło'}
                </CardTitle>
                <CardDescription>
                  {view === 'login' && 'Wprowadź dane logowania'}
                  {view === 'register' && 'Wypełnij formularz rejestracji'}
                  {view === 'forgot-password' && 'Podaj adres email przypisany do konta'}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={
                view === 'login' ? handleLogin : 
                view === 'register' ? handleRegister : 
                handleForgotPassword
              } className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adres email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jan@przykład.pl"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                      className={`pl-10 h-11 rounded-xl bg-muted/30 border-border/50 ${errors.email ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                
                {view !== 'forgot-password' && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Hasło</Label>
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
                )}
                
                {view === 'register' && (
                  <>
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

                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-3">
                        Poniższe dane będą automatycznie wyświetlane na wycenach PDF.
                      </p>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Imię i nazwisko *</Label>
                        <div className="relative">
                          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Jan Kowalski"
                            value={fullName}
                            onChange={(e) => { setFullName(e.target.value); setErrors(prev => ({ ...prev, fullName: undefined })); }}
                            className={`pl-10 h-11 rounded-xl bg-muted/30 border-border/50 ${errors.fullName ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-2 mt-3">
                        <Label htmlFor="companyName">Nazwa firmy (opcjonalnie)</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="companyName"
                            type="text"
                            placeholder="np. Firma Budowlana XYZ"
                            value={companyName}
                            onChange={(e) => { setCompanyName(e.target.value); setErrors(prev => ({ ...prev, companyName: undefined })); }}
                            className={`pl-10 h-11 rounded-xl bg-muted/30 border-border/50 ${errors.companyName ? 'border-destructive' : ''}`}
                            maxLength={200}
                          />
                        </div>
                        {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                        <p className="text-xs text-muted-foreground">
                          Jeśli podasz nazwę firmy, będzie ona wyświetlana na wycenach.
                        </p>
                      </div>
                    </div>
                  </>
                )}
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" className="w-full h-11 mt-2 bg-gradient-to-r from-primary to-primary/90" disabled={isLoading}>
                    {isLoading ? 'Proszę czekać...' : (
                      view === 'login' ? 'Zaloguj się' :
                      view === 'register' ? 'Utwórz konto' :
                      'Wyślij link resetujący'
                    )}
                  </Button>
                </motion.div>
                
                {view === 'login' && (
                  <div className="text-center space-y-2 pt-2">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => { resetForm(); setView('forgot-password'); }}
                    >
                      Zapomniałeś hasła?
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Nie masz konta?{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={() => { resetForm(); setView('register'); }}
                      >
                        Zarejestruj się
                      </Button>
                    </p>
                  </div>
                )}
                
                {view === 'register' && (
                  <p className="text-sm text-center text-muted-foreground pt-2">
                    Masz już konto?{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-primary"
                      onClick={() => { resetForm(); setView('login'); }}
                    >
                      Zaloguj się
                    </Button>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
