import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { db } from '../server/firebase';

interface Item {
    id: string;
    name: string;
}

interface ItemsState {
    items: Item[];
    loading: boolean;
    error: string | null;
}

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: null,
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        fetchItemsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchItemsSuccess: (state, action: PayloadAction<Item[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchItemsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        addItemSuccess: (state, action: PayloadAction<Item>) => {
            state.items.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        updateItemSuccess: (state, action: PayloadAction<Item>) => {
            const { id, name } = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item) {
                item.name = name;
            }
            state.loading = false;
            state.error = null;
        },
        deleteItemSuccess: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload,
            );
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    fetchItemsStart,
    fetchItemsSuccess,
    fetchItemsFailure,
    addItemSuccess,
    updateItemSuccess,
    deleteItemSuccess,
} = itemsSlice.actions;

export const fetchItems = (): AppThunk => async (dispatch) => {
    try {
        dispatch(fetchItemsStart());
        const snapshot = await db.collection('items').get();
        const items: Item[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
        }));
        dispatch(fetchItemsSuccess(items));
    } catch (error: any) {
        dispatch(fetchItemsFailure(error.message));
    }
};

export const addItem =
    (name: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(fetchItemsStart());
            const docRef = await db.collection('items').add({ name });
            const newItem: Item = { id: docRef.id, name };
            dispatch(addItemSuccess(newItem));
        } catch (error: any) {
            dispatch(fetchItemsFailure(error.message));
        }
    };

export const updateItem =
    (item: Item): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(fetchItemsStart());
            await db
                .collection('items')
                .doc(item.id)
                .update({ name: item.name });
            dispatch(updateItemSuccess(item));
        } catch (error: any) {
            dispatch(fetchItemsFailure(error.message));
        }
    };

export const deleteItem =
    (itemId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(fetchItemsStart());
            await db.collection('items').doc(itemId).delete();
            dispatch(deleteItemSuccess(itemId));
        } catch (error: any) {
            dispatch(fetchItemsFailure(error.message));
        }
    };

export default itemsSlice.reducer;
