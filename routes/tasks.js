'use strict';

const Joi = require('joi');
const db = require('../db');
const decodeToken = require('../utils/token').decodeToken;

const taskSchema = Joi.object({
    id_user: Joi.number().required(),
    task : Joi.string().required(),
    is_done: Joi.boolean().required(),
    date: Joi.date(),
    time: Joi.string()
});

const getTasks = {
    method: 'GET',
    path: '/task',
    handler : async (request, h) => {
        const {rows} = await db.query('SELECT id,id_user,task,is_done,date,time FROM tasks');
        return rows;
    },
};

const getOneTask = {
    method: 'GET',
    path: '/task/{id}',
    handler : async (request, h) => {
        const id = request.params.id;
        const {rows} = await db.query(`SELECT id,id_user,task,is_done,date,time FROM tasks WHERE id=${id}`);
        return rows;
    }
}

const getTasksByUserId = {
    method: 'GET',
    path: '/mytasks',
    options: {
        auth: 'jwt',
        pre: [
            { assign:'decodedToken', method: decodeToken }
        ],    
        handler: async (request, h) => {
            
            const {decodedToken} = request.pre;
            const id = decodedToken.id;
            const {rows} = await db.query(`SELECT id,id_user,task,is_done FROM tasks WHERE id_user='${id}'`);
            return rows;
            
        }
    },
}

const createTask = {
    method: 'POST',
    path: '/task',
    handler : async (request, h) => {
        const task = request.payload;
        await db.query(`INSERT INTO tasks(id_user, task, is_done, date, time) 
        VALUES ('${task.id_user}','${task.task}','${task.is_done}','${task.date}','${task.time}')`);
        return task;
    },
};

const deleteTask = {
    method: 'DELETE',
    path: '/task/{id}',
    handler : async (request, h) => {
        const id = request.params.id;
        await db.query(`DELETE FROM tasks WHERE id=${id}`);
        return 'Task deleted !';
    },
};

// DELETE ALL TASKS FROM ONE USER
const deleteUserTasks = {
    method: 'DELETE',
    path: '/users-tasks/{id}',
    handler : async (request, h) => {
        const id = request.params.id;
        await db.query(`DELETE FROM tasks WHERE id_user=${id}`);
        return 'Tasks deleted !';
    },
}

module.exports = [getTasks,getOneTask,getTasksByUserId,createTask,deleteTask,deleteUserTasks];