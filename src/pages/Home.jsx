import React, { useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'

import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, fetchTags } from '../redux/slices/posts'

export const Home = () => {
    const dispatch = useDispatch()
    const { posts, tags } = useSelector((state) => state.posts)
    const userData = useSelector((state) => state.auth.data)

    const isPostLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'

    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
    }, [])

    console.log(posts)

    return (
        <>
            <Tabs
                style={{ marginBottom: 15 }}
                value={0}
                aria-label="basic tabs example"
            >
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostLoading ? [...Array(5)] : posts.items).map(
                        (obj, index) =>
                            isPostLoading ? (
                                <Post key={index} isLoading={true} />
                            ) : (
                                <Post
                                    id={obj.id}
                                    title={obj.title}
                                    imageUrl={
                                        obj.imageUrl
                                            ? `http://locahost:4444${obj.imageUrl}`
                                            : ''
                                    }
                                    user={{
                                        avatarUrl:
                                            'https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png',
                                        fullName: obj.user,
                                    }}
                                    createdAt={obj.createdAt}
                                    viewsCount={150}
                                    commentsCount={3}
                                    tags={obj.tags}
                                    isEditable={userData?._id === obj.user._id}
                                />
                            )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock
                        items={['react', 'typescript', 'заметки']}
                        isLoading={isTagsLoading}
                    />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'Вася Пупкин',
                                    avatarUrl:
                                        'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Иван Иванов',
                                    avatarUrl:
                                        'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    )
}
