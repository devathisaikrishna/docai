import React from 'react';
import { Route, Redirect} from 'react-router-dom';
import {  LOGIN_URL } from 'config/Constants.js';
import { isLoggedIn } from 'service/Authentication.js';
import DashboardLayout from 'layouts/DashboardLayout';

const PrivateRoute = ({component: Component, layout: Layout = DashboardLayout, layoutClassName = null, ...rest}) => (
    <Route {...rest} path={process.env.PUBLIC_URL + rest.path} render={props => {
        let destination = LOGIN_URL

        if (!isLoggedIn()) {
            return <Redirect to={{
                pathname: destination, 
                state: {from: props.location}}} 
            />
        }

        if (Layout) {
            return (
                <Layout {...props} className={layoutClassName}>
                    <Component {...props} />
                </Layout>
            )
        }

        return <Component {...props} />
    }}/>
)

export default PrivateRoute