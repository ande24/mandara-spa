'use client'

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthAction() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode'); 

    useEffect(() => {
        if (!mode) return;

        try {
            if (mode === 'verifyEmail') {
                router.push('/auth/emailVerified');
            } else if (mode === 'resetPassword') {
                router.push(`/user/login/changePassword?oobCode=${oobCode}`);
            } else {
                alert("Missing oobCode. Please check your email link.");
            }
        } catch (error) {
            alert(error.message);
        }
    }, [mode, oobCode, router])
}
