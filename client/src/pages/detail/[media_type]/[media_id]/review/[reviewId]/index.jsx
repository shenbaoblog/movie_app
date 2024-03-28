import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const ReviewDetail = () => {

  const router = useRouter()
  const { reviewId } = router.query
  console.log(reviewId)

  useEffect(() => {
    if(!reviewId) return
    const fetchReviewDetail = async () => {
      try {
        const response = await laravelAxios.get(`api/review/${reviewId}`)
      } catch (err) {
        console.log(err)
      }
    }
    fetchReviewDetail()
  },[reviewId])

  return (
    <AppLayout
    header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            ReviewDetail
        </h2>
    }>
      <Head>
          <title>Laravel - ReviewDetail</title>
      </Head>
      <div>レビュー内容</div>
    </AppLayout>
  )
}

export default ReviewDetail