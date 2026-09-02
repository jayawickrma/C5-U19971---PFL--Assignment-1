<?php

namespace App\Enums;

enum ExpenseType: string
{
    case Travel = 'travel';
    case Food = 'food';
    case Other = 'other';

    public function label(): string
    {
        return match($this) {
            self::Travel => 'Travel',
            self::Food => 'Food',
            self::Other => 'Other',
        };
    }
}
