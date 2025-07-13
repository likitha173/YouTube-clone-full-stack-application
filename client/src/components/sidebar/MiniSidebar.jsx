import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaUserCircle
} from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary, MdOutlineSmartDisplay } from "react-icons/md";
import "./mini-sidebar.css";

export default function MiniSidebar() {
    const { state } = useContext(AppContext);
    const authUser = state?.auth;

    // Don't render mini sidebar if main sidebar is active
    if (state?.onMenu) {
        return null;
    }

    return (
        <div className={`mini-sidebar ${state?.theme}`}>
            <div className="mini-sidebar-wrapper">
                {/* Main navigation */}
                <NavLink to="/" className="mini-sidebar-item">
                    <FaHome className="mini-sidebar-icon" />
                    <span className="mini-sidebar-label">Home</span>
                </NavLink>

                <NavLink to="/shorts" className="mini-sidebar-item">
                    <MdOutlineSmartDisplay className="mini-sidebar-icon" />
                    <span className="mini-sidebar-label">Shorts</span>
                </NavLink>

                <NavLink to="/subscriptions" className="mini-sidebar-item">
                    <MdSubscriptions className="mini-sidebar-icon" />
                    <span className="mini-sidebar-label">Subscriptions</span>
                </NavLink>

                <NavLink to="/library" className="mini-sidebar-item">
                    <MdVideoLibrary className="mini-sidebar-icon" />
                    <span className="mini-sidebar-label">You</span>
                </NavLink>
            </div>
        </div>
    );
}
