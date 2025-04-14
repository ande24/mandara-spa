import firebase_app from "../config";
import { sendEmailVerification, createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

const actionCodeSettings = {
    url: 'http://localhost:3000/user/login',
    handleCodeInApp: true
  };

export default async function SignUp(email, password) {
    let res = null,
        err = null;
    try {
        res = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(res.user, actionCodeSettings);
        console.log("res: ", res);
    } catch (e) {
        err = e;
    }

    console.log(" dres: ", res);
    console.log("derr: ", err);

    return { res, err };
}