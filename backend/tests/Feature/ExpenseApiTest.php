<?php

use App\Models\Expense;
use App\Models\User;

it('lets an authenticated user create an expense', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->postJson('/api/expenses', [
        'date' => '2026-08-01',
        'cost' => 1500.50,
        'description' => 'Taxi to airport',
        'expense_type' => 'travel',
    ]);

    $response->assertCreated()->assertJsonPath('data.expense_type', 'travel');
    $this->assertDatabaseHas('expenses', ['description' => 'Taxi to airport']);
});

it('prevents a user viewing another user\'s expense', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $expense = Expense::factory()->for($owner)->create();

    $this->actingAs($intruder, 'sanctum')
        ->getJson("/api/expenses/{$expense->id}")
        ->assertForbidden();
});

it('lists only the authenticated user\'s expenses', function () {
    $user = User::factory()->has(Expense::factory()->count(3))->create();
    User::factory()->has(Expense::factory()->count(2))->create(); // other user

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/expenses')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});
