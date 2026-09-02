class Expense extends Model
{
    protected $casts = [
        'date' => 'date',
        'expense_type' => ExpenseType::class,
        'cost' => 'decimal:2',
    ];

    protected $fillable = ['date', 'cost', 'description', 'expense_type'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
