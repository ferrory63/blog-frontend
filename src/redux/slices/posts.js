import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios' //forgive me father

const initialState = {
    posts: { items: [], status: 'loading' },
    tags: { items: [], status: 'loading' },
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts')
    return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags')
    return data
})

export const fetchRemovePost = createAsyncThunk(
    'posts/fetchremovePost',
    async (id) => await axios.delete(`/posts/${id}`)
)

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {},
    extraReducers: {
        // Получение статей
        [fetchPosts.pending]: (state) => {
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.status = 'loaded'
            state.posts.items = action.payload
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.status = 'error'
            state.posts.items = []
        },
        // Получение тэгов
        [fetchTags.pending]: (state) => {
            state.tags.status = 'loading'
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.status = 'loaded'
            state.tags.items = action.payload
        },
        [fetchTags.rejected]: (state) => {
            state.tags.status = 'error'
            state.tags.items = []
        },
        // Удаление статьи
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(
                (obj) => obj._id !== action.meta.arg
            )
        },
    },
})

export const postsReducer = postSlice.reducer
