import firebase_app from "../config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(firebase_app);

const actionCodeSettings = {
    url: 'http://localhost:3000/user/login',
    handleCodeInApp: true
  };

export default async function forgotPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        return 
    } catch (error) {
        return error.message;
    }
}
