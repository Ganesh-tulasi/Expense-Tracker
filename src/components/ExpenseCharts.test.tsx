import { render } from '@testing-library/react';
import { ExpenseCharts } from './ExpenseCharts';
import type { Expense } from '../types/database';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock Recharts
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BarChart: ({ data, children }: { data: unknown[], children: React.ReactNode }) => (
      <div data-testid="bar-chart" data-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Pie: () => null,
    Cell: () => null,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  };
});

describe('ExpenseCharts', () => {
  const expenses: Expense[] = [
    {
      id: '1',
      user_id: 'u1',
      amount: 100,
      category: 'Food',
      description: 'Lunch',
      date: '2024-02-15', // Feb 2024
      created_at: '2024-02-15',
    },
    {
      id: '2',
      user_id: 'u1',
      amount: 200,
      category: 'Food',
      description: 'Dinner',
      date: '2024-01-15', // Jan 2024
      created_at: '2024-01-15',
    },
    {
      id: '3',
      user_id: 'u1',
      amount: 50,
      category: 'Transport',
      description: 'Bus',
      date: '2023-12-25', // Dec 2023
      created_at: '2023-12-25',
    },
  ];

  it('sorts monthly expenses chronologically', () => {
    const { getByTestId } = render(<ExpenseCharts expenses={expenses} />);
    const chart = getByTestId('bar-chart');
    const data = JSON.parse(chart.getAttribute('data-data') || '[]');

    // Expected order: Dec 2023, Jan 2024, Feb 2024
    expect(data).toHaveLength(3);

    // Check amounts
    expect(data[0].amount).toBe(50);
    expect(data[1].amount).toBe(200);
    expect(data[2].amount).toBe(100);

    // Check names (approximate to handle locale differences, but usually Month Year)
    expect(data[0].name).toMatch(/Dec.*2023/);
    expect(data[1].name).toMatch(/Jan.*2024/);
    expect(data[2].name).toMatch(/Feb.*2024/);
  });
});
