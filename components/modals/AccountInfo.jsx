import { Modal } from "@mui/material";
import React, {  useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAccountModal,  openAccountModal, } from "@/redux/modalSlice";
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

const AccountInfo = () => {
    const isOpen = useSelector((state) => state.modals.accountModalOpen);
    const user = useSelector((state) => state.user);
    const [newFirstName, setFirstName] = useState(user.firstName || '');
    const [newLastName, setLastName] = useState(user.lastName || '');
    const [newPhone, setPhone] = useState(user.phone || '');
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '')
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null)
    const filePickerRef = useRef(null)
    const dispatch = useDispatch();
    const checkDisable = () => {
        return (
            user.firstName === newFirstName &&
            user.lastName === newLastName &&
            user.phone === newPhone
        );
    };
    function addImage(e) {
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.addEventListener("load", e => {
            setImage(e.target.result)
        })
    }
    const updateUser = async (e) => {
        e.preventDefault();
        e.stopPropagation()
        setLoading(true);

        
            let downloadURL
            if (image) {
                const imageRef = await ref(storage, `photos/${user.uid}`)
                const uploadImage = await uploadString(imageRef, image, "data_url")
                downloadURL = await getDownloadURL(imageRef)
            }
            console.log(downloadURL)
            const userRef = await query(
                collection(db, "user"),
                where("uid", "==", user.uid)
            );
            const data = await getDocs(userRef);
            if (data.empty) {
                console.log("nothing", data.docs, user.uid);
            }
            const userInfo = data.docs.map(doc => doc.data())[0]
            const userData = {
                firstName: newFirstName,
                lastName: newLastName,
                phone: newPhone,
                email: userInfo.email,
                photoUrl: downloadURL,
                uid: userInfo.uid
            };
            const docRef = doc(db, "user", data.docs[0].id);
            await updateDoc(docRef, userData);
            dispatch(setUser(userData));

        

        setLoading(false);
        dispatch(closeAccountModal());
    };
    return (
        <>

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
                    className="settings__modal contact__modal"
                >
                    <div className="login__container">
                        <div className="login">
                            <div className="login-form">
                                <div className="login-close-container">
                                    <div
                                        className="login__x"
                                        onClick={() => dispatch(closeAccountModal())}
                                    >
                                        <XIcon />
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="login-spinner">
                                    </div>
                                ) : (
                                    <>
                                        <div className="input-container">
                                            <h3 className="light-blue">Account Information.</h3>
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
                                                                </div> <img src={image} className="preview-image" />
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

                                                <button
                                                    className="contact__submit"
                                                    onClick={(e) => updateUser(e)}
                                                    type="submit"
                                                >
                                                    Update
                                                </button>

                                            </form>

                                        </div>
                                    </>

                                )}
                            </div>
                        </div>
                    </div>
                </Modal>{" "}
            </>
        </>
    );
};

export default AccountInfo;