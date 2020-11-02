import React from "react";
import WebLayout from "layouts/WebLayout";
import { Route } from "react-router-dom";

const PublicRoute = ({ component: Component, layout: Layout = WebLayout, ...rest }) => (
	<Route
		{...rest}
		path={process.env.PUBLIC_URL + rest.path}
		render={(props) => {
			if (Layout) {
				return (
					<Layout>
						<Component {...props} />
					</Layout>
				);
			}

			return <Component {...props} />;
		}}
	/>
);

export default PublicRoute;
