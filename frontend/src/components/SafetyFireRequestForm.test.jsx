import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SafetyFireRequestForm from '../components/SafetyFireRequestForm';
import * as ApiService from '../services/apiService';

// Mock API service
jest.mock('../services/apiService');

describe('SafetyFireRequestForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form title', () => {
    render(<SafetyFireRequestForm />);
    expect(screen.getByText('SAFETY FIRE REQUEST FORM')).toBeInTheDocument();
  });

  test('renders coverage type selector', () => {
    render(<SafetyFireRequestForm />);
    const select = screen.getByDisplayValue('Select Type');
    expect(select).toBeInTheDocument();
  });

  test('renders personnel number input', () => {
    render(<SafetyFireRequestForm />);
    const input = screen.getByPlaceholderText('Enter Personnel Number');
    expect(input).toBeInTheDocument();
  });

  test('updates personnel number on input change', () => {
    render(<SafetyFireRequestForm />);
    const input = screen.getByPlaceholderText('Enter Personnel Number');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input.value).toBe('123456');
  });

  test('updates coverage type on select change', () => {
    render(<SafetyFireRequestForm />);
    const select = screen.getByDisplayValue('Select Type');
    fireEvent.change(select, { target: { value: 'integration' } });
    expect(select.value).toBe('integration');
  });

  test('renders declaration checkbox', () => {
    render(<SafetyFireRequestForm />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  test('shows error when submitting without declaration', async () => {
    render(<SafetyFireRequestForm />);
    const submitBtn = screen.getByText('SEND TO HEAD, SFEED');
    
    // Fill required fields but don't check declaration
    const personnelInput = screen.getByPlaceholderText('Enter Personnel Number');
    const coverageSelect = screen.getByDisplayValue('Select Type');
    
    fireEvent.change(personnelInput, { target: { value: '123456' } });
    fireEvent.change(coverageSelect, { target: { value: 'integration' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/must accept the safety declaration/i)).toBeInTheDocument();
    });
  });

  test('submits form when all required fields are filled', async () => {
    const mockResponse = { requestId: 1 };
    ApiService.createRequest.mockResolvedValue(mockResponse);

    render(<SafetyFireRequestForm />);

    const personnelInput = screen.getByPlaceholderText('Enter Personnel Number');
    const coverageSelect = screen.getByDisplayValue('Select Type');
    const checkbox = screen.getByRole('checkbox');
    const submitBtn = screen.getByText('SEND TO HEAD, SFEED');

    fireEvent.change(personnelInput, { target: { value: '123456' } });
    fireEvent.change(coverageSelect, { target: { value: 'integration' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(ApiService.createRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          personnelNumber: '123456',
          safetyCoverage: 'integration',
        })
      );
    });
  });

  test('displays success message after submission', async () => {
    const mockResponse = { requestId: 1 };
    ApiService.createRequest.mockResolvedValue(mockResponse);

    render(<SafetyFireRequestForm />);

    const personnelInput = screen.getByPlaceholderText('Enter Personnel Number');
    const coverageSelect = screen.getByDisplayValue('Select Type');
    const checkbox = screen.getByRole('checkbox');
    const submitBtn = screen.getByText('SEND TO HEAD, SFEED');

    fireEvent.change(personnelInput, { target: { value: '123456' } });
    fireEvent.change(coverageSelect, { target: { value: 'integration' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Request submitted successfully/i)).toBeInTheDocument();
    });
  });

  test('resets form after successful submission', async () => {
    const mockResponse = { requestId: 1 };
    ApiService.createRequest.mockResolvedValue(mockResponse);

    render(<SafetyFireRequestForm />);

    const personnelInput = screen.getByPlaceholderText('Enter Personnel Number');
    const coverageSelect = screen.getByDisplayValue('Select Type');
    const checkbox = screen.getByRole('checkbox');
    const submitBtn = screen.getByText('SEND TO HEAD, SFEED');

    fireEvent.change(personnelInput, { target: { value: '123456' } });
    fireEvent.change(coverageSelect, { target: { value: 'integration' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(personnelInput.value).toBe('');
      expect(coverageSelect.value).toBe('');
      expect(checkbox.checked).toBe(false);
    });
  });
});
