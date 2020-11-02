import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "service/Common";
import { CURRENCY_ICON } from "config/Constants";
import { get_all_user_plan, clear_all_user_plan } from "actions/PlanAction";
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { ToastMessage } from "service/ToastMessage";
import { Container, Card, CardBody, CardTitle } from 'reactstrap';
import BlockUi from "react-block-ui";
import Loader from "react-loaders";

function PurchasePlansPage(props) {
    const dispatch = useDispatch();
    const PlanReducers = useSelector((state) => state.UserReducers.PlanReducers);
    const { all_plans, any_active_plan, _current_plan_id, subscription_pending, get_all_loading } = PlanReducers;

    const [selected_plan, setSelectedPlan] = useState({ plan_id: '', billing_frequency: 1 });
    const [update_plan, setUpdate_plan] = useState({ showModal: false });

    useEffect(() => {
        dispatch(get_all_user_plan());

        return () => {
			dispatch(clear_all_user_plan());
		};
    }, []);

    const onUpdatePlan = (status) => {
        if (status) {
            dispatch(get_all_user_plan());
        }
        setUpdate_plan({ ...update_plan, showModal: false })
    }

    return (
        <BlockUi tag="div" blocking={get_all_loading} loader={<Loader active type={"ball-scale-multiple"} color="#7b8199" />}>
        <div>
            {subscription_pending && 
            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0 d-flex justify-content-between">
                    <p className="mb-lg-0"> <i class="fa fa-exclamation-triangle mr-1" style={{"color" : "red"}} aria-hidden="true"></i>
                    Your subscription is still pending. please click proceed to complete payment process</p>
                    <Link to="/user/current_plan"  className="btn ml-lg-auto btn-info btn-sm my-1 my-sm-0">proceed</Link>

                </CardTitle>
            </Card>}

            <Card>
                <CardTitle className="bg-light border-bottom p-3 mb-0 d-flex justify-content-between">
                    <div>
                        <i className="mdi mdi-credit-card-multiple"> </i>
                        Purchase Plan
                        <div class="mt-2 card-subtitle">You can choose plan as per your need</div>
                    </div>

                    <div className="pricing-switcher">
                        <p className="fieldset">
                            <input type="radio" name="duration-1" value="1" id="monthly-1"
                                onChange={(e) => setSelectedPlan({ ...selected_plan, billing_frequency: e.target.value })}
                                checked={selected_plan.billing_frequency == 1 ? true : false}
                            />
                            <label htmlFor="monthly-1">Monthly</label>
                            <input type="radio" name="duration-1" value="2" id="yearly-1"
                                onChange={(e) => setSelectedPlan({ ...selected_plan, billing_frequency: e.target.value })}
                                checked={selected_plan.billing_frequency == 2 ? true : false}
                            />
                            <label htmlFor="yearly-1">Yearly</label>
                            <span className="switch"></span>
                        </p>
                    </div>
                </CardTitle>
                <CardBody className="">
                    <Container>
                        <section className="profile_sec plan ">
                            <div className="container">

                                <div className="row justify-content-center ">

                                    {all_plans.map((val, index) => (
                                        <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100" key={index + 1} >
                                            <div className="box featured" >
                                                <h3>{val.name}</h3>
                                                {selected_plan.billing_frequency == 1 && <h4><sup>{CURRENCY_ICON}</sup>{val.month_price} <span>per month</span></h4>}
                                                {selected_plan.billing_frequency == 2 && <h4><sup>{CURRENCY_ICON}</sup>{val.year_price} <span>per year</span></h4>}
                                                <ul>
                                                    {val.services.map((s_val, s_index) => (
                                                        <li key={s_index + 1} className={(s_val.access ? "" : "na")}><i className={(s_val.access ? "bx bx-check" : "bx bx-x")} ></i>{s_val.name}</li>
                                                    ))}
                                                </ul>

                                                {!any_active_plan &&
                                                    <Link to={{
                                                        pathname: "/checkout",
                                                        state: { plan: { ...selected_plan, plan_id: val.plan_id } }
                                                    }} className="buy-btn">Get Started</Link>
                                                }

                                                {any_active_plan && <>
                                                    {_current_plan_id === val._plan_id ?
                                                        <button className="buy-btn">Current Plan</button>
                                                        :
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPlan({ ...selected_plan, plan_id: val.plan_id })
                                                                setUpdate_plan({ ...update_plan, showModal: true })
                                                            }}
                                                            className="buy-btn"
                                                        >Update Plan</button>
                                                    }

                                                </>
                                                }
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </section>


                    </Container>
                </CardBody>
            </Card>

            {update_plan.showModal ?
                <UpdatePlanConfirmationModal
                    show={update_plan.showModal}
                    selected_plan={selected_plan}
                    onHide={onUpdatePlan}
                /> : ""}
        </div>
      </BlockUi>
    );
}

export default PurchasePlansPage;

function UpdatePlanConfirmationModal(props) {
    const [change_type, setChange_type] = useState(2);
    const [loading, setLoading] = useState(false);

    const update_plan = (e) => {
        e.preventDefault();

        if (!loading) {
            setLoading(true);
            postData("/api/update_plan", { ...props.selected_plan, change_type }).then((response) => {
                var data = response.data;
                setLoading(false);
                ToastMessage(data.message, "s")
                props.onHide(true)
            }).catch((error) => {
                ToastMessage(error.data.error, "e")
                setLoading(false);
            });
        }
    }

    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Update Plan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <form>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name={"plan_change_type"}
                            id={"Immediately"}
                            value="1"
                            onChange={(e) => setChange_type(e.target.value)}
                            checked={change_type == 1 ? true : false}
                        />
                        <label className="form-check-label" htmlFor={"Immediately"}>
                            Immediately
                    </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name={"plan_change_type"}
                            id={"End_of_Cycle"}
                            value="2"
                            onClick={(e) => setChange_type(e.target.value)}
                            checked={change_type == 2 ? true : false}
                        />
                        <label className="form-check-label" htmlFor={"End_of_Cycle"}>
                            End of Cycle
                    </label>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn log-btn bg_yellow" onClick={() => props.onHide(false)}>Cancel</button>
                <button className="btn log-btn bg_yellow" onClick={update_plan}>{loading ? "Loading..." : "Update Plan"}</button>
            </Modal.Footer>
        </Modal>
    );
}