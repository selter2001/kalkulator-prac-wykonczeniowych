import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Calculator, User, UserPlus, ArrowRight, Mail, Lock, ArrowLeft, Building2, UserCircle } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Nieprawidłowy adres email');
const passwordSchema = z.string().min(6, 'Hasło musi mieć minimum 6 znaków');
const fullNameSchema = z.string().min(2, 'Imię i nazwisko musi mieć minimum 2 znaki');

type AuthView = 'selection' | 'login' | 'register' | 'forgot-password';

const Auth = () => {
  const [view, setView] = useState<AuthView>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; fullName?: string }>({});
  
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

  if (view === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Kalkulator Wykończenia</CardTitle>
            <CardDescription>
              Oblicz koszty wykończenia swojego mieszkania
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Primary action - Login */}
            <Button 
              className="w-full h-14 text-lg gap-3 shadow-md hover:shadow-lg transition-shadow" 
              onClick={() => { resetForm(); setView('login'); }}
            >
              <User className="w-5 h-5" />
              Zaloguj się
            </Button>
            
            {/* Secondary action - Register */}
            <Button 
              variant="secondary" 
              className="w-full h-12 text-base gap-3 border border-border/50 hover:bg-secondary/80"
              onClick={() => { resetForm(); setView('register'); }}
            >
              <UserPlus className="w-5 h-5" />
              Utwórz nowe konto
            </Button>
            
            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground/70">lub kontynuuj bez konta</span>
              </div>
            </div>
            
            {/* Tertiary action - Guest mode */}
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={handleGuestMode}
            >
              <ArrowRight className="w-4 h-4" />
              <span>Pomiń i przejdź do kalkulatora</span>
            </button>
            
            <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
              W trybie gościa możesz korzystać z kalkulatora, ale wyceny nie zostaną zapisane na Twoim koncie.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 gap-2"
            onClick={() => setView('selection')}
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć
          </Button>
          
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">
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
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
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
                    className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
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
                      className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-3">
                    Poniższe dane będą automatycznie wyświetlane na wycenach PDF jako autor wyceny.
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
                        className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
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
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Jeśli podasz nazwę firmy, będzie ona wyświetlana na wycenach. W przeciwnym razie użyte zostanie imię i nazwisko.
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? 'Proszę czekać...' : (
                view === 'login' ? 'Zaloguj się' :
                view === 'register' ? 'Utwórz konto' :
                'Wyślij link resetujący'
              )}
            </Button>
            
            {view === 'login' && (
              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm"
                  onClick={() => { resetForm(); setView('forgot-password'); }}
                >
                  Zapomniałeś hasła?
                </Button>
                <p className="text-sm text-muted-foreground">
                  Nie masz konta?{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => { resetForm(); setView('register'); }}
                  >
                    Zarejestruj się
                  </Button>
                </p>
              </div>
            )}
            
            {view === 'register' && (
              <p className="text-sm text-center text-muted-foreground">
                Masz już konto?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => { resetForm(); setView('login'); }}
                >
                  Zaloguj się
                </Button>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
