 import axios from 'axios';
 const getSongs = async (req, res) => {
    try {
        const response =await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=94869ef4&format=jsonpretty&limit=15`);
        const data=response.data;
        res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching songs:", error.message);
        res.status(500).json({ message: "Failed to fetch songs" });
    }
};

const getPlaylistbytag = async (req, res) => {
    try {
    const  tag  = (req.params.tag || req.query.tag || "").toString().trim();
    if(!tag){
        return res.status(400).json({ message: "Tag parameter is required" });
    }
    const limit = parseInt(req.query.limit ?? "10" , 10)||10;
    const clientId="94869ef4";
    const params ={
        client_id:clientId,
        format:"jsonpretty",
        tags:tag,
        limit,
    };
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', { params });
    const data = response.data;
    res.status(200).json(data);
    }
    catch (error) {
        console.error("getplaylistbytag error:", error?.response?.data ?? error.message ?? error);
        res.status(500).json({ message: "Failed to fetch playlist by tag" });
    }
};

const toggleFavourite = async (req, res) => {
  try {
    const user = req.user;
    const song = req.body.song;

    const exists = user.favourites.find((fav) => fav.id === song.id);

    if (exists) {
      user.favourites = user.favourites.filter((fav) => fav.id !== song.id);
    } else {
      user.favourites.push(song);
    }

    await user.save();
    return res.status(200).json(user.favourites);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: "Favourites not added, something went wrong" });
  }
};

export { getSongs, getPlaylistbytag, toggleFavourite };