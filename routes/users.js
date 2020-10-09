'use strict';

const getUsers = {
    method: 'GET',
    path: '/users',
    handler : (request,h) => {
        return 'Get users';
    },
};

const getOneUser = {
    method: 'GET',
    path: '/users/{id}',
    handler : (request, h) => {
        return 'Get one user';
    },
};

const createUser = {
    method: 'POST',
    path: '/users',
    handler : (request, h) => {
        return 'Create user';
    },
};

const updateUser = {
    method: 'PUT',
    path: '/users/{id}',
    handler : (request, h) => {
        return 'Update user';
    },
};

const deleteUser = {
    method: 'DELETE',
    path: '/users/{id}',
    handler : (request, h) => {
        return 'Delete user';
    },
};

module.exports = [getUsers, getOneUser,createUser,updateUser,deleteUser];