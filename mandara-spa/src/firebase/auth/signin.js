import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";

const auth = getAuth(firebase_app);

const actionCodeSettings = {
    url: 'http://localhost:3000/user/login',
    handleCodeInApp: true
  };

export default async function signIn(email, password) {
    let res = null,
        err = null;

    try {
        res = await signInWithEmailAndPassword(auth, email, password);

        // if (!res.user.emailVerified) {
        //     await sendEmailVerification(res.user, actionCodeSettings)
        //     throw new Error("Please check your inbox and verify your email before logging in.");
        // }
    } catch (e) {
        err = e;
    }

    return { res, err };
}