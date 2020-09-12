import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
    return (
        <nav>
            <div className="nav-wrapper">
                <Link to="/" className="brand-logo color-text">Logo</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><Link to="/signin" className="color-text">Sign In</Link></li>
                    <li><Link to="/signup" className="color-text">Sign Up</Link></li>
                </ul>
            </div>
        </nav>
    )
}
export default Navbar