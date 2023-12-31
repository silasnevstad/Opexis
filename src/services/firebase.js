import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where  } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

async function signUp(email, password) {
    if (!email || !password) {
        return { success: false, error: 'missing-fields' };
    }
    return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            return { success: true, user: userCredential.user }
        })
        .catch((error) => {
            const errorCode = error.code;
            return { success: false, error: errorCode };
        });
}

async function signIn(email, password) {
    if (!email || !password) {
        return { success: false, error: 'missing-fields' };
    }
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return { success: true, user: userCredential.user }
        })
        .catch((error) => {
            const errorCode = error.code;
            return { success: false, error: errorCode };
        });
}

async function signOutUser() {
    return signOut(auth).then(() => {
        return { success: true };
    }).catch((error) => {
        return { success: false, error: error };
    });
}

async function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider)
        .then((result) => {
            return { success: true, user: result.user }
        })
        .catch((error) => {
            return { success: false, error: error };
        });
}

async function getProjects(uid) {
    if (!uid) {
        return { success: false, error: 'missing-fields' };
    }

    try {
        const q = query(collection(db, "projects"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        let projects = [];
        querySnapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, projects: projects };
    } catch (error) {
        return { success: false, error: error };
    }
}

async function addProject(uid, project) {
    if (!uid || !project) {
        return { success: false, error: 'missing-fields' };
    }
    const projectsCollection = collection(db, "projects");
    const docRef = await addDoc(projectsCollection, { ...project, userId: uid });

    return { success: true, id: docRef.id };
}


async function updateProject(uid, projectId, updatedProject) {
    if (!uid || !projectId || !updatedProject) {
        return { success: false, error: 'missing-fields' };
    }
    const projectRef = doc(db, `projects/${projectId}`);
    await updateDoc(projectRef, updatedProject);

    return { success: true };
}

async function deleteProject(uid, projectId) {
    if (!uid || !projectId) {
        return { success: false, error: 'missing-fields' };
    }
    const projectRef = doc(db, `projects/${projectId}`);
    await deleteDoc(projectRef);

    return { success: true };
}

async function setApiKey(uid, apiKey) {
    if (!uid || !apiKey) {
        return { success: false, error: 'missing-fields' };
    }

    const apiKeysRef = doc(db, `apiKeys/${uid}`);
    const docSnap = await getDoc(apiKeysRef);
    
    if (docSnap.exists()) {
        await updateDoc(apiKeysRef, { apiKey: apiKey });
    } else {
        await setDoc(apiKeysRef, { apiKey: apiKey, userId: uid });
    }
    
    return { success: true };
}

async function getApiKey(uid) {
    if (!uid) {
        return { success: false, error: 'missing-fields' };
    }

    const apiKeysRef = doc(db, `apiKeys/${uid}`);
    const docSnap = await getDoc(apiKeysRef);
    
    if (docSnap.exists()) {
        return { success: true, apiKey: docSnap.data().apiKey };
    } else {
        return { success: false, error: 'no-api-key' };
    }
}

export { signUp, signIn, signOutUser, signInWithGoogle, getProjects, addProject, updateProject, deleteProject, setApiKey, getApiKey, auth };