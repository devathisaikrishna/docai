import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "service/jquery.validate.js";

import "service/custom_script.js";
import "App.css";
import "react-datepicker/dist/react-datepicker.css";


import { ToastContainer } from "react-toastify";

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { useSelector } from "react-redux";

import PageNotFound from "PageNotFound.js";
import Login from "pages/LoginPage.js";
import DashboardPage from "pages/DashboardPage";
import ProfilePage from "pages/ProfilePage";
import UpdatePassword from "pages/UpdatePassword";

import UsersListingPage from "pages/UsersListingPage";
import ApiKeyRequestListingPage from "pages/ApiKeyRequestListingPage";
import AdminRegister from "pages/AdminRegistration";
import PlanListingPage from "pages/PlanListingPage";
import CreatePlanPage from "pages/CreatePlanPage";

import LoginLayout from "layouts/LoginLayout";

import PrivateRoute from "service/PrivateRoute";
import { isLoggedIn } from "service/Authentication.js";

import PublicRoute from "service/PublicRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminUserListPage from "./pages/AdminUserListPage";
import AdminUserEditPage from "./pages/AdminUserEditPage";
import CouponsListingPage from "./pages/coupon/index";
import AddCouponPage from "./pages/coupon/create";
import EditCouponPage from "./pages/coupon/edit";
import ShowCouponPage from "./pages/coupon/show";
import UserPlanSubscriptionsPage from './pages/UserPlanSubscriptionsPage';
import UserPlanSubscriptionViewPage from './pages/UserPlanSubscriptionViewPage';
import UserPlanSubscriptionPaymentDetailPage from './pages/UserPlanSubscriptionPaymentDetailPage';

function App() {

	return (
			<Router basename={process.env.PUBLIC_URL}>
				<Switch>
					<Route
						exact
						path="/"
						render={(props) =>
							!isLoggedIn() ? (
								<LoginLayout {...props}>
									<Login {...props} />
								</LoginLayout>
							) : (
									<Redirect to={{ pathname: "/dashboard", state: { from: props.location } }} />
								)
						}
					/>

					<Route
						exact
						path="/admin/forgot_password"
						render={(props) =>
							!isLoggedIn() ? (
								<LoginLayout {...props}>
									<ForgotPasswordPage {...props} />
								</LoginLayout>
							) : (
									<Redirect to={{ pathname: "/dashboard", state: { from: props.location } }} />
								)
						}
					/>
					<Route
						exact
						path="/admin/reset_password"
						render={(props) =>
							!isLoggedIn() ? (
								<LoginLayout {...props}>
									<ResetPasswordPage {...props} />
								</LoginLayout>
							) : (
									<Redirect to={{ pathname: "/dashboard", state: { from: props.location } }} />
								)
						}
					/>

					<PrivateRoute exact path="/dashboard" component={DashboardPage} />
					<PrivateRoute exact path="/admin/profile" component={ProfilePage} />
					<PrivateRoute exact path="/admin/update_password" component={UpdatePassword} />

					<PrivateRoute exact path="/admin/users" component={UsersListingPage} />
					<PrivateRoute exact path="/admin/admin_user_list" component={AdminUserListPage} />
					<PrivateRoute exact path="/admin/key_request" component={ApiKeyRequestListingPage} />
					<PrivateRoute exact path="/admin/register_admin" component={AdminRegister} />
					<PrivateRoute exact path="/admin/admin_user_edit/:id" component={AdminUserEditPage} />
					<PrivateRoute exact path="/admin/plans" component={PlanListingPage} />
					<PrivateRoute exact path="/admin/plans/create" component={CreatePlanPage} />
					<PrivateRoute exact path="/admin/plans/:id" component={CreatePlanPage} />
					<PrivateRoute exact path="/admin/coupons" component={CouponsListingPage} />
					<PrivateRoute exact path="/admin/add_coupon" component={AddCouponPage} />
					<PrivateRoute exact path="/admin/coupon/:couponId/edit" component={EditCouponPage} />
					<PrivateRoute exact path="/admin/coupon/:couponId/show" component={ShowCouponPage} />
					<PrivateRoute exact path='/admin/user_plan_subscriptions' component={UserPlanSubscriptionsPage} />
					<PrivateRoute exact path='/admin/user_plan_subscription/:id' component={UserPlanSubscriptionViewPage} />
					<PrivateRoute exact path='/admin/payment_detail/:payment_id' component={UserPlanSubscriptionPaymentDetailPage} />

					<PublicRoute path="*" component={PageNotFound} layout={""} />
				</Switch>

				<ToastContainer />
			</Router>
	);
}

export default App;
