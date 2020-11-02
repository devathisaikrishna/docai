import React, { useState, createRef, useRef } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import { ToastMessage } from "service/ToastMessage";
import React_Table from "components/React-Table/Table";
import ConfirmationAlertBox from "components/ConfirmationAlertBox";

function UsersListingPage(props) {
	const refTable = useRef(null);

	const columns = React.useMemo(() => [
		{
			Header: "ID",
			accessor: "id",
		},
		{
			Header: "User Name",
			accessor: "user_name",
		},
		{
			Header: "Request At",
			accessor: "request_at",
		},
		{
			Header: "Approve By",
			accessor: "approver_name",
		},
		{
			Header: "Status",
			accessor: "status_label",
		},
		{
			Header: "Actions",
			Cell: (props) => (
				<span>
					{props.row.original.status == 1 ? (
						<button
							className="btn btn-success btn-rounded btn-fw btn-small mr-2"
							onClick={() => approve_deny_request({ status: 2, id: props.row.original.id })}
						>
							Aprrove
						</button>
					) : (
						""
					)}
					{props.row.original.status == 1 ? (
						<button
							className="btn btn-danger btn-rounded btn-fw btn-small"
							onClick={() => approve_deny_request({ status: 3, id: props.row.original.id })}
						>
							Deny
						</button>
					) : (
						""
					)}
				</span>
			),
		},
	]);

	// We'll start our table without any data
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [search, setSearch] = useState("");

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		setLoading(true);

		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		postData("/api/admin/api_key_request_listing", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);

				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((error) => {});
	}, []);

	const approve_deny_request = ({ status, id }) => {
		ConfirmationAlertBox().then((res) => {
			if (res.status) {
				let req = { status, id };
				postData("/api/admin/approve_deny_key_request", req)
					.then((response) => {
						refTable.current.refreashTable();
						ToastMessage(response.data.message, "s");
					})
					.catch((error) => {});
			}
		});
	};

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> Api Key Request </h3>
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

								<React_Table
									ref={refTable}
									columns={columns}
									data={data}
									fetchData={fetchData}
									loading={loading}
									pageCount={pageCount}
									globalFilter={search}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default UsersListingPage;
