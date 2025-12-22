import React from 'react';

type LogoProps = React.ComponentProps<'svg'>;

export function Logo({ className = "", ...props }: LogoProps) {
  return (
      <div className="w-full flex justify-center mb-8">
          {/* max-w-[240px]: Define um tamanho máximo controlado.
            w-full: Garante que o SVG ocupe esse espaço.
            h-auto: Mantém a proporção correta sem esticar.
          */}
          <div className="w-full max-w-[360px] transform hover:scale-105 transition-transform duration-500 translate-x-6">
            <svg 
              /* FIX DO CORTE: O viewBox agora começa em -10 (primeiro valor).
                Isso revela a parte do mandacaru que estava escondida à esquerda.
                viewBox="-10 0 270 80" -> x=-10, y=0, width=270, height=80
              */
              viewBox="-10 0 270 80" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={className}
              {...props} 
            >
              {/* Ícone Mandacaru */}
              <path d="M48 12C48 7.58172 44.4183 4 40 4C35.5817 4 32 7.58172 32 12V44H20C15.5817 44 12 40.4183 12 36V28C12 23.5817 8.41828 20 4 20C-0.418278 20 -4 23.5817 -4 28V36C-4 49.2548 6.74517 60 20 60H32V68C32 72.4183 35.5817 76 40 76C44.4183 76 48 72.4183 48 68V52H60C73.2548 52 84 41.2548 84 28V20C84 15.5817 80.4183 12 76 12C71.5817 12 68 15.5817 68 20V28C68 32.4183 64.4183 36 60 36H48V12Z" fill="#3A7D63"/>
              
              {/* Textos empilhados e alinhados */}
              <text x="94" y="38" fontFamily="var(--font-plus-jakarta)" fontWeight="700" fontSize="34" fill="#EAEAEA">Código</text>
              <text x="94" y="68" fontFamily="var(--font-plus-jakarta)" fontWeight="800" fontSize="34" fill="#D4B04C">Massa</text>
            </svg>
          </div>
      </div>
    
  );
}

export function LogoIcon({ className = "", ...props }: LogoProps) {
    return (
        /* Adicionei o viewBox negativo aqui também para garantir */
        <svg viewBox="-5 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M48 12C48 7.58172 44.4183 4 40 4C35.5817 4 32 7.58172 32 12V44H20C15.5817 44 12 40.4183 12 36V28C12 23.5817 8.41828 20 4 20C-0.418278 20 -4 23.5817 -4 28V36C-4 49.2548 6.74517 60 20 60H32V68C32 72.4183 35.5817 76 40 76C44.4183 76 48 72.4183 48 68V52H60C73.2548 52 84 41.2548 84 28V20C84 15.5817 80.4183 12 76 12C71.5817 12 68 15.5817 68 20V28C68 32.4183 64.4183 36 60 36H48V12Z" fill="#3A7D63"/>
        </svg>
    )
}

export function HorizontalLogo({ className = "", ...props }: LogoProps) {
    return (
      /* Adicionei o viewBox negativo aqui também para garantir */
      <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity z-50">
        <svg width="40" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M48 12C48 7.58172 44.4183 4 40 4C35.5817 4 32 7.58172 32 12V44H20C15.5817 44 12 40.4183 12 36V28C12 23.5817 8.41828 20 4 20C-0.418278 20 -4 23.5817 -4 28V36C-4 49.2548 6.74517 60 20 60H32V68C32 72.4183 35.5817 76 40 76C44.4183 76 48 72.4183 48 68V52H60C73.2548 52 84 41.2548 84 28V20C84 15.5817 80.4183 12 76 12C71.5817 12 68 15.5817 68 20V28C68 32.4183 64.4183 36 60 36H48V12Z" fill="#3A7D63"/>
        </svg>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-bold text-2xl tracking-tight text-[#EAEAEA]">Código</span>
          <span className="font-extrabold text-2xl tracking-tight text-[#D4B04C]">Massa</span>
        </div>
      </div>
    )
}