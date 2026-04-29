"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attention_controller_1 = require("../controllers/attention.controller");
const router = (0, express_1.Router)();
// Routes for managing Attention items
router.post('/attention', attention_controller_1.createAttention); // Create
router.get('/attention', attention_controller_1.getAllAttention); // Get all Attention
router.put('/attention/:id', attention_controller_1.updateAttention); // Update
router.delete('/attention/:id', attention_controller_1.deleteAttention); // Delete
exports.default = router;
