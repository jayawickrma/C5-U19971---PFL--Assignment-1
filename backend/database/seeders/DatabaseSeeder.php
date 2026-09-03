// database/seeders/DatabaseSeeder.php
public function run(): void
{
    $user = User::factory()->create([
        'name' => 'Demo User',
        'email' => 'demo@example.com',
        'password' => bcrypt('password'),
    ]);

    Expense::factory()->count(25)->for($user)->create();
}
