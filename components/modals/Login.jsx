import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal, closeLoginModal } from "@/redux/modalSlice.js";
import {
  onAuthStateChanged,  
  signInWithEmailAndPassword,
  sendPasswordResetEmail,  // ✅ Firebase Reset Password
} from "firebase/auth";
import { auth, db } from "@/firebase";
import XIcon from "../icons/XIcon";
import RingSpinner from "../RingSpinner";
import ErrorModal from "./ErrorModal"; // ✅ Import confirmation modal
import ConfirmationModal from "./ConfirmationModel";
import { collection, getDocs, query, where } from "firebase/firestore";
import { setUser } from "@/redux/userSlice";

const Login = ({ defaultState }) => {
  const [signState, setSignState] = useState(defaultState || "Sign In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ Show confirmation modal
  const isOpen = useSelector((state) => state.modals.loginModalOpen);
  const dispatch = useDispatch();
  const [error, setError] = useState({ showError: false, title: "", message: "" });

  // ✅ Function to handle password reset confirmation
  const confirmResetPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setError({ showError: true, title: "Error", message: "Please enter your email first." });
      return;
    }
    setShowConfirm(true); // ✅ Open confirmation modal
  };

  // ✅ Function to send password reset email
  async function handleResetPassword() {
    setShowConfirm(false); // Close modal before sending request
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true); // ✅ Show success message
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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        return;
      }


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
      <p className="login-link light-blue" onClick={() => dispatch(openLoginModal())}>
        Log In
      </p>

      <Modal open={isOpen} onClose={() => dispatch(closeLoginModal())} className="login__modal"
        style={{ zIndex: 100 }} // Ensure it's below confirmation modal
        disableEnforceFocus // 🔥 Allows stacking multiple modals
        disableAutoFocus>
        <div className="login__container">
          <div className="login">
            <div className="login-form login-setting">
              {loading ? (
                <RingSpinner />
              ) : (
                <>
                  <div className="login-close-container">
                    <div className="login__x" onClick={() => dispatch(closeLoginModal())}>
                      <XIcon />
                    </div>
                  </div>
                  <h1>{signState}</h1>
                  <form>
                    <div className="input-container">
                      <p>Email</p>
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        placeholder="Email"
                      />

                      {signState === "Sign In" && (
                        <>
                          <p>Password</p>
                          <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            placeholder="Password"
                          />
                          <button type="submit" className="submit" onClick={login}>
                            Sign In
                          </button>

                          {/* ✅ Forgot Password Link */}
                          <p className="forgot-password" onClick={confirmResetPassword}>
                            Forgot Password?
                          </p>

                          {/* ✅ Show success message when reset email is sent */}
                          {resetEmailSent && (
                            <p className="success-message">
                              Password reset email sent! Check your inbox.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </form>

                  <div className="form-switch">
                    {signState === "Sign In" ? (
                      <p>
                        New Account{" "}
                        <span onClick={() => setSignState("Sign Up")} className="switch-text">
                          Sign Up Now
                        </span>
                      </p>
                    ) : (
                      <p>
                        Already have an account?{" "}
                        <span onClick={() => setSignState("Sign In")} className="switch-text">
                          Sign In
                        </span>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

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
