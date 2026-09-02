<?php

namespace App\Http\Requests;

use App\Enums\ExpenseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'cost' => ['required', 'numeric', 'min:0'],
            'description' => ['required', 'string', 'max:255'],
            'expense_type' => ['required', Rule::enum(ExpenseType::class)],
        ];
    }
}
