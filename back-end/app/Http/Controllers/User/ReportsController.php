<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Project;
use App\Models\Service;
use App\Models\Service_log;
use Illuminate\Http\Request;
use App\Traits\CommonMethod;
use Illuminate\Support\Collection;
use Carbon\Carbon;
use Validator;

class ReportsController extends Controller
{
    use CommonMethod;
    /** 
     * All Count of project in api hitting 
     * month wise fatching
     * 
     * @param type int
     */
    public function index(Request $request)
    {
    }

    /**
     * getReportFilter() function for report filter
     * 
     * @param projectid int
     * @param serviceid int
     * @param type string
     * @param fromdate date format
     * @param todate date format
     */
    public function getReportFilter(Request $request)
    {
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'projectid' => 'required',
            'serviceid' => 'required',
            'type' => 'required|min:1',
            'fromdate' => 'required',
            'todate' => 'required'
        ], ['gt' => 'Please select any one services.']);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }
        switch ($request->type) {
            case 'd':
                $type = '%Y-%m-%d';
                $sdate = '%d-%m-%Y';
                break;
            case 'm':
                $type = '%Y-%m';
                $sdate = '%m-%Y';
                break;
            case 'y':
                $type = '%Y';
                $sdate = '%Y';
                break;
            default:
                $type = '%Y-%m-%d';
                $sdate = '%d-%m-%Y';
                break;
        }

        $fdate = $request->fromdate ? str_replace('/', '-', $request->fromdate) : '';
        $tdate = $request->todate ? str_replace('/', '-', $request->todate) : '';
        $from = $fdate ? date("Y-m-d", strtotime($fdate)) : "";
        $to = $tdate ? date("Y-m-d", strtotime($tdate)) : "";
        $projectsIds = [];
        $projectid = $request->projectid;

        $proj = Project::select('id')->where('user_id', $user->id);

        if (!empty($projectid)) {
            $proj->where('id', $projectid);
        }
        $projects = $proj->get()->toArray();
        if (!empty($projects)) {
            $projectsIds = array_column($projects, 'id');
        } else {
            return response()->json(["message" => "Project not found."], 202);
        }


        $serviceid = $request->serviceid;
        $servicesIds = [];

        $serv = Service::select('id', 'name');
        if (!empty($serviceid)) {
            $serv->where('id', $serviceid);
        }
        $services = $serv->get();

        if (!$services->isEmpty()) {
            $arrData = $services->toArray();
            $servicesIds = array_column($arrData, 'id');
            $servicesData = $arrData;
            $serviceNames = array_column($arrData, 'name');
            $grpby = ",service_logs.service_id";
        } else {
            return response()->json(["message" => "Services not found."], 202);
        }

        $result = Service_log::select(
            'service_logs.project_id',
            'service_logs.service_id',
            DB::raw('count(service_logs.id) as counts'),
            DB::raw("DATE_FORMAT(service_logs.created_at, '$sdate') as created_atd"),
            DB::raw("DATE_FORMAT(service_logs.created_at, '%d-%m-%Y') as created")
        )
            ->whereIn('service_logs.project_id', $projectsIds)
            ->whereIn('service_logs.service_id', $servicesIds)
            ->whereBetween('service_logs.created_at', [$from, $to])
            ->orderBy('service_logs.created_at', 'asc')
            ->groupBy(DB::raw("DATE_FORMAT(service_logs.created_at,'$type')" . $grpby))
            ->get();

        if (!$result->isEmpty()) {
            $created_atd = [];
            $created_atd = array_unique(array_column($result->toArray(), 'created_atd'));
            $d = [];
            foreach ($created_atd as $key => $val) {
                $a = [$val];
                foreach ($servicesData as $k => $ival) {
                    $a[$k + 1] = 0;
                }
                foreach ($result->toArray() as $key2 => $val2) {
                    if ($val2['created_atd'] == $val) {
                        foreach ($servicesData as $key3 => $item) {
                            if ($val2['service_id'] == $item['id']) {
                                $a[$key3 + 1] = $val2['counts'] ? $val2['counts'] : 0;
                            }
                        }
                    }
                }

                $d[$key] = $a;
            }
        }

        if (isset($d)) {
            array_unshift($serviceNames, 'Time');
            $result_Data = $d;
            array_unshift($result_Data, $serviceNames);
            return response()->json([
                'all_services' => (!$services->isEmpty()) ? $services->collect() : [],
                'report' => $result_Data,
                'project_id' => $projectsIds,
                'service_id' => $servicesIds
            ], 200);
        } else {
            return response()->json([
                'all_services' => (!$services->isEmpty()) ? $services->collect() : [],
                'report' => [],
                'project_id' => $projectsIds,
                'service_id' => $servicesIds
            ], 200);
        }
    }

    /**
     * getReportInitialParam($param) for get report options
     * @param $request param in not required
     * 
     */
    public function getReportInitialParam(Request $request)
    {

        $user = $request->user();
        $projects = Project::select('id', 'name')->where('user_id', $user->id)->get();

        $services = Service::select('id', 'name')->get();

        return response()->Json([
            "all_projects" => (!$projects->isEmpty()) ? $projects->collect() : [],
            "all_services" => (!$services->isEmpty()) ? $services->collect() : [],
        ], 200);
    }
}
