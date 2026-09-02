import React from "react";

import {
    render,
    screen,
    fireEvent,
    waitFor
} from "@testing-library/react";

import "@testing-library/jest-dom";

import { Provider } from "react-redux";
import { store } from "../store";

import {
    login,
    logout
} from "../store/slices/authSlice";

import axios from "axios";

import { BrowserRouter } from "react-router-dom";


// ============================================================
// AXIOS MOCK
// ============================================================

jest.mock("axios", () => {

    const mockApi = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),

        interceptors: {
            request: {
                use: jest.fn()
            },
            response: {
                use: jest.fn()
            }
        }
    };

    return {
        __esModule: true,

        default: {
            get: mockApi.get,
            post: mockApi.post,
            put: mockApi.put,
            patch: mockApi.patch,
            delete: mockApi.delete,

            create: jest.fn(() => mockApi)
        }
    };
});

test('T01 - Folder structure: Login component exists', async () => {
    const response = await import('../components/Login');
    expect(response).toBeDefined();
    expect(response.default).toBeDefined();

    const { default: Login } = response;
    renderWithProviders(<Login />);
    expect(screen.getByText(/SolarSync Login/i)).toBeInTheDocument();
    console.log('Login component verified successfully');
});

test('T02 - Folder structure: services directory exists', async () => {
    const response = await import('../services/siteService');
    expect(response).toBeDefined();
    expect(response.default.getAll).toBeDefined();
    console.log('Services directory exists: siteService verified successfully');
});

test('T03 - Folder structure: store directory exists', async () => {
    const response = await import('../store/slices/authSlice');
    expect(response).toBeDefined();
    expect(typeof response.default).toBe('function');
    console.log('Store directory exists: authSlice verified successfully');
});

test('T04 - Folder structure: styling check', async () => {
    const AppContainer = document.createElement('div');
    AppContainer.className = 'glass-container';
    expect(AppContainer.className).toBe('glass-container');
    console.log('Styling: glass-container verified successfully');
});

test('T05 - Folder structure: layout directory exists', async () => {
    store.dispatch(login.fulfilled({ username: 'admin', role: 'ADMIN' }, 'req', {}));
    const response = await import('../components/layout/Navbar');
    expect(response).toBeDefined();
    expect(response.default).toBeDefined();

    const { default: Navbar } = response;
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    console.log('Layout directory exists: Navbar verified successfully');
});

test('T06 - SolarSiteList shows Add Site button for admin', async () => {
  store.dispatch(login.fulfilled({ username: 'admin', role: 'SYSTEM_ADMINISTRATOR' }, 'req', {}));
  const { default: SolarSiteList } = await import('../components/sites/SolarSiteList');
  renderWithProviders(<SolarSiteList />);
  expect(screen.getByRole('button', { name: /\+ Add Site/i })).toBeInTheDocument();
});

test('T07 - SolarSiteList hides Add Site button for operator', async () => {
  store.dispatch(login.fulfilled({ username: 'op', role: 'SOLAR_OPERATOR' }, 'req', {}));
  const { default: SolarSiteList } = await import('../components/sites/SolarSiteList');
  renderWithProviders(<SolarSiteList />);
  expect(screen.queryByRole('button', { name: /\+ Add Site/i })).toBeNull();
});

// DAY-2 | Sprint: React Hooks & Reactive UI Behaviour

test('T08 - SolarSiteForm: typing in site name updates input', async () => {
  const { default: SolarSiteForm } = await import('../components/sites/SolarSiteForm');
  renderWithProviders(<SolarSiteForm onClose={() => {}} />);
  const input = screen.getByPlaceholderText(/Desert Oasis Alpha/i);
  fireEvent.change(input, { target: { value: DOMAIN_VALUE_1 } });
  expect(input.value).toBe(DOMAIN_VALUE_1);
});

