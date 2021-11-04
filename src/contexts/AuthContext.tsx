import { createContext, ReactNode, useState, useEffect } from 'react';
import { firebase, authentication, banco } from '../services/firebase';
import { getAuth, signInWithPopup } from 'firebase/auth';

type User = {
  id: string,
  name: string,
  avatar: string,
}

type AuthContextType = {
  user: User | undefined,
  signInWithGoogle: () => Promise<void>,
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);


export function AuthContextProvider(props: AuthContextProviderProps){

  
  const [user, setUser] = useState<User>();

  useEffect(()=> {
    const unsubscribe = authentication.onAuthStateChanged(user =>{
      if(user){
        const { displayName, photoURL, uid } = user;
        console.log(user)
        
        if( !displayName || !photoURL ){
          throw new Error('Missing information!!')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = getAuth();

    await signInWithPopup(auth, provider).then((result) => {
      if(result.user){
        const { displayName, photoURL, uid } = result.user;
        console.log(result.user)
        
        if( !displayName || !photoURL ){
          throw new Error('Missing information!!')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
  }

  return (
    <AuthContext.Provider value={{user, signInWithGoogle}}>
      {props.children}
    </AuthContext.Provider>
  );
}