import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import { ToastMessage } from "service/ToastMessage";
import React_Table from "components/React-Table/Table";
import ConfirmationAlertBox from "components/ConfirmationAlertBox";
import moment from "moment";
import { CURRENCY_ICON } from "config/Constants";

const CouponsListingPage = () => {
	const refTable = useRef(null);

	const columns = React.useMemo(() => [
		{
			Header: "Id",
			accessor: "_coupon_id",
		},
		{
			Header: "Name",
			accessor: "name",
		},
		{
			Header: "Code",
			accessor: "coupon_code",
		},
		{
			Header: "Type",
			Cell: (props) => <span>{props.row.original.coupon_type == 1 ? "Fixed Amount" : "Percentage"}</span>,
		},
		{
			Header: "₹ / %",
			Cell: (props) => <span>{props.row.original.amount ? props.row.original.amount + CURRENCY_ICON : props.row.original.percentage + "%"}</span>,
		},
		{
			Header: "Start Date",
			accessor: "start_date",
		},
		{
			Header: "End Date",
			accessor: "end_date",
		},
		{
			Header: "Actions",
			Cell: (props) => (
				<span>
					<Link to={{ pathname: `/admin/coupon/${props.row.original._coupon_id}/show` }}>
						<button className="btn btn-info btn-rounded btn-fw btn-small mr-2">View</button>
					</Link>

					{moment(props.row.original.start_at).format("X") > moment().format("X") && (
						<Link to={{ pathname: `/admin/coupon/${props.row.original._coupon_id}/edit` }}>
							<button className="btn btn-success btn-rounded btn-fw btn-small mr-2">Edit</button>
						</Link>
					)}

					{moment(props.row.original.start_at).format("X") > moment().format("X") && (
						<button
							className="btn btn-danger btn-rounded btn-fw btn-small mr-2"
							onClick={() => approve_archive_request({ id: props.row.original._coupon_id })}
						>
							Delete
						</button>
					)}
				</span>
			),
		},
	]);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [search, setSearch] = useState("");

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		setLoading(true);

		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		postData("/api/admin/coupons", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);

				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((error) => {});
	}, []);

	const approve_archive_request = ({ id }) => {
		ConfirmationAlertBox().then((response) => {
			if (response.status) {
				postData("/api/admin/coupon/delete", { id })
					.then((res) => {
						refTable.current.refreashTable();
						ToastMessage(res.data.message, "s");
					})
					.catch((error) => {
						ToastMessage(error.data.error, "e");
					});
			}
		});
	};

	return (
		<div className="content-wrapper ">
			<div className="page-header">
				<h3 className="page-title"> Coupons Listing </h3>

				<Link to="/admin/add_coupon" className="btn btn-success btn-rounded btn-fw">
					Add Coupon
				</Link>
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
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CouponsListingPage;
