import axios from 'axios'
import { useRouter } from 'next/router'
import React, { use, useEffect, useState } from 'react'

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
    return <div>search</div>
}

export default search
