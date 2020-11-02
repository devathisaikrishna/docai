import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "service/Common";
import { CURRENCY_ICON, APPLICATION_NAME } from "config/Constants";
import { get_cart, get_country_list, clean_cart } from "actions/CartActions";
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastMessage } from "service/ToastMessage";

function CheckoutPage(props) {
    const dispatch = useDispatch();
    const CartReducers = useSelector((state) => state.UserReducers.CartReducers);
    const { countries, sub_total, gst, total } = CartReducers;
    const cart_plan = CartReducers.plan;
    const cart_coupon = CartReducers.coupon;

    const [billing_address, setBillingAddress] = useState({ firstname: '', lastname: '', phone: '', address: '', city: '', });
    const [loading, setLoading] = useState(false);
    const [order_details, setOrder_details] = useState({ redirect: false });
    const [coupon, setCoupon] = useState({ coupon_code: "", loading: false });

    const { plan } = props.location.state ?? { plan: {} };

    useEffect(() => {
        dispatch(get_cart(plan));
        dispatch(get_country_list());

        return () => {
            dispatch(clean_cart(plan));
        }
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        $("#checkout_order").validate();

        if ($("#checkout_order").valid()) {
            setLoading(true);
            var req = { ...billing_address, ...plan, coupon_code: coupon.successfullyApplied ? coupon.coupon_code : "" }
            postData("/api/user/order", req).then((response) => {
                setLoading(false);
                let { data } = response;
                // if (data.any_payment_transaction) {
                //     razorpay_payment(data.payment_transaction, data.subscription);
                // } else {
                setOrder_details({ ...data.subscription, redirect: true })
                // }
            }).catch((error) => {
                setLoading(false);
                ToastMessage(error.data.error, "e")
            })
        };

    }

    // we will use in future
    /*const submitRedeemCode = (e) => {
        e.preventDefault();
        $("#redeem_code").validate();

        if ($("#redeem_code").valid()) {
            setCoupon({ ...coupon, loading: true });
            postData("/api/user/redeem_coupon_code", { coupon_code: coupon.coupon_code, ...plan }).then((response) => {
                dispatch(get_cart({ ...plan, coupon_code: coupon.coupon_code }));
                setCoupon({ ...coupon, loading: false, error: '', successfullyApplied: true });
            }).catch((error) => {
                setCoupon({ ...coupon, loading: false, error: error.data.error });
            })
        };

    }*/

    /*const razorpay_payment = (data, subscription) => {

        const options = {
            ...data,
            handler: async (response) => {
                postData("/api/user/save_payment_transaction_response", response).then((res) => {
                    console.log(subscription, "order_details");
                    setOrder_details({ ...subscription, redirect: true })
                    }).catch((error) => {

                    })
                }
            
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }*/

    return (
        <div>
            {order_details.redirect && <Redirect to={{
                pathname: "/order",
                state: { order: order_details }
            }} />}

            {!plan.plan_id && <Redirect to="/user/purchase_plan" />}

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
                        {/* <div className="py-5 text-left">

                            <h2>Checkout </h2>
                            <p className="lead">Below is an example form built entirely with Bootstrap’s form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
                        </div> */}

                        <div className="row">
                            <div className="col-md-4 order-md-2 mb-4">
                                <div className="prof_box mb-0">
                                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-muted">Your cart</span>
                                        <span className="badge badge-secondary badge-pill">{1}</span>
                                    </h4>
                                    <ul className="list-group mb-3">
                                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                                            <div>
                                                <h6 className="my-0">{cart_plan.name}</h6>
                                                <small className="text-muted">{cart_plan.desc}</small>
                                            </div>
                                            <span className="text-muted">{CURRENCY_ICON}{cart_plan.price}</span>
                                        </li>

                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Sub Total</span>
                                            <strong>{CURRENCY_ICON}{sub_total}</strong>
                                        </li>
                                        {cart_coupon.discount_amount &&
                                            <li className="list-group-item d-flex justify-content-between bg-light">
                                                <div className="text-success">
                                                    <h6 className="my-0">{cart_coupon.coupon_code}</h6>
                                                    <small>Coupon discount</small>
                                                </div>
                                                <span className="text-success">-{CURRENCY_ICON}{cart_coupon.discount_amount}</span>
                                            </li>}

                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>GST</span>
                                            <strong>{CURRENCY_ICON}{gst}</strong>
                                        </li>

                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Total (INR)</span>
                                            <strong>{CURRENCY_ICON}{total}</strong>
                                        </li>
                                    </ul>
                                </div>

                                {/* <div className="prof_box " style={{ marginTop: "20px" }}>

                                <form className="card p-2" id="redeem_code">

                                    <div className="">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Promo code"
                                            onChange={(e) => setCoupon({ ...coupon, coupon_code: e.target.value, error: "" })}
                                            value={coupon.coupon_code}
                                            disabled={coupon.successfullyApplied}
                                            required
                                        />
                                        {coupon.error && <div className="error_show_notification" >{coupon.error}</div>}
                                    </div>
                                    <div className="input-group mt-3">
                                        <button type="submit" className="btn btn-secondary w-100" onClick={submitRedeemCode} >{coupon.loading ? "Loading..." : "Redeem"}</button>
                                    </div>
                                </form>
                            </div> */}
                            </div>

                            <div className="col-md-8 order-md-1">
                                <div className="prof_box">
                                    <h4 className="mb-3">Billing address</h4>
                                    <form id="checkout_order"  >
                                        <div className="row">
                                            <div className="col-md-6 mb-3 form-group required">
                                                <label htmlFor="firstName" className="control-label">First name</label>
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    className="form-control"
                                                    id="firstName"
                                                    onChange={(e) => setBillingAddress({ ...billing_address, firstname: e.target.value })}
                                                    placeholder="First name" value={billing_address.firstname || ''}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3 form-group required">
                                                <label htmlFor="lastName" className="control-label">Last name</label>
                                                <input type="text" className="form-control" id="lastName"
                                                    name="lastname"
                                                    placeholder="Last name"
                                                    onChange={(e) => setBillingAddress({ ...billing_address, lastname: e.target.value })}
                                                    value={billing_address.lastname || ''} required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 form-group required">
                                            <label htmlFor="email" className="control-label">Email </label>
                                            <input type="email" className="form-control" id="email" placeholder="you@example.com"
                                                name="email"
                                                onChange={(e) => setBillingAddress({ ...billing_address, email: e.target.value })}
                                                value={billing_address.email || ''} required
                                            />
                                        </div>

                                        <div className="mb-3 form-group required">
                                            <label htmlFor="address" className="control-label">Country</label>
                                            <select className="form-control" id="country"
                                                name="country"
                                                onChange={(e) => setBillingAddress({ ...billing_address, country: e.target.value })}
                                                value={billing_address.country || ''} required
                                            >
                                                <option value="">Choose...</option>
                                                {countries.map((val, index) => (
                                                    <option key={index + 1} value={val.id}>{val.name}</option>
                                                ))}


                                            </select>
                                        </div>
                                        <div className="mb-3 form-group required">
                                            <label htmlFor="address" className="control-label">Address</label>
                                            <input
                                                name="address"
                                                type="text" className="form-control" id="address" placeholder="1234 Main St"
                                                onChange={(e) => setBillingAddress({ ...billing_address, address: e.target.value })}
                                                value={billing_address.address || ''} required
                                            />
                                        </div>

                                        <div className="mb-3 form-group">
                                            <label htmlFor="address2">Address 2 <span className="text-muted">(Optional)</span></label>
                                            <input type="text"
                                                name="address_optional"
                                                className="form-control" id="address2" placeholder="Apartment or suite"
                                                onChange={(e) => setBillingAddress({ ...billing_address, address_optional: e.target.value })}
                                                value={billing_address.address_optional || ''}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3 form-group required">
                                                <label htmlFor="state" className="control-label">State</label>
                                                <input className="form-control" id="state"
                                                    name="state"
                                                    onChange={(e) => setBillingAddress({ ...billing_address, state: e.target.value })}
                                                    value={billing_address.state || ''} placeholder="State" required
                                                />
                                            </div>
                                            <div className="col-md-5 mb-3 form-group required">
                                                <label htmlFor="country" className="control-label">City</label>
                                                <input className="form-control" name="city"
                                                    onChange={(e) => setBillingAddress({ ...billing_address, city: e.target.value })}
                                                    value={billing_address.city || ''} placeholder="State" required
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3 form-group required">
                                                <label htmlFor="zip" className="control-label">Pincode</label>
                                                <input type="text" className="form-control" id="zip" placeholder="Pincode"
                                                    name="pincode"
                                                    onChange={(e) => setBillingAddress({ ...billing_address, pincode: e.target.value })}
                                                    value={billing_address.pincode || ''} required
                                                />
                                            </div>
                                        </div>

                                        <hr className="mb-4" />
                                        <button className="btn w-100 log-btn bg_yellow" onClick={submitHandler} >{loading ? "Loading..." : "Continue to Pay"}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {/* <!-- End #main --> */}


            <script>

            </script>
        </div>
    );
}

export default CheckoutPage;
