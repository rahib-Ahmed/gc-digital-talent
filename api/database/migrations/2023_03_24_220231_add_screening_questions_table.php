<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('screening_questions', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->uuid('pool_id');
            $table->foreign("pool_id")->references("id")->on("pools");
            $table->integer('sort_order')->nullable()->default(null);
            $table->jsonb('question');
            $table->timestamps();
        });

        DB::statement('ALTER TABLE screening_questions ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screening_questions');
    }
};
