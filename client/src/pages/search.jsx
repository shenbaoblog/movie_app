import AppLayout from '@/components/Layouts/AppLayout'
import Layout from '@/components/Layouts/Layout'
import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const search = () => {
    const [results, setResults] = useState([])
    const router = useRouter()
    const { query: searchQuery } = router.query // 受け取るタイミングで、デコードされている可能性がある

    useEffect(() => {
        if (!searchQuery) return
        const fetchMedia = async () => {
            try {
                const response = await axios.get(
                    `api/searchMedia?searchQuery=${searchQuery}`,
                ) // デコードされたものがサーバー用ファイルに渡されている可能性がある
                console.log(response)
                const searchResults = response.data.results
                console.log(searchResults)
                const validResults = searchResults.filter(
                    item =>
                        item.media_type == 'movie' || item.media_type == 'tv',
                )
                console.log(validResults)
                setResults(validResults)
            } catch (err) {
                console.log(err)
            }
        }
        fetchMedia()
    }, [searchQuery])
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Search
                </h2>
            }>
            <Head>
                <title>Laravel - Search</title>
            </Head>
            <Layout sidebar={<Sidebar />}>コンテンツ</Layout>
        </AppLayout>
    )
}

export default search
