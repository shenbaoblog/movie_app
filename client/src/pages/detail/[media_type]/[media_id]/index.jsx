import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'
import {
    Box,
    Button,
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

const Detail = ({ detail, media_type, media_id }) => {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [reviews, setReviews] = useState([])

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

    const isDisabled = !rating || !review.trim()

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
                setReviews(response.data)
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
            {/* 映画情報 */}
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
                            <Typography variant="h6">
                                {media_type == 'movie'
                                    ? `公開日:${detail.release_date}`
                                    : `初回放送日:${detail.first_air_date}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* レビュー内容 */}
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
                                    <Typography
                                        variant="h6"
                                        component={'h6'}
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>
                                    <Rating value={review.rating} readOnly />
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        paragraph>
                                        {review.content}
                                    </Typography>
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
                        disabled={isDisabled}
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
