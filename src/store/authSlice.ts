import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../server/firebase';
import { Account, Device } from 'types';

export interface AuthState {
    isLoggedIn: boolean;
    user: Account | null;
    device: Device | null;
    error: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    device: null,
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

            // Kiểm tra trong collection "users"
            const usersRef = collection(firestore, 'users');
            const usersQuery = query(
                usersRef,
                where('username', '==', username),
                where('password', '==', password),
            );
            const usersQuerySnapshot = await getDocs(usersQuery);

            if (!usersQuerySnapshot.empty) {
                // Người dùng tồn tại trong collection "users"
                const userDoc = usersQuerySnapshot.docs[0];
                const user = { id: userDoc.id, ...userDoc.data() } as Account; // Thêm thuộc tính id vào đối tượng user


                return { user };
            } else {
                // Kiểm tra trong collection "devices"
                const devicesRef = collection(firestore, 'devices');
                const devicesQuery = query(
                    devicesRef,
                    where('username', '==', username),
                    where('password', '==', password),
                );
                const devicesQuerySnapshot = await getDocs(devicesQuery);

                if (!devicesQuerySnapshot.empty) {
                    // Thiết bị tồn tại trong collection "devices"
                    const deviceDoc = devicesQuerySnapshot.docs[0];
                    const device = { id: deviceDoc.id, ...deviceDoc.data() } as Device; // Tạo đối tượng device


                    return { device };
                } else {
                    throw new Error('Sai mật khẩu hoặc tên đăng nhập');
                }
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
            state.device = null;
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
                state.user = action.payload.user!;
                state.device = action.payload.device!;
                state.error = null;
            })
            .addCase(login.rejected, (state, action: PayloadAction<string>) => {
                state.isLoggedIn = false;
                state.user = null;
                state.error = action.payload!;
            })
            .addCase(setLoading, (state, action: PayloadAction<boolean>) => {
                state.loading = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
