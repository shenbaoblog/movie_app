import { Grid } from '@mui/material'
import React, { useState } from 'react'
import Comment from './Comment'
import laravelAxios from '@/lib/laravelAxios'

const CommentList = ({ comments, setComments }) => {
    const [editMode, setEditMode] = useState(null)
    const [editedContent, setEditedContent] = useState('')

    const handleDelete = async commentId => {
        try {
            const response = await laravelAxios.delete(
                `api/comments/${commentId}`,
            )

            const filteredComments = comments.filter(
                comment => comment.id !== commentId,
            )
            setComments(filteredComments)
        } catch (err) {
            console.log(err)
        }
    }

    const handleEdit = comment => {
        setEditMode(comment.id)
        setEditedContent(comment.content)
    }

    const handleConfirmEdit = async commentId => {
        try {
            const response = await laravelAxios.put(
                `api/comments/${commentId}`,
                {
                    content: editedContent,
                },
            )
            const updatedComment = response.data.content

            const updatedComments = comments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, content: updatedComment }
                }
                return comment
            })
            setComments(updatedComments)
            setEditMode(null)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Grid container spacing={3} sx={{ mt: 2 }}>
            {comments.map(comment => (
                <Grid item xs={12} key={comment.id}>
                    <Comment
                        comment={comment}
                        editMode={editMode}
                        editedContent={editedContent}
                        onDelete={handleDelete}
                        handleEdit={handleEdit}
                        handleConfirmEdit={handleConfirmEdit}
                        setEditedContent={setEditedContent}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default CommentList
