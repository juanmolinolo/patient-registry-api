<?php

namespace App\Jobs;

use App\Mail\PatientRegistered;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPatientRegisteredEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $patient;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($patient)
    {
        $this->patient = $patient;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Mail::to($this->patient['email'])->send(new PatientRegistered($this->patient['name']));
    }
}
