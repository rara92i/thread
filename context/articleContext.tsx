"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { DataType, DbContextType } from '@/types/types';
import useAuth from '@/hooks/useAuth';

// Création d'un contexte pour les articles, initialisé à null
const ArticlesContext = createContext<DbContextType | null>(null);

// Hook personnalisé pour utiliser le contexte ArticlesContext
export const useFirebase = () => {
  const context = useContext(ArticlesContext);
  // Si le contexte est nul, lancer une erreur
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Composant fournisseur de contexte pour les articles
export const ArticlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Déclaration de l'état local pour stocker les articles
  const [articles, setArticles] = useState<DataType[]>([]);
  // Utilisation du hook useAuth pour obtenir les informations de l'utilisateur
  const { user } = useAuth();
  // Obtention de l'ID de l'auteur à partir des informations de l'utilisateur
  const authorId = user?.uid as string;

  // Effet qui se déclenche lorsque l'ID de l'auteur change
  useEffect(() => {
    if (!authorId) return;

    // Création d'une requête pour obtenir les articles de l'auteur connecté
    const q = query(collection(db, 'articles'), where('authorId', '==', authorId));

    // Abonnement aux changements de la collection d'articles
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: DataType[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as DataType);
      });
      // Mise à jour de l'état local avec les nouveaux articles
      setArticles(data);
    });

    // Nettoyage de l'abonnement lors du démontage du composant
    return () => unsubscribe();
  }, [authorId]);

  // Fonction pour ajouter un article à la base de données
  const addArticle = async (data: Omit<DataType, 'id'> & { image: string }) => {
    try {
      // Ajout d'un document à la collection d'articles
      const docRef = await addDoc(collection(db, 'articles'), { ...data, authorId });
      const newArticle: DataType = { id: docRef.id, ...data, authorId};
      // Mise à jour de l'état local avec le nouvel article
      setArticles([...articles, newArticle]);
    } catch (error) {
      console.error('Erreur lors de la création de membre:', error);
      throw new Error('Erreur lors de la création de membre');
    }
  };

  // Fonction pour mettre à jour un article dans la base de données
  const updateArticle = async (article: DataType) => {
    try {
      // Référence à l'article dans la collection d'articles
      const articleRef = doc(db, 'articles', article.id);
      // Mise à jour du document avec les nouvelles données
      await updateDoc(articleRef, article);
      // Mise à jour de l'état local avec l'article modifié
      setArticles(articles.map((a) => (a.id === article.id ? { ...a, ...article } : a)));
    } catch (error) {
      console.error('Erreur lors de la modification de l\'article:', error);
      throw new Error('Erreur lors de la modification de l\'article');
    }
  };

  // Fonction pour supprimer un article de la base de données
  const deleteArticle = async (id: string) => {
    try {
      // Suppression du document de la collection d'articles
      await deleteDoc(doc(db, 'articles', id));
      // Mise à jour de l'état local en filtrant l'article supprimé
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
      throw new Error('Erreur lors de la suppression');
    }
  };

  // Valeur du contexte contenant les articles et les fonctions CRUD
  const value = {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
  };

  // Retour du fournisseur de contexte enveloppant les enfants
  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>;
};