'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import do Router (App Router)
import { LogOut, LayoutGrid, List, Trophy, BookOpen, Menu, X, LogIn } from 'lucide-react';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import { HorizontalLogo } from './Logo';

export default function Navbar() {
  const router = useRouter(); // Hook de navegação
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitora se o usuário está logado (persiste entre páginas)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- NOVA FUNÇÃO: Redirecionar para /login ---
  const handleLoginRedirect = () => {
    setIsMenuOpen(false); // Fecha o menu mobile se estiver aberto
    router.push('/login'); // Redireciona para a página de login
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); // Opcional: manda para a home após sair
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="relative sticky top-0 z-50 w-full h-20 bg-[#0F1A18]/90 backdrop-blur-md border-b border-[#2A453F] px-6 lg:px-12 flex items-center justify-between">
      
      {/* LOGO */}
      <HorizontalLogo className="cursor-pointer" onClick={() => router.push('/')} />

      {/* MENU CENTRAL */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-1">
        <NavItem icon={<LayoutGrid size={18}/>} label="Dashboard" />
        <NavItem icon={<List size={18}/>} label="Problemas" active />
        <NavItem icon={<Trophy size={18}/>} label="Ranking" />
        <NavItem icon={<BookOpen size={18}/>} label="Aulas" />
      </div>

      {/* LADO DIREITO */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          {!loading && (
            user ? (
              // LOGADO
              <>
                <div className="flex flex-col text-right mr-2">
                  <span className="text-sm font-bold text-[#EAEAEA]">{user.displayName || "Dev"}</span>
                  <span className="text-xs text-[#8CA69E] font-mono">Lvl 5 • 1.200 XP</span>
                </div>
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Perfil" className="h-10 w-10 rounded-full border border-[#2A453F]"/>
                ) : (
                    <div className="h-10 w-10 rounded-full bg-[#182B27] border border-[#2A453F] flex items-center justify-center text-[#6BBF99]">{user.displayName?.charAt(0)}</div>
                )}
                <button onClick={handleLogout} className="p-2 text-[#8CA69E] hover:text-[#CF5C5C]"><LogOut size={20} /></button>
              </>
            ) : (
              // NÃO LOGADO -> REDIRECIONA
              <button 
                  onClick={handleLoginRedirect}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#3A7D63] hover:bg-[#2F6650] text-white font-bold rounded-lg transition-all shadow-lg"
              >
                  <LogIn size={18} />
                  <span>Entrar</span>
              </button>
            )
          )}
        </div>

        <button onClick={toggleMenu} className="md:hidden p-2 text-[#EAEAEA] hover:bg-[#182B27] rounded-lg">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0F1A18] border-b border-[#2A453F] p-6 flex flex-col gap-6 md:hidden shadow-2xl">
            {/* ... Links ... */}
            <div className="flex flex-col gap-2">
                <NavItem icon={<LayoutGrid size={18}/>} label="Dashboard" />
                <NavItem icon={<List size={18}/>} label="Problemas" active />
                <NavItem icon={<Trophy size={18}/>} label="Ranking" />
                <NavItem icon={<BookOpen size={18}/>} label="Aulas" />
            </div>
            <hr className="border-[#2A453F]" />
            {!loading && (
                user ? (
                    <div className="flex items-center justify-between">
                         {/* ... Info User Mobile ... */}
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#EAEAEA]">{user.displayName}</span>
                         </div>
                        <button onClick={handleLogout} className="p-2 text-[#8CA69E] hover:text-[#CF5C5C]"><LogOut size={18} /></button>
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

// NavItem auxiliar...
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
      <button className={`flex items-center gap-2 px-4 py-3 md:py-2 rounded-lg text-sm font-medium transition-all w-full md:w-auto ${active ? 'bg-[#3A7D63]/20 text-[#6BBF99] border border-[#3A7D63]/30' : 'text-[#8CA69E] hover:text-[#EAEAEA] hover:bg-[#182B27]'}`}>
        {icon}
        <span>{label}</span>
      </button>
    );
  }