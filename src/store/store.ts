import { configureStore, Store } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './authSlice';

export interface RootState {
    auth: AuthState;
    // Định nghĩa các reducer khác và kiểu dữ liệu tương ứng
}

const store: Store<RootState> = configureStore({
    reducer: {
        auth: authReducer,
        // Thêm các reducer khác vào đây
    },
});

export default store;
