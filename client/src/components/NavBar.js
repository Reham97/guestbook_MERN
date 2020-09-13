import React, { useContext } from 'react'
import {Link ,useHistory} from 'react-router-dom'
import { UserContext } from '../App'
const Navbar = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)
    
    const renderList = () => {
        console.log(state)
        if (state) {
            return [
                <li><Link to="/createevent" className="color-text">Create Event</Link></li>,
                <li>
                    <button className="btn #c62828 blue darken-4"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push('/signin')
                        }}
                    >
                        Logout
            </button>
                </li>
            ]
        }
        else {
            return [
                <li><Link to="/signin" className="color-text">Sign In</Link></li>,
                <li><Link to="/signup" className="color-text">Sign Up</Link></li>

            ]
        }
    }
    return (

        <nav>
            <div className="nav-wrapper">
                <Link to={state ? "/" : "signin"} className="brand-logo" >
                    <img src="http://res.cloudinary.com/software1997/image/upload/v1599995809/date8bivdx6tibh5bvsb.webp" width="100px" height="60px"/>
                </Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}
export default Navbar