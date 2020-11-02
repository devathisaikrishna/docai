import React from "react";
import { Route } from "react-router-dom";

const PublicRoute = ({ component: Component, layout: Layout = '', ...rest }) => (
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
