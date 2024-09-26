import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal, closeLoginModal } from "@/redux/modalSlice.js";
import {  
  onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { setUser } from "@/redux/userSlice.js";
import { addDoc, collection, where, getDocs, query } from "firebase/firestore";
import { auth, db } from "@/firebase";
import XIcon from "../icons/XIcon";
import upload from '@/images/upload_area.png'
import Image from "next/image";


const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState('')
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const isOpen = useSelector((state) => state.modals.loginModalOpen);
  const dispatch = useDispatch();
  const user = useSelector((state)=> state.user)
  async function handleOpen() {
    dispatch(openLoginModal())
  }
  
  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true)
    let res    
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      res = userCredentials.user;
      console.log(res, 'user sign up')
    } catch (error) {
      alert(error.code.split('/')[1].split('-').join(" "))
      setLoading(false)
      return
    }
    
    
    dispatch(closeLoginModal());
    await addDoc(collection(db, `user`), {
      uid: res.uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
    });
    setLoading(false)
  }
  const login = async (email, password) => {
    setLoading(true)
    try{
        await signInWithEmailAndPassword(auth, email, password)

    } catch (error) {
        alert(error.code.split('/')[1].split('-').join(" "))

    }
    setLoading(false)    
}
function checkCredentials(){
  return false
}
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        return;
      }
      const userRef = await query(collection(db, "user"), where('uid', '==', currentUser.uid))
      const data  = await getDocs(userRef)
      if (data.empty) {
        console.log("nothing", data.docs, currentUser.uid)
      }
      else {
        const userInfo = data.docs.map(doc => doc.data())[0]
      dispatch(
        setUser({
          username: userInfo.email.split("@")[0],
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          uid: userInfo.uid,
          phone: userInfo.phone,
          photoUrl: userInfo.photoUrl
        })
      );

      }
      
      
    });

    return unsubscribe;
  }, []);  

  return (
    <>
      
        <p className="login-link light-blue"
          onClick={() => handleOpen()}
        >
          Log In
        </p>
      
      <Modal
        open={isOpen}
        onClose={() => dispatch(closeLoginModal())}
        className="login__modal"
      >
        <div className="login__container">
        {loading ? (
          <div className="login-spinner">
            <FontAwesomeIcon icon="fas fa-spinner"></FontAwesomeIcon>            
          </div>
        ) : (
          <div className="login">           

            <div className="login-form">
              
                <div className="login-close-container">
                     <div
                        className="login__x"
                    onClick={() => dispatch(closeLoginModal())}
                  >
                    <XIcon />
                  </div>
                </div>
              <h1>{signState}</h1>
              <form>
                <div className="input-container">
                {signState === "Sign Up" ? (
                  <>
                  <p>First Name</p>
                  <input
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value);
                    }}
                    type="text"
                    placeholder="First Name"
                  />
                  <p>Last Name</p>
                  <input
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                    }}
                    type="text"
                    placeholder="Last Name"
                  />
                  </>
                ) : (
                  <></>
                )}

                  <p>Email</p>
                <input
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  type="email"
                  placeholder="Email"
                />
                
                <p>Password</p>
                <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  type="password"
                  placeholder="Password"
                />
                
                {signState === "Sign Up" && (
                  <>                    
                  <p>Phone</p>
                  <input
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                      }}
                      type="phone"
                      placeholder="Phone"
                    />
                    
                  <div className="input-photourl">
                      <Image src={upload} className="input-upload-image" alt="upload" />
                    </div>
                  </>
                )}
                {signState === "Sign Up" ? (<>
                  {!(checkCredentials()) ? <button className="submit" onClick={handleSignUp}>Sign Up</button> : <button className="submit__disabled">Fill out all Fields</button> }
                  </>
                ) : (
                  <>
                  <button type="submit" className="submit" onClick={(e) => {
                    e.preventDefault()
                    login(email, password)
                    dispatch(closeLoginModal())
                    }}>
                    Sign In
                  </button>                  
              </>
                )}
                </div>
              </form>
              <div className="form-switch">
                {signState === "Sign In" ? (
                  <p>
                    New Account{" "}
                    <span
                      onClick={() => setSignState("Sign Up")}
                      className="switch-text"
                    >
                      Sign Up Now
                    </span>
                  </p>
                ) : (
                  <p>
                    Already have account?{" "}
                    <span
                      onClick={() => setSignState("Sign In")}
                      className="switch-text"
                    >
                      Sign In
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          
        )}
        </div>
      </Modal>
    </>
  );
};

export default Login;