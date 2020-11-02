import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { postData } from "service/Common";
import { ToastMessage } from "service/ToastMessage";
import { CURRENCY_ICON } from "config/Constants";
import { Badgestatus } from "components/Badgestatus";

function UserPlanSubscriptionPaymentDetailPage(props) {
	
	// We'll start our table without any data
	const [paymentdata, setPaymentdata] = useState({});
    const [loading, setLoading] = useState(true);

    
    useEffect(()=>{
        if(props.match.params.payment_id != undefined){
            postData("/api/admin/get_user_plan_subscription_payment_detail", {payment_id:props.match.params.payment_id})
			.then((response) => {
                setLoading(false);
                if(response.status == 200)
                {
                    setPaymentdata(response.data);
                }else{
                    ToastMessage(response.data.message,"e");
                    props.history.push('/admin/user_plan_subscriptions/');
                }
			})
			.catch((error) => {
                ToastMessage(error.data.error,"e");
                props.history.push('/admin/user_plan_subscriptions/');
			});
        }else{
            props.history.push('/admin/user_plan_subscriptions/');
        }
    },[]);

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> Payment Detail </h3>
					{/* <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Tables</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
                        </ol>
                    </nav> */}
				</div>

				<div className="row">
					<div className="col-md-12">
						<div className="card">
							<div className="card-header bg-warning">
                                <strong className="justify-content-center">Transaction Id: {(paymentdata.rz_transaction_id != undefined)?
                                        paymentdata.rz_transaction_id:'N/A'}</strong>
                            </div>
                            <div className="card-body">
                                {loading?'Loading...':
                                <>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Subscription Id</label>
                                                </div>
                                                <div className="col-md-8">
                                                    {(paymentdata.subscription_id_v != undefined)?
                                                    paymentdata.subscription_id_v
                                                    :''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Payment Status</label>
                                                </div>
                                                <div className="col-md-8">
                                                    {(paymentdata.payment_status_label != undefined)?
                                                    <Badgestatus status={paymentdata.payment_status_label} />
                                                    :''}
                                                </div>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Plan Amount</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.plan_amount != undefined)?
                                                CURRENCY_ICON+paymentdata.plan_amount:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                <label>Payment By</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.payment_type_label != undefined)?
                                                paymentdata.payment_type_label:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Payment Date</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.paymentdate != undefined)?
                                                paymentdata.paymentdate:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Comment</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.comment_note != undefined)?
                                                paymentdata.comment_note:''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-4">
                                                <label>Payment ID</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.payment_id != undefined)?paymentdata.payment_id:''}
                                                </div>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Coupon Name</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.coupon_name != undefined)?
                                                paymentdata.coupon_name:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Discount Amount</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.discount_amount != undefined)?
                                                paymentdata.discount_amount:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Sub Total</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.sub_total != undefined)?
                                                paymentdata.sub_total:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>GST</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.gst != undefined)?
                                                paymentdata.gst:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Total</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(paymentdata.total != undefined)?
                                                CURRENCY_ICON+paymentdata.total:''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                }
							</div>
						</div>
                        <div className="text-center">

                            <Link className="btn btn-warning btn-rounded btn-md mr-2" 
                            to={"/admin/user_plan_subscription/"+paymentdata.subscription_id}>
                                Back
                            </Link>
                        </div>
					</div>
				</div>
			</div>
		</>
	);
}

export default UserPlanSubscriptionPaymentDetailPage;
