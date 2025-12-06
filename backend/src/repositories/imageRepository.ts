import Image, { IImage } from "../models/Image";
import { CreateImageData } from "../types";

export class ImageRepository {
  async create(data: CreateImageData): Promise<IImage> {
    return await Image.create(data);
  }

  async findById(id: string): Promise<IImage | null> {
    return await Image.findById(id);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Image.findByIdAndDelete(id);
    return !!result;
  }
}

export default new ImageRepository();
