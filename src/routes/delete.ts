import express, {Request, Response} from 'express';
import {Order} from "../models/order";
import {NotAuthorizedError, NotFoundError, requireAuth} from "@tktbitch/common";

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req:Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError('Unauthorized');
    }
    await Order.deleteOne(order);
    res.send(204)
})

export {router as deleteOrderRouter}
