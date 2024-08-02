<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Http\Resources\PatientResource;
use App\Http\Resources\PatientCollection;
use App\Mail\PatientRegistered;

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
     * @param \App\Models\Patient
     * @return \Illuminate\Http\Response
     */
    public function show(Patient $patient)
    {
        return new PatientResource($patient);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:patients|max:50',
            'email' => 'required|email',
            'address' => 'required|max:255',
            'phone_number' => 'required|max:20',
            'password' => 'required|min:8',
            'image' => 'required|image|mimes:jpg|max:2048',
        ]);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 400);
        }

        try 
        {
            $patientData = $validator->validated();

            $patientData['image_route'] = $request->file('image')->store('patient-images', 'public');

            $patient = Patient::create($patientData);

            Mail::to($patientData['email'])->send(new PatientRegistered($patientData['name']));

            return response()->json([
                'message' => 'Patient created successfully',
                'patient' => $patient,
            ], 201);
        }
        catch (Exception $e)
        {
            return response()->json([
                'message' => 'An unexpected error occured while creating the patient.',
                'error' => $e->getMessage(),
            ], 500);
        }       
    }
}
