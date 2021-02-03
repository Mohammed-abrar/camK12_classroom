import { fireEvent, render, screen } from '@testing-library/react';
import { Classroom } from './classroom';

import React from 'react';

test('renders classroom', () => {
    render(<Classroom />);
    const linkElement = screen.getByText(/classroom/i);
    expect(linkElement).toBeInTheDocument();
});



describe('Classroom', () => {
    it('click on teacher click event', () => {

        const { getByText } = render(<Classroom />)
      
        const node = getByText("Teacher");
        fireEvent.click(node);
    });

    it('click on student click event', () => {

        const { getByText } = render(<Classroom />)
      
        const node = getByText("Student");
        fireEvent.click(node);
    });
});