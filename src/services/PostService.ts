import { Request, Response } from "express";

import { Post } from "../models";

class PostService {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const dbPost = await Post.create(req.body);
      const post = await Post.findById(dbPost._id).populate("author", ["name"]);
      return res.status(200).json({ post });
    } catch (oof) {
      const { message } = oof;
      return res.status(500).json({ message });
    }
  }

  public async getPosts(req: Request, res: Response): Promise<Response> {
    try {
      const posts = await Post.find({}).populate("author", ["name"]);
      return res.status(200).json(posts);
    } catch (oof) {
      const { message } = oof;
      return res.status(500).json({ message });
    }
  }

  public async getPost(req: Request, res: Response): Promise<Response> {
    try {
      const post = await Post.findById(req.params.id).populate("author", [
        "name"
      ]);
      return res.status(200).json(post);
    } catch (oof) {
      const { message } = oof;
      return res.status(500).json({ message });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const postData = await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json({ postData });
    } catch (oof) {
      const { message } = oof;
      return res.status(500).json({ message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { title, content } = req.body;
      const { id } = req.params;
      const post = await Post.findByIdAndUpdate(
        id,
        {
          title,
          content
        },
        { new: true }
      );
      return res.status(200).json({ post });
    } catch (oof) {
      const { message } = oof;
      return res.status(500).json({ message });
    }
  }
}

export default new PostService();
