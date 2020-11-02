import React from 'react';
import {
    Nav,
    NavItem,
    Navbar,
    NavbarBrand,
    Collapse,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu
} from 'reactstrap';
import { Link } from "react-router-dom";
import profilephoto from 'assets/images/users/1.jpg';
import { useDispatch } from "react-redux";
import { logout } from "actions/AuthActions";
import { userInfo } from "service/Authentication";

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logodarkicon from 'assets/images/logo.png';

const Header = () => {
    const user_info = userInfo();
    const dispatch = useDispatch();

    const logoutSubmit = (e) => {
        e.preventDefault();
        dispatch(logout());
    };

    /*--------------------------------------------------------------------------------*/
    /*To open SIDEBAR-MENU in MOBILE VIEW                                             */
    /*--------------------------------------------------------------------------------*/
    const showMobilemenu = () => {
        document.getElementById('main-wrapper').classList.toggle('show-sidebar');
    }

    return (
        <header className="topbar navbarbg" data-navbarbg="skin1">
            <Navbar className="top-navbar" dark expand="md">
                <div className="navbar-header" id="logobg" data-logobg="skin6">
                    {/*--------------------------------------------------------------------------------*/}
                    {/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
                    {/*--------------------------------------------------------------------------------*/}
                    <NavbarBrand tag={Link} to="/">
                        <div className="logo-icon-main">
                            <img src={logodarkicon} style={{ "height": "50px" }} alt="homepage" className="dark-logo" />

                        </div>
                    </NavbarBrand>
                    {/*--------------------------------------------------------------------------------*/}
                    {/* Mobile View Toggler  [visible only after 768px screen]                         */}
                    {/*--------------------------------------------------------------------------------*/}
                    <button className="btn-link nav-toggler d-block d-md-none" onClick={() => showMobilemenu()}>
                        <i className="ti-menu ti-close" />
                    </button>
                </div>
                <Collapse className="navbarbg" navbar data-navbarbg="skin1" >
                    <Nav className="ml-auto float-right" navbar>
                        <NavItem>
                        </NavItem>
                        {/*--------------------------------------------------------------------------------*/}
                        {/* Start Profile Dropdown                                                         */}
                        {/*--------------------------------------------------------------------------------*/}
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret className="pro-pic">
                                <img
                                    src={profilephoto}
                                    alt="user"
                                    className="rounded-circle"
                                    width="31"
                                />
                            </DropdownToggle>
                            <DropdownMenu right className="user-dd">
                                <span className="with-arrow"><span className="bg-primary"></span></span>
                                <div className="d-flex no-block align-items-center p-3 bg-primary text-white mb-2">
                                    <div className=""><img src={profilephoto} alt="user" className="rounded-circle" width="60" /></div>
                                    <div className="ml-2">
                                        <h4 className="mb-0">{user_info.fullname}</h4>
                                        <p className=" mb-0">{user_info.email}</p>
                                    </div>
                                </div>
                                <DropdownItem href="/user/profile">
                                    <i className="ti-user mr-1 ml-1" />Update Profile
                                </DropdownItem>
                                <DropdownItem tag={Link} to="/user/update_password">
                                    <i className="ti-wallet mr-1 ml-1" /> Update Password
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={logoutSubmit} >
                                    <i className="fa fa-power-off mr-1 ml-1" /> Logout
                                </DropdownItem>

                            </DropdownMenu>
                        </UncontrolledDropdown>
                        {/*--------------------------------------------------------------------------------*/}
                        {/* End Profile Dropdown                                                           */}
                        {/*--------------------------------------------------------------------------------*/}
                    </Nav>
                </Collapse>
            </Navbar>
        </header>
    );
}
export default Header;
