import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import styles from './Login.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuth, fetchRegister, selectIsAuth } from '../../redux/slices/auth'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export const Registration = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: { fullName: 'Вася пупкин', email: '', password: '' },
        mode: 'onChange',
    })

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values))

        if (!data.payload) {
            return alert('Не удалость зарегистрироваться')
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }

    if (isAuth) {
        return <Navigate to="/" />
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="Полное имя"
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    fullWidth
                    {...register('fullName', {
                        required: 'Укажите полное имя',
                    })}
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    fullWidth
                    type="email"
                    {...register('email', { required: 'Укажите почту' })}
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    fullWidth
                    type="password"
                    helperText={errors.password?.message}
                    error={Boolean(errors.password?.message)}
                    {...register('password', { required: 'Укажите пароль' })}
                />
                <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                    disabled={!isValid}
                >
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    )
}
