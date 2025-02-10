import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal, closeLoginModal } from "@/redux/modalSlice.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // ✅ Firebase Storage
import XIcon from "../icons/XIcon";
import RingSpinner from "../RingSpinner";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModel";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { setUser } from "@/redux/userSlice";

const Login = ({ defaultState, classes }) => {
  const [signState, setSignState] = useState(defaultState || "Sign In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOpen, setIsOpen ]= useState(false)
  const dispatch = useDispatch();
  const [error, setError] = useState({ showError: false, title: "", message: "" });

  // ✅ Function to handle password reset confirmation
  const confirmResetPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setError({ showError: true, title: "Error", message: "Please enter your email first." });
      return;
    }
    setShowConfirm(true);
  };

  // ✅ Function to send password reset email
  async function handleResetPassword() {
    setShowConfirm(false);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      setError({ showError: true, title: "Reset Failed", message: error.message });
    }
    setLoading(false);
  }

  // ✅ Function to handle login
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(closeLoginModal());
    } catch (error) {
      setError({ showError: true, title: "Login Failed", message: error.message });
    }
    setLoading(false);
  };

  // ✅ Function to handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `profile_pictures/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // ✅ Function to handle sign up
  const signUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Check if the email is already registered
      const userRef = query(collection(db, "user"), where("email", "==", email));
      const data = await getDocs(userRef);

      if (!data.empty) {
        setError({ showError: true, title: "Sign Up Failed", message: "This email is already in use." });
        setLoading(false);
        return;
      }

      // ✅ Upload profile photo if provided
      let uploadedPhotoUrl = "";
      if (photo) {
        uploadedPhotoUrl = await handleImageUpload(photo);
        setPhotoUrl(uploadedPhotoUrl);
      }

      // ✅ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // ✅ Save user info to Firestore
      const userData = {
        uid: newUser.uid,
        email,
        firstName,
        lastName,
        phone,
        photoUrl: uploadedPhotoUrl || "",
        isAdmin: false,
        isMember: false,
        userRef: newUser.uid,
        isSuper: false,
        isSuperSuper: false,
        commentRef: "",
      };
      await setDoc(doc(db, "user", newUser.uid), userData);

      // ✅ Save user in Redux
      dispatch(setUser(userData));

      dispatch(closeLoginModal());
    } catch (error) {
      setError({ showError: true, title: "Sign Up Failed", message: error.message });
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const userRef = query(collection(db, "user"), where("uid", "==", currentUser.uid));
      const data = await getDocs(userRef);

      if (data.empty) {
        setLoading(false);
        return;
      }

      const userInfo = data.docs[0].data();
      dispatch(setUser(userInfo));

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <p className={classes} onClick={() => setIsOpen(true)}>Login</p> 

      
      {isOpen && (
        <div className="custom-modal-overlay">
        <div className="login__container">
          <div className="login">
            <div className="login-form login-setting">
              {loading ? (
                <RingSpinner />
              ) : (
                <>
                  <div className="login-close-container">
                    <div className="login__x" onClick={() => setIsOpen(false)}>
                      <XIcon />
                    </div>
                  </div>
                  <h1 className="login-header">{signState}</h1>
                  <form>
                    <div className="input-container">
                      <p>Email</p>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
                      {signState == "Sign Up" && <> <p>Password</p>
                          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" /></>}
                      {signState === "Sign In" ? (
                        <>
                          <p>Password</p>
                          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                          <button type="submit" className="submit" onClick={login}>Sign In</button>
                          <p className="forgot-password" onClick={confirmResetPassword}>Forgot Password?</p>
                        </>
                      ) : (
                        <>
                          <p>First Name</p>
                          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First Name" />
                          <p>Last Name</p>
                          <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last Name" />
                          <p>Phone</p>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Phone" />
                          <p>Profile Photo</p>
                          <div className="login-file">
                            <input
                              type="file"
                              accept="image/*" // Ensures only image files
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setPhoto(file);
                                  setPhotoUrl(URL.createObjectURL(file)); // Generate preview URL
                                }
                              }}
                            />

                            {/* ✅ Display Image Preview */}
                            {photoUrl && (
                              <div className="image-preview">
                                <img src={photoUrl} alt="User Preview" />
                              </div>
                            )}
                            <button type="submit" className="submit" onClick={signUp}>Sign Up</button>
                          </div>
                          
                          
                        </>
                      )}
                    </div>
                  </form>

                  <div className="form-switch">
                    {signState === "Sign In" ? (
                      <p>New Account? <span onClick={() => setSignState("Sign Up")} className="switch-text">Sign Up Now</span></p>
                    ) : (
                      <p>Already have an account? <span onClick={() => setSignState("Sign In")} className="switch-text">Sign In</span></p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        </div>
        )}
      {/* ✅ Confirmation Modal for Reset */}
      {showConfirm && (
        <ConfirmationModal
          title="Reset Password?"
          message={`Are you sure you want to reset your password? A reset link will be sent to ${email}.`}
          onConfirm={handleResetPassword}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* ✅ Error Modal */}
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
