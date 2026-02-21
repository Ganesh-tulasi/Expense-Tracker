import { render, screen } from '@testing-library/react';
import { ExpensesList } from './ExpensesList';
import type { Expense } from '../types/database';
import { describe, it, expect } from 'vitest';

describe('ExpensesList', () => {
  const expenses: Expense[] = [
    {
      id: '1',
      user_id: 'u1',
      amount: 50.5,
      category: 'Food',
      description: 'Lunch',
      date: '2024-01-15',
      created_at: '2024-01-15T12:00:00Z',
    },
    {
      id: '2',
      user_id: 'u1',
      amount: 20,
      category: 'Transport',
      description: 'Bus',
      date: '2024-01-16',
      created_at: '2024-01-16T12:00:00Z',
    },
  ];

  it('renders a list of expenses', () => {
    render(<ExpensesList expenses={expenses} />);
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('$50.50')).toBeInTheDocument();
    expect(screen.getByText('Bus')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  it('renders correctly with empty list', () => {
    render(<ExpensesList expenses={[]} />);
    expect(screen.queryByRole('row', { name: /Lunch/i })).not.toBeInTheDocument();
  });
});
