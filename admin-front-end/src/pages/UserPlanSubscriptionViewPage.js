import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { postData, getStatusBadgebyLabel } from "service/Common";
import { ToastMessage } from "service/ToastMessage";
import { CURRENCY_ICON } from "config/Constants";
import React_Table from "components/React-Table/Table";
import { Badgestatus } from "components/Badgestatus";

function UserPlanSubscriptionViewPage(props) {
	
	// We'll start our table without any data
	const [usdata, setUsdata] = useState({});
	const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
	const [searchData, setsearchData] = useState("");

    const columns = React.useMemo(() => [
		{
			Header: "ID",
			accessor: "id",
		},
		{
			Header: "Payment ID",
			accessor: "_payment_id",
		},
		{
			Header: "Transaction Id",
			accessor: "rz_transaction_id",
		},
		{
			Header: "Payment Type",
			accessor: "payment_type_label",
		},
		{
			Header: "Payment Total",
            accessor: "total",
            Cell:((info)=>{
                return CURRENCY_ICON+info.row.original.total;
            })
		},
		{
			Header: "Payment Status",
            accessor: "payment_status_label",
            Cell:(info)=>{
                return <Badgestatus status={info.row.original.payment_status_label}/>
            }
		},
		{
			Header: "Payment Date",
			accessor: "paymentdate",
		},
		{
			Header: "Action",
			sortable: false,
			Cell:((info)=>{
				return (
				<>	
					<div>
                        <Link className="btn btn-warning btn-rounded btn-xs mr-2" 
                        title={"View Detail"}
                        to={"/admin/payment_detail/"+info.row.original.id}>
							<i className="icon-eye"></i>
						</Link>
					</div>
				</>
				)
			}),
		}
    ]);
    
    const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
        setLoading(true);
        if(props.match.params.id){
		    let req = { id:props.match.params.id,page_Size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		    postData("/api/admin/get_user_plan_subscription", req)
			.then((response) => {
                if(response.status == 200)
                {
                var res = response.data;
                setUsdata(response.data);
				setData(res.data);

				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
                setLoading(false);
                }else{
                    ToastMessage(response.data.message,"e");
                    props.history.push('/admin/user_plan_subscriptions');
                }
			})
            .catch((error) => {
                ToastMessage(error.data.error,"e");
                props.history.push('/admin/user_plan_subscriptions');
            });
        }else{
            props.history.push('/admin/user_plan_subscriptions');
        }
	}, []);

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> User Plan Subscription </h3>
					{/* <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Tables</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
                        </ol>
                    </nav> */}
				</div>

				<div className="row">
					<div className="col-md-12 grid-margin stretch-card">
						<div className="card">
							<div className="card-header bg-warning">
                                <strong className="justify-content-center">Subscription ID: {(usdata._subscription_id != undefined)?
                                        usdata._subscription_id:'N/A'}</strong>
                            </div>
                            <div className="card-body">
                                {loading?'Loading...':
                                <>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>User Name</label>
                                                </div>
                                                <div className="col-md-8">
                                                    {(usdata.user_firstname != undefined)?
                                                    usdata.user_firstname+ ' '+usdata.user_lastname
                                                    :''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>User Email</label>
                                                </div>
                                                <div className="col-md-8">
                                                    {(usdata.user_email != undefined)?usdata.user_email:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                <label>Plan Name</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.plan_name != undefined)?
                                                <Link to={'/admin/plans'}>
                                                    {usdata.plan_name}
                                                </Link>:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                <label>Billing Frequency</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.billing_frequency_label != undefined)?
                                                usdata.billing_frequency_label:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Cycle Count</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.cycle_count != undefined)?
                                                usdata.cycle_count:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Paid Cycle Count</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.paid_cycle_count != undefined)?
                                                usdata.paid_cycle_count:''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Start Date</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.start_at != undefined)?
                                                usdata.start_at:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>End Date</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.end_at != undefined)?
                                                usdata.end_at:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Created On</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.created_at != undefined)?
                                                usdata.created_at:''}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Subscription Status</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.status_label != undefined)?
                                                <Badgestatus status={usdata.status_label} />:''}
                                                </div>
                                            </div>
                                            {(usdata.cancel_at!==null)?
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Cancelled Date</label>
                                                </div>
                                                <div className="col-md-8">
                                                    {usdata.cancel_at}
                                                </div>
                                            </div>
                                            :null}
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label>Remaining Cycle Count</label>
                                                </div>
                                                <div className="col-md-8">
                                                {(usdata.remaining_cycle_count != undefined)?
                                                usdata.remaining_cycle_count:''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                }
							</div>
						</div>
					</div>
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-header">
                                Transactions List
                            </div>
                            <div className="card-body">
                                <React_Table 
                                    columns={columns} 
                                    data={data}
                                    fetchData={fetchData} 
                                    loading={loading} 
                                    pageCount={pageCount} 
                                    globalFilter={searchData} 
                                        />
                            </div>
                        </div>
                    </div>
                    
				</div>
			</div>
		</>
	);
}

export default UserPlanSubscriptionViewPage;