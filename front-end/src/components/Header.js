import React from "react";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { logout } from "actions/AuthActions";
import { APPLICATION_NAME } from "config/Constants.js";
import { isLoggedIn } from "service/Authentication.js";

function Header(props) {
	const dispatch = useDispatch();

	const logoutSubmit = (e) => {
		e.preventDefault();
		dispatch(logout());
	};

	const { page } = props;
	return (
		<>
			<header id="header" className={"fixed-top " + (page === "home" ? "" : "header-inner-pages")}>
				<div className={(props.account_layout ? "container-fluid" : "container") + " d-flex align-items-center"}>
					<h1 className="logo mr-auto">
						<Link to="/">{APPLICATION_NAME}</Link>
					</h1>
					{/* <!-- Uncomment below if you prefer to use an image logo --> */}
					{/* <!-- <a href="index.html" className="logo mr-auto"><img src="assets/img/logo.png" alt="" className="img-fluid"></a>--> */}

					<nav className="nav-menu d-none d-lg-block">
						<ul>
							<li className={page === "home" ? "active" : ""}>
								<Link to="/">Home</Link>
							</li>
							<li className={page === "about" ? "active" : ""}>
								<Link to="/about">About</Link>
							</li>
							<li className={page === "contact" ? "active" : ""}>
								<Link to="/contact">Contact</Link>
							</li>
							{!isLoggedIn() ? (
								<li className={page === "login" ? "active" : ""}>
									<Link to="/login">Login</Link>
								</li>
							) : (
									<>
										<li className={page === "user" ? "active" : ""}>
											<Link to="/user/profile">Account</Link>
										</li>
										<li className={page === "logout" ? "active" : ""}>
											<a href="#" onClick={logoutSubmit}>
												Logout
										</a>
										</li>
									</>
								)}
						</ul>
					</nav>
					{/* <!-- .nav-menu --> */}

					{/* <!--<a href="#about" className="get-started-btn scrollto">Get Started</a>--> */}
				</div>
			</header>
		</>
	);
}

export default Header;
