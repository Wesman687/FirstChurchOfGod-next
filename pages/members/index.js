'use client';

import Layout from '@/components/Layout';
import CampRegistration from '@/components/members/CampRegistration';
import HomeComment from '@/components/members/HomeComment';
import ManageMembers from '@/components/members/ManageMembers';
import MyPrayerRequest from '@/components/members/MyPrayerRequest';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Members() {
    const user = useSelector((state) => state.user);
    const [activeSection, setActiveSection] = useState("testimonial");

    const sections = {
        testimonial: <HomeComment />,
        manageMembers: <ManageMembers />,
        prayerRequest: <MyPrayerRequest />,
        campRegistration: <CampRegistration />,
    };

    const buttons = [
        { key: "testimonial", label: "Testimonial" },
        { key: "manageMembers", label: user.isAdmin ? "Manage Members" : "Show Members" },
        { key: "prayerRequest", label: "My Prayer Request" },
        { key: "campRegistration", label: "Camp Registration" },
    ];


    return (
        <Layout>
            <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
                <div className="top_panel_title_inner top_panel_inner_style_3 about-us-header">
                    <div className="content_wrap">
                        <h1 className="page_title about-header">Members Area</h1>
                    </div>
                </div>
            </div>

            {/* ✅ Responsive Toolbar */}
            <div className="manage-buttons-container members-toolbar">
                <div>
                    {buttons.map(({ key, label }) => (
                        <label
                            key={key}
                            className={`manage-filters-label ${
                                activeSection === key ? "manage-members-active" : ""
                            }`}
                            onClick={() => setActiveSection(key)}
                        >
                            {label}
                        </label>
                    ))}
                </div>
            </div>

            {/* ✅ Render active section */}
            <div className="responsive-section">
                {sections[activeSection]}
            </div>
        </Layout>
    );
}

export default Members;
