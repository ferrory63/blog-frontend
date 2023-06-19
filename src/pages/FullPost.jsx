import React, { useEffect, useState } from 'react'

import { Post } from '../components/Post'
import { Index } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import { useParams } from 'react-router-dom'
import axios from '../axios'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

export const FullPost = () => {
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const { id } = useParams()

    useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((res) => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.warn(err)
                alert('Ошибка при получении статьи')
            })
    }, [])

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />
    }

    return (
        <>
            <Post
                id={data.id}
                title={data.title}
                imageUrl={
                    data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''
                }
                user={{
                    avatarUrl:
                        'https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png',
                    fullName: data.user,
                }}
                createdAt={data.createdAt}
                viewsCount={150}
                commentsCount={3}
                tags={data.tags}
                isFullPost
            >
                <p>{data.text}</p>
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock
                items={[
                    {
                        user: {
                            fullName: 'Вася Пупкин',
                            avatarUrl:
                                'https://mui.com/static/images/avatar/1.jpg',
                        },
                        text: 'Это тестовый комментарий 555555',
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
            >
                <Index />
            </CommentsBlock>
        </>
    )
}
