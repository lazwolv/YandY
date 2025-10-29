import { Request, Response } from 'express';
import { prisma } from '../config/database';

// Get all services
export const getAllServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ services });
  } catch (error) {
    throw error;
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
    return;
  } catch (error) {
    throw error;
  }
};
