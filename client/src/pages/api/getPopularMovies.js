import axios from 'axios'

const handler = async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
        );
        res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'エラーが発生しました'});
    }
};

export default handler