'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon } from '@/components/icons/google-icon';

export default function LoginPage() {
  const { toast } = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Éxito',
        description: 'Has iniciado sesión correctamente.',
      });
      // The AuthProvider will handle redirection automatically
    } catch (error) {
      console.error('Error signing in with Google', error);
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Bienvenido a FreezerFriend
          </CardTitle>
          <CardDescription>
            Inicia sesión o crea una cuenta para comenzar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <GoogleIcon className="mr-2 h-5 w-5" />
            Continuar con Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
