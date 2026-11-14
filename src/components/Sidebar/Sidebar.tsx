
import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    CalendarDays,
    ClipboardList,
    Users,
    Award,
    Settings,
    Menu,
    X,
} from "lucide-react";

import type { UserRole } from "../../types/role.types";

interface SidebarProps {
    role: UserRole;
}

const Sidebar = ({ role }: SidebarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = {
        student: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
            { label: "My Badges", icon: Award, path: "/student/badges" },
            { label: "Book Interview", icon: CalendarDays, path: "/student/book-interview" },
            { label: "My Interviews", icon: ClipboardList, path: "/student/interviews" },
        ],
        interviewer: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/interviewer/dashboard" },
            { label: "Availability", icon: CalendarDays, path: "/interviewer/availability" },
            { label: "Daily Schedule", icon: ClipboardList, path: "/interviewer/schedule" },
        ],
        admin: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
            { label: "Eligible Students", icon: Users, path: "/admin/students" },
            { label: "Interviews", icon: ClipboardList, path: "/admin/interviews" },
            { label: "Badge Management", icon: Award, path: "/admin/badges" },
        ],
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="brand">
                    <span className="brand-icon">G</span>
                    <span>GRIT Hub</span>
                </div>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
            </div>

            <div className={`sidebar-menu ${isMenuOpen ? "open" : ""}`}>
                <p className="sidebar-label">WORKSPACE</p>

                <nav>
                    {menuItems[role].map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? "active" : ""}`
                                }
                                key={item.label}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-bottom">
                    <Settings size={19} />
                    <span>Settings</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
