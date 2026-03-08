import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getPlaylistbytag , getSongs , toggleFavourite } from '../controllers/songController.js';

const songrouter = express.Router();

songrouter.get('/', getSongs);
songrouter.get('/playlistBytag/:tag', getPlaylistbytag);
songrouter.post('/favourite', protect, toggleFavourite);
songrouter.get("/favourites", protect, async (req, res) => {
    res.json(req.user.favourites)
});

export default songrouter;