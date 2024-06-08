import { User } from '../repositories/user_repositories.js'
import { hashPassword, comparePassword } from '../lib/bcrypt.js';
import { generateToken } from '../lib/jwt.js';

class UserService {
    static async register(params) {
        const { name, email, password, role } = params;

        if(!name || !email || !password || !role) throw { name: 'invalidInput' }

        const existingUser = await User.findEmail(params.email);

        if (existingUser) throw { name: 'exist' }

        const encryptedPassword = await hashPassword(params.password)

        const data = {
            name: params.name,
            email: params.email,
            password: encryptedPassword,
            role: params.role
        }

        const newUser = await User.create(data);

        return newUser;
    }

    static async login(params) {
        const { email, password } = params;

        if (!email || !password) throw { name: 'invalidInput' }

        const user = await User.findEmail(email);

        if(!user) throw {name: 'invalidCredentials'}

        const compare = await comparePassword(password, user.password);

        if (!compare) throw { name: 'invalidCredentials' }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return token;
    }

    static async edit(id, params) {

        if (!id) throw { name: 'notFound' }

        const encryptedPassword = await hashPassword(params.password);

        const data = {
            name: params.name,
            email: params.email,
            password: encryptedPassword,
            role: params.role
        }

        if (!data.email || !data.name || !data.password || !data.role) throw { name: 'invalidInput' }

        const existingEmail = await User.findEmail(data.email);

        if (existingEmail) throw { name: 'exist' }

        const updateUser = await User.update(id, data);

        return updateUser;
    }

    static async delete(id) {
        if (!id) throw { name: 'notFound' }

        const data = await User.destroy(id);

        return data;
    }
}


export {
    UserService
}