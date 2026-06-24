import api from '../../services/api';

// Users API
export const userService = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/users', { params: { page, limit, ...filters } }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  activate: (id) => api.patch(`/users/${id}/activate`),
  deactivate: (id) => api.patch(`/users/${id}/deactivate`),
  resetPassword: (id) => api.post(`/users/${id}/reset-password`),
};

// Businesses API
export const businessService = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/businesses', { params: { page, limit, ...filters } }),
  getById: (id) => api.get(`/businesses/${id}`),
  create: (data) => api.post('/businesses', data),
  update: (id, data) => api.put(`/businesses/${id}`, data),
  delete: (id) => api.delete(`/businesses/${id}`),
  changeStatus: (id, status) => api.patch(`/businesses/${id}/status`, { status }),
  toggleFeatured: (id) => api.patch(`/businesses/${id}/featured`),
  uploadImages: (id, formData) =>
    api.post(`/businesses/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  removeImage: (id, imageIndex) => api.delete(`/businesses/${id}/images/${imageIndex}`),
};

// Industries API
export const industryService = {
  getAll: () => api.get('/industries'),
  create: (formData) =>
    api.post('/industries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/industries/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/industries/${id}`),
};

// Countries API
export const countryService = {
  getAll: () => api.get('/countries'),
  create: (data) => api.post('/countries', data),
  update: (id, data) => api.put(`/countries/${id}`, data),
  delete: (id) => api.delete(`/countries/${id}`),
};

// Featured API
export const featuredService = {
  getAll: () => api.get('/featured'),
  updateOrder: (order) => api.put('/featured/order', { order }),
};

// Inquiries API
export const inquiryService = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/inquiries', { params: { page, limit, ...filters } }),
  changeStatus: (id, status) => api.patch(`/inquiries/${id}/status`, { status }),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

// Bulk API
export const bulkService = {
  getTemplate: () => api.get('/bulk/template', { responseType: 'blob' }),
  import: (formData) =>
    api.post('/bulk/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (data) => api.put('/bulk/update', data),
  delete: (ids) => api.delete('/bulk/delete', { data: { ids } }),
  activate: (ids) => api.patch('/bulk/activate', { ids }),
  deactivate: (ids) => api.patch('/bulk/deactivate', { ids }),
};

// CMS Pages API
export const pageService = {
  getAll: (page = 1, limit = 20) =>
    api.get('/pages', { params: { page, limit } }),
  getBySlug: (slug) => api.get(`/pages/${slug}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
  delete: (id) => api.delete(`/pages/${id}`),
  publish: (id) => api.patch(`/pages/${id}/publish`),
};
