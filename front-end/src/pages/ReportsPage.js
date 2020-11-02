import React, { useEffect, useState } from 'react';
import { postData } from "service/Common";
import $ from 'jquery';
import LineChart from "../components/LineChart/LineChart";
import { useDispatch, useSelector } from "react-redux";
import { getReporOptiontData } from "actions/ReportsActions";
import DatePicker from "react-datepicker";
import moment from 'moment';
import { ToastMessage } from 'service/ToastMessage';
import { Container, Card, CardBody, CardTitle } from 'reactstrap';

function ReportsPage(props) {

    const dispatch = useDispatch();
    const UserReducers = useSelector((state) => {
        return state.UserReducers.ReportDataReducers;
    });
    const { reporOptiontData, reportDataFail } = UserReducers;

    const [serviceid, setServiceid] = useState(0);
    const [projectid, setProjectid] = useState(0);
    const [fromdate, setFromdate] = useState(moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'));
    const [type, setType] = useState('d');
    const [todate, setTodate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        setLoading(true);
        dispatch(getReporOptiontData({ projectid: projectid, serviceid: serviceid, type: type, fromdate: fromdate, todate: todate }));
        apiCalling([projectid, serviceid, type, fromdate, todate]);
    }, [])

    useEffect(() => {
        if (reporOptiontData) {
            setProjects(reporOptiontData.all_projects);
            setServices(reporOptiontData.all_services);
            setLoading(false);
        }
        if (reportDataFail) {
            setChartData({});
            setLoading(false);
        }
    }, [reporOptiontData, reportDataFail]);

    const submitHandller = (e) => {
        e.preventDefault();
        if ($("#countreportForm").valid() && !loading) {
            setLoading(true);
            var req = [projectid, serviceid, type, fromdate, todate];
            apiCalling(req);
        }
    }

    const apiCalling = ([pprojectid, pserviceid, ptype, pfromdate, ptodate]) => {
        var req = { projectid: pprojectid, serviceid: pserviceid, type: ptype, fromdate: pfromdate, todate: ptodate };
        postData("/api/user/getReportFilter", req).then((response) => {
            var data = response.data;
            setChartData(data.report ? data.report : []);
            setLoading(false);
        }).catch((error) => {
            ToastMessage(error.data.error, 'e');
            setLoading(false);
        })
    }

    const resetHandller = () => {
        setLoading(true);
        setProjectid(0);
        setServiceid(0);
        setType('d');
        setFromdate(moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'));
        setTodate(moment(new Date()).format('YYYY-MM-DD'));
        apiCalling([0, 0, 'd', moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'), moment(new Date()).add(1, 'day').format('YYYY-MM-DD')]);
    }
    return (
        <>
            <div>
                <Card>
                    <CardTitle className="bg-light border-bottom p-3 mb-0">
                        <i className="fa fa-file mr-2"> </i>
            Reports
          </CardTitle>
                    <CardBody className="">
                        <Container>
                            <div className="row  justify-content-center">
                                <div className="col-md-10">
                                    <div className=" mb-0">

                                        <form id="countreportForm">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Select Project</label>
                                                        <select id="projectid" name="projectid" onChange={(e) => setProjectid(e.target.value)} value={projectid || ''} className="form-control cmn_input__2" placeholder={'Select Project'} required>
                                                            <option value="0">Select All</option>
                                                            {
                                                                projects.map((val, x) => {
                                                                    return <option value={val.id} key={x}>{val.name}</option>;
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Select Api</label>
                                                        <select id="serviceid" name="serviceid" onChange={(e) => setServiceid(e.target.value)} value={serviceid || ''} className="form-control cmn_input__2" placeholder={'Select Service'} required>
                                                            <option value="0">Select All</option>
                                                            {
                                                                services.map((val, x) => {
                                                                    return <option value={val.id} key={x}>{val.name}</option>;
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>wise</label>
                                                        <select id="type" name="type" onChange={(e) => setType(e.target.value)} value={type || ''} className="form-control cmn_input__2" placeholder={'Select Type'} required>
                                                            <option value="y">Year</option>
                                                            <option value="m">Month</option>
                                                            <option value="d">Date</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>From Date</label>
                                                        <div className="datepicker_icon_add">
                                                            <div>
                                                                <DatePicker
                                                                    required={true}
                                                                    name={"fromdate"}
                                                                    dateFormat="dd-MM-yyyy"
                                                                    selected={fromdate ? moment(fromdate).valueOf() : null}
                                                                    onChange={date => { setFromdate(moment(date).format('YYYY-MM-DD')) }}
                                                                    // minDate={mindate?moment(mindate).toDate():new Date("2020-09-01")}
                                                                    maxDate={new Date()}
                                                                    placeholderText="DD-MM-YYYY"
                                                                    className="form-control cmn_input__2"
                                                                    peekNextMonth
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    id="from_fromdate"
                                                                />
                                                            </div>
                                                            <label className="icon-calendar" style={{ fontSize: '20px' }} htmlFor='from_fromdate' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>To Date</label>
                                                        <div className="datepicker_icon_add">
                                                            <div>
                                                                <DatePicker
                                                                    required={true}
                                                                    name={"todate"}
                                                                    dateFormat="dd-MM-yyyy"
                                                                    selected={todate ? moment(todate).valueOf() : null}
                                                                    onChange={date => { setTodate(moment(date).format('YYYY-MM-DD')) }}
                                                                    startDate={fromdate ? moment(fromdate).toDate() : new Date()}
                                                                    minDate={fromdate ? moment(fromdate).toDate() : new Date()}
                                                                    maxDate={new Date()}
                                                                    placeholderText="DD-MM-YYYY"
                                                                    className="form-control cmn_input__2"
                                                                    peekNextMonth
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    id={'to_fromdate'}
                                                                />
                                                            </div>
                                                            <label className="icon-calendar" style={{ fontSize: '20px' }} htmlFor='to_fromdate' />
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="col-md-3 mt-4">
                                                    <div className="form-group">
                                                        <button className="btn w-100 log-btn bg_yellow" onClick={submitHandller} disabled={loading ? "Disabled" : ""}>{loading ? 'Loading...' : 'Send'}</button>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 mt-4">
                                                    <div className="form-group">
                                                        <button type="button" className="btn w-100 log-btn bg_yellow" onClick={resetHandller} disabled={loading ? "Disabled" : ""}>{loading ? "Loading..." : "Reset"}</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
                                        <div className="mb-0" style={{ borderTop: '1px solid #e6e6e6' }}>
                                            {chartData.length ?
                                                <LineChart
                                                    data={chartData}
                                                />
                                                :
                                                (<div className="not_found">Data not found.</div>)}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Container>
                    </CardBody>
                </Card>
                {/* --------------------------------------------------------------------------------*/}
                {/* Row*/}
                {/* --------------------------------------------------------------------------------*/}

                {/* --------------------------------------------------------------------------------*/}
                {/* End Inner Div*/}
                {/* --------------------------------------------------------------------------------*/}
            </div>
        </>
    );
}

export default ReportsPage;