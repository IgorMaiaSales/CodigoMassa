'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import { LogOut, LayoutGrid, List, Trophy, BookOpen, Menu, X, LogIn } from 'lucide-react';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import { HorizontalLogo } from './Logo';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter(); 
  const pathname = usePathname(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitora autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Redireciona APENAS quando clica em Entrar
  const handleLoginRedirect = () => {
    setIsMenuOpen(false); 
    router.push('/login'); 
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      // Removido: router.push('/login'); 
      // O usuário permanecerá na página atual, apenas mudando o estado da UI
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Função auxiliar para navegação
  const handleNavigation = (path: string, disabled: boolean) => {
    if (disabled) return;
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative sticky top-0 z-50 w-full h-20 bg-[#0F1A18]/90 backdrop-blur-md border-b border-[#2A453F] px-6 lg:px-12 flex items-center justify-between">
      
      {/* LOGO - Agora envolta em Link para navegação segura */}
      <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity" title="Voltar ao início">
        <HorizontalLogo />
      </Link>

      {/* MENU CENTRAL (DESKTOP) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-1">
        
        {/* Itens Não Implementados (Desabilitados) */}
        <NavItem 
            icon={<LayoutGrid size={18}/>} 
            label="Dashboard" 
            disabled 
        />

        {/* Item Problemas (Ativo apenas na rota exata /problems) */}
        <NavItem 
            icon={<List size={18}/>} 
            label="Problemas" 
            active={pathname === '/problems'} 
            onClick={() => handleNavigation('/problems', false)}
        />

        <NavItem 
            icon={<Trophy size={18}/>} 
            label="Ranking" 
            disabled 
        />
        
        <NavItem 
            icon={<BookOpen size={18}/>} 
            label="Aulas" 
            disabled 
        />
      </div>

      {/* LADO DIREITO */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          {!loading && (
            user ? (
              // --- ESTADO LOGADO ---
              <>
                <div className="flex flex-col text-right mr-2">
                  <span className="text-sm font-bold text-[#EAEAEA]">{user.displayName || "Usuário"}</span>
                  <span className="text-xs text-[#8CA69E] font-mono">
                     Dev Iniciante
                  </span>
                </div>
                
                {/* Avatar do Usuário */}
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Perfil" className="h-10 w-10 rounded-full border border-[#2A453F] object-cover"/>
                ) : (
                    <div className="h-10 w-10 rounded-full bg-[#182B27] border border-[#2A453F] flex items-center justify-center text-[#6BBF99] font-bold">
                        {user.displayName?.charAt(0).toUpperCase() || "U"}
                    </div>
                )}
                
                <button 
                    onClick={handleLogout} 
                    className="p-2 text-[#8CA69E] hover:text-[#CF5C5C] transition-colors"
                    title="Sair"
                >
                    <LogOut size={20} />
                </button>
              </>
            ) : (
              // --- ESTADO DESLOGADO ---
              <button 
                  onClick={handleLoginRedirect}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#3A7D63] hover:bg-[#2F6650] text-white font-bold rounded-lg transition-all shadow-lg shadow-[#3A7D63]/20"
              >
                  <LogIn size={18} />
                  <span>Entrar</span>
              </button>
            )
          )}
        </div>

        {/* Botão Mobile */}
        <button onClick={toggleMenu} className="md:hidden p-2 text-[#EAEAEA] hover:bg-[#182B27] rounded-lg">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0F1A18] border-b border-[#2A453F] p-6 flex flex-col gap-6 md:hidden shadow-2xl animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-2">
                <NavItem icon={<LayoutGrid size={18}/>} label="Dashboard" disabled />
                
                <NavItem 
                    icon={<List size={18}/>} 
                    label="Problemas" 
                    active={pathname === '/problems'}
                    onClick={() => handleNavigation('/problems', false)}
                />
                
                <NavItem icon={<Trophy size={18}/>} label="Ranking" disabled />
                <NavItem icon={<BookOpen size={18}/>} label="Aulas" disabled />
            </div>
            
            <hr className="border-[#2A453F]" />
            
            {!loading && (
                user ? (
                    <div className="flex items-center justify-between p-2">
                         <div className="flex items-center gap-3">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Perfil" className="h-8 w-8 rounded-full border border-[#2A453F] object-cover"/>
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-[#182B27] flex items-center justify-center text-[#6BBF99] font-bold text-xs">
                                    {user.displayName?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-sm font-bold text-[#EAEAEA]">{user.displayName}</span>
                         </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-[#CF5C5C] text-sm font-medium">
                            <span>Sair</span>
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleLoginRedirect}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#3A7D63] hover:bg-[#2F6650] text-white font-bold rounded-lg"
                    >
                        <LogIn size={20} />
                        <span>Entrar</span>
                    </button>
                )
            )}
        </div>
      )}
    </nav>
  );
}

// --- Componente NavItem ---
interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

function NavItem({ icon, label, active = false, disabled = false, onClick }: NavItemProps) {
    return (
      <button 
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`
            flex items-center gap-2 px-4 py-3 md:py-2 rounded-lg text-sm font-medium transition-all w-full md:w-auto
            ${disabled ? 'opacity-50 cursor-not-allowed text-[#8CA69E]' : 'cursor-pointer'}
            ${!disabled && active ? 'bg-[#3A7D63]/20 text-[#6BBF99] border border-[#3A7D63]/30' : ''}
            ${!disabled && !active ? 'text-[#8CA69E] hover:text-[#EAEAEA] hover:bg-[#182B27]' : ''}
        `}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
}