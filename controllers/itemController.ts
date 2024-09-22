import {Request, Response} from "express";
import prisma from "../config/prisma";

// Get all items
export const getItems = async (req: Request, res: Response) => {
  try {
    // const items = await prisma.item.findMany();
    const items = {
      id: 1,
      name: "Item 1",
      price: 100,
    };

    res.json(items);
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
};

// Create a new item
export const createItem = async (req: Request, res: Response) => {
  try {
    const {name, price} = req.body;
    const newItem = {
      name: name,
      price: price,
    };

    // const newItem = await prisma.item.create({
    //   data: {name, price},
    // });
    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error});
  }
};
