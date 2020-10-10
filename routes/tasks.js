'use strict';
const Joi = require('joi');
const db = require('../db');

const taskSchema = Joi.object({
    id_user: Joi.number().required(),
    task : Joi.string().required(),
    is_done: Joi.boolean().required(),
    date: Joi.date()
})

const getTasks = {
    method: 'GET',
    path: '/task',
    handler : async (request, h) => {
        const {rows} = await db.query('SELECT id,id_user,task,is_done,date,time FROM tasks');
        return rows;
    }
}

const createTask = {
    method: 'POST',
    path: '/task',
    handler : async (request, h) => {
        const task = request.payload;
        //console.log(task);
        db.query(`INSERT INTO tasks(id_user, task, is_done, date, time) 
        VALUES ('${task.id_user}','${task.task}','${task.is_done}',${task.date},${task.time})`);
        return task;
    }
};

module.exports = [getTasks,createTask];