import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { USER_LOGIN_URL } from 'config/Constants.js';
import { isLoggedIn } from 'service/Authentication.js';
import WebLayout from 'layouts/WebLayout';


const PrivateRoute = ({ component: Component, layout: Layout = WebLayout, ...rest }) => (
    <Route {...rest} path={process.env.PUBLIC_URL + rest.path} render={props => {
        let destination = USER_LOGIN_URL

        if (!isLoggedIn()) {
            return <Redirect to={{
                pathname: destination,
                state: { from: props.location }
            }}
            />
        }

        if (Layout) {
            return (
                <div>
                    <Layout {...props} {...rest} >
                        <Component {...props} />
                    </Layout>
                </div>
            )
        }

        return <Component {...props} />
    }} />
)

export default PrivateRoute