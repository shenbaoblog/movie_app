import axios from 'axios';
import { useRouter } from 'next/router'
import React, { use, useEffect } from 'react'

const search = () => {
    const router = useRouter();
    const {query: searchQuery} = router.query; // 受け取るタイミングで、デコードされている可能性がある

    useEffect(() => {
      if(!searchQuery) return;
      const fetchMedia = async () => {
        try {
          const response = await axios.get(`api/searchMedia?searchQuery=${searchQuery}`) // デコードされたものがサーバー用ファイルに渡されている可能性がある
          console.log(response);
        } catch(err) {
          console.log(err);
        }
      }
      fetchMedia();
    }, [searchQuery]);
  return (
    <div>search</div>
  )
}

export default search