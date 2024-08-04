<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\PatientResource;
use App\Http\Resources\PatientCollection;
use App\Jobs\SendPatientRegisteredEmail;
//use App\Jobs\SendPatientRegisteredSms;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new PatientCollection(Patient::all());
    }

    /**
     * Display a specific resource.
     * 
     * @param \App\Models\Patient $patient
     * @return \Illuminate\Http\Response
     */
    public function show(Patient $patient)
    {
        return new PatientResource($patient);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:patients|max:50',
            'email' => 'required|unique:patients|email',
            'address' => 'required|max:255',
            'phone_number' => 'required|max:20',
            'password' => 'required|min:8',
            'image' => 'required|image|mimes:jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 400);
        }

        $patientData = $validator->validated();
        $patientData['image_route'] = $request->file('image')->store('public');

        try {
            $patient = Patient::create($patientData);

            SendPatientRegisteredEmail::dispatch($patient);
            //SendPatientRegisteredSms::dispatch($patient);

            return response()->json([
                'message' => 'Patient created successfully.',
                'patient' => new PatientResource($patient),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred while creating the patient.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
