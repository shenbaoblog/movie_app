import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Container,
    Fab,
    Grid,
    Modal,
    Rating,
    TextareaAutosize,
    Tooltip,
    Typography,
} from '@mui/material'
import axios from 'axios'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import { useAuth } from '@/hooks/auth'

const Detail = ({ detail, media_type, media_id }) => {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    const [editMode, setEditMode] = useState(null)
    const [editedRating, setEditedRating] = useState(null)
    const [editedContent, setEditedContent] = useState('')

    const { user } = useAuth({middleware: 'auth'})

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleReviewChange = e => {
        setReview(e.target.value)
    }

    const handleRatingChange = (e, newValue) => {
        setRating(newValue)
    }

    const isButtonDisabled = (rating, content) => {
        return !rating || !content.trim()
    }

    const isReviewButtonDisabled = isButtonDisabled(rating, review)
    const isEditButtonDisabled = isButtonDisabled(editedRating, editedContent)

    const handleReviewAdd = async () => {
        handleClose()
        try {
            const response = await laravelAxios.post(
                `/api/reviews`,
                {
                    content: review,
                    rating,
                    media_type,
                    media_id,
                },
            )
            // console.log('response', response.data)
            const newReview = response.data
            setReviews([...reviews, newReview])
            console.log('reviews', reviews)

            setReview('')
            setRating(0)

            // レビューの平均値を再計算
            const updatedReviews = [...reviews, newReview] // NOTE: stateで管理している値は、実際の値とずれすので定数に格納
            updateAverageRating(updatedReviews)

        } catch (err) {
            console.log(err)
        }
    }

    const updateAverageRating = (updatedReviews) => {
        if(updatedReviews.length > 0) {
            const totalRating = updatedReviews.reduce((acc, review) => acc + review.rating, 0)
            const average = (totalRating / updatedReviews.length).toFixed(1)
            setAverageRating(average)
            console.log('average', average)
        } else {
            setAverageRating(null)
        }
    }

    const handleDelete = async (id) => {
        console.log('id', id)
        if (window.confirm('レビューを削除してもよろしいですか？')) {
            try {
                const response = await laravelAxios.delete(`/api/review/${id}`)
                console.log('response', response)
                const filteredReviews = reviews.filter(review => review.id !== id)
                setReviews(filteredReviews)
                updateAverageRating(filteredReviews)
            } catch (err) {
                console.log(err)
            }
        }
    }

    // 編集ボタンを押されたときの処理
    const handleEdit = (review) => {
        setEditMode(review.id)
        setEditedRating(review.rating)
        setEditedContent(review.content)
    }

    // 編集確定ボタンを押したときの処理
    const handleConfirmEdit = async (reviewId) => {
        console.log('reviewId', reviewId)
        try {
            const response = await laravelAxios.put(`/api/review/${reviewId}`, {
                content: editedContent,
                rating: editedRating,
            })
            console.log('updatedResponse', response)

            const updatedReview = response.data
            const updatedReviews = reviews.map((review) => {
                if (review.id === reviewId) {
                    return {
                        ...review,
                        content: updatedReview.content,
                        rating: updatedReview.rating,
                    }
                }
                return review
            })
            setReviews(updatedReviews)
            updateAverageRating(updatedReviews)
            setEditMode(null)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await laravelAxios.get(
                    `/api/reviews/${media_type}/${media_id}`,
                )
                console.log('reviews', response.data)
                const fetchReviews = response.data
                setReviews(fetchReviews)
                updateAverageRating(fetchReviews)
            } catch (err) {
                console.log(err)
            }
        }
        fetchReviews()
    }, [media_type, media_id])
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail
                </h2>
            }>
            <Head>
                <title>Laravel - Detail</title>
            </Head>
            {/* 作品情報 */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 'auto', md: '70vh' },
                    bgcolor: 'red',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                />
                <Container sx={{ zIndex: 1 }}>
                    <Grid
                        sx={{ color: 'white' }}
                        container
                        alignItems={'center'}>
                        <Grid item md={4} xs={12}>
                            <img
                                width={'70%'}
                                src={`https://image.tmdb.org/t/p/original${detail.poster_path}`}
                                alt=""
                            />
                        </Grid>
                        <Grid item md={8}>
                            <Typography variant="h4" paragraph>
                                {detail.title || detail.name}
                            </Typography>
                            <Typography paragraph>{detail.overview}</Typography>
                            <Box
                                gap={2}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <Rating
                                    readOnly
                                    precision={0.5}
                                    value={parseFloat(averageRating)}
                                    emptyIcon={<StarIcon style={{ color: "white" }} />}
                                />
                                <Typography
                                    sx={{
                                        ml: 1,
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                    }}
                                >{averageRating}</Typography>
                            </Box>
                            <Typography variant="h6">
                                {media_type == 'movie'
                                    ? `公開日:${detail.release_date}`
                                    : `初回放送日:${detail.first_air_date}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* レビュー一覧 */}
            <Container sx={{ py: 4 }}>
                <Typography
                    component={'h1'}
                    variant="h4"
                    align="center"
                    gutterBottom>
                    レビュー一覧
                </Typography>
                <Grid container spacing={3}>
                    {reviews.map(review => (
                        <Grid item key={review.id} xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    {/* ユーザー名 */}
                                    <Typography
                                        variant="h6"
                                        component={'h6'}
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>
                                    {editMode === review.id ? (
                                        <>
                                        {/* 編集ボタンを押されたレビューの見た目 */}
                                            <Rating value={editedRating} onChange={(e, newValue) => setEditedRating(newValue)} />
                                            <TextareaAutosize
                                                minRows={3}
                                                style={{width: "100%"}}
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                             />
                                        </>
                                    ) : (
                                        <>
                                            {/* 星 */}
                                            <Rating value={review.rating} readOnly />
                                            {/* レビュー内容 */}
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                paragraph>
                                                {review.content}
                                            </Typography>
                                        </>
                                    )}
                                    {user?.id === review.user.id && (
                                        <Grid
                                            sx={{display: 'flex', justifyContent: 'flex-end'}}
                                        >
                                            {editMode === review.id ? (
                                                // 編集中の表示
                                                <Button
                                                    onClick={() => handleConfirmEdit(review.id)}
                                                    disabled={isEditButtonDisabled}
                                                >編集確定</Button>
                                            ) : (
                                                <ButtonGroup>
                                                    <Button onClick={() => handleEdit(review)}>編集</Button>
                                                    <Button color="error" onClick={() => handleDelete(review.id)}>削除</Button>
                                                </ButtonGroup>
                                            )}
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* レビュー追加ボタン */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 5,
                }}>
                <Tooltip title="レビュー追加">
                    <Fab
                        style={{ background: '#1976d2', color: 'white' }}
                        onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>
            {/* モーダルウィンドウ */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <Typography variant="h6" component="h2">
                        レビューを書く
                    </Typography>
                    <Rating
                        required
                        onChange={handleRatingChange}
                        value={rating}
                    />
                    <TextareaAutosize
                        required
                        minRows={5}
                        placeholder="レビュー内容"
                        style={{ width: '100%', marginTop: '10px' }}
                        onChange={handleReviewChange}
                        value={review}
                    />
                    <Button
                        variant="outlined"
                        disabled={isReviewButtonDisabled}
                        onClick={handleReviewAdd}>
                        送信
                    </Button>
                </Box>
            </Modal>
        </AppLayout>
    )
}

// SSR
export async function getServerSideProps(context) {
    const { media_type, media_id } = context.params
    try {
        const jpResponse = await axios.get(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
        )

        let combinedData = { ...jpResponse.data }

        if (!jpResponse.data.overview) {
            const enResponse = await axios.get(
                `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
            )
            combinedData.overview = enResponse.data.overview
        }

        const fetchData = combinedData

        return {
            props: { detail: fetchData, media_type, media_id },
        }
    } catch (err) {
        console.log(err)
        return { notFound: true }
    }
}
export default Detail
