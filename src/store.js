import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slice';

const store = configureStore({
    reducer: {
        locations: todoReducer,
    },
});

export default store;
