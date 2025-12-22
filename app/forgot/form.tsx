'use client';

export default function ForgotForm() {
    return (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#EAEAEA]">E-mail cadastrado</label>
                <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* Icon: Mail */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8CA69E] group-focus-within:text-[#3A7D63] transition-colors">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </div>
                <input 
                    type="email" 
                    id="email" 
                    className="block w-full pl-10 pr-3 py-3 bg-[#0F1A18] border border-[#2A453F] rounded-lg focus:ring-2 focus:ring-[#3A7D63] focus:border-transparent text-[#EAEAEA] font-mono placeholder-[#8CA69E]/50 transition-all outline-none sm:text-sm" 
                    placeholder="seu@email.com"
                />
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#3A7D63] hover:bg-[#6BBF99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13201E] focus:ring-[#3A7D63] transition-all duration-200 transform hover:-translate-y-0.5"
            >
                Enviar Link de Recuperação
            </button>
        </form>
    )
}