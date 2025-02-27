import { Modal } from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAccountModal, openAccountModal, } from "@/redux/modalSlice";
import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "@/firebase.jsx";
import { setUser } from "@/redux/userSlice";
import XIcon from "../icons/XIcon";
import Image from "next/image";
import upload from '@/images/upload_area.png'
import CheckIcon from "../icons/CheckIcon";
import RingSpinner from "../RingSpinner";
import { validatePhoneNumber } from "@/lib/actions";
const AccountInfo = () => {
    const isOpen = useSelector((state) => state.modals.accountModalOpen);
    const user = useSelector((state) => state.user);
    const [newFirstName, setFirstName] = useState(user.firstName || '');
    const [newLastName, setLastName] = useState(user.lastName || '');
    const [newPhone, setPhone] = useState(user.phone || '');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(user.photoUrl || null)
    const [newImage, setNewImage] = useState(false)
    const filePickerRef = useRef(null)
    const dispatch = useDispatch();
    function addImage(e) {
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.addEventListener("load", e => {
            setImage(e.target.result)
        })
        setNewImage(true)
    }
    const updateUser = async (e) => {
        e.preventDefault();
        if (!validatePhoneNumber(newPhone)){
            setError({ showError: true, title: "Invalid Phone Number", message: "Please enter a valid 10 digit phone number" });
            return;
          }

        e.stopPropagation();
        setLoading(true);

        try {
            let downloadURL = image; // Default to existing image if not updated

            // ✅ Upload new image if it exists
            if (image && newImage) {
                const imageRef = ref(storage, `photos/${user.uid}/profile.jpg`);
                await uploadString(imageRef, image, "data_url");

                // ✅ Introduce a slight delay to ensure Firebase Storage propagates
                await new Promise(resolve => setTimeout(resolve, 1000));

                downloadURL = await getDownloadURL(imageRef);
            }

            // ✅ Query Firestore for the user document
            const userRef = query(
                collection(db, "user"),
                where("uid", "==", user.uid)
            );
            const data = await getDocs(userRef);

            // ✅ Handle empty result case
            if (data.empty) {
                console.log("User not found in Firestore.");
                setLoading(false);
                return;
            }

            // ✅ Force image refresh by adding a timestamp (cache busting)
            const timestamp = new Date().getTime();
            const updatedPhotoURL = downloadURL.includes("?")
                ? `${downloadURL}&t=${timestamp}`
                : `${downloadURL}?t=${timestamp}`;

            // ✅ Prepare updated user data
            const userData = {
                firstName: newFirstName,
                lastName: newLastName,
                phone: newPhone,
                email: user.email,
                photoUrl: updatedPhotoURL, // ✅ Use updated URL with cache busting
                uid: user.uid,
                userRef: data.docs[0].id,
            };

            // ✅ Update Firestore document
            const docRef = doc(db, "user", data.docs[0].id);
            await updateDoc(docRef, userData);
            dispatch(setUser(userData));

        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoading(false);
            dispatch(closeAccountModal());
        }
    };
    return (
            <>
                <p
                    className="sb__link"
                    onClick={() => dispatch(openAccountModal())}
                >
                    Settings
                </p>

                <Modal
                    open={isOpen}
                    onClose={() => dispatch(closeAccountModal())}
                    className="account-settings-modal"
                >
                    <div className="login__container">
                        <div className="login">

                            <div className="login-form account-settings">
                                <div className="login-close-container">
                                    <div
                                        className="login__x"
                                        onClick={() => dispatch(closeAccountModal())}
                                    >
                                        <XIcon />
                                    </div>
                                </div>
                                {loading ? (
                                    <RingSpinner />
                                ) : (
                                    <>
                                        <div className="input-container">
                                            <h3 className="account-header">Account Information.</h3>
                                            <form>
                                                <p>First Name</p>
                                                <input
                                                    value={newFirstName}
                                                    onChange={(event) => {
                                                        setFirstName(event.target.value);
                                                    }}
                                                    type="first Name"
                                                    placeholder="First Name"
                                                />
                                                <p>Last Name</p>
                                                <input
                                                    value={newLastName}
                                                    onChange={(event) => {
                                                        setLastName(event.target.value);
                                                    }}
                                                    type="last Name"
                                                    placeholder="Last Name"
                                                />

                                                <p>Phone</p>
                                                <input
                                                    value={newPhone}
                                                    onChange={(event) => {
                                                        setPhone(event.target.value);
                                                    }}
                                                    type="phone"
                                                    placeholder="Phone Number"
                                                />
                                                <div className="photourl-container">
                                                    {image ?


                                                        <div className="account-image-preview">
                                                            <div className='x-image-preview' onClick={() => setImage(null)}><XIcon />
                                                            </div> <img src={image} alt="" className="preview-image" />
                                                        </div>

                                                        :
                                                        <>
                                                            <div className="input-photourl" onClick={() => filePickerRef.current.click()}>
                                                                <Image src={upload} className="input-upload-image" alt="upload" />
                                                                <input onChange={addImage} ref={filePickerRef} className="hidden" type="file" />
                                                            </div>
                                                        </>
                                                    }
                                                    {user.isAdmin &&
                                                        <div className="account-check-container">
                                                            <label className="account-settings-admin">
                                                                Admin
                                                            </label>
                                                            <div className="account-settings-check">
                                                                <CheckIcon />
                                                            </div>
                                                        </div>
                                                    }
                                                    {user.isSuper &&
                                                        <div className="account-check-container">
                                                            <label className="account-settings-admin">
                                                                Super Admin
                                                            </label>
                                                            <div className="account-settings-check">
                                                                <CheckIcon />
                                                            </div>
                                                        </div>
                                                    }
                                                    {user.isSuperSuper &&
                                                        <div className="account-check-container">
                                                            <label className="account-settings-admin">
                                                                Owner
                                                            </label>
                                                            <div className="account-settings-check">
                                                                <CheckIcon />
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="account-button-container">
                                                    <button
                                                        className="orange-btn"
                                                        onClick={(e) => updateUser(e)}
                                                        type="submit"
                                                    >
                                                        Update
                                                    </button>
                                                </div>

                                            </form>

                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>{" "}
            </>
    
    );
};

export default AccountInfo;