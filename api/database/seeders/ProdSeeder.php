<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(CmoAssetSeeder::class);
        $this->call(OperationalRequirementSeeder::class);
        $this->call(DepartmentSeeder::class);
    }
}
