const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const SAFETY_REQUEST_URL = `${API_BASE_URL}/api/v1/safety-requests`;
const EMPLOYEE_URL = `${API_BASE_URL}/api/v1/employees`;

class ApiService {
  static async request(url, options = {}, defaultErrorMessage = 'Request failed') {
    const response = await fetch(url, options);
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const message =
        (data && typeof data === 'object' && data.message) ||
        (typeof data === 'string' && data.trim()) ||
        `${defaultErrorMessage} (HTTP ${response.status})`;
      throw new Error(message);
    }

    return data;
  }

  // ==================== AUTHENTICATION ====================
  static login(personnelNo, password) {
    return ApiService.request(`${EMPLOYEE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personnelNo, password }),
    }, 'Failed to login');
  }

  // ==================== EMPLOYEE ENDPOINTS ====================
  static getAllEmployees() {
    return ApiService.request(`${EMPLOYEE_URL}`, {}, 'Failed to fetch employees');
  }

  static getEmployeeByPersonnelNo(personnelNo) {
    return ApiService.request(`${EMPLOYEE_URL}/${personnelNo}`, {}, 'Failed to fetch employee');
  }

  // ==================== SAFETY REQUEST ENDPOINTS ====================
  // Create new safety request
  static createRequest(requestData) {
    return ApiService.request(`${SAFETY_REQUEST_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    }, 'Failed to create request');
  }

  // Update existing request
  static updateRequest(id, requestData) {
    return ApiService.request(`${SAFETY_REQUEST_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    }, 'Failed to update request');
  }

  // Get single request
  static getRequest(id) {
    return ApiService.request(`${SAFETY_REQUEST_URL}/${id}`, {}, 'Failed to fetch request');
  }

  // Get all requests
  static getAllRequests() {
    return ApiService.request(`${SAFETY_REQUEST_URL}`, {}, 'Failed to fetch requests');
  }

  // Get requests by coverage type
  static getRequestsByCoverage(coverage) {
    return ApiService.request(`${SAFETY_REQUEST_URL}/coverage/${coverage}`, {}, 'Failed to fetch requests');
  }

  // Get requests by personnel number
  static getRequestsByPersonnelNumber(personnelNumber) {
    return ApiService.request(`${SAFETY_REQUEST_URL}/personnel/${personnelNumber}`, {}, 'Failed to fetch requests');
  }

  // Delete request
  static deleteRequest(id) {
    return ApiService.request(`${SAFETY_REQUEST_URL}/${id}`, {
      method: 'DELETE',
    }, 'Failed to delete request');
  }
}

export default ApiService;
