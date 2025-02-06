import { useEffect, useState } from "react";
import axios from "axios";
import CampModal from "../modals/CampModal";
import RingSpinner from "../RingSpinner";

export default function CampRegistration() {
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch Registrations
    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data } = await axios.get("/api/camp/register");
            setRegistrations(data);
        } catch (error) {
            console.error("Error fetching registrations:", error);
        }
    };

    // Open Modal
    const handleRegistrationClick = (registration) => {
        setSelectedRegistration(registration);
        setModalVisible(true);
    };

    // Close Modal
    const closeModal = () => {
        setModalVisible(false);
        setSelectedRegistration(null);
    };

    return (
        <div className='managemembers-container'>
            {loading ? <RingSpinner />  
            : <table className='managemembers-table'>
                <thead>
                    <tr className='managemembers-table-thead-row'>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map((reg) => (
                        <tr key={reg._id} className="managemembers-table-tbody-row">
                            <td>{reg.childName}</td>
                            <td>{reg.childAge}</td>
                            <td>{reg.email}</td>
                            <td>{reg.phone}</td>
                            <td>
                                <button className="orange-btn camp-edit" onClick={() => handleRegistrationClick(reg)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}

            {/* Open modal when registration is selected */}
            {modalVisible && (
                <CampModal
                    registration={selectedRegistration}
                    onClose={closeModal}
                    refresh={fetchRegistrations}
                />
            )}
        </div>
    );
}
