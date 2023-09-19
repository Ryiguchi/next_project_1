import { render, screen } from '@testing-library/react';
import HomePage from '../pages';
import '@testing-library/jest-dom';

const products = [
  { id: 'p1', title: 'Product 1', description: 'This is product 1' },
  { id: 'p2', title: 'Product 2', description: 'This is product 2' },
  { id: 'p3', title: 'Product 3', description: 'This is product 3' },
];

describe('Homepage', () => {
  it('Renders a list of the products', () => {
    render(<HomePage products={products} />);

    const list = screen.getByRole('link', {
      name: /Product 1/i,
    });

    expect(list).toBeInTheDocument();
  });
});
