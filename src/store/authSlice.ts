import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../server/firebase';
import { Account } from 'types';

export interface AuthState {
    isLoggedIn: boolean;
    user: Account | null;
    error: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    error: null,
    loading: false,
};

export const login = createAsyncThunk(
    'auth/login',
    async (
        { username, password }: { username: string; password: string },
        { rejectWithValue, dispatch },
    ) => {
        try {
            dispatch(setLoading(true)); // Bắt đầu loading
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('username', '==', username), where('password', '==', password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data() as Account;
                return user;
            } else {
                throw new Error('Đăng nhập không thành công');
            }
        } catch (error: any) {
            return rejectWithValue(error.message);
        } finally {
            dispatch(setLoading(false)); // Kết thúc loading
        }
    },
);


const setLoading = createAction<boolean>('auth/setLoading');

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // @ts-ignore
        builder
            .addCase(login.pending, (state) => {
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action: PayloadAction<string>) => {
                state.isLoggedIn = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(setLoading, (state, action: PayloadAction<boolean>) => {
                state.loading = action.payload;
            });
    },
});

export const { logout } = authSlice.actions; // Chỉnh sửa dòng này

export default authSlice.reducer;
