'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

/**
 * Criando o modelo da entidade task
 */
const taskSchema = new Schema({
    title: { type: String, trim: true, required: [true, 'Campo título é obrigatório!'] },
    description: { type: String, default: null },
    priority: { type: Number, default: 3 }, // 1 prioridade máxima, 2 média, 3 normal
    labels: { type: Array, default: [] },
    completionDate: { type: String, required: [true, 'Campo data para entrega é obrigatório!'] },
    noticeDate: { type: String, default: null },
    file: { type: String, default: null },
    isFinalized: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Task', taskSchema);