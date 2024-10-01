import React, { useState, useRef } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { useSelector } from 'react-redux';
import RingSpinner from '../RingSpinner';
import Image from 'next/image';
import upload from '@/images/upload_area.png';
import ArrowUturnLeftIcon from '../icons/ArrowUturnLeftIcon';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModel';

function MemberModal({ member, onClose }) {
    const [firstName, setFirstName] = useState(member.firstName);
    const [lastName, setLastName] = useState(member.lastName);
    const [email, setEmail] = useState(member.email);
    const [phone, setPhone] = useState(member.phone);
    const [isMember, setIsMember] = useState(member.isMember || false);
    const [isAdmin, setIsAdmin] = useState(member.isAdmin || false);
    const [isSuper, setIsSuper] = useState(member.isSuper || false);
    const [image, setImage] = useState(member.photoUrl || null);
    const [newImage, setNewImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // State for showing the confirmation modal
    const filePickerRef = useRef(null);
    const user = useSelector(state => state.user);

    function addImage(e) {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.addEventListener('load', (e) => {
            setImage(e.target.result);
        });
        setNewImage(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(firstName, lastName, email, phone, isMember, isAdmin, isSuper, newImage, member.photoUrl, image)
        try {
            const memberRef = doc(db, 'user', member.userRef); 

            let downloadURL = member.photoUrl;
            if (image && newImage) {
                const imageRef = ref(storage, `photos/${member.uid}`);
                await uploadString(imageRef, image, 'data_url');
                downloadURL = await getDownloadURL(imageRef);
            }

            await updateDoc(memberRef, {
                firstName,
                lastName,
                email,
                phone,
                isMember,
                isAdmin,
                isSuper,
                photoUrl: downloadURL,
            });

            toast.success('Member updated successfully');
            onClose();
        } catch (error) {
            console.error('Error updating member:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const memberRef = doc(db, 'user', member.userRef);
            await deleteDoc(memberRef);
            toast.success('Member removed successfully');
            onClose(); // Close modal after deletion
        } catch (error) {
            console.error('Error removing member:', error);
            toast.error('Failed to remove member');
        } finally {
            setLoading(false);
        }
    };

    const confirmRemoveMember = () => {
        setShowConfirm(true);
    };

    const cancelDelete = () => {
        setShowConfirm(false); // Hide the confirmation modal
    };
    const handleMember = (checked) => {
        if (member.isAdmin) {
            toast.warning('Must Remove Admin Status First')
            return
        }
        setIsMember(checked)
    }
    const handleAdmin = (checked) => {
        if (member.isSuper) {
            toast.warning('Must Remove Super Status First')
            return
        }
        setIsAdmin(checked)
    }

    return (
        <div className='modal-overlay'>
            <div className='modal-box'>
                <button className='close-button' onClick={onClose}>X</button>
                <h3>Edit Member: {firstName} {lastName}</h3>

                <form onSubmit={handleSubmit}>
                    <div className='member-modal-photo-wrapper'>
                        {image ? (
                            <div className="account-image-preview">
                                <div className='member-modal-preview' onClick={() => setImage(null)}>
                                    <img src={image} className="preview-image modal-image" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="input-photourl" onClick={() => filePickerRef.current.click()}>
                                    <Image src={upload} className="input-upload-image" alt="upload" />
                                    <input
                                        onChange={addImage}
                                        ref={filePickerRef}
                                        className="hidden"
                                        type="file"
                                    />
                                </div>
                                <div className='member-modal-uturn' onClick={() => setImage(member.photoUrl)}>
                                    <ArrowUturnLeftIcon classes={'green'} />
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Member:</label>
                        <input
                            type="checkbox"
                            checked={isMember}
                            onChange={(e) => handleMember(e.target.checked)}
                        />
                    </div>
                    {user.isSuper && (
                        <div>
                            <label>Admin:</label>
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => handleAdmin(e.target.checked)}
                            />
                        </div>
                    )}
                    {user.isSuperSuper && (
                        <div>
                            <label>Super Admin:</label>
                            <input
                                type="checkbox"
                                checked={isSuper}
                                onChange={(e) => setIsSuper(e.target.checked)}
                            />
                        </div>
                    )}

                    <div className='member-modal-button-wrapper'>
                        {!loading ? (
                            <>
                                <div>
                                <button type="submit" className='outline-button-transparent' disabled={loading}>
                                    Save Changes
                                </button>
                                </div>
                                <div>
                                <button type="button" className='red-button' onClick={confirmRemoveMember}>
                                    Remove Member
                                </button>
                                </div>
                            </>
                        ) : (
                            <RingSpinner colorChange={'#05a305'} />
                        )}
                    </div>
                </form>
            </div>

            {/* Show confirmation modal if triggered */}
            {showConfirm && (
                <ConfirmationModal
                    title="Confirm Removal"
                    message={`Are you sure you want to remove ${firstName} ${lastName}?`}
                    onConfirm={handleDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}

export default MemberModal;
