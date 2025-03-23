import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";

const auth = await getAuth(firebase_app);

const actionCodeSettings = {
    url: 'http://localhost:3000/user/login',
    handleCodeInApp: true
  };

export default async function SignIn(email, password) {
    let res = null,
        err = null;

    try {
        res = await signInWithEmailAndPassword(auth, email, password);
        await res.user.reload();
        // if (!res.user.emailVerified) {
        //     await sendEmailVerification(res.user, actionCodeSettings)
        // }
    } catch (e) {
        err = e;
    }

    return { res, err };
}