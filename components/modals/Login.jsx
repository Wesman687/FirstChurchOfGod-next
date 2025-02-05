import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal, closeLoginModal } from "@/redux/modalSlice.js";
import {
  onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { setUser } from "@/redux/userSlice.js";
import { addDoc, collection, where, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "@/firebase";
import XIcon from "../icons/XIcon";
import upload from '@/images/upload_area.png'
import Image from "next/image";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import RingSpinner from "../RingSpinner";
import { toast } from "react-toastify";
import ErrorModal from "./ErrorModal";


const Login = ({ defaultState }) => {
  const [signState, setSignState] = useState(defaultState || "Sign In");
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState('')
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const isOpen = useSelector((state) => state.modals.loginModalOpen);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const filePickerRef = useRef(null)
  const [error, setError] = useState({ showError: false, title: "", message: "" });

  function addImage(e) {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.addEventListener("load", e => {
      setPhotoUrl(e.target.result)
    })
  }
  async function handleOpen() {
    setSignState('Sign In')
    dispatch(openLoginModal())
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true)
    let res
    let downloadURL
    if (!photoUrl) {
      alert('Please include a photo')
      setLoading(false)
      return
    }
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      res = userCredentials.user;
      console.log(res)


      const imageRef = await ref(storage, `photos/${res.uid}`)
      const uploadImage = await uploadString(imageRef, photoUrl, "data_url")
      downloadURL = await getDownloadURL(imageRef)



      const docRef = await addDoc(collection(db, `user`), {
        uid: res.uid,
        firstName: firstName,
        lastName: lastName,
        username: email.split('@')[0],
        email: email,
        phone: phone,
        photoUrl: downloadURL,
      });
      if (docRef) {
        dispatch(
          setUser({
            username: email.split("@")[0],
            firstName: firstName,
            lastName: lastName,
            email: email,
            uid: res.uid,
            phone: phone,
            photoUrl: photoUrl,
            isAdmin: false
          })
        );

        await updateDoc(docRef, {
          userRef: docRef.id,
        });

      }
      else {
        setError({
          showError: true,
          title: "Sign Up Failed",
          message: "Please try again, or log in to check account credentials.",
        });
      }
      dispatch(closeLoginModal());
    } catch (error) {
      dispatch(closeLoginModal())
      setError({ showError: true, title: "Error", message: error.message });
    }

    setLoading(false)
  }
  const login = async (email, password) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)

    } catch (error) {
      dispatch(closeLoginModal())
      setError({ showError: true, title: "Login Failed", message: error.code.split('/')[1].split('-').join(" ") });
    }
    setLoading(false)
  }
  function checkCredentials() {
    return false
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        return;
      }

      console.log("🔥 Auth UID:", currentUser.uid);  // ✅ Debugging Step

      const userRef = query(
        collection(db, "user"),
        where("uid", "==", currentUser.uid)  // ✅ Ensure Firestore is queried correctly
      );
      const data = await getDocs(userRef);

      if (data.empty) {
        console.log("❌ No matching user found in Firestore for UID:", currentUser.uid);
        setLoading(false);
        return;
      }

      const userInfo = data.docs[0].data();
      const docId = data.docs[0].id;

      if (!userInfo.userRef || userInfo.userRef !== docId) {
        console.log("🔄 Updating userRef field in Firestore...");
        await updateDoc(doc(db, "user", docId), { userRef: docId });
      }

      // ✅ Correctly set UID in Redux
      dispatch(setUser({
        username: userInfo.email.split("@")[0],
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        uid: currentUser.uid, // ✅ Use Firebase Auth UID
        phone: userInfo.phone,
        photoUrl: userInfo.photoUrl,
        isAdmin: userInfo.isAdmin,
        isMember: userInfo.isMember,
        userRef: docId, // ✅ Store Firestore doc ID separately
        isSuper: userInfo.isSuper,
        isSuperSuper: userInfo.isSuperSuper,
        commentRef: userInfo.commentRef
      }));

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>

      {defaultState ?
        <label className="click" onClick={() => handleOpen()}>Sign Up</label>
        : <p className="login-link light-blue"
          onClick={() => handleOpen()}
        >
          Log In
        </p>}

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeLoginModal())}
        className="login__modal"
      >
        <div className="login__container">

          <div className="login">

            <div className={signState === 'Sign In' ? 'login-form login-setting' : 'login-form login-setting-signup'}>
              {loading ? (
                <RingSpinner />
              ) :
                <>
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

                          <div className="photourl-container">
                            {photoUrl ?


                              <div className="account-image-preview">
                                <div className='x-image-preview' onClick={() => setPhotoUrl(null)}><XIcon />
                                </div> <img src={photoUrl} className="preview-image" />
                              </div>

                              :
                              <>
                                <div className="input-photourl" onClick={() => filePickerRef.current.click()}>
                                  <Image src={upload} className="input-upload-image" alt="upload" />
                                  <input onChange={addImage} ref={filePickerRef} className="hidden" type="file" />
                                </div>
                              </>
                            }
                          </div>
                        </>
                      )}
                      {signState === "Sign Up" ? (<>
                        {!(checkCredentials()) ? <button className="submit" onClick={handleSignUp}>Sign Up</button> : <button className="submit__disabled">Fill out all Fields</button>}
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
                  </div></>}
            </div>
          </div>

        </div>
      </Modal>
      {error.showError && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onClose={() => setError({ showError: false, title: "", message: "" })}
        />
      )}
    </>
  );
};

export default Login;