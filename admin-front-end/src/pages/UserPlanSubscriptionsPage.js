import React, { useState } from "react";
import { Link } from "react-router-dom";
import { postData, getStatusBadgebyLabel } from "service/Common";
import React_Table from "components/React-Table/Table";
import { ToastMessage } from "service/ToastMessage";
import CancelUserSubscriptionModel from "./CancelUserSubscriptionModel";
import { Badgestatus } from "components/Badgestatus";

function UserPlanSubscriptionsPage(props) {
	const columns = React.useMemo(() => [
		{
			Header: "ID",
			accessor: "id",
		},
		{
			Header: "Subscription Id",
			accessor: "_subscription_id",
		},
		{
			Header: "User",
			accessor: "user_name",
		},
		{
			Header: "Plan Name",
			accessor: "plan_name",
		},
		{
			Header: "Frequency",
			accessor: "billing_frequency_label",
		},
		{
			Header: "Status",
			accessor: "status_label",
			Cell:(info)=>{
				return (<Badgestatus status={info.row.original.status_label}/>);
			}
		},
		{
			Header: "Created On",
			accessor: "created",
		},
		{
			Header: "Action",
			sortable: false,
			Cell:((info)=>{
				return (
				<>
					
					{info.row.original.is_super_admin !== 1?
					<div>
						<Link className="btn btn-warning btn-rounded btn-xs mr-2"
						to={"/admin/user_plan_subscription/"+info.row.original.id}
						title="View Detail"><i className="icon-eye"></i></Link>
						{(info.row.original.status_label === 'Activate')?
							<button type="button" className="btn btn-danger btn-rounded btn-xs mr-2"
							onClick={()=>{setOpenModel(true);setOpenModelsid(info.row.original.id);}}
							title="Cancel Subsription"><i className="icon-close"></i></button>
						:''}
						
					</div>:''}
				</>
				)
			}),
		}
	]);

	// We'll start our table without any data
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [search, setSearch] = useState("");
	const [searchData, setsearchData] = useState("");
	const [sortBy, setSortBy] = useState({});
	const [openModel, setOpenModel] = useState(false);
	const [openModelsid, setOpenModelsid] = useState("");

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		setLoading(true);

		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		postData("/api/admin/user_plan_subscription_listing", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);

				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((error) => {
				ToastMessage(error.data.error)
			});
	}, []);

	const searchSubmitHandller=(e)=>{
		e.preventDefault();
		setsearchData(search);
	}

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> User Plan Subscriptions </h3>
					{/* <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Tables</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
                        </ol>
                    </nav> */}
				</div>

				<div className="row">
					<div className="col-lg-12 grid-margin stretch-card">
						<div className="card">
							<div className="card-body">
								<form id="searchUserForm" onSubmit={searchSubmitHandller}>
								<div className="form-group search_icons_add">
									<input
										className="form-control form-control-lg"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder={"Search name"}
									/>
								</div>
								{/* <div className="form-group">
									<Link
										className="btn ml-lg-auto download-button btn-success btn-sm my-1 my-sm-0"
										to={"/admin/register_admin"}
									>Create Admin</Link>
								</div> */}
								</form>
								<React_Table 
								columns={columns} 
								data={data}
								fetchData={fetchData} 
								loading={loading} 
								pageCount={pageCount} 
								globalFilter={searchData} />
							</div>
						</div>
					</div>
				</div>
			</div>
			{openModel === true?
			<CancelUserSubscriptionModel
			show={openModel}
			close={(e)=>{(e!== undefined && e)?fetchData({pageSize:10, pageIndex:0, sortBy:sortBy, globalFilter:search}):void(0); setOpenModel(false);}}
			title="Cancel Subscription ?"
			subscription_id={openModelsid}
			/>
			:null}
		</>
	);
}

export default UserPlanSubscriptionsPage;
