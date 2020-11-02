import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import React_Table from "components/React-Table/Table";
import ConfirmationAlertBox from "components/ConfirmationAlertBox"
import { ToastMessage } from "service/ToastMessage"
import { Badgestatus } from "../components/Badgestatus";


function PlanListingPage(props) {
	const refTable = useRef(null)

	const columns = React.useMemo(() => [
		{
			Header: "ID",
			accessor: "id",
		},
		{
			Header: "Plan Name",
			accessor: "name",
		},
		{
			Header: "Plan Type",
			accessor: "plan_type",
		},
		{
			Header: "Number of Hit",
			accessor: "num_of_hit",
		},
		{
			Header: "Duration (In days)",
			accessor: "duration",
		},
		{
			Header: "Month Price",
			accessor: "month_price",
		},
		{
			Header: "Year Price",
			accessor: "year_price",
		},
		{
			Header: "Status",
			accessor: "status_label",
			Cell: (info) => {
				return <Badgestatus status={info.row.original.status_label} />
			}
		},
		{
			Header: "Actions",
			Cell: props => <span>
				{/* {<Link className="btn btn-success btn-rounded btn-fw btn-small mr-2" to={"/admin/plans/" + props.row.original.id} >Edit</Link>} */}
				{<button className="btn btn-danger btn-rounded btn-fw btn-small" onClick={() => archivePlan(props.row.original.id)}>Archive</button>}
			</span>
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
		postData("/api/admin/get_plan_listing", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);

				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((error) => { });
	}, []);

	const archivePlan = (plan_id) => {
		ConfirmationAlertBox().then((res) => {
			if (res.status) {
				let req = { plan_id };
				postData("/api/admin/archive_plan", req).then((response) => {
					refTable.current.refreashTable();
					ToastMessage(response.data.message, "s")
				}).catch((error) => {
				})
			}
		})
	}

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> Plans </h3>
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

								<div className="form-group">
									<Link
										className="btn ml-lg-auto download-button btn-success btn-sm my-1 my-sm-0"
										to={"/admin/plans/create"}
									>Create Plan</Link>
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

export default PlanListingPage;
