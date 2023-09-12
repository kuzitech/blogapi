"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const index_1 = tslib_1.__importDefault(require("../../index"));
const utils_1 = require("../utils");
const token = (0, utils_1.generateTestToken)();
describe('POST /api/blogs', () => {
    it('should add a new blog post', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const newBlog = { title: 'New Blog', content: 'This is a new blog post.' };
        const response = yield (0, supertest_1.default)(index_1.default)
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog);
        expect(response.status).toBe(201);
    }));
    it('should return validation errors if required fields are missing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const invalidBlog = { title: '', content: '' };
        const response = yield (0, supertest_1.default)(index_1.default)
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidBlog);
        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            field: 'title',
            message: 'Title is required',
        });
        expect(response.body.errors).toContainEqual({
            field: 'content',
            message: 'Content is required',
        });
    }));
});
describe('PUT /api/blogs/:id', () => {
    it('should edit an existing blog post', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const updatedBlog = {
            title: 'Updated Blog',
            content: 'This is the updated content.',
        };
        const response = yield (0, supertest_1.default)(index_1.default)
            .post('/api/blogs/2')
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedBlog.title);
        expect(response.body.content).toBe(updatedBlog.content);
    }));
    it('should return validation errors if fields are invalid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const invalidBlog = { title: '', content: 'Updated content' };
        const response = yield (0, supertest_1.default)(index_1.default)
            .put('/api/blogs/4')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidBlog);
        expect(response.status).toBe(200);
        expect(response.body.errors).toContainEqual({
            field: 'title',
            message: 'Title is required',
        });
    }));
    it('should return 404 if blog post not found', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .put('/api/blogs/999')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'New Title' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Blog post not found');
    }));
});
describe('DELETE /api/blogs/:id', () => {
    it('should delete an existing blog post', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .delete('/api/blogs/5')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Blog post deleted successfully');
    }));
    it('should return 404 if blog post not found', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .delete('/api/blogs/999')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Blog post not found');
    }));
});
//# sourceMappingURL=index.test.js.map