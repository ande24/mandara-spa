import firebase_app from "../config";
import { sendEmailVerification, createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

const actionCodeSettings = {
    url: 'http://localhost:3000/user/login',
    handleCodeInApp: true
  };

export default async function signUp(email, password) {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);

        await sendEmailVerification(result.user, actionCodeSettings);
        console.log("Verification email sent!");
        
    } catch (e) {
        error = e;
    }

    return { result, error };
}