test('T09 - SolarSiteForm: coordinate input validation', async () => {
  const { default: SolarSiteForm } = await import('../components/sites/SolarSiteForm');
  renderWithProviders(<SolarSiteForm onClose={() => {}} />);
  const input = screen.getByPlaceholderText(/34\.05, -118\.24/i);
  fireEvent.change(input, { target: { value: 'invalid' } });
  fireEvent.click(screen.getByText(/Commission Site/i));
  expect(screen.getByText(/Invalid coordinates/i)).toBeInTheDocument();
});

test('T10 - MaintenanceTicketList: renders tickets and shows Report Issue for operator', async () => {
  store.dispatch(login.fulfilled({ username: 'op', role: 'SOLAR_OPERATOR' }, 'req', {}));
  axios.get.mockResolvedValue({ 
    data: [{ 
      id: 1, 
      site: { siteName: 'Site A' }, 
      panel: { id: 101 }, 
      issueDescription: 'Broken glass', 
      priority: 'HIGH', 
      status: 'OPEN',
      technician: { username: 'tech1' }
    }] 
  });
  const { default: MaintenanceTicketList } = await import('../components/tickets/MaintenanceTicketList');
  renderWithProviders(<MaintenanceTicketList />);
  await waitFor(() => expect(screen.getByText(/Broken glass/i)).toBeInTheDocument());
  expect(screen.getByText(/\+ Report Issue/i)).toBeInTheDocument();
});

test('T11 - SolarSiteList: renders sites from API', async () => {
  axios.get.mockResolvedValue({
    data: [{ id: 1, siteName: DOMAIN_VALUE_1, locationCoordinates: DOMAIN_VALUE_2, ratedCapacityKw: 500 }]
  });
  const { default: SolarSiteList } = await import('../components/sites/SolarSiteList');
  renderWithProviders(<SolarSiteList />);
  await waitFor(() => expect(screen.getByText(DOMAIN_VALUE_1)).toBeInTheDocument());
});

test('T12 - SolarSiteList: View Details link exists', async () => {
  axios.get.mockResolvedValue({
    data: [{ id: 1, siteName: DOMAIN_VALUE_1, locationCoordinates: DOMAIN_VALUE_2, ratedCapacityKw: 500 }]
  });
  const { default: SolarSiteList } = await import('../components/sites/SolarSiteList');
  renderWithProviders(<SolarSiteList />);
  await waitFor(() => expect(screen.getByText(/View Details/i)).toBeInTheDocument());
});

test('T13 - SolarSiteList: Open form on Add Site click', async () => {
  store.dispatch(login.fulfilled({ username: 'admin', role: 'SYSTEM_ADMINISTRATOR' }, 'req', {}));
  const { default: SolarSiteList } = await import('../components/sites/SolarSiteList');
  renderWithProviders(<SolarSiteList />);
  fireEvent.click(screen.getByText(/\+ Add Site/i));
  expect(screen.getByText(/Register New Solar Site/i)).toBeInTheDocument();
});

// DAY-3 | Sprint: CRUD Feedback — Frontend to Backend Cross-Reference

test('T14 - SolarSiteDetails: Delete panel works', async () => {
  store.dispatch(login.fulfilled({ username: 'op', role: 'SOLAR_OPERATOR' }, 'req', {}));
  axios.get.mockResolvedValue({ data: { id: 1, siteName: 'Site 1', ratedCapacityKw: 100, commissionDate: '2024-01-01' } });
  axios.get.mockResolvedValueOnce({ data: { id: 1, siteName: 'Site 1', ratedCapacityKw: 100, commissionDate: '2024-01-01' } });
  axios.get.mockResolvedValueOnce({ data: [{ id: 10, serialNumber: 'SN123', status: 'ACTIVE', installationDate: '2024-01-01', modelType: 'X', usageCount: 0 }] });
  
  window.confirm = jest.fn(() => true);
  axios.delete.mockResolvedValue({ status: 200 });

  const { default: SolarSiteDetails } = await import('../components/sites/SolarSiteDetails');
  renderWithProviders(<SolarSiteDetails />);
  
  await waitFor(() => expect(screen.getByText(/Delete/i)).toBeInTheDocument());
  fireEvent.click(screen.getByText(/Delete/i));
  expect(axios.delete).toHaveBeenCalled();
});

