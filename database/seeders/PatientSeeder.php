<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;

class PatientSeeder extends Seeder
{
    /**
     * Seed the patient table.
     * 
     * @return void
     */
    public function run()
    {
        Patient::factory()
        ->count(10)
        ->create();
    }
}