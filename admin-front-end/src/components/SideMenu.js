import React from "react";
import { Link } from "react-router-dom";
import { userInfo } from "service/Authentication";

function SideMenu(props) {
	var user = userInfo();
	return (
		<>
			<nav className="sidebar sidebar-offcanvas" id="sidebar">
				<ul className="nav">
					<li className="nav-item nav-profile">
						<a href="#" className="nav-link">
							<div className="profile-image">
								<img className="img-xs rounded-circle" src={process.env.PUBLIC_URL + "/admin/images/faces/face8.jpg"} alt="profile image" />
								<div className="dot-indicator bg-success"></div>
							</div>
							<div className="text-wrapper">
								<p className="profile-name">{user.fullname}</p>
								<p className="designation">Administrator</p>
							</div>
							<div className="icon-container">
								<i className="icon-bubbles"></i>
								<div className="dot-indicator bg-danger"></div>
							</div>
						</a>
					</li>
					<li className="nav-item nav-category">
						<span className="nav-link">Dashboard</span>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/dashboard">
							<span className="menu-title">Dashboard</span>
							<i className="icon-screen-desktop menu-icon"></i>
						</Link>
					</li>
					<li className="nav-item nav-category">
						<span className="nav-link">Users</span>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/admin/users">
							<span className="menu-title">Users</span>
							<i className="icon-people menu-icon"></i>
						</Link>
						{user.is_super_admin == 1 ? (
							<Link className="nav-link" to="/admin/admin_user_list">
								<span className="menu-title">Admin Users</span>
								<i className="icon-layers menu-icon"></i>
							</Link>
						) : null}
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/admin/key_request">
							<span className="menu-title">Key Approval</span>
							<i className="icon-globe menu-icon"></i>
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/admin/plans">
							<span className="menu-title">Plans</span>
							<i className="icon ocr-ios-lightbulb-outline menu-icon"></i>
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/admin/coupons">
							<span className="menu-title">Coupons</span>
							<i className="icon ocr-ios-lightbulb-outline menu-icon"></i>
						</Link>
					</li>
					<li className="nav-item">
                        <Link className="nav-link" to="/admin/user_plan_subscriptions">
                            <span className="menu-title">User Plan Subscriptions</span>
                            <i className="icon ocr-ios-lightbulb-outline menu-icon"></i>
                        </Link>
                    </li>
				</ul>
			</nav>
		</>
	);
}

export default SideMenu;