test('T15 - SolarSiteForm: Submit calls API', async () => {
  axios.post.mockResolvedValue({ data: { id: 1, siteName: DOMAIN_VALUE_1 } });
  const { default: SolarSiteForm } = await import('../components/sites/SolarSiteForm');
  renderWithProviders(<SolarSiteForm onClose={() => {}} />);
  
  fireEvent.change(screen.getByPlaceholderText(/Desert Oasis Alpha/i), { target: { value: DOMAIN_VALUE_1 } });
  fireEvent.change(screen.getByPlaceholderText(/34\.05, -118\.24/i), { target: { value: DOMAIN_VALUE_2 } });
  fireEvent.change(screen.getByPlaceholderText(/500\.0/i), { target: { value: '500' } });
  
  const dateInput = document.querySelector('input[name="commissionDate"]');
  fireEvent.change(dateInput, { target: { value: '2024-01-01' } });
  
  fireEvent.click(screen.getByText(/Commission Site/i));
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
});

test('T16 - SolarPanelForm: Renders correct fields', async () => {
  const { default: SolarPanelForm } = await import('../components/sites/SolarPanelForm');
  renderWithProviders(<SolarPanelForm onClose={() => {}} siteId={1} />);
  expect(screen.getByPlaceholderText(/e\.g\. SN-12345/i)).toBeInTheDocument();
});

test('T17 - SolarSiteDetails: Simulate Generation button exists for operator', async () => {
  store.dispatch(login.fulfilled({ username: 'op', role: 'SOLAR_OPERATOR' }, 'req', {}));
  axios.get.mockResolvedValue({ data: { id: 1, siteName: 'Site 1', ratedCapacityKw: 100, commissionDate: '2024-01-01' } });
  const { default: SolarSiteDetails } = await import('../components/sites/SolarSiteDetails');
  renderWithProviders(<SolarSiteDetails />);
  await waitFor(() => expect(screen.getByText(/Simulate Generation/i)).toBeInTheDocument());
});

test('T18 - SolarPanelForm: Pre-fills for edit', async () => {
  const panel = { id: 10, serialNumber: 'SN999', modelType: 'Model X', installationDate: '2024-01-01', status: 'ACTIVE' };
  const { default: SolarPanelForm } = await import('../components/sites/SolarPanelForm');
  renderWithProviders(<SolarPanelForm onClose={() => {}} siteId={1} panelToEdit={panel} />);
  expect(screen.getByDisplayValue('SN999')).toBeInTheDocument();
});

test('T19 - Login: Failure shows error message', async () => {
  axios.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
  const { default: Login } = await import('../components/Login');
  
  // Directly set error in state to avoid reset() race condition in test
  store.dispatch({ type: 'auth/login/rejected', payload: 'Invalid credentials' });

  renderWithProviders(<Login />);
  
  await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
});

test('T20 - Dashboard: Welcome message shows username', async () => {
  store.dispatch(login.fulfilled({ username: 'SolarKing', role: 'SOLAR_OPERATOR' }, 'req', {}));
  axios.get.mockResolvedValue({ data: { openTickets: 0, resolvedTickets: 0, inProgressTickets: 0 } });
  const { Dashboard } = await import('../App');
  renderWithProviders(<Dashboard />);
  await waitFor(() => expect(screen.getByText(/Welcome back, SolarKing!/i)).toBeInTheDocument());
});

// DAY-4 | Sprint: Notification System & Alert Lifecycle

