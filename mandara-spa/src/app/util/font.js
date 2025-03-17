import { PT_Sans } from 'next/font/google'

export const pt_sans_init = PT_Sans({
    subsets: ['latin'], 
    display: 'swap',
    variable: '--font-pt_sans', 
    weight: ['400', '700'],
});

export const pt_sans = pt_sans_init.variable;