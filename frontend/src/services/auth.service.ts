// LIBS
import { api } from '../lib/axios';

// INTERFACES
import { DoLoginInterface } from '../interfaces/auth/do-login.interface';
import { UserRequestInterface } from '../interfaces/user-request.interface';
import { UserInterface } from '../interfaces/user/user.interface';
import { RegisterUserInterface } from '../interfaces/auth/regiser-user.interface';

export const doLogin = async (payload: DoLoginInterface) => {
    return api
        .post<UserRequestInterface>('/auth/login', payload)
        .then((res) => res.data);
};

export const registerUser = async (payload: RegisterUserInterface) => {
    return api
        .post<UserInterface>('/auth/register', payload)
        .then((res) => res.data);
};