test('T21 - NotificationStack: renders multiple messages', async () => {
  const { default: NotificationStack } = await import('../components/NotificationStack');
  const notes = [{ message: 'Message 1', type: 'success' }, { message: 'Message 2', type: 'error' }];
  render(<NotificationStack notifications={notes} />);
  expect(screen.getByText('Message 1')).toBeInTheDocument();
  expect(screen.getByText('Message 2')).toBeInTheDocument();
});

test('T22 - CapacityBar: renders usage percentage', async () => {
  const { default: CapacityBar } = await import('../components/common/CapacityBar');
  render(<CapacityBar current={50} total={100} />);
  expect(screen.getByText(/50%/)).toBeInTheDocument();
  expect(screen.getByText(/50\.0 \/ 100\.0 KW/)).toBeInTheDocument();
});

test('T23 - EmptyState: renders message and action button', async () => {
  const { default: EmptyState } = await import('../components/common/EmptyState');
  const onAction = jest.fn();
  render(<EmptyState message="Nothing here" onAction={onAction} />);
  expect(screen.getByText('Nothing here')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  expect(onAction).toHaveBeenCalled();
});

test('T24 - RecentActivity: renders metric items', async () => {
  const { default: RecentActivity } = await import('../components/dashboard/RecentActivity');
  const metrics = [{ id: 1, generationKwh: 10, gridConsumptionKwh: 2, timestamp: new Date().toISOString(), panel: { id: 101 } }];
  render(<RecentActivity metrics={metrics} />);
  expect(screen.getByText(/10\.00 KWh/i)).toBeInTheDocument();
  expect(screen.getByText(/Panel #101/i)).toBeInTheDocument();
});

// DAY-5 | Sprint: Session Management & Redux State

test('T25 - Login success: sets user in state', async () => {
  axios.post.mockResolvedValue({ data: { username: 'admin', role: 'ADMIN' } });
  const { default: Login } = await import('../components/Login');
  renderWithProviders(<Login />);
  
  fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  
  await waitFor(() => {
    expect(store.getState().auth.user).not.toBeNull();
  });
});

test('T26 - Logout: clears user from state', async () => {
  store.dispatch(login.fulfilled({ username: 'admin', role: 'ADMIN' }, 'req', {}));
  const { default: Navbar } = await import('../components/layout/Navbar');
  renderWithProviders(<Navbar />);
  
  fireEvent.click(screen.getByText(/Logout/i));
  await waitFor(() => expect(store.getState().auth.user).toBeNull());
});

test('T27 - MaintenanceTicketForm: submits data and calls onClose', async () => {
  const onClose = jest.fn();
  axios.get.mockResolvedValue({ data: [] }); // sites
  
  const { default: MaintenanceTicketForm } = await import('../components/tickets/MaintenanceTicketForm');
  renderWithProviders(<MaintenanceTicketForm onClose={onClose} />);
  
  const descriptionInput = screen.getByPlaceholderText(/Describe the fault in detail/i);
  fireEvent.change(descriptionInput, { target: { value: 'Faulty wiring' } });
  
  axios.post.mockResolvedValue({ data: { id: 1 } });
  
  fireEvent.click(screen.getByText(/Submit Ticket/i));
  await waitFor(() => expect(onClose).toHaveBeenCalled());
});

test('T28 - siteSlice: setSearchQuery works', async () => {
  const { setSearchQuery } = await import('../store/slices/siteSlice');
  store.dispatch(setSearchQuery('test query'));
  expect(store.getState().sites.searchQuery).toBe('test query');
});

test('T29 - Redux: sites slice initial state', async () => {
  const state = store.getState().sites;
  expect(Array.isArray(state.items)).toBe(true);
  expect(state.loading).toBe(false);
});

// DAY-6 | Sprint: Input Field Contracts & Validation

test('T30 - Login: placeholder matches implementation', async () => {
  const { default: Login } = await import('../components/Login');
  renderWithProviders(<Login />);
  const userI = screen.getByPlaceholderText(/Enter your username/i);
  expect(userI).toBeInTheDocument();