'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { firestore } from '@/lib/firebase'; 
import { doc, collection, query, orderBy, limit, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { UserProfile, SubmissionHistory } from '@/types/user'; // <--- Reutilizando seu tipo
import { Trophy, Target, Activity, Flame, Edit2, Save, X, Building2, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<SubmissionHistory[]>([]); // <--- Usando o tipo aqui
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', organization: '', bio: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Proteção de Rota
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // Carrega Dados (Perfil + Histórico)
  useEffect(() => {
    if (user) {
      // 1. Ouvir Perfil
      const unsubProfile = onSnapshot(doc(firestore, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
          setEditForm({
            displayName: user.displayName || '',
            organization: data.organization || '',
            bio: data.bio || ''
          });
        }
      });

      // 2. Ouvir Histórico (Últimos 10 envios)
      // A coleção 'history' é onde a rota /api/submit salva o log detalhado
      const historyRef = collection(firestore, "users", user.uid, "history");
      const historyQuery = query(historyRef, orderBy("submittedAt", "desc"), limit(10));

      const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
        const historyData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as SubmissionHistory[];
        setHistory(historyData);
      });

      return () => {
          unsubProfile();
          unsubHistory();
      };
    }
  }, [user]);

  // Função de Salvar Perfil
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        if (editForm.displayName !== user.displayName) {
            await updateProfile(user, { displayName: editForm.displayName });
        }
        await setDoc(doc(firestore, "users", user.uid), {
            displayName: editForm.displayName,
            organization: editForm.organization,
            bio: editForm.bio
        }, { merge: true });
        setIsEditing(false);
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar perfil.");
    } finally {
        setIsSaving(false);
    }
  };

  // Utilitários de UI
  const getRankStyle = (score: number = 0) => {
    if (score < 100) return { border: 'border-gray-600', text: 'text-gray-400', bg: 'bg-gray-500/10' };
    if (score < 500) return { border: 'border-[#D4B04C]', text: 'text-[#D4B04C]', bg: 'bg-[#D4B04C]/10' };
    if (score < 1500) return { border: 'border-gray-300', text: 'text-gray-300', bg: 'bg-gray-300/10' };
    return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-500/10' };
  };

  const formatDate = (timestamp: Timestamp) => {
      if(!timestamp) return '-';
      // Converte o Timestamp do Firestore para data JS
      return timestamp.toDate().toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });
  };

  const getStatusConfig = (status: string) => {
      if (status === 'Accepted') return { icon: <CheckCircle size={16} />, color: 'text-[#6BBF99]', bg: 'bg-[#6BBF99]/10', border: 'border-[#6BBF99]/20' };
      if (status === 'Compilation Error') return { icon: <AlertTriangle size={16} />, color: 'text-[#D4B04C]', bg: 'bg-[#D4B04C]/10', border: 'border-[#D4B04C]/20' };
      return { icon: <XCircle size={16} />, color: 'text-[#CF5C5C]', bg: 'bg-[#CF5C5C]/10', border: 'border-[#CF5C5C]/20' };
  };

  if (loading || !user) return <div className="min-h-screen bg-[#0F1A18]" />;

  const rankStyle = getRankStyle(profile?.rankingScore);

  return (
    <div className="min-h-screen bg-[#0F1A18] text-[#EAEAEA] font-sans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* PERFIL */}
        <div className="bg-[#13201E] border border-[#2A453F] rounded-2xl p-8 mb-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#3A7D63] opacity-5 blur-[100px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className={`w-32 h-32 rounded-full border-4 ${rankStyle.border} p-1 bg-[#0F1A18] shrink-0`}>
                    {user.photoURL ? (
                        <img src={user.photoURL} className="w-full h-full rounded-full object-cover" alt="Perfil" />
                    ) : (
                        <div className={`w-full h-full rounded-full ${rankStyle.bg} flex items-center justify-center text-4xl font-bold ${rankStyle.text}`}>
                            {user.displayName?.[0] || 'U'}
                        </div>
                    )}
                </div>
                <div className="flex-1 w-full space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1 w-full">
                            {isEditing ? (
                                <div className="space-y-3 max-w-md animate-in fade-in">
                                    <input 
                                        type="text" 
                                        value={editForm.displayName}
                                        onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                                        className="w-full bg-[#0F1A18] border border-[#2A453F] rounded px-3 py-2 text-white outline-none focus:border-[#6BBF99]"
                                        placeholder="Nome de Exibição"
                                    />
                                    <input 
                                        type="text" 
                                        value={editForm.organization}
                                        onChange={(e) => setEditForm({...editForm, organization: e.target.value})}
                                        placeholder="Instituição / Escola"
                                        className="w-full bg-[#0F1A18] border border-[#2A453F] rounded px-3 py-2 text-white outline-none focus:border-[#6BBF99]"
                                    />
                                    <textarea 
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                        placeholder="Bio: Conte sobre você..."
                                        className="w-full bg-[#0F1A18] border border-[#2A453F] rounded px-3 py-2 text-white outline-none resize-none h-20 focus:border-[#6BBF99]"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-white">{profile?.displayName || user.displayName}</h1>
                                    <div className="flex flex-wrap gap-4 text-[#8CA69E] text-sm mt-2">
                                        {profile?.organization && (
                                            <div className="flex items-center gap-1">
                                                <Building2 size={14} />
                                                <span>{profile.organization}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Trophy size={14} className={rankStyle.text} />
                                            <span className={rankStyle.text}>{Math.floor(profile?.rankingScore || 0)} pts</span>
                                        </div>
                                    </div>
                                    {profile?.bio && <p className="mt-4 text-[#EAEAEA]/80 max-w-2xl">{profile.bio}</p>}
                                </>
                            )}
                        </div>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-[#2A453F] rounded-lg text-[#8CA69E] hover:text-white transition">
                                <Edit2 size={18} />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-[#2A453F] rounded-lg text-[#CF5C5C]"><X size={20} /></button>
                                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-[#3A7D63] text-white rounded-lg font-bold text-sm hover:bg-[#2F6650]"><Save size={16} /> Salvar</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Problemas Resolvidos" value={profile?.problemsSolved || 0} icon={<Target size={24} className="text-[#6BBF99]" />} />
            <StatCard label="Total de Envios" value={profile?.totalSubmissions || 0} icon={<Flame size={24} className="text-[#D4B04C]" />} />
            <StatCard label="Ranking Score" value={profile?.rankingScore || 0} icon={<Trophy size={24} className="text-[#4A6F8A]" />} />
        </div>

        {/* HISTÓRICO DE SUBMISSÕES */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-[#8CA69E]" />
                Atividade Recente
            </h2>

            {history.length > 0 ? (
                <div className="bg-[#13201E] border border-[#2A453F] rounded-xl overflow-hidden shadow-lg">
                    {/* Cabeçalho da Tabela */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2A453F] bg-[#182B27] text-xs font-bold text-[#8CA69E] uppercase tracking-wider">
                        <div className="col-span-5 md:col-span-4">Problema</div>
                        <div className="col-span-4 md:col-span-3 text-center">Status</div>
                        <div className="col-span-2 hidden md:block text-center">Pontos</div>
                        <div className="col-span-3 md:col-span-3 text-right">Data</div>
                    </div>
                    
                    {/* Linhas */}
                    <div className="divide-y divide-[#2A453F]">
                        {history.map((item) => {
                            const statusStyle = getStatusConfig(item.status);
                            return (
                                <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#182B27]/50 transition duration-150">
                                    {/* Nome do Problema */}
                                    <div className="col-span-5 md:col-span-4 font-mono text-sm text-[#EAEAEA] truncate font-medium" title={item.problemId}>
                                        {item.problemId}
                                    </div>
                                    
                                    {/* Status Badge */}
                                    <div className="col-span-4 md:col-span-3 flex justify-center">
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
                                            {statusStyle.icon}
                                            <span className="truncate max-w-[80px] md:max-w-none">{item.status}</span>
                                        </div>
                                    </div>

                                    {/* Pontuação */}
                                    <div className="col-span-2 hidden md:block text-center font-mono font-bold text-[#EAEAEA]">
                                        {item.score}
                                    </div>

                                    {/* Data */}
                                    <div className="col-span-3 md:col-span-3 text-right text-xs text-[#8CA69E] font-mono">
                                        {formatDate(item.submittedAt)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 border border-dashed border-[#2A453F] rounded-xl text-[#8CA69E] bg-[#13201E]/50">
                    <Clock className="mx-auto mb-3 opacity-50" size={32} />
                    <p className="font-medium">Nenhuma atividade recente encontrada.</p>
                    <p className="text-sm opacity-60 mt-1">Resolva um problema para ver seu histórico aqui.</p>
                </div>
            )}
        </div>

      </main>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
    return (
        <div className="bg-[#13201E] border border-[#2A453F] p-6 rounded-xl flex items-center gap-4 shadow-lg hover:border-[#3A7D63]/50 transition-colors">
            <div className="p-3 bg-[#182B27] rounded-lg border border-[#2A453F]">{icon}</div>
            <div>
                <p className="text-[#8CA69E] text-xs font-bold uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-mono font-bold text-white mt-1">{value}</p>
            </div>
        </div>
    )
}