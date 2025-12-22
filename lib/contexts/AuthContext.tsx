'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    User, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut as firebaseSignOut 
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null | undefined;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Esse hook faz a mágica de "ouvir" o Firebase globalmente
    const [user, loading] = useAuthState(auth);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Erro no login Google:", error);
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);