"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttention = exports.updateAttention = exports.getAllAttention = exports.createAttention = void 0;
const prisma_1 = require("../lib/prisma");
// Create new Attention item
const createAttention = async (req, res) => {
    const { title, content } = req.body;
    try {
        // Kiểm tra dữ liệu đầu vào
        if (typeof title !== 'string' || typeof content !== 'string') {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const newAttention = await prisma_1.prisma.attention.create({
            data: {
                title,
                content,
            },
        });
        res.status(201).json(newAttention);
    }
    catch (error) {
        console.error(error); // In ra lỗi để dễ dàng debug
        res.status(500).json({ error: 'Something went wrong' });
    }
};
exports.createAttention = createAttention;
// Get all Attention items
const getAllAttention = async (req, res) => {
    try {
        const attentionItems = await prisma_1.prisma.attention.findMany();
        res.json(attentionItems);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
exports.getAllAttention = getAllAttention;
// Update Attention item
const updateAttention = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    // Kiểm tra kiểu dữ liệu của title và content
    if (typeof title !== 'string' || typeof content !== 'string') {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    try {
        // Kiểm tra nếu id có thể chuyển thành số hợp lệ
        const parsedId = parseInt(Array.isArray(id) ? id[0] : id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const updatedAttention = await prisma_1.prisma.attention.update({
            where: { id: parsedId },
            data: { title, content },
        });
        res.json(updatedAttention);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
exports.updateAttention = updateAttention;
// Delete Attention item
const deleteAttention = async (req, res) => {
    const { id } = req.params;
    // Kiểm tra ID hợp lệ
    const parsedId = parseInt(Array.isArray(id) ? id[0] : id);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    try {
        await prisma_1.prisma.attention.delete({
            where: { id: parsedId },
        });
        res.status(204).send(); // No content response
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
exports.deleteAttention = deleteAttention;
