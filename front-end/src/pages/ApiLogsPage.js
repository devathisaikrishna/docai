import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import React_Table from "components/React-Table/Table";
import { Container, Col, Row, Card, CardBody, CardTitle } from "reactstrap";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";

const ApiLogsPage = (props) => {
	const refTable = useRef(null);

	const columns = React.useMemo(() => [
		{
			Header: "#",
			Cell: (props) => <span>{props.row.index + 1}</span>,
		},
		{
			Header: "Project",
			accessor: "name",
		},
		{
			Header: "Service",
			accessor: "service",
		},
		{
			Header: "IP Address",
			accessor: "ip_address",
		},
		{
			Header: "Request Domain",
			accessor: "request_domain",
		},
		{
			Header: "Status",
			accessor: "ai_response_status",
		},
		{
			Header: "Created",
			accessor: "created",
		},
		{
			Header: "Actions",
			Cell: (props) => (
				<Link to={{ pathname: `/user/api_log/${props.row.original.id}` }}>
					<button className="btn btn-warning btn-rounded btn-fw btn-small">View</button>
				</Link>
			),
		},
	]);

	// We'll start our table without any data
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [search, setSearch] = useState("");

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		let {
			location: { state },
		} = props;
		let projectId = "";

		if (state !== undefined && state !== null) {
			projectId = state.id;
		}

		setLoading(true);
		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter, id: projectId };
		postData("/api/service_logs", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);
				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((err) => {});
	}, []);

	return (
		<>
			<Card>
				<CardTitle className="bg-light border-bottom p-3 mb-0">
					<i className="fa fa-history mr-2"> </i>
					Api Logs
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
};

export default ApiLogsPage;
