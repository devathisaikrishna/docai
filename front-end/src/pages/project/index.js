import React, { useEffect, useState, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { postData } from "../../service/Common";
import { ToastMessage } from "../../service/ToastMessage";
import React_Table from "../../components/React-Table/Table";
import ConfirmationAlertBox from "../../components/ConfirmationAlertBox";
import { Container, Card, CardBody, CardTitle } from "reactstrap";

function ProjectsListingPage() {
	const refTable = useRef(null);

	const columns = React.useMemo(() => [
		{
			Header: "#",
			Cell: (props) => <span>{props.row.index + 1}</span>,
		},
		{
			Header: "Name",
			accessor: "name",
		},
		{
			Header: "Created",
			accessor: "created",
		},
		{
			Header: "Actions",
			Cell: (props) => (
				<span>
					<Link to={{ pathname: `/user/project/${props.row.original.id}/show` }}>
						<button className="btn btn-info btn-rounded btn-fw btn-small mr-2">View</button>
					</Link>

					<Link to={{ pathname: `/user/project/${props.row.original.id}/edit` }}>
						<button className="btn btn-success btn-rounded btn-fw btn-small mr-2">Edit</button>
					</Link>

					<button className="btn btn-danger btn-rounded btn-fw btn-small mr-2" onClick={() => approve_deny_request({ id: props.row.original.id })}>
						Delete
					</button>

					<Link to={{ pathname: `/user/api_log`, state: { id: props.row.original.id } }}>
						<button className="btn btn-warning btn-rounded btn-fw btn-small">View Logs</button>
					</Link>
				</span>
			),
		},
	]);

	// We'll start our table without any data
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [search, setSearch] = useState("");
	const [invalid, setInvalid] = useState(false);

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		setLoading(true);

		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		postData("/api/projects", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);
				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((err) => {
				if (err.status === 401) {
					setInvalid(true);
				}
			});
	}, []);

	const approve_deny_request = ({ id }) => {
		ConfirmationAlertBox().then((res) => {
			if (res.status) {
				let request = { id };
				postData("/api/project/delete", request)
					.then((response) => {
						refTable.current.refreashTable();
						ToastMessage(response.data.message, "s");
					})
					.catch((error) => {
						ToastMessage(error.message, "e");
					});
			}
		});
	};

	return (
		<>
			{invalid && <Redirect to="/user/api_key" />}
			<Card>
				<CardTitle className="bg-light border-bottom p-3 mb-0">
					<div className="d-flex justify-content-between">
						<div>
							<i className="fa fa-tasks mr-2"> </i>
							<span>Projects</span>
						</div>
						<div>
							<Link to="/user/add_project" style={{ fontSize: ".76563rem" }} type="button" className="btn btn-info react-bs-table-add-btn ">
								<span>
									<i className="fa glyphicon glyphicon-plus fa-plus"></i> New
								</span>
							</Link>
						</div>
					</div>
				</CardTitle>
				<CardBody className="">
					<Container fluid={true}>
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
					</Container>
				</CardBody>
			</Card>
		</>
	);
}

export default ProjectsListingPage;
