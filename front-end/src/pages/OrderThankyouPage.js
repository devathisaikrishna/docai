import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';

function OrderThankyouPage(props) {
    const { order } = props.location.state ?? { order: {} };
    console.log(props.location.state);

    return (
        <div>
            {!order.subcription_id && <Redirect to="/user/purchase_plan" />}

            <main id="main">
                {/* <!-- ======= Breadcrumbs ======= --> */}
                <section id="breadcrumbs" className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Checkout</li>
                        </ol>
                        <h2>Checkout</h2>
                    </div>
                </section>
                {/* <!-- End Breadcrumbs --> */}

                <section className="profile_sec">
                    <div className="container">

                        <div className="jumbotron text-center">
                            <h1 className="display-3">Thank You!</h1>
                            <p className="lead"><strong>Your SUBSRIPTION ID is #{order.subcription_id}</strong></p>
                            <p className="lead"><strong>To start your subscription </strong>please check your email or Phone <br />for further instructions on how to complete payment process of subscription.</p>

                            <p className="lead">If you did not receive any email or message<br />Please <a target="_blank" href={order.subscription_link}>click here </a> to start subscription.</p>
                            <p className="lead">If you’re having trouble clicking the "click here" button, copy and paste the <br />URL below into your web browser</p>
                            {order.subscription_link}
                            
                            <hr />
                            <p>
                                Having trouble? <Link to="/contact">Contact us</Link>
                            </p>
                            <p className="lead">
                                <Link className="btn btn-primary btn-sm" to="/" role="button">Continue to Homepage</Link>
                            </p>
                        </div>
                    </div>

                </section>
            </main>
            {/* <!-- End #main --> */}

        </div>
    );
}

export default OrderThankyouPage;
