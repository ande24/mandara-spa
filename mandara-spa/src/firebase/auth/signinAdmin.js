import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const actionCodeSettings = {
    url: 'http://localhost:3000/user/login',
    handleCodeInApp: true
  };

export default async function SignInAdmin(email, password) {
    console.log("signinadmin called")
    let res = null,
        err = null,
        userDoc = null;

    try {
        res = await signInWithEmailAndPassword(auth, email, password);
        console.log(res)
        await res.user.reload();
        if (!res.user.emailVerified) {
            await sendEmailVerification(res.user, actionCodeSettings)
            throw new Error("Please check your inbox and verify your email before logging in.");
        }
        
        console.log("id: ", res.user.uid)
        const userRef = doc(db, "users", res.user.uid);
        console.log("ref: ", userRef)
        const userDocTmp = await getDoc(userRef)
        console.log("doctmp ", userDocTmp)
        
        if (userDocTmp.exists()) {
            console.log("userdoc got")
            userDoc = userDocTmp.data();

            if (userDoc.user_role !== "branch_admin" && userDoc.user_role !== "business_admin") {
                throw new Error("Access denied. You are not an admin.");
            }
        } 
        else {
            console.log(err)
            throw new Error("User record not found.");
        }
        
    } catch (e) {
        err = e;
    }

    return { res, err, userDoc };
}