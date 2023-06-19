import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/slices/auth'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import axios from '../../axios'

export const AddPost = () => {
    const navigate = useNavigate()
    const isAuth = useSelector(selectIsAuth)
    const [isLoading, setIsLoading] = useState()
    const [imageUrl, setImageUrl] = useState('')
    const [value, setValue] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const inputFileRef = React.useRef(null)
    const { id } = useParams()
    const isEditing = Boolean(id)

    const handleChangeFile = async (event) => {
        console.log(event.target.files)

        try {
            const formData = new FormData()
            const file = event.target.files[0]
            formData.append('image', file)
            const { data } = await axios.post('/upload', formData)
            console.log(data)
            setImageUrl(data.url)
        } catch (err) {
            console.log(err)
        }
    }

    const onClickRemoveImage = () => {
        setImageUrl('')
    }

    const onChange = React.useCallback((value) => {
        setValue(value)
    }, [])

    const onSubmit = async () => {
        try {
            setIsLoading(true)

            const fields = { title, imageUrl, tags, value }

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields)

            const _id = isEditing ? id : data._id

            navigate(`/posts/${_id}`)
        } catch (err) {
            console.log(err)
        }
    }

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    )

    React.useEffect(() => {
        if (id) {
            axios
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title)
                    setValue(data.text)
                    setImageUrl(data.imageUrl)
                    setTags(data.tags.join(','))
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }, [])

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button
                onClick={() => inputFileRef.current.click()}
                variant="outlined"
                size="large"
            >
                Загрузить превью
            </Button>
            <input
                ref={inputFileRef}
                type="file"
                onChange={handleChangeFile}
                hidden
            />
            {imageUrl && (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClickRemoveImage}
                    >
                        Удалить
                    </Button>
                    <img
                        className={styles.image}
                        src={`http://localhost:4444${imageUrl}`}
                        alt="Uploaded"
                    />
                </>
            )}

            <br />
            <br />
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder="Тэги"
                fullWidth
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <SimpleMDE
                className={styles.editor}
                value={value}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button size="large" variant="contained" onClick={onSubmit}>
                    {isEditing ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    )
}
