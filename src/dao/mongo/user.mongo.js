import User from './models/user.model.js';

class UserDao {
    async createUser(userData) {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            throw new Error('Error creating user: ${ error.message }');
        }
    }

    async getUserById(userId) {
        try {
            return await User.findById(userId).populate('cart');
        } catch (error) {
            throw new Error('Error fetching user by ID: ${ error.message }');
        }
    }

    async updateUser(userId, updateData) {
        try {
            return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        } catch (error) {
            throw new Error('Error updating user: ${ error.message }');
        }
    }

    async deleteUser(userId) {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (error) {
            throw new Error('Error deleting user: ${ error.message }');
        }
    }

    async getUsersPaginated(page = 1, limit = 10) {
        try {
            return await User.paginate({}, { page, limit });
        } catch (error) {
            throw new Error('Error fetching paginated users: ${ error.message }');
        }
    }

    async getUserByEmail(email) {
        try {
            return await User.findOne({ email }).populate('cart');
        } catch (error) {
            throw new Error('Error fetching user by email: ${ error.message }');
        }
    }
}

export default new UserDao();