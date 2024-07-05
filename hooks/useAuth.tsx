"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';

const providerGithub = new GithubAuthProvider();
const providerGoogle = new GoogleAuthProvider();

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isFetch, setIsFetch] = useState(true);
  const router = useRouter();

 
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, providerGoogle);
      setUser(result.user);
      router.push("/dashboard");
    } catch (error) {
      console.log("erreur loginWithGoogle", error);
    }
  };

  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, providerGithub);
      setUser(result.user);
      router.push("/dashboard");
    } catch (error) {
      console.log("erreur loginWithGithub", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsFetch(false);
    });
    return () => unsubscribe();
  }, []);

  // Fonction pour rediriger si l'utilisateur est authentifié
  const redirectIfAuthenticated = () => {
    if (user) {
      router.push('/dashboard'); // Redirige vers le tableau de bord si l'utilisateur est authentifié
    }
  };

  // Retourne l'état de l'utilisateur, le statut de chargement et les fonctions d'authentification
  return { user, isFetch, redirectIfAuthenticated, loginWithGoogle, loginWithGithub };
};

// Exporte le hook d'authentification personnalisé
export default useAuth;

