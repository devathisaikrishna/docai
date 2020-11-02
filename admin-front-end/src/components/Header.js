import React from "react";
import { userInfo } from "service/Authentication";
import { useDispatch } from "react-redux";
import { logout } from "actions/AuthActions";
import { APPLICATION_NAME } from "config/Constants.js";
import { Link } from "react-router-dom";


function Header() {
	const dispatch = useDispatch();

	const logoutSubmit = (e) => {
		e.preventDefault();
		dispatch(logout());
	};

	var user = userInfo();
	return (
		<>
			<nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
				<div className="navbar-brand-wrapper d-flex align-items-center">
					<a className="navbar-brand brand-logo" href="/dashboard">
						<img src={process.env.PUBLIC_URL + "/admin/images/logo.svg"} alt="logo" className="logo-dark" />
					</a>
					<a className="navbar-brand brand-logo-mini" href="/dashboard">
						<img src={process.env.PUBLIC_URL + "/admin/images/logo-mini.svg"} alt="logo" />
					</a>
				</div>
				<div className="navbar-menu-wrapper d-flex align-items-center flex-grow-1">
					<h5 className="mb-0 font-weight-medium d-none d-lg-flex">Welcome {APPLICATION_NAME}!</h5>
					<ul className="navbar-nav navbar-nav-right ml-auto">
						<form className="search-form d-none d-md-block" action="#">
							<i className="icon-magnifier"></i>
							<input type="search" className="form-control" placeholder="Search Here" title="Search here" />
						</form>

						{/* <li className="nav-item dropdown">
							<a className="nav-link count-indicator message-dropdown" id="messageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
								<i className="icon-speech"></i>
								<span className="count">7</span>
							</a>
							<div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="messageDropdown">
								<a className="dropdown-item py-3">
									<p className="mb-0 font-weight-medium float-left">You have 7 unread mails </p>
									<span className="badge badge-pill badge-primary float-right">View all</span>
								</a>
								<div className="dropdown-divider"></div>

								<a className="dropdown-item preview-item">
									<div className="preview-thumbnail">
										<img src={process.env.PUBLIC_URL + "/admin/images/faces/face10.jpg"} alt="image" className="img-sm profile-pic" />
									</div>
									<div className="preview-item-content flex-grow py-2">
										<p className="preview-subject ellipsis font-weight-medium text-dark">Marian Garner </p>
										<p className="font-weight-light small-text"> The meeting is cancelled </p>
									</div>
								</a>
								<a className="dropdown-item preview-item">
									<div className="preview-thumbnail">
										<img src={process.env.PUBLIC_URL + "/admin/images/faces/face12.jpg"} alt="image" className="img-sm profile-pic" />{" "}
									</div>
									<div className="preview-item-content flex-grow py-2">
										<p className="preview-subject ellipsis font-weight-medium text-dark">David Grey </p>
										<p className="font-weight-light small-text"> The meeting is cancelled </p>
									</div>
								</a>
								<a className="dropdown-item preview-item">
									<div className="preview-thumbnail">
										<img src={process.env.PUBLIC_URL + "/admin/images/faces/face1.jpg"} alt="image" className="img-sm profile-pic" />{" "}
									</div>
									<div className="preview-item-content flex-grow py-2">
										<p className="preview-subject ellipsis font-weight-medium text-dark">Travis Jenkins </p>
										<p className="font-weight-light small-text"> The meeting is cancelled </p>
									</div>
								</a>
							</div>
						</li>*/}
						<li className="nav-item dropdown d-none d-xl-inline-flex user-dropdown"> 
							<a className="nav-link dropdown-toggle" id="UserDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
								<img className="img-xs rounded-circle ml-2" src={process.env.PUBLIC_URL + "/admin/images/faces/face8.jpg"} alt="Profile image" />
								<span className="font-weight-normal">{user.fullname}</span>
							</a>
							<div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
								<div className="dropdown-header text-center">
									<img className="img-md rounded-circle" src={process.env.PUBLIC_URL + "/admin/images/faces/face8.jpg"} alt="Profile image" />
									<p className="mb-1 mt-3">{user.fullname}</p>
									<p className="font-weight-light text-muted mb-0">{user.email}</p>
								</div>
								<Link to={process.env.PUBLIC_URL + "/admin/profile"} className="dropdown-item">
									<i className="dropdown-item-icon icon-user text-primary"></i> My Profile
								</Link>
								<Link to={process.env.PUBLIC_URL + "/admin/update_password"} className="dropdown-item">
									<i className="dropdown-item-icon icon-speech text-primary"></i> Update Password
								</Link>
								{/* <a href={process.env.PUBLIC_URL + "/admin/profile"} className="dropdown-item">
									<i className="dropdown-item-icon icon-user text-primary"></i> My Profile <span className="badge badge-pill badge-danger">1</span>
								</a> 
								<a href={process.env.PUBLIC_URL + "/admin/update_password"} className="dropdown-item">
									<i className="dropdown-item-icon icon-speech text-primary"></i> Update Password
								</a>*/}
								<a onClick={logoutSubmit} className="dropdown-item">
									<i className="dropdown-item-icon icon-power text-primary"></i>Sign Out
								</a>
							</div>
						</li>
					</ul>
					<button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
						<span className="icon-menu"></span>
					</button>
				</div>
			</nav>
		</>
	);
}

export default Header;
