import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { supabase } from './lib/supabase';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(),
      })),
    })),
  },
}));

// Mock chart components to avoid rendering complexity
vi.mock('./components/ExpenseCharts', () => ({
  ExpenseCharts: () => <div data-testid="expense-charts">Charts</div>,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in form when no session', async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({ data: { session: null } });
    (supabase.auth.onAuthStateChange as Mock).mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText(/Expenses Tracker/i)[0]).toBeInTheDocument(); // Header and form title
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      // The button text might be inside
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });
  });

  it('renders dashboard when session exists', async () => {
    const session = { user: { id: 'user-1' } };
    (supabase.auth.getSession as Mock).mockResolvedValue({ data: { session } });
    (supabase.auth.onAuthStateChange as Mock).mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    // Mock fetchExpenses
    const expenses = [{ id: '1', date: '2024-01-01', amount: 100, category: 'Food' }];
    const selectMock = vi.fn().mockReturnValue({ order: vi.fn().mockResolvedValue({ data: expenses }) });
    (supabase.from as Mock).mockReturnValue({ select: selectMock });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
      // Check if expenses are fetched
      expect(selectMock).toHaveBeenCalled();
    });
  });
});
