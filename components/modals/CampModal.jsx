import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";

function CampModal({ registration, onClose, refresh }) {
    const [formData, setFormData] = useState(registration);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.put("/api/camp/register", { ...formData, id: formData._id });
            toast.success("Registration updated successfully!");
            refresh();
            onClose();
        } catch (error) {
            toast.error("Failed to update registration");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this registration?")) return;
        setLoading(true);
        try {
            await axios.delete("/api/camp/register", { data: { id: formData._id } });
            toast.success("Registration deleted successfully!");
            refresh();
            onClose();
        } catch (error) {
            toast.error("Failed to delete registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box camp-modal">
                <button className="camp-close-button" onClick={onClose}>X</button>

                {/* Compact Form Layout */}
                <div className="form-compact">
                    <div className="form-group">
                        <label>Childs Name</label>
                        <input type="text" name="childName" value={formData.childName} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <div className="form-group small">
                            <label>Age</label>
                            <input type="number" name="childAge" value={formData.childAge} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Allergies</label>
                            <input type="text" name="childAllergies" value={formData.childAllergies} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group small">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="Street Address" />
                        <div className="form-row">
                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                        </div>
                        <div className="form-row">
                            <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip" />
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="form-group checkbox">
                        <label>
                            <div className='campmodel-checkbox-grouping'>
                            <input type="checkbox" name="permission" checked={formData.permission} onChange={handleChange} />
                            Permission to Attend
                            </div>
                        </label>
                        <label>
                            <div className='campmodel-checkbox-grouping'>
                            <input type="checkbox" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} />
                            Marketing Consent
                            </div>
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div className='modal-btn-container'>
                            <div> 
                                <button type="submit" className='modal-camp-blue' disabled={loading}>
                                    Save Changes
                                </button>
                                </div>
                                <div>
                                <button type="button" className='modal-camp-red' onClick={handleDelete}>
                                    Remove Member
                                </button>
                                </div>
                </div>
            </div>
        </div>
    );
}

export default CampModal;
