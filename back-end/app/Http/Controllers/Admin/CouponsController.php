<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Traits\CommonMethod;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CouponsController extends Controller
{
    use CommonMethod, SoftDeletes;
    const COUPON_ID = '_coupon_id';
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;

        $columns = [
            self::COUPON_ID,
            "name",
            "coupon_code",
            "coupon_type",
            "start_at",
            "amount",
            "percentage",
            DB::raw("DATE_FORMAT(start_at, '%d/%m/%Y') as start_date"),
            DB::raw("DATE_FORMAT(end_at, '%d/%m/%Y') as end_date")
        ];

        $paginator = Coupon::select($columns);

        if(!empty($request->sort_by)) {
            foreach($request->sort_by as $value) {
                $paginator->orderBy($value["id"], $value['desc'] ? "DESC" : "ASC");
            }
        }

        if(!empty($request->search)) {
             $paginator->where(function ($query) use ($columns, $request) {
                foreach ($columns as $column) {
                    $query->orWhere($column, "LIKE", "%$request->search%");
                }
            });
        }

        $paginator = $paginator->paginate($perPage, [], "PAGE", $pageNum);

        $result = collect($paginator);

        $response = [
            "data"  => $result['data'] ?? [],
            "total" => $result['total'] ?? 0
        ];

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = $this->rules($request);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $user = $request->user();

        Coupon::create([
            'admin_id'                 => $user->id,
            'name'                     => $request->name,
            'coupon_code'              => $request->couponCode,
            'coupon_type'              => $request->couponType,
            'amount'                   => $request->amount,
            'percentage'               => $request->percentage,
            'discount_up_to'           => $request->discountUpto,
            'minimum_purchase_amount'  => $request->minAmount,
            'number_of_per_person_use' => $request->usePerPerson,
            'number_of_uses'           => $request->noOfUses,
            'remaining_uses'           => $request->noOfUses,
            'start_at'                 => $request->startDate,
            'end_at'                   => $request->endDate,
            'description'              => $request->description,
        ]);

        return response()->json(['client' => $user, 'message' => 'Coupon Created Successfully.'], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $result = DB::table('coupons')
            ->where(self::COUPON_ID, $request->id)
            ->get();

        $res = [
            "data" => $result ?? []
        ];

        return response()->json($res, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $validator = $this->rules($request);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $coupon = Coupon::find($request->id);

        if(Date('Y-m-d') >= $coupon->start_at) {
            return response()->json(['error' => array('Coupon not editable')], 401);
        }

        Coupon::find($request->id)
            ->update([
                'name'                     => $request->name,
                'coupon_code'              => $request->couponCode,
                'coupon_type'              => $request->couponType,
                'amount'                   => $request->couponType == 1 ? $request->amount : null,
                'percentage'               => $request->couponType == 2 ? $request->percentage : null,
                'discount_up_to'           => $request->couponType == 2 ? $request->discountUpto : null,
                'minimum_purchase_amount'  => $request->minAmount,
                'number_of_per_person_use' => $request->usePerPerson,
                'number_of_uses'           => $request->noOfUses,
                'remaining_uses'           => $request->noOfUses,
                'start_at'                 => $request->startDate,
                'end_at'                   => $request->endDate,
                'description'              => $request->description
            ]);

        return response()->json(['message' => 'Coupon Updated Successfully.'], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $coupon = Coupon::where(self::COUPON_ID, $request->id)->get();

        if(Date('Y-m-d') >= $coupon[0]->start_at) {
            return response()->json(['error' => 'Coupon not deletable'], 401);
        }

        Coupon::where('_coupon_id', $request->id)->delete();
        return response()->json(['message' => 'Coupon Archived Successfully.'], 200);
    }

    protected function rules($request)
    {
        $required_integer = 'required|integer';

        $id = '';

        if(isset($request->id)) {
            $id = ','. $request->id;
        }

        return Validator::make($request->all(), [
            'name'         => 'required|string|max:255|unique:coupons,name' . $id,
            'couponCode'   => 'required|string|max:255|unique:coupons,coupon_code' . $id,
            'couponType'   => 'required|integer|in:1,2',
            'amount'       => 'integer',
            'percentage'   => 'integer|nullable',
            'discountUpto' => 'integer|nullable',
            'minAmount'    => 'required',
            'usePerPerson' => $required_integer,
            'noOfUses'     => $required_integer,
            'startDate'    => 'date',
            'endDate'      => 'date',
            'description'  => 'string|nullable'
        ]);
    }
}
