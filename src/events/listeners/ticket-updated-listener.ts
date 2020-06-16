import {Message} from "node-nats-streaming";
import {AbstractListener, NotFoundError, Subjects, TicketUpdatedEvent} from "@tktbch/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends AbstractListener<TicketUpdatedEvent> {

    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const {title, price} = data;
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error('order:ticket:version:mismatch');
        }
        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }

}
