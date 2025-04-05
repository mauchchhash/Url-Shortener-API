import ShortUrl, { IShortUrl } from "../database/models/ShortUrlModel";
import BaseRepository from "./BaseRepository";

class ShortUrlRepository extends BaseRepository<IShortUrl> {
  constructor() {
    super(ShortUrl);
  }
}

export default ShortUrlRepository;
