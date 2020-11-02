import React, { useState, useRef } from "react";
import { postData } from "service/Common";
import React_Table from "components/React-Table/Table";
import AllocatePlanPopUp from "pages/AllocatePlanPopUp"
import moment from 'moment';
import { ToastMessage } from "service/ToastMessage";
import ConfirmationAlertBox from "components/ConfirmationAlertBox";

function UsersListingPage(props) {
	const refTable = useRef(null);

	const columns = React.useMemo(() => [
		{
			Header: "ID",
			accessor: "id",
		},
		{
			Header: "Name",
			accessor: "fullname",
		},
		{
			Header: "Email",
			accessor: "email",
		},
		{
			Header: "Phone",
			accessor: "phone",
		},
		{
			Header: "Created",
			accessor: "created",
		},
		{
			Header: "Current Plan",
			accessor: "user_current_plan",
			Cell: props => <>{props.value ? props.value.plan_name : "N/A"}</>
		},
		{
			Header: "Actions",
			Cell: props => <span>
				{props.row.original.user_current_plan === null &&
					<button className="btn btn-success btn-rounded btn-fw btn-small mr-2" onClick={() => setAllocatte_plan({ showModal: true, user_id: props.row.original.id })}>Allocate Plan</button>}
				<button className="btn btn-danger btn-rounded btn-fw btn-small" onClick={() => archiveUser(props.row.original.id)}>Archive</button>
			</span>
		},
		{
			Header: () => null, // No header
			id: 'expander', // It needs an ID
			Cell: ({ row }) => (
				<span {...row.getToggleRowExpandedProps()}>
					{row.isExpanded ? <i className="icon ocr-arrow-black-down"></i> : <i className="icon ocr-arrow-red-right"></i>}
				</span>
			),
		},
	]);

	// We'll start our table without any data
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [search, setSearch] = useState("");

	const [allocate_plan, setAllocatte_plan] = useState({ showModal: false, user_id: '' });

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		setLoading(true);

		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		postData("/api/admin/user_listing", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);

				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((error) => { });
	}, []);

	const archiveUser = (user_id) => {
		ConfirmationAlertBox({
			title: "Are you sure?",
			message: "You want to archive this user",
		}).then((res) => {
			if (res.status) {
				postData("/api/admin/archive_user", { user_id })
					.then((response) => {
						refTable.current.refreashTable();
						ToastMessage(response.data.message, "s");
					})
					.catch((error) => { });
			}
		});
	};

	return (
		<>
			<div className="content-wrapper ">
				<div className="page-header">
					<h3 className="page-title"> Users </h3>
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
								<div className="form-group search_icons_add">
									<input
										className="form-control form-control-lg"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder={"Search name"}
									/>
								</div>
								<div className="expanded_table">
									<React_Table
										ref={refTable}
										columns={columns}
										data={data}
										fetchData={fetchData}
										loading={loading}
										pageCount={pageCount}
										globalFilter={search}
										renderRowSubComponent={renderRowSubComponent}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{allocate_plan.showModal && <AllocatePlanPopUp
				show={allocate_plan.showModal}
				onHide={() => {
					setAllocatte_plan({ showModal: false, user_id: '' });
					refTable.current.refreashTable();
				}}
				user_id={allocate_plan.user_id}
			/>}
		</>
	);
}

export default UsersListingPage;


const renderRowSubComponent = (props) => {
	var details = props.row.original.user_current_plan ?? {};

	return (
		<>
			{props.row.original.user_current_plan &&
				<div className="sub_component_td">
					<div>
						<label>Plan Name:</label>
						<span>{details.plan_name}</span>
					</div>
					<div>
						<label>Number of Hit:</label>
						<span>{details.num_of_hit}</span>
					</div>
					<div>
						<label>Remaining Hit:</label>
						<span>{details.remaining_hit}</span>
					</div>
					<div>
						<label>Plan Type:</label>
						<span>{details.plan_type_label}</span>
					</div>
					<div>
						<label>Plan Start:</label>
						<span>{moment(details.plan_start_at).format("DD/MM/YYYY")}</span>
					</div>
					<div>
						<label>Plan End:</label>
						<span>{moment(details.plan_end_at).format("DD/MM/YYYY")}</span>
					</div>
				</div>}

			{props.row.original.user_current_plan === null && <div className="sub_component_td">No active plan</div>}
		</>
	)
}
