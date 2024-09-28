import { createSlice } from '@reduxjs/toolkit';

export const todoSlice = createSlice({
    name: 'locations',
    initialState: {
        items: [],
    },
    reducers: {
        addTodo: (state, action) => {
            state.items.push(action.payload);
        },
        removeTodo: (state, action) => {
            console.log('Removing todo with id:', action.payload);
            state.items = state.items.filter(todo => todo.id !== action.payload);
        },

    },
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
