import { Box, TextField } from '@mui/material'
import React from 'react'
import Button from './Button'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'

const SearchBar = () => {
    const [query, setQuery] = React.useState('')
    const router = useRouter()

    const handleChange = e => {
        setQuery(e.target.value)
    }

    const searchQuery = e => {
        e.preventDefault()
        if (!query.trim()) return
        router.push(`/search?query=${encodeURIComponent(query)}`)
    }
    return (
        <Box
            component={'form'}
            sx={{
                width: '80%',
                margin: '3% auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onSubmit={searchQuery}
            >
            <TextField
                fullWidth
                variant="filled"
                placeholder="検索する"
                sx={{ mr: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                onChange={handleChange}
            />
            <Button type="submit">
                <SearchIcon />
            </Button>
        </Box>
    )
}

export default SearchBar
