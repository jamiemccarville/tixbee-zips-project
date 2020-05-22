<?php

namespace App\Http\Controllers;

use App\Zip;
use Auth;
use DB;
use Illuminate\Http\Request;

class ZipsController extends Controller
{
    public function create(Request $request)
    {
        $zip = new Zip();
        $zip->zip = $request->zip;
        $zip->order = $request->order;
        $zip->user = Auth::id();
        $zip->save();
    }

    public function counts()
    {
        $zips = DB::table('zips')->select('zip', DB::raw('count(*) as total'))->groupBy('zip')->orderBy('total', 'DESC')->where('user', Auth::id())->get();

        return response()->json($zips);
    }

    public function total()
    {
        return response()->json(\App\Zip::where('user', Auth::id())->count());
    }

    public function dates(Request $request)
    {
        $firstDate = $request->input('firstDate');
        $secondDate = $request->input('secondDate');

        $selected = Zip::whereBetween('created_at', [$firstDate.' 00:00:00', $secondDate.' 23:59:59'])->get();

        return response($selected);
    }
}