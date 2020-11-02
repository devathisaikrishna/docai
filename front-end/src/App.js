import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "service/jquery.validate.js";
import { isLoggedIn } from "service/Authentication.js";
import "service/custom_script.js";
import "App.css";
import "react-datepicker/dist/react-datepicker.css";

import DashboardPage from "pages/DashboardPage.js";
import PageNotFound from "./PageNotFound.js";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";
import ContactPage from "pages/ContactPage";
import RegisterPage from "pages/RegisterPage";
import LoginPage from "pages/LoginPage";
import ForgotPasswordPage from "pages/ForgotPasswordPage";
import WebLayout from "layouts/WebLayout";
import CheckoutPage from "pages/CheckoutPage";
import OrderThankyouPage from "pages/OrderThankyouPage";
import UserProfilePage from "pages/UserProfilePage";
import UpdatePasword from "pages/UpdatePasword";
import EmailVerificationPage from "pages/EmailVerificationPage";
import ResetPasswordPage from "pages/ResetPasswordPage";
import ApiKeyPage from "pages/ApiKeyPage";
import AccountLayout from "layouts/AccountLayout";
import ProjectsListingPage from "pages/project/index";
import CreateProject from "pages/project/create";
import EditProject from "pages/project/edit";
import ShowProject from "pages/project/show";
import PrivateRoute from "service/PrivateRoute";
import PublicRoute from "service/PublicRoute";
import ReportsPage from "pages/ReportsPage";
import CurrentPlanPage from "pages/CurrentPlanPage";
import PurchasePlansPage from "pages/PurchasePlansPage";
import ApiLogsPage from "pages/ApiLogsPage";
import ApiLogDetailsPage from "pages/ApiLogDetailsPage";

import { ToastContainer } from "react-toastify";

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { useSelector } from "react-redux";

function App() {

	const isBlockUI = useSelector((state) => state.UserReducers.BlockUIReducers.loading);

	return (
		<BlockUi tag="div" blocking={isBlockUI} >
			<Router basename={process.env.PUBLIC_URL}>
				<Switch>
					<PublicRoute exact path="/" component={HomePage} Layout={WebLayout} />
					<PublicRoute exact path="/about" component={AboutPage} Layout={WebLayout} />
					<PublicRoute exact path="/contact" component={ContactPage} Layout={WebLayout} />

					<Route
						exact
						path="/register"
						render={(props) =>
							!isLoggedIn() ? (
								<WebLayout {...props}>
									<RegisterPage {...props} />
								</WebLayout>
							) : (
									<Redirect to={{ pathname: "/user/profile", state: { from: props.location } }} />
								)
						}
					/>

					<Route
						exact
						path="/login"
						render={(props) =>
							!isLoggedIn() ? (
								<WebLayout {...props}>
									<LoginPage {...props} />
								</WebLayout>
							) : (
									<Redirect to={{ pathname: "/user/profile", state: { from: props.location } }} />
								)
						}
					/>

					<Route
						exact
						path="/forgot_password"
						render={(props) =>
							!isLoggedIn() ? (
								<WebLayout {...props}>
									<ForgotPasswordPage {...props} />
								</WebLayout>
							) : (
									<Redirect to={{ pathname: "/user/profile", state: { from: props.location } }} />
								)
						}
					/>

		
					<PublicRoute exact path="/user/verify-email" component={EmailVerificationPage} />
					<PublicRoute exact path="/user/reset_password" component={ResetPasswordPage} />

					<PrivateRoute exact path="/dashboard" layout={AccountLayout} component={DashboardPage} />
					<PrivateRoute exact path="/user/profile" layout={AccountLayout} component={UserProfilePage} />
					<PrivateRoute exact path="/user/update_password" layout={AccountLayout} component={UpdatePasword} />
					<PrivateRoute exact path="/user/reports" layout={AccountLayout} component={ReportsPage} />
					<PrivateRoute exact path="/user/api_key" layout={AccountLayout} component={ApiKeyPage} />
					<PrivateRoute exact path="/user/projects_listing" layout={AccountLayout} component={ProjectsListingPage} />
					<PrivateRoute exact path="/user/add_project" layout={AccountLayout} component={CreateProject} />
					<PrivateRoute exact path="/user/project/:projectId/edit" layout={AccountLayout} component={EditProject} />
					<PrivateRoute exact path="/user/project/:projectId/show" layout={AccountLayout} component={ShowProject} />
					<PrivateRoute exact path="/user/current_plan" layout={AccountLayout} component={CurrentPlanPage} />
					<PrivateRoute exact path="/user/purchase_plan" layout={AccountLayout} component={PurchasePlansPage} />
					<PrivateRoute exact path="/user/api_log" layout={AccountLayout} component={ApiLogsPage} />
					<PrivateRoute exact path="/user/api_log/:logId" layout={AccountLayout} component={ApiLogDetailsPage} />

					<PrivateRoute path="/checkout" component={CheckoutPage} smallFooter={true} />
					<PrivateRoute path="/order" component={OrderThankyouPage} smallFooter={true} />

					<PublicRoute path="*" component={PageNotFound} layout={""} />
				</Switch>

				<ToastContainer />
			</Router>
		</BlockUi>
	);
}

export default App;
