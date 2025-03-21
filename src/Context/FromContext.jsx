import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const FromContext = createContext() 

export const FromProvider = ({children}) => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/truck`)
        setItems(response.data)
        setLoading(false)
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    };

  const fetchUsers = async () =>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`)
      setUsers(response.data)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  const validateToken = async () =>{
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/me`, {
          headers: {Authorization: `Bearer ${token}`} 
        });
        setCurrentUser(response.data)
      } catch (error) {
        console.error('Token invalido o expirado', error);
        logout();
      }
    }
  }

  fetchUsers();
  fetchItems();
  validateToken();
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        correo: email,
        contraseña: password,
      });
      const {user, token} = response.data;
      setCurrentUser(user)
      localStorage.setItem('token', token);
      return {success: true}
    } catch (error) {
      return {success: false, message: error.response?.data?.message || 'Error al iniciar sesion'}
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token')
  }

  const register = async (nombre, apellido, correo, contraseña) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
      {nombre, apellido, correo, contraseña});
    if (response.status === 201) {
      setUsers((prevUsers) => [...prevUsers, response.data.user]);
      return {success: true, message: response.data.message};
    }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al registrar el usuario.' };
    }
  };
  

  return (
    <FromContext.Provider value ={{ items, users, currentUser, loading, error, register, login, logout, }}>
        {children}
    </FromContext.Provider>

  );
};

export const useFromContext = () => {
  return useContext(FromContext);
};
