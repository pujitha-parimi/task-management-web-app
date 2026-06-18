// api.js – Plain JS fetch wrapper (no axios, no React)
const API_URL = 'http://127.0.0.1:8000/api/';

async function request(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(API_URL + endpoint, options);

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    try { err.responseData = await res.json(); } catch (_) {}
    throw err;
  }

  // 204 No Content (delete) has no body
  if (res.status === 204) return null;
  return res.json();
}

// Auth
function registerUser(data)        { return request('register/', 'POST', data); }
function loginUser(data)           { return request('token/', 'POST', data); }

// Profile
function getProfile(token)         { return request('profile/', 'GET', null, token); }

// Tasks
function getTasks(token)           { return request('tasks/', 'GET', null, token); }
function createTask(token, data)   { return request('tasks/', 'POST', data, token); }
function updateTask(token, id, data) { return request(`tasks/${id}/`, 'PUT', data, token); }
function deleteTask(token, id)     { return request(`tasks/${id}/`, 'DELETE', null, token); }
