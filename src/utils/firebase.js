import { initializeApp } from "firebase/app"
import firebaseConfig from 'auth/firebase-config.json'
import { getDatabase, ref, child, get, update } from "firebase/database";

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)

export const dbRef = ref(getDatabase());
export default dbRef

export function dbGet( location ) {
    return get(child(dbRef, location))
}

export function dbUpdate( updates ) {
    return update(dbRef, updates)
}

// dbGet('user/student')
// .then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// })
// .catch((error) => {
//   console.error(error);
// });