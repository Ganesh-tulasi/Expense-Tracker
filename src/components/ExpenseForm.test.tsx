import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseForm } from './ExpenseForm';
import { supabase } from '../lib/supabase';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

// Mock supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}));

describe('ExpenseForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<ExpenseForm onExpenseAdded={() => {}} />);
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    const onExpenseAdded = vi.fn();
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

    // Mock user
    (supabase.auth.getUser as Mock).mockResolvedValue({ data: { user: { id: 'user-123' } } });
    (supabase.from as Mock).mockImplementation(fromMock);

    render(<ExpenseForm onExpenseAdded={onExpenseAdded} />);

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Expense' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Expense/i }));

    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith('expenses');
      expect(insertMock).toHaveBeenCalledWith([expect.objectContaining({
        amount: 100,
        description: 'Test Expense',
        user_id: 'user-123'
      })]);
      expect(onExpenseAdded).toHaveBeenCalled();
    });
  });
});
