import { render, screen, fireEvent } from '@testing-library/react';
import Header from './header';
import { useUser } from '@auth0/nextjs-auth0/client';
import '@testing-library/jest-dom';

jest.mock('@auth0/nextjs-auth0/client');

describe('Header Component', () => {
  it('renders login and register links when user is not authenticated', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<Header />);

    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Registrar')).toBeInTheDocument();
  });

  it('renders logout and user info when user is authenticated', () => {
    (useUser as jest.Mock).mockReturnValue({ user: { name: 'John Doe' } });

    render(<Header />);

    expect(screen.getByText('Sair')).toBeInTheDocument();
    expect(screen.getByText('Usuário: John Doe')).toBeInTheDocument();
  });

  it('calls onMouseEnter and onMouseLeave event handlers on links', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<Header />);

    const linkInicio = screen.getByText('Início');
    const linkRpa = screen.getByText('Automações');
    const linkProcessamentos = screen.getByText('Processamentos');

    fireEvent.mouseEnter(linkInicio);
    expect(linkInicio).toHaveStyle('background-color: var(--foreground)');
    expect(linkInicio).toHaveStyle('color: var(--background)');

    fireEvent.mouseLeave(linkInicio);
    expect(linkInicio).toHaveStyle('background-color: var(--background)');
    expect(linkInicio).toHaveStyle('color: var(--foreground)');
    
    fireEvent.mouseEnter(linkRpa);
    expect(linkRpa).toHaveStyle('background-color: var(--foreground)');
    expect(linkRpa).toHaveStyle('color: var(--background)');
    fireEvent.mouseLeave(linkRpa);
    expect(linkRpa).toHaveStyle('background-color: var(--background)');
    expect(linkRpa).toHaveStyle('color: var(--foreground)');
    
    fireEvent.mouseEnter(linkProcessamentos);
    expect(linkProcessamentos).toHaveStyle('background-color: var(--foreground)');
    expect(linkProcessamentos).toHaveStyle('color: var(--background)');
    fireEvent.mouseLeave(linkProcessamentos);
    expect(linkProcessamentos).toHaveStyle('background-color: var(--background)');
    expect(linkProcessamentos).toHaveStyle('color: var(--foreground)');
  });

  it('renders ThemeSwitch component', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<Header />);
    
  });
});
