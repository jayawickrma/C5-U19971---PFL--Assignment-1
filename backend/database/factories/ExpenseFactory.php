<?php

namespace Database\Factories;

use App\Enums\ExpenseType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'cost' => fake()->randomFloat(2, 100, 25000),
            'description' => fake()->sentence(4),
            'expense_type' => fake()->randomElement(ExpenseType::cases())->value,
        ];
    }
}
